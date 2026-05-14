import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// ── Narrative templates for stage arcs ─────────────────────────────────────
const ARC_NARRATIVES = {
  "Crisis → Insight → Renewal": {
    title: "The Storm-to-Garden Arc",
    narrative:
      "You move through disruption into clarity, then emerge renewed. This is one of the oldest human patterns — breakdown, understanding, rebirth.",
    archetype: "The Phoenix Path",
  },
  "Beginning → Exploration → Insight": {
    title: "The Seeker's Arc",
    narrative:
      "You plant seeds, wander into the unknown, and arrive at understanding. Your curiosity is your compass.",
    archetype: "The Explorer",
  },
  "Exploration → Conflict → Renewal": {
    title: "The Trial Arc",
    narrative:
      "Seeking leads to struggle, but struggle leads to healing. You don't avoid the fire — you walk through it.",
    archetype: "The Warrior-Healer",
  },
  "Insight → Renewal → Beginning": {
    title: "The Eternal Return",
    narrative:
      "Understanding blooms into healing, and healing opens the door to something new. Every ending carries a seed.",
    archetype: "The Spiral",
  },
  "Conflict → Insight → Exploration": {
    title: "The Alchemist's Arc",
    narrative:
      "From the heat of struggle comes clarity, and that clarity drives you to seek further. Pain becomes fuel for discovery.",
    archetype: "The Alchemist",
  },
  "Renewal → Beginning → Exploration": {
    title: "The Fresh Start Arc",
    narrative:
      "After healing, you begin again — and this time, you explore with more wisdom and less fear.",
    archetype: "The Pilgrim",
  },
  "Crisis → Renewal → Beginning": {
    title: "The Resurrection Arc",
    narrative:
      "The storm breaks everything open. From the wreckage, healing grows. From healing, a new chapter begins.",
    archetype: "The Risen",
  },
};

function getArcNarrative(stages) {
  const arcKey = stages.join(" → ");
  if (ARC_NARRATIVES[arcKey]) return ARC_NARRATIVES[arcKey];

  // Dynamic narrative based on trajectory
  const trajectory = analyzeTrajectory(stages);
  return {
    title: `${stages[0]} → ${stages[2]}`,
    narrative: trajectory.description,
    archetype: trajectory.archetype,
  };
}

function analyzeTrajectory(stages) {
  const STAGE_WEIGHT = {
    Beginning: 1,
    Exploration: 2,
    Conflict: 3,
    Crisis: 3,
    Insight: 4,
    Renewal: 4,
    Mastery: 5,
    Awakening: 1,
    Growth: 2,
    Integration: 4,
  };

  const w0 = STAGE_WEIGHT[stages[0]] || 2;
  const w2 = STAGE_WEIGHT[stages[2]] || 2;

  if (w2 > w0) {
    return {
      description: `An ascending arc — you move from ${stages[0].toLowerCase()} through ${stages[1].toLowerCase()} into ${stages[2].toLowerCase()}. The trajectory is upward.`,
      archetype: "The Ascender",
    };
  }
  if (w2 < w0) {
    return {
      description: `A descending arc — from ${stages[0].toLowerCase()} through ${stages[1].toLowerCase()} to ${stages[2].toLowerCase()}. Something is being released or surrendered.`,
      archetype: "The Surrenderer",
    };
  }
  return {
    description: `A cyclical arc — ${stages[0].toLowerCase()} flows to ${stages[1].toLowerCase()} and arrives at ${stages[2].toLowerCase()}. You are in orbit around a central lesson.`,
    archetype: "The Orbiter",
  };
}

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const minOccurrences = parseInt(searchParams.get("min") || "2");

    // Use ROW_NUMBER to handle ID gaps — find truly consecutive events per user
    const sequences = await sql(
      `WITH numbered AS (
        SELECT
          id, symbol, stage, visual, theme, source_type, created_at, sequence_start,
          ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at, id) AS rn
        FROM symbol_events
        WHERE user_id = $1
      )
      SELECT
        e1.symbol  AS symbol_1,
        e2.symbol  AS symbol_2,
        e3.symbol  AS symbol_3,
        e1.stage   AS stage_1,
        e2.stage   AS stage_2,
        e3.stage   AS stage_3,
        e1.visual  AS visual_1,
        e2.visual  AS visual_2,
        e3.visual  AS visual_3,
        e1.theme   AS theme_1,
        e2.theme   AS theme_2,
        e3.theme   AS theme_3,
        COUNT(*)   AS occurrences,
        MAX(e3.created_at) AS last_seen
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
      LIMIT 10`,
      [userId, minOccurrences],
    );

    // Enrich each sequence with narrative
    const enriched = sequences.map((seq) => {
      const stages = [seq.stage_1, seq.stage_2, seq.stage_3];
      const symbols = [seq.symbol_1, seq.symbol_2, seq.symbol_3];
      const visuals = [seq.visual_1, seq.visual_2, seq.visual_3];
      const themes = [seq.theme_1, seq.theme_2, seq.theme_3];
      const arc = getArcNarrative(stages);

      return {
        symbols,
        stages,
        visuals,
        themes,
        occurrences: parseInt(seq.occurrences),
        lastSeen: seq.last_seen,
        path: `${seq.symbol_1} → ${seq.symbol_2} → ${seq.symbol_3}`,
        stageArc: `${seq.stage_1} → ${seq.stage_2} → ${seq.stage_3}`,
        ...arc,
      };
    });

    // Detect if user has an active dominant sequence (appeared recently)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeSequences = enriched.filter(
      (s) => s.lastSeen && new Date(s.lastSeen) >= weekAgo,
    );

    return Response.json({
      sequences: enriched,
      activeSequences,
      total: enriched.length,
      hasPatterns: enriched.length > 0,
    });
  } catch (err) {
    console.error("Sequence detection error:", err);
    return Response.json(
      { error: "Failed to detect sequences" },
      { status: 500 },
    );
  }
}
