import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`SELECT * FROM intentions WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: "Intention not found" }, { status: 404 });
    }

    return Response.json({ intention: result[0] });
  } catch (error) {
    console.error("Error fetching intention:", error);
    return Response.json(
      { error: "Failed to fetch intention" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { moon_phase, intention, manifestation_notes, completed } = body;

    let query = "UPDATE intentions SET ";
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (moon_phase !== undefined) {
      updates.push(`moon_phase = $${paramCount++}`);
      values.push(moon_phase);
    }
    if (intention !== undefined) {
      updates.push(`intention = $${paramCount++}`);
      values.push(intention);
    }
    if (manifestation_notes !== undefined) {
      updates.push(`manifestation_notes = $${paramCount++}`);
      values.push(manifestation_notes);
    }
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    query += updates.join(", ");
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Intention not found" }, { status: 404 });
    }

    return Response.json({ intention: result[0] });
  } catch (error) {
    console.error("Error updating intention:", error);
    return Response.json(
      { error: "Failed to update intention" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result =
      await sql`DELETE FROM intentions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Intention not found" }, { status: 404 });
    }

    return Response.json({ message: "Intention deleted successfully" });
  } catch (error) {
    console.error("Error deleting intention:", error);
    return Response.json(
      { error: "Failed to delete intention" },
      { status: 500 },
    );
  }
}
