import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql`SELECT * FROM decisions WHERE id = ${id}`;
    if (rows.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching decision:", error);
    return Response.json(
      { error: "Failed to fetch decision" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM decisions WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting decision:", error);
    return Response.json(
      { error: "Failed to delete decision" },
      { status: 500 },
    );
  }
}
