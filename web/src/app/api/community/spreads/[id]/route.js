import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { upvote } = await request.json();

    if (upvote) {
      const result = await sql`
        UPDATE custom_spreads
        SET upvotes = upvotes + 1
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json(result[0]);
    }

    return Response.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error("Error updating spread:", error);
    return Response.json({ error: "Failed to update spread" }, { status: 500 });
  }
}
