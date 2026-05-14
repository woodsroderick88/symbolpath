import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [row] = await sql`SELECT * FROM readings WHERE id = ${id}`;
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch reading" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { notes } = body;

    const [row] = await sql`
      UPDATE readings SET notes = ${notes ?? null}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to update reading" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM readings WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to delete reading" },
      { status: 500 },
    );
  }
}
