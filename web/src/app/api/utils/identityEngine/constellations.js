/**
 * DOMINANT CONSTELLATIONS (Identity-Level)
 *
 * These are multi-symbol ecosystems that repeatedly emerge together, not just
 * this week but across months and contexts. When they recur enough, they
 * deserve names.
 *
 * A constellation stabilizes when:
 *   - Temporally distributed (not just one burst)
 *   - Cross-source confirmed
 *   - Repeatedly co-occurring
 *   - Emotionally coherent (same or complementary atmospheric influence)
 */

import sql from "@/app/api/utils/sql";
import {
  CONFIDENCE,
  CONSTELLATION_MIN_CO_OCCURRENCE,
  CONSTELLATION_MIN_WEEKS,
  CONSTELLATION_MIN_MEMBERS,
  CONSTELLATION_MAX_MEMBERS,
} from "./config";
import { parseJsonArray } from "./helpers";

export async function computeDominantConstellations(userId, archetypeMap) {
  // Get co-occurrence data across time
  const rows = await sql(
    `SELECT symbol_a, symbol_b, co_occurrence, strength
     FROM symbol_relationships
     WHERE user_id = $1 AND co_occurrence >= $2
     ORDER BY co_occurrence DESC`,
    [userId, CONSTELLATION_MIN_CO_OCCURRENCE],
  );

  if (rows.length === 0) return [];

  // Build adjacency graph
  const edges = {};
  for (const row of rows) {
    const key = [row.symbol_a, row.symbol_b].sort().join("||");
    if (!edges[key]) {
      edges[key] = {
        symbols: [row.symbol_a, row.symbol_b].sort(),
        weight: parseInt(row.co_occurrence),
      };
    } else {
      edges[key].weight = Math.max(
        edges[key].weight,
        parseInt(row.co_occurrence),
      );
    }
  }

  // Find cliques / dense subgraphs (greedy approach)
  const symbolNeighbors = {};
  for (const edge of Object.values(edges)) {
    const [a, b] = edge.symbols;
    if (!symbolNeighbors[a]) symbolNeighbors[a] = new Set();
    if (!symbolNeighbors[b]) symbolNeighbors[b] = new Set();
    symbolNeighbors[a].add(b);
    symbolNeighbors[b].add(a);
  }

  // Greedily build constellations from highest-degree nodes
  const used = new Set();
  const constellations = [];
  const sortedSymbols = Object.entries(symbolNeighbors)
    .map(([sym, neighbors]) => ({ sym, degree: neighbors.size }))
    .sort((a, b) => b.degree - a.degree);

  for (const { sym } of sortedSymbols) {
    if (used.has(sym)) continue;

    const neighbors = symbolNeighbors[sym];
    if (!neighbors || neighbors.size < 1) continue;

    // Start with this symbol, add neighbors that are also connected to each other
    const members = [sym];
    for (const neighbor of neighbors) {
      if (used.has(neighbor)) continue;
      if (members.length >= CONSTELLATION_MAX_MEMBERS) break;

      // Check if this neighbor is connected to at least half the existing members
      const connections = members.filter((m) =>
        symbolNeighbors[neighbor]?.has(m),
      ).length;
      if (connections >= Math.ceil(members.length / 2)) {
        members.push(neighbor);
      }
    }

    if (members.length < CONSTELLATION_MIN_MEMBERS) continue;

    // Calculate constellation metrics
    let totalWeight = 0;
    let edgeCount = 0;
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const key = [members[i], members[j]].sort().join("||");
        if (edges[key]) {
          totalWeight += edges[key].weight;
          edgeCount++;
        }
      }
    }

    const avgWeight = edgeCount > 0 ? totalWeight / edgeCount : 0;
    if (avgWeight < CONSTELLATION_MIN_CO_OCCURRENCE) continue;

    members.forEach((m) => used.add(m));

    // Get temporal distribution for this constellation
    const memberList = members.map((m) => `'${m}'`).join(",");
    const temporalRows = await sql(
      `SELECT COUNT(DISTINCT DATE_TRUNC('week', created_at)) as distinct_weeks,
              COUNT(DISTINCT source_type) as source_count,
              ARRAY_AGG(DISTINCT source_type) as sources
       FROM symbol_events
       WHERE user_id = $1 AND symbol = ANY($2)`,
      [userId, members],
    );

    const temporal = temporalRows[0] || {};
    const distinctWeeks = parseInt(temporal.distinct_weeks || 0);
    const sourceCount = parseInt(temporal.source_count || 0);

    // Determine confidence
    let confidence;
    if (distinctWeeks >= 10 && sourceCount >= 4 && avgWeight >= 10) {
      confidence = CONFIDENCE.FOUNDATIONAL;
    } else if (distinctWeeks >= 6 && sourceCount >= 3 && avgWeight >= 7) {
      confidence = CONFIDENCE.ESTABLISHED;
    } else if (distinctWeeks >= CONSTELLATION_MIN_WEEKS && sourceCount >= 2) {
      confidence = CONFIDENCE.RECURRING;
    } else {
      confidence = CONFIDENCE.EMERGING;
    }

    // Atmospheric coherence
    const atmospheres = members
      .map((m) => archetypeMap[m]?.atmospheric_influence)
      .filter(Boolean);
    const atmosphereSet = new Set(atmospheres);
    const isCoherent = atmosphereSet.size <= 2;

    // Generate a constellation name
    const name = generateConstellationName(members, archetypeMap);

    // Rituals from member symbols
    const rituals = [];
    for (const m of members.slice(0, 2)) {
      const arch = archetypeMap[m];
      if (arch?.ritual_associations) {
        const r =
          typeof arch.ritual_associations === "string"
            ? JSON.parse(arch.ritual_associations)
            : arch.ritual_associations;
        if (Array.isArray(r) && r.length > 0) rituals.push(r[0]);
      }
    }

    // Stages
    const stages = [
      ...new Set(members.map((m) => archetypeMap[m]?.stage).filter(Boolean)),
    ];

    constellations.push({
      members,
      visuals: members.map((m) => archetypeMap[m]?.visual || "").join(" "),
      name,
      confidence,
      metrics: {
        avgCoOccurrence: Math.round(avgWeight * 10) / 10,
        distinctWeeks,
        sourceCount,
        sources: temporal.sources || [],
        edgeCount,
        isAtmosphericallyCoherent: isCoherent,
      },
      atmospheres: [...atmosphereSet],
      stages,
      rituals: rituals.length > 0 ? rituals : undefined,
      narrative: buildConstellationNarrative(
        members,
        name,
        confidence,
        avgWeight,
        distinctWeeks,
        archetypeMap,
      ),
    });
  }

  return constellations.sort(
    (a, b) => b.metrics.avgCoOccurrence - a.metrics.avgCoOccurrence,
  );
}

