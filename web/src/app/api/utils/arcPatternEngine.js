import sql from "@/app/api/utils/sql";
import {
  computeArcScore,
  computeIntensity,
  ARC_RULES,
} from "@/app/api/utils/memoryRules";

// ═══════════════════════════════════════════════════════════════════════════════
//  Arc Pattern Engine
//  Detects recurring 3-symbol narrative arcs from the symbol_events stream.
//  Uses ROW_NUMBER window functions to find truly consecutive events (gap-safe).
// ═══════════════════════════════════════════════════════════════════════════════

const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];
const STAGE_WEIGHT = {
  Awakening: 1,
  Growth: 2,
  Crisis: 3,
  Integration: 4,
  Mastery: 5,
};

// ── Named arc templates (hand-crafted narratives for known patterns) ────────
const NAMED_ARCS = {
  "Crisis → Integration → Mastery": {
    name: "The Phoenix Path",
    narrative:
      "You move through disruption into meaning-making, then emerge transformed. This is the oldest arc in human mythology — breakdown, understanding, rebirth.",
    archetype: "Phoenix",
    emoji: "🔥",
  },
  "Awakening → Growth → Crisis": {
    name: "The Hero's Departure",
    narrative:
      "A new beginning grows into expansion, then meets its first real test. The call has been answered — now the road gets hard.",
    archetype: "Hero",
    emoji: "⚔️",
  },
  "Growth → Crisis → Integration": {
    name: "The Crucible",
    narrative:
      "What was building met its breaking point, and from the wreckage you are assembling wisdom. The fire doesn't destroy — it refines.",
    archetype: "Alchemist",
    emoji: "⚗️",
  },
  "Integration → Mastery → Awakening": {
    name: "The Eternal Return",
    narrative:
      "Understanding bloomed into mastery, and mastery opened a door to something entirely new. Every summit reveals the next valley.",
    archetype: "Spiral",
    emoji: "🌀",
  },
  "Crisis → Awakening → Growth": {
    name: "The Resurrection",
    narrative:
      "The storm broke everything open. From the rubble, a seed. From the seed, new roots. You are rebuilding from ground truth.",
    archetype: "Risen",
    emoji: "🌱",
  },
  "Mastery → Awakening → Growth": {
    name: "The Teacher Becomes Student",
    narrative:
      "After arriving at mastery, you chose to begin again. Humility after competence — this is the rarest and most powerful arc.",
    archetype: "Sage",
    emoji: "📖",
  },
  "Awakening → Crisis → Integration": {
    name: "The Baptism by Fire",
    narrative:
      "What began as innocent possibility was thrust into the forge. But you didn't break — you integrated. The new self is forged in the first storm.",
    archetype: "Initiate",
    emoji: "🔱",
  },
  "Growth → Integration → Mastery": {
    name: "The Steady Ascent",
    narrative:
      "Building led to understanding, and understanding led to mastery. No crisis needed — sometimes the path is simply walked with patience.",
    archetype: "Pilgrim",
    emoji: "⛰️",
  },
  "Crisis → Crisis → Integration": {
    name: "The Long Night",
    narrative:
      "Storm after storm, you held on. And then — meaning began to form from the chaos. The darkest hour truly does precede the dawn.",
    archetype: "Survivor",
    emoji: "🌑",
  },
  "Integration → Integration → Mastery": {
    name: "The Slow Bloom",
    narrative:
      "Layer upon layer of meaning, carefully assembled, finally crystallized into something whole. Patience became your greatest teacher.",
    archetype: "Weaver",
    emoji: "🧶",
  },
  "Awakening → Awakening → Growth": {
    name: "The Persistent Seed",
    narrative:
      "Multiple beginnings before the first root took hold. Not every seed sprouts the first time — but the one that does will be strongest.",
    archetype: "Gardener",
    emoji: "🌾",
  },
  "Mastery → Crisis → Integration": {
    name: "The Fall and Recovery",
    narrative:
      "From the summit, a stumble. But the wisdom you carried meant you didn't fall far — you found new meaning in the descent.",
    archetype: "Wounded Healer",
    emoji: "🩹",
  },
};

