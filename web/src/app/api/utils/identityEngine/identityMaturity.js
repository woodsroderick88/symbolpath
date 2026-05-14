/**
 * Identity Maturity Assessment
 */

import { CONFIDENCE } from "./config";

export function computeIdentityMaturity(
  signatures,
  climates,
  constellations,
  tendencies,
  seasons,
  spanDays,
  ontology = {},
) {
  let score = 0;
  let maxScore = 0;

  // Signatures (0-4 points)
  maxScore += 4;
  const foundationalSigs = signatures.filter(
    (s) => s.confidence === CONFIDENCE.FOUNDATIONAL,
  ).length;
  const establishedSigs = signatures.filter(
    (s) => s.confidence === CONFIDENCE.ESTABLISHED,
  ).length;
  if (foundationalSigs >= 3) score += 4;
  else if (foundationalSigs >= 1) score += 3;
  else if (establishedSigs >= 2) score += 2;
  else if (signatures.length >= 3) score += 1;

  // Climates (0-3 points)
  maxScore += 3;
  const climateCount = climates.climates?.length || 0;
  const hasCompound = climates.compoundClimates?.length > 0;
  if (climateCount >= 3 && hasCompound) score += 3;
  else if (climateCount >= 2) score += 2;
  else if (climateCount >= 1) score += 1;

  // Constellations (0-3 points)
  maxScore += 3;
  const estConstellations = constellations.filter(
    (c) => c.confidence !== CONFIDENCE.EMERGING,
  ).length;
  if (estConstellations >= 2) score += 3;
  else if (estConstellations >= 1) score += 2;
  else if (constellations.length >= 1) score += 1;

  // Tendencies (0-3 points)
  maxScore += 3;
  const compositeCount = tendencies.compositeTendencies?.length || 0;
  if (compositeCount >= 3) score += 3;
  else if (compositeCount >= 2) score += 2;
  else if (compositeCount >= 1) score += 1;

  // Seasons (0-3 points)
  maxScore += 3;
  const seasonCount = seasons.length;
  if (seasonCount >= 4) score += 3;
  else if (seasonCount >= 2) score += 2;
  else if (seasonCount >= 1) score += 1;

  // Time depth bonus (0-2 points)
  maxScore += 2;
  if (spanDays >= 180) score += 2;
  else if (spanDays >= 90) score += 1;

  // Ontological depth bonus (0-2 points)
  maxScore += 2;
  const hasAnomalies = (ontology.permanenceAnomalies?.length || 0) > 0;
  const hasTensions = (ontology.identityTensions?.length || 0) > 0;
  const hasRituals = (ontology.ritualResonance?.length || 0) >= 2;
  if (hasTensions && hasRituals) score += 2;
  else if (hasAnomalies || hasTensions || hasRituals) score += 1;

  const percentage = Math.round((score / maxScore) * 100);

  let level;
  let description;
  if (percentage >= 80) {
    level = "deep";
    description =
      "Your symbolic identity has deep roots. The patterns that define your transformation are well-established and richly interconnected.";
  } else if (percentage >= 60) {
    level = "forming";
    description =
      "Your symbolic identity is taking shape. Core signatures and tendencies are emerging, but some pillars need more time to stabilize.";
  } else if (percentage >= 35) {
    level = "early";
    description =
      "Your symbolic identity is in its early stages. Patterns are beginning to appear, but need more history across different contexts to solidify.";
  } else {
    level = "nascent";
    description =
      "Your symbolic identity is just beginning to emerge. Keep logging events from diverse sources — identity reveals itself through accumulated experience.";
  }

  return {
    level,
    score,
    maxScore,
    percentage,
    description,
  };
}
