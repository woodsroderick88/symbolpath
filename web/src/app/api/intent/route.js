import sql from "@/app/api/utils/sql";

const INTENT_SYMBOL_MAP = {
  clarity: { symbol: "Lantern", stage: "Insight" },
  courage: { symbol: "Flame", stage: "Conflict" },
  healing: { symbol: "Garden", stage: "Renewal" },
  connection: { symbol: "Bridge", stage: "Exploration" },
  creativity: { symbol: "Seed", stage: "Beginning" },
  release: { symbol: "Storm", stage: "Crisis" },
  rest: { symbol: "Garden", stage: "Renewal" },
  purpose: { symbol: "Path", stage: "Exploration" },
  truth: { symbol: "Mirror", stage: "Insight" },
  focus: { symbol: "Arrow", stage: "Exploration" },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, intent } = body;

    if (!intent) {
      return Response.json({ error: "intent is required" }, { status: 400 });
    }

    const mapping = INTENT_SYMBOL_MAP[intent.toLowerCase().trim()];
    if (!mapping) {
      return Response.json({ error: "Unknown intent" }, { status: 400 });
    }

    const uid = userId ? String(userId) : "anonymous";

    const archRows = await sql`
      SELECT id, symbol, stage, theme, visual FROM symbol_archetypes
      WHERE LOWER(symbol) = LOWER(${mapping.symbol}) LIMIT 1
    `;
    const sym = archRows.length > 0 ? archRows[0] : null;

    await sql`
      INSERT INTO symbol_events
        (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note, sequence_start)
      VALUES (
        ${uid},
        'intent',
        ${intent},
        ${sym?.id || null},
        ${mapping.symbol},
        ${mapping.stage},
        ${sym?.theme || null},
        ${sym?.visual || null},
        ${`Intent: ${intent}`},
        ${true}
      )
    `;

    return Response.json({ status: "ok" });
  } catch (err) {
    console.error("Intent emit error:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
