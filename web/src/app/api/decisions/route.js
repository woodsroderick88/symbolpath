import sql from "@/app/api/utils/sql";
import { updateGravity } from "@/app/api/utils/gravityEngine";
import { auth } from "@/auth";

// Decision emotion → Symbol mapping for SymbolPath
const DECISION_SYMBOLS = {
  fear: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  anxiety: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  anxious: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  worried: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  scared: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  anger: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  angry: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  frustration: {
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },
  frustrated: {
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },
  stuck: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  trapped: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  helpless: {
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },
  guilt: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  reflective: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  aware: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  introspective: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  shame: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  sadness: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  sad: { symbol: "Abyss", stage: "Crisis", theme: "the-unknown", visual: "🕳️" },
  grief: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  broken: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  hurt: { symbol: "Abyss", stage: "Crisis", theme: "the-unknown", visual: "🕳️" },
  confusion: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  confused: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  lost: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  uncertain: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  doubt: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  hope: {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  hopeful: {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  new: { symbol: "Seed", stage: "Awakening", theme: "potential", visual: "🌱" },
  beginning: {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  excitement: {
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },
  excited: {
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },
  ready: {
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },
  curiosity: {
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  seeking: {
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  questioning: {
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  searching: {
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  courage: { symbol: "Flame", stage: "Growth", theme: "passion", visual: "🔥" },
  passionate: {
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  inspired: {
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  determination: {
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },
  strong: {
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },
  grounded: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  stable: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  confident: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  calm: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  acceptance: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  transforming: {
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "🐍",
  },
  changing: {
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "🐍",
  },
  letting_go: {
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "🐍",
  },
  torn: {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  conflicted: {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  balanced: {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  relief: {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  clarity: {
    symbol: "Compass",
    stage: "Integration",
    theme: "direction",
    visual: "🧭",
  },
  peace: {
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },
  peaceful: {
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },
  gratitude: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  grateful: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  abundant: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  love: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  joy: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
  joyful: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
  neutral: {
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "🌉",
  },
};

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const rows =
      await sql`SELECT * FROM decisions WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching decisions:", error);
    return Response.json(
      { error: "Failed to fetch decisions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const {
      situation,
      emotion,
      defense,
      consequence,
      decisionTaken,
      tarotCardId,
      tarotCardName,
      tarotReversed,
    } = body;

    if (!situation || !emotion || !decisionTaken) {
      return Response.json(
        { error: "Situation, emotion, and decision are required" },
        { status: 400 },
      );
    }

    const rows = await sql`
      INSERT INTO decisions (situation, emotion, defense, consequence, decision_taken, tarot_card_id, tarot_card_name, tarot_reversed, user_id)
      VALUES (${situation}, ${emotion}, ${defense || "None"}, ${consequence || "Neutral"}, ${decisionTaken}, ${tarotCardId || null}, ${tarotCardName || null}, ${tarotReversed || false}, ${userId})
      RETURNING *
    `;

    const decision = rows[0];

    // ── Emit SymbolPath event from this decision ──
    try {
      let symbolData = null;

      // 1. Try tarot card mapping first (most specific)
      if (tarotCardId) {
        const mapped = await sql`
          SELECT sa.id, sa.symbol, sa.stage, sa.theme, sa.visual
          FROM tarot_symbol_map tsm
          JOIN symbol_archetypes sa ON tsm.symbol_id = sa.id
          WHERE tsm.tarot_card_id = ${tarotCardId}
          ORDER BY tsm.id DESC
          LIMIT 1
        `;
        if (mapped.length > 0) {
          symbolData = mapped[0];
        }
      }

      // 2. Fall back to emotion keyword mapping
      if (!symbolData) {
        const emotionKey = (emotion || "neutral").toLowerCase().trim();
        const match = DECISION_SYMBOLS[emotionKey] || DECISION_SYMBOLS.neutral;
        const archetype = await sql`
          SELECT id FROM symbol_archetypes WHERE LOWER(symbol) = LOWER(${match.symbol}) LIMIT 1
        `;
        if (archetype.length > 0) {
          symbolData = {
            id: archetype[0].id,
            symbol: match.symbol,
            stage: match.stage,
            theme: match.theme,
            visual: match.visual,
          };
        }
      }

      if (symbolData) {
        const noteText = tarotCardName
          ? `Decision (${tarotCardName}): ${situation.slice(0, 80)}${situation.length > 80 ? "…" : ""} — felt ${emotion}`
          : `Decision (${emotion}): ${situation.slice(0, 80)}${situation.length > 80 ? "…" : ""}`;

        await sql`
          INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
          VALUES (${userId}, 'decision', ${String(decision.id)}, ${symbolData.id}, ${symbolData.symbol}, ${symbolData.stage}, ${symbolData.theme}, ${symbolData.visual}, ${noteText})
        `;

        // Update gravity with emotional intensity from the decision
        updateGravity(userId, symbolData.symbol, symbolData.stage, "decision", {
          emotionText: emotion,
        }).catch(() => {});
      }
    } catch (symErr) {
      console.error("Symbol event from decision error:", symErr);
    }

    return Response.json(decision, { status: 201 });
  } catch (error) {
    console.error("Error saving decision:", error);
    return Response.json({ error: "Failed to save decision" }, { status: 500 });
  }
}
