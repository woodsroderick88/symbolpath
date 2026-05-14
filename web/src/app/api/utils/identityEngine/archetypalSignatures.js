/**
 * ARCHETYPAL SIGNATURES
 *
 * Identifies symbols that have become identity-level presences — not temporary
 * weather, but enduring forces that define this person's symbolic life.
 *
 * Requirements for each confidence level:
 *   Emerging:      3+ appearances, 2+ weeks span
 *   Recurring:     5+ appearances, 3+ weeks, 2+ sources
 *   Established:   10+ appearances, 6+ weeks, 3+ sources
 *   Foundational:  20+ appearances, 12+ weeks, 4+ sources
 */

import sql from "@/app/api/utils/sql";
import {
  CONFIDENCE,
  SIG_EMERGING_MIN_COUNT,
  SIG_EMERGING_MIN_WEEKS,
  SIG_RECURRING_MIN_COUNT,
  SIG_RECURRING_MIN_WEEKS,
  SIG_RECURRING_MIN_SOURCES,
  SIG_ESTABLISHED_MIN_COUNT,
  SIG_ESTABLISHED_MIN_WEEKS,
  SIG_ESTABLISHED_MIN_SOURCES,
  SIG_FOUNDATIONAL_MIN_COUNT,
  SIG_FOUNDATIONAL_MIN_WEEKS,
  SIG_FOUNDATIONAL_MIN_SOURCES,
} from "./config";

