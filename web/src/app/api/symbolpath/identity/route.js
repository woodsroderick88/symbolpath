/**
 * GET /api/symbolpath/identity
 *
 * Computes the full Symbolic Identity profile for the current user.
 * Returns the five pillars: signatures, climates, constellations,
 * tendencies, and seasons.
 *
 * Query params:
 *   user (optional) — defaults to 'anonymous'
 */

import { computeSymbolicIdentity } from "@/app/api/utils/identityEngine";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user") || "anonymous";

    const identity = await computeSymbolicIdentity(userId);

    return Response.json(identity);
  } catch (error) {
    console.error("[identity]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
