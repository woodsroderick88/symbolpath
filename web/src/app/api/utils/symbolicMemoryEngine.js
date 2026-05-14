/**
 * SYMBOLPATH — SYMBOLIC MEMORY RETRIEVAL ENGINE
 *
 * Phase 6: Meaningful Symbolic Recall
 *
 * The continuity engine asks: "What story is this life telling?"
 * The memory engine asks: "When have I been here before?"
 *
 * ──────────────────────────────────────────────────────────────────
 * THE SIX DIMENSIONS OF SYMBOLIC MEMORY:
 *
 *  1. PRIOR CLIMATES          — Retrieve past emotional climates.
 *                                "When was the last turbulent period?"
 *                                "Show me all generative seasons."
 *
 *  2. SEASON COMPARISON       — Compare symbolic seasons across time.
 *                                "How does this season compare to the
 *                                 last Season of Dissolution?"
 *
 *  3. CONSTELLATION REVISIT   — Revisit past symbolic constellations.
 *                                "What symbols were active together in
 *                                 March?" "Show past appearances of
 *                                 The Reckoning constellation."
 *
 *  4. REPEATED THRESHOLDS     — Detect when the same threshold has been
 *                                crossed before. "Has Storm→Growth
 *                                happened before? When?"
 *
 *  5. TIMELINE COMPRESSION    — Compress the full timeline into its
 *                                essential shape: the major phases,
 *                                turning points, and dominant forces
 *                                at each level of zoom.
 *
 *  6. SYMBOLIC SEARCH         — Free-form retrieval: search for a
 *                                symbol, stage, atmosphere, or pattern
 *                                across all of symbolic history.
 *
 * ──────────────────────────────────────────────────────────────────
 * DESIGN PHILOSOPHY:
 *
 *   Memory is not storage. Storage holds data.
 *   Memory retrieves meaning.
 *
 *   The question is never "what happened on March 15?"
 *   The question is "when did I feel like this before?"
 *
 * ──────────────────────────────────────────────────────────────────
 */

import sql from "@/app/api/utils/sql";

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIOR CLIMATES
//
// Retrieve past emotional climates by type.
// "When was the last fragmented-generative season?"
// "Show all turbulent periods."
// ─────────────────────────────────────────────────────────────────────────────

