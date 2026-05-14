import sql from "@/app/api/utils/sql";
import detectArcs from "@/app/api/utils/arcPatternEngine";
import { updateGravity } from "@/app/api/utils/gravityEngine";
import { auth } from "@/auth";

// ── Symbol emission helper ─────────────────────────────────────────────────
export async function emitSymbolEvent({
  userId,
  sourceType,
  sourceId,
  cardId,
  moodText,
  moonPhase,
}) {
  try {
    let symbolRow = null;

    if (cardId) {
      const rows = await sql`
        SELECT sa.id, sa.symbol, sa.stage, sa.theme, sa.visual
        FROM tarot_symbol_map tsm
        JOIN symbol_archetypes sa ON tsm.symbol_id = sa.id
        WHERE tsm.tarot_card_id = ${cardId}
        ORDER BY tsm.id DESC
        LIMIT 1
      `;
      if (rows.length > 0) symbolRow = rows[0];
    }

    if (!symbolRow && moonPhase) {
      const phaseMap = {
        "new moon": "Seed",
        "waxing crescent": "Dawn",
        "first quarter": "Bridge",
        "waxing gibbous": "Mountain",
        "full moon": "Flame",
        "waning gibbous": "River",
        "last quarter": "Scale",
        "waning crescent": "Lantern",
      };
      const lower = moonPhase.toLowerCase();
      const symbolName = Object.entries(phaseMap).find(([k]) =>
        lower.includes(k),
      )?.[1];
      if (symbolName) {
        const rows =
          await sql`SELECT id, symbol, stage, theme, visual FROM symbol_archetypes WHERE symbol = ${symbolName} LIMIT 1`;
        if (rows.length > 0) symbolRow = rows[0];
      }
    }

    if (!symbolRow && moodText) {
      const moodKeywords = [
        { keywords: ["anxious", "fear", "scared", "worried"], symbol: "Storm" },
        { keywords: ["lost", "confused", "uncertain"], symbol: "Labyrinth" },
        { keywords: ["hopeful", "excited", "ready"], symbol: "Dawn" },
        { keywords: ["sad", "grief", "broken", "hurt"], symbol: "Abyss" },
        { keywords: ["strong", "grounded", "stable"], symbol: "Tree" },
        {
          keywords: ["transformation", "change", "shifting"],
          symbol: "Serpent",
        },
        { keywords: ["balanced", "clear", "harmony"], symbol: "Scale" },
        { keywords: ["inspired", "creative", "alive"], symbol: "Flame" },
        { keywords: ["stuck", "trapped", "helpless"], symbol: "Tower" },
        { keywords: ["grateful", "abundant", "peaceful"], symbol: "Chalice" },
        { keywords: ["seeking", "questioning", "searching"], symbol: "Key" },
        { keywords: ["new", "beginning", "starting"], symbol: "Seed" },
        { keywords: ["complete", "done", "finished"], symbol: "Crown" },
      ];
      const lower = (moodText || "").toLowerCase();
      for (const { keywords, symbol: sym } of moodKeywords) {
        if (keywords.some((k) => lower.includes(k))) {
          const rows =
            await sql`SELECT id, symbol, stage, theme, visual FROM symbol_archetypes WHERE symbol = ${sym} LIMIT 1`;
          if (rows.length > 0) {
            symbolRow = rows[0];
            break;
          }
        }
      }
    }

    if (!symbolRow) return null;

    const [event] = await sql`
      INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual)
      VALUES (${userId || "anonymous"}, ${sourceType}, ${String(sourceId || "")}, ${symbolRow.id}, ${symbolRow.symbol}, ${symbolRow.stage}, ${symbolRow.theme}, ${symbolRow.visual})
      RETURNING *
    `;

    // Update gravity — non-blocking, won't fail event emission
    updateGravity(
      userId || "anonymous",
      symbolRow.symbol,
      symbolRow.stage,
      sourceType,
      { emotionText: moodText || null },
    ).catch(() => {});

    return event;
  } catch (e) {
    console.error("Symbol emit error:", e);
    return null;
  }
}

