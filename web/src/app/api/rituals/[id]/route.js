import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`SELECT * FROM rituals WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: "Ritual not found" }, { status: 404 });
    }

    return Response.json({ ritual: result[0] });
  } catch (error) {
    console.error("Error fetching ritual:", error);
    return Response.json({ error: "Failed to fetch ritual" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { moon_phase, title, description, intention } = body;

    let query = "UPDATE rituals SET ";
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (moon_phase !== undefined) {
      updates.push(`moon_phase = $${paramCount++}`);
      values.push(moon_phase);
    }
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (intention !== undefined) {
      updates.push(`intention = $${paramCount++}`);
      values.push(intention);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    query += updates.join(", ");
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Ritual not found" }, { status: 404 });
    }

    return Response.json({ ritual: result[0] });
  } catch (error) {
    console.error("Error updating ritual:", error);
    return Response.json({ error: "Failed to update ritual" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM rituals WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Ritual not found" }, { status: 404 });
    }

    return Response.json({ message: "Ritual deleted successfully" });
  } catch (error) {
    console.error("Error deleting ritual:", error);
    return Response.json({ error: "Failed to delete ritual" }, { status: 500 });
  }
}
