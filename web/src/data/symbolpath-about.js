/**
 * SymbolPath — Packaging Phase A
 * Public Clarity Content
 *
 * All canonical text for the landing page, about page, and README.
 * Single source of truth for how SymbolPath describes itself.
 */

// ─── 1. CANONICAL DEFINITION ───

export const CANONICAL = {
  tagline: "Track your symbolic transformation over time",
  definition:
    "SymbolPath is a symbolic transformation tracking system that models atmosphere, archetypes, identity, and transformation across time.",
  spine: [
    {
      label: "Multiple Inputs",
      detail: "Tarot, dreams, moods, rituals, life events, I Ching, astrology",
    },
    {
      label: "Unified Symbol Stream",
      detail: "Everything becomes one evolving symbolic timeline",
    },
    {
      label: "Pattern Detection",
      detail: "Recurrence, gravity, sequences, arcs",
    },
    {
      label: "Symbolic Identity",
      detail: "Constellations, signatures, climates, seasons",
    },
    {
      label: "Mythic Continuity",
      detail: "Chapters, initiations, wounds, life-era synthesis",
    },
  ],
};

// ─── 2. CORE PHILOSOPHY ───

export const PHILOSOPHY = [
  {
    title: "Human experience is symbolic",
    body: "People naturally experience recurring emotional climates, archetypal patterns, transformations, thresholds, and cycles. These aren't metaphors — they are how humans process change.",
    icon: "🌊",
  },
  {
    title: "Existing systems fragment reflection",
    body: "Journals, tarot, moods, rituals, dreams, and life events are usually isolated in separate apps. A dream, a tarot pull, and a mood log on the same day are three separate data points. The pattern between them stays invisible.",
    icon: "🔗",
  },
  {
    title: "SymbolPath unifies them",
    body: "Every input — regardless of source — resolves into a shared symbolic language. Everything becomes part of one evolving symbolic stream. Patterns that were invisible across separate tools become visible in the unified field.",
    icon: "🌀",
  },
  {
    title: "Meaning emerges across time",
    body: "The system does not diagnose or define. It observes recurrence, atmosphere, continuity, and transformation. A single event is noise. A repeating arc across 30 days is signal. Meaning is something you discover, not something you're told.",
    icon: "⏳",
  },
];

// ─── 3. HOW IT WORKS WALKTHROUGH ───

export const WALKTHROUGH = {
  title: "One event. Eight downstream effects.",
  scenario: "A difficult conversation occurs",
  steps: [
    {
      action: "Logged as a life event",
      detail: "You record what happened in your own words.",
      icon: "📝",
    },
    {
      action: "Mapped to Storm ⛈️",
      detail:
        "The system resolves the event to a symbolic archetype — in this case, Storm (Crisis stage).",
      icon: "⛈️",
    },
    {
      action: "Added to the Symbol Stream",
      detail:
        "The event joins a unified timeline alongside tarot readings, dreams, mood logs — every source in one stream.",
      icon: "🌊",
    },
    {
      action: "Gravity updated",
      detail:
        "Storm's weight increases. If it keeps appearing, it becomes a permanent resident of your symbolic field.",
      icon: "🪨",
    },
    {
      action: "Atmosphere shifts toward turbulent",
      detail:
        "The emotional climate of your field reflects the accumulation — not a single event, but the texture of recent weeks.",
      icon: "🌪️",
    },
    {
      action: "Counterbalance symbols surface",
      detail:
        "The system notices what other symbols typically appear alongside or after Storm — Lantern, Bridge, Seed — and makes them visible.",
      icon: "⚖️",
    },
    {
      action: "Identity tendencies updated",
      detail:
        "Your transformation signature — how you typically move through stages — gets refined with new data.",
      icon: "🧬",
    },
    {
      action: "Mythology reflects the transition",
      detail:
        'If this event marks a chapter boundary, the mythic continuity engine names it: "The Descent," "The Return to Crisis."',
      icon: "📖",
    },
  ],
};

// ─── 4. ARCHITECTURE LAYERS ───

