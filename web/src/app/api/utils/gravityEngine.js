/**
 * SYMBOLPATH — GRAVITY ENGINE
 *
 * Implements the memory rules defined in memoryRules.js.
 * This is the only file that reads and writes symbol_gravity.
 *
 * Core operations:
 *   updateGravity(userId, symbol, stage, sourceType)
 *     Called after every symbol_events INSERT. Applies decay to the existing
 *     weight, adds the new contribution, and upserts symbol_gravity.
 *     Also writes a lazy weekly snapshot to gravity_history.
 *
 *   readGravityProfile(userId)
 *     Returns all gravity rows for a user with live decay applied on read.
 *     This catches drift when a user was inactive between updates.
 *
 *   readSymbolGravity(userId, symbol)
 *     Single-symbol variant of readGravityProfile.
 *
 * Design principle:
 *   Gravity is written EAGERLY (at event time) and read with LIVE DECAY
 *   applied at query time. This means:
 *     - Writes are fast (one upsert per event)
 *     - Reads are fresh (decay is re-applied at read time for any drift)
 *     - The stored weight is a "snapshot" that improves over time
 */

import sql from "@/app/api/utils/sql";
import {
  SOURCE_WEIGHTS,
  DEFAULT_SOURCE_WEIGHT,
  STAGE_HALF_LIFE_DAYS,
  DEFAULT_HALF_LIFE_DAYS,
  RECENCY_MULTIPLIERS,
  PERMANENCE,
  getAnchorThreshold,
  getAnchorFloor,
  computeEmotionalIntensity,
  computeNumericIntensity,
  applyDiminishingReturns,
  GRAVITY_LIMITS,
  COEXISTENCE_THRESHOLD,
} from "@/app/api/utils/memoryRules";

const LN2 = Math.LN2;

// ─────────────────────────────────────────────────────────────────────────────
// Internal math helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exponential decay factor over a given number of days.
 * Returns 1.0 at day 0, 0.5 at the half-life, approaching 0 asymptotically.
 */
function decayFactor(halfLifeDays, daysSince) {
  if (daysSince <= 0) return 1.0;
  const lambda = LN2 / halfLifeDays;
  return Math.exp(-lambda * daysSince);
}

/**
 * Recency multiplier for a contribution happening N days ago.
 * Events in the past few days contribute more than older events.
 */
function recencyMultiplier(daysSince) {
  for (const { maxDays, multiplier } of RECENCY_MULTIPLIERS) {
    if (daysSince <= maxDays) return multiplier;
  }
  return 1.0;
}

/**
 * The base gravity contribution of a single event.
 * sourceWeight × recencyMultiplier × intensityMultiplier
 */
function computeContribution(
  sourceType,
  daysSince = 0,
  intensityMultiplier = 1.0,
) {
  const w = SOURCE_WEIGHTS[sourceType] ?? DEFAULT_SOURCE_WEIGHT;
  return w * recencyMultiplier(daysSince) * intensityMultiplier;
}

/**
 * Apply decay to a stored weight given time elapsed since it was last written.
 */
function applyDecay(storedWeight, stage, daysSince) {
  const halfLife = STAGE_HALF_LIFE_DAYS[stage] ?? DEFAULT_HALF_LIFE_DAYS;
  return storedWeight * decayFactor(halfLife, daysSince);
}

/**
 * Compute days elapsed between two dates (or from a date to now).
 */
function daysBetween(dateA, dateB = new Date()) {
  return Math.max(0, (dateB - new Date(dateA)) / (1000 * 60 * 60 * 24));
}

/**
 * Get the ISO date string (YYYY-MM-DD) of the most recent Sunday (week start).
 */
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const dow = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - dow);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Gravity snapshot (weekly, lazy)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Write a weekly gravity snapshot for a symbol if one doesn't already exist
 * for this week. Non-critical — failure is swallowed silently.
 */
