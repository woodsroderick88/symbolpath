import { CompassHero } from "./CompassHero";
import { ReflectionPrompts } from "./ReflectionPrompts";
import { ActionPrompts } from "./ActionPrompts";
import { EmotionThemes } from "./EmotionThemes";
import { RecentPath } from "./RecentPath";

export function CompassTab({ compass }) {
  if (!compass) return null;

  const sym = compass.currentSymbol;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CompassHero compass={compass} />
      <ReflectionPrompts prompts={sym.reflection_prompts} />
      <ActionPrompts prompts={sym.action_prompts} />
      <EmotionThemes themes={sym.emotion_themes} stage={compass.currentStage} />
      <RecentPath symbolPath={compass.symbolPath} />
    </div>
  );
}
