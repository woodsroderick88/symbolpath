import detectArcs from "@/app/api/utils/arcPatternEngine";

export async function GET(request, { params }) {
  try {
    const userId = params.user || "anonymous";
    const { searchParams } = new URL(request.url);
    const min = parseInt(searchParams.get("min") || "2");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await detectArcs(userId, { min, limit });

    return Response.json(result);
  } catch (err) {
    console.error("Arc pattern detection error:", err);
    return Response.json(
      { error: "Failed to detect arc patterns" },
      { status: 500 },
    );
  }
}
