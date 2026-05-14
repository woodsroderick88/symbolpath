/**
 * SYMBOLPATH — CANONICAL ARCHETYPE DEFINITIONS
 *
 * ⚠️  This file re-exports from the Sprint 3 Canonical Symbolic Ontology.
 *     The single source of truth is now /data/symbolic-ontology.js
 *
 * The ARCHETYPES array below is maintained for backward compatibility
 * with existing consumers. All new code should import from symbolic-ontology.js.
 */

import {
  SYMBOLIC_ONTOLOGY,
  getBySymbol,
  getByStage,
  getCounterbalances,
  getRelatives,
  STAGE_ORDER,
} from "./symbolic-ontology";

export const ARCHETYPES = SYMBOLIC_ONTOLOGY;

export { getBySymbol as getArchetypeBySymbol };
export { getByStage as getArchetypesByStage };
export { getCounterbalances };
export { getRelatives as getSymbolicRelatives };
export { STAGE_ORDER };

export const STAGE_WEIGHTS = {
  Awakening: 1,
  Growth: 2,
  Crisis: 3,
  Integration: 4,
  Mastery: 5,
};
