/**
 * SYMBOLPATH — MYTHIC CONTINUITY ENGINE
 *
 * Phase 5: Life Continuity
 *
 * The identity engine asks: "What forces define this life?"
 * The mythic continuity engine asks: "What story is this life telling?"
 *
 * ──────────────────────────────────────────────────────────────────
 * THE SEVEN DIMENSIONS OF MYTHIC CONTINUITY:
 *
 *  1. SYMBOLIC ERAS           — Multi-season chapters of coherent
 *                                atmospheric identity. Named periods
 *                                larger than seasons. Life chapters.
 *
 *  2. CHAPTER TRANSITIONS     — The boundary moments between eras.
 *                                What catalyzed the shift? Which
 *                                symbols were active at the threshold?
 *
 *  3. ATMOSPHERE MIGRATIONS   — Long-term drift of emotional climate.
 *                                Not weather or seasons, but the slow
 *                                continental movement of atmospheric
 *                                character across months.
 *
 *  4. RECURRING INITIATIONS   — Threshold patterns that repeat across
 *                                the full timeline. The tests this
 *                                life keeps encountering.
 *
 *  5. UNRESOLVED LOOPS        — Patterns that return to the same point
 *                                without progressing. Cycles that
 *                                haven't yet broken through.
 *
 *  6. STABILIZATION EVENTS    — Moments where something finally
 *                                anchored permanently. The quiet
 *                                victories of symbolic persistence.
 *
 *  7. IDENTITY EVOLUTION ARCS — How the signature constellation itself
 *                                has changed over time. Not who you are
 *                                but who you have been becoming.
 *
 * ──────────────────────────────────────────────────────────────────
 * DESIGN PHILOSOPHY:
 *
 *   Narratives emerge slowly through accumulated evidence.
 *   The system does not invent a story.
 *   It notices the one that is already being told.
 *
 * ──────────────────────────────────────────────────────────────────
 */

import sql from "@/app/api/utils/sql";
import { STAGE_ORDER, STAGE_RANK } from "@/app/api/utils/memoryRules";
import { parseJsonArray } from "@/app/api/utils/identityEngine/helpers";

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const ERA_MIN_WEEKS = 4; // Minimum weeks for an era
const CHAPTER_TRANSITION_GAP = 3; // Max gap days between eras to detect transition
const LOOP_MIN_RECURRENCES = 3; // Minimum recurrences to detect a loop
const INITIATION_MIN_COUNT = 2; // Minimum threshold crossings for an initiation
const EVOLUTION_WINDOW_WEEKS = 4; // Window size for evolution arc snapshots

