import sql from "@/app/api/utils/sql";
import { updateGravity } from "@/app/api/utils/gravityEngine";
import { auth } from "@/auth";

// GET /api/life-events — list life events with optional filters
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "100");

    let queryStr = `
      SELECT le.*, sa.reflection_prompts, sa.action_prompts
      FROM life_events le
      LEFT JOIN symbol_archetypes sa ON le.symbol_id = sa.id
      WHERE le.user_id = $1
    `;
    const params = [userId];
    let paramIdx = 2;

    if (category && category !== "all") {
      queryStr += ` AND le.category = $${paramIdx}`;
      params.push(category);
      paramIdx++;
    }

    queryStr += ` ORDER BY le.event_date DESC LIMIT $${paramIdx}`;
    params.push(limit);

    const events = await sql(queryStr, params);

    // Stats
    const categoryCounts = {};
    const stageCounts = {};
    let totalIntensity = 0;
    let intensityCount = 0;

    for (const ev of events) {
      categoryCounts[ev.category] = (categoryCounts[ev.category] || 0) + 1;
      if (ev.stage) stageCounts[ev.stage] = (stageCounts[ev.stage] || 0) + 1;
      if (ev.intensity) {
        totalIntensity += ev.intensity;
        intensityCount++;
      }
    }

    // Monthly timeline
    const months = {};
    for (const ev of events) {
      const d = new Date(ev.event_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key])
        months[key] = {
          label: d.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          items: [],
        };
      months[key].items.push(ev);
    }

    return Response.json({
      events,
      months,
      stats: {
        total: events.length,
        categoryCounts,
        stageCounts,
        avgIntensity:
          intensityCount > 0
            ? Math.round((totalIntensity / intensityCount) * 10) / 10
            : 0,
      },
    });
  } catch (e) {
    console.error("Life events GET error:", e);
    return Response.json(
      { error: "Failed to fetch life events" },
      { status: 500 },
    );
  }
}

// POST /api/life-events — create a life event
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const { title, description, eventDate, category, intensity, symbolId } =
      body;

    if (!title || !eventDate) {
      return Response.json(
        { error: "title and eventDate required" },
        { status: 400 },
      );
    }

    let symData = { symbol: null, stage: null, visual: null, symbol_id: null };
    if (symbolId) {
      const rows =
        await sql`SELECT id, symbol, stage, visual, theme FROM symbol_archetypes WHERE id = ${symbolId} LIMIT 1`;
      if (rows.length > 0) {
        symData = {
          symbol: rows[0].symbol,
          stage: rows[0].stage,
          visual: rows[0].visual,
          symbol_id: rows[0].id,
          theme: rows[0].theme,
        };
      }
    }

    const [row] = await sql`
      INSERT INTO life_events (user_id, title, description, event_date, category, intensity, symbol_id, symbol, stage, visual)
      VALUES (${userId}, ${title}, ${description || null}, ${eventDate}, ${category || "personal"}, ${intensity || 5}, ${symData.symbol_id}, ${symData.symbol}, ${symData.stage}, ${symData.visual})
      RETURNING *
    `;

    // Also emit into symbol_events stream
    if (symData.symbol_id) {
      await sql`
        INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
        VALUES (${userId}, 'life_event', ${String(row.id)}, ${symData.symbol_id}, ${symData.symbol}, ${symData.stage}, ${symData.theme || null}, ${symData.visual}, ${title})
      `;

      // Update gravity with numeric intensity from the life event
      updateGravity(userId, symData.symbol, symData.stage, "life_event", {
        numericIntensity: intensity || 5,
      }).catch(() => {});
    }

    return Response.json(row, { status: 201 });
  } catch (e) {
    console.error("Life event create error:", e);
    return Response.json(
      { error: "Failed to create life event" },
      { status: 500 },
    );
  }
}

// DELETE /api/life-events?id=X
export async function DELETE(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    await sql`DELETE FROM life_events WHERE id = ${id} AND user_id = ${userId}`;
    return Response.json({ success: true });
  } catch (e) {
    console.error("Life event delete error:", e);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
