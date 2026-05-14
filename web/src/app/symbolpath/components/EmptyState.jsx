import { Plus } from "lucide-react";

export function EmptyState({ onLogSymbol }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 24px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 20,
      }}
    >
      <div style={{ fontSize: 60, marginBottom: 16 }}>🌱</div>
      <h2 style={{ margin: "0 0 8px", color: "#E9D5FF", fontSize: 22 }}>
        Your symbol journey begins
      </h2>
      <p
        style={{
          margin: "0 0 24px",
          color: "#9B7FD4",
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: 380,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Complete a tarot reading or log a symbol event to start your SymbolPath.
        Every reading auto-generates a symbol.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/reading"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "12px 24px",
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            color: "#fff",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          🎴 Start a Reading
        </a>
        <button
          onClick={onLogSymbol}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "12px 24px",
            background: "rgba(124,58,237,0.2)",
            color: "#C4B5FD",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} /> Log a Symbol
        </button>
      </div>
    </div>
  );
}
