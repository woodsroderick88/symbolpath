import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/dreams — list dream journal entries
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const dreams = await sql`
      SELECT * FROM dream_journal
      WHERE user_id = ${userId}
      ORDER BY dream_date DESC
      LIMIT ${limit}
    `;

    // Stats
    const totalDreams = dreams.length;
    const recurringCount = dreams.filter((d) => d.recurring).length;

    // Most common symbols across all dreams
    const symbolCounts = {};
    for (const dream of dreams) {
      const detected = dream.symbols_detected || [];
      for (const s of detected) {
        const key = s.symbol || s.keyword;
        if (!symbolCounts[key]) symbolCounts[key] = { ...s, count: 0 };
        symbolCounts[key].count++;
      }
    }
    const topSymbols = Object.values(symbolCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Mood distribution
    const moodCounts = {};
    for (const dream of dreams) {
      if (dream.mood) {
        moodCounts[dream.mood] = (moodCounts[dream.mood] || 0) + 1;
      }
    }

    return Response.json({
      dreams,
      stats: { totalDreams, recurringCount, topSymbols, moodCounts },
    });
  } catch (e) {
    console.error("Dreams GET error:", e);
    return Response.json({ error: "Failed to fetch dreams" }, { status: 500 });
  }
}

// POST /api/dreams — log a new dream
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const {
      title,
      description,
      dreamDate,
      mood,
      lucidity,
      recurring,
      symbolsDetected,
      themes,
      interpretation,
    } = body;

    if (!title || !dreamDate) {
      return Response.json(
        { error: "title and dreamDate required" },
        { status: 400 },
      );
    }

    const [dream] = await sql`
      INSERT INTO dream_journal (user_id, title, description, dream_date, mood, lucidity, recurring, symbols_detected, themes, interpretation)
      VALUES (${userId}, ${title}, ${description || null}, ${dreamDate}, ${mood || null}, ${lucidity || 1}, ${recurring || false}, ${JSON.stringify(symbolsDetected || [])}, ${JSON.stringify(themes || [])}, ${interpretation || null})
      RETURNING *
    `;

    // Emit symbol events for each detected symbol
    const detected = symbolsDetected || [];
    for (const sym of detected) {
      if (sym.symbolId) {
        const symRows =
          await sql`SELECT id, symbol, stage, theme, visual FROM symbol_archetypes WHERE id = ${sym.symbolId} LIMIT 1`;
        if (symRows.length > 0) {
          const sa = symRows[0];
          await sql`
            INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
            VALUES (${userId}, 'dream', ${String(dream.id)}, ${sa.id}, ${sa.symbol}, ${sa.stage}, ${sa.theme}, ${sa.visual}, ${"Dream: " + title})
          `;
        }
      }
    }

    return Response.json(dream, { status: 201 });
  } catch (e) {
    console.error("Dreams POST error:", e);
    return Response.json({ error: "Failed to save dream" }, { status: 500 });
  }
}
