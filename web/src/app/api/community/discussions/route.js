import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const discussions = await sql`
      SELECT * FROM discussions
      ORDER BY created_at DESC
    `;

    return Response.json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return Response.json(
      { error: "Failed to fetch discussions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { topic, content, user_name } = await request.json();

    if (!topic || !content) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO discussions (topic, content, user_name)
      VALUES (${topic}, ${content}, ${user_name || "Anonymous"})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating discussion:", error);
    return Response.json(
      { error: "Failed to create discussion" },
      { status: 500 },
    );
  }
}