function generateConstellationName(members, archetypeMap) {
  // Name based on dominant atmospheric blend
  const atmospheres = members
    .map((m) => archetypeMap[m]?.atmospheric_influence)
    .filter(Boolean);
  const stages = members.map((m) => archetypeMap[m]?.stage).filter(Boolean);

  const hascrisis = stages.includes("Crisis");
  const hasGrowth = stages.includes("Growth");
  const hasIntegration = stages.includes("Integration");
  const hasMastery = stages.includes("Mastery");
  const hasAwakening = stages.includes("Awakening");

  if (hascrisis && hasIntegration) return "The Reckoning";
  if (hascrisis && hasGrowth) return "The Forge";
  if (hascrisis && hasMastery) return "The Tempering";
  if (hasGrowth && hasIntegration) return "The Weaving";
  if (hasGrowth && hasMastery) return "The Ascent";
  if (hasGrowth && hasAwakening) return "The Unfolding";
  if (hasIntegration && hasMastery) return "The Crowning";
  if (hasAwakening && hasGrowth) return "The Sprouting";
  if (hasAwakening && hascrisis) return "The Shattering";

  // Fallback: name from atmospheres
  if (atmospheres.includes("turbulent")) return "The Storm Circle";
  if (atmospheres.includes("luminous")) return "The Light Cluster";
  if (atmospheres.includes("grounding")) return "The Root System";
  if (atmospheres.includes("fluid")) return "The Current";

  // Final fallback
  return `The ${members[0]}-${members[1]} Constellation`;
}

function buildConstellationNarrative(
  members,
  name,
  confidence,
  avgWeight,
  weeks,
  archMap,
) {
  const memberList = members
    .map((m) => `${archMap[m]?.visual || ""} ${m}`)
    .join(", ");

  if (confidence === CONFIDENCE.FOUNDATIONAL) {
    return `"${name}" — ${memberList} — has become a foundational constellation in your symbolic identity. These symbols don't just co-occur; they function as a single psychological unit, appearing together across ${weeks} weeks with deep mutual reinforcement. This constellation is part of how you transform.`;
  }
  if (confidence === CONFIDENCE.ESTABLISHED) {
    return `"${name}" — ${memberList} — is an established constellation. These symbols consistently appear together, reinforcing each other across multiple weeks and contexts. They represent a coherent emotional complex that has become characteristic of your symbolic life.`;
  }
  if (confidence === CONFIDENCE.RECURRING) {
    return `"${name}" — ${memberList} — is forming as a recurring constellation. These symbols keep appearing together, suggesting they represent facets of one underlying pattern. More time will tell whether this becomes identity-level.`;
  }
  return `"${name}" — ${memberList} — shows early signs of constellation formation. These symbols have appeared together frequently, but need more temporal spread to confirm as an identity pattern.`;
}
