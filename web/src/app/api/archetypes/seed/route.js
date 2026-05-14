/**
 * POST /api/archetypes/seed
 *
 * Upserts all 24 canonical archetypes into the symbol_archetypes table.
 * Safe to run multiple times — uses INSERT ... ON CONFLICT (id) DO UPDATE.
 *
 * Populates every field in the ontological definition:
 *   core_meaning, emotional_tone, shadow_expression, growth_expression,
 *   associated_behaviors, transition_tendencies, symbolic_relatives,
 *   reflection_prompts (first prompt), action_prompts (first prompt), visual
 */

import sql from "@/app/api/utils/sql";
import { ARCHETYPES } from "@/data/archetypes";

export async function POST() {
  try {
    let seeded = 0;

    for (const a of ARCHETYPES) {
      await sql(
        `INSERT INTO symbol_archetypes (
          id,
          symbol,
          stage,
          theme,
          visual,
          core_meaning,
          emotional_tone,
          shadow_expression,
          growth_expression,
          associated_behaviors,
          transition_tendencies,
          symbolic_relatives,
          emotion_themes,
          reflection_prompts,
          action_prompts
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          symbol              = EXCLUDED.symbol,
          stage               = EXCLUDED.stage,
          theme               = EXCLUDED.theme,
          visual              = EXCLUDED.visual,
          core_meaning        = EXCLUDED.core_meaning,
          emotional_tone      = EXCLUDED.emotional_tone,
          shadow_expression   = EXCLUDED.shadow_expression,
          growth_expression   = EXCLUDED.growth_expression,
          associated_behaviors = EXCLUDED.associated_behaviors,
          transition_tendencies = EXCLUDED.transition_tendencies,
          symbolic_relatives  = EXCLUDED.symbolic_relatives,
          emotion_themes      = EXCLUDED.emotion_themes,
          reflection_prompts  = EXCLUDED.reflection_prompts,
          action_prompts      = EXCLUDED.action_prompts`,
        [
          a.id,
          a.symbol,
          a.stage,
          a.theme,
          a.visual,
          a.core_meaning,
          a.emotional_tone,
          a.shadow_expression,
          a.growth_expression,
          JSON.stringify(a.associated_behaviors),
          JSON.stringify(a.transition_tendencies),
          JSON.stringify(a.symbolic_relatives),
          JSON.stringify([a.emotional_tone]), // emotion_themes (array form)
          JSON.stringify([a.reflection_prompt]), // reflection_prompts (array form)
          JSON.stringify([a.action_prompt]), // action_prompts (array form)
        ],
      );
      seeded++;
    }

    return Response.json({
      success: true,
      message: `Seeded ${seeded} archetypes with full canonical definitions.`,
      seeded,
    });
  } catch (error) {
    console.error("[archetypes/seed] Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/archetypes/seed
 * Returns a dry-run preview of what would be seeded.
 */
export async function GET() {
  const { ARCHETYPES: data } = await import("@/data/archetypes");
  return Response.json({
    total: data.length,
    stages: [...new Set(data.map((a) => a.stage))],
    symbols: data.map((a) => ({
      id: a.id,
      symbol: a.symbol,
      stage: a.stage,
      visual: a.visual,
    })),
    fields: [
      "core_meaning",
      "emotional_tone",
      "shadow_expression",
      "growth_expression",
      "associated_behaviors",
      "transition_tendencies",
      "symbolic_relatives",
      "reflection_prompt",
      "action_prompt",
      "visual_language",
    ],
    instructions:
      "POST to this endpoint to upsert all 24 archetypes into the database.",
  });
}
