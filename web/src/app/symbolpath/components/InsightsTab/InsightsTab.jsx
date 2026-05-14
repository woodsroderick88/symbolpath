import { WeeklyNarrative } from "./WeeklyNarrative";
import { StageShift } from "./StageShift";
import { TopWeeklySymbols } from "./TopWeeklySymbols";
import { LifeArc } from "./LifeArc";
import { WEEKLY_DEFAULT } from "../../config/defaults";

export function InsightsTab({ insights }) {
  const narrative = insights?.weeklyNarrative || WEEKLY_DEFAULT;
  const stage = insights?.weeklyDominantStage || "Integration";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WeeklyNarrative narrative={narrative} stage={stage} />
      <StageShift stageShift={insights?.stageShift} />
      <TopWeeklySymbols topWeeklySymbols={insights?.topWeeklySymbols} />
      <LifeArc stageJourney={insights?.stageJourney} />
    </div>
  );
}
