import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];
const STAGE_COLORS = {
  Awakening: {
    primary: "#60A5FA",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.3)",
  },
  Growth: {
    primary: "#34D399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
  },
  Crisis: {
    primary: "#F87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.3)",
  },
  Integration: {
    primary: "#A78BFA",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.3)",
  },
  Mastery: {
    primary: "#FBBF24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
  },
};

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const events = await sql`
      SELECT se.*, sa.reflection_prompts, sa.action_prompts, sa.emotion_themes
      FROM symbol_events se
      LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
      WHERE se.user_id = ${userId}
      ORDER BY se.created_at DESC
      LIMIT 30
    `;

    if (events.length === 0) {
      return Response.json({
        compass: null,
        needsMore: true,
        message: "Begin a reading or log a symbol to start your journey.",
      });
    }

    const recentEvents = events.slice(0, 7);
    const stageCounts = {};
    recentEvents.forEach((e, i) => {
      const weight = 7 - i;
      stageCounts[e.stage] = (stageCounts[e.stage] || 0) + weight;
    });
    const currentStage = Object.entries(stageCounts).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    const currentSymbol = recentEvents[0];

    const archetypeRows = await sql`
      SELECT * FROM symbol_archetypes WHERE symbol = ${currentSymbol.symbol} LIMIT 1
    `;
    const archetype = archetypeRows[0] || currentSymbol;
    const stageIndex = STAGE_ORDER.indexOf(currentStage);
    const stageColor = STAGE_COLORS[currentStage] || STAGE_COLORS.Integration;
    const prevStage = stageIndex > 0 ? STAGE_ORDER[stageIndex - 1] : null;
    const nextStage =
      stageIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[stageIndex + 1] : null;

    const symbolPath = events
      .slice(0, 8)
      .map((e) => ({
        symbol: e.symbol,
        stage: e.stage,
        visual: e.visual,
        source: e.source_type,
        date: e.created_at,
      }))
      .reverse();

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEvents = events.filter(
      (e) => new Date(e.created_at) >= weekAgo,
    );
    const weeklySymbols = [...new Set(weeklyEvents.map((e) => e.symbol))];

    return Response.json({
      compass: {
        currentStage,
        currentSymbol: {
          symbol: currentSymbol.symbol,
          visual: currentSymbol.visual,
          stage: currentSymbol.stage,
          theme: currentSymbol.theme,
          reflection_prompts: archetype.reflection_prompts,
          action_prompts: archetype.action_prompts,
          emotion_themes: archetype.emotion_themes,
        },
        stageIndex,
        prevStage,
        nextStage,
        stageColor,
        symbolPath,
        stageCounts,
        weeklySymbols,
        weeklyCount: weeklyEvents.length,
        totalEvents: events.length,
      },
      needsMore: false,
    });
  } catch (e) {
    console.error("Compass error:", e);
    return Response.json({ error: "Compass failed" }, { status: 500 });
  }
}
