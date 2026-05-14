/**
 * GET /api/symbolpath/reasoning
 *
 * The Interpretation Layer endpoint.
 *
 * Assembles a user's full symbolic state — gravity, events, archetypes,
 * relationships, stage shifts — and feeds it through the symbolic
 * reasoning engine to produce prioritized, narrative-rich observations.
 *
 * This is the endpoint the UI calls to display "What does this all mean?"
 *
 * Query params:
 *   userId  — user identifier (default "anonymous")
 *   limit   — max observations to return (default 15)
 */

import sql from "@/app/api/utils/sql";
import {
  readGravityProfile,
  computeStageCoexistence,
} from "@/app/api/utils/gravityEngine";
import { reason } from "@/app/api/utils/symbolicReasoning";
import {
  STAGE_SHIFT_RULES,
  computeShiftConfidence,
  detectRegression,
} from "@/app/api/utils/memoryRules";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "15");

    // ── Gather all symbolic state in parallel ──
    const [gravityProfile, recentEvents, archetypeData, symbolRelationships] =
      await Promise.all([
        readGravityProfile(userId),

        sql(
          `SELECT se.*, sa.reflection_prompts, sa.action_prompts, sa.emotion_themes
           FROM symbol_events se
           LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
           WHERE se.user_id = $1
           ORDER BY se.created_at DESC
           LIMIT 60`,
          [userId],
        ),

        sql`SELECT * FROM symbol_archetypes`,

        sql(`SELECT * FROM symbol_relationships WHERE user_id = $1`, [userId]),
      ]);

    if (recentEvents.length < 3) {
      return Response.json({
        observations: [],
        summary: {
          total: 0,
          critical: 0,
          high: 0,
          typeCounts: {},
          overallTone: "quiet",
        },
        needsMore: true,
        message:
          "Add more symbolic events (readings, mood logs, dreams, life events) to activate the reasoning engine.",
      });
    }

    // ── Compute stage coexistence ──
    const coexistence = computeStageCoexistence(gravityProfile);

    // ── Detect stage shift + regression ──
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
    const weeklyDominantStage =
      Object.entries(weeklyStages).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const lastWeekStage =
      lastWeekEvents.length > 0
        ? Object.entries(
            lastWeekEvents.reduce((acc, e) => {
              acc[e.stage] = (acc[e.stage] || 0) + 1;
              return acc;
            }, {}),
          ).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;

    let stageShift = null;
    if (
      lastWeekStage &&
      weeklyDominantStage &&
      lastWeekStage !== weeklyDominantStage
    ) {
      const confidence = computeShiftConfidence(
        weeklyEvents.length,
        lastWeekEvents.length,
      );
      const regression = detectRegression(lastWeekStage, weeklyDominantStage);
      stageShift = {
        from: lastWeekStage,
        to: weeklyDominantStage,
        confidence,
        regression,
      };
    }

    // ── Run the reasoning engine ──
    const result = reason({
      gravityProfile,
      recentEvents,
      archetypeData,
      symbolRelationships,
      coexistence,
      stageShift,
    });

    // Apply limit
    result.observations = result.observations.slice(0, limit);

    // ── Add coexistence summary to response ──
    return Response.json({
      ...result,
      coexistence,
      stageShift,
      needsMore: false,
    });
  } catch (e) {
    console.error("[reasoning] error:", e);
    return Response.json({ error: "Reasoning engine failed" }, { status: 500 });
  }
}
