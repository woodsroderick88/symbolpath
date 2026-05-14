/**
 * POST /api/symbolpath/calibration-test
 *
 * Seeds a temporary calibration dataset to test the Emotional
 * Proportionality Intelligence system under controlled conditions.
 *
 * Creates a test user "calibration-test" with:
 *   - Crisis-dominant events (>60% of total)
 *   - Mixed emotional language (resolution + destruction)
 *   - A few non-Crisis symbols for counterbalance testing
 *   - Events spread across varying time gaps
 *   - Batch-logged events (same timestamp) to test longitudinal fix
 *
 * GET /api/symbolpath/calibration-test
 *
 * Runs the reasoning engine for the calibration user and returns
 * the full result with diagnostic annotations.
 *
 * DELETE /api/symbolpath/calibration-test
 *
 * Cleans up all calibration data.
 */

import sql from "@/app/api/utils/sql";
import {
  readGravityProfile,
  computeStageCoexistence,
} from "@/app/api/utils/gravityEngine";
import { reason } from "@/app/api/utils/symbolicReasoning";
import {
  detectCycles,
  detectSequences,
} from "@/app/api/utils/longitudinalEngine";
import {
  computeShiftConfidence,
  detectRegression,
} from "@/app/api/utils/memoryRules";

const TEST_USER = "calibration-test";

// ─── SEED DATA ──────────────────────────────────────────────────────────────
// Designed to stress-test every EPI layer:
//
// 1. TEMPORAL HONESTY: ~12 days of data, 6 distinct days → "low" confidence
// 2. PROPORTIONALITY: Crisis is 65% of events → dampener should activate
// 3. SENTIMENT: Storm events carry healing language → should reduce shadow
// 4. SILENCE: Scale appears once from one source → "possible signal"
// 5. COUNTERBALANCE: Tree and River are active non-Crisis → should surface
// 6. LONGITUDINAL FIX: 3 events at same timestamp → should NOT count as cycles
// ─────────────────────────────────────────────────────────────────────────────
function buildCalibrationEvents() {
  const now = new Date();
  const d = (daysAgo, hours = 12) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, 0, 0, 0);
    return date.toISOString();
  };

  return [
    // ── DAY 0 (today): BATCH-LOGGED — 3 events at same time ──
    // These should NOT create cycle transitions in longitudinal engine
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "batch1",
      note: "Daily draw",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(0, 10),
    },
    {
      symbol: "Mirror",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "batch2",
      note: "Same session",
      visual: "🪞",
      theme: "reflection",
      created_at: d(0, 10),
    },
    {
      symbol: "Abyss",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "batch3",
      note: "Same session",
      visual: "🕳️",
      theme: "void",
      created_at: d(0, 10),
    },

    // ── DAY 1: Crisis with HEALING language ──
    // Sentiment system should detect resolution → reduce shadow score
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "life_event",
      source_id: "le1",
      note: "Hard conversation but I feel seen. Painful but necessary.",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(1, 14),
    },
    {
      symbol: "Mirror",
      stage: "Crisis",
      source_type: "dream",
      source_id: "dr1",
      note: "Saw myself clearly. Made peace with what I found.",
      visual: "🪞",
      theme: "reflection",
      created_at: d(1, 22),
    },

    // ── DAY 3: More Crisis ──
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "mood_log",
      source_id: "ml1",
      note: "Feeling shattered",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(3, 9),
    },
    {
      symbol: "Abyss",
      stage: "Crisis",
      source_type: "life_event",
      source_id: "le2",
      note: "Stuck and trapped",
      visual: "🕳️",
      theme: "void",
      created_at: d(3, 20),
    },

    // ── DAY 5: Crisis + first counterbalance signal ──
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "tr1",
      note: "Tower again",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(5, 11),
    },
    {
      symbol: "Tree",
      stage: "Growth",
      source_type: "life_event",
      source_id: "le3",
      note: "Walked in the park. Felt grounded for the first time in weeks.",
      visual: "🌳",
      theme: "resilience",
      created_at: d(5, 18),
    },

    // ── DAY 7: Mixed — Growth appearing ──
    {
      symbol: "River",
      stage: "Growth",
      source_type: "dream",
      source_id: "dr2",
      note: "Flowing water dream. Calm.",
      visual: "🏞️",
      theme: "flow",
      created_at: d(7, 3),
    },
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "tr2",
      note: "Difficult but maybe necessary",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(7, 15),
    },

    // ── DAY 9: The "possible signal" ──
    // Scale appears once from one source → should trigger emerging_signal
    {
      symbol: "Scale",
      stage: "Integration",
      source_type: "oracle",
      source_id: "or1",
      note: "Balance card",
      visual: "⚖️",
      theme: "balance",
      created_at: d(9, 10),
    },
    {
      symbol: "Mirror",
      stage: "Crisis",
      source_type: "tarot_reading",
      source_id: "tr3",
      note: "Mirror again",
      visual: "🪞",
      theme: "reflection",
      created_at: d(9, 16),
    },

    // ── DAY 11: Convergence test — Tree from multiple sources ──
    {
      symbol: "Tree",
      stage: "Growth",
      source_type: "dream",
      source_id: "dr3",
      note: "Dreamed of an old oak. Grounding.",
      visual: "🌳",
      theme: "resilience",
      created_at: d(11, 5),
    },
    {
      symbol: "Storm",
      stage: "Crisis",
      source_type: "life_event",
      source_id: "le4",
      note: "Hard but getting clearer",
      visual: "⛈️",
      theme: "upheaval",
      created_at: d(11, 19),
    },
  ];
}

