/**
 * Identity Summary Narrative
 */

import { CONFIDENCE } from "./config";

export function generateIdentitySummary(
  signatures,
  climates,
  constellations,
  tendencies,
  seasons,
  meta,
  ontology,
) {
  const parts = [];

  // Lead with the strongest signatures
  const topSigs = signatures.filter((s) => s.score >= 2).slice(0, 3);
  if (topSigs.length > 0) {
    const sigNames = topSigs.map((s) => `${s.visual} ${s.symbol}`).join(", ");
    parts.push(
      `Your most persistent symbolic signatures are ${sigNames}. These aren't passing weather — they are the forces that keep returning across weeks, sources, and atmospheres.`,
    );
  }

  // Dominant climate
  if (climates.dominantClimate) {
    parts.push(
      `Your recurring emotional climate is predominantly ${climates.dominantClimate.climate} — appearing in ${climates.dominantClimate.percentage}% of your symbolic weeks.`,
    );
  }

  // Named constellations
  const namedConstellations = constellations.filter(
    (c) => c.confidence !== CONFIDENCE.EMERGING,
  );
  if (namedConstellations.length > 0) {
    const names = namedConstellations.map((c) => `"${c.name}"`).join(" and ");
    parts.push(
      `${names} ${namedConstellations.length === 1 ? "has" : "have"} emerged as ${namedConstellations.length === 1 ? "a" : ""} stable constellation${namedConstellations.length > 1 ? "s" : ""} — multi-symbol ecosystems that function as single psychological units in your life.`,
    );
  }

  // Recovery pattern
  const recovery = tendencies.compositeTendencies?.find(
    (t) => t.type === "recovery_pattern",
  );
  if (recovery) {
    parts.push(recovery.narrative);
  }

  // Current season
  const currentSeason = seasons.find((s) => s.isCurrent);
  if (currentSeason) {
    parts.push(
      `You are currently in a ${currentSeason.name} — a ${currentSeason.durationWeeks}-week period of ${currentSeason.character.toLowerCase()} energy.`,
    );
  }

  // Ontological tension (if any)
  if (ontology?.identityTensions?.length > 0) {
    const tension = ontology.identityTensions[0];
    parts.push(
      `A defining tension: ${tension.visualA} ${tension.symbolA} and ${tension.visualB} ${tension.symbolB} are both identity-level signatures — yet the ontology recognizes them as counterbalances. You hold opposites simultaneously.`,
    );
  }

  // Shadow/growth summary
  const shadowSigs = (ontology?.shadowGrowthPolarity || []).filter(
    (p) => p.polarity === "shadow-dominant" || p.polarity === "shadow-leaning",
  );
  if (shadowSigs.length >= 2) {
    const shadowNames = shadowSigs
      .map((s) => `${s.visual} ${s.symbol}`)
      .join(", ");
    parts.push(
      `${shadowNames} are currently leaning toward their shadow expressions. This isn't a failure — shadows hold the map to what needs healing.`,
    );
  }

  if (parts.length === 0) {
    return "Your symbolic identity is still forming. Keep exploring — the patterns will reveal themselves with time and attention.";
  }

  return parts.join(" ");
}
