/**
 * SYMBOLPATH — SYMBOLIC IDENTITY ENGINE
 *
 * Sprint 4: Identity Modeling
 *
 * This engine operates on the LONGEST time horizons — months, seasons, the
 * full history of a person's symbolic life. Where the reasoning engine asks
 * "What does this mean right now?" and the longitudinal engine asks
 * "What patterns repeat over time?", the identity engine asks:
 *
 *   "What symbolic forces consistently define this life?"
 *
 * ──────────────────────────────────────────────────────────────────
 * THE FIVE PILLARS OF SYMBOLIC IDENTITY:
 *
 *  1. ARCHETYPAL SIGNATURES    — Symbols that repeatedly return across
 *                                 months, contexts, and atmospheres.
 *                                 Identity-level recurrence, not weather.
 *
 *  2. EMOTIONAL CLIMATES       — Historically recurring atmospheres.
 *                                 Not "what's the weather now?" but
 *                                 "what weather keeps coming back?"
 *
 *  3. DOMINANT CONSTELLATIONS  — Multi-symbol ecosystems that repeatedly
 *                                 emerge together across time and context.
 *
 *  4. TRANSFORMATION           — Observed movement tendencies.
 *     TENDENCIES                 Not predictions. Patterns of how this
 *                                 person characteristically transforms.
 *
 *  5. SYMBOLIC SEASONS         — Long-form transformation climates.
 *                                 Named periods of sustained atmospheric
 *                                 coherence.
 *
 * ──────────────────────────────────────────────────────────────────
 * IDENTITY CONFIDENCE THRESHOLDS:
 *
 *   Emerging      — Too early to stabilize. Signal detected but
 *                    insufficient temporal spread or source diversity.
 *
 *   Recurring     — Meaningful repetition detected. Pattern has
 *                    appeared across multiple weeks and contexts.
 *
 *   Established   — Stable symbolic tendency. Persisted through
 *                    at least one decay cycle. Multiple atmospheres.
 *
 *   Foundational  — Deeply persistent identity pattern. Survived
 *                    multiple decay cycles, anchored or near-anchor,
 *                    confirmed across diverse sources and time spans.
 *
 * ──────────────────────────────────────────────────────────────────
 * DESIGN PHILOSOPHY:
 *
 *   Identity must emerge slowly.
 *   Accumulation, not declaration.
 *   "This system notices my patterns" — not "this system defines me."
 *
 * ──────────────────────────────────────────────────────────────────
 */

import sql from "@/app/api/utils/sql";
import { computeArchetypalSignatures } from "./identityEngine/archetypalSignatures";
import { computeEmotionalClimates } from "./identityEngine/emotionalClimates";
import { computeDominantConstellations } from "./identityEngine/constellations";
import { computeTransformationTendencies } from "./identityEngine/transformationTendencies";
import { computeSymbolicSeasons } from "./identityEngine/symbolicSeasons";
import { computeOntologicalInsights } from "./identityEngine/ontologicalInsights";
import { computeIdentityMaturity } from "./identityEngine/identityMaturity";
import { generateIdentitySummary } from "./identityEngine/identitySummary";

/**
 * Compute the full Symbolic Identity profile for a user.
 *
 * This is the most comprehensive view of a person's symbolic life —
 * not what's happening now, but what consistently defines them.
 *
 * @param {string} userId
 * @returns {Object} Full identity profile with all five pillars
 */
export async function computeSymbolicIdentity(userId) {
  // Load archetype data for ontological enrichment
  const archetypeRows = await sql(
    `SELECT * FROM symbol_archetypes ORDER BY id`,
  );
  const archetypeMap = {};
  for (const a of archetypeRows) {
    archetypeMap[a.symbol] = a;
  }

  // Check data sufficiency
  const metaRows = await sql(
    `SELECT
       COUNT(*) as total_events,
       COUNT(DISTINCT DATE(created_at)) as distinct_days,
       COUNT(DISTINCT DATE_TRUNC('week', created_at)) as distinct_weeks,
       COUNT(DISTINCT symbol) as distinct_symbols,
       COUNT(DISTINCT source_type) as distinct_sources,
       MIN(created_at) as first_event,
       MAX(created_at) as last_event,
       EXTRACT(DAY FROM MAX(created_at) - MIN(created_at)) as span_days
     FROM symbol_events WHERE user_id = $1`,
    [userId],
  );

  const meta = metaRows[0];
  const totalEvents = parseInt(meta.total_events);
  const spanDays = parseInt(meta.span_days || 0);
  const distinctWeeks = parseInt(meta.distinct_weeks || 0);

  if (totalEvents < 5 || spanDays < 7) {
    return {
      ready: false,
      message:
        "Symbolic Identity requires more history. Keep logging events across different sources — your identity will emerge when there's enough temporal depth.",
      meta: {
        totalEvents,
        spanDays,
        distinctWeeks,
        distinctSymbols: parseInt(meta.distinct_symbols || 0),
        distinctSources: parseInt(meta.distinct_sources || 0),
      },
    };
  }

  // Compute all five pillars
  const [signatures, climates, constellations, tendencies, seasons] =
    await Promise.all([
      computeArchetypalSignatures(userId, archetypeMap),
      computeEmotionalClimates(userId, archetypeMap),
      computeDominantConstellations(userId, archetypeMap),
      computeTransformationTendencies(userId),
      computeSymbolicSeasons(userId, archetypeMap),
    ]);

  // Compute ontological identity insights (6th layer)
  const ontology = computeOntologicalInsights(
    signatures,
    constellations,
    tendencies,
    archetypeMap,
    spanDays,
  );

  // Generate identity summary
  const summary = generateIdentitySummary(
    signatures,
    climates,
    constellations,
    tendencies,
    seasons,
    meta,
    ontology,
  );

  // Overall identity maturity
  const maturity = computeIdentityMaturity(
    signatures,
    climates,
    constellations,
    tendencies,
    seasons,
    spanDays,
    ontology,
  );

  return {
    ready: true,
    maturity,
    meta: {
      totalEvents,
      spanDays: Math.round(spanDays),
      distinctWeeks,
      distinctSymbols: parseInt(meta.distinct_symbols || 0),
      distinctSources: parseInt(meta.distinct_sources || 0),
      firstEvent: meta.first_event,
      lastEvent: meta.last_event,
    },
    signatures,
    climates,
    constellations,
    tendencies,
    seasons,
    ontology,
    summary,
  };
}