// ── Trajectory analysis for arcs without hand-crafted narratives ────────────
function analyzeTrajectory(stages) {
  const w0 = STAGE_WEIGHT[stages[0]] || 2;
  const w1 = STAGE_WEIGHT[stages[1]] || 2;
  const w2 = STAGE_WEIGHT[stages[2]] || 2;

  const ascending = w2 > w0;
  const descending = w2 < w0;
  const vShaped = w1 < w0 && w1 < w2;
  const peaked = w1 > w0 && w1 > w2;

  if (vShaped) {
    return {
      name: `${stages[0]} → ${stages[1]} → ${stages[2]}`,
      narrative: `A valley arc — you descended from ${stages[0].toLowerCase()} through ${stages[1].toLowerCase()}, then climbed back to ${stages[2].toLowerCase()}. The low point was the turning point.`,
      archetype: "Valley Walker",
      emoji: "🏜️",
    };
  }
  if (peaked) {
    return {
      name: `${stages[0]} → ${stages[1]} → ${stages[2]}`,
      narrative: `A peak arc — rising from ${stages[0].toLowerCase()} to ${stages[1].toLowerCase()}, then releasing into ${stages[2].toLowerCase()}. What goes up comes down, and the descent carries its own gifts.`,
      archetype: "Summit Seeker",
      emoji: "🏔️",
    };
  }
  if (ascending) {
    return {
      name: `${stages[0]} → ${stages[2]}`,
      narrative: `An ascending arc — you move from ${stages[0].toLowerCase()} through ${stages[1].toLowerCase()} into ${stages[2].toLowerCase()}. The trajectory is upward.`,
      archetype: "Ascender",
      emoji: "📈",
    };
  }
  if (descending) {
    return {
      name: `${stages[0]} → ${stages[2]}`,
      narrative: `A releasing arc — from ${stages[0].toLowerCase()} through ${stages[1].toLowerCase()} to ${stages[2].toLowerCase()}. Something is being surrendered or composted for later use.`,
      archetype: "Surrenderer",
      emoji: "🍂",
    };
  }
  return {
    name: `${stages[0]} → ${stages[1]} → ${stages[2]}`,
    narrative: `A cyclical arc — ${stages[0].toLowerCase()} flows to ${stages[1].toLowerCase()} and arrives at ${stages[2].toLowerCase()}. You are in orbit around a central lesson.`,
    archetype: "Orbiter",
    emoji: "♾️",
  };
}

