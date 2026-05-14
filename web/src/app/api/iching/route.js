import sql from "@/app/api/utils/sql";

// GET /api/iching — list past readings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";
    const limit = parseInt(searchParams.get("limit") || "20");

    const readings = await sql`
      SELECT * FROM iching_readings
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return Response.json({ readings });
  } catch (e) {
    console.error("I-Ching GET error:", e);
    return Response.json(
      { error: "Failed to fetch readings" },
      { status: 500 },
    );
  }
}

// POST /api/iching — save a reading and emit symbol event
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      question,
      hexagramNumber,
      hexagramName,
      relatingHexagramNumber,
      relatingHexagramName,
      changingLines,
      linesData,
      notes,
      symbolId,
    } = body;

    if (!hexagramNumber || !hexagramName) {
      return Response.json(
        { error: "hexagramNumber and hexagramName required" },
        { status: 400 },
      );
    }

    const [reading] = await sql`
      INSERT INTO iching_readings (user_id, question, hexagram_number, hexagram_name, relating_hexagram_number, relating_hexagram_name, changing_lines, lines_data, notes)
      VALUES (${userId || "anonymous"}, ${question || null}, ${hexagramNumber}, ${hexagramName}, ${relatingHexagramNumber || null}, ${relatingHexagramName || null}, ${JSON.stringify(changingLines || [])}, ${JSON.stringify(linesData)}, ${notes || null})
      RETURNING *
    `;

    // Emit symbol event from the hexagram's mapped symbol
    if (symbolId) {
      const symRows =
        await sql`SELECT id, symbol, stage, theme, visual FROM symbol_archetypes WHERE id = ${symbolId} LIMIT 1`;
      if (symRows.length > 0) {
        const sym = symRows[0];
        await sql`
          INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
          VALUES (${userId || "anonymous"}, 'i-ching', ${String(reading.id)}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.theme}, ${sym.visual}, ${question ? "I-Ching: " + question : "I-Ching casting #" + hexagramNumber})
        `;
      }
    }

    return Response.json(reading, { status: 201 });
  } catch (e) {
    console.error("I-Ching POST error:", e);
    return Response.json({ error: "Failed to save reading" }, { status: 500 });
  }
}
