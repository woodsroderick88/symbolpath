/**
 * GET /api/symbolpath/longitudinal
 *
 * The Longitudinal Intelligence endpoint.
 *
 * Returns a comprehensive temporal analysis of a user's symbolic life:
 *   - Recurring stage cycles
 *   - Symbol follow-patterns (sequences)
 *   - Seasonal rhythms
 *   - Suppression detection
 *   - Emotional weather (current + trend + forecast)
 *   - Maturation arc (how symbolic vocabulary has evolved)
 *
 * Query params:
 *   userId — user identifier (default "anonymous")
 */

import { analyzeLongitudinal } from "@/app/api/utils/longitudinalEngine";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const report = await analyzeLongitudinal(userId);

    return Response.json({
      userId,
      ...report,
    });
  } catch (e) {
    console.error("[longitudinal] error:", e);
    return Response.json(
      { error: "Longitudinal analysis failed", detail: e.message },
      { status: 500 },
    );
  }
}
