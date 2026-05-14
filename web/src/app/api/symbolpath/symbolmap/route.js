import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];

// ── GET /api/symbolpath/symbolmap ──────────────────────────────────────────
// Returns all archetypes with user's encounter data for visualization
export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    // Get all archetypes
    const archetypes = await sql`
      SELECT * FROM symbol_archetypes ORDER BY id
    `;

    // Get user's encounter counts per symbol
    const encounters = await sql`
      SELECT symbol_id, symbol, stage, COUNT(*) as encounter_count,
             MAX(created_at) as last_seen,
             MIN(created_at) as first_seen
      FROM symbol_events
      WHERE user_id = ${userId} AND symbol_id IS NOT NULL
      GROUP BY symbol_id, symbol, stage
    `;

    const encounterMap = {};
    for (const e of encounters) {
      encounterMap[e.symbol_id] = {
        count: parseInt(e.encounter_count),
        lastSeen: e.last_seen,
        firstSeen: e.first_seen,
      };
    }

    // Get connections between symbols (symbols that appear within 24hrs of each other)
    const connections = await sql`
      SELECT DISTINCT a.symbol as from_symbol, a.symbol_id as from_id,
             b.symbol as to_symbol, b.symbol_id as to_id
      FROM symbol_events a
      JOIN symbol_events b ON a.user_id = b.user_id
        AND a.id < b.id
        AND ABS(EXTRACT(EPOCH FROM (a.created_at - b.created_at))) < 172800
        AND a.symbol_id != b.symbol_id
      WHERE a.user_id = ${userId}
        AND a.symbol_id IS NOT NULL
        AND b.symbol_id IS NOT NULL
      LIMIT 50
    `;

    // Build the map nodes
    const nodes = STAGE_ORDER.map((stage) => {
      const stageSymbols = archetypes.filter((a) => a.stage === stage);
      return {
        stage,
        symbols: stageSymbols.map((sym) => ({
          id: sym.id,
          symbol: sym.symbol,
          stage: sym.stage,
          theme: sym.theme,
          visual: sym.visual,
          emotionThemes: sym.emotion_themes,
          reflectionPrompts: sym.reflection_prompts,
          actionPrompts: sym.action_prompts,
          encountered: !!encounterMap[sym.id],
          encounterCount: encounterMap[sym.id]?.count || 0,
          lastSeen: encounterMap[sym.id]?.lastSeen || null,
          firstSeen: encounterMap[sym.id]?.firstSeen || null,
        })),
      };
    });

    // Stats
    const totalEncountered = Object.keys(encounterMap).length;
    const totalSymbols = archetypes.length;
    const completionPct = Math.round((totalEncountered / totalSymbols) * 100);

    // Stage completion
    const stageCompletion = STAGE_ORDER.map((stage) => {
      const stageSymbols = archetypes.filter((a) => a.stage === stage);
      const encCount = stageSymbols.filter((s) => encounterMap[s.id]).length;
      return {
        stage,
        total: stageSymbols.length,
        encountered: encCount,
        pct:
          stageSymbols.length > 0
            ? Math.round((encCount / stageSymbols.length) * 100)
            : 0,
      };
    });

    return Response.json({
      nodes,
      connections: connections.map((c) => ({
        from: c.from_symbol,
        fromId: c.from_id,
        to: c.to_symbol,
        toId: c.to_id,
      })),
      stats: {
        totalSymbols,
        totalEncountered,
        completionPct,
        stageCompletion,
      },
    });
  } catch (e) {
    console.error("Symbol map error:", e);
    return Response.json(
      { error: "Failed to load symbol map" },
      { status: 500 },
    );
  }
}
