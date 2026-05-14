/**
 * SYMBOLIC SEASONS
 *
 * Long-form transformation climates. Instead of "current state," the system
 * understands periods of sustained atmospheric coherence. Named eras that
 * give temporal meaning without rigidity.
 *
 * Examples:
 *   - Season of Dissolution (sustained Crisis)
 *   - Season of Integration (sustained convergence)
 *   - Season of Thresholds (frequent stage transitions)
 *   - Season of Emergence (sustained Awakening)
 *   - Season of Reconstruction (Growth after Crisis)
 */

import sql from "@/app/api/utils/sql";
import { CONFIDENCE, SEASON_MIN_DAYS } from "./config";

export async function computeSymbolicSeasons(userId, archetypeMap) {
  // Get daily stage distribution
  const rows = await sql(
    `SELECT DATE(created_at) as event_date, stage, symbol,
            COUNT(*) as event_count
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY event_date, stage, symbol
     ORDER BY event_date`,
    [userId],
  );

  if (rows.length === 0) return [];

  // Build weekly windows
  const weeks = {};
  for (const row of rows) {
    const date = new Date(row.event_date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        start: weekKey,
        stages: {},
        symbols: new Set(),
        events: 0,
      };
    }
    weeks[weekKey].stages[row.stage] =
      (weeks[weekKey].stages[row.stage] || 0) + parseInt(row.event_count);
    weeks[weekKey].symbols.add(row.symbol);
    weeks[weekKey].events += parseInt(row.event_count);
  }

  const weekList = Object.values(weeks).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  if (weekList.length < 2) return [];

  // Detect seasons: consecutive weeks with similar dominant stage or atmosphere
  const seasons = [];
  let currentSeason = null;

  for (let i = 0; i < weekList.length; i++) {
    const week = weekList[i];
    const dominant = Object.entries(week.stages).sort((a, b) => b[1] - a[1])[0];
    if (!dominant) continue;

    const dominantStage = dominant[0];
    const dominantPct = Math.round((dominant[1] / week.events) * 100);
    const stageCount = Object.keys(week.stages).length;

    // Classify this week's character
    let weekCharacter;
    if (dominantPct >= 50) {
      weekCharacter = dominantStage;
    } else if (stageCount >= 4) {
      weekCharacter = "Threshold"; // fragmented = many transitions
    } else {
      weekCharacter = "Mixed";
    }

    if (currentSeason && currentSeason.character === weekCharacter) {
      // Extend current season
      currentSeason.weeks.push(week);
      currentSeason.endDate = week.start;
      for (const sym of week.symbols) currentSeason.symbols.add(sym);
      for (const [stage, count] of Object.entries(week.stages)) {
        currentSeason.stages[stage] =
          (currentSeason.stages[stage] || 0) + count;
      }
      currentSeason.totalEvents += week.events;
    } else {
      // Save previous season if it meets minimum duration
      if (currentSeason && currentSeason.weeks.length * 7 >= SEASON_MIN_DAYS) {
        seasons.push(finalizeSeason(currentSeason, archetypeMap));
      }
      // Start new season
      currentSeason = {
        character: weekCharacter,
        startDate: week.start,
        endDate: week.start,
        weeks: [week],
        stages: { ...week.stages },
        symbols: new Set(week.symbols),
        totalEvents: week.events,
      };
    }
  }

  // Don't forget the last season
  if (currentSeason && currentSeason.weeks.length * 7 >= SEASON_MIN_DAYS) {
    seasons.push(finalizeSeason(currentSeason, archetypeMap));
  }

  // Mark the current season (most recent)
  if (seasons.length > 0) {
    const now = new Date().toISOString().split("T")[0];
    const lastSeason = seasons[seasons.length - 1];
    const lastSeasonEnd = new Date(lastSeason.endDate);
    const daysSinceEnd =
      (new Date(now) - lastSeasonEnd) / (1000 * 60 * 60 * 24);
    if (daysSinceEnd <= 14) {
      lastSeason.isCurrent = true;
    }
  }

  return seasons;
}

function finalizeSeason(raw, archetypeMap) {
  const durationDays = raw.weeks.length * 7;
  const durationWeeks = raw.weeks.length;

  // Name the season
  const nameMap = {
    Crisis: "Season of Dissolution",
    Growth: "Season of Cultivation",
    Integration: "Season of Convergence",
    Mastery: "Season of Radiance",
    Awakening: "Season of Emergence",
    Threshold: "Season of Thresholds",
    Mixed: "Season of Flux",
  };

  const name = nameMap[raw.character] || `Season of ${raw.character}`;

  // Dominant symbols in this season
  const symbolList = [...raw.symbols];

  // Stage distribution
  const stageEntries = Object.entries(raw.stages).sort((a, b) => b[1] - a[1]);
  const dominantStage = stageEntries[0];
  const dominantPct = dominantStage
    ? Math.round((dominantStage[1] / raw.totalEvents) * 100)
    : 0;

  // Confidence
  let confidence;
  if (durationWeeks >= 8) confidence = CONFIDENCE.ESTABLISHED;
  else if (durationWeeks >= 4) confidence = CONFIDENCE.RECURRING;
  else confidence = CONFIDENCE.EMERGING;

  // Narrative
  const narrativeMap = {
    "Season of Dissolution": `A sustained period of ${raw.character.toLowerCase()} energy lasting ${durationWeeks} weeks. Old structures are being dismantled. This season asks: what must fall away to make room for what comes next?`,
    "Season of Cultivation": `${durationWeeks} weeks of active growth. Seeds planted earlier are taking root. This season rewards patience and consistent attention.`,
    "Season of Convergence": `A ${durationWeeks}-week period where scattered threads are being woven together. Meaning is assembling itself from earlier experiences.`,
    "Season of Radiance": `${durationWeeks} weeks of mastery energy. Hard-won wisdom is expressing itself. This season asks: how do you share what you've learned?`,
    "Season of Emergence": `A ${durationWeeks}-week awakening period. Something new is stirring. This season is delicate — protect what's emerging without forcing it.`,
    "Season of Thresholds": `${durationWeeks} weeks of fragmented, transitional energy. Many stages active simultaneously. You are between worlds — multiple transformations unfolding at once.`,
    "Season of Flux": `${durationWeeks} weeks without a dominant pattern. The field is in motion but without a clear direction. Sometimes the most important seasons are the ones that resist naming.`,
  };

  return {
    name,
    character: raw.character,
    startDate: raw.startDate,
    endDate: raw.endDate,
    durationWeeks,
    durationDays,
    confidence,
    isCurrent: false,
    dominantStage: dominantStage ? dominantStage[0] : null,
    dominantPercentage: dominantPct,
    stageDistribution: raw.stages,
    symbolCount: symbolList.length,
    topSymbols: symbolList.slice(0, 5),
    totalEvents: raw.totalEvents,
    narrative:
      narrativeMap[name] ||
      `A ${durationWeeks}-week period characterized by ${raw.character.toLowerCase()} energy.`,
  };
}
