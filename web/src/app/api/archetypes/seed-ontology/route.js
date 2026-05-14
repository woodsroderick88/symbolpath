/**
 * POST /api/archetypes/seed-ontology
 *
 * Seeds the full Sprint 3 Canonical Symbolic Ontology into the database.
 * Updates all 24 archetypes with the six new intelligence columns:
 *   - atmospheric_influence
 *   - stabilization_tendency
 *   - counterbalance_symbols
 *   - typical_duration
 *   - permanence_affinity
 *   - ritual_associations
 *
 * Also refreshes core fields (core_meaning, emotional_tone, etc.)
 * to ensure the database matches the canonical ontology file.
 *
 * Safe to run multiple times (idempotent via upsert on symbol name).
 */

import sql from "@/app/api/utils/sql";
import { SYMBOLIC_ONTOLOGY } from "@/data/symbolic-ontology";

export async function POST(request) {
  try {
    let updated = 0;
    let errors = [];

    for (const sym of SYMBOLIC_ONTOLOGY) {
      try {
        const result = await sql(
          `UPDATE symbol_archetypes SET
            core_meaning = $1,
            emotional_tone = $2,
            shadow_expression = $3,
            growth_expression = $4,
            associated_behaviors = $5,
            transition_tendencies = $6,
            symbolic_relatives = $7,
            emotion_themes = $8,
            reflection_prompts = $9,
            action_prompts = $10,
            atmospheric_influence = $11,
            stabilization_tendency = $12,
            counterbalance_symbols = $13,
            typical_duration = $14,
            permanence_affinity = $15,
            ritual_associations = $16
          WHERE symbol = $17
          RETURNING id, symbol`,
          [
            sym.core_meaning,
            sym.emotional_tone,
            sym.shadow_expression,
            sym.growth_expression,
            JSON.stringify(sym.associated_behaviors),
            JSON.stringify(sym.transition_tendencies),
            JSON.stringify(sym.symbolic_relatives),
            JSON.stringify([]),
            JSON.stringify([sym.reflection_prompt]),
            JSON.stringify([sym.action_prompt]),
            sym.atmospheric_influence,
            sym.stabilization_tendency,
            JSON.stringify(sym.counterbalance_symbols),
            sym.typical_duration,
            sym.permanence_affinity,
            JSON.stringify(sym.ritual_associations),
            sym.symbol,
          ],
        );

        if (result.length > 0) {
          updated++;
        } else {
          errors.push({ symbol: sym.symbol, error: "Not found in database" });
        }
      } catch (e) {
        errors.push({ symbol: sym.symbol, error: e.message });
      }
    }

    return Response.json({
      success: true,
      updated,
      total: SYMBOLIC_ONTOLOGY.length,
      errors: errors.length > 0 ? errors : undefined,
      newFields: [
        "atmospheric_influence",
        "stabilization_tendency",
        "counterbalance_symbols",
        "typical_duration",
        "permanence_affinity",
        "ritual_associations",
      ],
    });
  } catch (e) {
    console.error("[seed-ontology]", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
