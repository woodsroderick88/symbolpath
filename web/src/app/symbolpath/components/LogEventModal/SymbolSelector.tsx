import { STAGE_CONFIG, STAGE_ORDER } from "../../config/stageConfig";

export function SymbolSelector({ symbols, selectedSymbol, setSelectedSymbol }) {
  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = symbols.filter((s) => s.stage === stage);
    return acc;
  }, {});

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontSize: 11,
          color: "#9B7FD4",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Symbol
      </label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 10,
        }}
      >
        {STAGE_ORDER.map((stage) => {
          const stageSyms = grouped[stage] || [];
          if (!stageSyms.length) return null;
          const sc = STAGE_CONFIG[stage];
          return (
            <div key={stage}>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 10,
                  color: sc.color,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {sc.emoji} {stage}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {stageSyms.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => setSelectedSymbol(sym)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background:
                        selectedSymbol?.id === sym.id
                          ? sc.bg
                          : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedSymbol?.id === sym.id ? sc.color : "rgba(139,92,246,0.15)"}`,
                      color:
                        selectedSymbol?.id === sym.id ? sc.color : "#9B7FD4",
                      fontSize: 13,
                      fontWeight: selectedSymbol?.id === sym.id ? 700 : 400,
                    }}
                  >
                    <span>{sym.visual}</span> {sym.symbol}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
