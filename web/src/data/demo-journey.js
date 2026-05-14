/**
 * Demo Journey Data
 * A realistic 12-week symbolic life for the demo user.
 *
 * Narrative arc:
 * Weeks 1-3: Growth period (River, Tree, Flame) — building, expanding
 * Weeks 4-6: Crisis erupts (Storm, Tower, Mirror) — breakdown, confrontation
 * Weeks 7-9: Integration begins (Loom, Scale, Lantern) — weaving meaning
 * Weeks 10-12: Mastery glimpses + new Awakening (Phoenix, Star, Seed) — renewal
 *
 * Multiple input sources throughout: tarot, dreams, moods, life events, rituals
 */

export const DEMO_USER_ID = "demo-user";

// Helper: generate date N days ago from today
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ─── SYMBOL EVENTS (the core stream) ───

export const DEMO_SYMBOL_EVENTS = [
  // Week 1-2: Growth
  {
    daysBack: 84,
    sourceType: "daily_draw",
    symbol: "River",
    stage: "Growth",
    symbolId: 6,
    note: "Morning draw — feeling flow",
  },
  {
    daysBack: 82,
    sourceType: "tarot_reading",
    symbol: "Tree",
    stage: "Growth",
    symbolId: 5,
    note: "Three-card spread: stability",
  },
  {
    daysBack: 80,
    sourceType: "mood_log",
    symbol: "Flame",
    stage: "Growth",
    symbolId: 7,
    note: "Passionate about new project",
  },
  {
    daysBack: 78,
    sourceType: "dream",
    symbol: "River",
    stage: "Growth",
    symbolId: 6,
    note: "Dream of flowing water, calm direction",
  },
  {
    daysBack: 76,
    sourceType: "daily_draw",
    symbol: "Bridge",
    stage: "Growth",
    symbolId: 8,
    note: "Crossing into something new",
  },
  {
    daysBack: 74,
    sourceType: "life_event",
    symbol: "Mountain",
    stage: "Growth",
    symbolId: 9,
    note: "Started long-term goal",
  },
  {
    daysBack: 72,
    sourceType: "ritual",
    symbol: "Tree",
    stage: "Growth",
    symbolId: 5,
    note: "Grounding ritual at sunset",
  },
  {
    daysBack: 70,
    sourceType: "tarot_reading",
    symbol: "River",
    stage: "Growth",
    symbolId: 6,
    note: "Flow continues in reading",
  },
  {
    daysBack: 68,
    sourceType: "daily_draw",
    symbol: "Flame",
    stage: "Growth",
    symbolId: 7,
    note: "Energy building",
  },

  // Week 3: Transition signals
  {
    daysBack: 66,
    sourceType: "mood_log",
    symbol: "Bridge",
    stage: "Growth",
    symbolId: 8,
    note: "Feeling at a crossroads",
  },
  {
    daysBack: 64,
    sourceType: "dream",
    symbol: "Labyrinth",
    stage: "Crisis",
    symbolId: 12,
    note: "Dream of maze, no exit",
  },
  {
    daysBack: 62,
    sourceType: "daily_draw",
    symbol: "Flame",
    stage: "Growth",
    symbolId: 7,
    note: "Still burning bright",
  },
  {
    daysBack: 60,
    sourceType: "life_event",
    symbol: "Mirror",
    stage: "Crisis",
    symbolId: 14,
    note: "Difficult feedback at work",
  },

  // Week 4-5: Crisis erupts
  {
    daysBack: 56,
    sourceType: "daily_draw",
    symbol: "Storm",
    stage: "Crisis",
    symbolId: 10,
    note: "Everything feels unstable",
  },
  {
    daysBack: 54,
    sourceType: "mood_log",
    symbol: "Storm",
    stage: "Crisis",
    symbolId: 10,
    note: "Overwhelmed, no ground",
  },
  {
    daysBack: 52,
    sourceType: "tarot_reading",
    symbol: "Tower",
    stage: "Crisis",
    symbolId: 11,
    note: "Tower in past position — collapse",
  },
  {
    daysBack: 50,
    sourceType: "dream",
    symbol: "Abyss",
    stage: "Crisis",
    symbolId: 15,
    note: "Falling dream, no bottom",
  },
  {
    daysBack: 48,
    sourceType: "life_event",
    symbol: "Storm",
    stage: "Crisis",
    symbolId: 10,
    note: "Argument with close friend",
  },
  {
    daysBack: 46,
    sourceType: "daily_draw",
    symbol: "Mirror",
    stage: "Crisis",
    symbolId: 14,
    note: "Confronting patterns",
  },
  {
    daysBack: 44,
    sourceType: "mood_log",
    symbol: "Serpent",
    stage: "Crisis",
    symbolId: 13,
    note: "Shedding old identity",
  },
  {
    daysBack: 42,
    sourceType: "ritual",
    symbol: "Storm",
    stage: "Crisis",
    symbolId: 10,
    note: "Storm ritual — letting go",
  },
  {
    daysBack: 40,
    sourceType: "tarot_reading",
    symbol: "Mirror",
    stage: "Crisis",
    symbolId: 14,
    note: "Self-reflection spread",
  },
  {
    daysBack: 38,
    sourceType: "daily_draw",
    symbol: "Serpent",
    stage: "Crisis",
    symbolId: 13,
    note: "Transformation through release",
  },

  // Week 6-7: Crisis to Integration
  {
    daysBack: 36,
    sourceType: "dream",
    symbol: "Lantern",
    stage: "Integration",
    symbolId: 18,
    note: "Light in dark corridor",
  },
  {
    daysBack: 34,
    sourceType: "daily_draw",
    symbol: "Storm",
    stage: "Crisis",
    symbolId: 10,
    note: "Storm still present but softening",
  },
  {
    daysBack: 32,
    sourceType: "mood_log",
    symbol: "Scale",
    stage: "Integration",
    symbolId: 17,
    note: "Finding balance again",
  },
  {
    daysBack: 30,
    sourceType: "life_event",
    symbol: "Loom",
    stage: "Integration",
    symbolId: 16,
    note: "Making sense of the breakdown",
  },
  {
    daysBack: 28,
    sourceType: "daily_draw",
    symbol: "Lantern",
    stage: "Integration",
    symbolId: 18,
    note: "Clarity emerging",
  },
  {
    daysBack: 26,
    sourceType: "tarot_reading",
    symbol: "Compass",
    stage: "Integration",
    symbolId: 19,
    note: "Direction found in reading",
  },
  {
    daysBack: 24,
    sourceType: "ritual",
    symbol: "Loom",
    stage: "Integration",
    symbolId: 16,
    note: "Weaving ritual — connecting threads",
  },
  {
    daysBack: 22,
    sourceType: "daily_draw",
    symbol: "Scale",
    stage: "Integration",
    symbolId: 17,
    note: "Equilibrium",
  },
  {
    daysBack: 20,
    sourceType: "dream",
    symbol: "Compass",
    stage: "Integration",
    symbolId: 19,
    note: "Dream of finding north",
  },
  {
    daysBack: 18,
    sourceType: "mood_log",
    symbol: "Lantern",
    stage: "Integration",
    symbolId: 18,
    note: "Quiet understanding",
  },

  // Week 9-10: Integration to glimpses of Mastery
  {
    daysBack: 16,
    sourceType: "daily_draw",
    symbol: "Loom",
    stage: "Integration",
    symbolId: 16,
    note: "Still weaving",
  },
  {
    daysBack: 14,
    sourceType: "life_event",
    symbol: "Phoenix",
    stage: "Mastery",
    symbolId: 21,
    note: "Reconciled with friend, deeper bond",
  },
  {
    daysBack: 12,
    sourceType: "tarot_reading",
    symbol: "Star",
    stage: "Mastery",
    symbolId: 22,
    note: "Star in outcome — transcendence",
  },
  {
    daysBack: 10,
    sourceType: "daily_draw",
    symbol: "Phoenix",
    stage: "Mastery",
    symbolId: 21,
    note: "Rising from the ashes",
  },
  {
    daysBack: 8,
    sourceType: "dream",
    symbol: "Crown",
    stage: "Mastery",
    symbolId: 20,
    note: "Dream of authority, self-sovereign",
  },
  {
    daysBack: 6,
    sourceType: "mood_log",
    symbol: "Star",
    stage: "Mastery",
    symbolId: 22,
    note: "Clear, open, light",
  },

  // Week 11-12: New Awakening begins
  {
    daysBack: 4,
    sourceType: "ritual",
    symbol: "Seed",
    stage: "Awakening",
    symbolId: 1,
    note: "Planting intentions for new chapter",
  },
  {
    daysBack: 3,
    sourceType: "daily_draw",
    symbol: "Dawn",
    stage: "Awakening",
    symbolId: 2,
    note: "Something new emerging",
  },
  {
    daysBack: 2,
    sourceType: "life_event",
    symbol: "Key",
    stage: "Awakening",
    symbolId: 3,
    note: "New opportunity appeared",
  },
  {
    daysBack: 1,
    sourceType: "daily_draw",
    symbol: "Seed",
    stage: "Awakening",
    symbolId: 1,
    note: "Potential",
  },
];

export default { DEMO_USER_ID, DEMO_SYMBOL_EVENTS };
