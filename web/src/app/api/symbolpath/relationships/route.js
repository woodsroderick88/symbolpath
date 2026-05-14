import sql from "@/app/api/utils/sql";
import { updateGravity } from "@/app/api/utils/gravityEngine";
import { auth } from "@/auth";

// ── GET /api/symbolpath/relationships ──────────────────────────────────────
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const relationships = await sql`
      SELECT * FROM relationship_compass
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `;

    // For each relationship, get recent events
    const enriched = [];
    for (const rel of relationships) {
      const events = await sql`
        SELECT re.*, sa.reflection_prompts, sa.action_prompts
        FROM relationship_events re
        LEFT JOIN symbol_archetypes sa ON re.symbol_id = sa.id
        WHERE re.relationship_id = ${rel.id}
        ORDER BY re.created_at DESC
        LIMIT 10
      `;

      // Compute dominant stage from events
      const stageCounts = {};
      for (const e of events) {
        stageCounts[e.stage] = (stageCounts[e.stage] || 0) + 1;
      }
      const dominant = Object.entries(stageCounts).sort(
        (a, b) => b[1] - a[1],
      )[0];

      // Recent symbol path
      const symbolPath = events
        .slice(0, 6)
        .map((e) => ({
          symbol: e.symbol,
          stage: e.stage,
          visual: e.visual,
          date: e.created_at,
        }))
        .reverse();

      enriched.push({
        ...rel,
        events: events.slice(0, 5),
        stageCounts,
        dominantStageComputed: dominant ? dominant[0] : rel.current_stage,
        symbolPath,
        recentReflection: events[0]?.reflection_prompts?.[0] || null,
      });
    }

    return Response.json({ relationships: enriched });
  } catch (e) {
    console.error("Relationships error:", e);
    return Response.json(
      { error: "Failed to fetch relationships" },
      { status: 500 },
    );
  }
}

// ── POST /api/symbolpath/relationships ─────────────────────────────────────
// Create a relationship or add an event to one
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const { action } = body;

    if (action === "create") {
      const { personName, relationshipType, notes } = body;
      if (!personName) {
        return Response.json({ error: "personName required" }, { status: 400 });
      }

      const [row] = await sql`
        INSERT INTO relationship_compass (user_id, person_name, relationship_type, notes)
        VALUES (${userId}, ${personName}, ${relationshipType || "friend"}, ${notes || null})
        RETURNING *
      `;
      return Response.json(row, { status: 201 });
    }

    if (action === "add_event") {
      const { relationshipId, symbolId, note, sourceType } = body;
      if (!relationshipId || !symbolId) {
        return Response.json(
          { error: "relationshipId and symbolId required" },
          { status: 400 },
        );
      }

      const symRows =
        await sql`SELECT * FROM symbol_archetypes WHERE id = ${symbolId} LIMIT 1`;
      if (symRows.length === 0) {
        return Response.json({ error: "Symbol not found" }, { status: 404 });
      }
      const sym = symRows[0];

      const [event] = await sql`
        INSERT INTO relationship_events (user_id, relationship_id, symbol_id, symbol, stage, visual, source_type, note)
        VALUES (${userId}, ${relationshipId}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.visual}, ${sourceType || "manual"}, ${note || null})
        RETURNING *
      `;

      // Update the relationship compass
      await sql`
        UPDATE relationship_compass
        SET events_count = events_count + 1,
            dominant_symbol = ${sym.symbol},
            dominant_visual = ${sym.visual},
            current_stage = ${sym.stage},
            updated_at = NOW()
        WHERE id = ${relationshipId}
      `;

      // Also emit into main symbol_events stream
      await sql`
        INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
        VALUES (${userId}, 'relationship', ${String(relationshipId)}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.theme}, ${sym.visual}, ${note || null})
      `;

      // Update gravity — relationship events carry persistent signal
      updateGravity(userId, sym.symbol, sym.stage, "relationship", {
        emotionText: note || null,
      }).catch(() => {});

      return Response.json(event, { status: 201 });
    }

    return Response.json(
      { error: "action must be 'create' or 'add_event'" },
      { status: 400 },
    );
  } catch (e) {
    console.error("Relationship POST error:", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

// ── DELETE /api/symbolpath/relationships ────────────────────────────────────
export async function DELETE(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    await sql`DELETE FROM relationship_compass WHERE id = ${id} AND user_id = ${userId}`;
    return Response.json({ success: true });
  } catch (e) {
    console.error("Relationship delete error:", e);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