async function maybeSnapshotGravity(userId, symbol, currentWeight) {
  const weekStart = getWeekStart();
  try {
    await sql(
      `INSERT INTO gravity_history (user_id, symbol, weight, week_start)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, symbol, week_start) DO NOTHING`,
      [userId, symbol, currentWeight, weekStart],
    );
  } catch (err) {
    // Non-critical — gravity history is a nice-to-have, not required
    console.error("[gravityEngine] snapshot failed:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core write: updateGravity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update a symbol's gravity score after a new event is emitted.
 *
 * Algorithm:
 *   1. Fetch the existing gravity row (if any)
 *   2. Apply decay to the stored weight based on time since last_seen
 *   3. Add the new weighted contribution (sourceWeight × recency × intensity)
 *   4. Apply diminishing returns if above threshold
 *   5. Enforce gravity ceiling
 *   6. Enforce the anchor floor if the symbol is anchored
 *   7. Check if the symbol just crossed the anchor threshold
 *   8. Upsert the row into symbol_gravity
 *   9. Write a lazy weekly snapshot if needed
 *
 * @param {string} userId
 * @param {string} symbol     — e.g. "Storm"
 * @param {string} stage      — e.g. "Crisis"
 * @param {string} sourceType — e.g. "tarot_reading"
 * @param {Object} [options]
 * @param {string} [options.emotionText]      — free text for intensity detection
 * @param {number} [options.numericIntensity] — 1–10 scale (from life_events)
 * @returns {{ symbol, weight, anchored, isNewAnchor }}
 */
export async function updateGravity(
  userId,
  symbol,
  stage,
  sourceType,
  options = {},
) {
  try {
    const now = new Date();
    const uid = userId || "anonymous";

    // Compute emotional intensity multiplier
    let intensityMultiplier = 1.0;
    if (options.numericIntensity != null) {
      intensityMultiplier = computeNumericIntensity(options.numericIntensity);
    } else if (options.emotionText) {
      intensityMultiplier = computeEmotionalIntensity(options.emotionText);
    }

    // 1. Fetch existing row
    const rows = await sql(
      `SELECT id, weight, peak_weight, anchored, count, last_seen, first_seen, source_types
       FROM symbol_gravity
       WHERE user_id = $1 AND symbol = $2`,
      [uid, symbol],
    );

    const anchorThreshold = getAnchorThreshold(stage);
    let newWeight, newPeakWeight, anchored, isNewAnchor;

    if (rows.length === 0) {
      // First event for this symbol
      let contribution = computeContribution(
        sourceType,
        0,
        intensityMultiplier,
      );
      // No diminishing returns on first event, but enforce ceiling
      contribution = Math.min(contribution, GRAVITY_LIMITS.CEILING);

      newWeight = contribution;
      newPeakWeight = newWeight;
      anchored = newPeakWeight >= anchorThreshold;
      isNewAnchor = anchored;

      await sql(
        `INSERT INTO symbol_gravity
           (user_id, symbol, count, weight, peak_weight, anchored, last_seen, first_seen, source_types)
         VALUES ($1, $2, 1, $3, $4, $5, $6, $6, $7)
         ON CONFLICT (user_id, symbol) DO UPDATE SET
           weight       = EXCLUDED.weight,
           peak_weight  = EXCLUDED.peak_weight,
           anchored     = EXCLUDED.anchored,
           count        = symbol_gravity.count + 1,
           last_seen    = EXCLUDED.last_seen,
           source_types = EXCLUDED.source_types`,
        [
          uid,
          symbol,
          newWeight,
          newPeakWeight,
          anchored,
          now,
          JSON.stringify([sourceType]),
        ],
      );
    } else {
      const row = rows[0];
      const daysSince = daysBetween(row.last_seen, now);

      // 2. Decay the stored weight
      const decayedWeight = applyDecay(
        parseFloat(row.weight),
        stage,
        daysSince,
      );

      // 3. Compute raw contribution
      let contribution = computeContribution(
        sourceType,
        0,
        intensityMultiplier,
      );

      // 4. Apply diminishing returns based on current decayed weight
      contribution = applyDiminishingReturns(contribution, decayedWeight);

      // 5. Enforce anchor floor
      const anchorFloor = row.anchored
        ? getAnchorFloor(parseFloat(row.peak_weight || 0))
        : 0;

      // 6. Compute new weight with ceiling enforcement
      newWeight = Math.min(
        Math.max(decayedWeight + contribution, anchorFloor),
        GRAVITY_LIMITS.CEILING,
      );

      // 7. Update peak and anchor status
      newPeakWeight = Math.max(parseFloat(row.peak_weight || 0), newWeight);
      const wasAnchored = !!row.anchored;
      anchored = wasAnchored || newPeakWeight >= anchorThreshold;
      isNewAnchor = anchored && !wasAnchored;

      // Merge source types (track which sources have contributed)
      const existingTypes = Array.isArray(row.source_types)
        ? row.source_types
        : typeof row.source_types === "string"
          ? JSON.parse(row.source_types)
          : [];
      const updatedTypes = Array.from(new Set([...existingTypes, sourceType]));

      await sql(
        `UPDATE symbol_gravity
         SET weight       = $3,
             peak_weight  = $4,
             anchored     = $5,
             count        = count + 1,
             last_seen    = $6,
             source_types = $7
         WHERE user_id = $1 AND symbol = $2`,
        [
          uid,
          symbol,
          newWeight,
          newPeakWeight,
          anchored,
          now,
          JSON.stringify(updatedTypes),
        ],
      );
    }

    // 8. Weekly snapshot (lazy, non-blocking)
    maybeSnapshotGravity(uid, symbol, newWeight).catch(() => {});

    return {
      symbol,
      weight: newWeight,
      peakWeight: newPeakWeight,
      anchored,
      isNewAnchor: !!isNewAnchor,
    };
  } catch (err) {
    // Gravity update is non-critical — don't block event emission
    console.error("[gravityEngine] updateGravity failed:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core read: readGravityProfile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a user's full gravity profile with live decay applied.
 *
 * Why re-apply decay on read?
 *   If the user was inactive for 2 weeks, the stored weights don't reflect
 *   that elapsed time. We apply decay at read time without writing back to DB,
 *   so the UI shows fresh values without extra write load.
 *
 * @param {string} userId
 * @returns {Array<GravityRow>} sorted by liveWeight desc
 */
export async function readGravityProfile(userId) {
  const uid = userId || "anonymous";
  const now = new Date();

  const rows = await sql(
    `SELECT sg.symbol, sg.weight, sg.peak_weight, sg.anchored,
            sg.count, sg.last_seen, sg.first_seen, sg.source_types,
            sa.stage, sa.visual, sa.theme
     FROM symbol_gravity sg
     LEFT JOIN symbol_archetypes sa ON sg.symbol = sa.symbol
     WHERE sg.user_id = $1
     ORDER BY sg.weight DESC`,
    [uid],
  );

  return rows
    .map((row) => {
      const daysSince = daysBetween(row.last_seen, now);
      const stage = row.stage || "Growth";
      const decayedWeight = applyDecay(
        parseFloat(row.weight),
        stage,
        daysSince,
      );

      const anchorFloor = row.anchored
        ? getAnchorFloor(parseFloat(row.peak_weight || 0))
        : 0;
      const liveWeight = Math.max(decayedWeight, anchorFloor);

      // Determine permanence classification
      let permanenceLevel = "active";
      if (
        row.anchored &&
        parseFloat(row.peak_weight) >= PERMANENCE.HIGH_PERMANENCE_THRESHOLD
      ) {
        permanenceLevel = "deep"; // Symbol is deeply embedded in identity
      } else if (row.anchored) {
        permanenceLevel = "anchored"; // Symbol has crossed the permanence threshold
      } else if (liveWeight > 4.0) {
        permanenceLevel = "strong"; // High gravity but not yet anchored
      } else if (liveWeight > 1.5) {
        permanenceLevel = "active"; // Normal active symbol
      } else {
        permanenceLevel = "fading"; // Gravity is dropping, symbol is becoming inactive
      }

      return {
        symbol: row.symbol,
        stage: stage,
        visual: row.visual,
        theme: row.theme,
        liveWeight: Math.round(liveWeight * 100) / 100,
        storedWeight: parseFloat(row.weight),
        peakWeight: parseFloat(row.peak_weight || 0),
        anchored: !!row.anchored,
        count: row.count,
        daysSinceLastSeen: Math.round(daysSince),
        firstSeen: row.first_seen,
        lastSeen: row.last_seen,
        sourceTypes: Array.isArray(row.source_types)
          ? row.source_types
          : typeof row.source_types === "string"
            ? JSON.parse(row.source_types || "[]")
            : [],
        permanenceLevel,
      };
    })
    .sort((a, b) => b.liveWeight - a.liveWeight);
}

/**
 * Read a single symbol's gravity for a user, with live decay applied.
 */
export async function readSymbolGravity(userId, symbol) {
  const profile = await readGravityProfile(userId);
  return profile.find((r) => r.symbol === symbol) || null;
}

/**
 * Read gravity history for a user's top symbols (weekly trend data).
 *
 * @param {string} userId
 * @param {number} weeks  — how many weeks back to fetch (default: 8)
 * @returns {Object} { bySymbol: { [symbol]: [{ weekStart, weight }] } }
 */
export async function readGravityHistory(userId, weeks = 8) {
  const uid = userId || "anonymous";
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - weeks * 7);

  const rows = await sql(
    `SELECT symbol, weight, week_start
     FROM gravity_history
     WHERE user_id = $1 AND week_start >= $2
     ORDER BY symbol, week_start ASC`,
    [uid, cutoff.toISOString().split("T")[0]],
  );

  // Group by symbol
  const bySymbol = {};
  for (const row of rows) {
    if (!bySymbol[row.symbol]) bySymbol[row.symbol] = [];
    bySymbol[row.symbol].push({
      weekStart: row.week_start,
      weight: parseFloat(row.weight),
    });
  }

  return { bySymbol, weeks };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage Coexistence Analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze which stages coexist in a user's gravity profile.
 *
 * Q: "Can multiple stages coexist?"
 * A: Yes — always. A user is never purely in one stage. This function
 *    surfaces the dominant stage AND any secondary stages with significant gravity.
 *
 * @param {Array} profile — the output of readGravityProfile()
 * @returns {{
 *   dominant: { stage, totalWeight, percentage },
 *   secondary: Array<{ stage, totalWeight, percentage }>,
 *   all: Array<{ stage, totalWeight, percentage }>,
 *   coexistenceRatio: number,   // 0–1, higher = more evenly distributed
 *   isMultiStage: boolean,
 * }}
 */
export function computeStageCoexistence(profile) {
  // Sum gravity per stage
  const stageWeights = {};
  for (const sym of profile) {
    stageWeights[sym.stage] = (stageWeights[sym.stage] || 0) + sym.liveWeight;
  }

  const totalGravity = Object.values(stageWeights).reduce((s, w) => s + w, 0);
  if (totalGravity === 0) {
    return {
      dominant: null,
      secondary: [],
      all: [],
      coexistenceRatio: 0,
      isMultiStage: false,
    };
  }

  // Sort stages by weight
  const sorted = Object.entries(stageWeights)
    .map(([stage, totalWeight]) => ({
      stage,
      totalWeight: Math.round(totalWeight * 100) / 100,
      percentage: Math.round((totalWeight / totalGravity) * 100),
    }))
    .sort((a, b) => b.totalWeight - a.totalWeight);

  const dominant = sorted[0];

  // Secondary: any stage with weight >= COEXISTENCE_THRESHOLD × dominant's weight
  const threshold = dominant.totalWeight * COEXISTENCE_THRESHOLD;
  const secondary = sorted.slice(1).filter((s) => s.totalWeight >= threshold);

  // Coexistence ratio: how evenly distributed is the gravity across stages?
  // 0 = all gravity in one stage, 1 = perfectly even
  // Uses normalized entropy: -Σ(p × ln(p)) / ln(N)
  const activeStages = sorted.filter((s) => s.totalWeight > 0);
  let entropy = 0;
  for (const s of activeStages) {
    const p = s.totalWeight / totalGravity;
    if (p > 0) entropy -= p * Math.log(p);
  }
  const maxEntropy = Math.log(activeStages.length || 1);
  const coexistenceRatio =
    maxEntropy > 0 ? Math.round((entropy / maxEntropy) * 100) / 100 : 0;

  return {
    dominant,
    secondary,
    all: sorted,
    coexistenceRatio, // 0–1
    isMultiStage: secondary.length > 0,
  };
}
