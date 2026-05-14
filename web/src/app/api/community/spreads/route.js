import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const spreads = await sql`
      SELECT * FROM custom_spreads
      ORDER BY upvotes DESC, created_at DESC
      LIMIT ${limit}
    `;

    return Response.json(spreads);
  } catch (error) {
    console.error("Error fetching custom spreads:", error);
    return Response.json({ error: "Failed to fetch spreads" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, positions, created_by } = await request.json();

    if (!name || !positions) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO custom_spreads (name, description, positions, created_by)
      VALUES (${name}, ${description || null}, ${JSON.stringify(positions)}, ${created_by || "Anonymous"})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating custom spread:", error);
    return Response.json({ error: "Failed to create spread" }, { status: 500 });
  }
}