// ─── POST: Seed calibration data ────────────────────────────────────────────
export async function POST(request) {
  try {
    // Clean up any existing calibration data first
    await sql(`DELETE FROM symbol_events WHERE user_id = $1`, [TEST_USER]);
    await sql(`DELETE FROM symbol_gravity WHERE user_id = $1`, [TEST_USER]);
    await sql(`DELETE FROM symbol_relationships WHERE user_id = $1`, [
      TEST_USER,
    ]);

    const events = buildCalibrationEvents();

    // Need symbol_id lookups
    const archetypes = await sql`SELECT id, symbol FROM symbol_archetypes`;
    const symbolIdMap = {};
    for (const a of archetypes) {
      symbolIdMap[a.symbol] = a.id;
    }

    // Insert events
    for (const e of events) {
      const symbolId = symbolIdMap[e.symbol] || null;

      await sql(
        `INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          TEST_USER,
          e.source_type,
          e.source_id,
          symbolId,
          e.symbol,
          e.stage,
          e.theme,
          e.visual,
          e.note,
          e.created_at,
        ],
      );
    }

    // Seed gravity data for these symbols
    const symbolWeights = {};
    for (const e of events) {
      if (!symbolWeights[e.symbol]) {
        symbolWeights[e.symbol] = {
          count: 0,
          stage: e.stage,
          visual: e.visual,
        };
      }
      symbolWeights[e.symbol].count++;
    }

    for (const [symbol, data] of Object.entries(symbolWeights)) {
      const weight = data.count * 1.3; // Approximate gravity
      await sql(
        `INSERT INTO symbol_gravity (user_id, symbol, count, weight, last_seen, peak_weight, anchored, source_types, first_seen)
         VALUES ($1, $2, $3, $4, NOW(), $5, false, '[]', NOW() - interval '12 days')
         ON CONFLICT (user_id, symbol) DO UPDATE SET
           count = EXCLUDED.count, weight = EXCLUDED.weight, last_seen = EXCLUDED.last_seen`,
        [TEST_USER, symbol, data.count, weight, weight],
      );
    }

    // Seed a few relationships for constellation detection
    await sql(
      `INSERT INTO symbol_relationships (user_id, symbol_a, symbol_b, relationship_type, strength, co_occurrence)
       VALUES ($1, 'Storm', 'Mirror', 'co_occurs', 0.8, 5),
              ($1, 'Storm', 'Abyss', 'co_occurs', 0.7, 3),
              ($1, 'Mirror', 'Abyss', 'co_occurs', 0.6, 3)
       ON CONFLICT (user_id, symbol_a, symbol_b) DO UPDATE SET
         strength = EXCLUDED.strength, co_occurrence = EXCLUDED.co_occurrence`,
      [TEST_USER],
    );

    return Response.json({
      success: true,
      userId: TEST_USER,
      eventsSeeded: events.length,
      symbolsSeeded: Object.keys(symbolWeights).length,
      stageDistribution: events.reduce((acc, e) => {
        acc[e.stage] = (acc[e.stage] || 0) + 1;
        return acc;
      }, {}),
      crisisPercentage: Math.round(
        (events.filter((e) => e.stage === "Crisis").length / events.length) *
          100,
      ),
      sentimentTestNotes: [
        "Day 1 Storm: 'I feel seen. Painful but necessary.' → expect -5 modifier",
        "Day 1 Mirror: 'Made peace with what I found.' → expect -3 modifier",
        "Day 3 Storm: 'Feeling shattered' → expect +2 modifier",
        "Day 3 Abyss: 'Stuck and trapped' → expect +3 modifier",
      ],
    });
  } catch (e) {
    console.error("[calibration seed]", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─── GET: Run reasoning engine and annotate results ─────────────────────────
export async function GET(request) {
  try {
    // Gather state for calibration user
    const [gravityProfile, recentEvents, archetypeData, symbolRelationships] =
      await Promise.all([
        readGravityProfile(TEST_USER),
        sql(
          `SELECT se.*, sa.reflection_prompts, sa.action_prompts, sa.emotion_themes
         FROM symbol_events se
         LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
         WHERE se.user_id = $1
         ORDER BY se.created_at DESC
         LIMIT 60`,
          [TEST_USER],
        ),
        sql`SELECT * FROM symbol_archetypes`,
        sql(`SELECT * FROM symbol_relationships WHERE user_id = $1`, [
          TEST_USER,
        ]),
      ]);

    if (recentEvents.length === 0) {
      return Response.json(
        {
          error:
            "No calibration data found. POST to /api/symbolpath/calibration-test first.",
        },
        { status: 404 },
      );
    }

    // Compute stage shift
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const weeklyEvents = recentEvents.filter(
      (e) => new Date(e.created_at) >= weekAgo,
    );
    const lastWeekEvents = recentEvents.filter((e) => {
      const d = new Date(e.created_at);
      return d >= twoWeeksAgo && d < weekAgo;
    });

    const weeklyStages = weeklyEvents.reduce((acc, e) => {
      acc[e.stage] = (acc[e.stage] || 0) + 1;
      return acc;
    }, {});
    const weeklyDominant =
      Object.entries(weeklyStages).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const lastWeekStages = lastWeekEvents.reduce((acc, e) => {
      acc[e.stage] = (acc[e.stage] || 0) + 1;
      return acc;
    }, {});
    const lastWeekDominant =
      Object.entries(lastWeekStages).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    let stageShift = null;
    if (
      lastWeekDominant &&
      weeklyDominant &&
      lastWeekDominant !== weeklyDominant
    ) {
      const confidence = computeShiftConfidence(
        weeklyEvents.length,
        lastWeekEvents.length,
      );
      const regression = detectRegression(lastWeekDominant, weeklyDominant);
      stageShift = {
        from: lastWeekDominant,
        to: weeklyDominant,
        confidence,
        regression,
      };
    }

    const coexistence = computeStageCoexistence(gravityProfile);

    // Run the reasoning engine
    const result = reason({
      gravityProfile,
      recentEvents,
      archetypeData,
      symbolRelationships,
      coexistence,
      stageShift,
    });

    // Run longitudinal checks
    const [cycles, sequences] = await Promise.all([
      detectCycles(TEST_USER),
      detectSequences(TEST_USER),
    ]);

    // ── CALIBRATION DIAGNOSTICS ──
    const diagnostics = {
      // 1. Temporal Honesty
      temporal: {
        ...result.temporal,
        PASS: result.temporal.confidence !== "high",
        EXPECTED: "emerging or low (12 days, 6 distinct days)",
        ACTUAL: `${result.temporal.confidence} (${result.temporal.ageDays} days, ${result.temporal.distinctDays} distinct)`,
      },

      // 2. Proportionality
      proportionality: {
        ...result.proportionality,
        stageDistributionInEvents: recentEvents.reduce((acc, e) => {
          acc[e.stage] = (acc[e.stage] || 0) + 1;
          return acc;
        }, {}),
        crisisPercentage: Math.round(
          (recentEvents.filter((e) => e.stage === "Crisis").length /
            recentEvents.length) *
            100,
        ),
        totalObservations: result.observations.length,
        crisisObservations: result.observations.filter(
          (o) =>
            o.type !== "counterbalance" &&
            o.type !== "emerging_signal" &&
            o.type !== "temporal_humility" &&
            o.type !== "silence" &&
            (o.stage === "Crisis" ||
              o.dominantStage === "Crisis" ||
              o.to === "Crisis"),
        ).length,
        DAMPEN_PASS:
          result.observations.filter(
            (o) =>
              o.type !== "counterbalance" &&
              o.type !== "emerging_signal" &&
              o.type !== "temporal_humility" &&
              o.type !== "silence" &&
              (o.stage === "Crisis" ||
                o.dominantStage === "Crisis" ||
                o.to === "Crisis"),
          ).length <= 3,
        EXPECTED:
          "≤3 Crisis observations (excluding counterbalance/silence types) out of total",
      },

      // 3. Sentiment
      sentiment: {
        stormObservation: result.observations.find(
          (o) => o.symbol === "Storm" && o.type === "shadow_growth",
        ),
        mirrorObservation: result.observations.find(
          (o) => o.symbol === "Mirror" && o.type === "shadow_growth",
        ),
        abyssObservation: result.observations.find(
          (o) => o.symbol === "Abyss" && o.type === "shadow_growth",
        ),
        PASS_STORM: (() => {
          const storm = result.observations.find(
            (o) => o.symbol === "Storm" && o.type === "shadow_growth",
          );
          if (!storm) return "SKIPPED (no Storm shadow/growth obs)";
          // Storm has mixed sentiment: "I feel seen" + "shattered" → net should be moderate
          return storm.sentimentModifier !== 0 ? true : "FAIL: modifier is 0";
        })(),
        PASS_MIRROR: (() => {
          const mirror = result.observations.find(
            (o) => o.symbol === "Mirror" && o.type === "shadow_growth",
          );
          if (!mirror) return "SKIPPED (no Mirror shadow/growth obs)";
          return mirror.sentimentModifier < 0
            ? true
            : "FAIL: expected negative modifier for healing language";
        })(),
      },

      // 4. Silence / Ambiguity
      silence: {
        hasEmergingSignal: result.observations.some(
          (o) => o.type === "emerging_signal",
        ),
        hasTemporalHumility: result.observations.some(
          (o) => o.type === "temporal_humility",
        ),
        hasSilence: result.observations.some((o) => o.type === "silence"),
        PASS: result.observations.some(
          (o) =>
            o.type === "emerging_signal" ||
            o.type === "temporal_humility" ||
            o.type === "silence",
        ),
        EXPECTED: "At least one silence/ambiguity observation",
      },

      // 5. Counterbalance
      counterbalance: {
        hasCounterbalance: result.observations.some(
          (o) => o.type === "counterbalance",
        ),
        counterbalanceData: result.observations.find(
          (o) => o.type === "counterbalance",
        ),
        PASS: result.observations.some((o) => o.type === "counterbalance"),
        EXPECTED: "Counterbalance observation present (Crisis >55%)",
      },

      // 6. Longitudinal Fix
      longitudinal: {
        cycleCount: cycles.length,
        cycles: cycles.map((c) => `${c.from}→${c.to} (${c.count}×)`),
        batchEventsExist:
          recentEvents.filter((e) => {
            const ts = new Date(e.created_at).getTime();
            return (
              recentEvents.filter(
                (e2) => Math.abs(new Date(e2.created_at).getTime() - ts) < 1000,
              ).length >= 3
            );
          }).length > 0,
        PASS: (() => {
          // Batch events at same timestamp should NOT inflate cycle counts
          // With only 16 events over 12 days and 12h min gap, cycles should be modest
          const maxCount = Math.max(...cycles.map((c) => c.count), 0);
          return maxCount <= 5;
        })(),
        EXPECTED: "No cycle count inflated by batch logging (max ≤5)",
      },
    };

    // Overall pass/fail
    const allChecks = [
      diagnostics.temporal.PASS,
      diagnostics.proportionality.DAMPEN_PASS,
      diagnostics.silence.PASS,
      diagnostics.counterbalance.PASS,
      diagnostics.longitudinal.PASS,
    ];
    const passCount = allChecks.filter((v) => v === true).length;
    const totalChecks = allChecks.length;

    return Response.json({
      calibrationResult: `${passCount}/${totalChecks} checks passed`,
      diagnostics,
      reasoning: result,
      longitudinal: { cycles, sequences },
      gravityProfile: gravityProfile.map((g) => ({
        symbol: g.symbol,
        stage: g.stage,
        weight: g.liveWeight,
        anchored: g.anchored,
      })),
    });
  } catch (e) {
    console.error("[calibration test]", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─── DELETE: Clean up ───────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    await sql(`DELETE FROM symbol_events WHERE user_id = $1`, [TEST_USER]);
    await sql(`DELETE FROM symbol_gravity WHERE user_id = $1`, [TEST_USER]);
    await sql(`DELETE FROM symbol_relationships WHERE user_id = $1`, [
      TEST_USER,
    ]);

    return Response.json({
      success: true,
      message: "Calibration data cleaned up",
    });
  } catch (e) {
    console.error("[calibration cleanup]", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
