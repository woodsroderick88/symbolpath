import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql(`SELECT * FROM symbol_archetypes WHERE id = $1`, [
      id,
    ]);

    if (rows.length === 0) {
      return Response.json({ error: "Archetype not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching archetype:", error);
    return Response.json(
      { error: "Failed to fetch archetype" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    const fields = [
      "symbol",
      "stage",
      "theme",
      "emotion_themes",
      "reflection_prompts",
      "action_prompts",
      "visual",
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        paramCount++;
        const isJson = [
          "emotion_themes",
          "reflection_prompts",
          "action_prompts",
        ].includes(field);
        setClauses.push(`${field} = $${paramCount}`);
        values.push(isJson ? JSON.stringify(body[field]) : body[field]);
      }
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    values.push(id);

    const query = `UPDATE symbol_archetypes SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const rows = await sql(query, values);

    if (rows.length === 0) {
      return Response.json({ error: "Archetype not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error updating archetype:", error);
    return Response.json(
      { error: "Failed to update archetype" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql(
      `DELETE FROM symbol_archetypes WHERE id = $1 RETURNING id`,
      [id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Archetype not found" }, { status: 404 });
    }

    return Response.json({ deleted: true, id: rows[0].id });
  } catch (error) {
    console.error("Error deleting archetype:", error);
    return Response.json(
      { error: "Failed to delete archetype" },
      { status: 500 },
    );
  }
}
