import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// ── GET /api/symbolpath/timeline ────────────────────────────────────────────
// Returns the full life timeline: life events + symbol events merged & sorted
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    // Fetch life events
    const lifeEvents = await sql`
      SELECT le.*, sa.reflection_prompts
      FROM life_events le
      LEFT JOIN symbol_archetypes sa ON le.symbol_id = sa.id
      WHERE le.user_id = ${userId}
      ORDER BY le.event_date DESC
      LIMIT 100
    `;

    // Fetch symbol events
    const symbolEvents = await sql`
      SELECT se.*, sa.reflection_prompts
      FROM symbol_events se
      LEFT JOIN symbol_archetypes sa ON se.symbol_id = sa.id
      WHERE se.user_id = ${userId}
      ORDER BY se.created_at DESC
      LIMIT 100
    `;

    // Merge into unified timeline
    const timeline = [];

    for (const le of lifeEvents) {
      timeline.push({
        type: "life_event",
        id: `le-${le.id}`,
        title: le.title,
        description: le.description,
        date: le.event_date,
        category: le.category,
        intensity: le.intensity,
        symbol: le.symbol,
        stage: le.stage,
        visual: le.visual,
        symbolId: le.symbol_id,
        reflectionPrompts: le.reflection_prompts,
      });
    }

    for (const se of symbolEvents) {
      timeline.push({
        type: "symbol_event",
        id: `se-${se.id}`,
        title: se.symbol,
        description: se.note,
        date: se.created_at,
        category: se.source_type,
        intensity: null,
        symbol: se.symbol,
        stage: se.stage,
        visual: se.visual,
        symbolId: se.symbol_id,
        reflectionPrompts: se.reflection_prompts,
        sourceType: se.source_type,
      });
    }

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Build monthly groups
    const months = {};
    for (const item of timeline) {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key])
        months[key] = {
          label: d.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          items: [],
        };
      months[key].items.push(item);
    }

    // Stage arc over time (by week)
    const stageArc = [];
    const weekMap = {};
    for (const item of timeline) {
      const d = new Date(item.date);
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];
      if (!weekMap[weekKey]) weekMap[weekKey] = { week: weekKey, stages: {} };
      if (item.stage) {
        weekMap[weekKey].stages[item.stage] =
          (weekMap[weekKey].stages[item.stage] || 0) + 1;
      }
    }
    for (const [week, data] of Object.entries(weekMap).sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      const dominant = Object.entries(data.stages).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (dominant)
        stageArc.push({ week, stage: dominant[0], count: dominant[1] });
    }

    return Response.json({
      timeline: timeline.slice(0, 80),
      months,
      stageArc,
      totalEvents: timeline.length,
      lifeEventsCount: lifeEvents.length,
      symbolEventsCount: symbolEvents.length,
    });
  } catch (e) {
    console.error("Timeline error:", e);
    return Response.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}

// ── POST /api/symbolpath/timeline ───────────────────────────────────────────
// Add a life event
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const { title, description, eventDate, category, intensity, symbolId } =
      body;

    if (!title || !eventDate) {
      return Response.json(
        { error: "title and eventDate are required" },
        { status: 400 },
      );
    }

    let symData = { symbol: null, stage: null, visual: null, symbol_id: null };
    if (symbolId) {
      const rows =
        await sql`SELECT id, symbol, stage, visual FROM symbol_archetypes WHERE id = ${symbolId} LIMIT 1`;
      if (rows.length > 0) {
        symData = {
          symbol: rows[0].symbol,
          stage: rows[0].stage,
          visual: rows[0].visual,
          symbol_id: rows[0].id,
        };
      }
    }

    const [row] = await sql`
      INSERT INTO life_events (user_id, title, description, event_date, category, intensity, symbol_id, symbol, stage, visual)
      VALUES (${userId}, ${title}, ${description || null}, ${eventDate}, ${category || "personal"}, ${intensity || 5}, ${symData.symbol_id}, ${symData.symbol}, ${symData.stage}, ${symData.visual})
      RETURNING *
    `;

    // Also emit into symbol_events stream if symbol was chosen
    if (symData.symbol_id) {
      await sql`
        INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
        VALUES (${userId}, 'life_event', ${String(row.id)}, ${symData.symbol_id}, ${symData.symbol}, ${symData.stage}, ${null}, ${symData.visual}, ${title})
      `;
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
