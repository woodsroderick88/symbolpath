import sql from "@/app/api/utils/sql";
import {
  STAGE_SHIFT_RULES,
  computeShiftConfidence,
  detectRegression,
  REGRESSION,
} from "@/app/api/utils/memoryRules";
import { auth } from "@/auth";

const WEEKLY_NARRATIVES = {
  Awakening: {
    title: "A Season of Beginnings",
    narrative:
      "This week your symbols speak of fresh starts and latent potential. Something new is trying to grow through you — the universe is asking you to pay attention to the small stirrings before they become unmistakable.",
    invitation: "Where are you resisting the beginning?",
    practice:
      "Morning pages: write three things that feel like they want to start.",
  },
  Growth: {
    title: "The Work of Expansion",
    narrative:
      "Your symbol stream shows the energy of building, stretching, and becoming. This is rarely comfortable — growth never is. But the symbols confirm: the foundation is holding.",
    invitation: "What part of this expansion frightens you most?",
    practice: "Track one small act of courage each day this week.",
  },
  Crisis: {
    title: "Moving Through the Storm",
    narrative:
      "The symbols this week carry the weight of disruption, intensity, or collapse. This is sacred territory — every myth's hero passes through the darkest forest. The storm is not the end of the story.",
    invitation: "What is the storm trying to break open?",
    practice:
      "Find five minutes of stillness in the center of the chaos, daily.",
  },
  Integration: {
    title: "Weaving the Threads",
    narrative:
      "This week the pattern engine sees you in the powerful work of integration — making meaning from what you have lived. The symbols of lanterns and scales and compasses appear. You are finding your direction.",
    invitation:
      "What have you learned that you couldn't have known before the storm?",
    practice:
      "Write a letter to yourself from the perspective of your wiser future self.",
  },
  Mastery: {
    title: "Arriving at the Summit",
    narrative:
      "Your symbols have traveled the full arc this week. The energy of crowns, phoenixes, and stars shows a cycle completing. This is not the end — it is the threshold before the next beginning.",
    invitation: "What wisdom are you ready to carry forward?",
    practice: "Share one hard-earned insight with someone you trust.",
  },
};

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const events = await sql`
      SELECT se.*, sa.reflection_prompts, sa.action_prompts
      FROM symbol_events se
      LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
      WHERE se.user_id = ${userId}
      ORDER BY se.created_at DESC
      LIMIT 50
    `;

    if (events.length < 2) {
      return Response.json({
        insights: null,
        needsMore: true,
        message: "Add more symbolic events to generate weekly insights.",
      });
    }

    // ── Weekly window ──
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEvents = events.filter(
      (e) => new Date(e.created_at) >= weekAgo,
    );
    const allTimeEvents = events;

    // ── Dominant stage this week ──
    const weeklyStages = weeklyEvents.reduce((acc, e) => {
      acc[e.stage] = (acc[e.stage] || 0) + 1;
      return acc;
    }, {});
    const weeklyDominantStage =
      Object.entries(weeklyStages).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Integration";

    // ── Top symbols this week ──
    const weeklySymbolCounts = weeklyEvents.reduce((acc, e) => {
      acc[e.symbol] = (acc[e.symbol] || 0) + 1;
      return acc;
    }, {});
    const topWeeklySymbols = Object.entries(weeklySymbolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symbol, count]) => {
        const ev = weeklyEvents.find((e) => e.symbol === symbol);
        return { symbol, count, visual: ev?.visual, stage: ev?.stage };
      });

    // ── Reflection prompts from most recurring symbol ──
    const topSymbolEvent = weeklyEvents.find(
      (e) => e.symbol === topWeeklySymbols[0]?.symbol,
    );
    const reflectionPrompts = topSymbolEvent?.reflection_prompts || [];
    const actionPrompts = topSymbolEvent?.action_prompts || [];

    // ── Stage shift detection (validated) ──────────────────────────────────
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekEvents = allTimeEvents.filter((e) => {
      const d = new Date(e.created_at);
      return d >= twoWeeksAgo && d < weekAgo;
    });

    // Dominant stage in the previous window
    const lastWeekStage =
      lastWeekEvents.length > 0
        ? Object.entries(
            lastWeekEvents.reduce((acc, e) => {
              acc[e.stage] = (acc[e.stage] || 0) + 1;
              return acc;
            }, {}),
          ).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;

    // Validated stage shift — not just any change, but one with sufficient evidence
    let stageShift = null;
    if (lastWeekStage && lastWeekStage !== weeklyDominantStage) {
      // Confidence is based on the minimum event count across both windows
      const confidence = computeShiftConfidence(
        weeklyEvents.length,
        lastWeekEvents.length,
      );

      // Span: how many distinct days does the new stage appear in this week's events?
      const newStageDaysThisWeek = new Set(
        weeklyEvents
          .filter((e) => e.stage === weeklyDominantStage)
          .map((e) => new Date(e.created_at).toISOString().split("T")[0]),
      );
      const confirmed =
        newStageDaysThisWeek.size >=
        STAGE_SHIFT_RULES.MIN_DAYS_SPAN_FOR_CONFIRMED;

      // Velocity: days between the last event of the old stage and
      // the first event of the new stage (smaller = faster shift)
      const lastOldStageEvent = weeklyEvents
        .filter((e) => e.stage === lastWeekStage)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const firstNewStageEvent = weeklyEvents
        .filter((e) => e.stage === weeklyDominantStage)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];

      let velocityDays = null;
      let accelerating = false;
      if (lastOldStageEvent && firstNewStageEvent) {
        velocityDays = Math.round(
          (new Date(firstNewStageEvent.created_at) -
            new Date(lastOldStageEvent.created_at)) /
            (1000 * 60 * 60 * 24),
        );
        accelerating =
          velocityDays !== null &&
          velocityDays <= STAGE_SHIFT_RULES.ACCELERATION_THRESHOLD_DAYS;
      }

      stageShift = {
        from: lastWeekStage,
        to: weeklyDominantStage,
        confidence, // "none" | "low" | "medium" | "high"
        confirmed, // true if new stage spans 2+ distinct days
        accelerating, // true if shift happened within 3 days
        velocityDays, // days between old stage's last event and new stage's first
        distinctDaysInNewStage: newStageDaysThisWeek.size,
        eventsThisWindow: weeklyEvents.length,
        eventsPrevWindow: lastWeekEvents.length,
        regression: null,
      };

      // Regression detection — is this shift moving backwards?
      const regressionResult = detectRegression(
        lastWeekStage,
        weeklyDominantStage,
      );
      if (regressionResult) {
        const confidenceRanks = { none: 0, low: 1, medium: 2, high: 3 };
        const minRank = confidenceRanks[REGRESSION.MIN_CONFIDENCE] || 2;
        const shiftRank = confidenceRanks[confidence] || 0;

        if (shiftRank >= minRank) {
          stageShift.regression = regressionResult;
        } else {
          stageShift.regression = {
            ...regressionResult,
            suppressed: true,
            reason: "low confidence",
          };
        }
      }
    }

    // ── Source breakdown this week ──
    const sourceBreakdown = weeklyEvents.reduce((acc, e) => {
      acc[e.source_type] = (acc[e.source_type] || 0) + 1;
      return acc;
    }, {});

    // ── All-time stage progression ──
    const STAGE_ORDER = [
      "Awakening",
      "Growth",
      "Crisis",
      "Integration",
      "Mastery",
    ];
    const allTimeStages = allTimeEvents.reduce((acc, e) => {
      acc[e.stage] = (acc[e.stage] || 0) + 1;
      return acc;
    }, {});
    const stageJourney = STAGE_ORDER.map((s) => ({
      stage: s,
      count: allTimeStages[s] || 0,
      percentage:
        allTimeEvents.length > 0
          ? Math.round(((allTimeStages[s] || 0) / allTimeEvents.length) * 100)
          : 0,
    }));

    const weeklyNarrative =
      WEEKLY_NARRATIVES[weeklyDominantStage] || WEEKLY_NARRATIVES.Integration;

    return Response.json({
      insights: {
        weeklyDominantStage,
        weeklyNarrative,
        topWeeklySymbols,
        reflectionPrompts: reflectionPrompts.slice(0, 2),
        actionPrompts: actionPrompts.slice(0, 1),
        stageShift,
        sourceBreakdown,
        stageJourney,
        weeklyCount: weeklyEvents.length,
        totalEvents: allTimeEvents.length,
      },
      needsMore: false,
    });
  } catch (e) {
    console.error("Insights error:", e);
    return Response.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
