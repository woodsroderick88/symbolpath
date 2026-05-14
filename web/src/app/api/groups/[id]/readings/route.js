import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const readings = await sql`
      SELECT * FROM group_readings WHERE group_id = ${id} ORDER BY created_at DESC LIMIT 50
    `;
    return Response.json(readings);
  } catch (error) {
    console.error("Error fetching group readings:", error);
    return Response.json(
      { error: "Failed to fetch readings" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { shared_by, spread_name, cards, ai_narrative, note } =
      await request.json();

    if (!spread_name || !cards)
      return Response.json({ error: "Missing fields" }, { status: 400 });

    const result = await sql`
      INSERT INTO group_readings (group_id, shared_by, spread_name, cards, ai_narrative, note)
      VALUES (${id}, ${shared_by || "Anonymous"}, ${spread_name}, ${JSON.stringify(cards)}, ${ai_narrative || null}, ${note || null})
      RETURNING *
    `;
    return Response.json(result[0]);
  } catch (error) {
    console.error("Error sharing reading:", error);
    return Response.json({ error: "Failed to share reading" }, { status: 500 });
  }
}
