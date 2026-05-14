export const EMOTIONS = [
  {
    name: "Resentment",
    root: "Latin resentire — to feel again",
    category: "shadow",
  },
  {
    name: "Hope",
    root: "Old English hopa — confidence in future",
    category: "light",
  },
  { name: "Fear", root: "Old English fær — danger", category: "shadow" },
  { name: "Courage", root: "Latin cor — heart", category: "light" },
  { name: "Curiosity", root: "Latin cura — care", category: "light" },
  { name: "Gratitude", root: "Latin gratus — thankful", category: "light" },
  { name: "Anger", root: "Old Norse angr — grief, sorrow", category: "shadow" },
  { name: "Joy", root: "Old French joie — delight", category: "light" },
  {
    name: "Shame",
    root: "Old English scamu — feeling of disgrace",
    category: "shadow",
  },
  {
    name: "Compassion",
    root: "Latin compati — to suffer with",
    category: "light",
  },
  {
    name: "Envy",
    root: "Latin invidere — to look upon with ill will",
    category: "shadow",
  },
  { name: "Serenity", root: "Latin serenus — clear, calm", category: "light" },
  {
    name: "Anxiety",
    root: "Latin anxius — troubled in mind",
    category: "shadow",
  },
  {
    name: "Wonder",
    root: "Old English wundor — marvelous thing",
    category: "light",
  },
  {
    name: "Guilt",
    root: "Old English gylt — crime, fault",
    category: "shadow",
  },
  {
    name: "Awe",
    root: "Old Norse agi — terror, dread turned reverence",
    category: "light",
  },
  {
    name: "Loneliness",
    root: "Old English ana — alone, solitary",
    category: "shadow",
  },
  {
    name: "Belonging",
    root: "Old English belongian — to go along with",
    category: "light",
  },
  { name: "Frustration", root: "Latin frustra — in vain", category: "shadow" },
  {
    name: "Trust",
    root: "Old Norse traust — confidence, protection",
    category: "light",
  },
  {
    name: "Despair",
    root: "Latin desperare — to be without hope",
    category: "shadow",
  },
  {
    name: "Acceptance",
    root: "Latin accipere — to take to oneself",
    category: "light",
  },
  { name: "Contempt", root: "Latin contemnere — to scorn", category: "shadow" },
  {
    name: "Reverence",
    root: "Latin revereri — to stand in awe of",
    category: "light",
  },
  {
    name: "Boredom",
    root: "English bore — to weary by dullness",
    category: "shadow",
  },
  {
    name: "Passion",
    root: "Latin pati — to suffer, to endure",
    category: "light",
  },
  {
    name: "Jealousy",
    root: "Old French jalousie — zeal, fervor",
    category: "shadow",
  },
  {
    name: "Empathy",
    root: "Greek empatheia — physical affection",
    category: "light",
  },
];

export const DEFENSE_MECHANISMS = [
  { id: "none", name: "None", description: "No defense mechanism detected" },
  {
    id: "rationalization",
    name: "Rationalization",
    description:
      "Creating logical justifications for emotionally-driven decisions",
  },
  {
    id: "projection",
    name: "Projection",
    description: "Attributing your own feelings or motives to others",
  },
  {
    id: "displacement",
    name: "Displacement",
    description: "Redirecting emotions from the real source to a safer target",
  },
  {
    id: "reaction-formation",
    name: "Reaction Formation",
    description: "Acting the opposite of what you truly feel",
  },
  {
    id: "minimization",
    name: "Minimization",
    description: "Downplaying the significance of events or feelings",
  },
  {
    id: "blame-shifting",
    name: "Blame Shifting",
    description: "Attributing responsibility to others to avoid accountability",
  },
  {
    id: "confirmation-bias",
    name: "Confirmation Bias",
    description: "Only seeing information that supports your existing beliefs",
  },
  {
    id: "compensation",
    name: "Compensation",
    description: "Overachieving in one area to offset deficiencies in another",
  },
  {
    id: "regression",
    name: "Regression",
    description: "Reverting to earlier, less mature patterns of behavior",
  },
  {
    id: "repression",
    name: "Repression",
    description: "Unconsciously blocking uncomfortable thoughts from awareness",
  },
  {
    id: "sublimation",
    name: "Sublimation",
    description:
      "Channeling unacceptable impulses into socially acceptable activities",
  },
  {
    id: "intellectualization",
    name: "Intellectualization",
    description: "Using abstract thinking to distance from emotional pain",
  },
  {
    id: "avoidance",
    name: "Avoidance",
    description: "Steering clear of situations that trigger discomfort",
  },
];

export function getDailyEmotion() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000,
  );
  return EMOTIONS[dayOfYear % EMOTIONS.length];
}
