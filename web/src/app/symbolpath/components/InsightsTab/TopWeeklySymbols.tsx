import { STAGE_CONFIG } from "../../config/stageConfig";

export function TopWeeklySymbols({ topWeeklySymbols }) {
  if (!topWeeklySymbols || topWeeklySymbols.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#C4B5FD",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Symbols This Week
      </span>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {topWeeklySymbols.map((s, i) => {
          const sc = STAGE_CONFIG[s.stage] || STAGE_CONFIG.Integration;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "12px 16px",
                borderRadius: 12,
                background: sc.bg,
                border: `1px solid ${sc.border}`,
              }}
            >
              <span style={{ fontSize: 22 }}>{s.visual}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: sc.color }}>
                {s.symbol}
              </span>
              <span style={{ fontSize: 10, color: "#6B7280" }}>{s.count}×</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