const ERA_NAMES = {
  Crisis: [
    "The Long Reckoning",
    "The Unraveling",
    "The Dark Passage",
    "The Crucible",
  ],
  Growth: [
    "The Quiet Reconstruction",
    "The Season of Building",
    "The Cultivation",
    "The Green Period",
  ],
  Integration: [
    "The Great Weaving",
    "The Convergence",
    "The Assembly",
    "The Reconciliation",
  ],
  Mastery: [
    "The Radiant Period",
    "The High Season",
    "The Crowning Arc",
    "The Illumination",
  ],
  Awakening: [
    "The First Stirring",
    "The Return to Awareness",
    "The Opening",
    "The Dawn Cycle",
  ],
  Threshold: [
    "The Long Threshold",
    "The Between-Times",
    "The Liminal Passage",
    "The Crossroads",
  ],
  Mixed: [
    "The Shifting Ground",
    "The Many Currents",
    "The Unsettled Period",
    "The Open Question",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. SYMBOLIC ERAS
//
// Eras are larger than seasons. Where a season is 2+ consecutive weeks of
// the same dominant atmosphere, an era is a coherent chapter that may
// encompass multiple seasons — unified by thematic continuity.
//
// An era might contain a "Season of Dissolution" followed by a "Season of
// Cultivation" — together they form "The Crucible and Reconstruction."
//
// Detection: group weekly data into broader windows, look for thematic
// coherence across adjacent weeks, allow for brief interruptions.
// ─────────────────────────────────────────────────────────────────────────────

async function computeSymbolicEras(userId, archetypeMap) {
  const rows = await sql(
    `SELECT
       DATE_TRUNC('week', created_at) as week_start,
       stage,
       symbol,
       COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY week_start, stage, symbol
     ORDER BY week_start`,
    [userId],
  );

  if (rows.length === 0) return [];

  // Build weekly profiles
  const weekMap = {};
  for (const row of rows) {
    const wk = new Date(row.week_start).toISOString().split("T")[0];
    if (!weekMap[wk])
      weekMap[wk] = { week: wk, stages: {}, symbols: new Set(), events: 0 };
    weekMap[wk].stages[row.stage] =
      (weekMap[wk].stages[row.stage] || 0) + parseInt(row.event_count);
    weekMap[wk].symbols.add(row.symbol);
    weekMap[wk].events += parseInt(row.event_count);
  }

  const weeks = Object.values(weekMap).sort((a, b) =>
    a.week.localeCompare(b.week),
  );
  if (weeks.length < ERA_MIN_WEEKS) return [];

  // Classify each week's dominant character
  const classified = weeks.map((w) => {
    const sorted = Object.entries(w.stages).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0];
    const pct = dominant ? Math.round((dominant[1] / w.events) * 100) : 0;
    const stageCount = Object.keys(w.stages).length;

    let character;
    if (pct >= 45) character = dominant[0];
    else if (stageCount >= 4) character = "Threshold";
    else character = "Mixed";

    return {
      week: w.week,
      character,
      dominantStage: dominant?.[0],
      dominantPct: pct,
      stageCount,
      events: w.events,
      symbols: [...w.symbols],
      stages: w.stages,
    };
  });

  // Build eras: consecutive weeks with compatible character
  // Allow brief (1-week) interruptions if the surrounding character matches
  const eras = [];
  let currentEra = null;

  for (let i = 0; i < classified.length; i++) {
    const week = classified[i];
    const isCompatible =
      currentEra && isEraCompatible(currentEra.character, week.character);

    if (isCompatible) {
      currentEra.weeks.push(week);
      currentEra.endDate = week.week;
    } else {
      // Check if this is a 1-week blip and the next week matches current era
      const nextWeek = classified[i + 1];
      const isBlip =
        currentEra &&
        nextWeek &&
        isEraCompatible(currentEra.character, nextWeek.character) &&
        !isEraCompatible(currentEra.character, week.character);

      if (isBlip) {
        // Absorb the blip
        currentEra.weeks.push(week);
        currentEra.endDate = week.week;
        currentEra.hasBlips = true;
      } else {
        // Finalize previous era
        if (currentEra && currentEra.weeks.length >= ERA_MIN_WEEKS) {
          eras.push(finalizeEra(currentEra, archetypeMap, eras.length));
        }
        // Start new era
        currentEra = {
          character: week.character,
          startDate: week.week,
          endDate: week.week,
          weeks: [week],
          hasBlips: false,
        };
      }
    }
  }

  // Finalize last era
  if (currentEra && currentEra.weeks.length >= ERA_MIN_WEEKS) {
    eras.push(finalizeEra(currentEra, archetypeMap, eras.length));
  }

  // If no eras meet the threshold, try to build one spanning the full timeline
  if (eras.length === 0 && classified.length >= ERA_MIN_WEEKS) {
    const fullEra = buildFullTimelineEra(classified, archetypeMap);
    if (fullEra) eras.push(fullEra);
  }

  // Mark current era
  if (eras.length > 0) {
    const now = new Date().toISOString().split("T")[0];
    const lastEra = eras[eras.length - 1];
    const daysSinceEnd =
      (new Date(now) - new Date(lastEra.endDate)) / (1000 * 60 * 60 * 24);
    if (daysSinceEnd <= 14) lastEra.isCurrent = true;
  }

  return eras;
}

function isEraCompatible(eraChar, weekChar) {
  if (eraChar === weekChar) return true;
  // Allow related stages to coexist in an era
  const compatible = {
    Crisis: ["Crisis", "Threshold"],
    Growth: ["Growth", "Awakening"],
    Integration: ["Integration", "Mastery"],
    Mastery: ["Mastery", "Integration"],
    Awakening: ["Awakening", "Growth"],
    Threshold: ["Threshold", "Crisis", "Mixed"],
    Mixed: ["Mixed", "Threshold"],
  };
  return (compatible[eraChar] || []).includes(weekChar);
}

function finalizeEra(raw, archetypeMap, index) {
  const durationWeeks = raw.weeks.length;

  // Aggregate all stages across the era
  const totalStages = {};
  const allSymbols = new Set();
  let totalEvents = 0;
  for (const w of raw.weeks) {
    for (const [stage, count] of Object.entries(w.stages)) {
      totalStages[stage] = (totalStages[stage] || 0) + count;
    }
    for (const sym of w.symbols) allSymbols.add(sym);
    totalEvents += w.events;
  }

  const dominantStage = Object.entries(totalStages).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const dominantPct = dominantStage
    ? Math.round((dominantStage[1] / totalEvents) * 100)
    : 0;

  // Pick an era name
  const namePool = ERA_NAMES[raw.character] || ERA_NAMES.Mixed;
  const nameIndex = index % namePool.length;
  const name = namePool[nameIndex];

  // Find the era's signature symbols (most frequent)
  const symbolCounts = {};
  for (const w of raw.weeks) {
    for (const sym of w.symbols) {
      symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
    }
  }
  const topSymbols = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sym, count]) => ({
      symbol: sym,
      visual: archetypeMap[sym]?.visual || "",
      weekCount: count,
    }));

  // Atmospheric character
  const atmospheres = {};
  for (const sym of allSymbols) {
    const atm = archetypeMap[sym]?.atmospheric_influence;
    if (atm)
      atmospheres[atm] = (atmospheres[atm] || 0) + (symbolCounts[sym] || 0);
  }
  const dominantAtmosphere = Object.entries(atmospheres).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return {
    name,
    character: raw.character,
    startDate: raw.startDate,
    endDate: raw.endDate,
    durationWeeks,
    isCurrent: false,
    dominantStage: dominantStage?.[0],
    dominantPercentage: dominantPct,
    stageDistribution: totalStages,
    dominantAtmosphere: dominantAtmosphere?.[0] || null,
    topSymbols,
    totalEvents,
    symbolCount: allSymbols.size,
    hasBlips: raw.hasBlips || false,
    narrative: buildEraNarrative(
      name,
      raw.character,
      durationWeeks,
      dominantPct,
      topSymbols,
      dominantAtmosphere?.[0],
    ),
  };
}

