/**
 * GET /api/symbolpath/gravity
 *
 * Returns a user's full gravity profile — all symbols with their
 * live-decayed weight scores, permanence levels, and trend history.
 *
 * This is the primary read endpoint for memory state.
 * It powers: Compass stage weighting, Symbol Map discovery UI,
 * the narrative layer's "dominant symbols", and the weekly history chart.
 *
 * Query params:
 *   userId     — user identifier (default "anonymous")
 *   history    — "true" to include weekly trend data (default false)
 *   weeks      — how many weeks of history to return (default 8)
 *   anchored   — "true" to return only anchored symbols (default false)
 */

import {
  readGravityProfile,
  readGravityHistory,
  computeStageCoexistence,
} from "@/app/api/utils/gravityEngine";

import {
  PERMANENCE,
  STAGE_HALF_LIFE_DAYS,
  SOURCE_WEIGHTS,
  ARC_RULES,
  STAGE_SHIFT_RULES,
  detectRegression,
} from "@/app/api/utils/memoryRules";

import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get("history") === "true";
    const anchoredOnly = searchParams.get("anchored") === "true";
    const weeks = parseInt(searchParams.get("weeks") || "8");

    // Fetch live gravity profile (decay applied on read)
    const profile = await readGravityProfile(userId);

    // Optionally filter to anchored symbols only
    const symbols = anchoredOnly ? profile.filter((s) => s.anchored) : profile;

    // Categorize symbols by permanence level
    const categorized = {
      deep: symbols.filter((s) => s.permanenceLevel === "deep"),
      anchored: symbols.filter((s) => s.permanenceLevel === "anchored"),
      strong: symbols.filter((s) => s.permanenceLevel === "strong"),
      active: symbols.filter((s) => s.permanenceLevel === "active"),
      fading: symbols.filter((s) => s.permanenceLevel === "fading"),
    };

    // Stage coexistence analysis — multiple stages always coexist
    const coexistence = computeStageCoexistence(profile);

    // Source diversity: which source types have contributed to this user's stream
    const allSourceTypes = new Set();
    for (const sym of profile) {
      for (const st of sym.sourceTypes) allSourceTypes.add(st);
    }

    // Summary statistics
    const summary = {
      totalSymbols: profile.length,
      anchoredCount: profile.filter((s) => s.anchored).length,
      deepCount: categorized.deep.length,
      fadingCount: categorized.fading.length,
      totalGravity:
        Math.round(profile.reduce((s, r) => s + r.liveWeight, 0) * 100) / 100,
      dominantSymbol: profile[0]?.symbol || null,
      dominantStage: coexistence.dominant?.stage || null,
      secondaryStages: coexistence.secondary.map((s) => s.stage),
      isMultiStage: coexistence.isMultiStage,
      coexistenceRatio: coexistence.coexistenceRatio,
      stageGravity: coexistence.all.reduce((obj, s) => {
        obj[s.stage] = s.totalWeight;
        return obj;
      }, {}),
      sourceDiversity: Array.from(allSourceTypes),
    };

    // Optional: weekly history for trend charts
    let history = null;
    if (includeHistory) {
      history = await readGravityHistory(userId, weeks);
    }

    // Expose the memory rules that govern this data (for UI transparency)
    const rules = {
      sourceWeights: SOURCE_WEIGHTS,
      stageHalfLives: STAGE_HALF_LIFE_DAYS,
      anchorThreshold: PERMANENCE.ANCHOR_THRESHOLD,
      anchorFloor: PERMANENCE.ANCHOR_FLOOR,
      highPermanenceAt: PERMANENCE.HIGH_PERMANENCE_THRESHOLD,
      arcActiveWindow: ARC_RULES.ACTIVE_WINDOW_DAYS,
      shiftMinEvents: STAGE_SHIFT_RULES.MIN_EVENTS_FOR_MEDIUM,
    };

    return Response.json({
      userId,
      symbols,
      categorized,
      coexistence,
      summary,
      history,
      rules,
    });
  } catch (err) {
    console.error("[gravity] GET error:", err);
    return Response.json(
      { error: "Failed to read gravity profile" },
      { status: 500 },
    );
  }
}