export const ARCHITECTURE = [
  {
    layer: "Inputs",
    purpose:
      "Reflections, dreams, rituals, moods, tarot, life events, I Ching, astrology",
    color: "#60A5FA",
    icon: "📥",
  },
  {
    layer: "Symbol Stream",
    purpose:
      "Unified symbolic memory — every source feeds one evolving timeline",
    color: "#34D399",
    icon: "🌊",
  },
  {
    layer: "Pattern Engine",
    purpose:
      "Recurrence, gravity, sequences, arc detection, stage distribution",
    color: "#FBBF24",
    icon: "🔍",
  },
  {
    layer: "Identity Engine",
    purpose: "Archetypes, constellations, emotional climates, symbolic seasons",
    color: "#A78BFA",
    icon: "🧬",
  },
  {
    layer: "Mythology Engine",
    purpose: "Continuity, chapters, initiations, wounds, life-era synthesis",
    color: "#F472B6",
    icon: "📖",
  },
];

// ─── 5. TERMINOLOGY GLOSSARY ───

export const GLOSSARY = [
  {
    term: "Atmosphere",
    definition:
      "The emotional climate of your symbolic field — not a single mood, but the accumulated texture of recent symbolic activity. Like weather vs. climate.",
    example:
      '"turbulent" — when Crisis-stage symbols dominate the recent stream',
  },
  {
    term: "Gravity",
    definition:
      "A weighted frequency score for each symbol. Increases with each appearance, decays over time. High-gravity symbols shape the field even when they haven't appeared recently.",
    example: "Storm at weight 8.4 — it keeps pulling the field toward Crisis",
  },
  {
    term: "Constellation",
    definition:
      "A group of symbols that repeatedly appear together. Not random co-occurrence — a structural feature of how your symbolic field organizes itself.",
    example:
      '"The Reckoning" — Storm, Flame, Mirror, Lantern appearing as a group',
  },
  {
    term: "Threshold",
    definition:
      "A transition point between transformation stages. Some thresholds are gentle. Some are initiations that fundamentally change the field.",
    example:
      "Crisis → Growth — the forge threshold, where difficulty becomes renewal",
  },
  {
    term: "Symbolic Season",
    definition:
      "A period of time dominated by a particular atmospheric quality. Seasons are longer than moods — they span weeks, not hours.",
    example:
      '"A Season of Dissolution" — 4+ weeks of predominantly Crisis energy',
  },
  {
    term: "Permanence",
    definition:
      "When a symbol has accumulated enough gravity to become anchored — it never fully decays. A permanent resident of your symbolic identity.",
    example:
      "Storm anchored at peak weight 12.6 — it's part of who you are now",
  },
  {
    term: "Archetypal Signature",
    definition:
      "The symbols that define your symbolic identity — the ones that appear consistently enough to be considered foundational, not circumstantial.",
    example: "Storm (established), Flame (emerging), Mirror (foundational)",
  },
  {
    term: "Mythology",
    definition:
      "The long-arc narrative of your symbolic life — told through observed chapters, transitions, and recurring patterns. Not fiction. Reflective synthesis.",
    example:
      '"The Long Threshold" — an 8-week chapter dominated by Crisis energy',
  },
  {
    term: "Continuity",
    definition:
      "The thread that connects chapters. What persists across eras. Bridge symbols that carry through transitions. The story your symbolic life is telling.",
    example:
      'Lantern carried through from "The Crucible" into "The Cultivation"',
  },
];

// ─── 6. WHAT SYMBOLPATH IS NOT ───

export const IS_NOT = [
  {
    claim: "Therapy",
    clarification:
      "SymbolPath does not diagnose, treat, or prescribe. It is a reflective tool, not a clinical instrument.",
  },
  {
    claim: "Diagnosis",
    clarification:
      "No labels are assigned. No conditions are identified. The system surfaces patterns — you decide what they mean.",
  },
  {
    claim: "Fortune telling",
    clarification:
      'Predictions are based on historical pattern precedent, not fate. "The field has done this before" is not "the field will do this again."',
  },
  {
    claim: "Personality typing",
    clarification:
      "Identity emerges slowly from accumulated data. There are no types, no categories, no fixed labels. Your symbolic identity evolves.",
  },
  {
    claim: "Spiritual dogma",
    clarification:
      "SymbolPath draws from multiple wisdom traditions but subscribes to none. It is a structural observation tool, not a belief system.",
  },
  {
    claim: "AI interpretation",
    clarification:
      "The system does not tell you what your experiences mean. It shows you what recurs, what persists, and what shifts — you derive the meaning.",
  },
];