// ── Core detection function ─────────────────────────────────────────────────
export default async function detectArcs(userId, options = {}) {
  const minOccurrences = options.min || ARC_RULES.MIN_OCCURRENCES;
  const limit = options.limit || 10;

  // 1. Detect repeated 3-symbol sequences using ROW_NUMBER (gap-safe)
  // Also aggregate source_types across all instances of each triplet
  const sequences = await sql(
    `WITH numbered AS (
      SELECT
        id, symbol, stage, visual, theme, source_type, created_at,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at, id) AS rn
      FROM symbol_events
      WHERE user_id = $1
    )
    SELECT
      e1.symbol  AS symbol_1,  e2.symbol  AS symbol_2,  e3.symbol  AS symbol_3,
      e1.stage   AS stage_1,   e2.stage   AS stage_2,   e3.stage   AS stage_3,
      e1.visual  AS visual_1,  e2.visual  AS visual_2,  e3.visual  AS visual_3,
      e1.theme   AS theme_1,   e2.theme   AS theme_2,   e3.theme   AS theme_3,
      COUNT(*)   AS occurrences,
      MAX(e3.created_at) AS last_seen,
      MIN(e1.created_at) AS first_seen,
      COUNT(DISTINCT e1.source_type) +
        COUNT(DISTINCT e2.source_type) +
        COUNT(DISTINCT e3.source_type) AS source_type_breadth
    FROM numbered e1
    JOIN numbered e2 ON e2.rn = e1.rn + 1
    JOIN numbered e3 ON e3.rn = e1.rn + 2
    GROUP BY
      symbol_1, symbol_2, symbol_3,
      stage_1, stage_2, stage_3,
      visual_1, visual_2, visual_3,
      theme_1, theme_2, theme_3
    HAVING COUNT(*) >= $2
    ORDER BY occurrences DESC
    LIMIT $3`,
    [userId, minOccurrences, limit],
  );

  const now = Date.now();
  const activeCutoff = new Date(
    now - ARC_RULES.ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );
  const recentCutoff = new Date(
    now - ARC_RULES.RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  // 2. Enrich each sequence with narrative arc metadata + memory-weighted score
  const arcs = sequences.map((seq) => {
    const stages = [seq.stage_1, seq.stage_2, seq.stage_3];
    const symbols = [seq.symbol_1, seq.symbol_2, seq.symbol_3];
    const visuals = [seq.visual_1, seq.visual_2, seq.visual_3];
    const themes = [seq.theme_1, seq.theme_2, seq.theme_3];
    const stageArc = stages.join(" → ");

    const named = NAMED_ARCS[stageArc] || analyzeTrajectory(stages);

    const w0 = STAGE_WEIGHT[stages[0]] || 2;
    const w2 = STAGE_WEIGHT[stages[2]] || 2;
    const direction =
      w2 > w0 ? "ascending" : w2 < w0 ? "descending" : "lateral";

    const occ = parseInt(seq.occurrences);
    const intensity = computeIntensity(occ);

    // Days since last seen — for recency scoring
    const lastSeenDate = new Date(seq.last_seen);
    const daysSinceLastSeen = Math.max(
      0,
      (now - lastSeenDate) / (1000 * 60 * 60 * 24),
    );

    // Source diversity: how many distinct source types contributed to this arc
    const distinctSourceTypes = Math.max(
      1,
      parseInt(seq.source_type_breadth || 1),
    );

    // Numeric arc score: occurrences × recency × source diversity × recurrence weight
    const score = computeArcScore({
      occurrences: occ,
      daysSinceLastSeen,
      distinctSourceTypes,
    });

    return {
      // Identity
      path: `${symbols[0]} → ${symbols[1]} → ${symbols[2]}`,
      stageArc,
      symbols,
      stages,
      visuals,
      themes,

      // Arc narrative
      name: named.name,
      narrative: named.narrative,
      archetype: named.archetype,
      emoji: named.emoji,

      // Metrics
      occurrences: occ,
      intensity, // "emerging" | "strong" | "dominant"
      score: Math.round(score * 100) / 100, // numeric score for ranking
      direction,
      firstSeen: seq.first_seen,
      lastSeen: seq.last_seen,
      daysSinceLastSeen: Math.round(daysSinceLastSeen),
      distinctSourceTypes,
    };
  });

  // Re-sort by score (not just raw occurrences) — this is the memory-aware ranking
  arcs.sort((a, b) => b.score - a.score);

  // 3. Active / recent classification
  const activeArcs = arcs.filter(
    (a) => a.lastSeen && new Date(a.lastSeen) >= activeCutoff,
  );
  const recentArcs = arcs.filter(
    (a) => a.lastSeen && new Date(a.lastSeen) >= recentCutoff,
  );

  // 4. Dominant arc (highest score)
  const dominantArc = arcs[0] || null;

  // 5. Stage coverage
  const stagesInArcs = new Set();
  for (const arc of arcs) arc.stages.forEach((s) => stagesInArcs.add(s));
  const stagesCovered = STAGE_ORDER.filter((s) => stagesInArcs.has(s));
  const stagesMissing = STAGE_ORDER.filter((s) => !stagesInArcs.has(s));

  // 6. Direction summary weighted by score (not just count)
  const directionScores = { ascending: 0, descending: 0, lateral: 0 };
  for (const arc of arcs) {
    directionScores[arc.direction] =
      (directionScores[arc.direction] || 0) + arc.score;
  }
  const dominantDirection =
    Object.entries(directionScores).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "lateral";

  return {
    arcs,
    activeArcs,
    recentArcs,
    dominantArc,
    meta: {
      totalArcs: arcs.length,
      totalOccurrences: arcs.reduce((sum, a) => sum + a.occurrences, 0),
      totalScore:
        Math.round(arcs.reduce((sum, a) => sum + a.score, 0) * 100) / 100,
      dominantDirection,
      stagesCovered,
      stagesMissing,
      hasPatterns: arcs.length > 0,
    },
  };
}
