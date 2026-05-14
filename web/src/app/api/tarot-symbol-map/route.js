import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const cardId = url.searchParams.get("cardId");
    const symbolId = url.searchParams.get("symbolId");
    const stage = url.searchParams.get("stage");

    let query = `
      SELECT 
        m.id,
        m.tarot_card_id,
        m.symbol_id,
        m.reasoning,
        m.created_at,
        a.symbol,
        a.stage,
        a.theme,
        a.emotion_themes,
        a.reflection_prompts,
        a.action_prompts,
        a.visual
      FROM tarot_symbol_map m
      JOIN symbol_archetypes a ON a.id = m.symbol_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (cardId) {
      paramCount++;
      query += ` AND m.tarot_card_id = $${paramCount}`;
      params.push(cardId);
    }

    if (symbolId) {
      paramCount++;
      query += ` AND m.symbol_id = $${paramCount}`;
      params.push(symbolId);
    }

    if (stage) {
      paramCount++;
      query += ` AND LOWER(a.stage) = LOWER($${paramCount})`;
      params.push(stage);
    }

    query += " ORDER BY m.id ASC";

    const rows = await sql(query, params);

    return Response.json({ mappings: rows });
  } catch (error) {
    console.error("Error fetching tarot-symbol mappings:", error);
    return Response.json(
      { error: "Failed to fetch mappings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tarot_card_id, symbol_id, reasoning } = body;

    if (!tarot_card_id || !symbol_id) {
      return Response.json(
        { error: "tarot_card_id and symbol_id are required" },
        { status: 400 },
      );
    }

    const rows = await sql(
      `INSERT INTO tarot_symbol_map (tarot_card_id, symbol_id, reasoning)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tarot_card_id, symbol_id, reasoning || null],
    );

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating tarot-symbol mapping:", error);
    if (error.message && error.message.includes("unique")) {
      return Response.json(
        { error: "This card-symbol mapping already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Failed to create mapping" },
      { status: 500 },
    );
  }
}
