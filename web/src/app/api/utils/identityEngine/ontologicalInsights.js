/**
 * ONTOLOGICAL IDENTITY INSIGHTS
 *
 * Deep analysis using the full symbolic ontology. Now that we have:
 *   - permanence_affinity, stabilization_tendency, typical_duration
 *   - counterbalance_symbols, symbolic_relatives, transition_tendencies
 *   - shadow_expression, growth_expression
 *   - ritual_associations, atmospheric_influence
 *
 * We can produce identity-level observations that would be impossible
 * without ontological grounding:
 *
 *   A. PERMANENCE ANOMALIES    — symbols persisting against their nature
 *   B. COUNTERBALANCE GAPS     — what's missing that should be present
 *   C. SHADOW/GROWTH POLARITY  — are signatures expressing shadow or growth?
 *   D. IDENTITY TENSIONS       — counterbalance symbols both as signatures
 *   E. ONTOLOGICAL ALIGNMENT   — observed vs expected transition tendencies
 *   F. RITUAL RESONANCE        — practices suggested by the full identity
 */

import { CONFIDENCE, PERMANENCE_RANK } from "./config";
import { parseJsonArray, formatArray } from "./helpers";

export function computeOntologicalInsights(
  signatures,
  constellations,
  tendencies,
  archetypeMap,
  spanDays,
) {
  const permanenceAnomalies = [];
  const counterbalanceGaps = [];
  const shadowGrowthPolarity = [];
  const identityTensions = [];
  const ontologicalAlignment = [];
  const ritualResonance = [];

  const sigSymbols = new Set(signatures.map((s) => s.symbol));
  const estOrHigher = signatures.filter((s) => s.score >= 2);

  // ── A. PERMANENCE ANOMALIES ──
  // Symbols persisting beyond their ontological permanence_affinity
  for (const sig of signatures) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.permanence_affinity) continue;

    const permText = arch.permanence_affinity.split(".")[0].trim();
    const permRank = PERMANENCE_RANK[permText] || 4;
    const actualPersistence = sig.score; // 1-4

    // Anomaly: low-permanence symbol that has become established+ (score >= 3)
    if (permRank <= 2 && actualPersistence >= 3) {
      permanenceAnomalies.push({
        type: "unexpected_persistence",
        symbol: sig.symbol,
        visual: sig.visual,
        stage: sig.stage,
        expectedPermanence: permText,
        actualConfidence: sig.confidence,
        narrative: `${sig.visual} ${sig.symbol} has become ${sig.confidence} in your identity, but its ontological permanence is ${permText.toLowerCase()}. ${arch.permanence_affinity} The fact that it persists anyway is psychologically significant — it means something in your life keeps reactivating a symbol that should naturally dissolve.`,
        guidance: arch.shadow_expression
          ? `Consider whether this persistence reflects ${sig.symbol}'s shadow: ${arch.shadow_expression}`
          : null,
      });
    }

    // Anomaly: high-permanence symbol that hasn't stabilized
    if (permRank >= 6 && actualPersistence <= 1 && sig.metrics.spanDays >= 30) {
      permanenceAnomalies.push({
        type: "unexpected_transience",
        symbol: sig.symbol,
        visual: sig.visual,
        stage: sig.stage,
        expectedPermanence: permText,
        actualConfidence: sig.confidence,
        narrative: `${sig.visual} ${sig.symbol} is ontologically ${permText.toLowerCase()} permanence, yet it's only ${sig.confidence} in your identity despite ${sig.metrics.spanDays} days of history. ${arch.stabilization_tendency || ""} Something may be preventing this symbol from taking root.`,
        guidance: arch.counterbalance_symbols
          ? `Its counterbalances — ${formatArray(arch.counterbalance_symbols)} — may be interfering with its stabilization.`
          : null,
      });
    }
  }

  // ── B. COUNTERBALANCE GAPS ──
  // For each established+ signature, check if its counterbalance is absent
  for (const sig of estOrHigher) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.counterbalance_symbols) continue;

    const counters = parseJsonArray(arch.counterbalance_symbols);
    const absentCounters = counters.filter((c) => !sigSymbols.has(c));

    if (
      absentCounters.length > 0 &&
      absentCounters.length === counters.length
    ) {
      const counterVisuals = absentCounters
        .map((c) => `${archetypeMap[c]?.visual || ""} ${c}`)
        .join(", ");
      counterbalanceGaps.push({
        symbol: sig.symbol,
        visual: sig.visual,
        stage: sig.stage,
        missingCounterbalances: absentCounters,
        narrative: `${sig.visual} ${sig.symbol} is ${sig.confidence} in your identity, but none of its counterbalances — ${counterVisuals} — appear as signatures. The ontology suggests these symbols naturally moderate ${sig.symbol}'s energy. Their absence may mean ${sig.symbol} is expressing without check or limit.`,
        guidance: arch.shadow_expression
          ? `Without counterbalance, ${sig.symbol} may drift toward its shadow expression: ${arch.shadow_expression}`
          : null,
      });
    }
  }

  // ── C. SHADOW/GROWTH POLARITY ──
  // Assess whether each established signature leans shadow or growth
  for (const sig of estOrHigher) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.shadow_expression || !arch?.growth_expression) continue;

    // Heuristic: high weight + crisis context = more shadow-leaning
    // High weight + growth/mastery context = more growth-leaning
    const isInCrisis = sig.stage === "Crisis";
    const isAnchored = sig.metrics.isAnchored;
    const highWeight = sig.metrics.currentWeight >= 7;

    // Check stabilization tendency for shadow clues
    const stabText = (arch.stabilization_tendency || "").toLowerCase();
    const hasShadowHint =
      stabText.includes("prone") ||
      stabText.includes("chronic") ||
      stabText.includes("red flag");

    let polarity;
    let polarityScore; // -1 to 1 (shadow to growth)
    if (isInCrisis && highWeight && isAnchored) {
      polarity = "shadow-dominant";
      polarityScore = -0.7;
    } else if (isInCrisis && highWeight) {
      polarity = "shadow-leaning";
      polarityScore = -0.4;
    } else if (!isInCrisis && isAnchored) {
      polarity = "growth-leaning";
      polarityScore = 0.5;
    } else if (sig.stage === "Mastery" || sig.stage === "Integration") {
      polarity = "growth-dominant";
      polarityScore = 0.7;
    } else {
      polarity = "balanced";
      polarityScore = 0;
    }

    shadowGrowthPolarity.push({
      symbol: sig.symbol,
      visual: sig.visual,
      stage: sig.stage,
      confidence: sig.confidence,
      polarity,
      polarityScore,
      shadowExpression: arch.shadow_expression,
      growthExpression: arch.growth_expression,
      narrative:
        polarity === "shadow-dominant"
          ? `${sig.visual} ${sig.symbol} is expressing predominantly through its shadow: "${arch.shadow_expression}" Its growth form — "${arch.growth_expression}" — is available but not yet dominant.`
          : polarity === "shadow-leaning"
            ? `${sig.visual} ${sig.symbol} leans toward shadow expression currently. Watch for: "${arch.shadow_expression}" The path toward growth: "${arch.growth_expression}"`
            : polarity === "growth-dominant"
              ? `${sig.visual} ${sig.symbol} is expressing through its fullest form: "${arch.growth_expression}"`
              : polarity === "growth-leaning"
                ? `${sig.visual} ${sig.symbol} is moving toward its growth expression: "${arch.growth_expression}"`
                : `${sig.visual} ${sig.symbol} holds both its shadow and growth in balance. Shadow: "${arch.shadow_expression}" Growth: "${arch.growth_expression}"`,
    });
  }

  // ── D. IDENTITY TENSIONS ──
  // When counterbalance symbols are BOTH present as signatures
  const checkedPairs = new Set();
  for (const sig of estOrHigher) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.counterbalance_symbols) continue;

    const counters = parseJsonArray(arch.counterbalance_symbols);
    for (const counter of counters) {
      const pairKey = [sig.symbol, counter].sort().join("||");
      if (checkedPairs.has(pairKey)) continue;
      checkedPairs.add(pairKey);

      const counterSig = signatures.find(
        (s) => s.symbol === counter && s.score >= 2,
      );
      if (!counterSig) continue;

      const counterArch = archetypeMap[counter];
      identityTensions.push({
        symbolA: sig.symbol,
        visualA: sig.visual,
        symbolB: counter,
        visualB: counterSig.visual,
        stageA: sig.stage,
        stageB: counterSig.stage,
        narrative: `${sig.visual} ${sig.symbol} and ${counterSig.visual} ${counter} are both signatures in your identity — yet the ontology identifies them as counterbalances. This creates a productive tension: ${sig.symbol} (${arch.atmospheric_influence || sig.stage}) and ${counter} (${counterArch?.atmospheric_influence || counterSig.stage}) naturally moderate each other. Their co-presence suggests an identity that holds opposites simultaneously — a sign of complexity rather than contradiction.`,
      });
    }
  }

  // ── E. ONTOLOGICAL ALIGNMENT ──
  // Compare observed transition tendencies with ontological expectations
  const transitions = tendencies?.transitions || [];
  for (const sig of estOrHigher.slice(0, 5)) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.transition_tendencies) continue;

    const expectedTransitions = parseJsonArray(arch.transition_tendencies);
    if (expectedTransitions.length === 0) continue;

    // Check if observed transitions align
    const sigTransitions = transitions.filter(
      (t) => t.from === sig.stage || t.to === sig.stage,
    );

    const expectedText = expectedTransitions.join("; ");
    const observedText =
      sigTransitions.length > 0
        ? sigTransitions
            .slice(0, 3)
            .map((t) => `${t.from} → ${t.to} (${t.count}×)`)
            .join(", ")
        : "none observed yet";

    // Simple alignment check: does "precedes" or "follows" match observed data?
    let alignment = "unknown";
    for (const exp of expectedTransitions) {
      const expLower = exp.toLowerCase();
      const matchedTransitions = sigTransitions.filter((t) => {
        if (expLower.includes("precedes") || expLower.includes("before")) {
          return t.from === sig.stage;
        }
        if (expLower.includes("follows") || expLower.includes("after")) {
          return t.to === sig.stage;
        }
        return false;
      });
      if (matchedTransitions.length > 0) {
        alignment = "confirmed";
        break;
      }
    }

    ontologicalAlignment.push({
      symbol: sig.symbol,
      visual: sig.visual,
      expected: expectedText,
      observed: observedText,
      alignment,
      narrative:
        alignment === "confirmed"
          ? `${sig.visual} ${sig.symbol}'s movement patterns match its ontological nature: "${expectedText}" — and your lived data confirms this.`
          : `${sig.visual} ${sig.symbol} is expected to follow these patterns: "${expectedText}" — but observed transitions show: ${observedText}. Your path with ${sig.symbol} may be unique to your symbolic life.`,
    });
  }

  // ── F. RITUAL RESONANCE ──
  // Aggregate ritual practices from all established+ signatures
  const ritualCounts = {};
  for (const sig of estOrHigher) {
    const arch = archetypeMap[sig.symbol];
    if (!arch?.ritual_associations) continue;

    const rituals = parseJsonArray(arch.ritual_associations);
    for (const r of rituals) {
      if (!ritualCounts[r]) {
        ritualCounts[r] = { practice: r, symbols: [], count: 0, weight: 0 };
      }
      ritualCounts[r].symbols.push(sig.symbol);
      ritualCounts[r].count++;
      ritualCounts[r].weight += sig.score;
    }
  }

  const topRituals = Object.values(ritualCounts)
    .filter((r) => r.count >= 2) // Only rituals resonant with 2+ signatures
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((r) => ({
      practice: r.practice,
      resonantSymbols: r.symbols,
      symbolCount: r.count,
      weight: r.weight,
      narrative: `"${r.practice}" resonates with ${r.count} of your signatures (${r.symbols.join(", ")}). This practice addresses multiple identity-level forces simultaneously.`,
    }));

  if (topRituals.length > 0) {
    ritualResonance.push(...topRituals);
  }

  return {
    permanenceAnomalies,
    counterbalanceGaps,
    shadowGrowthPolarity,
    identityTensions,
    ontologicalAlignment,
    ritualResonance,
    hasMeaningfulInsights:
      permanenceAnomalies.length > 0 ||
      counterbalanceGaps.length > 0 ||
      shadowGrowthPolarity.length > 0 ||
      identityTensions.length > 0 ||
      ontologicalAlignment.length > 0 ||
      ritualResonance.length > 0,
  };
}
