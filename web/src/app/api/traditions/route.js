import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";

    // Get all tradition frameworks
    const traditions = await sql`
      SELECT id, name, slug, description, stages, metadata
      FROM tradition_frameworks
      ORDER BY 
        CASE slug
          WHEN 'western' THEN 1
          WHEN 'ubuntu' THEN 2
          WHEN 'medicine_wheel' THEN 3
          WHEN 'neidan' THEN 4
          WHEN 'sufi_nafs' THEN 5
          ELSE 6
        END
    `;

    // Get user's symbol events from the last 90 days
    const symbolEvents = await sql`
      SELECT 
        se.symbol_id,
        se.symbol,
        se.stage,
        se.created_at,
        sa.id as archetype_id
      FROM symbol_events se
      LEFT JOIN symbol_archetypes sa ON sa.symbol = se.symbol
      WHERE se.user_id = ${userId}
        AND se.created_at >= NOW() - INTERVAL '90 days'
      ORDER BY se.created_at DESC
    `;

    // For each tradition, calculate user's position
    const transformationMap = await Promise.all(
      traditions.map(async (tradition) => {
        // Get all symbol mappings for this tradition
        const mappings = await sql`
          SELECT 
            stm.symbol_id,
            stm.stage_key,
            stm.reasoning,
            sa.symbol,
            sa.stage as western_stage,
            sa.theme
          FROM symbol_tradition_map stm
          JOIN symbol_archetypes sa ON sa.id = stm.symbol_id
          WHERE stm.tradition_id = ${tradition.id}
        `;

        // Count occurrences of each stage based on user's symbols
        const stageCounts = {};
        const stageSymbols = {};

        symbolEvents.forEach((event) => {
          if (!event.archetype_id) return;

          const mapping = mappings.find(
            (m) => m.symbol_id === event.archetype_id,
          );
          if (mapping) {
            const stageKey = mapping.stage_key;
            stageCounts[stageKey] = (stageCounts[stageKey] || 0) + 1;

            if (!stageSymbols[stageKey]) {
              stageSymbols[stageKey] = [];
            }
            stageSymbols[stageKey].push({
              symbol: event.symbol,
              date: event.created_at,
            });
          }
        });

        // Find dominant stage
        let dominantStage = null;
        let maxCount = 0;
        Object.entries(stageCounts).forEach(([stage, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantStage = stage;
          }
        });

        // Calculate stage distribution percentages
        const total = Object.values(stageCounts).reduce(
          (sum, count) => sum + count,
          0,
        );
        const stageDistribution = {};
        Object.entries(stageCounts).forEach(([stage, count]) => {
          stageDistribution[stage] = {
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            symbols: stageSymbols[stage] || [],
          };
        });

        // Get stage definition for dominant stage
        const stages = tradition.stages;
        const dominantStageData = dominantStage
          ? stages.find((s) => s.key === dominantStage)
          : null;

        return {
          id: tradition.id,
          name: tradition.name,
          slug: tradition.slug,
          description: tradition.description,
          stages: stages,
          metadata: tradition.metadata,
          userPosition: {
            dominantStage: dominantStage,
            dominantStageData: dominantStageData,
            stageDistribution: stageDistribution,
            totalEvents: total,
            recentSymbols: symbolEvents.slice(0, 5).map((e) => ({
              symbol: e.symbol,
              stage: e.stage,
              date: e.created_at,
            })),
          },
        };
      }),
    );

    return Response.json({
      traditions: transformationMap,
      totalSymbolEvents: symbolEvents.length,
      dateRange: "90 days",
    });
  } catch (error) {
    console.error("Error fetching traditions:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
