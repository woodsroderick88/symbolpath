import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const stage = url.searchParams.get("stage");
    const theme = url.searchParams.get("theme");
    const symbol = url.searchParams.get("symbol");

    let query = "SELECT * FROM symbol_archetypes WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (stage) {
      paramCount++;
      query += ` AND LOWER(stage) = LOWER($${paramCount})`;
      params.push(stage);
    }

    if (theme) {
      paramCount++;
      query += ` AND LOWER(theme) = LOWER($${paramCount})`;
      params.push(theme);
    }

    if (symbol) {
      paramCount++;
      query += ` AND LOWER(symbol) = LOWER($${paramCount})`;
      params.push(symbol);
    }

    query += " ORDER BY id ASC";

    const rows = await sql(query, params);

    return Response.json({ archetypes: rows });
  } catch (error) {
    console.error("Error fetching archetypes:", error);
    return Response.json(
      { error: "Failed to fetch archetypes" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      symbol,
      stage,
      theme,
      visual,
      // original fields
      emotion_themes,
      reflection_prompts,
      action_prompts,
      // canonical ontology fields
      core_meaning,
      emotional_tone,
      shadow_expression,
      growth_expression,
      associated_behaviors,
      transition_tendencies,
      symbolic_relatives,
    } = body;

    if (!symbol || !stage || !theme) {
      return Response.json(
        { error: "symbol, stage, and theme are required" },
        { status: 400 },
      );
    }

    const rows = await sql(
      `INSERT INTO symbol_archetypes (
        symbol, stage, theme, visual,
        emotion_themes, reflection_prompts, action_prompts,
        core_meaning, emotional_tone, shadow_expression, growth_expression,
        associated_behaviors, transition_tendencies, symbolic_relatives
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        symbol,
        stage,
        theme,
        visual || null,
        JSON.stringify(emotion_themes || []),
        JSON.stringify(reflection_prompts || []),
        JSON.stringify(action_prompts || []),
        core_meaning || null,
        emotional_tone || null,
        shadow_expression || null,
        growth_expression || null,
        JSON.stringify(associated_behaviors || []),
        JSON.stringify(transition_tendencies || []),
        JSON.stringify(symbolic_relatives || []),
      ],
    );

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating archetype:", error);
    return Response.json(
      { error: "Failed to create archetype" },
      { status: 500 },
    );
  }
}
