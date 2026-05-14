/**
 * GET /api/symbolpath/predictions
 *
 * Predictive Symbolic Intelligence — Phase 7
 * Observational forecasting based on pattern precedent.
 *
 * Query params:
 *   user — user ID (default: "anonymous")
 */
import { computePredictiveIntelligence } from "@/app/api/utils/predictiveEngine";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user") || "anonymous";

    const result = await computePredictiveIntelligence(userId);
    return Response.json(result);
  } catch (error) {
    console.error("[predictions]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
