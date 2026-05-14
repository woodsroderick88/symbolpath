import { Star } from "lucide-react";
import { STAGE_CONFIG } from "../../config/stageConfig";

export function TopSymbols({ topSymbols }) {
  if (!topSymbols || topSymbols.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Star size={15} style={{ color: "#FBBF24" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Recurring Symbols
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {topSymbols.map((sym, i) => {
          const cfg = STAGE_CONFIG[sym.stage] || STAGE_CONFIG.Integration;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
              }}
            >
              <span style={{ fontSize: 22 }}>{sym.visual}</span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: cfg.color,
                  }}
                >
                  {sym.symbol}
                </span>
                <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>
                  · {sym.stage} · {sym.theme}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: cfg.color,
                  }}
                >
                  {sym.count}
                </span>
                <p style={{ margin: 0, fontSize: 10, color: "#6B7280" }}>
                  times
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
