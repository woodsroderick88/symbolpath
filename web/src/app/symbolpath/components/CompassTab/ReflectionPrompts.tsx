import { Eye } from "lucide-react";

export function ReflectionPrompts({ prompts }) {
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
        <Eye size={15} style={{ color: "#A78BFA" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Mirror Prompts
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {prompts.map((p, i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              background: "rgba(167,139,250,0.06)",
              borderRadius: 10,
              borderLeft: "3px solid #7C3AED",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#E9D5FF",
                fontSize: 14,
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              {p}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
