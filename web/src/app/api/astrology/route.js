import {
  getSunSign,
  getApproximateMoonSign,
  getZodiacPersonality,
  getCurrentTransits,
  getPlanetaryIngresses,
  PLANET_SYMBOL_MAP,
} from "@/app/api/utils/astrology";
import sql from "@/app/api/utils/sql";

// Planet retrograde → Symbol mapping for SymbolPath
const TRANSIT_SYMBOL_MAP = {
  Mercury: {
    symbol: "Labyrinth",
    note: "Mercury retrograde — communication tangles, revisit old plans",
  },
  Venus: {
    symbol: "Mirror",
    note: "Venus retrograde — re-examine love, values, and self-worth",
  },
  Mars: {
    symbol: "Storm",
    note: "Mars retrograde — frustration simmers, redirect fiery energy inward",
  },
  Jupiter: {
    symbol: "Lantern",
    note: "Jupiter retrograde — inner expansion, philosophical review",
  },
  Saturn: {
    symbol: "Mountain",
    note: "Saturn retrograde — restructure foundations, patience tested",
  },
  Uranus: {
    symbol: "Tower",
    note: "Uranus retrograde — internal revolution, break old patterns",
  },
  Neptune: {
    symbol: "Abyss",
    note: "Neptune retrograde — illusions dissolve, face deeper truths",
  },
  Pluto: {
    symbol: "Serpent",
    note: "Pluto retrograde — deep transformation churns beneath the surface",
  },
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const birthDate = url.searchParams.get("birthDate");
    const userId = url.searchParams.get("userId") || "anonymous";

    const transitData = getCurrentTransits();

    let result;

    if (!birthDate) {
      result = {
        transits: transitData.retrogrades,
        ingresses: transitData.ingresses,
      };
    } else {
      const sunSign = getSunSign(birthDate);
      const moonSign = getApproximateMoonSign(birthDate);
      const sunPersonality = getZodiacPersonality(sunSign.name);
      const moonPersonality = getZodiacPersonality(moonSign.name);
      result = {
        sunSign,
        moonSign,
        sunPersonality,
        moonPersonality,
        transits: transitData.retrogrades,
        ingresses: transitData.ingresses,
      };
    }

    // ── Emit symbol events for active retrogrades (once per day per planet) ──
    const activeTransits = result.transits || [];
    const today = new Date().toISOString().split("T")[0];

    for (const transit of activeTransits) {
      if (!transit.retrograde) continue;
      const mapping = TRANSIT_SYMBOL_MAP[transit.planet];
      if (!mapping) continue;

      const sourceId = `transit-${transit.planet}-${today}`;

      // Dedupe: skip if we already emitted this transit today
      try {
        const existing = await sql`
          SELECT id FROM symbol_events
          WHERE user_id = ${userId} AND source_type = 'astro_transit' AND source_id = ${sourceId}
          LIMIT 1
        `;
        if (existing.length > 0) continue;

        const archRows = await sql`
          SELECT id, symbol, stage, theme, visual FROM symbol_archetypes
          WHERE symbol = ${mapping.symbol} LIMIT 1
        `;
        if (archRows.length > 0) {
          const sym = archRows[0];
          await sql`
            INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
            VALUES (${userId}, 'astro_transit', ${sourceId}, ${sym.id}, ${sym.symbol}, ${sym.stage}, ${sym.theme}, ${sym.visual}, ${mapping.note})
          `;
        }
      } catch (emitErr) {
        console.error("Transit symbol emit error:", emitErr);
      }
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error calculating astrology:", error);
    return Response.json(
      { error: "Failed to calculate astrology" },
      { status: 500 },
    );
  }
}

// POST: Emit a symbol event from a planetary transit (ingress or retrograde)
export async function POST(request) {
  try {
    const body = await request.json();
    const { planet, type, fromSign, toSign, note } = body;

    if (!planet) {
      return Response.json({ error: "planet is required" }, { status: 400 });
    }

    const mapping = PLANET_SYMBOL_MAP[planet];
    if (!mapping) {
      return Response.json(
        { error: `Unknown planet: ${planet}` },
        { status: 400 },
      );
    }

    // Look up the archetype
    const rows =
      await sql`SELECT id FROM symbol_archetypes WHERE LOWER(symbol) = LOWER(${mapping.symbol}) LIMIT 1`;
    if (rows.length === 0) {
      return Response.json(
        { error: `Archetype not found for symbol: ${mapping.symbol}` },
        { status: 404 },
      );
    }

    const transitNote =
      note ||
      `${planet} enters ${toSign || "new sign"}${fromSign ? ` (from ${fromSign})` : ""}`;
    const sourceId = `${planet}_${type || "ingress"}_${toSign || "unknown"}_${Date.now()}`;

    const result = await sql`
      INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
      VALUES ('anonymous', 'transit', ${sourceId}, ${rows[0].id}, ${mapping.symbol}, ${mapping.stage}, ${mapping.theme}, ${mapping.visual}, ${transitNote})
      RETURNING *
    `;

    return Response.json(
      {
        event: result[0],
        transit: { planet, type: type || "ingress", fromSign, toSign },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error emitting transit symbol event:", error);
    return Response.json(
      { error: "Failed to emit transit symbol event" },
      { status: 500 },
    );
  }
}
