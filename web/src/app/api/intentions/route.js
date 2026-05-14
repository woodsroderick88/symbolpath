import sql from "@/app/api/utils/sql";

// Moon Phase → Symbol mapping with stage overrides
const MOON_PHASE_SYMBOL_MAP = {
  "new moon": {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  "waxing crescent": {
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },
  "first quarter": {
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "🌉",
  },
  "waxing gibbous": {
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },
  "full moon": {
    symbol: "Flame",
    stage: "Crisis",
    theme: "confrontation",
    visual: "🔥",
  },
  "waning gibbous": {
    symbol: "River",
    stage: "Integration",
    theme: "flow",
    visual: "🏞️",
  },
  "last quarter": {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  "waning crescent": {
    symbol: "Lantern",
    stage: "Integration",
    theme: "guidance",
    visual: "🏮",
  },
};

// Intent keyword → Symbol mapping for SymbolPath
const INTENT_SYMBOL_MAP = {
  clarity: { symbol: "Lantern", stage: "Insight" },
  courage: { symbol: "Flame", stage: "Conflict" },
  healing: { symbol: "Garden", stage: "Renewal" },
  connection: { symbol: "Bridge", stage: "Exploration" },
  creativity: { symbol: "Seed", stage: "Beginning" },
  release: { symbol: "Storm", stage: "Crisis" },
  rest: { symbol: "Garden", stage: "Renewal" },
  purpose: { symbol: "Path", stage: "Exploration" },
};

export async function GET(request) {
  try {
    const intentions =
      await sql`SELECT * FROM intentions ORDER BY created_at DESC`;
    return Response.json({ intentions });
  } catch (error) {
    console.error("Error fetching intentions:", error);
    return Response.json(
      { error: "Failed to fetch intentions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { moon_phase, intention, manifestation_notes } = body;

    if (!moon_phase || !intention) {
      return Response.json(
        { error: "moon_phase and intention are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO intentions (moon_phase, intention, manifestation_notes)
      VALUES (${moon_phase}, ${intention}, ${manifestation_notes || null})
      RETURNING *
    `;

    // Emit symbol event from moon phase
    const lower = (moon_phase || "").toLowerCase().trim();
    const mapped = Object.entries(MOON_PHASE_SYMBOL_MAP).find(([k]) =>
      lower.includes(k),
    )?.[1];
    if (mapped) {
      try {
        const rows =
          await sql`SELECT id FROM symbol_archetypes WHERE LOWER(symbol) = LOWER(${mapped.symbol}) LIMIT 1`;
        if (rows.length > 0) {
          await sql`
            INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
            VALUES ('anonymous', 'moon_phase', ${String(result[0].id)}, ${rows[0].id}, ${mapped.symbol}, ${mapped.stage}, ${mapped.theme}, ${mapped.visual}, ${`${moon_phase}: ${intention}`})
          `;
        }
      } catch (symErr) {
        console.error("Symbol event from intention error:", symErr);
      }
    }

    // Emit symbol event from intent keyword
    const intentLower = (intention || "").toLowerCase();
    for (const [keyword, mapping] of Object.entries(INTENT_SYMBOL_MAP)) {
      if (intentLower.includes(keyword)) {
        try {
          const archRows = await sql`
            SELECT id, symbol, stage, theme, visual FROM symbol_archetypes
            WHERE LOWER(symbol) = LOWER(${mapping.symbol}) LIMIT 1
          `;
          const sym = archRows.length > 0 ? archRows[0] : null;
          await sql`
            INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
            VALUES ('anonymous', 'intent', ${String(result[0].id)}, ${sym?.id || null}, ${mapping.symbol}, ${mapping.stage}, ${sym?.theme || null}, ${sym?.visual || null}, ${intention})
          `;
        } catch (intentErr) {
          console.error("Symbol event from intent keyword error:", intentErr);
        }
        break; // only emit for first matching keyword
      }
    }

    return Response.json({ intention: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating intention:", error);
    return Response.json(
      { error: "Failed to create intention" },
      { status: 500 },
    );
  }
}
