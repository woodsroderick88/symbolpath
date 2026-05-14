/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *   SYMBOLPATH: SYMBOLIC PHYSICS
 *   Engine Specification v1.0
 *
 *   How the system behaves mathematically.
 *
 *   This document is the formal specification for SymbolPath's memory engine.
 *   Every numeric behavior — decay, growth, anchoring, scoring — is defined
 *   here with equations, constants, and design rationale.
 *
 *   Audience: Future contributors, AI interpretation layers, system auditors
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const SYMBOLIC_PHYSICS = {
  version: "1.0",
  lastUpdated: "2026-05-13",

  // ═══════════════════════════════════════════════════════════════════════════
  // I. GRAVITY
  //
  // Every symbol in a user's stream has a "gravity" score — a real-valued
  // measure of how present, significant, and psychologically active that
  // symbol currently is in the person's life.
  //
  // Gravity is NOT a simple counter. It is a weighted, time-decaying,
  // intensity-modulated, ceiling-bounded accumulator. It models the
  // psychological reality that:
  //   - Recent events matter more than old ones
  //   - Some sources carry more signal than others
  //   - Extreme emotions leave deeper impressions
  //   - Repeated exposure has diminishing returns
  //   - Sufficiently deep patterns become permanent
  // ═══════════════════════════════════════════════════════════════════════════
  gravity: {
    title: "Gravity — The Weight of Symbolic Presence",

    // ── The Core Equation ──
    // When a new event is recorded for a symbol:
    //
    //   1. Decay the stored weight:
    //      decayedWeight = storedWeight × e^(-λ × daysSinceLastSeen)
    //      where λ = ln(2) / halfLife
    //
    //   2. Compute the contribution:
    //      contribution = sourceWeight × recencyMultiplier × intensityMultiplier
    //
    //   3. Apply diminishing returns (if above threshold):
    //      if decayedWeight > DIMINISHING_THRESHOLD:
    //        contribution = contribution × (DIMINISHING_THRESHOLD / decayedWeight)^0.5
    //
    //   4. Add and enforce ceiling:
    //      newWeight = min(decayedWeight + contribution, CEILING)
    //
    //   5. Enforce anchor floor (if anchored):
    //      newWeight = max(newWeight, anchorFloor)
    equation: "W(t) = max(anchorFloor, min(CEILING, W₀·e^(-λt) + C·R·I·D))",
    variables: {
      "W₀": "Stored weight at last write",
      λ: "Decay constant = ln(2) / halfLife",
      t: "Days since last event",
      C: "Source contribution weight (0.6 – 2.0)",
      R: "Recency multiplier (1.0 – 1.5)",
      I: "Emotional intensity multiplier (0.7 – 1.6)",
      D: "Diminishing returns factor (0 – 1.0)",
    },

    // ── Source Weights ──
    // How much a single event from each source type contributes to gravity.
    // Design: real-world events > unconscious surfacing > intentional divination > logs
    sourceWeights: {
      life_event: {
        weight: 2.0,
        rationale:
          "Real-world events carry maximum weight — they are the ground truth of experience.",
      },
      dream: {
        weight: 1.8,
        rationale:
          "Unconscious surfacing — what appears without volition is high signal.",
      },
      "i-ching": {
        weight: 1.5,
        rationale: "Intentional divination consultation with historical depth.",
      },
      decision: {
        weight: 1.4,
        rationale:
          "Emotionally weighted and deliberate — the person chose to engage.",
      },
      tarot_reading: {
        weight: 1.3,
        rationale: "Intentional ritual, symbolically precise.",
      },
      oracle: { weight: 1.2, rationale: "Intentional oracle consultation." },
      intent: {
        weight: 1.2,
        rationale:
          "Deliberate intention-setting — the person is directing energy.",
      },
      relationship: {
        weight: 1.2,
        rationale: "Interpersonal patterns create persistent context.",
      },
      manual: { weight: 1.0, rationale: "User-defined baseline." },
      mood_log: { weight: 0.9, rationale: "Frequent but higher noise ratio." },
      moon_phase: {
        weight: 0.7,
        rationale: "External trigger — not personally generated.",
      },
      astro_transit: {
        weight: 0.6,
        rationale: "External, weakest personal signal.",
      },
    },

    // ── Emotional Intensity ──
    // Intensity modulates the contribution based on how strongly the emotion
    // was expressed. "Terrified" weighs more than "slightly worried."
    emotionalIntensity: {
      extreme: {
        multiplier: 1.6,
        keywords: [
          "terrified",
          "devastated",
          "shattered",
          "ecstatic",
          "panicked",
        ],
      },
      high: {
        multiplier: 1.3,
        keywords: ["scared", "broken", "depressed", "passionate", "determined"],
      },
      normal: {
        multiplier: 1.0,
        note: "Default — any unmatched emotional text",
      },
      low: {
        multiplier: 0.7,
        keywords: ["slightly", "a bit", "somewhat", "mildly", "meh", "okay"],
      },
      numericScale: {
        "9-10": { multiplier: 1.6, label: "Life-altering" },
        "7-8": { multiplier: 1.3, label: "Significant" },
        "4-6": { multiplier: 1.0, label: "Moderate" },
        "1-3": { multiplier: 0.7, label: "Minor" },
      },
    },

    // ── Recency ──
    // Events happening right now matter more than events from last week.
    recency: {
      sameDay: 1.5,
      yesterday: 1.4,
      last3Days: 1.2,
      lastWeek: 1.1,
      older: 1.0,
    },

    // ── Diminishing Returns ──
    // Prevents runaway gravity from volume-heavy users.
    diminishingReturns: {
      threshold: 8.0,
      power: 0.5,
      ceiling: 30.0,
      explanation:
        "Above weight 8.0, each new contribution is dampened by (8.0/weight)^0.5. At weight 16, contributions are at ~71%. At weight 24, ~58%. At 30.0, they stop entirely.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // II. DECAY
  //
  // Gravity decays exponentially over time. The rate of decay depends on
  // the symbol's stage — because different kinds of experiences persist
  // in memory for different durations.
  // ═══════════════════════════════════════════════════════════════════════════
  decay: {
    title: "Temporal Decay — How Memory Fades",
    equation: "W(t) = W₀ × e^(-ln2/halfLife × t)",

    halfLives: {
      Awakening: {
        days: 14,
        rationale:
          "Potential fades fastest if not reinforced. A beginning that isn't acted on wasn't real.",
      },
      Growth: {
        days: 21,
        rationale: "Momentum holds for 3 weeks, then needs reinforcement.",
      },
      Crisis: {
        days: 35,
        rationale:
          "Crises linger — they're memorable and contextually long-lived.",
      },
      Integration: {
        days: 21,
        rationale:
          "Processing takes time but doesn't need to persist indefinitely.",
      },
      Mastery: {
        days: 49,
        rationale:
          "Achievements should remain meaningful for 7 weeks — they're earned.",
      },
    },

    // Example: Storm (Crisis, halfLife=35)
    // After 7 days:  87% of original weight remains
    // After 14 days: 76%
    // After 35 days: 50% (by definition — one half-life)
    // After 70 days: 25%
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // III. PERMANENCE — When Memory Becomes Identity
  //
  // Some symbols cross a threshold and become permanent. This models the
  // psychological reality that certain experiences leave lasting traces
  // regardless of how much time passes.
  // ═══════════════════════════════════════════════════════════════════════════
  permanence: {
    title: "Permanence — The Anchor System",

    anchorThresholds: {
      standard: {
        threshold: 10.0,
        note: "Most symbols — must reach weight 10 to anchor",
      },
      Crisis: {
        threshold: 7.0,
        note: "Crisis anchors more easily — crises leave deeper impressions",
      },
      Mastery: {
        threshold: 8.0,
        note: "Mastery anchors more easily — earned achievements persist",
      },
      Awakening: {
        threshold: 12.0,
        note: "Awakening is transient — needs stronger evidence to anchor",
      },
    },

    anchorFloors: {
      standard: {
        floor: 2.5,
        note: "Anchored symbols never drop below 2.5 — permanent background signal",
      },
      highPermanence: {
        floor: 4.0,
        condition: "peak_weight >= 20.0",
        note: "Deeply embedded symbols hold a higher floor",
      },
    },

    permanenceLevels: {
      deep: {
        condition: "anchored AND peak_weight >= 20.0",
        description: "Symbol is deeply embedded in identity",
      },
      anchored: {
        condition: "anchored",
        description: "Symbol has crossed the permanence threshold",
      },
      strong: {
        condition: "liveWeight > 4.0",
        description: "High gravity but not yet anchored",
      },
      active: {
        condition: "liveWeight > 1.5",
        description: "Normal active symbol",
      },
      fading: {
        condition: "liveWeight <= 1.5",
        description: "Gravity dropping, symbol becoming inactive",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. COEXISTENCE — Entropy and Stage Distribution
  //
  // A user is never purely in one stage. The coexistence model acknowledges
  // simultaneous transformation vectors, mixed emotional landscapes,
  // unresolved transitions, and overlapping developmental states.
  // ═══════════════════════════════════════════════════════════════════════════
  coexistence: {
    title: "Stage Coexistence — The Entropy Model",

    equation: "E = -Σ(p_i × ln(p_i)) / ln(N)",
    variables: {
      E: "Coexistence ratio (0–1). 0 = all gravity in one stage. 1 = perfectly even.",
      p_i: "Proportion of total gravity in stage i",
      N: "Number of active stages",
    },

    secondaryThreshold: 0.25,
    secondaryThresholdNote:
      "A stage with ≥25% of the dominant stage's gravity is considered 'active' and surfaced as secondary",

    implications: {
      focused: {
        ratio: "0.0–0.3",
        description:
          "All gravity concentrated in one stage. Clear dominant energy.",
      },
      blended: {
        ratio: "0.3–0.7",
        description:
          "Two or three stages coexist. The person is in transition.",
      },
      fragmented: {
        ratio: "0.7–1.0",
        description:
          "Gravity spread across many stages. No single energy dominates. High entropy.",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // V. ARC SCORING — Pattern Confidence
  //
  // Arcs (recurring 3-event sequences) are scored by a composite metric
  // that weights recency, source diversity, and recurrence depth.
  // ═══════════════════════════════════════════════════════════════════════════
  arcScoring: {
    title: "Arc Scoring — Pattern Confidence",

    equation:
      "score = occurrences × recurrenceMultiplier × recencyBonus × sourceDiversityBonus",

    recurrenceMultipliers: { first: 1.0, second: 1.2, "third+": 1.4 },
    recencyBonuses: { active_7d: 1.35, recent_30d: 1.15, cold: 1.0 },
    sourceDiversityBonus:
      "1.0 + 0.15 per additional source type beyond the first",

    intensityBuckets: {
      emerging: "2+ occurrences",
      strong: "3+ occurrences",
      dominant: "5+ occurrences",
    },
  },
};

export default SYMBOLIC_PHYSICS;
