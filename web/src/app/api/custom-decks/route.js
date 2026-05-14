import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";
    const includePublic = searchParams.get("includePublic") === "true";

    let decks;
    if (includePublic) {
      decks = await sql`
        SELECT * FROM custom_decks
        WHERE user_id = ${userId} OR is_public = true
        ORDER BY created_at DESC
      `;
    } else {
      decks = await sql`
        SELECT * FROM custom_decks
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    }

    return Response.json(decks);
  } catch (error) {
    console.error("Error fetching custom decks:", error);
    return Response.json({ error: "Failed to fetch decks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, cards, cover_image, is_public, user_id } =
      await request.json();

    if (!name)
      return Response.json({ error: "Name required" }, { status: 400 });
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return Response.json(
        { error: "At least one card required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO custom_decks (user_id, name, description, cards, cover_image, is_public)
      VALUES (
        ${user_id || "anonymous"},
        ${name},
        ${description || null},
        ${JSON.stringify(cards)},
        ${cover_image || null},
        ${is_public || false}
      )
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating custom deck:", error);
    return Response.json({ error: "Failed to create deck" }, { status: 500 });
  }
}
