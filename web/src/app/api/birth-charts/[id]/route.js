import sql from "@/app/api/utils/sql";
import { getSunSign, getApproximateMoonSign } from "@/app/api/utils/astrology";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`SELECT * FROM birth_charts WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: "Birth chart not found" }, { status: 404 });
    }

    return Response.json({ chart: result[0] });
  } catch (error) {
    console.error("Error fetching birth chart:", error);
    return Response.json(
      { error: "Failed to fetch birth chart" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { birth_date, birth_time, birth_location, notes } = body;

    let query = "UPDATE birth_charts SET ";
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (birth_date !== undefined) {
      const sunSign = getSunSign(birth_date);
      const moonSign = getApproximateMoonSign(birth_date);

      updates.push(`birth_date = $${paramCount++}`);
      values.push(birth_date);
      updates.push(`sun_sign = $${paramCount++}`);
      values.push(sunSign.name);
      updates.push(`moon_sign = $${paramCount++}`);
      values.push(moonSign.name);
    }
    if (birth_time !== undefined) {
      updates.push(`birth_time = $${paramCount++}`);
      values.push(birth_time);
    }
    if (birth_location !== undefined) {
      updates.push(`birth_location = $${paramCount++}`);
      values.push(birth_location);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    query += updates.join(", ");
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Birth chart not found" }, { status: 404 });
    }

    return Response.json({ chart: result[0] });
  } catch (error) {
    console.error("Error updating birth chart:", error);
    return Response.json(
      { error: "Failed to update birth chart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result =
      await sql`DELETE FROM birth_charts WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Birth chart not found" }, { status: 404 });
    }

    return Response.json({ message: "Birth chart deleted successfully" });
  } catch (error) {
    console.error("Error deleting birth chart:", error);
    return Response.json(
      { error: "Failed to delete birth chart" },
      { status: 500 },
    );
  }
}
