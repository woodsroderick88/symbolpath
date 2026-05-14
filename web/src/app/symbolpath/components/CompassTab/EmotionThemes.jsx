import { STAGE_CONFIG } from "../../config/stageConfig";

export function EmotionThemes({ themes, stage }) {
  if (!themes || themes.length === 0) return null;

  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.Integration;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {themes.map((e, i) => (
        <span
          key={i}
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.color,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}
