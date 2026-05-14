/**
 * GET /api/symbolpath/mythology
 *
 * Mythology Layer — Phase 8
 * Symbolic autobiography and life-era synthesis.
 *
 * Query params:
 *   user — user ID (default: "anonymous")
 */
import { computeMythology } from "@/app/api/utils/mythologyEngine";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user") || "anonymous";

    const result = await computeMythology(userId);
    return Response.json(result);
  } catch (error) {
    console.error("[mythology]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
