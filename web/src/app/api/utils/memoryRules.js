/**
 * SYMBOLPATH — MEMORY ARCHITECTURE RULES
 *
 * This file is the single source of truth for all memory behavior in SymbolPath.
 * Every system that reads, writes, or decays memory data should import from here.
 *
 * The three memory questions this file answers:
 *   1. SIGNAL STRENGTH  — how much does each event type contribute to gravity?
 *   2. DECAY            — how long does each symbol type hold weight over time?
 *   3. PERMANENCE       — when does gravity become a lasting part of identity?
 *
 * And the two pattern questions:
 *   4. STAGE SHIFTS     — when is a stage change real, not just noise?
 *   5. ARC WEIGHTING    — what makes one arc stronger than another?
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIGNAL STRENGTH — Source Type Gravity Weights
//
// Not all events are equal signal.
//   • Life events: the highest signal. Real life is more significant than a card pull.
//   • Dreams: high unconscious signal — what surfaces without volition is meaningful.
//   • Tarot, I-Ching, Oracle: intentional consultation — the user is actively seeking.
//   • Decisions: emotionally weighted and intentional.
//   • Mood logs: useful but high-frequency and noisy.
//   • Moon/astrology: external triggers — informative but not personally generated.
//
// The weight here is the BASE CONTRIBUTION added to a symbol's gravity score
// each time that source type emits an event for that symbol.
//
// Think of these as: "how much evidence is this source type?"
// ─────────────────────────────────────────────────────────────────────────────
export const SOURCE_WEIGHTS = {
  life_event: 2.0, // Real-world events carry maximum weight
  dream: 1.8, // Unconscious surfacing — high psychological signal
  "i-ching": 1.5, // Intentional divination consultation
  decision: 1.4, // Emotionally weighted + deliberate act
  tarot_reading: 1.3, // Intentional ritual, symbolically precise
  oracle: 1.2, // Intentional oracle consultation
  intent: 1.2, // Deliberate intention-setting
  relationship: 1.2, // Interpersonal pattern — persistent context
  manual: 1.0, // User-defined baseline
  mood_log: 0.9, // Frequent but higher noise ratio
  moon_phase: 0.7, // External trigger — not personally generated
  astro_transit: 0.6, // External, weakest personal signal
  transit: 0.6, // Same as astro_transit (alternate naming)
};

// Fallback weight for unknown source types
export const DEFAULT_SOURCE_WEIGHT = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DECAY — Stage-Based Half-Lives
//
// How long does a symbol stay meaningfully active in memory after the last event?
//
// Half-life: the time it takes for a symbol's gravity to drop by 50%.
// The formula: weight(t) = weight(0) * e^(-ln2/halfLife * days)
//
// Design intent:
//   • Crisis symbols last longest — crises linger in memory and matter retrospectively.
//   • Mastery symbols persist — they represent earned achievements.
//   • Awakening symbols fade fastest — if a beginning isn't reinforced, it wasn't real.
//   • Growth and Integration: moderate persistence — momentum and processing both need time.
//
// When a user hasn't engaged with a symbol in a long time, its weight slowly
// approaches (but never reaches, for anchored symbols) zero.
// ─────────────────────────────────────────────────────────────────────────────
export const STAGE_HALF_LIFE_DAYS = {
  Awakening: 14, // Potential fades if not activated — 2 weeks
  Growth: 21, // Momentum holds for 3 weeks, then needs reinforcement
  Crisis: 35, // Crises are memorable and contextually long-lived — 5 weeks
  Integration: 21, // Processing takes time but doesn't need to linger forever
  Mastery: 49, // Achievements should remain meaningful for 7 weeks
};

// Fallback half-life for unknown stages
export const DEFAULT_HALF_LIFE_DAYS = 21;

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECENCY MULTIPLIERS
//
// Events that happened very recently get a boost. This captures the psychological
// reality that a dream you had this morning means more than one from a week ago,
// even before decay has had time to work.
//
// The multiplier is applied to the source_weight at write time.
// ─────────────────────────────────────────────────────────────────────────────
export const RECENCY_MULTIPLIERS = [
  { maxDays: 0, multiplier: 1.5 }, // Same day — maximum freshness
  { maxDays: 1, multiplier: 1.4 }, // Yesterday
  { maxDays: 3, multiplier: 1.2 }, // Last 3 days
  { maxDays: 7, multiplier: 1.1 }, // Last week
  { maxDays: Infinity, multiplier: 1.0 }, // Beyond — no recency bonus
];

// ─────────────────────────────────────────────────────────────────────────────
// 3b. EMOTIONAL INTENSITY — Does emotion strength affect weight?
//
// YES. A mood log of "panicked" should weigh more than "slightly uneasy."
// A life event logged at intensity 9/10 should weigh more than one at 3/10.
//
// Two mechanisms:
//   A) KEYWORD INTENSITY: Certain emotional words indicate higher intensity.
//      These are matched against mood text, emotion fields, and note text.
//      The multiplier scales the source_weight contribution.
//
//   B) NUMERIC INTENSITY: For sources that provide a numeric intensity
//      (like life_events.intensity, 1–10), we map it directly to a multiplier.
//
// The intensity multiplier is applied AT WRITE TIME alongside the source weight.
// Contribution = sourceWeight × recencyMultiplier × intensityMultiplier
// ─────────────────────────────────────────────────────────────────────────────
export const EMOTIONAL_INTENSITY = {
  // Keyword tiers — matched as substrings against mood/emotion text
  // Higher tier = the emotion is expressed with greater force
  EXTREME_KEYWORDS: [
    "terrified",
    "devastated",
    "shattered",
    "suicidal",
    "ecstatic",
    "panicked",
    "overwhelmed",
    "enraged",
    "blissful",
    "euphoric",
    "despair",
    "hopeless",
    "furious",
    "frantic",
    "consumed",
  ],
  HIGH_KEYWORDS: [
    "scared",
    "broken",
    "depressed",
    "grief",
    "passionate",
    "trapped",
    "helpless",
    "numb",
    "lonely",
    "inspired",
    "determined",
    "courageous",
    "empowered",
    "ashamed",
    "obsessed",
  ],
  LOW_KEYWORDS: [
    "slightly",
    "a bit",
    "somewhat",
    "mildly",
    "kind of",
    "sort of",
    "a little",
    "okay",
    "fine",
    "meh",
    "neutral",
  ],

  // Multipliers per tier
  EXTREME_MULTIPLIER: 1.6, // "terrified" — maximum emotional signal
  HIGH_MULTIPLIER: 1.3, // "scared", "broken" — strong signal
  NORMAL_MULTIPLIER: 1.0, // "anxious", "hopeful" — standard
  LOW_MULTIPLIER: 0.7, // "a bit worried", "meh" — dampened signal

  // Numeric intensity mapping (for life_events 1–10 scale)
  // Maps numeric range to multiplier
  NUMERIC_RANGES: [
    { min: 9, max: 10, multiplier: 1.6 }, // Life-altering
    { min: 7, max: 8, multiplier: 1.3 }, // Significant
    { min: 4, max: 6, multiplier: 1.0 }, // Moderate
    { min: 1, max: 3, multiplier: 0.7 }, // Minor
  ],
};

/**
 * Compute emotional intensity multiplier from free text.
 * Checks extreme keywords first, then high, then low.
 * Unmatched text returns NORMAL_MULTIPLIER (1.0).
 */