export async function retrievePriorClimates(
  userId,
  { climate, stage, limit = 20 } = {},
) {
  // Build weekly climate classifications across full history
  const weeklyRows = await sql(
    `SELECT
       DATE_TRUNC('week', se.created_at) as week_start,
       se.stage,
       se.symbol,
       COUNT(*) as event_count
     FROM symbol_events se
     WHERE se.user_id = $1
     GROUP BY week_start, se.stage, se.symbol
     ORDER BY week_start`,
    [userId],
  );

  if (weeklyRows.length === 0) return { periods: [], total: 0 };

  // Load archetype map for atmospheric data
  const archetypeMap = await loadArchetypeMap();

  // Build weekly profiles
  const weeks = buildWeeklyProfiles(weeklyRows, archetypeMap);

  // Classify each week's climate
  const classified = weeks.map((w) => classifyWeekClimate(w, archetypeMap));

  // Group consecutive weeks of same/similar climate into periods
  const periods = groupIntoPeriods(classified);

  // Filter by requested climate or stage
  let filtered = periods;
  if (climate) {
    const climateLower = climate.toLowerCase();
    filtered = periods.filter(
      (p) =>
        p.climate.toLowerCase().includes(climateLower) ||
        p.compound?.toLowerCase().includes(climateLower),
    );
  }
  if (stage) {
    const stageLower = stage.toLowerCase();
    filtered = filtered.filter(
      (p) => p.dominantStage?.toLowerCase() === stageLower,
    );
  }

  // Limit results
  const limited = filtered.slice(-limit);

  return {
    periods: limited.map((p) => ({
      climate: p.climate,
      compound: p.compound || null,
      dominantStage: p.dominantStage,
      dominantAtmosphere: p.dominantAtmosphere,
      startDate: p.startDate,
      endDate: p.endDate,
      durationWeeks: p.weeks.length,
      totalEvents: p.totalEvents,
      topSymbols: p.topSymbols,
      narrative: buildClimateNarrative(p),
    })),
    total: filtered.length,
    allClimates: [...new Set(periods.map((p) => p.climate))].sort(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SEASON COMPARISON
//
// Compare two time periods side by side.
// "How does this month compare to March?"
// ─────────────────────────────────────────────────────────────────────────────

export async function compareSeasons(userId, periodA, periodB) {
  // periodA and periodB are { startDate, endDate } objects
  const [rowsA, rowsB] = await Promise.all([
    sql(
      `SELECT se.symbol, se.stage, se.source_type, COUNT(*) as event_count,
              COUNT(DISTINCT DATE(se.created_at)) as active_days
       FROM symbol_events se
       WHERE se.user_id = $1
         AND se.created_at >= $2::date AND se.created_at < ($3::date + interval '1 day')
       GROUP BY se.symbol, se.stage, se.source_type`,
      [userId, periodA.startDate, periodA.endDate],
    ),
    sql(
      `SELECT se.symbol, se.stage, se.source_type, COUNT(*) as event_count,
              COUNT(DISTINCT DATE(se.created_at)) as active_days
       FROM symbol_events se
       WHERE se.user_id = $1
         AND se.created_at >= $2::date AND se.created_at < ($3::date + interval '1 day')
       GROUP BY se.symbol, se.stage, se.source_type`,
      [userId, periodB.startDate, periodB.endDate],
    ),
  ]);

  const archetypeMap = await loadArchetypeMap();

  const profileA = buildPeriodProfile(rowsA, periodA, archetypeMap);
  const profileB = buildPeriodProfile(rowsB, periodB, archetypeMap);

  // Compute differences
  const comparison = computeComparison(profileA, profileB, archetypeMap);

  return {
    periodA: profileA,
    periodB: profileB,
    comparison,
  };
}

function buildPeriodProfile(rows, period, archetypeMap) {
  const stages = {};
  const symbols = {};
  const sources = new Set();
  const atmospheres = {};
  let totalEvents = 0;

  for (const r of rows) {
    const count = parseInt(r.event_count);
    stages[r.stage] = (stages[r.stage] || 0) + count;
    symbols[r.symbol] = (symbols[r.symbol] || 0) + count;
    sources.add(r.source_type);
    totalEvents += count;

    const atm = archetypeMap[r.symbol]?.atmospheric_influence;
    if (atm) atmospheres[atm] = (atmospheres[atm] || 0) + count;
  }

  const dominantStage = Object.entries(stages).sort((a, b) => b[1] - a[1])[0];
  const dominantAtm = Object.entries(atmospheres).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topSymbols = Object.entries(symbols)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([sym, count]) => ({
      symbol: sym,
      visual: archetypeMap[sym]?.visual || "",
      stage: archetypeMap[sym]?.stage || "",
      count,
    }));

  return {
    startDate: period.startDate,
    endDate: period.endDate,
    totalEvents,
    stageDistribution: stages,
    dominantStage: dominantStage?.[0] || null,
    dominantPercentage: dominantStage
      ? Math.round((dominantStage[1] / totalEvents) * 100)
      : 0,
    dominantAtmosphere: dominantAtm?.[0] || null,
    topSymbols,
    sourceCount: sources.size,
    symbolCount: Object.keys(symbols).length,
  };
}

function computeComparison(a, b, archetypeMap) {
  const aSyms = new Set(a.topSymbols.map((s) => s.symbol));
  const bSyms = new Set(b.topSymbols.map((s) => s.symbol));
  const shared = [...aSyms].filter((s) => bSyms.has(s));
  const onlyA = [...aSyms].filter((s) => !bSyms.has(s));
  const onlyB = [...bSyms].filter((s) => !aSyms.has(s));

  // Stage shift
  const stageShift =
    a.dominantStage !== b.dominantStage
      ? { from: a.dominantStage, to: b.dominantStage, shifted: true }
      : { from: a.dominantStage, to: b.dominantStage, shifted: false };

  // Atmosphere shift
  const atmShift =
    a.dominantAtmosphere !== b.dominantAtmosphere
      ? { from: a.dominantAtmosphere, to: b.dominantAtmosphere, shifted: true }
      : {
          from: a.dominantAtmosphere,
          to: b.dominantAtmosphere,
          shifted: false,
        };

  // Event intensity
  const intensityRatio =
    b.totalEvents > 0 && a.totalEvents > 0
      ? (b.totalEvents / a.totalEvents).toFixed(2)
      : null;

  // Build narrative
  const parts = [];
  if (stageShift.shifted) {
    parts.push(
      `The dominant stage shifted from ${stageShift.from || "mixed"} to ${stageShift.to || "mixed"}.`,
    );
  } else {
    parts.push(
      `Both periods share ${stageShift.from || "mixed"} as their dominant stage.`,
    );
  }
  if (atmShift.shifted) {
    parts.push(
      `The atmosphere migrated from ${atmShift.from || "undefined"} to ${atmShift.to || "undefined"}.`,
    );
  }
  if (shared.length > 0) {
    parts.push(
      `${shared.map((s) => `${archetypeMap[s]?.visual || ""} ${s}`).join(", ")} ${shared.length === 1 ? "persisted" : "persisted"} across both periods — a thread of continuity.`,
    );
  }
  if (onlyA.length > 0) {
    parts.push(
      `${onlyA.map((s) => `${archetypeMap[s]?.visual || ""} ${s}`).join(", ")} ${onlyA.length === 1 ? "was" : "were"} present only in the first period.`,
    );
  }
  if (onlyB.length > 0) {
    parts.push(
      `${onlyB.map((s) => `${archetypeMap[s]?.visual || ""} ${s}`).join(", ")} ${onlyB.length === 1 ? "is" : "are"} new in the second period.`,
    );
  }

  return {
    sharedSymbols: shared.map((s) => ({
      symbol: s,
      visual: archetypeMap[s]?.visual || "",
    })),
    onlyInA: onlyA.map((s) => ({
      symbol: s,
      visual: archetypeMap[s]?.visual || "",
    })),
    onlyInB: onlyB.map((s) => ({
      symbol: s,
      visual: archetypeMap[s]?.visual || "",
    })),
    stageShift,
    atmosphereShift: atmShift,
    intensityRatio: intensityRatio ? parseFloat(intensityRatio) : null,
    narrative: parts.join(" "),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSTELLATION REVISIT
//
// Find past time windows where a specific group of symbols co-occurred.
// "When were Storm and Mirror both active?"
// ─────────────────────────────────────────────────────────────────────────────

export async function revisitConstellation(
  userId,
  symbols,
  { windowDays = 14 } = {},
) {
  if (!symbols || symbols.length === 0) return { windows: [], total: 0 };

  const symbolList = Array.isArray(symbols) ? symbols : [symbols];

  // Find weeks where ALL requested symbols were active
  const rows = await sql(
    `WITH symbol_weeks AS (
       SELECT DISTINCT DATE_TRUNC('week', created_at) as week_start, symbol
       FROM symbol_events
       WHERE user_id = $1 AND symbol = ANY($2)
     ),
     co_occurring AS (
       SELECT week_start, ARRAY_AGG(DISTINCT symbol) as present_symbols, COUNT(DISTINCT symbol) as sym_count
       FROM symbol_weeks
       GROUP BY week_start
       HAVING COUNT(DISTINCT symbol) >= $3
     )
     SELECT co.week_start, co.present_symbols, co.sym_count,
            se.stage, se.symbol, COUNT(*) as event_count
     FROM co_occurring co
     JOIN symbol_events se ON se.user_id = $1
       AND DATE_TRUNC('week', se.created_at) = co.week_start
       AND se.symbol = ANY($2)
     GROUP BY co.week_start, co.present_symbols, co.sym_count, se.stage, se.symbol
     ORDER BY co.week_start DESC`,
    [userId, symbolList, symbolList.length],
  );

  if (rows.length === 0) {
    // Try with partial overlap (at least 2 of requested)
    const minOverlap = Math.max(2, Math.ceil(symbolList.length * 0.5));
    const partialRows = await sql(
      `WITH symbol_weeks AS (
         SELECT DISTINCT DATE_TRUNC('week', created_at) as week_start, symbol
         FROM symbol_events
         WHERE user_id = $1 AND symbol = ANY($2)
       ),
       co_occurring AS (
         SELECT week_start, ARRAY_AGG(DISTINCT symbol) as present_symbols, COUNT(DISTINCT symbol) as sym_count
         FROM symbol_weeks
         GROUP BY week_start
         HAVING COUNT(DISTINCT symbol) >= $3
       )
       SELECT week_start, present_symbols, sym_count
       FROM co_occurring
       ORDER BY week_start DESC
       LIMIT 20`,
      [userId, symbolList, minOverlap],
    );

    return {
      windows: partialRows.map((r) => ({
        weekStart: new Date(r.week_start).toISOString().split("T")[0],
        presentSymbols: r.present_symbols,
        overlap: parseInt(r.sym_count),
        total: symbolList.length,
        partial: true,
      })),
      total: partialRows.length,
      searchedFor: symbolList,
      partial: true,
    };
  }

  // Group by week
  const windowMap = {};
  for (const r of rows) {
    const wk = new Date(r.week_start).toISOString().split("T")[0];
    if (!windowMap[wk]) {
      windowMap[wk] = {
        weekStart: wk,
        presentSymbols: r.present_symbols,
        stages: {},
        symbolDetail: {},
        totalEvents: 0,
      };
    }
    const count = parseInt(r.event_count);
    windowMap[wk].stages[r.stage] =
      (windowMap[wk].stages[r.stage] || 0) + count;
    windowMap[wk].symbolDetail[r.symbol] = {
      stage: r.stage,
      count,
    };
    windowMap[wk].totalEvents += count;
  }

  const windows = Object.values(windowMap)
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    .map((w) => {
      const domStage = Object.entries(w.stages).sort((a, b) => b[1] - a[1])[0];
      return {
        ...w,
        dominantStage: domStage?.[0] || null,
      };
    });

  return {
    windows,
    total: windows.length,
    searchedFor: symbolList,
    partial: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPEATED THRESHOLDS
//
// Detect when the same stage transition has happened before.
// "Has Crisis→Growth happened before? When? With which symbols?"
// ─────────────────────────────────────────────────────────────────────────────

export async function findRepeatedThresholds(
  userId,
  { fromStage, toStage, symbol } = {},
) {
  let query = `
    WITH ordered AS (
      SELECT id, symbol, stage, visual, source_type, created_at,
             LAG(stage) OVER (ORDER BY created_at, id) as prev_stage,
             LAG(symbol) OVER (ORDER BY created_at, id) as prev_symbol,
             LAG(created_at) OVER (ORDER BY created_at, id) as prev_time
      FROM symbol_events
      WHERE user_id = $1
      ORDER BY created_at
    )
    SELECT symbol, stage, prev_stage, prev_symbol,
           visual, source_type, created_at, prev_time
    FROM ordered
    WHERE prev_stage IS NOT NULL`;

  const params = [userId];
  let paramIdx = 2;

  if (fromStage) {
    query += ` AND prev_stage = $${paramIdx}`;
    params.push(fromStage);
    paramIdx++;
  }
  if (toStage) {
    query += ` AND stage = $${paramIdx}`;
    params.push(toStage);
    paramIdx++;
  }
  if (symbol) {
    query += ` AND (symbol = $${paramIdx} OR prev_symbol = $${paramIdx})`;
    params.push(symbol);
    paramIdx++;
  }

  query += ` ORDER BY created_at DESC LIMIT 50`;

  const rows = await sql(query, params);
  const archetypeMap = await loadArchetypeMap();

  // Group by transition type
  const transitionGroups = {};
  for (const r of rows) {
    const key = `${r.prev_stage}→${r.stage}`;
    if (!transitionGroups[key]) {
      transitionGroups[key] = {
        pattern: key,
        from: r.prev_stage,
        to: r.stage,
        occurrences: [],
      };
    }
    transitionGroups[key].occurrences.push({
      date: r.created_at,
      symbol: r.symbol,
      visual: archetypeMap[r.symbol]?.visual || r.visual || "",
      prevSymbol: r.prev_symbol,
      prevVisual: archetypeMap[r.prev_symbol]?.visual || "",
      source: r.source_type,
    });
  }

  const thresholds = Object.values(transitionGroups)
    .map((g) => ({
      ...g,
      count: g.occurrences.length,
      firstOccurrence: g.occurrences[g.occurrences.length - 1]?.date,
      lastOccurrence: g.occurrences[0]?.date,
      involvedSymbols: [
        ...new Set(
          g.occurrences.flatMap((o) =>
            [o.symbol, o.prevSymbol].filter(Boolean),
          ),
        ),
      ],
      narrative: `The ${g.pattern} threshold has been crossed ${g.occurrences.length} time${g.occurrences.length === 1 ? "" : "s"}. Symbols at this boundary: ${[...new Set(g.occurrences.map((o) => `${o.visual} ${o.symbol}`))].slice(0, 5).join(", ")}.`,
    }))
    .sort((a, b) => b.count - a.count);

  return { thresholds, total: thresholds.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TIMELINE COMPRESSION
//
// Compress the full timeline into its essential shape at different zoom levels.
// Returns the major phases, turning points, and dominant forces.
// ─────────────────────────────────────────────────────────────────────────────

export async function compressTimeline(userId) {
  const archetypeMap = await loadArchetypeMap();

  // Monthly compression
  const monthlyRows = await sql(
    `SELECT
       DATE_TRUNC('month', created_at) as month_start,
       stage, symbol,
       COUNT(*) as event_count,
       COUNT(DISTINCT DATE(created_at)) as active_days
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY month_start, stage, symbol
     ORDER BY month_start`,
    [userId],
  );

  if (monthlyRows.length === 0)
    return { months: [], quarters: [], fullArc: null };

  // Build monthly profiles
  const monthMap = {};
  for (const r of monthlyRows) {
    const m = new Date(r.month_start).toISOString().split("T")[0].slice(0, 7);
    if (!monthMap[m])
      monthMap[m] = {
        month: m,
        stages: {},
        symbols: {},
        events: 0,
        activeDays: 0,
        atmospheres: {},
      };
    const count = parseInt(r.event_count);
    monthMap[m].stages[r.stage] = (monthMap[m].stages[r.stage] || 0) + count;
    monthMap[m].symbols[r.symbol] =
      (monthMap[m].symbols[r.symbol] || 0) + count;
    monthMap[m].events += count;
    monthMap[m].activeDays += parseInt(r.active_days);

    const atm = archetypeMap[r.symbol]?.atmospheric_influence;
    if (atm)
      monthMap[m].atmospheres[atm] =
        (monthMap[m].atmospheres[atm] || 0) + count;
  }

  const months = Object.values(monthMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => {
      const domStage = Object.entries(m.stages).sort((a, b) => b[1] - a[1])[0];
      const domAtm = Object.entries(m.atmospheres).sort(
        (a, b) => b[1] - a[1],
      )[0];
      const topSyms = Object.entries(m.symbols)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([sym, count]) => ({
          symbol: sym,
          visual: archetypeMap[sym]?.visual || "",
          count,
        }));

      return {
        month: m.month,
        dominantStage: domStage?.[0] || null,
        dominantPercentage: domStage
          ? Math.round((domStage[1] / m.events) * 100)
          : 0,
        dominantAtmosphere: domAtm?.[0] || null,
        topSymbols: topSyms,
        totalEvents: m.events,
        stageDistribution: m.stages,
      };
    });

  // Quarter compression (group months into 3-month spans)
  const quarters = [];
  for (let i = 0; i < months.length; i += 3) {
    const chunk = months.slice(i, i + 3);
    if (chunk.length === 0) continue;

    const qStages = {};
    const qSymbols = {};
    let qEvents = 0;

    for (const m of chunk) {
      for (const [stage, count] of Object.entries(m.stageDistribution)) {
        qStages[stage] = (qStages[stage] || 0) + count;
      }
      for (const s of m.topSymbols) {
        qSymbols[s.symbol] = (qSymbols[s.symbol] || 0) + s.count;
      }
      qEvents += m.totalEvents;
    }

    const domStage = Object.entries(qStages).sort((a, b) => b[1] - a[1])[0];
    const topSyms = Object.entries(qSymbols)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sym, count]) => ({
        symbol: sym,
        visual: archetypeMap[sym]?.visual || "",
        count,
      }));

    quarters.push({
      period: `${chunk[0].month} → ${chunk[chunk.length - 1].month}`,
      months: chunk.map((c) => c.month),
      dominantStage: domStage?.[0] || null,
      topSymbols: topSyms,
      totalEvents: qEvents,
    });
  }

  // Full arc: first month vs last month summary
  const first = months[0];
  const last = months[months.length - 1];
  const fullArc = {
    from: {
      month: first.month,
      stage: first.dominantStage,
      atmosphere: first.dominantAtmosphere,
      topSymbol: first.topSymbols[0],
    },
    to: {
      month: last.month,
      stage: last.dominantStage,
      atmosphere: last.dominantAtmosphere,
      topSymbol: last.topSymbols[0],
    },
    totalMonths: months.length,
    stageShifted: first.dominantStage !== last.dominantStage,
    narrative:
      first.dominantStage !== last.dominantStage
        ? `Across ${months.length} months, the dominant stage shifted from ${first.dominantStage} to ${last.dominantStage}. The atmosphere moved from ${first.dominantAtmosphere || "undefined"} to ${last.dominantAtmosphere || "undefined"}.`
        : `Across ${months.length} months, ${first.dominantStage} has remained the dominant stage — a consistent thread through the timeline.`,
  };

  return { months, quarters, fullArc };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SYMBOLIC SEARCH
//
// Free-form retrieval: search for a symbol, stage, atmosphere, or pattern
// across all of symbolic history.
//
// This is the "ask anything" interface to memory.
// ─────────────────────────────────────────────────────────────────────────────

export async function symbolicSearch(userId, query) {
  if (!query || query.trim().length === 0) {
    return { results: [], interpretation: "No query provided." };
  }

  const q = query.trim().toLowerCase();
  const archetypeMap = await loadArchetypeMap();

  // Parse query intent
  const intent = parseSearchIntent(q, archetypeMap);

  let results = [];

  switch (intent.type) {
    case "symbol":
      results = await searchBySymbol(userId, intent.value, archetypeMap);
      break;
    case "stage":
      results = await searchByStage(userId, intent.value);
      break;
    case "atmosphere":
      results = await searchByAtmosphere(userId, intent.value, archetypeMap);
      break;
    case "transition":
      results = await searchByTransition(userId, intent.from, intent.to);
      break;
    case "time":
      results = await searchByTimeRange(
        userId,
        intent.startDate,
        intent.endDate,
        archetypeMap,
      );
      break;
    case "climate":
      results = await searchByClimate(userId, intent.value, archetypeMap);
      break;
    default:
      // Fuzzy: try symbol first, then stage, then atmosphere
      results = await fuzzySearch(userId, q, archetypeMap);
      break;
  }

  return {
    results,
    interpretation: intent.interpretation,
    queryType: intent.type,
    total: results.length,
  };
}

function parseSearchIntent(q, archetypeMap) {
  // Check for known symbol names FIRST (before transition regex)
  const matchedSymbol = Object.keys(archetypeMap).find(
    (s) =>
      q === s.toLowerCase() ||
      q.startsWith(s.toLowerCase() + " ") ||
      q.endsWith(" " + s.toLowerCase()),
  );
  if (matchedSymbol) {
    return {
      type: "symbol",
      value: matchedSymbol,
      interpretation: `Searching for ${archetypeMap[matchedSymbol]?.visual || ""} ${matchedSymbol} across your history.`,
    };
  }

  // Check for known stage names BEFORE transition regex
  const stages = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];
  const exactStageMatch = stages.find((s) => q === s.toLowerCase());
  if (exactStageMatch) {
    return {
      type: "stage",
      value: exactStageMatch,
      interpretation: `Searching for all ${exactStageMatch} appearances in your history.`,
    };
  }

  // Check for transition pattern: "X → Y" or "X -> Y" or "X to Y"
  // Only match when both sides are known stages
  const transMatch = q.match(/(\w+)\s*(?:→|->)\s*(\w+)/i);
  if (transMatch) {
    return {
      type: "transition",
      from: capitalizeFirst(transMatch[1]),
      to: capitalizeFirst(transMatch[2]),
      interpretation: `Searching for ${capitalizeFirst(transMatch[1])} → ${capitalizeFirst(transMatch[2])} transitions.`,
    };
  }
  // "X to Y" only when both sides are known stages
  const toMatch = q.match(/^(\w+)\s+to\s+(\w+)$/i);
  if (toMatch) {
    const fromCap = capitalizeFirst(toMatch[1]);
    const toCap = capitalizeFirst(toMatch[2]);
    const fromIsStage = stages.includes(fromCap);
    const toIsStage = stages.includes(toCap);
    if (fromIsStage && toIsStage) {
      return {
        type: "transition",
        from: fromCap,
        to: toCap,
        interpretation: `Searching for ${fromCap} → ${toCap} transitions.`,
      };
    }
  }

  // Check for stage names mentioned within longer queries
  const matchedStage = stages.find((s) => q.includes(s.toLowerCase()));
  if (matchedStage) {
    return {
      type: "stage",
      value: matchedStage,
      interpretation: `Searching for all ${matchedStage} appearances in your history.`,
    };
  }

  // Check for symbol names mentioned within longer queries
  const partialSymbol = Object.keys(archetypeMap).find((s) =>
    q.includes(s.toLowerCase()),
  );
  if (partialSymbol) {
    return {
      type: "symbol",
      value: partialSymbol,
      interpretation: `Searching for ${archetypeMap[partialSymbol]?.visual || ""} ${partialSymbol} across your history.`,
    };
  }

  // Check for atmosphere terms
  const atmospheres = [
    "turbulent",
    "hushed",
    "luminous",
    "electric",
    "magnetic",
    "illuminating",
    "rooted",
    "generative",
    "convergent",
    "radiant",
    "emergent",
    "fragmented",
    "still",
    "mixed",
  ];
  const matchedAtm = atmospheres.find((a) => q.includes(a));
  if (matchedAtm) {
    return {
      type: "atmosphere",
      value: matchedAtm,
      interpretation: `Searching for periods with ${matchedAtm} atmosphere.`,
    };
  }

  // Check for climate terms
  const climateTerms = [
    "turbulent",
    "generative",
    "fragmented",
    "convergent",
    "radiant",
    "emergent",
  ];
  const matchedClimate = climateTerms.find((c) => q.includes(c));
  if (matchedClimate) {
    return {
      type: "climate",
      value: matchedClimate,
      interpretation: `Searching for ${matchedClimate} climate periods.`,
    };
  }

  // Check for time-related terms
  const timePatterns = [
    {
      regex: /last\s+(\d+)\s+weeks?/i,
      handler: (m) => ({
        startDate: weeksAgo(parseInt(m[1])),
        endDate: today(),
      }),
    },
    {
      regex: /last\s+(\d+)\s+months?/i,
      handler: (m) => ({
        startDate: monthsAgo(parseInt(m[1])),
        endDate: today(),
      }),
    },
    {
      regex: /(\d{4}-\d{2})/i,
      handler: (m) => ({ startDate: `${m[1]}-01`, endDate: `${m[1]}-31` }),
    },
  ];
  for (const tp of timePatterns) {
    const match = q.match(tp.regex);
    if (match) {
      const range = tp.handler(match);
      return {
        type: "time",
        startDate: range.startDate,
        endDate: range.endDate,
        interpretation: `Searching events from ${range.startDate} to ${range.endDate}.`,
      };
    }
  }

  return {
    type: "fuzzy",
    value: q,
    interpretation: `Searching across your symbolic history for "${q}".`,
  };
}

async function searchBySymbol(userId, symbol, archetypeMap) {
  const rows = await sql(
    `SELECT symbol, stage, source_type, visual, note,
            DATE(created_at) as event_date,
            DATE_TRUNC('week', created_at) as week_start,
            COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1 AND LOWER(symbol) = LOWER($2)
     GROUP BY symbol, stage, source_type, visual, note, event_date, week_start
     ORDER BY event_date DESC
     LIMIT 50`,
    [userId, symbol],
  );

  const arch = archetypeMap[symbol];

  // Summary stats
  const stageCounts = {};
  let total = 0;
  for (const r of rows) {
    const count = parseInt(r.event_count);
    stageCounts[r.stage] = (stageCounts[r.stage] || 0) + count;
    total += count;
  }

  // Gravity data
  const gravityRows = await sql(
    `SELECT weight, peak_weight, anchored, first_seen, last_seen, count as total_count
     FROM symbol_gravity
     WHERE user_id = $1 AND symbol = $2`,
    [userId, symbol],
  );

  const gravity = gravityRows[0] || null;

  return [
    {
      type: "symbol_history",
      symbol,
      visual: arch?.visual || "",
      stage: arch?.stage || "",
      totalAppearances: total,
      stageDistribution: stageCounts,
      gravity: gravity
        ? {
            currentWeight: parseFloat(gravity.weight),
            peakWeight: parseFloat(gravity.peak_weight),
            anchored: gravity.anchored,
            firstSeen: gravity.first_seen,
            lastSeen: gravity.last_seen,
          }
        : null,
      recentAppearances: rows.slice(0, 10).map((r) => ({
        date: r.event_date,
        stage: r.stage,
        source: r.source_type,
        count: parseInt(r.event_count),
      })),
      narrative: `${arch?.visual || ""} ${symbol} has appeared ${total} times in your symbolic history. ${Object.entries(
        stageCounts,
      )
        .map(([s, c]) => `${s}: ${c}`)
        .join(
          ", ",
        )}. ${gravity?.anchored ? "This symbol is permanently anchored." : gravity ? `Current weight: ${parseFloat(gravity.weight).toFixed(1)}.` : ""}`,
    },
  ];
}

async function searchByStage(userId, stage) {
  const rows = await sql(
    `SELECT symbol, stage, DATE_TRUNC('week', created_at) as week_start,
            COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1 AND stage = $2
     GROUP BY symbol, stage, week_start
     ORDER BY week_start DESC
     LIMIT 100`,
    [userId, stage],
  );

  // Group by week
  const weekMap = {};
  for (const r of rows) {
    const wk = new Date(r.week_start).toISOString().split("T")[0];
    if (!weekMap[wk]) weekMap[wk] = { week: wk, symbols: [], totalEvents: 0 };
    weekMap[wk].symbols.push({
      symbol: r.symbol,
      count: parseInt(r.event_count),
    });
    weekMap[wk].totalEvents += parseInt(r.event_count);
  }

  const weeks = Object.values(weekMap).sort((a, b) =>
    b.week.localeCompare(a.week),
  );

  return [
    {
      type: "stage_history",
      stage,
      totalWeeks: weeks.length,
      recentWeeks: weeks.slice(0, 15),
      narrative: `${stage} energy has been active across ${weeks.length} weeks. Most recent: ${weeks
        .slice(0, 3)
        .map((w) => `${w.week} (${w.totalEvents} events)`)
        .join(", ")}.`,
    },
  ];
}

async function searchByAtmosphere(userId, atmosphere, archetypeMap) {
  // Find symbols with this atmosphere
  const matchingSymbols = Object.entries(archetypeMap)
    .filter(
      ([, arch]) =>
        arch.atmospheric_influence?.toLowerCase() === atmosphere.toLowerCase(),
    )
    .map(([sym]) => sym);

  if (matchingSymbols.length === 0) {
    return [
      {
        type: "no_results",
        narrative: `No symbols found with "${atmosphere}" atmosphere.`,
      },
    ];
  }

  const rows = await sql(
    `SELECT symbol, stage, DATE_TRUNC('week', created_at) as week_start,
            COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1 AND symbol = ANY($2)
     GROUP BY symbol, stage, week_start
     ORDER BY week_start DESC
     LIMIT 100`,
    [userId, matchingSymbols],
  );

  const weekMap = {};
  for (const r of rows) {
    const wk = new Date(r.week_start).toISOString().split("T")[0];
    if (!weekMap[wk]) weekMap[wk] = { week: wk, symbols: new Set(), events: 0 };
    weekMap[wk].symbols.add(r.symbol);
    weekMap[wk].events += parseInt(r.event_count);
  }

  const weeks = Object.values(weekMap)
    .sort((a, b) => b.week.localeCompare(a.week))
    .map((w) => ({ ...w, symbols: [...w.symbols] }));

  return [
    {
      type: "atmosphere_history",
      atmosphere,
      matchingSymbols: matchingSymbols.map((s) => ({
        symbol: s,
        visual: archetypeMap[s]?.visual || "",
      })),
      totalWeeks: weeks.length,
      recentWeeks: weeks.slice(0, 15),
      narrative: `The "${atmosphere}" atmosphere (carried by ${matchingSymbols.map((s) => `${archetypeMap[s]?.visual || ""} ${s}`).join(", ")}) has been active across ${weeks.length} weeks.`,
    },
  ];
}

async function searchByTransition(userId, fromStage, toStage) {
  const result = await findRepeatedThresholds(userId, { fromStage, toStage });
  return result.thresholds.map((t) => ({
    type: "threshold_history",
    ...t,
  }));
}

async function searchByTimeRange(userId, startDate, endDate, archetypeMap) {
  const rows = await sql(
    `SELECT symbol, stage, source_type, DATE(created_at) as event_date,
            COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1
       AND created_at >= $2::date AND created_at < ($3::date + interval '1 day')
     GROUP BY symbol, stage, source_type, event_date
     ORDER BY event_date DESC`,
    [userId, startDate, endDate],
  );

  const profile = buildPeriodProfile(
    rows,
    { startDate, endDate },
    archetypeMap,
  );

  return [
    {
      type: "time_range",
      startDate,
      endDate,
      ...profile,
      narrative: `From ${startDate} to ${endDate}: ${profile.totalEvents} events, dominant stage ${profile.dominantStage || "mixed"} (${profile.dominantPercentage}%), atmosphere ${profile.dominantAtmosphere || "undefined"}. Top symbols: ${profile.topSymbols
        .slice(0, 5)
        .map((s) => `${s.visual} ${s.symbol}`)
        .join(", ")}.`,
    },
  ];
}

async function searchByClimate(userId, climate, archetypeMap) {
  const result = await retrievePriorClimates(userId, { climate, limit: 10 });
  return result.periods.map((p) => ({
    type: "climate_period",
    ...p,
  }));
}

async function fuzzySearch(userId, q, archetypeMap) {
  // Try matching against symbol names first
  const symbolMatch = Object.keys(archetypeMap).find((s) =>
    s.toLowerCase().includes(q),
  );
  if (symbolMatch) return searchBySymbol(userId, symbolMatch, archetypeMap);

  // Try stage
  const stages = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];
  const stageMatch = stages.find((s) => s.toLowerCase().includes(q));
  if (stageMatch) return searchByStage(userId, stageMatch);

  // Try note search
  const noteRows = await sql(
    `SELECT symbol, stage, note, created_at
     FROM symbol_events
     WHERE user_id = $1 AND LOWER(note) LIKE $2
     ORDER BY created_at DESC
     LIMIT 20`,
    [userId, `%${q}%`],
  );

  if (noteRows.length > 0) {
    return [
      {
        type: "note_search",
        query: q,
        results: noteRows.map((r) => ({
          symbol: r.symbol,
          visual: archetypeMap[r.symbol]?.visual || "",
          stage: r.stage,
          note: r.note,
          date: r.created_at,
        })),
        narrative: `Found ${noteRows.length} events matching "${q}" in notes.`,
      },
    ];
  }

  return [
    {
      type: "no_results",
      narrative: `No symbolic memory found matching "${q}". Try a symbol name, stage, or atmosphere.`,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

let _archetypeCache = null;
async function loadArchetypeMap() {
  if (_archetypeCache) return _archetypeCache;
  const rows = await sql(`SELECT * FROM symbol_archetypes ORDER BY id`);
  const map = {};
  for (const a of rows) map[a.symbol] = a;
  _archetypeCache = map;
  // Invalidate after 60s (serverless function lifetime)
  setTimeout(() => {
    _archetypeCache = null;
  }, 60000);
  return map;
}

function buildWeeklyProfiles(rows, archetypeMap) {
  const weekMap = {};
  for (const r of rows) {
    const wk = new Date(r.week_start).toISOString().split("T")[0];
    if (!weekMap[wk])
      weekMap[wk] = {
        week: wk,
        stages: {},
        symbols: new Set(),
        events: 0,
        atmospheres: {},
      };
    const count = parseInt(r.event_count);
    weekMap[wk].stages[r.stage] = (weekMap[wk].stages[r.stage] || 0) + count;
    weekMap[wk].symbols.add(r.symbol);
    weekMap[wk].events += count;

    const atm = archetypeMap[r.symbol]?.atmospheric_influence;
    if (atm)
      weekMap[wk].atmospheres[atm] =
        (weekMap[wk].atmospheres[atm] || 0) + count;
  }
  return Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week));
}

function classifyWeekClimate(week, archetypeMap) {
  const domStage = Object.entries(week.stages).sort((a, b) => b[1] - a[1])[0];
  const domAtm = Object.entries(week.atmospheres || {}).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const stageCount = Object.keys(week.stages).length;
  const pct = domStage ? Math.round((domStage[1] / week.events) * 100) : 0;

  let climate;
  if (stageCount >= 4) climate = "fragmented";
  else if (domStage && domStage[0] === "Crisis" && pct > 50)
    climate = "turbulent";
  else if (domStage && domStage[0] === "Growth" && pct > 40)
    climate = "generative";
  else if (domStage && domStage[0] === "Integration" && pct > 40)
    climate = "convergent";
  else if (domStage && domStage[0] === "Mastery" && pct > 40)
    climate = "radiant";
  else if (domStage && domStage[0] === "Awakening" && pct > 40)
    climate = "emergent";
  else if (domAtm) climate = domAtm[0];
  else climate = "mixed";

  return {
    week: week.week,
    climate,
    dominantStage: domStage?.[0] || null,
    dominantAtmosphere: domAtm?.[0] || null,
    stageCount,
    events: week.events,
    symbols: [...week.symbols],
  };
}

function groupIntoPeriods(classified) {
  if (classified.length === 0) return [];
  const periods = [];
  let current = {
    climate: classified[0].climate,
    startDate: classified[0].week,
    endDate: classified[0].week,
    weeks: [classified[0]],
    dominantStage: classified[0].dominantStage,
    dominantAtmosphere: classified[0].dominantAtmosphere,
    totalEvents: classified[0].events,
    topSymbols: new Set(classified[0].symbols),
  };

  for (let i = 1; i < classified.length; i++) {
    const w = classified[i];
    if (w.climate === current.climate) {
      current.weeks.push(w);
      current.endDate = w.week;
      current.totalEvents += w.events;
      for (const s of w.symbols) current.topSymbols.add(s);
    } else {
      current.topSymbols = [...current.topSymbols];
      periods.push(current);
      current = {
        climate: w.climate,
        startDate: w.week,
        endDate: w.week,
        weeks: [w],
        dominantStage: w.dominantStage,
        dominantAtmosphere: w.dominantAtmosphere,
        totalEvents: w.events,
        topSymbols: new Set(w.symbols),
      };
    }
  }
  current.topSymbols = [...current.topSymbols];
  periods.push(current);
  return periods;
}

function buildClimateNarrative(period) {
  const symText = period.topSymbols.slice(0, 4).join(", ");
  return `${period.climate} period (${period.weeks.length} week${period.weeks.length === 1 ? "" : "s"}): ${period.startDate} → ${period.endDate}. ${period.totalEvents} events, dominant stage ${period.dominantStage || "mixed"}. Active symbols: ${symText}.`;
}

function capitalizeFirst(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function weeksAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n * 7);
  return d.toISOString().split("T")[0];
}

function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().split("T")[0];
}