function buildFullTimelineEra(classified, archetypeMap) {
  // When no individual era meets threshold, characterize the full timeline
  const stageCounts = {};
  const allSymbols = new Set();
  let totalEvents = 0;

  for (const w of classified) {
    for (const [stage, count] of Object.entries(w.stages)) {
      stageCounts[stage] = (stageCounts[stage] || 0) + count;
    }
    for (const sym of w.symbols) allSymbols.add(sym);
    totalEvents += w.events;
  }

  const dominant = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0];
  const stageCount = Object.keys(stageCounts).length;
  const character =
    stageCount >= 4 ? "Threshold" : dominant ? dominant[0] : "Mixed";

  return finalizeEra(
    {
      character,
      startDate: classified[0].week,
      endDate: classified[classified.length - 1].week,
      weeks: classified,
      hasBlips: false,
    },
    archetypeMap,
    0,
  );
}

function buildEraNarrative(
  name,
  character,
  weeks,
  pct,
  topSymbols,
  atmosphere,
) {
  const symText = topSymbols
    .slice(0, 3)
    .map((s) => `${s.visual} ${s.symbol}`)
    .join(", ");
  const atmText = atmosphere
    ? ` The dominant atmosphere was ${atmosphere}.`
    : "";

  const narratives = {
    Crisis: `"${name}" — ${weeks} weeks where crisis energy shaped the landscape. ${pct}% of all activity carried the weight of disruption. ${symText} were the dominant forces.${atmText} This was not destruction for its own sake — it was the dismantling that precedes rebuilding.`,
    Growth: `"${name}" — ${weeks} weeks of active cultivation. ${pct}% of activity was growth-oriented, with ${symText} leading the expansion.${atmText} Something was being built here, layer by patient layer.`,
    Integration: `"${name}" — ${weeks} weeks of convergent meaning-making. ${pct}% of activity was integrative, with ${symText} weaving the threads together.${atmText} Scattered experiences were finding their place in a larger whole.`,
    Mastery: `"${name}" — ${weeks} weeks of radiant expression. ${pct}% of activity reached mastery, carried by ${symText}.${atmText} Hard-won wisdom was expressing itself fully.`,
    Awakening: `"${name}" — ${weeks} weeks of fresh beginnings. ${pct}% of activity carried awakening energy, with ${symText} emerging into awareness.${atmText} Something long dormant was stirring.`,
    Threshold: `"${name}" — ${weeks} weeks of fragmented, liminal energy. Multiple stages competed simultaneously, with ${symText} most active.${atmText} You were between chapters — the old story ending, the new one not yet begun.`,
    Mixed: `"${name}" — ${weeks} weeks without a dominant pattern. The most active symbols were ${symText}.${atmText} Sometimes the most important chapters resist simple naming.`,
  };

  return (
    narratives[character] ||
    `"${name}" — a ${weeks}-week chapter characterized by ${character.toLowerCase()} energy.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHAPTER TRANSITIONS
//
// The boundary moments between eras. What happened at the threshold?
// ─────────────────────────────────────────────────────────────────────────────

function computeChapterTransitions(eras) {
  if (eras.length < 2) return [];

  const transitions = [];
  for (let i = 1; i < eras.length; i++) {
    const prev = eras[i - 1];
    const curr = eras[i];

    const gapDays = Math.round(
      (new Date(curr.startDate) - new Date(prev.endDate)) /
        (1000 * 60 * 60 * 24),
    );
    const fromRank = STAGE_RANK[prev.character] ?? 2;
    const toRank = STAGE_RANK[curr.character] ?? 2;
    const direction =
      toRank > fromRank
        ? "ascending"
        : toRank < fromRank
          ? "descending"
          : "lateral";
    const depth = Math.abs(toRank - fromRank);

    // Shared symbols across the boundary
    const prevSyms = new Set(prev.topSymbols.map((s) => s.symbol));
    const currSyms = new Set(curr.topSymbols.map((s) => s.symbol));
    const bridgeSymbols = [...prevSyms].filter((s) => currSyms.has(s));
    const departingSymbols = [...prevSyms].filter((s) => !currSyms.has(s));
    const arrivingSymbols = [...currSyms].filter((s) => !prevSyms.has(s));

    let transitionType;
    if (
      prev.character === "Crisis" &&
      (curr.character === "Growth" || curr.character === "Awakening")
    ) {
      transitionType = "rebirth";
    } else if (prev.character === "Growth" && curr.character === "Crisis") {
      transitionType = "collapse";
    } else if (
      prev.character === "Integration" &&
      curr.character === "Mastery"
    ) {
      transitionType = "culmination";
    } else if (prev.character === "Threshold") {
      transitionType = "emergence";
    } else if (curr.character === "Threshold") {
      transitionType = "dissolution";
    } else {
      transitionType = direction;
    }

    const transitionNames = {
      rebirth: "The Turning Point",
      collapse: "The Breaking",
      culmination: "The Crowning",
      emergence: "The Emergence",
      dissolution: "The Unmaking",
      ascending: "The Ascent",
      descending: "The Descent",
      lateral: "The Shift",
    };

    transitions.push({
      name: transitionNames[transitionType] || "The Shift",
      type: transitionType,
      from: { era: prev.name, character: prev.character },
      to: { era: curr.name, character: curr.character },
      gapDays,
      direction,
      depth,
      bridgeSymbols,
      departingSymbols,
      arrivingSymbols,
      narrative: buildTransitionNarrative(
        transitionType,
        prev,
        curr,
        bridgeSymbols,
        departingSymbols,
        arrivingSymbols,
      ),
    });
  }

  return transitions;
}

function buildTransitionNarrative(
  type,
  prev,
  curr,
  bridge,
  departing,
  arriving,
) {
  const bridgeText =
    bridge.length > 0
      ? `${bridge.join(", ")} ${bridge.length === 1 ? "carried" : "carried"} across the boundary — a thread of continuity.`
      : "No symbols crossed the boundary — a clean break.";

  const departText =
    departing.length > 0 ? ` ${departing.join(", ")} fell away.` : "";

  const arriveText =
    arriving.length > 0
      ? ` ${arriving.join(", ")} appeared for the first time.`
      : "";

  const narratives = {
    rebirth: `From "${prev.name}" to "${curr.name}" — crisis gave way to new life. ${bridgeText}${departText}${arriveText}`,
    collapse: `From "${prev.name}" to "${curr.name}" — growth encountered something it couldn't sustain. ${bridgeText}${departText}${arriveText}`,
    culmination: `From "${prev.name}" to "${curr.name}" — integration crystallized into mastery. ${bridgeText}${departText}${arriveText}`,
    emergence: `From "${prev.name}" to "${curr.name}" — the liminal space resolved into clarity. ${bridgeText}${departText}${arriveText}`,
    dissolution: `From "${prev.name}" to "${curr.name}" — coherence dissolved into transition. ${bridgeText}${departText}${arriveText}`,
  };

  return (
    narratives[type] ||
    `From "${prev.name}" to "${curr.name}." ${bridgeText}${departText}${arriveText}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ATMOSPHERE MIGRATIONS
//
// Long-term drift of emotional climate. Not weekly weather, but the slow
// continental movement of atmospheric character across the full timeline.
// ─────────────────────────────────────────────────────────────────────────────

async function computeAtmosphereMigrations(userId, archetypeMap) {
  // Get monthly atmospheric snapshots
  const rows = await sql(
    `SELECT
       DATE_TRUNC('month', se.created_at) as month_start,
       se.symbol,
       se.stage,
       COUNT(*) as event_count
     FROM symbol_events se
     WHERE se.user_id = $1
     GROUP BY month_start, se.symbol, se.stage
     ORDER BY month_start`,
    [userId],
  );

  if (rows.length === 0) return { migrations: [], drift: null };

  // Build monthly profiles
  const months = {};
  for (const row of rows) {
    const m = new Date(row.month_start).toISOString().split("T")[0].slice(0, 7);
    if (!months[m])
      months[m] = { month: m, stages: {}, atmospheres: {}, events: 0 };
    months[m].stages[row.stage] =
      (months[m].stages[row.stage] || 0) + parseInt(row.event_count);
    months[m].events += parseInt(row.event_count);

    const atm = archetypeMap[row.symbol]?.atmospheric_influence;
    if (atm) {
      months[m].atmospheres[atm] =
        (months[m].atmospheres[atm] || 0) + parseInt(row.event_count);
    }
  }

  const monthList = Object.values(months).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
  if (monthList.length < 2) return { migrations: [], drift: null };

  // Detect atmosphere shifts between consecutive months
  const migrations = [];
  for (let i = 1; i < monthList.length; i++) {
    const prev = monthList[i - 1];
    const curr = monthList[i];

    const prevDom = Object.entries(prev.atmospheres).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const currDom = Object.entries(curr.atmospheres).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const prevStage = Object.entries(prev.stages).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const currStage = Object.entries(curr.stages).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (prevDom && currDom && prevDom[0] !== currDom[0]) {
      migrations.push({
        from: {
          month: prev.month,
          atmosphere: prevDom[0],
          stage: prevStage?.[0],
        },
        to: {
          month: curr.month,
          atmosphere: currDom[0],
          stage: currStage?.[0],
        },
        narrative: `${prev.month}: the atmosphere shifted from ${prevDom[0]} to ${currDom[0]}, as the dominant stage moved from ${prevStage?.[0] || "mixed"} to ${currStage?.[0] || "mixed"}.`,
      });
    }
  }

  // Compute overall drift: first month vs last month
  const first = monthList[0];
  const last = monthList[monthList.length - 1];
  const firstDom = Object.entries(first.atmospheres).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const lastDom = Object.entries(last.atmospheres).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const firstStage = Object.entries(first.stages).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const lastStage = Object.entries(last.stages).sort((a, b) => b[1] - a[1])[0];

  const drift =
    firstDom && lastDom
      ? {
          fromAtmosphere: firstDom[0],
          toAtmosphere: lastDom[0],
          fromStage: firstStage?.[0],
          toStage: lastStage?.[0],
          months: monthList.length,
          shifted: firstDom[0] !== lastDom[0],
          narrative:
            firstDom[0] !== lastDom[0]
              ? `Over ${monthList.length} months, your atmospheric character has migrated from ${firstDom[0]} toward ${lastDom[0]}. The dominant stage shifted from ${firstStage?.[0] || "mixed"} to ${lastStage?.[0] || "mixed"}. This is not a sudden change — it is a slow continental drift of the emotional ground beneath your symbolic life.`
              : `Over ${monthList.length} months, your atmospheric character has remained ${firstDom[0]}. The consistency of this atmosphere across time suggests it is structural — not a phase but a defining quality of your symbolic field.`,
        }
      : null;

  return { migrations, drift };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECURRING INITIATIONS
//
// Threshold patterns that repeat across the full timeline.
// An "initiation" is a specific stage-to-stage transition that recurs
// with similar symbolic content — the same test, encountered again.
// ─────────────────────────────────────────────────────────────────────────────

async function computeRecurringInitiations(userId) {
  // Find repeated Awakening entries — each one is a potential initiation
  const awakeningRows = await sql(
    `WITH ordered AS (
       SELECT id, symbol, stage, created_at,
              LAG(stage) OVER (ORDER BY created_at, id) as prev_stage,
              LAG(symbol) OVER (ORDER BY created_at, id) as prev_symbol,
              LAG(created_at) OVER (ORDER BY created_at, id) as prev_time
       FROM symbol_events
       WHERE user_id = $1
       ORDER BY created_at
     )
     SELECT symbol, stage, prev_stage, prev_symbol,
            created_at, prev_time
     FROM ordered
     WHERE stage = 'Awakening' AND prev_stage IS NOT NULL
       AND prev_stage != 'Awakening'
     ORDER BY created_at`,
    [userId],
  );

  // Also find Crisis → Growth transitions (another initiation type)
  const crisisToGrowthRows = await sql(
    `WITH ordered AS (
       SELECT id, symbol, stage, created_at,
              LAG(stage) OVER (ORDER BY created_at, id) as prev_stage,
              LAG(symbol) OVER (ORDER BY created_at, id) as prev_symbol
       FROM symbol_events
       WHERE user_id = $1
       ORDER BY created_at
     )
     SELECT symbol, stage, prev_stage, prev_symbol,
            created_at
     FROM ordered
     WHERE stage = 'Growth' AND prev_stage = 'Crisis'
     ORDER BY created_at`,
    [userId],
  );

  const initiations = [];

  // Pattern: repeated Awakening after non-Awakening
  const awakeningPatterns = {};
  for (const row of awakeningRows) {
    const key = `${row.prev_stage}→Awakening`;
    if (!awakeningPatterns[key]) {
      awakeningPatterns[key] = {
        pattern: key,
        from: row.prev_stage,
        to: "Awakening",
        occurrences: [],
        symbols: new Set(),
      };
    }
    awakeningPatterns[key].occurrences.push(row.created_at);
    awakeningPatterns[key].symbols.add(row.symbol);
    if (row.prev_symbol) awakeningPatterns[key].symbols.add(row.prev_symbol);
  }

  for (const pattern of Object.values(awakeningPatterns)) {
    if (pattern.occurrences.length >= INITIATION_MIN_COUNT) {
      initiations.push({
        type: "awakening_initiation",
        pattern: pattern.pattern,
        from: pattern.from,
        to: pattern.to,
        count: pattern.occurrences.length,
        symbols: [...pattern.symbols],
        firstOccurrence: pattern.occurrences[0],
        lastOccurrence: pattern.occurrences[pattern.occurrences.length - 1],
        narrative: `The ${pattern.from} → Awakening initiation has occurred ${pattern.occurrences.length} times. Each time, something in ${pattern.from.toLowerCase()} broke open into new awareness. Symbols involved: ${[...pattern.symbols].join(", ")}. This is a recurring threshold in your life — the same test encountered in different form.`,
      });
    }
  }

  // Pattern: Crisis → Growth (the forge)
  if (crisisToGrowthRows.length >= INITIATION_MIN_COUNT) {
    const symbols = new Set(crisisToGrowthRows.map((r) => r.symbol));
    initiations.push({
      type: "forge_initiation",
      pattern: "Crisis→Growth",
      from: "Crisis",
      to: "Growth",
      count: crisisToGrowthRows.length,
      symbols: [...symbols],
      firstOccurrence: crisisToGrowthRows[0].created_at,
      lastOccurrence:
        crisisToGrowthRows[crisisToGrowthRows.length - 1].created_at,
      narrative: `The Crisis → Growth forge has fired ${crisisToGrowthRows.length} times. You characteristically transmute disruption into building. This isn't incidental — it is one of your defining mythic patterns.`,
    });
  }

  return initiations.sort((a, b) => b.count - a.count);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. UNRESOLVED LOOPS
