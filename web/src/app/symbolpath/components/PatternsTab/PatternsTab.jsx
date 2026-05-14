import { DominantStage } from "./DominantStage";
import { TopSymbols } from "./TopSymbols";
import { NarrativeArcs } from "./NarrativeArcs";
import { StageDistribution } from "./StageDistribution";

export function PatternsTab({ patterns }) {
  if (!patterns)
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#9B7FD4" }}>
        Complete more events to reveal patterns.
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <DominantStage dominantStage={patterns.dominantStage} />
      <TopSymbols topSymbols={patterns.topSymbols} />
      <NarrativeArcs topPaths={patterns.topPaths} />
      <StageDistribution stageCounts={patterns.stageCounts} />
    </div>
  );
}
