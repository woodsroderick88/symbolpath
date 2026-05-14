/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *   SYMBOLPATH: SYMBOLIC ONTOLOGY
 *   Meaning Layer Specification v1.0
 *
 *   What the symbols actually mean.
 *
 *   This document defines the complete meaning system: archetypes, stages,
 *   emotional tones, transitions, shadow forms, growth forms, and the
 *   relationships between symbols.
 *
 *   Audience: Future contributors, AI interpretation layers, content designers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const SYMBOLIC_ONTOLOGY = {
  version: "1.0",
  lastUpdated: "2026-05-13",

  // ═══════════════════════════════════════════════════════════════════════════
  // I. THE FIVE STAGES — The Transformation Cycle
  //
  // SymbolPath models human transformation as a non-linear cycle through
  // five stages. These are NOT sequential requirements — they are
  // simultaneous, coexisting states that wax and wane.
  //
  // The stages are inspired by but distinct from: Campbell's Hero's Journey,
  // Jung's individuation process, alchemical transmutation stages,
  // and modern developmental psychology.
  // ═══════════════════════════════════════════════════════════════════════════
  stages: {
    Awakening: {
      rank: 0,
      essence: "The moment before the journey begins.",
      coreMeaning:
        "Potential, openness, the first stirring of awareness that something is changing.",
      emotionalTone:
        "Wonder mixed with vulnerability. The raw feeling of not-yet-knowing.",
      psychologicalFunction:
        "Disruption of the status quo. The invitation to grow. Opening.",
      whenHealthy:
        "A genuine new beginning — receptivity, curiosity, willingness to be changed.",
      whenShadow:
        "Perpetual beginnings without follow-through. Using novelty to avoid depth.",
      coreQuestion: "What is asking to be born?",
      archetypes: ["Seed", "Dawn", "Key", "Spark"],
      halfLifeDays: 14,
      halfLifeRationale:
        "Awakenings are transient — if not acted upon, they dissolve. This is psychologically accurate: unreinforced beginnings fade.",
    },

    Growth: {
      rank: 1,
      essence: "The work of becoming.",
      coreMeaning:
        "Active development, building capacity, deepening roots, gaining momentum.",
      emotionalTone:
        "Steady effort. The quiet satisfaction of progress. Occasional impatience.",
      psychologicalFunction:
        "Skill acquisition, pattern establishment, identity construction.",
      whenHealthy:
        "Sustained engagement with growth edges. Patience with process.",
      whenShadow:
        "Compulsive productivity. Growth as performance. Avoiding stillness.",
      coreQuestion: "What am I building, and why?",
      archetypes: ["Flame", "Mountain", "Tree", "River", "Bridge"],
      halfLifeDays: 21,
      halfLifeRationale:
        "Growth momentum holds for about 3 weeks without reinforcement — long enough to establish habits, short enough to require engagement.",
    },

    Crisis: {
      rank: 2,
      essence: "The necessary destruction.",
      coreMeaning:
        "Disruption, breakdown of unsustainable structures, confrontation with shadow.",
      emotionalTone:
        "Fear, anger, grief, disorientation. But also: clarity through intensity.",
      psychologicalFunction:
        "Dismantling what no longer serves. Exposing what was hidden. Forcing honesty.",
      whenHealthy:
        "Productive disruption that clears space for new growth. Transformation through fire.",
      whenShadow:
        "Chaos as identity. Addiction to drama. Destruction without construction.",
      coreQuestion: "What needs to break so something better can form?",
      archetypes: ["Storm", "Tower", "Mirror", "Abyss", "Labyrinth", "Serpent"],
      halfLifeDays: 35,
      halfLifeRationale:
        "Crises linger in memory — they are psychologically 'sticky.' This is accurate: traumatic and intense experiences persist longer than neutral ones.",
    },

    Integration: {
      rank: 3,
      essence: "The assembly of meaning.",
      coreMeaning:
        "Making sense of experience. Weaving fragments into coherence. Finding balance.",
      emotionalTone:
        "Calm after storm. The relief of understanding. Measured optimism.",
      psychologicalFunction:
        "Narrative construction, synthesis, reconciliation of opposites.",
      whenHealthy:
        "Genuine understanding that transforms behavior. Wisdom earned through experience.",
      whenShadow:
        "Intellectualizing emotions. Premature closure. Bypassing unresolved material.",
      coreQuestion: "What does this all mean?",
      archetypes: ["Scale", "Compass", "Lantern"],
      halfLifeDays: 21,
      halfLifeRationale:
        "Integration processing takes time but doesn't need to persist forever — understanding should eventually become implicit.",
    },

    Mastery: {
      rank: 4,
      essence: "The arrival — which is also a departure.",
      coreMeaning:
        "Genuine competence, earned wisdom, the capacity to hold complexity with ease.",
      emotionalTone:
        "Peace. Gratitude. Quiet confidence. The bittersweet awareness that every summit reveals the next valley.",
      psychologicalFunction:
        "Embodied wisdom. The ability to teach, to rest, and to choose the next spiral.",
      whenHealthy:
        "Genuine mastery — not perfection, but fluency. The capacity to help others.",
      whenShadow:
        "Arrogance. Stagnation through comfort. Refusing new challenges.",
      coreQuestion: "What wisdom am I now ready to share — or to release?",
      archetypes: ["Star", "Chalice", "Crown"],
      halfLifeDays: 49,
      halfLifeRationale:
        "Achievements should remain meaningful for 7 weeks — they're earned through sustained effort.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // II. SYMBOL ARCHETYPES — The Vocabulary
  //
  // Each symbol carries:
  //   - A core meaning (the essence)
  //   - A shadow expression (when stuck or unconscious)
  //   - A growth expression (when alive and intentional)
  //   - Emotional tone
  //   - Transition tendencies (what typically follows)
  //   - Symbolic relatives (related symbols across traditions)
  // ═══════════════════════════════════════════════════════════════════════════
  archetypeStructure: {
    requiredFields: {
      symbol: "The canonical name (e.g., 'Storm')",
      stage: "Which transformation stage this symbol belongs to",
      theme: "The thematic domain (e.g., 'upheaval', 'discovery')",
      visual: "The emoji representation for quick recognition",
    },

    meaningFields: {
      core_meaning:
        "The essential meaning of this symbol — what it represents at its deepest level.",
      emotional_tone:
        "The feeling-quality associated with this symbol. Not what it means, but what it FEELS like.",
      shadow_expression:
        "How this symbol manifests when it's stuck, regressive, or unconscious. The unhealthy version.",
      growth_expression:
        "How this symbol manifests when it's alive, intentional, and evolving. The healthy version.",
    },

    relationalFields: {
      transition_tendencies:
        "What symbols typically follow this one. Array of strings like 'Often precedes Dawn'.",
      symbolic_relatives:
        "Related symbols from other traditions. Array of strings.",
      associated_behaviors:
        "Common behaviors or life patterns associated with this symbol.",
    },

    promptFields: {
      reflection_prompts:
        "Questions the user can sit with when this symbol is active.",
      action_prompts:
        "Concrete actions the user can take when this symbol appears.",
      emotion_themes: "The emotional landscape this symbol evokes.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // III. POLARITY — Shadow and Growth
  //
  // Every symbol has two faces. The reasoning engine determines which
  // expression is active based on context:
  //   - Stage context (Crisis → shadow, Mastery → growth)
  //   - Emotional intensity
  //   - Gravity momentum (rising → growth, stuck → shadow)
  //   - Permanence state (anchored+fading → shadow, anchored+deep → growth)
  // ═══════════════════════════════════════════════════════════════════════════
  polarity: {
    title: "The Dual Nature of Symbols",

    shadowScoring: {
      factors: [
        { factor: "Crisis stage", shadowDelta: +3 },
        { factor: "Awakening stage", shadowDelta: +1 },
        { factor: "Growth stage", shadowDelta: -1 },
        { factor: "Integration stage", shadowDelta: -2 },
        { factor: "Mastery stage", shadowDelta: -3 },
        { factor: "Anchored + fading", shadowDelta: +2 },
        { factor: "Anchored + deep", shadowDelta: -2 },
        {
          factor: "14+ days idle, weight > 3.0",
          shadowDelta: +1,
          note: "Stuck — present but not moving",
        },
        {
          factor: "Active last 3 days, weight > 4.0",
          shadowDelta: -1,
          note: "Alive and moving",
        },
      ],
      thresholds: {
        shadow: "> 1",
        growth: "< -1",
        ambivalent: "-1 to 1 (not surfaced to user)",
      },
    },

    designPrinciple:
      "Shadow is not 'bad.' It is the unconscious or stuck expression. Naming the shadow is the first step toward its integration. The system never judges — it illuminates.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. RELATIONSHIPS — How Symbols Relate
  //
  // Symbols don't exist in isolation. They form:
  //   - Sequences (A typically precedes B)
  //   - Constellations (A, B, C co-occur as a unit)
  //   - Oppositions (A and B rarely appear together)
  //   - Transformations (A becomes B over time)
  // ═══════════════════════════════════════════════════════════════════════════
  relationships: {
    types: {
      precedes:
        "Symbol A typically appears before Symbol B (directional, temporal)",
      co_occurs:
        "Symbols A and B frequently appear in the same time window (non-directional)",
      opposes:
        "Symbols A and B rarely co-occur — the presence of one suppresses the other",
      transforms:
        "Symbol A evolves into Symbol B over an extended period (long-term directional)",
    },

    constellations: {
      definition:
        "A constellation is a cluster of 2+ symbols that co-occur so frequently they function as a single psychological unit.",
      threshold: "Co-occurrence weighted strength ≥ 2.0",
      significance:
        "When interpreting constellations, treat the cluster as ONE experience rather than multiple separate symbols.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // V. CONVERGENCE — Cross-Source Agreement
  //
  // The strongest signal in the system: when multiple independent sources
  // (dream + life event + tarot) all point to the same symbol.
  // ═══════════════════════════════════════════════════════════════════════════
  convergence: {
    definition:
      "Two or more independent source types emit the same symbol within a 7-day window.",
    significance:
      "Cross-modality agreement is the most reliable indicator that a symbol is genuinely active — not just a coincidence or a card that happened to come up.",
    levels: {
      dual: {
        sourceCount: 2,
        priority: "High",
        note: "Two sources agree — worth careful attention",
      },
      triple: {
        sourceCount: 3,
        priority: "Critical",
        note: "Three sources — the signal is unmistakable",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. SOURCE TAXONOMY — Where Symbols Come From
  //
  // SymbolPath ingests symbolic data from many sources. Each has a different
  // relationship to consciousness:
  // ═══════════════════════════════════════════════════════════════════════════
  sources: {
    taxonomy: {
      unconscious: {
        sources: ["dream"],
        description:
          "Symbols that surface without volition. What appears here is not chosen — it emerges.",
        significance:
          "Highest signal for what the psyche is processing below awareness.",
      },
      intentional: {
        sources: ["tarot_reading", "i-ching", "oracle", "intent"],
        description:
          "Symbols that appear through deliberate ritual consultation.",
        significance:
          "The person is actively seeking guidance. The act of seeking is itself meaningful.",
      },
      experiential: {
        sources: ["life_event", "decision", "relationship"],
        description: "Symbols derived from real-world events and choices.",
        significance:
          "Ground truth — what actually happened, not what was dreamed or divined.",
      },
      reflective: {
        sources: ["mood_log", "manual"],
        description: "Self-reported emotional state and manual symbol logging.",
        significance:
          "Useful but noisy — the person's conscious interpretation of their state.",
      },
      environmental: {
        sources: ["moon_phase", "astro_transit"],
        description: "External triggers not personally generated.",
        significance: "Context and timing, not personal signal. Lowest weight.",
      },
    },
  },
};

export default SYMBOLIC_ONTOLOGY;
