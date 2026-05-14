/**
 * GET /api/symbolpath/memory
 *
 * Symbolic Memory Retrieval — Phase 6
 * Meaningful retrieval of symbolic history.
 *
 * Query params:
 *   user     — user ID (default: "anonymous")
 *   action   — one of: search, climates, compare, constellation, thresholds, timeline
 *
 *   For search:
 *     q — free-form search query
 *
 *   For climates:
 *     climate — filter by climate type (optional)
 *     stage   — filter by stage (optional)
 *     limit   — max results (default: 20)
 *
 *   For compare:
 *     aStart, aEnd — period A date range
 *     bStart, bEnd — period B date range
 *
 *   For constellation:
 *     symbols — comma-separated symbol names
 *
 *   For thresholds:
 *     from — from stage (optional)
 *     to   — to stage (optional)
 *     symbol — filter by symbol (optional)
 *
 *   For timeline:
 *     (no additional params)
 */
import {
  retrievePriorClimates,
  compareSeasons,
  revisitConstellation,
  findRepeatedThresholds,
  compressTimeline,
  symbolicSearch,
} from "@/app/api/utils/symbolicMemoryEngine";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user") || "anonymous";
    const action = url.searchParams.get("action") || "timeline";

    switch (action) {
      case "search": {
        const q = url.searchParams.get("q") || "";
        const result = await symbolicSearch(userId, q);
        return Response.json(result);
      }

      case "climates": {
        const climate = url.searchParams.get("climate") || undefined;
        const stage = url.searchParams.get("stage") || undefined;
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const result = await retrievePriorClimates(userId, {
          climate,
          stage,
          limit,
        });
        return Response.json(result);
      }

      case "compare": {
        const aStart = url.searchParams.get("aStart");
        const aEnd = url.searchParams.get("aEnd");
        const bStart = url.searchParams.get("bStart");
        const bEnd = url.searchParams.get("bEnd");
        if (!aStart || !aEnd || !bStart || !bEnd) {
          return Response.json(
            { error: "compare requires aStart, aEnd, bStart, bEnd" },
            { status: 400 },
          );
        }
        const result = await compareSeasons(
          userId,
          { startDate: aStart, endDate: aEnd },
          { startDate: bStart, endDate: bEnd },
        );
        return Response.json(result);
      }

      case "constellation": {
        const symbolsStr = url.searchParams.get("symbols") || "";
        const symbols = symbolsStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (symbols.length === 0) {
          return Response.json(
            { error: "constellation requires symbols param" },
            { status: 400 },
          );
        }
        const result = await revisitConstellation(userId, symbols);
        return Response.json(result);
      }

      case "thresholds": {
        const from = url.searchParams.get("from") || undefined;
        const to = url.searchParams.get("to") || undefined;
        const symbol = url.searchParams.get("symbol") || undefined;
        const result = await findRepeatedThresholds(userId, {
          fromStage: from,
          toStage: to,
          symbol,
        });
        return Response.json(result);
      }

      case "timeline": {
        const result = await compressTimeline(userId);
        return Response.json(result);
      }

      default:
        return Response.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("[memory]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
