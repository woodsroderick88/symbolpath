import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const rows = await sql(
      `SELECT 
        m.id,
        m.tarot_card_id,
        m.symbol_id,
        m.reasoning,
        m.created_at,
        a.symbol,
        a.stage,
        a.theme,
        a.emotion_themes,
        a.reflection_prompts,
        a.action_prompts,
        a.visual
      FROM tarot_symbol_map m
      JOIN symbol_archetypes a ON a.id = m.symbol_id
      WHERE m.id = $1`,
      [id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Mapping not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching mapping:", error);
    return Response.json({ error: "Failed to fetch mapping" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (body.tarot_card_id !== undefined) {
      paramCount++;
      setClauses.push(`tarot_card_id = $${paramCount}`);
      values.push(body.tarot_card_id);
    }

    if (body.symbol_id !== undefined) {
      paramCount++;
      setClauses.push(`symbol_id = $${paramCount}`);
      values.push(body.symbol_id);
    }

    if (body.reasoning !== undefined) {
      paramCount++;
      setClauses.push(`reasoning = $${paramCount}`);
      values.push(body.reasoning);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    values.push(id);

    const query = `UPDATE tarot_symbol_map SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const rows = await sql(query, values);

    if (rows.length === 0) {
      return Response.json({ error: "Mapping not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error updating mapping:", error);
    return Response.json(
      { error: "Failed to update mapping" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql(
      `DELETE FROM tarot_symbol_map WHERE id = $1 RETURNING id`,
      [id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Mapping not found" }, { status: 404 });
    }

    return Response.json({ deleted: true, id: rows[0].id });
  } catch (error) {
    console.error("Error deleting mapping:", error);
    return Response.json(
      { error: "Failed to delete mapping" },
      { status: 500 },
    );
  }
}
