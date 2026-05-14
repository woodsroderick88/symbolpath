import sql from "@/app/api/utils/sql";
import { updateGravity } from "@/app/api/utils/gravityEngine";
import { auth } from "@/auth";

// Mood → Symbol mapping for SymbolPath
// Exact-match lookup (lowercase key)
const MOOD_SYMBOLS = {
  // Crisis — Storm (upheaval)
  anxious: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  stressed: {
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  overwhelmed: {
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  panicked: {
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  worried: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  nervous: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  fearful: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  scared: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  scattered: {
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  frantic: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },
  restless: {
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  tense: { symbol: "Storm", stage: "Crisis", theme: "upheaval", visual: "⛈️" },

  // Crisis — Abyss (the-unknown)
  sad: { symbol: "Abyss", stage: "Crisis", theme: "the-unknown", visual: "🕳️" },
  depressed: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
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
  empty: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  numb: { symbol: "Abyss", stage: "Crisis", theme: "the-unknown", visual: "🕳️" },
  lonely: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  hopeless: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  despair: {
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },

  // Crisis — Labyrinth (confusion)
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
  unsure: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  doubtful: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  indecisive: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },

  // Crisis — Tower (collapse)
  angry: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  frustrated: {
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },
  furious: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  enraged: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  stuck: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  trapped: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🏚️" },
  helpless: {
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },

  // Crisis — Mirror (self-awareness)
  reflective: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  guilty: {
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  ashamed: {
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

  // Crisis — Serpent (transformation)
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

  // Awakening — Seed (potential)
  hopeful: {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  optimistic: {
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },

  // Awakening — Dawn (new-beginnings)
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
  energized: {
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },

  // Awakening — Key (discovery)
  curious: {
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

  // Growth — Flame (passion)
  inspired: {
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  passionate: {
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  creative: {
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  alive: { symbol: "Flame", stage: "Growth", theme: "passion", visual: "🔥" },

  // Growth — River (flow)
  calm: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  relaxed: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  centered: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  grounded: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  accepting: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },

  // Growth — Mountain (ambition)
  determined: {
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
  confident: {
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },
  focused: {
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },

  // Growth — Tree (resilience)
  stable: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  resilient: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  steady: {
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },

  // Growth — Bridge (transition)
  neutral: {
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "🌉",
  },
  okay: {
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "🌉",
  },
  fine: {
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "🌉",
  },
  meh: { symbol: "Bridge", stage: "Growth", theme: "transition", visual: "🌉" },

  // Integration — Scale (balance)
  balanced: {
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
  torn: {
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },

  // Integration — Compass (direction)
  clear: {
    symbol: "Compass",
    stage: "Integration",
    theme: "direction",
    visual: "🧭",
  },
  purposeful: {
    symbol: "Compass",
    stage: "Integration",
    theme: "direction",
    visual: "🧭",
  },

  // Mastery — Chalice (fulfillment)
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
  fulfilled: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  content: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  loving: {
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },

  // Mastery — Star (transcendence)
  peaceful: {
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },
  serene: {
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },
  tranquil: {
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },

  // Mastery — Crown (sovereignty)
  joyful: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
  joyous: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
  ecstatic: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
  blissful: {
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
};

// Keyword-based fallback for free-text moods that don't exactly match
// Each entry: array of substrings to search for → symbol data
const MOOD_KEYWORD_FALLBACKS = [
  {
    keywords: [
      "overwhelm",
      "panic",
      "frantic",
      "scatter",
      "stress",
      "anxio",
      "worri",
      "nervous",
      "fear",
      "scare",
      "tense",
      "restless",
    ],
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "⛈️",
  },
  {
    keywords: [
      "sad",
      "depress",
      "grief",
      "broken",
      "hurt",
      "empty",
      "numb",
      "lonely",
      "hopeless",
      "despair",
      "cry",
      "tear",
    ],
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "🕳️",
  },
  {
    keywords: ["confus", "lost", "uncertain", "unsure", "doubt", "indecis"],
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  {
    keywords: [
      "angr",
      "frustrat",
      "furious",
      "rage",
      "stuck",
      "trap",
      "helpless",
    ],
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "🏚️",
  },
  {
    keywords: ["reflect", "guilt", "asham", "introspec"],
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "🪞",
  },
  {
    keywords: ["transform", "chang", "shed", "letting go"],
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "🐍",
  },
  {
    keywords: ["hope", "optimis"],
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "🌱",
  },
  {
    keywords: ["excit", "ready", "energi"],
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "🌅",
  },
  {
    keywords: ["curio", "seek", "wonder"],
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  {
    keywords: ["inspir", "passion", "creativ", "alive", "fire"],
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "🔥",
  },
  {
    keywords: ["calm", "relax", "center", "ground", "accept", "flow"],
    symbol: "River",
    stage: "Growth",
    theme: "flow",
    visual: "🏞️",
  },
  {
    keywords: ["determin", "strong", "confiden", "focus", "driven"],
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "⛰️",
  },
  {
    keywords: ["stable", "resilien", "steady", "rooted"],
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "🌳",
  },
  {
    keywords: ["balanc", "torn", "conflict"],
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "⚖️",
  },
  {
    keywords: ["clear", "purpos", "direction"],
    symbol: "Compass",
    stage: "Integration",
    theme: "direction",
    visual: "🧭",
  },
  {
    keywords: ["grateful", "abundan", "fulfill", "content", "loving"],
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "🏆",
  },
  {
    keywords: ["peace", "seren", "tranquil"],
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "⭐",
  },
  {
    keywords: ["joy", "ecsta", "bliss", "happy", "elat"],
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "👑",
  },
];

/**
 * Resolve a free-text mood string to a symbol.
 * 1. Try exact match (single-word moods)
 * 2. Try keyword substring match (multi-word or misspelled moods)
 * 3. Fall back to Bridge/Growth (neutral)
 */
function resolveMoodSymbol(moodText) {
  const lower = (moodText || "neutral").toLowerCase().trim();

  // 1. Exact match
  if (MOOD_SYMBOLS[lower]) return MOOD_SYMBOLS[lower];

  // 2. Keyword substring match (handles "overwhelmed and anxious", "a bit stressed", etc.)
  for (const fb of MOOD_KEYWORD_FALLBACKS) {
    if (fb.keywords.some((kw) => lower.includes(kw))) {
      return {
        symbol: fb.symbol,
        stage: fb.stage,
        theme: fb.theme,
        visual: fb.visual,
      };
    }
  }

  // 3. Default
  return MOOD_SYMBOLS.neutral;
}

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    const logs = await sql`
      SELECT * FROM mood_logs
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return Response.json(logs);
  } catch (error) {
    console.error("Error fetching mood logs:", error);
    return Response.json(
      { error: "Failed to fetch mood logs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { moodBefore, moodAfter, readingId, affirmation, notes } =
      await request.json();

    const result = await sql`
      INSERT INTO mood_logs (user_id, mood_before, mood_after, reading_id, affirmation, notes)
      VALUES (${userId}, ${moodBefore || null}, ${moodAfter || null}, ${readingId || null}, ${affirmation || null}, ${notes || null})
      RETURNING *
    `;

    // Auto-generate SymbolPath event from mood
    const symbolData = resolveMoodSymbol(moodBefore);
    try {
      const archetype = await sql`
        SELECT id FROM symbol_archetypes WHERE LOWER(symbol) = LOWER(${symbolData.symbol}) LIMIT 1
      `;
      if (archetype.length > 0) {
        await sql`
          INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note)
          VALUES (${userId}, 'mood_log', ${String(result[0].id)}, ${archetype[0].id}, ${symbolData.symbol}, ${symbolData.stage}, ${symbolData.theme}, ${symbolData.visual}, ${`Mood: ${moodBefore || "neutral"}`})
        `;

        // Update gravity with emotional intensity from the mood
        updateGravity(userId, symbolData.symbol, symbolData.stage, "mood_log", {
          emotionText: moodBefore,
        }).catch(() => {});
      }
    } catch (symErr) {
      console.error("Symbol event from mood error:", symErr);
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating mood log:", error);
    return Response.json(
      { error: "Failed to create mood log" },
      { status: 500 },
    );
  }
}
