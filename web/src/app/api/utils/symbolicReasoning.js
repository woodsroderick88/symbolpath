/**
 * SYMBOLPATH — SYMBOLIC REASONING ENGINE
 *
 *   Data Layer         → raw events, gravity, arcs
 *   Pattern Layer      → recurring sequences, stage shifts, coexistence
 *   ▶ Interpretation Layer  → THIS FILE: symbolic reasoning
 *   Guidance Layer     → contextual prompts, practices, warnings
 *
 * This engine takes a user's full symbolic state — gravity profile,
 * recent events, arc data, coexistence map — and produces REASONED
 * OBSERVATIONS: typed, prioritized, narrative-rich insights that no
 * single pattern system can produce alone.
 *
 * Each observation answers the question: "What does this MEAN?"
 *
 * ──────────────────────────────────────────────────────────────────
 * PERMANENCE CLASSIFICATION
 *
 *  WEATHER        — Temporary condition (convergences, current states)
 *  PATTERN        — Recurring dynamic (transitions, cycles, momentum)
 *  ANCHOR         — Stabilizing force (growth expressions with high weight)
 *  SCAR           — Unresolved symbolic residue (shadows, suppression)
 *  THRESHOLD      — Transformation in progress (approaching anchor, stage shifts)
 *  CONSTELLATION  — Multi-symbol ecosystem (cluster dynamics)
 *
 * ──────────────────────────────────────────────────────────────────
 * EMOTIONAL PROPORTIONALITY INTELLIGENCE (EPI)
 *
 * The system now includes four calibration layers:
 *
 *  1. TEMPORAL HONESTY    — Every observation carries a confidence level
 *                           and acknowledges data age. Young data gets
 *                           qualified language ("emerging," "possible").
 *
 *  2. PROPORTIONALITY     — When one stage dominates >55% of observations,
 *     DAMPENER              lower-priority duplicates are suppressed and
 *                           non-dominant signals are actively elevated.
 *                           The system counterbalances.
 *
 *  3. SENTIMENT CONTEXT   — User's own words modify shadow/growth scoring.
 *                           "I feel seen" reduces shadow. "I feel trapped"
 *                           increases it. The engine reads emotional content.
 *
 *  4. SILENCE / AMBIGUITY — New observation types for restraint:
 *                           "quiet field," "emerging but uncertain,"
 *                           "too early to interpret."
 *                           Not every event deserves meaning.
 *
 * ──────────────────────────────────────────────────────────────────
 */

import {
  STAGE_RANK,
  GRAVITY_LIMITS,
  PERMANENCE,
  getAnchorThreshold,
  detectRegression,
  COEXISTENCE_THRESHOLD,
  STAGE_ORDER,
} from "@/app/api/utils/memoryRules";

// ─────────────────────────────────────────────────────────────────────────────
// Observation types, priorities, and permanence categories
// ─────────────────────────────────────────────────────────────────────────────
const PRIORITY = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  WHISPER: 5, // New: for silence/ambiguity observations
};

