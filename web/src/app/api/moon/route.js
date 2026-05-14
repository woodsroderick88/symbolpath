import sql from "@/app/api/utils/sql";
import {
  getMoonPhase,
  getNextMoonPhases,
  getMoonSpreadRecommendation,
} from "@/app/api/utils/moonPhase";

// Moon phase → Symbol mapping for SymbolPath
const MOON_PHASE_SYMBOLS = {
  "New Moon": {
    symbol: "Seed",
    note: "New Moon — plant intentions, honour the dark",
  },
  "Waxing Crescent": {
    symbol: "Dawn",
    note: "Waxing Crescent — first light, courage to begin",
  },
  "First Quarter": {
    symbol: "Bridge",
    note: "First Quarter — cross the threshold, choose action",
  },
  "Waxing Gibbous": {
    symbol: "Mountain",
    note: "Waxing Gibbous — refine the climb, stay persistent",
  },
  "Full Moon": {
    symbol: "Flame",
    note: "Full Moon — illumination, release what no longer serves",
  },
  "Waning Gibbous": {
    symbol: "River",
    note: "Waning Gibbous — share wisdom, let insight flow",
  },
  "Last Quarter": {
    symbol: "Scale",
    note: "Last Quarter — weigh what remains, forgive and let go",
  },
  "Waning Crescent": {
    symbol: "Lantern",
    note: "Waning Crescent — rest in the glow, prepare for renewal",
  },
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");
    const userId = url.searchParams.get("userId") || "anonymous";

    const targetDate = dateParam ? new Date(dateParam) : new Date();

    const currentPhase = getMoonPhase(targetDate);
    const nextPhases = getNextMoonPhases(targetDate, 4);
    const spreadRecommendation = getMoonSpreadRecommendation(currentPhase.name);

    // ── Emit symbol event for the current moon phase (once per day) ──
    const today = new Date().toISOString().split("T")[0];
    const sourceId = `moon-${currentPhase.name.replace(/\s+/g, "-").toLowerCase()}-${today}`;
    const mapping = MOON_PHASE_SYMBOLS[currentPhase.name];

    if (mapping) {
      try {
        const existing = await sql`
          SELECT id FROM symbol_events
          WHERE user_id = ${userId} AND source_type = 'moon_phase' AND source_id = ${sourceId}
          LIMIT 1
        `;
        if (existing.length === 0) {
          const archRows = await sql`
            SELECT id, symbol, stage, theme, visual FROM symbol_archetypes
            WHERE symbol = ${mapping.symbol} LIMIT 1
          `;
          if (archRows.length > 0) {
            const sym = archRows[0];
            await sql`
              INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
              VALUES (${userId}, 'moon_phase', ${sourceId}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.theme}, ${sym.visual}, ${mapping.note})
            `;
          }
        }
      } catch (emitErr) {
        console.error("Moon phase symbol emit error:", emitErr);
      }
    }

    return Response.json({
      current: {
        ...currentPhase,
        date: targetDate.toISOString(),
      },
      upcoming: nextPhases,
      recommendedSpread: spreadRecommendation,
    });
  } catch (error) {
    console.error("Error calculating moon phase:", error);
    return Response.json(
      { error: "Failed to calculate moon phase" },
      { status: 500 },
    );
  }
}