//
// Patterns that keep returning to the same point without progressing.
// The system detects when a symbol or stage pattern cycles back to its
// starting point repeatedly.
// ─────────────────────────────────────────────────────────────────────────────

async function computeUnresolvedLoops(userId) {
  // Find stage loops: A → B → A → B patterns
  const rows = await sql(
    `WITH ordered AS (
       SELECT stage, symbol, created_at,
              LAG(stage, 1) OVER (ORDER BY created_at, id) as prev1_stage,
              LAG(stage, 2) OVER (ORDER BY created_at, id) as prev2_stage,
              LAG(symbol, 1) OVER (ORDER BY created_at, id) as prev1_symbol,
              LAG(symbol, 2) OVER (ORDER BY created_at, id) as prev2_symbol
       FROM symbol_events
       WHERE user_id = $1
       ORDER BY created_at
     )
     SELECT stage, symbol, prev1_stage, prev2_stage,
            prev1_symbol, prev2_symbol, created_at
     FROM ordered
     WHERE prev2_stage IS NOT NULL`,
    [userId],
  );

  // Detect stage oscillation: same stage appears at positions 0 and 2 with different at position 1
  const loopCounts = {};
  for (const row of rows) {
    if (row.stage === row.prev2_stage && row.stage !== row.prev1_stage) {
      const loopKey = `${row.stage}⟲${row.prev1_stage}`;
      if (!loopCounts[loopKey]) {
        loopCounts[loopKey] = {
          anchor: row.stage,
          oscillation: row.prev1_stage,
          count: 0,
          symbols: new Set(),
          dates: [],
        };
      }
      loopCounts[loopKey].count++;
      loopCounts[loopKey].symbols.add(row.symbol);
      loopCounts[loopKey].dates.push(row.created_at);
    }
  }

  const loops = Object.values(loopCounts)
    .filter((l) => l.count >= LOOP_MIN_RECURRENCES)
    .map((l) => {
      const anchorRank = STAGE_RANK[l.anchor] ?? 2;
      const oscRank = STAGE_RANK[l.oscillation] ?? 2;
      const isRegressive = oscRank < anchorRank;

      return {
        type: "stage_oscillation",
        anchor: l.anchor,
        oscillation: l.oscillation,
        count: l.count,
        isRegressive,
        symbols: [...l.symbols],
        firstSeen: l.dates[0],
        lastSeen: l.dates[l.dates.length - 1],
        narrative: isRegressive
          ? `The ${l.anchor} ⟲ ${l.oscillation} loop has occurred ${l.count} times. You reach ${l.anchor}, slip back to ${l.oscillation}, and return to ${l.anchor} — but haven't yet broken through to the next stage. Symbols involved: ${[...l.symbols].slice(0, 4).join(", ")}. This loop may indicate an unresolved lesson that ${l.oscillation} keeps presenting.`
          : `The ${l.anchor} ⟲ ${l.oscillation} oscillation has occurred ${l.count} times. Movement toward ${l.oscillation} keeps pulling you back to ${l.anchor}. This pattern may be a stabilization mechanism — or an avoidance of the growth ${l.oscillation} demands.`,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Detect symbol-level loops: same symbol appearing repeatedly in same stage
  const symbolStageRows = await sql(
    `SELECT symbol, stage, COUNT(*) as appearances,
            COUNT(DISTINCT DATE_TRUNC('month', created_at)) as distinct_months,
            MIN(created_at) as first_seen, MAX(created_at) as last_seen
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY symbol, stage
     HAVING COUNT(*) >= $2 AND COUNT(DISTINCT DATE_TRUNC('month', created_at)) >= 2
     ORDER BY appearances DESC`,
    [userId, LOOP_MIN_RECURRENCES + 2],
  );

  const symbolLoops = [];
  for (const row of symbolStageRows) {
    // A symbol that keeps appearing in Crisis = unresolved crisis loop
    if (row.stage === "Crisis" && parseInt(row.appearances) >= 5) {
      symbolLoops.push({
        type: "symbol_crisis_loop",
        symbol: row.symbol,
        stage: row.stage,
        count: parseInt(row.appearances),
        months: parseInt(row.distinct_months),
        firstSeen: row.first_seen,
        lastSeen: row.last_seen,
        narrative: `${row.symbol} has appeared in Crisis ${row.appearances} times across ${row.distinct_months} months. This symbol keeps encountering the same difficulty — the wound it represents may be unresolved.`,
      });
    }
    // A symbol stuck in Awakening = initiation that never completes
    if (row.stage === "Awakening" && parseInt(row.appearances) >= 5) {
      symbolLoops.push({
        type: "symbol_awakening_loop",
        symbol: row.symbol,
        stage: row.stage,
        count: parseInt(row.appearances),
        months: parseInt(row.distinct_months),
        firstSeen: row.first_seen,
        lastSeen: row.last_seen,
        narrative: `${row.symbol} keeps awakening but never fully roots — ${row.appearances} times across ${row.distinct_months} months. The beginning keeps happening, but hasn't yet flowered into sustained growth.`,
      });
    }
  }

  return {
    stageLoops: loops,
    symbolLoops,
    hasLoops: loops.length > 0 || symbolLoops.length > 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STABILIZATION EVENTS
//
// Moments where something finally anchored permanently.
// Detected from gravity history: when did a symbol's weight cross the
// anchor threshold and stay?
// ─────────────────────────────────────────────────────────────────────────────

async function computeStabilizationEvents(userId, archetypeMap) {
  // Find symbols that became anchored
  const anchoredRows = await sql(
    `SELECT sg.symbol, sg.anchored, sg.weight, sg.peak_weight,
            sg.first_seen, sg.last_seen, sg.count as total_events,
            sg.source_types
     FROM symbol_gravity sg
     WHERE sg.user_id = $1 AND sg.anchored = true
     ORDER BY sg.peak_weight DESC`,
    [userId],
  );

  if (anchoredRows.length === 0) {
    // Check for symbols approaching anchor threshold
    const nearAnchorRows = await sql(
      `SELECT symbol, weight, peak_weight, first_seen, count as total_events
       FROM symbol_gravity
       WHERE user_id = $1 AND weight >= 7.0 AND anchored = false
       ORDER BY weight DESC
       LIMIT 5`,
      [userId],
    );

    const approaching = nearAnchorRows.map((r) => {
      const arch = archetypeMap[r.symbol];
      return {
        type: "approaching",
        symbol: r.symbol,
        visual: arch?.visual || "",
        currentWeight: parseFloat(r.weight),
        peakWeight: parseFloat(r.peak_weight),
        totalEvents: parseInt(r.total_events),
        narrative: `${arch?.visual || ""} ${r.symbol} is approaching stabilization (weight: ${parseFloat(r.weight).toFixed(1)}). With continued presence, this symbol may anchor permanently into your identity.`,
      };
    });

    return { stabilized: [], approaching, hasEvents: approaching.length > 0 };
  }

  const stabilized = anchoredRows.map((r) => {
    const arch = archetypeMap[r.symbol];
    return {
      type: "anchored",
      symbol: r.symbol,
      visual: arch?.visual || "",
      stage: arch?.stage || "",
      weight: parseFloat(r.weight),
      peakWeight: parseFloat(r.peak_weight),
      firstSeen: r.first_seen,
      lastSeen: r.last_seen,
      totalEvents: parseInt(r.total_events),
      sources: parseJsonArray(r.source_types),
      permanenceAffinity: arch?.permanence_affinity || null,
      narrative: `${arch?.visual || ""} ${r.symbol} has anchored — it will never fully decay from your symbolic field. Peak weight: ${parseFloat(r.peak_weight).toFixed(1)}, from ${parseInt(r.total_events)} events. ${arch?.stabilization_tendency || ""} This is a quiet victory: something has become permanent.`,
    };
  });

  return { stabilized, approaching: [], hasEvents: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. IDENTITY EVOLUTION ARCS
//
// How the signature constellation has changed over time.
// Takes snapshots of the "top symbols" at different windows across the
// timeline and shows the shift.
// ─────────────────────────────────────────────────────────────────────────────

async function computeIdentityEvolutionArcs(userId, archetypeMap) {
  const rows = await sql(
    `SELECT
       DATE_TRUNC('week', created_at) as week_start,
       symbol,
       COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY week_start, symbol
     ORDER BY week_start`,
    [userId],
  );

  if (rows.length === 0) return { snapshots: [], arc: null };

  // Build weekly symbol frequency
  const weekData = {};
  for (const row of rows) {
    const wk = new Date(row.week_start).toISOString().split("T")[0];
    if (!weekData[wk]) weekData[wk] = {};
    weekData[wk][row.symbol] = parseInt(row.event_count);
  }

  const weekKeys = Object.keys(weekData).sort();
  if (weekKeys.length < EVOLUTION_WINDOW_WEEKS * 2) {
    return { snapshots: [], arc: null };
  }

  // Create snapshots: early, middle, recent
  const snapshots = [];
  const windowSize = Math.min(
    EVOLUTION_WINDOW_WEEKS,
    Math.floor(weekKeys.length / 3),
  );

  const windows = [
    { label: "Early", start: 0, end: windowSize },
    {
      label: "Middle",
      start: Math.floor(weekKeys.length / 2) - Math.floor(windowSize / 2),
      end: Math.floor(weekKeys.length / 2) + Math.ceil(windowSize / 2),
    },
    {
      label: "Recent",
      start: weekKeys.length - windowSize,
      end: weekKeys.length,
    },
  ];

  for (const win of windows) {
    const symbolCounts = {};
    for (let i = win.start; i < win.end; i++) {
      const wk = weekKeys[i];
      for (const [sym, count] of Object.entries(weekData[wk] || {})) {
        symbolCounts[sym] = (symbolCounts[sym] || 0) + count;
      }
    }

    const topSymbols = Object.entries(symbolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sym, count]) => ({
        symbol: sym,
        visual: archetypeMap[sym]?.visual || "",
        stage: archetypeMap[sym]?.stage || "",
        count,
      }));

    snapshots.push({
      label: win.label,
      periodStart: weekKeys[win.start],
      periodEnd: weekKeys[Math.min(win.end - 1, weekKeys.length - 1)],
      topSymbols,
    });
  }

  // Compute the arc: what changed between early and recent?
  const early = snapshots.find((s) => s.label === "Early");
  const recent = snapshots.find((s) => s.label === "Recent");

  let arc = null;
  if (early && recent) {
    const earlySyms = new Set(early.topSymbols.map((s) => s.symbol));
    const recentSyms = new Set(recent.topSymbols.map((s) => s.symbol));
    const persisted = [...earlySyms].filter((s) => recentSyms.has(s));
    const departed = [...earlySyms].filter((s) => !recentSyms.has(s));
    const emerged = [...recentSyms].filter((s) => !earlySyms.has(s));

    const earlyStages = early.topSymbols.map((s) => s.stage);
    const recentStages = recent.topSymbols.map((s) => s.stage);

    arc = {
      persisted: persisted.map((s) => ({
        symbol: s,
        visual: archetypeMap[s]?.visual || "",
      })),
      departed: departed.map((s) => ({
        symbol: s,
        visual: archetypeMap[s]?.visual || "",
      })),
      emerged: emerged.map((s) => ({
        symbol: s,
        visual: archetypeMap[s]?.visual || "",
      })),
      earlyDominantStage: getMostFrequent(earlyStages),
      recentDominantStage: getMostFrequent(recentStages),
      narrative: buildEvolutionNarrative(
        persisted,
        departed,
        emerged,
        earlyStages,
        recentStages,
        archetypeMap,
      ),
    };
  }

  return { snapshots, arc };
}

function getMostFrequent(arr) {
  const counts = {};
  for (const item of arr) if (item) counts[item] = (counts[item] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}

function buildEvolutionNarrative(
  persisted,
  departed,
  emerged,
  earlyStages,
  recentStages,
  archMap,
) {
  const parts = [];

  if (persisted.length > 0) {
    const pText = persisted
      .map((s) => `${archMap[s]?.visual || ""} ${s}`)
      .join(", ");
    parts.push(
      `${pText} ${persisted.length === 1 ? "has" : "have"} persisted across your entire symbolic history — a constant thread.`,
    );
  }

  if (departed.length > 0) {
    const dText = departed
      .map((s) => `${archMap[s]?.visual || ""} ${s}`)
      .join(", ");
    parts.push(
      `${dText} ${departed.length === 1 ? "was" : "were"} prominent early but ${departed.length === 1 ? "has" : "have"} since faded.`,
    );
  }

  if (emerged.length > 0) {
    const eText = emerged
      .map((s) => `${archMap[s]?.visual || ""} ${s}`)
      .join(", ");
    parts.push(
      `${eText} ${emerged.length === 1 ? "has" : "have"} emerged more recently — new forces entering your symbolic field.`,
    );
  }

  const earlyDom = getMostFrequent(earlyStages);
  const recentDom = getMostFrequent(recentStages);
  if (earlyDom && recentDom && earlyDom !== recentDom) {
    parts.push(
      `Your dominant stage has shifted from ${earlyDom} to ${recentDom} — the center of gravity of your transformation has moved.`,
    );
  }

  return parts.length > 0
    ? parts.join(" ")
    : "Your symbolic identity has remained relatively stable across time.";
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the full Mythic Continuity profile for a user.
 *
 * This is the longest-horizon view — not who you are, but what story
 * your symbolic life is telling.
 *
 * @param {string} userId
 * @returns {Object} Full mythic continuity profile
 */
export async function computeMythicContinuity(userId) {
  // Load archetype data
  const archetypeRows = await sql(
    `SELECT * FROM symbol_archetypes ORDER BY id`,
  );
  const archetypeMap = {};
  for (const a of archetypeRows) {
    archetypeMap[a.symbol] = a;
  }

  // Check data sufficiency
  const metaRows = await sql(
    `SELECT
       COUNT(*) as total_events,
       COUNT(DISTINCT DATE_TRUNC('week', created_at)) as distinct_weeks,
       EXTRACT(DAY FROM MAX(created_at) - MIN(created_at)) as span_days,
       MIN(created_at) as first_event,
       MAX(created_at) as last_event
     FROM symbol_events WHERE user_id = $1`,
    [userId],
  );

  const meta = metaRows[0];
  const totalEvents = parseInt(meta.total_events);
  const spanDays = parseInt(meta.span_days || 0);
  const distinctWeeks = parseInt(meta.distinct_weeks || 0);

  if (totalEvents < 10 || spanDays < 21) {
    return {
      ready: false,
      message:
        "Mythic Continuity requires deeper history. The story of your symbolic life needs at least 3 weeks and diverse events to begin revealing its chapters. Keep logging — the narrative will emerge.",
      meta: { totalEvents, spanDays, distinctWeeks },
    };
  }

  // Compute all seven dimensions
  const [
    eras,
    atmosphereMigrations,
    initiations,
    loops,
    stabilization,
    evolution,
  ] = await Promise.all([
    computeSymbolicEras(userId, archetypeMap),
    computeAtmosphereMigrations(userId, archetypeMap),
    computeRecurringInitiations(userId),
    computeUnresolvedLoops(userId),
    computeStabilizationEvents(userId, archetypeMap),
    computeIdentityEvolutionArcs(userId, archetypeMap),
  ]);

  // Chapter transitions derived from eras
  const chapterTransitions = computeChapterTransitions(eras);

  // Generate mythic summary
  const summary = generateMythicSummary(
    eras,
    chapterTransitions,
    atmosphereMigrations,
    initiations,
    loops,
    stabilization,
    evolution,
  );

  return {
    ready: true,
    meta: {
      totalEvents,
      spanDays: Math.round(spanDays),
      distinctWeeks,
      firstEvent: meta.first_event,
      lastEvent: meta.last_event,
    },
    eras,
    chapterTransitions,
    atmosphereMigrations,
    initiations,
    loops,
    stabilization,
    evolution,
    summary,
  };
}

function generateMythicSummary(
  eras,
  transitions,
  migrations,
  initiations,
  loops,
  stabilization,
  evolution,
) {
  const parts = [];

  // Era overview
  if (eras.length > 0) {
    const eraNames = eras.map((e) => `"${e.name}"`).join(", ");
    const currentEra = eras.find((e) => e.isCurrent);
    parts.push(
      `Your symbolic life spans ${eras.length} era${eras.length > 1 ? "s" : ""}: ${eraNames}.${currentEra ? ` You are currently in "${currentEra.name}."` : ""}`,
    );
  }

  // Atmosphere drift
  if (migrations.drift?.shifted) {
    parts.push(
      `The atmosphere has migrated from ${migrations.drift.fromAtmosphere} to ${migrations.drift.toAtmosphere} over ${migrations.drift.months} months.`,
    );
  }

  // Initiations
  if (initiations.length > 0) {
    const topInit = initiations[0];
    parts.push(
      `The ${topInit.pattern} initiation has occurred ${topInit.count} times — a recurring threshold in your mythic arc.`,
    );
  }

  // Unresolved loops
  if (loops.hasLoops) {
    const loopCount = loops.stageLoops.length + loops.symbolLoops.length;
    parts.push(
      `${loopCount} unresolved loop${loopCount > 1 ? "s" : ""} detected — patterns that keep returning without breakthrough.`,
    );
  }

  // Stabilization
  if (stabilization.stabilized?.length > 0) {
    const stNames = stabilization.stabilized
      .map((s) => `${s.visual} ${s.symbol}`)
      .join(", ");
    parts.push(
      `${stNames} ${stabilization.stabilized.length === 1 ? "has" : "have"} permanently anchored into your symbolic identity.`,
    );
  }

  // Evolution arc
  if (evolution.arc?.emerged?.length > 0) {
    const emergedNames = evolution.arc.emerged
      .map((s) => `${s.visual} ${s.symbol}`)
      .join(", ");
    parts.push(`New forces emerging: ${emergedNames}.`);
  }

  return parts.length > 0
    ? parts.join(" ")
    : "Your mythic continuity is still forming. The story will reveal its chapters as more symbolic history accumulates.";
}
