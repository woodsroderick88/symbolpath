import { Zap } from "lucide-react";

export function ActionPrompts({ prompts }) {
  if (!prompts || prompts.length === 0) return null;

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
        <Zap size={15} style={{ color: "#FBBF24" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#FBBF24",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Invitations
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {prompts.map((a, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <span style={{ color: "#FBBF24", fontSize: 14, flexShrink: 0 }}>
              →
            </span>
            <p
              style={{
                margin: 0,
                color: "#D1D5DB",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
