import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await sql`
      SELECT * FROM community_posts
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return Response.json(posts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { spread_id, spread_name, cards, interpretation, user_name } =
      await request.json();

    if (!spread_id || !spread_name || !cards) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO community_posts (spread_id, spread_name, cards, interpretation, user_name)
      VALUES (${spread_id}, ${spread_name}, ${JSON.stringify(cards)}, ${interpretation || null}, ${user_name || "Anonymous"})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating community post:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}