export function computeEmotionalIntensity(text) {
  if (!text) return EMOTIONAL_INTENSITY.NORMAL_MULTIPLIER;
  const lower = text.toLowerCase();

  for (const kw of EMOTIONAL_INTENSITY.EXTREME_KEYWORDS) {
    if (lower.includes(kw)) return EMOTIONAL_INTENSITY.EXTREME_MULTIPLIER;
  }
  for (const kw of EMOTIONAL_INTENSITY.HIGH_KEYWORDS) {
    if (lower.includes(kw)) return EMOTIONAL_INTENSITY.HIGH_MULTIPLIER;
  }
  for (const kw of EMOTIONAL_INTENSITY.LOW_KEYWORDS) {
    if (lower.includes(kw)) return EMOTIONAL_INTENSITY.LOW_MULTIPLIER;
  }

  return EMOTIONAL_INTENSITY.NORMAL_MULTIPLIER;
}

/**
 * Compute intensity multiplier from a numeric value (1–10 scale).
 */
export function computeNumericIntensity(value) {
  if (value == null || isNaN(value))
    return EMOTIONAL_INTENSITY.NORMAL_MULTIPLIER;
  const n = Number(value);
  for (const range of EMOTIONAL_INTENSITY.NUMERIC_RANGES) {
    if (n >= range.min && n <= range.max) return range.multiplier;
  }
  return EMOTIONAL_INTENSITY.NORMAL_MULTIPLIER;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3c. GRAVITY CEILING & DIMINISHING RETURNS
//
// Q: "Do repeated symbols compound exponentially?"
// A: No. Gravity grows with diminishing returns and has a hard ceiling.
//
// Without limits, a user who does 20 tarot readings a day would have
// runaway gravity on frequently-drawn cards. The system must reward
// consistency without becoming dominated by volume.
//
// GRAVITY_CEILING: The absolute maximum gravity a symbol can ever reach.
//   Above this, new events still register (they update last_seen, count,
//   source_types) but do not increase weight further.
//
// DIMINISHING_RETURNS: After the weight exceeds a threshold, each new
//   contribution is dampened. This models the psychological reality that
//   the 15th appearance of Storm in a week is less surprising than the 3rd.
//
// Formula: if weight > DIMINISHING_THRESHOLD:
//   effective_contribution = contribution × (DIMINISHING_THRESHOLD / weight) ^ DAMPENING_POWER
//
// This means:
//   - Below threshold: full contribution
//   - At 2× threshold: contribution is dampened to ~71% (power=0.5)
//   - At 4× threshold: contribution is dampened to ~50%
//   - At ceiling: contribution is 0
// ─────────────────────────────────────────────────────────────────────────────
export const GRAVITY_LIMITS = {
  CEILING: 30.0, // Absolute max weight — no symbol exceeds this
  DIMINISHING_THRESHOLD: 8.0, // Contributions start shrinking above this
  DAMPENING_POWER: 0.5, // How aggressively contributions shrink (0.5 = sqrt curve)
};

/**
 * Apply diminishing returns to a gravity contribution based on current weight.
 * Returns the effective contribution (may be reduced or zero).
 */
export function applyDiminishingReturns(contribution, currentWeight) {
  if (currentWeight >= GRAVITY_LIMITS.CEILING) return 0;
  if (currentWeight <= GRAVITY_LIMITS.DIMINISHING_THRESHOLD)
    return contribution;

  const ratio = GRAVITY_LIMITS.DIMINISHING_THRESHOLD / currentWeight;
  const dampened =
    contribution * Math.pow(ratio, GRAVITY_LIMITS.DAMPENING_POWER);

  // Never push past ceiling
  const headroom = GRAVITY_LIMITS.CEILING - currentWeight;
  return Math.min(dampened, headroom);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3d. REGRESSION RULES — Can Users Regress?
//
// YES. Regression is intentional and psychologically real.
//
// A user who was in Mastery can slip back to Crisis after a life event.
// This is not failure — it's the spiral nature of growth. The system
// should detect, name, and contextualize regression rather than suppress it.
//
// Detection:
//   A regression is when gravity-weighted dominant stage moves DOWN
//   the stage ladder (Mastery → Crisis, Integration → Growth, etc.)
//
// Rules:
//   - Regression is only flagged when the shift has MEDIUM+ confidence
//   - Regression is contextualized: "Returning to Crisis isn't starting over —
//     it's meeting a familiar place with new wisdom."
//   - Regression after Mastery is especially significant and named separately
// ─────────────────────────────────────────────────────────────────────────────
export const STAGE_ORDER = [
  "Awakening",
  "Growth",
  "Crisis",
  "Integration",
  "Mastery",
];
export const STAGE_RANK = {
  Awakening: 0,
  Growth: 1,
  Crisis: 2,
  Integration: 3,
  Mastery: 4,
};

export const REGRESSION = {
  // A regression is any movement where new_rank < old_rank
  ENABLED: true,

  // Minimum confidence required to flag a regression (don't alert on noise)
  MIN_CONFIDENCE: "medium",

  // Named regression narratives (fromStage → toStage → narrative)
  NARRATIVES: {
    "Mastery → Crisis": {
      name: "The Descent",
      narrative:
        "Mastery doesn't make you immune to storms. Returning to crisis after mastery means meeting an old place with hard-won eyes. You've been here before — but never as this version of yourself.",
    },
    "Mastery → Growth": {
      name: "The Humbling",
      narrative:
        "After arriving at mastery, something calls you back to the work of building. This isn't loss — it's choosing to grow in a new direction.",
    },
    "Integration → Crisis": {
      name: "The Unraveling",
      narrative:
        "What was being woven together met a force that pulled threads loose. The meaning you were building isn't lost — it's being tested.",
    },
    "Integration → Awakening": {
      name: "The Reset",
      narrative:
        "Understanding dissolved into something raw and new. Sometimes the deepest integration opens a door to a completely fresh beginning.",
    },
    "Growth → Awakening": {
      name: "The Return to Zero",
      narrative:
        "What was growing found its limits and released. Now you stand at a new threshold, lighter than before.",
    },
  },
};

/**
 * Detect if a stage transition is a regression and return context.
 */
export function detectRegression(fromStage, toStage) {
  const fromRank = STAGE_RANK[fromStage];
  const toRank = STAGE_RANK[toStage];

  if (fromRank == null || toRank == null) return null;
  if (toRank >= fromRank) return null; // Not a regression

  const key = `${fromStage} → ${toStage}`;
  const named = REGRESSION.NARRATIVES[key] || {
    name: "Spiraling Back",
    narrative: `Movement from ${fromStage.toLowerCase()} back to ${toStage.toLowerCase()}. Growth is rarely linear — the spiral path revisits familiar ground at a deeper level.`,
  };

  return {
    isRegression: true,
    from: fromStage,
    to: toStage,
    fromRank,
    toRank,
    depth: fromRank - toRank, // How many stages "back"
    ...named,
  };
}

// ── COEXISTENCE RULES ──────────────────────────────────────────────────────
// Q: "Can multiple stages coexist?"
// A: YES. Always. A user is never purely in one stage.
//
// The gravity system inherently supports coexistence because each symbol
// has its own stage, and a user has gravity across many symbols simultaneously.
// The dominant stage is just the one with the most total gravity.
//
// The COEXISTENCE_THRESHOLD defines when a non-dominant stage is significant
// enough to surface in the UI as a "secondary stage."
export const COEXISTENCE_THRESHOLD = 0.25; // A stage with 25%+ of dominant's gravity is "active"

// ─────────────────────────────────────────────────────────────────────────────
// 4. PERMANENCE — When Memory Becomes Identity
//
// Some symbols should persist even after long inactivity, because they represent
// a genuine part of the person's story. Permanence is earned, not assigned.
//
// ANCHOR_THRESHOLD:
//   When a symbol's gravity score exceeds this value, it becomes "anchored."
//   Anchored means: this symbol has been strongly active enough, long enough,
//   that it has left a permanent trace in the person's symbolic identity.
//
// ANCHOR_FLOOR:
//   The minimum gravity an anchored symbol will ever fall to, no matter how
//   long the person is inactive. It never reaches zero — it persists as
//   background signal, ready to be reactivated by a new event.
//
// CRISIS_ANCHOR_THRESHOLD:
//   Crisis symbols anchor at a lower threshold — they are psychologically
//   "stickier" because crises leave deeper impressions than positive events.
//
// MASTERY_ANCHOR_THRESHOLD:
//   Mastery symbols also anchor more easily — they represent earned achievement.
// ─────────────────────────────────────────────────────────────────────────────
export const PERMANENCE = {
  // Standard threshold — most symbols
  ANCHOR_THRESHOLD: 10.0,

  // Stage-specific overrides (lower = anchors more easily)
  CRISIS_ANCHOR_THRESHOLD: 7.0, // Crisis symbols anchor faster — they're stickier
  MASTERY_ANCHOR_THRESHOLD: 8.0, // Mastery symbols also anchor more easily
  AWAKENING_ANCHOR_THRESHOLD: 12.0, // Awakening is transient — needs stronger evidence

  // Floor: the minimum gravity an anchored symbol holds
  ANCHOR_FLOOR: 2.5,

  // High-permanence floor for symbols that were very strongly active
  HIGH_PERMANENCE_FLOOR: 4.0, // Applies when peak_weight > 20.0
  HIGH_PERMANENCE_THRESHOLD: 20.0,
};

// Compute stage-appropriate anchor threshold
export function getAnchorThreshold(stage) {
  switch (stage) {
    case "Crisis":
      return PERMANENCE.CRISIS_ANCHOR_THRESHOLD;
    case "Mastery":
      return PERMANENCE.MASTERY_ANCHOR_THRESHOLD;
    case "Awakening":
      return PERMANENCE.AWAKENING_ANCHOR_THRESHOLD;
    default:
      return PERMANENCE.ANCHOR_THRESHOLD;
  }
}

// Compute floor for an anchored symbol based on its peak
export function getAnchorFloor(peakWeight) {
  if (peakWeight >= PERMANENCE.HIGH_PERMANENCE_THRESHOLD) {
    return PERMANENCE.HIGH_PERMANENCE_FLOOR;
  }
  return PERMANENCE.ANCHOR_FLOOR;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STAGE SHIFT RULES
//
// A stage shift is when the user's dominant Transformation Stage changes
// from one 7-day window to the next.
//
// The current system detects any change as a shift. This is too sensitive —
// a single event in a new stage can trigger a "shift" that isn't real.
//
// The new rules:
//   MIN_EVENTS_PER_WINDOW: A window needs at least this many events to be
//     considered valid for shift detection. Below this, the shift is "low
//     confidence" and should not be treated as confirmed.
//
//   CONFIRMATION_DAYS: A shift is only "confirmed" if the new stage has
//     appeared in events across at least this many distinct days. A burst of
//     3 events on one day followed by nothing isn't a stage shift — it's noise.
//
//   ACCELERATION_DAYS: If a stage shift occurs and both windows have 5+
//     events each, and the shift window is compressed within this many days,
//     the shift is "accelerating" — flag it as high-intensity.
//
//   CONFIDENCE_THRESHOLDS: Map event counts to confidence levels.
// ─────────────────────────────────────────────────────────────────────────────
export const STAGE_SHIFT_RULES = {
  // Analysis windows
  WINDOW_DAYS: 7, // Size of each comparison window
  LOOKBACK_WINDOWS: 2, // How many windows to compare (2 = this week vs last week)

  // Minimum events to trust a window
  MIN_EVENTS_FOR_LOW: 1, // 1 event = shift detected but not trusted
  MIN_EVENTS_FOR_MEDIUM: 3, // 3+ events = medium confidence
  MIN_EVENTS_FOR_HIGH: 5, // 5+ events = high confidence

  // Spread: minimum distinct days a stage must appear in to be "real"
  MIN_DAYS_SPAN_FOR_CONFIRMED: 2, // Stage must appear on 2+ distinct days

  // Velocity: if a shift completes within this many days, flag as accelerating
  ACCELERATION_THRESHOLD_DAYS: 3,

  // Confidence labels
  CONFIDENCE: {
    NONE: "none", // Not enough events
    LOW: "low", // Detected but few events
    MEDIUM: "medium", // Reasonably evidenced
    HIGH: "high", // Well-evidenced
  },
};

// Compute confidence level for a stage shift based on event counts in each window
export function computeShiftConfidence(thisWeekCount, lastWeekCount) {
  const minCount = Math.min(thisWeekCount, lastWeekCount);
  if (minCount < STAGE_SHIFT_RULES.MIN_EVENTS_FOR_LOW)
    return STAGE_SHIFT_RULES.CONFIDENCE.NONE;
  if (minCount < STAGE_SHIFT_RULES.MIN_EVENTS_FOR_MEDIUM)
    return STAGE_SHIFT_RULES.CONFIDENCE.LOW;
  if (minCount < STAGE_SHIFT_RULES.MIN_EVENTS_FOR_HIGH)
    return STAGE_SHIFT_RULES.CONFIDENCE.MEDIUM;
  return STAGE_SHIFT_RULES.CONFIDENCE.HIGH;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ARC WEIGHTING RULES
//
// An arc is a recurring 3-event sequence in the Symbol Stream.
// The current system ranks arcs purely by occurrence count.
//
// Better scoring accounts for:
//   • RECENCY: An arc that was active this week is more relevant than one
//     that last appeared three months ago.
//   • SOURCE DIVERSITY: An arc that appears across multiple source types
//     (dream + life event + tarot) is stronger evidence than one only
//     seen in tarot readings.
//   • RECURRENCE MULTIPLIER: Later occurrences carry slightly more weight
//     than the first — the pattern is proving itself.
//
// SCORE FORMULA:
//   score = occurrences
//         × recurrenceMultiplier(occurrences)
//         × recencyBonus(daysSinceLastSeen)
//         × sourceDiversityBonus(distinctSourceTypes)
//
// The score is a numeric value (not a bucket) that enables proper ranking
// when two arcs have the same occurrence count but different qualities.
// ─────────────────────────────────────────────────────────────────────────────
export const ARC_RULES = {
  // Minimum occurrences to surface an arc in results
  MIN_OCCURRENCES: 2,

  // Intensity buckets (human-readable, derived from occurrence count)
  INTENSITY: {
    DOMINANT: 5, // 5+ occurrences → "dominant"
    STRONG: 3, // 3–4 occurrences → "strong"
    EMERGING: 1, // 1–2 occurrences → "emerging" (only shown if >= MIN_OCCURRENCES)
  },

  // Active window: arcs seen within this many days are "active"
  ACTIVE_WINDOW_DAYS: 7,
  RECENT_WINDOW_DAYS: 30, // Within 30 days = "recent" (warm, not cold)

  // Recency bonus (applied to score)
  RECENCY_BONUS: {
    ACTIVE: 1.35, // Seen in last 7 days
    RECENT: 1.15, // Seen in last 30 days
    COLD: 1.0, // Not seen recently
  },

  // Source diversity bonus (per distinct source type beyond the first)
  SOURCE_DIVERSITY_BONUS_PER_TYPE: 0.15,

  // Recurrence multiplier: each additional recurrence adds weight
  // Index 0 = first occurrence, 1 = second, 2+ = third and beyond
  RECURRENCE_MULTIPLIERS: [1.0, 1.2, 1.4],
};

// Compute the recency bonus for an arc given days since last seen
export function arcRecencyBonus(daysSinceLastSeen) {
  if (daysSinceLastSeen <= ARC_RULES.ACTIVE_WINDOW_DAYS)
    return ARC_RULES.RECENCY_BONUS.ACTIVE;
  if (daysSinceLastSeen <= ARC_RULES.RECENT_WINDOW_DAYS)
    return ARC_RULES.RECENCY_BONUS.RECENT;
  return ARC_RULES.RECENCY_BONUS.COLD;
}

// Compute the source diversity multiplier for an arc
export function arcSourceDiversityBonus(distinctSourceTypes) {
  const extra = Math.max(0, distinctSourceTypes - 1);
  return 1.0 + extra * ARC_RULES.SOURCE_DIVERSITY_BONUS_PER_TYPE;
}

// Compute the recurrence multiplier for an arc
export function arcRecurrenceMultiplier(occurrences) {
  const idx = Math.min(
    occurrences - 1,
    ARC_RULES.RECURRENCE_MULTIPLIERS.length - 1,
  );
  return ARC_RULES.RECURRENCE_MULTIPLIERS[Math.max(0, idx)];
}

// Compute the full numeric arc score
export function computeArcScore({
  occurrences,
  daysSinceLastSeen,
  distinctSourceTypes,
}) {
  return (
    occurrences *
    arcRecurrenceMultiplier(occurrences) *
    arcRecencyBonus(daysSinceLastSeen) *
    arcSourceDiversityBonus(distinctSourceTypes)
  );
}

// Compute intensity bucket from occurrence count
export function computeIntensity(occurrences) {
  if (occurrences >= ARC_RULES.INTENSITY.DOMINANT) return "dominant";
  if (occurrences >= ARC_RULES.INTENSITY.STRONG) return "strong";
  return "emerging";
}
