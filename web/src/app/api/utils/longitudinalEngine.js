/**
 * SYMBOLPATH — LONGITUDINAL INTELLIGENCE ENGINE
 *
 * Phase 3: Persistent Symbolic Memory
 * Phase 4: Symbolic Intelligence
 *
 * This engine operates on LONG TIME HORIZONS — weeks, months, seasons.
 * Where the reasoning engine asks "What does this mean right now?",
 * the longitudinal engine asks:
 *
 *   "What has this person's symbolic life looked like over TIME?"
 *
 * ──────────────────────────────────────────────────────────────────
 * LONGITUDINAL OPERATIONS:
 *
 *  1. CYCLES          — Recurring stage transitions that repeat.
 *                        "You tend to enter Crisis after prolonged Growth."
 *
 *  2. SEQUENCES       — Symbol-follows-symbol patterns over months.
 *                        "Lantern consistently appears after periods of Mirror."
 *
 *  3. RHYTHMS         — Periodic oscillations in symbolic activity.
 *                        "Your symbolic field shifts toward Awakening every spring."
 *
 *  4. SUPPRESSION     — When a stage is actively avoided, and what follows.
 *                        "You tend to enter Crisis after prolonged suppression of Growth."
 *
 *  5. EMOTIONAL       — Long-term emotional climate tracking.
 *     WEATHER           "Your symbolic weather has been stormy for 3 weeks —
 *                        the longest Crisis period in your history."
 *
 *  6. MATURATION      — How symbolic vocabulary evolves over time.
 *                        "Your early symbols were mostly Crisis-stage.
 *                         Over 3 months, Growth and Integration symbols emerged."
 *
 * ──────────────────────────────────────────────────────────────────
 */

import sql from "@/app/api/utils/sql";
import { STAGE_ORDER, STAGE_RANK } from "@/app/api/utils/memoryRules";

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const CYCLE_MIN_OCCURRENCES = 2; // A→B must happen 2+ times to be a cycle
const SEQUENCE_WINDOW_DAYS = 14; // How close two symbols must appear to be "sequential"
const CYCLE_MIN_GAP_HOURS = 12; // Minimum gap between events to count as separate cycle transitions
const SEASON_NAMES = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
};
const SUPPRESSION_THRESHOLD_DAYS = 21; // Stage absent for 21+ days = potential suppression
const WEATHER_WINDOW_DAYS = 7; // Size of each weather "sample"
const MATURATION_PHASE_WEEKS = 4; // Group events into 4-week phases

