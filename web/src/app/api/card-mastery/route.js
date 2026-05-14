import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";

    const mastery = await sql`
      SELECT * FROM card_mastery 
      WHERE user_id = ${userId}
      ORDER BY appearance_count DESC
    `;

    return Response.json(mastery);
  } catch (error) {
    console.error("Error fetching card mastery:", error);
    return Response.json(
      { error: "Failed to fetch card mastery" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId, cardName } = await request.json();
    const uid = userId || "anonymous";

    if (!cardName) {
      return Response.json({ error: "Card name is required" }, { status: 400 });
    }

    const existing = await sql`
      SELECT * FROM card_mastery 
      WHERE user_id = ${uid} AND card_name = ${cardName}
    `;

    let result;
    if (existing.length > 0) {
      const newCount = existing[0].appearance_count + 1;
      const newLevel = Math.floor(newCount / 5) + 1;

      result = await sql`
        UPDATE card_mastery
        SET appearance_count = ${newCount},
            mastery_level = ${newLevel},
            updated_at = NOW()
        WHERE user_id = ${uid} AND card_name = ${cardName}
        RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO card_mastery (user_id, card_name, appearance_count, mastery_level)
        VALUES (${uid}, ${cardName}, 1, 1)
        RETURNING *
      `;
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating card mastery:", error);
    return Response.json(
      { error: "Failed to update card mastery" },
      { status: 500 },
    );
  }
}