export async function computeArchetypalSignatures(userId, archetypeMap) {
  // Get comprehensive symbol data: count, temporal spread, source diversity
  const rows = await sql(
    `SELECT
       se.symbol,
       se.stage,
       se.visual,
       COUNT(*) as total_appearances,
       COUNT(DISTINCT DATE(se.created_at)) as distinct_days,
       COUNT(DISTINCT source_type) as source_count,
       COUNT(DISTINCT DATE_TRUNC('week', se.created_at)) as distinct_weeks,
       MIN(se.created_at) as first_appearance,
       MAX(se.created_at) as last_appearance,
       EXTRACT(DAY FROM MAX(se.created_at) - MIN(se.created_at)) as span_days,
       ARRAY_AGG(DISTINCT source_type) as sources
     FROM symbol_events se
     WHERE se.user_id = $1
     GROUP BY se.symbol, se.stage, se.visual
     ORDER BY total_appearances DESC`,
    [userId],
  );

  if (rows.length === 0) return [];

  // Cross-reference with gravity data for decay persistence
  const gravityRows = await sql(
    `SELECT symbol, weight, peak_weight, anchored, first_seen, last_seen
     FROM symbol_gravity WHERE user_id = $1`,
    [userId],
  );
  const gravityMap = {};
  for (const g of gravityRows) {
    gravityMap[g.symbol] = g;
  }

  // Check gravity history for decay persistence
  const historyRows = await sql(
    `SELECT symbol, COUNT(DISTINCT week_start) as history_weeks,
            MIN(weight) as min_weight, MAX(weight) as max_weight
     FROM gravity_history WHERE user_id = $1
     GROUP BY symbol`,
    [userId],
  );
  const historyMap = {};
  for (const h of historyRows) {
    historyMap[h.symbol] = h;
  }

  const signatures = [];

  for (const row of rows) {
    const count = parseInt(row.total_appearances);
    const weeks = parseInt(row.distinct_weeks);
    const sources = parseInt(row.source_count);
    const spanDays = parseFloat(row.span_days) || 0;
    const gravity = gravityMap[row.symbol];
    const history = historyMap[row.symbol];
    const arch = archetypeMap[row.symbol] || {};

    // Determine confidence level
    let confidence;
    let score = 0;

    if (
      count >= SIG_FOUNDATIONAL_MIN_COUNT &&
      weeks >= SIG_FOUNDATIONAL_MIN_WEEKS &&
      sources >= SIG_FOUNDATIONAL_MIN_SOURCES
    ) {
      confidence = CONFIDENCE.FOUNDATIONAL;
      score = 4;
    } else if (
      count >= SIG_ESTABLISHED_MIN_COUNT &&
      weeks >= SIG_ESTABLISHED_MIN_WEEKS &&
      sources >= SIG_ESTABLISHED_MIN_SOURCES
    ) {
      confidence = CONFIDENCE.ESTABLISHED;
      score = 3;
    } else if (
      count >= SIG_RECURRING_MIN_COUNT &&
      weeks >= SIG_RECURRING_MIN_WEEKS &&
      sources >= SIG_RECURRING_MIN_SOURCES
    ) {
      confidence = CONFIDENCE.RECURRING;
      score = 2;
    } else if (
      count >= SIG_EMERGING_MIN_COUNT &&
      weeks >= SIG_EMERGING_MIN_WEEKS
    ) {
      confidence = CONFIDENCE.EMERGING;
      score = 1;
    } else {
      continue; // Below threshold — not a signature
    }

    // Boost: if gravity shows anchored or near-anchor weight
    const isAnchored = gravity?.anchored || false;
    const peakWeight = parseFloat(gravity?.peak_weight || 0);
    if (isAnchored && score < 4) score = Math.min(4, score + 1);
    if (peakWeight >= 8 && score < 3) score = Math.min(3, score + 1);

    // Recalculate confidence after boost
    if (score >= 4) confidence = CONFIDENCE.FOUNDATIONAL;
    else if (score >= 3) confidence = CONFIDENCE.ESTABLISHED;
    else if (score >= 2) confidence = CONFIDENCE.RECURRING;

    // Build contextual narrative
    const atmosphericNote = arch.atmospheric_influence
      ? ` Its atmospheric influence is ${arch.atmospheric_influence}.`
      : "";
    const durationNote = arch.typical_duration
      ? ` Typical duration: ${arch.typical_duration.split(".")[0].toLowerCase()}.`
      : "";
    const permanenceNote = arch.permanence_affinity
      ? ` ${arch.permanence_affinity.split(".")[0]}.`
      : "";

    let narrative;
    if (confidence === CONFIDENCE.FOUNDATIONAL) {
      narrative = `${row.symbol} is a foundational presence in your symbolic life. It has appeared ${count} times across ${weeks} weeks from ${sources} different sources. This is not temporary weather — it is part of who you are becoming.${atmosphericNote}`;
    } else if (confidence === CONFIDENCE.ESTABLISHED) {
      narrative = `${row.symbol} has become an established signature. ${count} appearances over ${weeks} weeks suggest this symbol carries enduring personal meaning.${atmosphericNote}${permanenceNote}`;
    } else if (confidence === CONFIDENCE.RECURRING) {
      narrative = `${row.symbol} keeps returning — ${count} times across ${weeks} weeks from ${sources} sources. A signature is forming, but it needs more time to stabilize.${durationNote}`;
    } else {
      narrative = `${row.symbol} is showing early signs of becoming a signature. ${count} appearances over ${weeks} weeks. Too early to call this identity-level, but worth watching.`;
    }

    signatures.push({
      symbol: row.symbol,
      stage: row.stage,
      visual: row.visual || "",
      confidence,
      score,
      metrics: {
        totalAppearances: count,
        distinctWeeks: weeks,
        sourceCount: sources,
        spanDays: Math.round(spanDays),
        sources: row.sources || [],
        isAnchored,
        currentWeight: parseFloat(gravity?.weight || 0),
        peakWeight,
      },
      atmosphericInfluence: arch.atmospheric_influence || null,
      coreMeaning: arch.core_meaning || null,
      narrative,
    });
  }

  // Sort by score (descending), then by appearance count
  signatures.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return b.metrics.totalAppearances - a.metrics.totalAppearances;
  });

  return signatures;
}
