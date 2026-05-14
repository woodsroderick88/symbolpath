import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { upvote } = await request.json();

    if (upvote) {
      const result = await sql`
        UPDATE community_posts
        SET upvotes = upvotes + 1
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json(result[0]);
    }

    return Response.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM community_posts WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return Response.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
