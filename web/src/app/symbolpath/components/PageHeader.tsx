import { Plus } from "lucide-react";

export function PageHeader({ onLogSymbol }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "20px 0 0",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <a
            href="/"
            style={{
              fontSize: 13,
              color: "#9B7FD4",
              textDecoration: "none",
            }}
          >
            ← Archive
          </a>
          <span style={{ color: "#374151" }}>·</span>
          <span style={{ fontSize: 13, color: "#C4B5FD", fontWeight: 600 }}>
            SymbolPath
          </span>
        </div>
        <h1
          style={{
            margin: "0 0 2px",
            fontSize: 20,
            fontWeight: 800,
            color: "#E9D5FF",
          }}
        >
          🧭 Symbol Engine
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
          A mirror revealing patterns, not a voice predicting fate.
        </p>
      </div>
      <button
        onClick={onLogSymbol}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 18px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
          color: "#fff",
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Plus size={14} /> Log Symbol
      </button>
    </div>
  );
}
