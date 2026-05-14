/**
 * RECURRING EMOTIONAL CLIMATES
 *
 * Moves beyond "current atmosphere" toward "historically recurring atmospheres."
 * Identifies atmospheric patterns that keep returning — emotional seasonality.
 *
 * Examples:
 *   - "turbulent but regenerative"
 *   - "fragmented during transition"
 *   - "converging before breakthroughs"
 *   - "dormant after conflict cycles"
 */

import sql from "@/app/api/utils/sql";
import { CONFIDENCE } from "./config";

export async function computeEmotionalClimates(userId, archetypeMap) {
  // Get weekly atmospheric snapshots
  const rows = await sql(
    `SELECT
       se.symbol,
       se.stage,
       DATE_TRUNC('week', se.created_at) as week_start,
       COUNT(*) as event_count
     FROM symbol_events se
     WHERE se.user_id = $1
     GROUP BY se.symbol, se.stage, week_start
     ORDER BY week_start`,
    [userId],
  );

  if (rows.length === 0) return { climates: [], dominantClimate: null };

  // Build per-week atmospheric profiles
  const weeklyProfiles = {};
  for (const row of rows) {
    const week = row.week_start;
    if (!weeklyProfiles[week]) {
      weeklyProfiles[week] = {
        week,
        atmospheres: {},
        stages: {},
        symbols: [],
        totalEvents: 0,
      };
    }
    const wp = weeklyProfiles[week];
    wp.totalEvents += parseInt(row.event_count);
    wp.stages[row.stage] =
      (wp.stages[row.stage] || 0) + parseInt(row.event_count);
    wp.symbols.push(row.symbol);

    // Map symbol to atmospheric influence
    const arch = archetypeMap[row.symbol];
    if (arch?.atmospheric_influence) {
      const atm = arch.atmospheric_influence;
      wp.atmospheres[atm] =
        (wp.atmospheres[atm] || 0) + parseInt(row.event_count);
    }
  }

  // Classify each week into a climate
  const weeklyClimates = [];
  for (const wp of Object.values(weeklyProfiles)) {
    const dominantAtm = Object.entries(wp.atmospheres).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const dominantStage = Object.entries(wp.stages).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const stageCount = Object.keys(wp.stages).length;

    let climate;
    if (!dominantAtm && !dominantStage) {
      climate = "still";
    } else if (stageCount >= 4) {
      climate = "fragmented";
    } else if (
      dominantStage &&
      dominantStage[0] === "Crisis" &&
      dominantStage[1] / wp.totalEvents > 0.5
    ) {
      climate = "turbulent";
    } else if (
      dominantStage &&
      dominantStage[0] === "Growth" &&
      dominantStage[1] / wp.totalEvents > 0.4
    ) {
      climate = "generative";
    } else if (
      dominantStage &&
      dominantStage[0] === "Integration" &&
      dominantStage[1] / wp.totalEvents > 0.4
    ) {
      climate = "convergent";
    } else if (
      dominantStage &&
      dominantStage[0] === "Mastery" &&
      dominantStage[1] / wp.totalEvents > 0.4
    ) {
      climate = "radiant";
    } else if (
      dominantStage &&
      dominantStage[0] === "Awakening" &&
      dominantStage[1] / wp.totalEvents > 0.4
    ) {
      climate = "emergent";
    } else if (dominantAtm) {
      climate = dominantAtm[0];
    } else {
      climate = "mixed";
    }

    weeklyClimates.push({
      week: wp.week,
      climate,
      dominantStage: dominantStage ? dominantStage[0] : null,
      dominantAtmosphere: dominantAtm ? dominantAtm[0] : null,
      stageCount,
      eventCount: wp.totalEvents,
    });
  }

  // Count climate recurrences
  const climateCounts = {};
  for (const wc of weeklyClimates) {
    climateCounts[wc.climate] = (climateCounts[wc.climate] || 0) + 1;
  }

  const totalWeeks = weeklyClimates.length;
  const climates = Object.entries(climateCounts)
    .map(([climate, count]) => {
      const percentage = Math.round((count / totalWeeks) * 100);

      // Determine confidence
      let confidence;
      if (count >= 8 && percentage >= 30) confidence = CONFIDENCE.FOUNDATIONAL;
      else if (count >= 5 && percentage >= 20)
        confidence = CONFIDENCE.ESTABLISHED;
      else if (count >= 3 && percentage >= 15)
        confidence = CONFIDENCE.RECURRING;
      else if (count >= 2) confidence = CONFIDENCE.EMERGING;
      else return null;

      const narrativeMap = {
        turbulent: `Your emotional climate is frequently turbulent — ${count} out of ${totalWeeks} weeks carry heavy crisis energy. This isn't a flaw; turbulence is often where your deepest work happens.`,
        generative: `Generative warmth is a recurring climate — ${count} out of ${totalWeeks} weeks are marked by growth momentum. Your symbolic field naturally tends toward building.`,
        convergent: `Convergent clarity recurs in your field — ${count} out of ${totalWeeks} weeks show integration energy. You have a natural tendency to assemble meaning from chaos.`,
        fragmented: `Fragmentation is a recurring state — ${count} out of ${totalWeeks} weeks show multiple competing energies. This may reflect a life in active transition, or a pattern of avoiding resolution.`,
        radiant: `Radiant mastery appears in ${count} out of ${totalWeeks} weeks. Periods of genuine accomplishment and integration are part of your emotional climate.`,
        emergent: `Emergent awakening recurs — ${count} out of ${totalWeeks} weeks carry that fresh, beginning energy. Your field is characterized by new starts.`,
        mixed: `A mixed, shifting climate appears in ${count} out of ${totalWeeks} weeks. Your emotional weather resists simple categorization.`,
        still: `Stillness — ${count} out of ${totalWeeks} weeks with minimal symbolic activity. These quiet periods may be rest, dormancy, or suppression.`,
      };

      return {
        climate,
        weekCount: count,
        totalWeeks,
        percentage,
        confidence,
        narrative:
          narrativeMap[climate] ||
          `The "${climate}" atmosphere has recurred ${count} times across ${totalWeeks} weeks of symbolic history.`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.weekCount - a.weekCount);

  // Identify the dominant climate
  const dominantClimate = climates.length > 0 ? climates[0] : null;

  // Detect compound climates (e.g., "turbulent but regenerative")
  const compoundClimates = [];
  if (climates.length >= 2) {
    const top2 = climates.slice(0, 2);
    // Check if these two climates alternate or co-exist
    const totalTop2 = top2[0].weekCount + top2[1].weekCount;
    if (totalTop2 / totalWeeks >= 0.5) {
      compoundClimates.push({
        primary: top2[0].climate,
        secondary: top2[1].climate,
        label: `${top2[0].climate} but ${top2[1].climate}`,
        narrative: `Your emotional climate oscillates between ${top2[0].climate} and ${top2[1].climate} — together they account for ${Math.round((totalTop2 / totalWeeks) * 100)}% of your symbolic weeks. This compound climate may be your characteristic rhythm.`,
        confidence: top2[0].confidence,
      });
    }
  }

  return {
    climates,
    compoundClimates,
    dominantClimate,
    weeklyClimates,
    totalWeeks,
  };
}