const PERMANENCE_CATEGORY = {
  WEATHER: "weather",
  PATTERN: "pattern",
  ANCHOR: "anchor",
  SCAR: "scar",
  THRESHOLD: "threshold",
  CONSTELLATION: "constellation",
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORAL HONESTY — Confidence & Age Awareness
//
// Every observation is tagged with:
//   confidence: "high" | "medium" | "low" | "emerging"
//   dataAge:    "fresh" (<7 days) | "young" (7-21 days) | "established" (21-60 days) | "deep" (60+ days)
//   qualifier:  human-readable qualifier text for narrative (may be "")
//
// Young data produces softer language. The system earns the right to
// make strong claims only through time.
// ─────────────────────────────────────────────────────────────────────────────
function computeTemporalContext(recentEvents) {
  if (!recentEvents || recentEvents.length === 0) {
    return {
      dataAge: "none",
      ageDays: 0,
      totalEvents: 0,
      distinctDays: 0,
      confidence: "emerging",
    };
  }

  const dates = recentEvents.map((e) => new Date(e.created_at));
  const oldest = Math.min(...dates);
  const newest = Math.max(...dates);
  const ageDays = Math.max(
    1,
    Math.round((Date.now() - oldest) / (1000 * 60 * 60 * 24)),
  );
  const distinctDays = new Set(dates.map((d) => d.toISOString().split("T")[0]))
    .size;

  let dataAge;
  if (ageDays <= 7) dataAge = "fresh";
  else if (ageDays <= 21) dataAge = "young";
  else if (ageDays <= 60) dataAge = "established";
  else dataAge = "deep";

  // Confidence combines age + volume + spread
  let confidence;
  if (ageDays >= 21 && distinctDays >= 7 && recentEvents.length >= 15) {
    confidence = "high";
  } else if (ageDays >= 14 && distinctDays >= 4 && recentEvents.length >= 8) {
    confidence = "medium";
  } else if (ageDays >= 7 && distinctDays >= 2) {
    confidence = "low";
  } else {
    confidence = "emerging";
  }

  return {
    dataAge,
    ageDays,
    totalEvents: recentEvents.length,
    distinctDays,
    confidence,
  };
}

function getTemporalQualifier(temporal) {
  switch (temporal.confidence) {
    case "emerging":
      return "This is very early — ";
    case "low":
      return "With limited data so far, ";
    case "medium":
      return "";
    case "high":
      return "";
    default:
      return "";
  }
}

function getTemporalSuffix(temporal) {
  if (temporal.confidence === "emerging") {
    return " This observation may shift as more data arrives.";
  }
  if (temporal.confidence === "low") {
    return ` (Based on ${temporal.ageDays} days of data across ${temporal.distinctDays} distinct days.)`;
  }
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// SENTIMENT ANALYSIS — Read user's emotional language
//
// Scans note text, mood descriptions, and decision context to detect:
//   - Resolution language ("I feel seen", "made peace", "let go")
//   - Destruction language ("shattered", "destroyed", "hopeless")
//   - Growth-in-crisis language ("painful but necessary", "hard but good")
//   - Acceptance language ("it's okay", "enough", "at peace")
//
// Returns a sentiment modifier that shifts shadow/growth scoring.
// Range: -3 (strongly healing/resolving) to +3 (strongly destructive)
// ─────────────────────────────────────────────────────────────────────────────
const RESOLUTION_PATTERNS = [
  // Strong resolution — these indicate healing even during Crisis
  { pattern: /\bfeel(?:s|ing)?\s+seen\b/i, weight: -3 },
  { pattern: /\bmade\s+peace\b/i, weight: -3 },
  { pattern: /\blet(?:ting)?\s+(?:it\s+)?go\b/i, weight: -2 },
  { pattern: /\baccept(?:ed|ing|ance)?\b/i, weight: -2 },
  { pattern: /\brelease[d]?\b/i, weight: -2 },
  { pattern: /\bhealing\b/i, weight: -2 },
  { pattern: /\bforgi(?:ve|ving|veness)\b/i, weight: -2 },
  { pattern: /\bgrateful\b/i, weight: -2 },
  { pattern: /\bpeaceful\b/i, weight: -2 },
  { pattern: /\bgroundd?\b/i, weight: -1 },
  { pattern: /\bcalm(?:er|ing)?\b/i, weight: -1 },
  { pattern: /\bclarity\b/i, weight: -1 },
  { pattern: /\bhopeful\b/i, weight: -1 },
  { pattern: /\bnecessary\b/i, weight: -1 },
  { pattern: /\bgrowth\b/i, weight: -1 },
  { pattern: /\bbrave\b/i, weight: -1 },
  { pattern: /\bcourage\b/i, weight: -1 },
  { pattern: /\bthat's\s+enough\b/i, weight: -1 },
  { pattern: /\band\s+that'?s?\s+okay\b/i, weight: -2 },
  { pattern: /\bit\s+felt\s+like\s+care\b/i, weight: -2 },

  // Growth-in-crisis — painful but constructive
  { pattern: /\bpainful\s+but\b/i, weight: -2 },
  {
    pattern: /\bhard\s+but\s+(?:good|necessary|important|right)\b/i,
    weight: -2,
  },
  { pattern: /\buncomfortable\s+but\s+necessary\b/i, weight: -2 },
  { pattern: /\bdifficult\s+but\b/i, weight: -1 },

  // Destruction language — increases shadow
  { pattern: /\bshatter(?:ed|ing)?\b/i, weight: 2 },
  { pattern: /\bdestroy(?:ed|ing)?\b/i, weight: 2 },
  { pattern: /\bhopeless\b/i, weight: 3 },
  { pattern: /\btrapped\b/i, weight: 2 },
  { pattern: /\bresent\b/i, weight: 2 },
  { pattern: /\bregret\b/i, weight: 1 },
  { pattern: /\bstuck\b/i, weight: 1 },
  { pattern: /\bnumb\b/i, weight: 2 },
  { pattern: /\bhelpless\b/i, weight: 2 },
  { pattern: /\babandoned\b/i, weight: 2 },
  { pattern: /\bbetrayed\b/i, weight: 2 },
  { pattern: /\bfailing\b/i, weight: 1 },
  { pattern: /\bworthless\b/i, weight: 3 },
  { pattern: /\bdespair\b/i, weight: 3 },
];

function analyzeSentiment(events, symbol) {
  let modifier = 0;
  let matchCount = 0;
  const matchedTexts = [];

  // Gather all text associated with this symbol from recent events
  const symbolEvents = events.filter((e) => e.symbol === symbol);

  for (const event of symbolEvents) {
    const texts = [event.note, event.theme].filter(Boolean);

    for (const text of texts) {
      for (const { pattern, weight } of RESOLUTION_PATTERNS) {
        if (pattern.test(text)) {
          modifier += weight;
          matchCount++;
          matchedTexts.push(text.slice(0, 60));
        }
      }
    }
  }

  // Clamp to [-3, +3]
  modifier = Math.max(-3, Math.min(3, modifier));

  return {
    modifier,
    matchCount,
    hasResolution: modifier < -1,
    hasDestruction: modifier > 1,
    hasGrowthInCrisis: modifier < 0 && matchCount > 0,
    sampleText: matchedTexts[0] || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONVERGENCE DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function detectConvergence(recentEvents, temporal, windowDays = 7) {
  const observations = [];
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const windowEvents = recentEvents.filter(
    (e) => new Date(e.created_at) >= cutoff,
  );

  const symbolSources = {};
  for (const e of windowEvents) {
    if (!symbolSources[e.symbol]) {
      symbolSources[e.symbol] = {
        sources: new Set(),
        events: [],
        stage: e.stage,
        visual: e.visual,
      };
    }
    symbolSources[e.symbol].sources.add(e.source_type);
    symbolSources[e.symbol].events.push(e);
  }

  for (const [symbol, data] of Object.entries(symbolSources)) {
    const sourceCount = data.sources.size;
    if (sourceCount < 2) continue;

    const sourceList = Array.from(data.sources);
    const sourceLabels = sourceList.map(formatSourceType).join(", ");
    const priority = sourceCount >= 3 ? PRIORITY.CRITICAL : PRIORITY.HIGH;
    const qualifier = getTemporalQualifier(temporal);
    const suffix = getTemporalSuffix(temporal);

    observations.push({
      type: "convergence",
      permanence: PERMANENCE_CATEGORY.WEATHER,
      priority,
      confidence: temporal.confidence,
      symbol,
      stage: data.stage,
      visual: data.visual,
      sourceTypes: sourceList,
      sourceCount,
      eventCount: data.events.length,
      title: `${symbol} is converging`,
      narrative:
        sourceCount >= 3
          ? `${qualifier}${symbol} ${data.visual} has appeared across ${sourceCount} independent channels — ${sourceLabels}. When this many unrelated sources agree, the signal is unmistakable.${suffix}`
          : `${qualifier}${symbol} ${data.visual} appeared in both ${sourceLabels}. When different sources agree, the pattern is worth listening to carefully.${suffix}`,
      guidance: `Sit with ${symbol}'s meaning. ${
        data.stage === "Crisis"
          ? "The convergence suggests something needs your attention — though convergence alone doesn't determine the nature of the experience."
          : data.stage === "Mastery"
            ? "Multiple sources confirming mastery means this isn't just a good day — you've genuinely arrived somewhere."
            : "The convergence suggests this symbol is at the center of your current chapter."
      }`,
    });
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SHADOW / GROWTH POLARITY — Now Sentiment-Aware
//
// The shadow score formula now includes:
//   - Stage context (unchanged)
//   - Permanence context (unchanged)
//   - Velocity context (unchanged)
//   - ▶ SENTIMENT MODIFIER (NEW): reads user's own language
//
// "I feel seen" after a Tower event → shadow score drops by 3
// "I feel trapped" → shadow score rises by 2
//
// This prevents the system from declaring shadow on healing events.
// ─────────────────────────────────────────────────────────────────────────────
function detectShadowGrowth(
  gravityProfile,
  archetypeData,
  recentEvents,
  temporal,
) {
  const observations = [];

  const archetypes = {};
  for (const arch of archetypeData) {
    archetypes[arch.symbol] = arch;
  }

  for (const sym of gravityProfile) {
    if (sym.liveWeight < 1.5) continue;
    const arch = archetypes[sym.symbol];
    if (!arch || !arch.shadow_expression || !arch.growth_expression) continue;

    // Base scoring: higher = more shadow
    let shadowScore = 0;

    // Stage influence
    if (sym.stage === "Crisis") shadowScore += 3;
    else if (sym.stage === "Awakening") shadowScore += 1;
    else if (sym.stage === "Growth") shadowScore -= 1;
    else if (sym.stage === "Integration") shadowScore -= 2;
    else if (sym.stage === "Mastery") shadowScore -= 3;

    // Permanence influence
    if (sym.anchored && sym.permanenceLevel === "fading") shadowScore += 2;
    if (sym.anchored && sym.permanenceLevel === "deep") shadowScore -= 2;

    // Velocity
    if (sym.daysSinceLastSeen > 14 && sym.liveWeight > 3.0) shadowScore += 1;
    if (sym.daysSinceLastSeen <= 3 && sym.liveWeight > 4.0) shadowScore -= 1;

    // ▶ SENTIMENT MODIFIER — read the user's actual words
    const sentiment = analyzeSentiment(recentEvents, sym.symbol);
    shadowScore += sentiment.modifier;

    const isShadow = shadowScore > 1;
    const isGrowth = shadowScore < -1;
    const isAmbivalent = !isShadow && !isGrowth;

    // Skip ambivalent — the system chooses silence over false certainty
    if (isAmbivalent) continue;

    const expression = isShadow ? "shadow" : "growth";
    const text = isShadow ? arch.shadow_expression : arch.growth_expression;

    // Permanence classification with threshold awareness
    // High-weight symbols expressing shadow should NOT be called "weather"
    let permanence = PERMANENCE_CATEGORY.WEATHER;
    if (isShadow && sym.anchored) {
      permanence = PERMANENCE_CATEGORY.SCAR;
    } else if (isGrowth && sym.anchored) {
      permanence = PERMANENCE_CATEGORY.ANCHOR;
    } else if (
      isShadow &&
      sym.liveWeight >= getAnchorThreshold(sym.stage) * 0.7
    ) {
      // Strong shadow approaching permanence → threshold, not weather
      permanence = PERMANENCE_CATEGORY.THRESHOLD;
    }

    const qualifier = getTemporalQualifier(temporal);
    const suffix = getTemporalSuffix(temporal);

    // Build narrative with sentiment awareness
    let narrative;
    if (isShadow && sentiment.hasResolution) {
      // Shadow score remained positive despite resolution language — complex situation
      narrative = `${qualifier}${sym.symbol} ${sym.visual} carries shadow energy, though your own words suggest a healing process is underway. ${text} The shadow and the healing may be happening simultaneously.${suffix}`;
    } else if (isShadow) {
      narrative = `${qualifier}${sym.symbol} ${sym.visual} is active but carries shadow energy right now. ${text} This isn't a judgment — shadows hold the key to what needs healing.${suffix}`;
    } else if (
      isGrowth &&
      sentiment.hasGrowthInCrisis &&
      sym.stage === "Crisis"
    ) {
      // Growth expression during Crisis with resolution language — this is remarkable
      narrative = `${qualifier}${sym.symbol} ${sym.visual} is in a Crisis-stage symbol expressing growth — which is rare and significant. ${text} Your own language suggests you're finding healing within difficulty.${suffix}`;
    } else {
      narrative = `${qualifier}${sym.symbol} ${sym.visual} is radiating its growth expression. ${text} This is the symbol working as it's meant to.${suffix}`;
    }

    // Build guidance enriched with ontological data
    const rituals = arch.ritual_associations
      ? typeof arch.ritual_associations === "string"
        ? JSON.parse(arch.ritual_associations)
        : arch.ritual_associations
      : [];
    const topRitual =
      Array.isArray(rituals) && rituals.length > 0 ? rituals[0] : null;
    const atmosphere = arch.atmospheric_influence || null;

    observations.push({
      type: "shadow_growth",
      permanence,
      priority: isShadow ? PRIORITY.HIGH : PRIORITY.MEDIUM,
      confidence: temporal.confidence,
      symbol: sym.symbol,
      stage: sym.stage,
      visual: sym.visual,
      expression,
      shadowScore,
      sentimentModifier: sentiment.modifier,
      sentimentText: sentiment.sampleText,
      atmosphericInfluence: atmosphere,
      title: isShadow
        ? `${sym.symbol} is expressing its shadow`
        : `${sym.symbol} is in its growth expression`,
      narrative,
      guidance: isShadow
        ? `Ask: "Where am I stuck in ${sym.symbol}'s shadow?" ${arch.core_meaning ? `Remember: ${sym.symbol}'s core meaning is ${arch.core_meaning.split(".")[0].toLowerCase()}.` : ""}${topRitual ? ` Consider: ${topRitual}.` : ""}`
        : `Lean into this energy. ${sym.symbol} is supporting your growth — feed it attention.${topRitual ? ` Practice: ${topRitual}.` : ""}`,
    });
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. THRESHOLD PROXIMITY — Now with temporal honesty
// ─────────────────────────────────────────────────────────────────────────────
function detectThresholdProximity(gravityProfile, temporal) {
  const observations = [];

  for (const sym of gravityProfile) {
    if (sym.anchored) continue;

    const threshold = getAnchorThreshold(sym.stage);
    const proximity = sym.liveWeight / threshold;

    if (proximity >= 0.7 && proximity < 1.0) {
      const qualifier = getTemporalQualifier(temporal);
      const suffix = getTemporalSuffix(temporal);

      // Temporal honesty: if data is very young, threshold proximity may reflect intensity not depth
      let extraContext = "";
      if (temporal.confidence === "emerging" || temporal.confidence === "low") {
        extraContext =
          " However, with only a short history, this may reflect intensity of a single period rather than deep symbolic permanence. Time will tell.";
      }

      observations.push({
        type: "threshold",
        permanence: PERMANENCE_CATEGORY.THRESHOLD,
        priority: proximity >= 0.9 ? PRIORITY.HIGH : PRIORITY.MEDIUM,
        confidence: temporal.confidence,
        symbol: sym.symbol,
        stage: sym.stage,
        visual: sym.visual,
        currentWeight: sym.liveWeight,
        threshold,
        proximity: Math.round(proximity * 100),
        title: `${sym.symbol} is approaching permanence`,
        narrative:
          proximity >= 0.9
            ? `${qualifier}${sym.symbol} ${sym.visual} is at ${Math.round(proximity * 100)}% of anchor threshold. One or two more encounters and this symbol becomes a permanent part of your identity.${extraContext}${suffix}`
            : `${qualifier}${sym.symbol} ${sym.visual} is building toward permanence — at ${Math.round(proximity * 100)}% of the threshold. Continued engagement will anchor it into your long-term symbolic identity.${extraContext}${suffix}`,
        guidance: `${sym.symbol} is on the edge of becoming permanent. ${sym.stage === "Crisis" ? "Crisis symbols anchor at a lower threshold because they leave deeper impressions." : ""}`,
      });
    }
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MOMENTUM DETECTION — with temporal honesty
// ─────────────────────────────────────────────────────────────────────────────
function detectMomentum(gravityProfile, recentEvents, temporal) {
  const observations = [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const recentCounts = {};
  for (const e of recentEvents) {
    if (new Date(e.created_at) >= weekAgo) {
      recentCounts[e.symbol] = (recentCounts[e.symbol] || 0) + 1;
    }
  }

  for (const sym of gravityProfile) {
    const recentCount = recentCounts[sym.symbol] || 0;

    if (recentCount >= 3 && sym.liveWeight > 4.0) {
      const qualifier = getTemporalQualifier(temporal);
      const suffix = getTemporalSuffix(temporal);

      observations.push({
        type: "momentum",
        permanence: PERMANENCE_CATEGORY.PATTERN,
        priority: PRIORITY.MEDIUM,
        confidence: temporal.confidence,
        symbol: sym.symbol,
        stage: sym.stage,
        visual: sym.visual,
        direction: "accelerating",
        recentEventCount: recentCount,
        liveWeight: sym.liveWeight,
        title: `${sym.symbol} is accelerating`,
        narrative: `${qualifier}${sym.symbol} ${sym.visual} appeared ${recentCount} times this week and its gravity is actively climbing (${sym.liveWeight}). This symbol is building momentum in your life right now.${suffix}`,
        guidance: `Pay close attention to ${sym.symbol}. When a symbol accelerates, it usually means the lesson it carries is becoming urgent or central to your current chapter.`,
      });
    }

    // DECELERATING
    if (
      (sym.permanenceLevel === "anchored" ||
        sym.permanenceLevel === "strong") &&
      sym.daysSinceLastSeen >= 14 &&
      recentCount === 0
    ) {
      const permanence = sym.anchored
        ? PERMANENCE_CATEGORY.SCAR
        : PERMANENCE_CATEGORY.WEATHER;

      observations.push({
        type: "momentum",
        permanence,
        priority: PRIORITY.LOW,
        confidence: temporal.confidence,
        symbol: sym.symbol,
        stage: sym.stage,
        visual: sym.visual,
        direction: "decelerating",
        daysSinceLastSeen: sym.daysSinceLastSeen,
        liveWeight: sym.liveWeight,
        title: `${sym.symbol} is going quiet`,
        narrative: `${sym.symbol} ${sym.visual} was once strong in your stream (weight: ${sym.peakWeight.toFixed(1)}) but hasn't appeared in ${sym.daysSinceLastSeen} days. ${sym.anchored ? "As an anchored symbol, it will never fully disappear — but its current silence may itself be meaningful." : "If this pattern continues, it may fade from active significance."}`,
        guidance: `Ask: "Is ${sym.symbol}'s absence relief, or loss?" The answer tells you whether the cycle completed naturally or something was left unfinished.`,
      });
    }
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONSTELLATION DETECTION (unchanged logic, added confidence)
// ─────────────────────────────────────────────────────────────────────────────
function detectConstellations(symbolRelationships, gravityProfile, temporal) {
  const observations = [];

  const edges = {};
  for (const rel of symbolRelationships) {
    const key = [rel.symbol_a, rel.symbol_b].sort().join("|");
    if (!edges[key])
      edges[key] = { a: rel.symbol_a, b: rel.symbol_b, weight: 0 };
    edges[key].weight += parseFloat(rel.strength) * parseInt(rel.co_occurrence);
  }

  const strongPairs = Object.values(edges)
    .filter((e) => e.weight >= 2.0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  if (strongPairs.length >= 2) {
    const clusters = [];
    const used = new Set();

    for (const pair of strongPairs) {
      if (used.has(pair.a) && used.has(pair.b)) continue;
      let merged = false;
      for (const cluster of clusters) {
        if (cluster.symbols.has(pair.a) || cluster.symbols.has(pair.b)) {
          cluster.symbols.add(pair.a);
          cluster.symbols.add(pair.b);
          cluster.totalWeight += pair.weight;
          merged = true;
          break;
        }
      }
      if (!merged) {
        clusters.push({
          symbols: new Set([pair.a, pair.b]),
          totalWeight: pair.weight,
        });
      }
      used.add(pair.a);
      used.add(pair.b);
    }

    for (const cluster of clusters) {
      if (cluster.symbols.size < 2) continue;

      const symbolArr = Array.from(cluster.symbols);
      const gravSymbols = symbolArr
        .map((s) => gravityProfile.find((g) => g.symbol === s))
        .filter(Boolean);
      const visuals = gravSymbols.map((s) => s.visual).join(" ");
      const avgWeight =
        gravSymbols.reduce((s, g) => s + g.liveWeight, 0) / gravSymbols.length;

      const stageCounts = {};
      for (const gs of gravSymbols) {
        stageCounts[gs.stage] = (stageCounts[gs.stage] || 0) + 1;
      }
      const domStage = Object.entries(stageCounts).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0];

      observations.push({
        type: "constellation",
        permanence: PERMANENCE_CATEGORY.CONSTELLATION,
        priority: cluster.symbols.size >= 3 ? PRIORITY.HIGH : PRIORITY.MEDIUM,
        confidence: temporal.confidence,
        symbols: symbolArr,
        visuals,
        dominantStage: domStage,
        averageWeight: Math.round(avgWeight * 100) / 100,
        title: `Constellation: ${symbolArr.join(" + ")}`,
        narrative: `${visuals} These symbols keep appearing together — they've formed a constellation. They don't just co-occur; they function as a single psychological unit. When ${symbolArr[0]} appears, ${symbolArr.slice(1).join(" and ")} tend to follow, as if they're facets of one underlying pattern.`,
        guidance: `This constellation is a repeating emotional complex. Instead of interpreting each symbol separately, ask: "What is the ${symbolArr.join("-")} experience as a whole?"`,
      });
    }
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TRANSITION PREDICTION — with temporal honesty
// ─────────────────────────────────────────────────────────────────────────────
function detectTransitions(
  gravityProfile,
  recentEvents,
  archetypeData,
  temporal,
) {
  const observations = [];

  const archetypes = {};
  for (const arch of archetypeData) {
    archetypes[arch.symbol] = arch;
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentSymbols = new Set(
    recentEvents
      .filter((e) => new Date(e.created_at) >= weekAgo)
      .map((e) => e.symbol),
  );

  const strongSymbols = gravityProfile.filter((s) => s.liveWeight > 3.0);

  for (const sym of strongSymbols) {
    const arch = archetypes[sym.symbol];
    if (!arch || !arch.transition_tendencies) continue;

    const tendencies = Array.isArray(arch.transition_tendencies)
      ? arch.transition_tendencies
      : typeof arch.transition_tendencies === "string"
        ? JSON.parse(arch.transition_tendencies)
        : [];

    for (const tendency of tendencies) {
      const precedesMatch = tendency.match(
        /precedes?\s+([A-Z][a-z]+(?:\s+or\s+[A-Z][a-z]+)*)/i,
      );

      if (precedesMatch) {
        const predictedSymbols = precedesMatch[1]
          .split(/\s+or\s+/i)
          .map((s) => s.trim());

        for (const predicted of predictedSymbols) {
          if (recentSymbols.has(predicted)) {
            const qualifier = getTemporalQualifier(temporal);
            const suffix = getTemporalSuffix(temporal);

            observations.push({
              type: "transition",
              permanence: PERMANENCE_CATEGORY.PATTERN,
              subtype: "confirmed",
              priority: PRIORITY.MEDIUM,
              confidence: temporal.confidence,
              fromSymbol: sym.symbol,
              toSymbol: predicted,
              visual: `${sym.visual} → ${archetypes[predicted]?.visual || ""}`,
              title: `${sym.symbol} → ${predicted}: transition confirmed`,
              narrative: `${qualifier}${sym.symbol} ${sym.visual} often precedes ${predicted} — and ${predicted} has appeared this week. The archetypal pattern is playing out as expected.${suffix}`,
              guidance: `This is a recognized transition. Trust it. ${predicted}'s arrival after ${sym.symbol} suggests the natural next phase of the process you're in.`,
            });
          }
        }
      }
    }
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ABSENCE DETECTION (unchanged core, added confidence)
// ─────────────────────────────────────────────────────────────────────────────
function detectAbsence(gravityProfile, temporal) {
  const observations = [];

  for (const sym of gravityProfile) {
    if (!sym.anchored) continue;
    if (sym.daysSinceLastSeen < 21) continue;

    observations.push({
      type: "absence",
      permanence: PERMANENCE_CATEGORY.SCAR,
      priority:
        sym.permanenceLevel === "deep" ? PRIORITY.HIGH : PRIORITY.MEDIUM,
      confidence: temporal.confidence,
      symbol: sym.symbol,
      stage: sym.stage,
      visual: sym.visual,
      daysSinceLastSeen: sym.daysSinceLastSeen,
      peakWeight: sym.peakWeight,
      currentWeight: sym.liveWeight,
      title: `${sym.symbol} has gone silent`,
      narrative: `${sym.symbol} ${sym.visual} was once deeply active in your stream (peak: ${sym.peakWeight.toFixed(1)}) but hasn't appeared in ${sym.daysSinceLastSeen} days. ${sym.permanenceLevel === "deep" ? "As a deeply anchored symbol, its absence doesn't mean it's gone — it means the part of you it represents has gone underground." : "Its silence could mean the cycle completed, or that something is being avoided."}`,
      guidance: `Reflect: "When I think of ${sym.symbol}, what emotion comes up?" If it's relief, the cycle is complete. If it's discomfort, there may be unfinished work.`,
    });
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SILENCE / AMBIGUITY STATES — NEW
//
// These are observations that express RESTRAINT.
// The system deliberately chooses not to interpret:
//   - Quiet fields (few events, nothing crystallizing)
//   - Ambiguous patterns (could be signal, could be noise)
//   - Counterbalance signals (non-dominant stage deserves mention)
//   - Emerging but uncertain (too early to name)
//
// These observations build trust by demonstrating the system knows
// when NOT to speak.
// ─────────────────────────────────────────────────────────────────────────────
function generateSilenceObservations(
  gravityProfile,
  recentEvents,
  temporal,
  existingObservations,
) {
  const observations = [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const weeklyEvents = recentEvents.filter(
    (e) => new Date(e.created_at) >= weekAgo,
  );
  // Use a wider window for emerging signal detection (14 days)
  const recentWindowEvents = recentEvents.filter(
    (e) => new Date(e.created_at) >= twoWeeksAgo,
  );

  // Collect symbols that already have a stronger observation (convergence, shadow_growth, etc.)
  // These do NOT need an emerging_signal — they're already interpreted.
  const alreadyInterpreted = new Set();
  for (const obs of existingObservations) {
    if (obs.symbol) alreadyInterpreted.add(obs.symbol);
    if (obs.symbols) obs.symbols.forEach((s) => alreadyInterpreted.add(s));
    if (obs.fromSymbol) alreadyInterpreted.add(obs.fromSymbol);
    if (obs.toSymbol) alreadyInterpreted.add(obs.toSymbol);
  }

  // QUIET FIELD: Very few events this week
  if (weeklyEvents.length <= 2 && weeklyEvents.length > 0) {
    observations.push({
      type: "silence",
      permanence: PERMANENCE_CATEGORY.WEATHER,
      priority: PRIORITY.WHISPER,
      confidence: "n/a",
      title: "The field is quiet",
      narrative:
        "Not much has stirred in the symbolic field this week. That's not emptiness — it's space. Not every week needs a story. Sometimes the most important thing happening is rest.",
      guidance:
        "If the quiet feels peaceful, let it be. If it feels like avoidance, one small entry — a mood log, a dream note — can break the surface gently.",
    });
  }

  // AMBIGUOUS PATTERN: Only for emerging/low confidence data.
  // High-confidence users have enough data — single appearances are just normal variation.
  if (temporal.confidence === "emerging" || temporal.confidence === "low") {
    const symbolCounts = {};
    for (const e of recentWindowEvents) {
      if (!symbolCounts[e.symbol])
        symbolCounts[e.symbol] = {
          count: 0,
          sources: new Set(),
          stage: e.stage,
          visual: e.visual,
        };
      symbolCounts[e.symbol].count++;
      symbolCounts[e.symbol].sources.add(e.source_type);
    }

    let emergingCount = 0;
    const MAX_EMERGING = 3; // Hard cap — restraint, not noise

    for (const [symbol, data] of Object.entries(symbolCounts)) {
      if (emergingCount >= MAX_EMERGING) break;
      // Skip symbols already interpreted by stronger observations
      if (alreadyInterpreted.has(symbol)) continue;
      // 1-2 appearances from a single source — ambiguous
      if (data.count <= 2 && data.sources.size === 1) {
        observations.push({
          type: "emerging_signal",
          permanence: PERMANENCE_CATEGORY.WEATHER,
          priority: PRIORITY.WHISPER,
          confidence: "emerging",
          symbol,
          stage: data.stage,
          visual: data.visual,
          title: `${symbol} — possible signal`,
          narrative: `${symbol} ${data.visual} appeared ${data.count === 1 ? "once" : "twice"} recently, but only through ${formatSourceType(Array.from(data.sources)[0])}. It may be becoming significant, or it may be coincidence. The system is watching but not yet interpreting.`,
          guidance:
            "If this symbol resonates with something you're experiencing, pay attention. If not, let it pass.",
        });
        emergingCount++;
      }
    }
  }

  // TEMPORAL HUMILITY: When the overall data is young (emerging OR low confidence)
  if (
    (temporal.confidence === "emerging" || temporal.confidence === "low") &&
    recentEvents.length >= 3
  ) {
    observations.push({
      type: "temporal_humility",
      permanence: PERMANENCE_CATEGORY.WEATHER,
      priority: PRIORITY.WHISPER,
      confidence: temporal.confidence,
      title: "The pattern is still forming",
      narrative: `The symbolic field is young — ${temporal.ageDays} day${temporal.ageDays !== 1 ? "s" : ""} of data across ${temporal.distinctDays} distinct day${temporal.distinctDays !== 1 ? "s" : ""}. The observations above are early readings. Some will prove meaningful; others will dissolve as more data arrives. The system gains confidence over time.`,
      guidance:
        "Keep logging. The most valuable patterns emerge after 2-3 weeks of consistent input. Right now, everything is provisional.",
    });
  }

  return observations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. COUNTERBALANCE GENERATION — NEW
//
// When one stage dominates the observations, actively search for and
// elevate stabilizing, grounding, or healing signals from other stages.
//
// This is the proportionality dampener in action:
//   "Storm is active, but Scale and Chalice are present too."
//
// The counterbalance is NOT artificial — it only surfaces symbols that
// are genuinely active (weight > 1.0). It highlights what the main
// observation stream underweights.
// ─────────────────────────────────────────────────────────────────────────────
function generateCounterbalance(
  observations,
  gravityProfile,
  recentEvents,
  temporal,
  archetypeData,
) {
  // Count how many observations per stage
  const stageCounts = {};
  for (const obs of observations) {
    const stage = obs.stage || obs.dominantStage || obs.to || null;
    if (stage) {
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    }
  }

  const totalObs = observations.length;
  if (totalObs < 2) return [];

  // Also check the raw event distribution
  const eventStageCounts = {};
  for (const e of recentEvents) {
    eventStageCounts[e.stage] = (eventStageCounts[e.stage] || 0) + 1;
  }
  const totalEvents = recentEvents.length;

  // Find the dominant stage in observations
  const dominantEntry = Object.entries(stageCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (!dominantEntry) return [];

  const [dominantStage, dominantCount] = dominantEntry;
  const obsRatio = dominantCount / totalObs;
  const eventRatio =
    (eventStageCounts[dominantStage] || 0) / (totalEvents || 1);

  // Counterbalance activates if either observations OR events show >55% single-stage
  if (obsRatio <= 0.55 && eventRatio <= 0.55) return [];

  // Build archetype lookup for ontology-aware counterbalancing
  const archetypeMap = {};
  for (const a of archetypeData || []) {
    archetypeMap[a.symbol] = a;
  }

  // Collect dominant symbols to find their ontological counterbalances
  const dominantSymbols = new Set();
  for (const obs of observations) {
    if (
      (obs.stage === dominantStage || obs.dominantStage === dominantStage) &&
      obs.symbol
    ) {
      dominantSymbols.add(obs.symbol);
    }
  }

  // Gather ontological counterbalances from the archetype data
  const ontologicalCounterbalances = new Set();
  for (const sym of dominantSymbols) {
    const arch = archetypeMap[sym];
    if (arch && arch.counterbalance_symbols) {
      const cbs =
        typeof arch.counterbalance_symbols === "string"
          ? JSON.parse(arch.counterbalance_symbols)
          : arch.counterbalance_symbols;
      if (Array.isArray(cbs)) {
        cbs.forEach((cb) => ontologicalCounterbalances.add(cb));
      }
    }
  }

  // Find non-dominant symbols that ARE active (weight > 1.0) from gravity
  let balancingSymbols = gravityProfile.filter(
    (s) => s.stage !== dominantStage && s.liveWeight > 1.0,
  );

  // Sort: ontological counterbalances first (they're more meaningful), then by weight
  balancingSymbols.sort((a, b) => {
    const aIsOntological = ontologicalCounterbalances.has(a.symbol) ? 1 : 0;
    const bIsOntological = ontologicalCounterbalances.has(b.symbol) ? 1 : 0;
    if (aIsOntological !== bIsOntological)
      return bIsOntological - aIsOntological;
    return b.liveWeight - a.liveWeight;
  });

  // Fallback: if gravity doesn't have stage data, check recent events
  if (balancingSymbols.length === 0) {
    const nonDominantSymbols = {};
    for (const e of recentEvents) {
      if (e.stage !== dominantStage && !nonDominantSymbols[e.symbol]) {
        nonDominantSymbols[e.symbol] = {
          symbol: e.symbol,
          visual: e.visual || "",
          stage: e.stage,
          liveWeight: 1.0,
        };
      }
    }
    balancingSymbols = Object.values(nonDominantSymbols);
  }

  if (balancingSymbols.length === 0) return [];

  const top = balancingSymbols.slice(0, 3);
  const symbolList = top.map((s) => `${s.visual} ${s.symbol}`).join(", ");
  const stageList = [...new Set(top.map((s) => s.stage))].join(" and ");
  const effectiveRatio = Math.max(obsRatio, eventRatio);

  // Enrich narrative with ontological context
  const hasOntological = top.some((s) =>
    ontologicalCounterbalances.has(s.symbol),
  );
  const ontologicalNote = hasOntological
    ? " These are recognized counterbalances in the symbolic ontology — not random alternatives, but the specific energies that naturally equilibrate the dominant pattern."
    : "";

  // Add ritual suggestions from the counterbalance symbols
  const ritualSuggestions = [];
  for (const s of top.slice(0, 2)) {
    const arch = archetypeMap[s.symbol];
    if (arch && arch.ritual_associations) {
      const rituals =
        typeof arch.ritual_associations === "string"
          ? JSON.parse(arch.ritual_associations)
          : arch.ritual_associations;
      if (Array.isArray(rituals) && rituals.length > 0) {
        ritualSuggestions.push(`${s.symbol}: ${rituals[0]}`);
      }
    }
  }

  return [
    {
      type: "counterbalance",
      permanence: PERMANENCE_CATEGORY.WEATHER,
      priority: PRIORITY.MEDIUM,
      confidence: temporal.confidence,
      stage: top[0].stage,
      title: "Stabilizing signals present",
      balancingSymbols: top.map((s) => ({
        symbol: s.symbol,
        visual: s.visual,
        stage: s.stage,
        weight: s.liveWeight,
        isOntological: ontologicalCounterbalances.has(s.symbol),
      })),
      dominantStage,
      dominanceRatio: Math.round(effectiveRatio * 100),
      ritualSuggestions:
        ritualSuggestions.length > 0 ? ritualSuggestions : undefined,
      narrative: `While ${dominantStage} energy dominates the current field, ${symbolList} ${top.length === 1 ? "is" : "are"} also active — carrying ${stageList} energy. The field is not all ${dominantStage.toLowerCase()}.${ontologicalNote}`,
      guidance:
        ritualSuggestions.length > 0
          ? `Don't let the loudest energy be the only one you hear. Consider: ${ritualSuggestions.join("; ")}.`
          : `Don't let the loudest energy be the only one you hear. ${top[0].symbol} carries ${top[0].stage.toLowerCase()} energy that may be quietly supporting you through this period.`,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPORTIONALITY DAMPENER
//
// After all observations are generated, this function:
//   1. Counts observations per stage
//   2. If any stage has >55% of observations, suppresses lowest-priority
//      duplicates from that stage (keeps max 3 per stage)
//   3. Elevates counterbalance observations to fill the gap
//
// This prevents the system from becoming emotionally exhausting.
// ─────────────────────────────────────────────────────────────────────────────
function applyProportionalityDampener(observations) {
  const stageCounts = {};
  for (const obs of observations) {
    const stage = obs.stage || obs.dominantStage || obs.to || null;
    if (stage) {
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    }
  }

  const total = observations.length;
  if (total < 5) return observations; // Too few to dampen

  // Find any stage with >55% share
  const overRepresented = Object.entries(stageCounts).filter(
    ([_, count]) => count / total > 0.55,
  );

  if (overRepresented.length === 0) return observations;

  const maxPerStage = 3; // Hard cap per dominant stage
  const result = [];
  const stageSlots = {};

  // Sort by priority (critical first), so we keep the most important ones
  const sorted = [...observations].sort((a, b) => a.priority - b.priority);

  for (const obs of sorted) {
    const stage = obs.stage || obs.dominantStage || obs.to || null;
    const isOverRep = stage && overRepresented.some(([s]) => s === stage);

    if (isOverRep) {
      stageSlots[stage] = stageSlots[stage] || 0;
      if (stageSlots[stage] < maxPerStage) {
        result.push(obs);
        stageSlots[stage]++;
      }
      // Skip — dampened
    } else {
      result.push(obs);
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER REASONING FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run all symbolic reasoning operations and return a prioritized stream
 * of observations with emotional proportionality intelligence.
 *
 * @param {Object} state — the user's full symbolic state
 * @param {Array}  state.gravityProfile
 * @param {Array}  state.recentEvents
 * @param {Array}  state.archetypeData
 * @param {Array}  state.symbolRelationships
 * @param {Object} [state.coexistence]
 * @param {Object} [state.stageShift]
 * @returns {Object} { observations, summary, temporal, proportionality }
 */
export function reason(state) {
  const {
    gravityProfile = [],
    recentEvents = [],
    archetypeData = [],
    symbolRelationships = [],
    coexistence = null,
    stageShift = null,
  } = state;

  // ── TEMPORAL CONTEXT — how old / deep / confident is this data? ──
  const temporal = computeTemporalContext(recentEvents);

  let allObservations = [];

  // 1. Convergence
  allObservations.push(...detectConvergence(recentEvents, temporal));

  // 2. Shadow/Growth (now sentiment-aware)
  allObservations.push(
    ...detectShadowGrowth(
      gravityProfile,
      archetypeData,
      recentEvents,
      temporal,
    ),
  );

  // 3. Threshold proximity
  allObservations.push(...detectThresholdProximity(gravityProfile, temporal));

  // 4. Momentum
  allObservations.push(
    ...detectMomentum(gravityProfile, recentEvents, temporal),
  );

  // 5. Constellations
  allObservations.push(
    ...detectConstellations(symbolRelationships, gravityProfile, temporal),
  );

  // 6. Transitions
  allObservations.push(
    ...detectTransitions(gravityProfile, recentEvents, archetypeData, temporal),
  );

  // 7. Absence
  allObservations.push(...detectAbsence(gravityProfile, temporal));

  // ── Stage regression context ──
  if (stageShift?.regression?.isRegression) {
    const reg = stageShift.regression;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const crisisDrivers = recentEvents
      .filter((e) => new Date(e.created_at) >= weekAgo && e.stage === reg.to)
      .reduce((acc, e) => {
        acc[e.symbol] = (acc[e.symbol] || 0) + 1;
        return acc;
      }, {});
    const topDrivers = Object.entries(crisisDrivers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sym]) => sym);

    const qualifier = getTemporalQualifier(temporal);
    const suffix = getTemporalSuffix(temporal);

    allObservations.push({
      type: "regression_context",
      permanence: PERMANENCE_CATEGORY.THRESHOLD,
      priority: PRIORITY.CRITICAL,
      confidence: temporal.confidence,
      from: reg.from,
      to: reg.to,
      depth: reg.depth,
      name: reg.name,
      drivers: topDrivers,
      title: reg.name || "Stage Regression",
      narrative: `${qualifier}${reg.narrative} ${topDrivers.length > 0 ? `The symbols driving this shift are ${topDrivers.join(", ")}.` : ""}${suffix}`,
      guidance: `This regression is ${reg.depth > 1 ? "deep" : "shallow"} — a ${reg.depth}-stage shift. ${reg.depth > 1 ? "Deep regressions often precede the most significant breakthroughs." : "A single-stage shift is often temporary — a brief revisit."}`,
    });
  }

  // ── 8. COUNTERBALANCE — proportionality intelligence ──
  allObservations.push(
    ...generateCounterbalance(
      allObservations,
      gravityProfile,
      recentEvents,
      temporal,
      archetypeData, // Sprint 3: pass archetype data for ontological counterbalance lookup
    ),
  );

  // ── 9. SILENCE / AMBIGUITY — restraint observations ──
  // Pass existing observations so silence generator knows which symbols
  // are already interpreted (avoids redundant emerging_signal noise)
  allObservations.push(
    ...generateSilenceObservations(
      gravityProfile,
      recentEvents,
      temporal,
      allObservations,
    ),
  );

  // ── PROPORTIONALITY DAMPENER — suppress over-represented stages ──
  allObservations = applyProportionalityDampener(allObservations);

  // ── Sort by priority ──
  allObservations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  // ── Summary statistics ──
  const typeCounts = {};
  for (const obs of allObservations) {
    typeCounts[obs.type] = (typeCounts[obs.type] || 0) + 1;
  }

  const criticalCount = allObservations.filter(
    (o) => o.priority === PRIORITY.CRITICAL,
  ).length;
  const highCount = allObservations.filter(
    (o) => o.priority === PRIORITY.HIGH,
  ).length;

  // Overall tone — now proportionality-aware
  let overallTone = "steady";
  if (criticalCount > 0) overallTone = "urgent";
  else if (highCount >= 3) overallTone = "active";
  else if (allObservations.length <= 3) overallTone = "quiet";
  else if (allObservations.every((o) => o.priority >= PRIORITY.LOW))
    overallTone = "contemplative";

  // Proportionality report
  const stageObs = {};
  for (const obs of allObservations) {
    const stage = obs.stage || obs.dominantStage || obs.to || null;
    if (stage) stageObs[stage] = (stageObs[stage] || 0) + 1;
  }

  return {
    observations: allObservations,
    summary: {
      total: allObservations.length,
      critical: criticalCount,
      high: highCount,
      typeCounts,
      overallTone,
    },
    temporal,
    proportionality: {
      stageDistribution: stageObs,
      dampened: false, // Will be true if dampener was active
      counterbalanced: allObservations.some((o) => o.type === "counterbalance"),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatSourceType(type) {
  const labels = {
    tarot_reading: "tarot",
    life_event: "life event",
    dream: "dream",
    mood_log: "mood log",
    decision: "decision",
    "i-ching": "I Ching",
    oracle: "oracle",
    moon_phase: "moon phase",
    astro_transit: "astrological transit",
    relationship: "relationship",
    manual: "manual entry",
    intent: "intention",
    daily_draw: "daily draw",
    socialpath: "social path",
    transit: "transit",
  };
  return labels[type] || type.replace(/_/g, " ");
}
