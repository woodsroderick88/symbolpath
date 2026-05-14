import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { reply } = await request.json();

    if (reply) {
      const discussion = await sql`SELECT * FROM discussions WHERE id = ${id}`;
      if (!discussion[0]) {
        return Response.json(
          { error: "Discussion not found" },
          { status: 404 },
        );
      }

      const replies = discussion[0].replies || [];
      replies.push({
        content: reply,
        created_at: new Date().toISOString(),
      });

      const result = await sql`
        UPDATE discussions
        SET replies = ${JSON.stringify(replies)}
        WHERE id = ${id}
        RETURNING *
      `;

      return Response.json(result[0]);
    }

    return Response.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return Response.json(
      { error: "Failed to update discussion" },
      { status: 500 },
    );
  }
}
