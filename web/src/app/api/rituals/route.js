import sql from "@/app/api/utils/sql";

// Moon Phase → Symbol mapping with stage overrides
// Moon phases carry their own energetic signature that may differ from the archetype's default stage
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

export async function GET(request) {
  try {
    const rituals = await sql`SELECT * FROM rituals ORDER BY created_at DESC`;
    return Response.json({ rituals });
  } catch (error) {
    console.error("Error fetching rituals:", error);
    return Response.json({ error: "Failed to fetch rituals" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { moon_phase, title, description, intention } = body;

    if (!moon_phase || !title) {
      return Response.json(
        { error: "moon_phase and title are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO rituals (moon_phase, title, description, intention)
      VALUES (${moon_phase}, ${title}, ${description || null}, ${intention || null})
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
            VALUES ('anonymous', 'moon_phase', ${String(result[0].id)}, ${rows[0].id}, ${mapped.symbol}, ${mapped.stage}, ${mapped.theme}, ${mapped.visual}, ${`${moon_phase}: ${title}`})
          `;
        }
      } catch (symErr) {
        console.error("Symbol event from ritual error:", symErr);
      }
    }

    return Response.json({ ritual: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating ritual:", error);
    return Response.json({ error: "Failed to create ritual" }, { status: 500 });
  }
}