// ─── 7. DESIGN PRINCIPLES ───

export const PRINCIPLES = [
  {
    principle: "Identity emerges slowly",
    meaning:
      "No instant labels. Symbolic identity forms through accumulated evidence over weeks, not a single quiz.",
    icon: "🌱",
  },
  {
    principle: "Silence is meaningful",
    meaning:
      "Not everything needs interpretation. Sometimes the most important signal is what the system doesn't say.",
    icon: "🤫",
  },
  {
    principle: "Crisis is not destiny",
    meaning:
      "Counterbalance always matters. The system never treats a difficult period as permanent — it always shows what typically follows.",
    icon: "⚖️",
  },
  {
    principle: "Atmosphere is layered",
    meaning:
      "Humans contain multiple states simultaneously. The system models this through overlapping symbols, not single labels.",
    icon: "🌈",
  },
  {
    principle: "Meaning emerges over time",
    meaning:
      "Continuity matters more than intensity. A symbol that appears once is noise. A symbol that appears 12 times across 3 months is signal.",
    icon: "⏳",
  },
  {
    principle: "The system observes, never prescribes",
    meaning:
      "Reflection prompts are questions, not instructions. The user is always the authority on their own experience.",
    icon: "🪞",
  },
  {
    principle: "Multiple traditions, no dogma",
    meaning:
      "Five wisdom frameworks offer different lenses on the same data. None is privileged. The user chooses what resonates.",
    icon: "🌍",
  },
];

// ─── 8. WHY IT MATTERS ───

export const WHY_IT_MATTERS = {
  headline:
    "Most systems track behavior. Almost none help people reflect on transformation itself.",
  points: [
    {
      title: "Behavior tracking asks: what did you do?",
      detail:
        "Habit trackers, mood apps, and journaling tools record events. But they rarely connect them.",
    },
    {
      title: "SymbolPath asks: what is changing in you?",
      detail:
        "By unifying every reflective input into one symbolic stream, the system surfaces the deeper arc — not what happened, but how you are transforming.",
    },
    {
      title: "Transformation has structure",
      detail:
        "The five stages — Awakening, Growth, Crisis, Integration, Mastery — aren't linear. People cycle through them. SymbolPath tracks the cycle, not just the position.",
    },
    {
      title: "Patterns need time to reveal themselves",
      detail:
        "A single difficult day is noise. Three months of oscillating between Crisis and Growth is a wound worth attending to. This kind of pattern is invisible without a unified stream.",
    },
    {
      title: "Reflection deserves the same rigor as productivity",
      detail:
        "We have sophisticated tools for tracking work, habits, and health. Inner life — dreams, moods, rituals, symbols — deserves the same structural attention.",
    },
  ],
  closing:
    "SymbolPath exists because the inner life is as structured as the outer one — it just needs a system that can see it.",
};

// ─── TRANSFORMATION STAGES (for visual reference) ───

export const STAGES = [
  {
    name: "Awakening",
    emoji: "🌅",
    color: "#60A5FA",
    description: "Something new is stirring",
  },
  {
    name: "Growth",
    emoji: "🌱",
    color: "#34D399",
    description: "Expansion and building",
  },
  {
    name: "Crisis",
    emoji: "⛈️",
    color: "#F87171",
    description: "Tension, pressure, breaking open",
  },
  {
    name: "Integration",
    emoji: "🔮",
    color: "#A78BFA",
    description: "Absorbing and finding meaning",
  },
  {
    name: "Mastery",
    emoji: "👑",
    color: "#FBBF24",
    description: "Embodied wisdom, completion",
  },
];
