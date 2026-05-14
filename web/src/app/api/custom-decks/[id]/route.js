import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const deck = await sql`SELECT * FROM custom_decks WHERE id = ${id}`;
    if (!deck[0]) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(deck[0]);
  } catch (error) {
    console.error("Error fetching deck:", error);
    return Response.json({ error: "Failed to fetch deck" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, cards, cover_image, is_public } =
      await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      setClauses.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      setClauses.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (cards !== undefined) {
      setClauses.push(`cards = $${paramCount++}`);
      values.push(JSON.stringify(cards));
    }
    if (cover_image !== undefined) {
      setClauses.push(`cover_image = $${paramCount++}`);
      values.push(cover_image);
    }
    if (is_public !== undefined) {
      setClauses.push(`is_public = $${paramCount++}`);
      values.push(is_public);
    }

    setClauses.push(`updated_at = NOW()`);

    if (setClauses.length <= 1) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE custom_decks SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (!result[0])
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating deck:", error);
    return Response.json({ error: "Failed to update deck" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM custom_decks WHERE id = ${id}`;
    return Response.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return Response.json({ error: "Failed to delete deck" }, { status: 500 });
  }
}