// ── GET /api/symbolpath/engine ─────────────────────────────────────────────
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const events = await sql`
      SELECT se.*, sa.reflection_prompts, sa.action_prompts, sa.emotion_themes
      FROM symbol_events se
      LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
      WHERE se.user_id = ${userId}
      ORDER BY se.created_at DESC
      LIMIT ${limit}
    `;

    if (events.length === 0) {
      return Response.json({ events: [], patterns: null, needsMore: true });
    }

    const symbolCounts = {};
    const stageCounts = {};
    const sourceTypeCounts = {};

    for (const e of events) {
      symbolCounts[e.symbol] = (symbolCounts[e.symbol] || 0) + 1;
      stageCounts[e.stage] = (stageCounts[e.stage] || 0) + 1;
      sourceTypeCounts[e.source_type] =
        (sourceTypeCounts[e.source_type] || 0) + 1;
    }

    const topSymbols = Object.entries(symbolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symbol, count]) => {
        const ev = events.find((e) => e.symbol === symbol);
        return {
          symbol,
          count,
          stage: ev?.stage,
          visual: ev?.visual,
          theme: ev?.theme,
        };
      });

    const dominantStage = Object.entries(stageCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    // ── Arc detection via shared engine ──
    let topPaths = [];
    try {
      const arcResult = await detectArcs(userId, { min: 2, limit: 5 });
      topPaths = arcResult.arcs.map((arc) => ({
        path: arc.path,
        stages: arc.stages,
        visuals: arc.visuals,
        symbols: arc.symbols,
        themes: arc.themes,
        count: arc.occurrences,
        lastSeen: arc.lastSeen,
        name: arc.name,
        narrative: arc.narrative,
        archetype: arc.archetype,
        emoji: arc.emoji,
        direction: arc.direction,
        intensity: arc.intensity,
        insight: `You often move from ${arc.symbols[0]} through ${arc.symbols[1]} into ${arc.symbols[2]}.`,
      }));
    } catch (arcErr) {
      console.error("Arc detection in engine failed:", arcErr);
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEvents = events.filter(
      (e) => new Date(e.created_at) >= weekAgo,
    );
    const weeklyDominantStage =
      weeklyEvents.length > 0
        ? Object.entries(
            weeklyEvents.reduce((acc, e) => {
              acc[e.stage] = (acc[e.stage] || 0) + 1;
              return acc;
            }, {}),
          ).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;

    const STAGE_INSIGHTS = {
      Awakening:
        "You are in a season of fresh beginnings. New possibilities are emerging — trust the seeds you're planting.",
      Growth:
        "You are building and expanding. The work you're doing now is creating roots that will hold you steady.",
      Crisis:
        "You are moving through intensity and disruption. Crisis always precedes transformation — you are not lost.",
      Integration:
        "You are weaving threads together. The lessons are landing. This is the sacred work of making meaning.",
      Mastery:
        "You have moved through the full arc. What you've learned is now yours to carry forward and share.",
    };

    return Response.json({
      events: events.slice(0, 20),
      patterns: {
        topSymbols,
        dominantStage: {
          stage: dominantStage[0],
          count: dominantStage[1],
          insight: STAGE_INSIGHTS[dominantStage[0]] || "",
        },
        stageCounts,
        topPaths,
        sourceTypeCounts,
        weeklyDominantStage,
        weeklyCount: weeklyEvents.length,
        totalEvents: events.length,
      },
      needsMore: events.length < 3,
    });
  } catch (e) {
    console.error("Pattern engine error:", e);
    return Response.json({ error: "Pattern engine failed" }, { status: 500 });
  }
}

// ── POST /api/symbolpath/engine ────────────────────────────────────────────
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const { sourceType, sourceId, symbolId, note } = body;

    if (!sourceType || !symbolId) {
      return Response.json(
        { error: "Missing sourceType or symbolId" },
        { status: 400 },
      );
    }

    const symbolRows =
      await sql`SELECT * FROM symbol_archetypes WHERE id = ${symbolId} LIMIT 1`;
    if (symbolRows.length === 0) {
      return Response.json({ error: "Symbol not found" }, { status: 404 });
    }
    const sym = symbolRows[0];

    const [event] = await sql`
      INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
      VALUES (${userId}, ${sourceType}, ${String(sourceId || "")}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.theme}, ${sym.visual}, ${note || null})
      RETURNING *
    `;

    // Update gravity for manually emitted events
    updateGravity(userId, sym.symbol, sym.stage, sourceType).catch(() => {});

    return Response.json(event, { status: 201 });
  } catch (e) {
    console.error("Symbol event POST error:", e);
    return Response.json(
      { error: "Failed to emit symbol event" },
      { status: 500 },
    );
  }
}
