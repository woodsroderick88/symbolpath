/**
 * GET /api/symbolpath/continuity
 *
 * Mythic Continuity Engine — Phase 5
 * Detects long-form transformational chapters across time.
 *
 * Query params:
 *   user — user ID (default: "anonymous")
 */
import { computeMythicContinuity } from "@/app/api/utils/mythicContinuityEngine";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user") || "anonymous";
    const result = await computeMythicContinuity(userId);
    return Response.json(result);
  } catch (error) {
    console.error("[continuity]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
