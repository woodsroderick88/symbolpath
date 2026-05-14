/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *   SYMBOLPATH: TRANSFORMATION THEORY
 *   Philosophical & Intelligence Layer Specification v1.0
 *
 *   Why the stages exist and how movement works.
 *
 *   This document defines SymbolPath's theory of transformation — the
 *   philosophical foundation that makes the system psychologically credible.
 *   It covers progression, regression, cyclical behavior, suppression,
 *   and the nature of symbolic intelligence.
 *
 *   Audience: Future contributors, AI interpretation layers, product designers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const TRANSFORMATION_THEORY = {
  version: "1.0",
  lastUpdated: "2026-05-13",

  // ═══════════════════════════════════════════════════════════════════════════
  // I. THE CENTRAL THESIS
  //
  // SymbolPath's theory of transformation is built on one premise:
  //
  //   Human transformation is not linear.
  //   It is a spiral.
  //
  // You don't progress from Awakening → Growth → Crisis → Integration → Mastery
  // in a straight line, graduate, and never return. Instead, you spiral
  // through these stages repeatedly, at ever-deeper levels.
  //
  // Each cycle through the spiral teaches you something new about the
  // same fundamental themes. The second Crisis isn't the same as the first —
  // it's deeper, and you bring everything you learned the first time.
  //
  // This is the core insight that separates SymbolPath from linear
  // progress trackers: regression is not failure. It is the spiral's
  // return to familiar ground at a deeper level.
  // ═══════════════════════════════════════════════════════════════════════════
  centralThesis: {
    title: "The Spiral Model of Transformation",
    summary:
      "Human transformation is not linear — it is a spiral. You revisit the same stages at ever-deeper levels, carrying forward what you learned in previous cycles.",
    implications: [
      "Regression is not failure — it is the spiral's return to familiar territory with new wisdom.",
      "Multiple stages can coexist simultaneously — humans are layered, not monolithic.",
      "No stage is inherently 'better' — Crisis is as valuable as Mastery.",
      "Completion is an illusion — every arrival is also a departure.",
      "Depth matters more than direction — how deeply you engage a stage matters more than which stage you're in.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // II. PROGRESSION — Forward Movement
  //
  // Progression happens when:
  //   - Gravity naturally shifts from lower-rank to higher-rank stages
  //   - Symbols from higher stages become more active
  //   - Arc patterns show ascending trajectories
  //
  // Progression is not the "goal" — it's one type of movement.
  // ═══════════════════════════════════════════════════════════════════════════
  progression: {
    title: "Forward Movement Through Stages",

    mechanisms: {
      naturalShift:
        "As lower-stage symbols decay and higher-stage events accumulate, the dominant stage shifts upward.",
      arcCompletion:
        "When a recognized arc completes (e.g., Crisis → Integration → Mastery), the system names and validates the progression.",
      convergence:
        "Multiple sources confirming higher-stage symbols accelerates perceived progression.",
    },

    confidenceRequirements: {
      low: "1 event in the new stage — detected but not trusted",
      medium: "3+ events — reasonably evidenced",
      high: "5+ events across 2+ distinct days — confirmed progression",
    },

    acceleration:
      "A stage shift that completes within 3 days is flagged as 'accelerating' — rapid transformation.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // III. REGRESSION — The Descent
  //
  // Regression is when the dominant stage moves DOWN the stage ladder.
  // This is psychologically real and significant. The system treats it
  // with full seriousness and narrative weight.
  //
  // Design principle: Regression is NEVER presented as failure.
  // It is always contextualized as meaningful movement.
  // ═══════════════════════════════════════════════════════════════════════════
  regression: {
    title: "Regression — Backward Movement Through Stages",

    designPrinciple:
      "Regression is never failure. It is the spiral revisiting familiar ground at a new depth. The system contextualizes every regression with narrative meaning.",

    namedRegressions: {
      "Mastery → Crisis": {
        name: "The Descent",
        meaning:
          "Mastery doesn't make you immune to storms. Returning to crisis after mastery means meeting an old place with hard-won eyes.",
        depth: 2,
        significance:
          "The deepest regression — and often the precursor to the most profound transformation.",
      },
      "Mastery → Growth": {
        name: "The Humbling",
        meaning:
          "After arriving at mastery, something calls you back to the work of building. This isn't loss — it's choosing to grow in a new direction.",
        depth: 1,
        significance:
          "Voluntary re-engagement with growth. The master becomes student.",
      },
      "Integration → Crisis": {
        name: "The Unraveling",
        meaning:
          "What was being woven together met a force that pulled threads loose. The meaning isn't lost — it's being tested.",
        depth: 1,
        significance:
          "Integration that hasn't been stress-tested. The crisis is the test.",
      },
      "Integration → Awakening": {
        name: "The Reset",
        meaning:
          "Understanding dissolved into something raw and new. Sometimes the deepest integration opens a door to a completely fresh beginning.",
        depth: 2,
        significance:
          "A rare and powerful regression — the person has outgrown their current framework entirely.",
      },
      "Growth → Awakening": {
        name: "The Return to Zero",
        meaning:
          "What was growing found its limits and released. Now you stand at a new threshold, lighter than before.",
        depth: 1,
        significance:
          "The growth path reached a dead end — but dead ends are doorways in disguise.",
      },
    },

    rules: {
      minimumConfidence: "medium",
      minimumConfidenceNote:
        "Regressions are only flagged when there are 3+ events supporting the new stage. Single events in a lower stage are noise, not regression.",
      driverIdentification:
        "The system identifies which specific symbols drove the regression — naming the doorway the regression moved through.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. COEXISTENCE — Simultaneous States
  //
  // The most psychologically sophisticated feature of SymbolPath:
  // multiple stages always coexist.
  //
  // A person is never purely in one stage. They are always a weighted
  // mixture of all stages, with one dominant and several secondary.
  //
  // This models the layered nature of human experience:
  //   - You can be in Crisis about your career while in Growth in relationships
  //   - You can feel Mastery in one domain and Awakening in another
  //   - Unresolved material from previous stages persists as background gravity
  // ═══════════════════════════════════════════════════════════════════════════
  coexistence: {
    title: "Stage Coexistence — Multiple Simultaneous States",

    psychologicalBasis:
      "Humans are not monolithic. At any moment, a person carries multiple active transformation processes at different stages of development. SymbolPath's gravity model naturally captures this because each symbol has its own stage, and a user accumulates gravity across many symbols simultaneously.",

    entropyInterpretation: {
      focused: {
        range: "0.0 – 0.3",
        meaning:
          "All energy is concentrated in one transformation. The person is deeply engaged with a single process — for better or worse.",
        example: "Crisis at 80% — everything is in upheaval right now.",
      },
      blended: {
        range: "0.3 – 0.7",
        meaning:
          "Two or three stages coexist meaningfully. The person is navigating multiple active processes. This is the most common state.",
        example:
          "Growth at 40%, Crisis at 30% — building while also confronting. Productive tension.",
      },
      fragmented: {
        range: "0.7 – 1.0",
        meaning:
          "Gravity is spread across all stages with no clear dominant. The symbolic field is maximally dispersed. This can mean richness or overwhelm — context determines which.",
        example:
          "All stages between 15% and 25% — the person is touching everything, gripping nothing.",
      },
    },

    clinicalNote:
      "The coexistence ratio is NOT a diagnostic tool. It is a descriptive measure of symbolic state distribution. High entropy is not inherently good or bad — it describes a particular mode of engagement with transformation.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // V. CYCLICAL BEHAVIOR — Rhythms and Patterns
  //
  // Over time, individuals develop recognizable rhythmic patterns in how
  // they move through stages. These are not pathologies — they are
  // structural tendencies of the personality.
  // ═══════════════════════════════════════════════════════════════════════════
  cyclicalBehavior: {
    title: "Symbolic Rhythms — Repeating Patterns of Transformation",

    types: {
      stageCycles: {
        description: "Recurring transitions between specific stages.",
        example:
          "Growth → Crisis occurs 5 times over 6 months — the person consistently pushes into growth until hitting a wall.",
        interpretation:
          "Stage cycles reveal structural tendencies. They're not 'problems' — they're the person's characteristic rhythm of engagement with transformation.",
      },

      symbolSequences: {
        description:
          "Specific symbols that consistently follow other symbols within a time window.",
        example:
          "Within 14 days of Mirror appearing, Lantern appears — self-reflection reliably leads to illumination for this person.",
        interpretation:
          "Symbol sequences are personal laws of symbolic physics. They reveal how the individual's psyche processes specific archetypal energies.",
      },

      seasonalRhythms: {
        description:
          "Stage or symbol activity that clusters in specific calendar seasons.",
        example:
          "Awakening energy concentrates in spring — Crisis energy concentrates in winter.",
        interpretation:
          "Seasonal patterns may reflect environmental, hormonal, or cultural rhythms. They are not deterministic but can be anticipatory — 'winter is coming, and with it, your historical pattern of crisis.'",
      },

      suppression: {
        description:
          "Extended absence of a stage that was previously active, followed by crisis.",
        example:
          "Growth goes silent for 30 days. Crisis dominates during that silence. Growth was being suppressed, and crisis emerged from the pressure.",
        interpretation:
          "Suppression is the avoidance of a necessary stage. The longer the suppression, the more intense the eventual eruption. The system should warn when a stage goes dark.",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VI. MATURATION — How Symbolic Vocabulary Evolves
  //
  // Over months and years, a person's relationship with the symbolic
  // system changes. The vocabulary expands, the dominant stages shift,
  // the complexity of engagement deepens.
  // ═══════════════════════════════════════════════════════════════════════════
  maturation: {
    title: "Symbolic Maturation — The Evolution of Meaning",

    phases: {
      initial:
        "Early engagement — few symbols, often concentrated in one or two stages. The person is learning the vocabulary.",
      expanding:
        "Symbol diversity grows. Multiple stages become active. Source types diversify. The field is becoming richer.",
      focusing:
        "After expansion, the person naturally focuses on the symbols that truly matter. The vocabulary narrows but deepens.",
      integrated:
        "The symbolic vocabulary becomes fluent. The person engages naturally across all stages, with established personal symbols that carry deep, personalized meaning.",
    },

    metrics: {
      symbolDiversity: "How many unique symbols are active",
      stageCoverage: "How many stages have active gravity",
      sourceBreadth: "How many source types the person uses",
      complexity:
        "Normalized product of stage entropy × symbol diversity × source breadth",
    },

    arcTypes: {
      expanding:
        "Complexity and diversity are growing. The field is becoming richer.",
      focusing:
        "Complexity is decreasing. The person is narrowing to core symbols.",
      shifting: "Dominant stage has changed. The center of gravity has moved.",
      steady:
        "Stable engagement. Same dominant stage, same symbol count. Groundedness or stagnation.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VII. EMOTIONAL WEATHER — The Macro Climate
  //
  // Individual observations are weather events. The emotional weather
  // system tracks the macro climate — the sustained tone of the
  // symbolic field over weeks.
  // ═══════════════════════════════════════════════════════════════════════════
  emotionalWeather: {
    title: "Emotional Weather — The Climate of the Symbolic Field",

    conditions: {
      Stormy: "Heavy Crisis energy dominates. The field is turbulent.",
      Dawning: "Awakening energy fills the field. New beginnings are emerging.",
      Growing: "Growth energy dominates. Things are being built.",
      Clearing: "Integration energy is active. Meaning is being assembled.",
      Radiant: "Mastery energy shines through. Calm and capable.",
      Shifting: "Multiple energies compete. The field is in active transition.",
      Turbulent: "No stage dominates. Maximum fragmentation. Uncertainty.",
      Still: "No significant activity. Quiet period.",
    },

    streaks:
      "How many consecutive weeks a weather pattern has held. Long streaks are psychologically significant — 4+ weeks of Stormy weather is a sustained crisis, not a bad day.",

    forecasting: {
      basis: "Based on the trend direction of the last 3 weekly windows.",
      continuation:
        "3 weeks of the same condition → predict continuation with high confidence.",
      ascending:
        "Stages trending upward → predict continued ascent with medium confidence.",
      descending:
        "Stages trending downward → predict continued descent with medium confidence.",
      uncertain: "No clear trend → no confident prediction.",
      note: "Forecasts are suggestive, never deterministic. The system never tells a person what WILL happen — it tells them what TENDS to happen given their history.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VIII. THE INTELLIGENCE HIERARCHY
  //
  // SymbolPath's intelligence operates in four layers, each building on
  // the one below. This hierarchy determines what the system can know,
  // interpret, and surface at each level.
  // ═══════════════════════════════════════════════════════════════════════════
  intelligenceHierarchy: {
    layers: {
      data: {
        level: 1,
        name: "Data Layer",
        description:
          "Raw events, gravity scores, database tables. No interpretation.",
        examples: [
          "symbol_events rows",
          "symbol_gravity weights",
          "gravity_history snapshots",
        ],
        question: "What happened?",
      },

      pattern: {
        level: 2,
        name: "Pattern Layer",
        description:
          "Recurring sequences, stage shifts, coexistence metrics, arc detection.",
        examples: [
          "3-symbol arcs",
          "stage shift detection",
          "coexistence entropy",
          "cycle detection",
        ],
        question: "What keeps happening?",
      },

      interpretation: {
        level: 3,
        name: "Interpretation Layer",
        description:
          "Reasoned observations with narrative meaning. Convergence, shadow/growth polarity, threshold proximity, momentum, constellations, transitions, absence.",
        examples: [
          "Storm is expressing its shadow",
          "Chalice is converging across 3 sources",
          "The Descent — regression from Mastery to Crisis",
        ],
        question: "What does this mean?",
      },

      guidance: {
        level: 4,
        name: "Guidance Layer",
        description:
          "Contextual prompts, reflection questions, practice recommendations, warnings. Tailored to current state.",
        examples: [
          "Ask: Where am I stuck in Storm's shadow?",
          "Your symbolic weather has been Stormy for 4 weeks — the longest in your history.",
          "Watch for suppression: Growth has been silent for 30 days.",
        ],
        question: "What should I pay attention to?",
      },
    },

    designPrinciple:
      "Each layer depends on the layers below it. Guidance without interpretation is generic. Interpretation without patterns is speculation. Patterns without data are hallucination. The stack must be complete.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IX. ETHICAL PRINCIPLES
  //
  // SymbolPath deals with psychological territory. These principles
  // govern how the system treats the humans who use it.
  // ═══════════════════════════════════════════════════════════════════════════
  ethics: {
    principles: [
      {
        name: "Never diagnose",
        description:
          "SymbolPath is a symbolic mapping tool, not a clinical instrument. It never says 'you are depressed' or 'you have trauma.' It says 'Storm is active in your field' and lets the person draw their own meaning.",
      },
      {
        name: "Never judge",
        description:
          "No stage is better than another. Crisis is not failure. Regression is not weakness. Shadow is not 'bad.' The system illuminates without evaluating.",
      },
      {
        name: "Always contextualize",
        description:
          "Every observation is presented with context, narrative, and guidance. A bare data point is meaningless — the system always tells the story around it.",
      },
      {
        name: "Respect agency",
        description:
          "The system surfaces patterns and offers interpretations. It never prescribes action. The guidance layer uses 'Ask yourself:' and 'Consider:' — never 'You must' or 'You should.'",
      },
      {
        name: "Protect the vulnerable",
        description:
          "When Crisis is sustained or deep, the system's tone should be gentler, not alarming. Extended crisis narratives always include: 'This is intense, and it's okay to seek support outside this tool.'",
      },
    ],
  },
};

export default TRANSFORMATION_THEORY;