// ─────────────────────────────────────────────────────────────────────────────
// 1. CYCLE DETECTION
//
// Finds recurring stage-to-stage transitions across the full event history.
// A "cycle" is a stage transition (e.g., Growth → Crisis) that has occurred
// multiple times, suggesting a structural pattern in how the person moves
// through transformation.
//
// Output: "You tend to enter Crisis after Growth (occurred 5 times)"
// ─────────────────────────────────────────────────────────────────────────────
export async function detectCycles(userId) {
  // Uses a minimum time gap (CYCLE_MIN_GAP_HOURS) between events
  // to prevent batch-logged events from creating artificial cycles.
  // Only transitions where the second event is ≥12 hours after the first count.
  const rows = await sql(
    `WITH ordered_events AS (
       SELECT stage, created_at,
              LAG(stage) OVER (ORDER BY created_at, id) AS prev_stage,
              LAG(created_at) OVER (ORDER BY created_at, id) AS prev_created_at
       FROM symbol_events
       WHERE user_id = $1
       ORDER BY created_at
     )
     SELECT prev_stage, stage AS next_stage, COUNT(*) AS transitions
     FROM ordered_events
     WHERE prev_stage IS NOT NULL
       AND prev_stage != stage
       AND EXTRACT(EPOCH FROM (created_at - prev_created_at)) >= $2
     GROUP BY prev_stage, stage
     HAVING COUNT(*) >= $3
     ORDER BY transitions DESC
     LIMIT 15`,
    [userId, CYCLE_MIN_GAP_HOURS * 3600, CYCLE_MIN_OCCURRENCES],
  );

  return rows.map((row) => {
    const from = row.prev_stage;
    const to = row.next_stage;
    const count = parseInt(row.transitions);
    const fromRank = STAGE_RANK[from] ?? 0;
    const toRank = STAGE_RANK[to] ?? 0;
    const direction =
      toRank > fromRank
        ? "ascending"
        : toRank < fromRank
          ? "descending"
          : "lateral";

    // Narrative
    let narrative;
    if (direction === "descending" && count >= 3) {
      narrative = `You have a recurring pattern of moving from ${from} back to ${to}. This has happened ${count} times — it's not random, it's structural. Something in ${from} consistently triggers a return to ${to}.`;
    } else if (direction === "ascending" && count >= 3) {
      narrative = `${from} reliably leads to ${to} in your symbolic life — ${count} times and counting. This is one of your strongest upward pathways.`;
    } else {
      narrative = `The ${from} → ${to} transition has occurred ${count} times. ${count >= 4 ? "This is becoming a defining rhythm in your transformation." : "A pattern is forming."}`;
    }

    return {
      from,
      to,
      count,
      direction,
      intensity: count >= 5 ? "dominant" : count >= 3 ? "strong" : "emerging",
      narrative,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SYMBOL SEQUENCES
//
// Finds symbols that consistently follow other symbols within a time window.
// Unlike arcs (which look at consecutive events), sequences look at
// temporal proximity — "Within 14 days of Mirror appearing, Lantern tends
// to appear too."
//
// This catches softer, slower relationships that arc detection misses.
// ─────────────────────────────────────────────────────────────────────────────
export async function detectSequences(userId) {
  // Now requires a minimum 12-hour gap between leader and follower events
  // to prevent batch-logged events from creating artificial sequences.
  const rows = await sql(
    `WITH pairs AS (
       SELECT
         a.symbol AS symbol_a,
         b.symbol AS symbol_b,
         a.stage AS stage_a,
         b.stage AS stage_b,
         a.visual AS visual_a,
         b.visual AS visual_b,
         b.created_at::date - a.created_at::date AS gap_days
       FROM symbol_events a
       JOIN symbol_events b
         ON a.user_id = b.user_id
        AND b.created_at > a.created_at
        AND EXTRACT(EPOCH FROM (b.created_at - a.created_at)) >= $2
        AND b.created_at <= a.created_at + interval '${SEQUENCE_WINDOW_DAYS} days'
        AND a.symbol != b.symbol
       WHERE a.user_id = $1
     )
     SELECT symbol_a, symbol_b, stage_a, stage_b,
            visual_a, visual_b,
            COUNT(*) AS co_occurrences,
            ROUND(AVG(gap_days), 1) AS avg_gap_days
     FROM pairs
     GROUP BY symbol_a, symbol_b, stage_a, stage_b, visual_a, visual_b
     HAVING COUNT(*) >= 3
     ORDER BY co_occurrences DESC
     LIMIT 10`,
    [userId, CYCLE_MIN_GAP_HOURS * 3600],
  );

  return rows.map((row) => {
    const count = parseInt(row.co_occurrences);
    const avgGap = parseFloat(row.avg_gap_days);

    return {
      leader: row.symbol_a,
      follower: row.symbol_b,
      leaderStage: row.stage_a,
      followerStage: row.stage_b,
      leaderVisual: row.visual_a,
      followerVisual: row.visual_b,
      occurrences: count,
      avgGapDays: avgGap,
      intensity: count >= 6 ? "dominant" : count >= 4 ? "strong" : "emerging",
      narrative: `${row.symbol_a} ${row.visual_a} consistently precedes ${row.symbol_b} ${row.visual_b} — ${count} times, with an average gap of ${avgGap} days. When ${row.symbol_a} appears, ${row.symbol_b} tends to follow within about ${Math.ceil(avgGap)} days.`,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEASONAL RHYTHMS
//
// Groups events by calendar season and detects if certain stages or symbols
// cluster in specific times of year.
//
// "Your symbolic field shifts toward Awakening every spring."
// "Crisis tends to concentrate in winter months."
// ─────────────────────────────────────────────────────────────────────────────
export async function detectSeasonalRhythms(userId) {
  const rows = await sql(
    `SELECT
       EXTRACT(MONTH FROM created_at)::int AS month_num,
       stage,
       symbol,
       COUNT(*) AS event_count
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY month_num, stage, symbol
     ORDER BY month_num, event_count DESC`,
    [userId],
  );

  if (rows.length === 0) return { seasons: {}, patterns: [] };

  // Map months to seasons
  const seasonData = {};
  for (const [season, months] of Object.entries(SEASON_NAMES)) {
    seasonData[season] = { stages: {}, symbols: {}, totalEvents: 0 };
  }

  for (const row of rows) {
    const month = row.month_num;
    const count = parseInt(row.event_count);

    for (const [season, months] of Object.entries(SEASON_NAMES)) {
      if (months.includes(month)) {
        const sd = seasonData[season];
        sd.totalEvents += count;
        sd.stages[row.stage] = (sd.stages[row.stage] || 0) + count;
        sd.symbols[row.symbol] = (sd.symbols[row.symbol] || 0) + count;
        break;
      }
    }
  }

  // Find dominant stage per season
  const patterns = [];
  for (const [season, data] of Object.entries(seasonData)) {
    if (data.totalEvents < 3) continue; // Not enough data

    const stageEntries = Object.entries(data.stages).sort(
      (a, b) => b[1] - a[1],
    );
    const dominantStage = stageEntries[0];
    if (!dominantStage) continue;

    const dominantPct = Math.round((dominantStage[1] / data.totalEvents) * 100);

    // Only flag if one stage dominates (>40% of that season's events)
    if (dominantPct >= 40) {
      const topSymbols = Object.entries(data.symbols)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([s]) => s);

      patterns.push({
        season,
        dominantStage: dominantStage[0],
        percentage: dominantPct,
        totalEvents: data.totalEvents,
        topSymbols,
        narrative: `Your symbolic field leans toward ${dominantStage[0]} during ${season} — ${dominantPct}% of ${season} events carry ${dominantStage[0]} energy. ${topSymbols.length > 0 ? `Key symbols: ${topSymbols.join(", ")}.` : ""}`,
      });
    }
  }

  return { seasons: seasonData, patterns };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUPPRESSION DETECTION
//
// When a stage that was previously active goes completely silent for an
// extended period, and then Crisis follows, that's suppression — the
// avoidance of a necessary stage leading to eruption.
//
// "You tend to enter Crisis after prolonged suppression of Growth."
// ─────────────────────────────────────────────────────────────────────────────
export async function detectSuppression(userId) {
  // Get the timeline of stage appearances with gaps
  const rows = await sql(
    `SELECT stage,
            created_at,
            LAG(created_at) OVER (PARTITION BY stage ORDER BY created_at) AS prev_same_stage,
            LEAD(stage) OVER (ORDER BY created_at, id) AS next_different_stage
     FROM symbol_events
     WHERE user_id = $1
     ORDER BY created_at`,
    [userId],
  );

  // Find gaps: periods where a stage was active, then absent for 21+ days,
  // followed by a different stage (especially Crisis)
  const suppressions = [];
  const stageGaps = {};

  for (const row of rows) {
    if (row.prev_same_stage) {
      const gapDays = Math.round(
        (new Date(row.created_at) - new Date(row.prev_same_stage)) /
          (1000 * 60 * 60 * 24),
      );

      if (gapDays >= SUPPRESSION_THRESHOLD_DAYS) {
        const key = row.stage;
        if (!stageGaps[key]) stageGaps[key] = [];
        stageGaps[key].push({
          gapDays,
          resumedAt: row.created_at,
          gapStart: row.prev_same_stage,
        });
      }
    }
  }

  // Now check: after each long absence of a stage, what stage dominated?
  for (const [suppressedStage, gaps] of Object.entries(stageGaps)) {
    for (const gap of gaps) {
      // What stages appeared DURING the suppression gap?
      const gapEvents = rows.filter((r) => {
        const d = new Date(r.created_at);
        return (
          d > new Date(gap.gapStart) &&
          d < new Date(gap.resumedAt) &&
          r.stage !== suppressedStage
        );
      });

      if (gapEvents.length < 2) continue;

      // Count stages during the gap
      const gapStages = {};
      for (const e of gapEvents) {
        gapStages[e.stage] = (gapStages[e.stage] || 0) + 1;
      }

      const dominantDuringGap = Object.entries(gapStages).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (!dominantDuringGap) continue;

      // Interesting case: Growth suppressed, followed by Crisis
      const isCrisisFollowup = dominantDuringGap[0] === "Crisis";
      const isGrowthSuppressed =
        suppressedStage === "Growth" || suppressedStage === "Integration";

      if (isCrisisFollowup && isGrowthSuppressed) {
        suppressions.push({
          suppressedStage,
          gapDays: gap.gapDays,
          followedBy: dominantDuringGap[0],
          followedByCount: dominantDuringGap[1],
          narrative: `${suppressedStage} was absent for ${gap.gapDays} days. During that silence, ${dominantDuringGap[0]} dominated with ${dominantDuringGap[1]} events. This suggests suppression — when ${suppressedStage.toLowerCase()} energy is avoided long enough, crisis can emerge from the pressure.`,
          guidance: `Pay attention when ${suppressedStage} goes quiet for extended periods. Your history suggests this silence isn't peace — it's pressure building.`,
        });
      } else if (gap.gapDays >= 30) {
        // Any extended suppression is worth noting
        suppressions.push({
          suppressedStage,
          gapDays: gap.gapDays,
          followedBy: dominantDuringGap[0],
          followedByCount: dominantDuringGap[1],
          narrative: `${suppressedStage} went quiet for ${gap.gapDays} days — one of the longest gaps in your history. During that period, ${dominantDuringGap[0]} was the dominant energy.`,
          guidance: `Extended absence of ${suppressedStage} may indicate avoidance or natural completion. Reflect on whether this stage feels resolved or deferred.`,
        });
      }
    }
  }

  // Deduplicate — keep the most significant suppression per stage
  const uniqueSuppressions = {};
  for (const s of suppressions) {
    if (
      !uniqueSuppressions[s.suppressedStage] ||
      s.gapDays > uniqueSuppressions[s.suppressedStage].gapDays
    ) {
      uniqueSuppressions[s.suppressedStage] = s;
    }
  }

  return Object.values(uniqueSuppressions);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EMOTIONAL WEATHER
//
// Tracks the overall "climate" of the symbolic field over rolling windows.
// Instead of individual observations, this gives a macro view:
//
//   "Stormy for 3 weeks" / "Clearing" / "Calm for the first time in a month"
//
// Weather is computed from stage distribution across rolling 7-day windows.
// ─────────────────────────────────────────────────────────────────────────────
export async function computeEmotionalWeather(userId, windowsToAnalyze = 8) {
  const rows = await sql(
    `SELECT stage, created_at::date AS event_date, COUNT(*) AS daily_count
     FROM symbol_events
     WHERE user_id = $1
       AND created_at >= NOW() - interval '${windowsToAnalyze * WEATHER_WINDOW_DAYS} days'
     GROUP BY stage, event_date
     ORDER BY event_date`,
    [userId],
  );

  if (rows.length === 0) return { current: null, trend: [], forecast: null };

  // Build weekly windows
  const now = new Date();
  const windows = [];
  for (let i = 0; i < windowsToAnalyze; i++) {
    const windowEnd = new Date(
      now - i * WEATHER_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );
    const windowStart = new Date(
      windowEnd - WEATHER_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    const windowEvents = rows.filter((r) => {
      const d = new Date(r.event_date);
      return d >= windowStart && d < windowEnd;
    });

    const stages = {};
    let total = 0;
    for (const e of windowEvents) {
      const c = parseInt(e.daily_count);
      stages[e.stage] = (stages[e.stage] || 0) + c;
      total += c;
    }

    const dominant = Object.entries(stages).sort((a, b) => b[1] - a[1])[0];

    windows.push({
      weekIndex: i, // 0 = current week, 1 = last week, etc.
      start: windowStart.toISOString().split("T")[0],
      end: windowEnd.toISOString().split("T")[0],
      stages,
      totalEvents: total,
      dominant: dominant
        ? {
            stage: dominant[0],
            count: dominant[1],
            percentage: total > 0 ? Math.round((dominant[1] / total) * 100) : 0,
          }
        : null,
    });
  }

  // Current weather (this week)
  const currentWindow = windows[0];
  const currentWeather = classifyWeather(currentWindow);

  // Trend: how has weather changed over windows?
  const trend = windows.map((w) => ({
    week: w.weekIndex,
    dates: `${w.start} → ${w.end}`,
    weather: classifyWeather(w),
    dominant: w.dominant?.stage || null,
    eventCount: w.totalEvents,
  }));

  // Streak: how many consecutive weeks has the current weather pattern held?
  let streak = 1;
  for (let i = 1; i < trend.length; i++) {
    if (trend[i].weather.condition === currentWeather.condition) streak++;
    else break;
  }

  // Forecast: based on the trend direction
  const forecast = computeForecast(trend);

  return {
    current: {
      ...currentWeather,
      streakWeeks: streak,
      narrative: `${currentWeather.description}${streak > 2 ? ` This ${currentWeather.condition.toLowerCase()} pattern has held for ${streak} weeks — ${streak >= 4 ? "the longest sustained period in recent history." : "becoming an established rhythm."}` : ""}`,
    },
    trend,
    forecast,
  };
}

function classifyWeather(window) {
  if (!window || window.totalEvents === 0) {
    return {
      condition: "Still",
      emoji: "🌫️",
      description:
        "Your symbolic field is quiet — no significant activity this period.",
    };
  }

  const dominant = window.dominant;
  if (!dominant)
    return {
      condition: "Mixed",
      emoji: "🌤️",
      description: "A balanced mix of energies.",
    };

  const pct = dominant.percentage;

  // Strong single-stage dominance
  if (pct >= 60) {
    const weatherMap = {
      Crisis: {
        condition: "Stormy",
        emoji: "⛈️",
        description: `Heavy ${dominant.stage.toLowerCase()} energy dominates — ${pct}% of this period's activity.`,
      },
      Awakening: {
        condition: "Dawning",
        emoji: "🌅",
        description: `Fresh ${dominant.stage.toLowerCase()} energy fills the field — ${pct}% of this period's activity.`,
      },
      Growth: {
        condition: "Growing",
        emoji: "🌿",
        description: `Strong ${dominant.stage.toLowerCase()} momentum — ${pct}% of this period's activity.`,
      },
      Integration: {
        condition: "Clearing",
        emoji: "🌈",
        description: `${dominant.stage} energy dominates — meaning is being assembled. ${pct}% of activity.`,
      },
      Mastery: {
        condition: "Radiant",
        emoji: "☀️",
        description: `${dominant.stage.toLowerCase()} energy shines through — ${pct}% of this period's activity.`,
      },
    };
    return (
      weatherMap[dominant.stage] || {
        condition: "Active",
        emoji: "✨",
        description: `${dominant.stage} is the dominant energy.`,
      }
    );
  }

  // Moderate dominance (40-60%)
  if (pct >= 40) {
    const stageCount = Object.keys(window.stages).length;
    if (stageCount >= 3) {
      return {
        condition: "Shifting",
        emoji: "🌊",
        description: `Multiple energies are active with ${dominant.stage} leading at ${pct}%. The field is in transition.`,
      };
    }
    return {
      condition: "Building",
      emoji: "🌤️",
      description: `${dominant.stage} is building but not yet dominant — ${pct}% of activity.`,
    };
  }

  // No clear dominance (<40%)
  return {
    condition: "Turbulent",
    emoji: "🌪️",
    description:
      "No single stage dominates — the symbolic field is fragmented. Multiple energies compete.",
  };
}

function computeForecast(trend) {
  if (trend.length < 3) return null;

  // Look at the last 3 windows for direction
  const recent = trend.slice(0, 3);
  const conditions = recent.map((t) => t.weather.condition);
  const stages = recent.map((t) => t.dominant).filter(Boolean);

  // If all 3 are the same condition, predict continuation
  if (conditions[0] === conditions[1] && conditions[1] === conditions[2]) {
    return {
      prediction: "continuation",
      condition: conditions[0],
      confidence: "high",
      narrative: `The ${conditions[0].toLowerCase()} pattern has been consistent for 3 weeks. Based on your history, this energy is likely to continue into next week.`,
    };
  }

  // If trending in one direction (e.g., Stormy → Shifting → Clearing)
  const stageRanks = stages.map((s) => STAGE_RANK[s] ?? 2);
  const ascending =
    stageRanks[0] > stageRanks[1] && stageRanks[1] > stageRanks[2];
  const descending =
    stageRanks[0] < stageRanks[1] && stageRanks[1] < stageRanks[2];

  if (ascending) {
    return {
      prediction: "ascending",
      confidence: "medium",
      narrative:
        "Your symbolic weather has been steadily rising. The trajectory suggests continued upward movement — but stay attentive to sudden shifts.",
    };
  }
  if (descending) {
    return {
      prediction: "descending",
      confidence: "medium",
      narrative:
        "The symbolic weather has been trending downward. This isn't necessarily negative — descending into Crisis or Awakening often precedes the deepest transformations.",
    };
  }

  return {
    prediction: "uncertain",
    confidence: "low",
    narrative:
      "The weather pattern is mixed — no clear direction has emerged. Stay present with whatever arises.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MATURATION ANALYSIS
//
// How has the person's symbolic vocabulary evolved over their entire history?
// Groups the full event timeline into phases and analyzes how stage distribution,
// symbol diversity, and complexity have changed.
//
// "Your early symbols were mostly Crisis-stage. Over 3 months, Growth and
//  Integration symbols emerged. Your symbolic vocabulary has matured."
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeMaturation(userId) {
  const rows = await sql(
    `SELECT stage, symbol, source_type, created_at
     FROM symbol_events
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId],
  );

  if (rows.length < 5) return { phases: [], maturationArc: null };

  // Divide into phases (every MATURATION_PHASE_WEEKS weeks)
  const firstDate = new Date(rows[0].created_at);
  const lastDate = new Date(rows[rows.length - 1].created_at);
  const totalDays = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24));
  const phaseLength = MATURATION_PHASE_WEEKS * 7;
  const numPhases = Math.max(1, Math.ceil(totalDays / phaseLength));

  const phases = [];
  for (let i = 0; i < numPhases; i++) {
    const phaseStart = new Date(
      firstDate.getTime() + i * phaseLength * 24 * 60 * 60 * 1000,
    );
    const phaseEnd = new Date(
      phaseStart.getTime() + phaseLength * 24 * 60 * 60 * 1000,
    );

    const phaseEvents = rows.filter((r) => {
      const d = new Date(r.created_at);
      return d >= phaseStart && d < phaseEnd;
    });

    if (phaseEvents.length === 0) continue;

    const stages = {};
    const symbols = new Set();
    const sources = new Set();
    for (const e of phaseEvents) {
      stages[e.stage] = (stages[e.stage] || 0) + 1;
      symbols.add(e.symbol);
      sources.add(e.source_type);
    }

    const dominant = Object.entries(stages).sort((a, b) => b[1] - a[1])[0];
    const stageCount = Object.keys(stages).length;

    // Complexity score: diversity of stages × diversity of symbols × source breadth
    // Normalized to 0–1 range
    const stageEntropy = computeEntropy(stages);
    const complexity = Math.min(
      1,
      stageEntropy * (symbols.size / 10) * (sources.size / 5),
    );

    phases.push({
      index: i,
      start: phaseStart.toISOString().split("T")[0],
      end: phaseEnd.toISOString().split("T")[0],
      eventCount: phaseEvents.length,
      uniqueSymbols: symbols.size,
      uniqueSources: sources.size,
      stageDistribution: stages,
      dominantStage: dominant[0],
      stageCount,
      complexity: Math.round(complexity * 100) / 100,
    });
  }

  if (phases.length < 2) return { phases, maturationArc: null };

  // Compare first and last phases
  const first = phases[0];
  const last = phases[phases.length - 1];

  const symbolGrowth = last.uniqueSymbols - first.uniqueSymbols;
  const complexityGrowth = last.complexity - first.complexity;
  const stageExpansion = last.stageCount - first.stageCount;

  let arc;
  if (complexityGrowth > 0.2 && symbolGrowth > 2) {
    arc = {
      direction: "expanding",
      narrative: `Your symbolic vocabulary has expanded significantly. Starting with ${first.uniqueSymbols} symbols (mostly ${first.dominantStage}), you now engage with ${last.uniqueSymbols} symbols across ${last.stageCount} stages. The field is becoming richer and more nuanced.`,
    };
  } else if (complexityGrowth < -0.15) {
    arc = {
      direction: "focusing",
      narrative: `Your symbolic field has become more focused over time. From a broad initial vocabulary (${first.uniqueSymbols} symbols, ${first.stageCount} stages), you've narrowed to ${last.uniqueSymbols} symbols — suggesting you've found the symbols that truly matter.`,
    };
  } else if (first.dominantStage !== last.dominantStage) {
    arc = {
      direction: "shifting",
      narrative: `Your dominant stage has shifted from ${first.dominantStage} to ${last.dominantStage}. This is the maturation arc in action — the center of gravity in your symbolic life has moved.`,
    };
  } else {
    arc = {
      direction: "steady",
      narrative: `Your symbolic field has remained relatively stable — ${last.dominantStage} continues to be the dominant energy, with ${last.uniqueSymbols} active symbols. Stability can mean groundedness or stagnation — only you know which.`,
    };
  }

  return {
    phases,
    maturationArc: {
      ...arc,
      firstPhase: {
        dominant: first.dominantStage,
        symbols: first.uniqueSymbols,
        complexity: first.complexity,
      },
      lastPhase: {
        dominant: last.dominantStage,
        symbols: last.uniqueSymbols,
        complexity: last.complexity,
      },
      totalPhases: phases.length,
      spanDays: Math.round(totalDays),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run all longitudinal analyses and return a comprehensive temporal profile.
 *
 * @param {string} userId
 * @returns {Object} Full longitudinal intelligence report
 */
export async function analyzeLongitudinal(userId) {
  const [cycles, sequences, seasonal, suppressions, weather, maturation] =
    await Promise.all([
      detectCycles(userId),
      detectSequences(userId),
      detectSeasonalRhythms(userId),
      detectSuppression(userId),
      computeEmotionalWeather(userId),
      analyzeMaturation(userId),
    ]);

  // Generate a synthetic narrative summarizing the longitudinal state
  const summaryParts = [];

  if (weather.current) {
    summaryParts.push(weather.current.narrative);
  }

  if (cycles.length > 0) {
    const topCycle = cycles[0];
    summaryParts.push(
      `Your most recurring transition is ${topCycle.from} → ${topCycle.to} (${topCycle.count} times).`,
    );
  }

  if (suppressions.length > 0) {
    summaryParts.push(
      `Watch for suppression patterns: ${suppressions.map((s) => `${s.suppressedStage} (${s.gapDays} day gap)`).join(", ")}.`,
    );
  }

  if (maturation.maturationArc) {
    summaryParts.push(maturation.maturationArc.narrative);
  }

  return {
    cycles,
    sequences,
    seasonal,
    suppressions,
    weather,
    maturation,
    summary: summaryParts.join(" "),
    hasData:
      cycles.length > 0 || sequences.length > 0 || weather.current != null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function computeEntropy(distribution) {
  const values = Object.values(distribution);
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  let entropy = 0;
  for (const v of values) {
    const p = v / total;
    if (p > 0) entropy -= p * Math.log(p);
  }
  const maxEntropy = Math.log(values.length || 1);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}
