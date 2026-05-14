/**
 * TRANSFORMATION TENDENCIES
 *
 * Observed movement patterns — how this person characteristically transforms.
 * Not predictions. Observed tendencies.
 *
 * Examples:
 *   - "tends toward Crisis after suppression"
 *   - "stabilizes through reflection (Mirror → Scale)"
 *   - "repeatedly enters Awakening after withdrawal"
 *   - "resolves fragmentation through connection"
 */

import sql from "@/app/api/utils/sql";
import { STAGE_RANK } from "@/app/api/utils/memoryRules";
import { CONFIDENCE } from "./config";

export async function computeTransformationTendencies(userId) {
  // Get stage transition patterns
  const transitionRows = await sql(
    `WITH ordered AS (
       SELECT stage, created_at,
              LAG(stage) OVER (ORDER BY created_at, id) as prev_stage,
              LAG(created_at) OVER (ORDER BY created_at, id) as prev_time
       FROM symbol_events
       WHERE user_id = $1
       ORDER BY created_at
     )
     SELECT prev_stage as from_stage, stage as to_stage,
            COUNT(*) as transitions,
            ROUND(AVG(EXTRACT(EPOCH FROM (created_at - prev_time)) / 86400), 1) as avg_days
     FROM ordered
     WHERE prev_stage IS NOT NULL AND prev_stage != stage
       AND EXTRACT(EPOCH FROM (created_at - prev_time)) >= 43200
     GROUP BY prev_stage, stage
     HAVING COUNT(*) >= 2
     ORDER BY transitions DESC`,
    [userId],
  );

  if (transitionRows.length === 0) return [];

  // Find the most characteristic transition patterns
  const totalTransitions = transitionRows.reduce(
    (sum, r) => sum + parseInt(r.transitions),
    0,
  );

  const tendencies = [];

  for (const row of transitionRows) {
    const from = row.from_stage;
    const to = row.to_stage;
    const count = parseInt(row.transitions);
    const avgDays = parseFloat(row.avg_days);
    const percentage = Math.round((count / totalTransitions) * 100);

    const fromRank = STAGE_RANK[from] ?? 0;
    const toRank = STAGE_RANK[to] ?? 0;
    const isAscending = toRank > fromRank;
    const isDescending = toRank < fromRank;
    const depth = Math.abs(toRank - fromRank);

    // Confidence based on recurrence
    let confidence;
    if (count >= 8 && percentage >= 15) confidence = CONFIDENCE.FOUNDATIONAL;
    else if (count >= 5 && percentage >= 10)
      confidence = CONFIDENCE.ESTABLISHED;
    else if (count >= 3) confidence = CONFIDENCE.RECURRING;
    else confidence = CONFIDENCE.EMERGING;

    // Classify the tendency
    let tendencyType;
    let narrative;

    if (isDescending && depth >= 2) {
      tendencyType = "deep_regression";
      narrative = `You have a tendency toward deep regression: ${from} → ${to} (${count} times, avg ${avgDays} days). This ${depth}-stage drop is significant. ${count >= 5 ? "This is one of your most characteristic movements — a defining pattern of how you encounter difficulty." : "This pattern is still forming but worth watching."}`;
    } else if (isDescending) {
      tendencyType = "regression";
      narrative = `You tend to move from ${from} back to ${to} (${count} times). This backward step happens on average every ${avgDays} days. ${from === "Integration" && to === "Crisis" ? "Integration triggering crisis suggests that assembling meaning sometimes opens wounds that weren't fully healed." : `Something in ${from} consistently destabilizes toward ${to}.`}`;
    } else if (isAscending && depth >= 2) {
      tendencyType = "leap";
      narrative = `You have a tendency toward transformational leaps: ${from} → ${to} (${count} times). Skipping ${depth - 1} stage${depth > 2 ? "s" : ""} suggests you sometimes breakthrough rapidly when conditions align.`;
    } else if (isAscending) {
      tendencyType = "ascent";
      narrative = `${from} reliably leads to ${to} in your symbolic life (${count} times, avg ${avgDays} days). This is one of your natural upward pathways — a characteristic way you grow.`;
    } else {
      tendencyType = "lateral";
      narrative = `You move laterally between ${from} and ${to} (${count} times). This sideways movement suggests these stages function similarly in your experience.`;
    }

    tendencies.push({
      from,
      to,
      tendencyType,
      direction: isAscending
        ? "ascending"
        : isDescending
          ? "descending"
          : "lateral",
      depth,
      count,
      totalTransitions,
      percentage,
      avgDays,
      confidence,
      narrative,
    });
  }

  // Add composite tendencies (meta-patterns)
  const compositeTendencies = [];

  // Check: "stabilizes through X" — does one stage consistently lead upward?
  const ascendingFrom = {};
  for (const t of tendencies.filter((t) => t.direction === "ascending")) {
    ascendingFrom[t.from] = (ascendingFrom[t.from] || 0) + t.count;
  }
  const bestStabilizer = Object.entries(ascendingFrom).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (bestStabilizer && bestStabilizer[1] >= 5) {
    compositeTendencies.push({
      type: "stabilizer",
      stage: bestStabilizer[0],
      strength: bestStabilizer[1],
      confidence:
        bestStabilizer[1] >= 10 ? CONFIDENCE.ESTABLISHED : CONFIDENCE.RECURRING,
      narrative: `You characteristically stabilize through ${bestStabilizer[0]}. When you enter this stage, upward movement follows reliably (${bestStabilizer[1]} upward transitions from ${bestStabilizer[0]}).`,
    });
  }

  // Check: "crisis trigger" — what stage most consistently leads to crisis?
  const crisisTriggers = tendencies.filter(
    (t) => t.to === "Crisis" && t.count >= 3,
  );
  if (crisisTriggers.length > 0) {
    const topTrigger = crisisTriggers[0];
    compositeTendencies.push({
      type: "crisis_trigger",
      stage: topTrigger.from,
      strength: topTrigger.count,
      confidence: topTrigger.confidence,
      narrative: `${topTrigger.from} is your most common gateway to Crisis (${topTrigger.count} times). This doesn't mean ${topTrigger.from} is dangerous — but something in how you experience ${topTrigger.from.toLowerCase()} tends to open the door to disruption.`,
    });
  }

  // Check: "recovery pattern" — how do you characteristically exit Crisis?
  const crisisExits = tendencies.filter((t) => t.from === "Crisis");
  if (crisisExits.length > 0) {
    const topExit = crisisExits[0];
    compositeTendencies.push({
      type: "recovery_pattern",
      stage: topExit.to,
      strength: topExit.count,
      confidence: topExit.confidence,
      narrative: `When in crisis, you most characteristically move toward ${topExit.to} (${topExit.count} times). This is your recovery signature — ${topExit.to === "Growth" ? "you tend to channel disruption into building." : topExit.to === "Awakening" ? "crisis tends to strip you back to beginnings, which then seed new growth." : topExit.to === "Integration" ? "you naturally process crisis into meaning." : `you move toward ${topExit.to.toLowerCase()}.`}`,
    });
  }

  return {
    transitions: tendencies.slice(0, 10),
    compositeTendencies,
  };
}
