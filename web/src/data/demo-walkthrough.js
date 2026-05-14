/**
 * Demo Journey Walkthrough Data
 * The narrative steps that guide someone through SymbolPath's demo experience.
 */

export const DEMO_CHAPTERS = [
  {
    id: "growth",
    title: "The Foundation",
    subtitle: "Weeks 1–3: Growth",
    atmosphere: "generative",
    stage: "Growth",
    color: "#34D399",
    emoji: "🌱",
    narrative:
      "You begin in a period of expansion. River, Tree, Flame — symbols of flow, rootedness, and passion appear consistently across tarot readings, daily draws, and dream journal entries. The Pattern Engine notices this clustering. The atmosphere is generative.",
    keySymbols: ["River", "Tree", "Flame", "Bridge"],
    events: [
      {
        source: "Daily Draw",
        symbol: "🏞️ River",
        note: "Morning draw — feeling flow",
      },
      {
        source: "Tarot Reading",
        symbol: "🌳 Tree",
        note: "Three-card spread: stability",
      },
      {
        source: "Mood Log",
        symbol: "🔥 Flame",
        note: "Passionate about new project",
      },
      {
        source: "Dream",
        symbol: "🏞️ River",
        note: "Flowing water, calm direction",
      },
      {
        source: "Life Event",
        symbol: "⛰️ Mountain",
        note: "Started long-term goal",
      },
    ],
    insight:
      "After 9 events across 4 different sources, the system identifies your dominant stage as Growth. River achieves 'recurring' confidence. The Symbol Stream is building.",
  },
  {
    id: "crisis",
    title: "The Storm",
    subtitle: "Weeks 4–6: Crisis",
    atmosphere: "turbulent",
    stage: "Crisis",
    color: "#F87171",
    emoji: "⛈️",
    narrative:
      "Disruption arrives. A difficult conversation, unexpected feedback, and a conflict with a close friend. Storm, Tower, Mirror dominate. The gravity shifts heavily — Crisis energy accumulates. The system doesn't diagnose or alarm. It observes: the field has become turbulent.",
    keySymbols: ["Storm", "Tower", "Mirror", "Serpent", "Abyss"],
    events: [
      {
        source: "Daily Draw",
        symbol: "⛈️ Storm",
        note: "Everything feels unstable",
      },
      {
        source: "Life Event",
        symbol: "⛈️ Storm",
        note: "Argument with close friend",
      },
      {
        source: "Tarot Reading",
        symbol: "🏚️ Tower",
        note: "Tower in past position — collapse",
      },
      { source: "Dream", symbol: "🕳️ Abyss", note: "Falling dream, no bottom" },
      {
        source: "Ritual",
        symbol: "⛈️ Storm",
        note: "Storm ritual — letting go",
      },
    ],
    insight:
      "Storm becomes anchored (weight 5.2). The Sequence Engine detects 'Hero's Departure' arc (Growth → Crisis). Counterbalance symbols (Lantern, Scale) begin surfacing in prompts.",
  },
  {
    id: "integration",
    title: "The Weaving",
    subtitle: "Weeks 7–9: Integration",
    atmosphere: "converging",
    stage: "Integration",
    color: "#A78BFA",
    emoji: "🔮",
    narrative:
      "Clarity returns — not by force, but by patience. Lantern, Loom, Scale, Compass. The Integration symbols carry a different weight: quieter, more structural. The atmosphere shifts from turbulent to converging. The system tracks this transition as 'The Crucible' — the named arc for Growth → Crisis → Integration.",
    keySymbols: ["Lantern", "Loom", "Scale", "Compass"],
    events: [
      { source: "Dream", symbol: "🏮 Lantern", note: "Light in dark corridor" },
      {
        source: "Life Event",
        symbol: "🧵 Loom",
        note: "Making sense of the breakdown",
      },
      { source: "Daily Draw", symbol: "⚖️ Scale", note: "Equilibrium" },
      {
        source: "Tarot",
        symbol: "🧭 Compass",
        note: "Direction found in reading",
      },
      { source: "Mood Log", symbol: "🏮 Lantern", note: "Quiet understanding" },
    ],
    insight:
      "The system detects your first constellation: Storm + Lantern + Mirror form 'The Reckoning' — symbols that co-occur across multiple weeks. Your identity begins taking shape.",
  },
  {
    id: "mastery",
    title: "The Phoenix",
    subtitle: "Weeks 10–12: Mastery + New Awakening",
    atmosphere: "luminous",
    stage: "Mastery",
    color: "#FBBF24",
    emoji: "👑",
    narrative:
      "Phoenix, Star, Crown. These don't arrive because the crisis is 'over' — they arrive because you moved through it. The reconciliation with your friend, the new opportunity, the dream of self-sovereignty. The Mythology Engine names this chapter 'The Forge' — the full arc from Growth through Crisis to Mastery. Then something new stirs: Seed, Dawn, Key. A new cycle begins.",
    keySymbols: ["Phoenix", "Star", "Crown", "Seed", "Dawn"],
    events: [
      {
        source: "Life Event",
        symbol: "🔥 Phoenix",
        note: "Reconciled with friend, deeper bond",
      },
      {
        source: "Tarot",
        symbol: "⭐ Star",
        note: "Star in outcome — transcendence",
      },
      { source: "Dream", symbol: "👑 Crown", note: "It was mine all along" },
      {
        source: "Ritual",
        symbol: "🌱 Seed",
        note: "Planting intentions for new chapter",
      },
      {
        source: "Daily Draw",
        symbol: "🌅 Dawn",
        note: "Something new emerging",
      },
    ],
    insight:
      "The full mythology emerges: The Forge chapter (Crisis→Integration→Mastery), a recurring wound (Storm anchoring), and a new Awakening initiation. Your symbolic identity has maturity level 'forming'. The cycle continues.",
  },
];

export const DEMO_IDENTITY_PREVIEW = {
  signatures: [
    {
      symbol: "Storm",
      stage: "Crisis",
      confidence: "established",
      visual: "⛈️",
    },
    { symbol: "River", stage: "Growth", confidence: "recurring", visual: "🏞️" },
    {
      symbol: "Lantern",
      stage: "Integration",
      confidence: "recurring",
      visual: "🏮",
    },
    {
      symbol: "Phoenix",
      stage: "Mastery",
      confidence: "emerging",
      visual: "🔥",
    },
  ],
  constellations: [
    {
      name: "The Reckoning",
      members: ["Storm", "Mirror", "Lantern"],
      atmosphere: "turbulent-to-converging",
    },
    {
      name: "The Foundation",
      members: ["River", "Tree", "Flame"],
      atmosphere: "generative",
    },
  ],
  wounds: [
    {
      type: "oscillation",
      pattern: "Growth⟲Crisis",
      title: "The Recurring Storm",
    },
  ],
  mythology: {
    chapters: [
      "The Foundation (Growth)",
      "The Storm (Crisis)",
      "The Weaving (Integration)",
      "The Phoenix (Mastery)",
    ],
    currentChapter: "New Awakening",
  },
};
