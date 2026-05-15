import { STAGE_CONFIG, STAGE_ORDER } from "../../config/stageConfig";

export function CompassHero({ compass }) {
  const cfg = STAGE_CONFIG[compass.currentStage] || STAGE_CONFIG.Integration;
  const stageIdx = STAGE_ORDER.indexOf(compass.currentStage);
  const sym = compass.currentSymbol;

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 20,
        padding: "32px 28px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 68, marginBottom: 8 }}>{sym.visual}</div>
      <h2
        style={{
          margin: "0 0 4px",
          fontSize: 26,
          fontWeight: 800,
          color: cfg.color,
        }}
      >
        {sym.symbol}
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 13,
          color: "#9B7FD4",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {compass.currentStage} · {sym.theme}
      </p>
      {/* Stage dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {STAGE_ORDER.map((s, i) => {
          const sc = STAGE_CONFIG[s];
          const active = s === compass.currentStage;
          const past = i < stageIdx;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: active ? 14 : 8,
                  height: active ? 14 : 8,
                  borderRadius: "50%",
                  background:
                    past || active ? sc.color : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 14px ${sc.color}` : "none",
                  transition: "all 0.3s",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: active ? sc.color : "#374151",
                  fontWeight: active ? 700 : 400,
                }}
              >
                {s.slice(0, 3).toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
