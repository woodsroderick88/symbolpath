import { ChevronLeft, Sparkles, Layers } from "lucide-react";

export function OracleResult({
  result,
  onDrawAnother,
  onSwitchToTarot,
  onBack,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#9B7FD4",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            marginBottom: 24,
          }}
        >
          <ChevronLeft size={15} /> Back to Decks
        </button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#E9D5FF",
              marginBottom: 8,
            }}
          >
            {result.name}
          </h1>
          <p style={{ color: "#9B7FD4", fontSize: 14 }}>from {result.deck}</p>
        </div>
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(76,29,149,0.3))",
            borderRadius: 20,
            padding: 32,
            border: "1px solid rgba(139,92,246,0.35)",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 40px rgba(124,58,237,0.5)",
            }}
          >
            <Sparkles size={40} style={{ color: "rgba(255,255,255,0.7)" }} />
          </div>
          <p
            style={{
              color: "#E9D5FF",
              fontSize: 18,
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            {result.meaning}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={onDrawAnother}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Sparkles size={15} /> Draw Another
          </button>
          <button
            onClick={onSwitchToTarot}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "transparent",
              color: "#C4B5FD",
              border: "2px solid #7C3AED",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Layers size={15} /> Switch to Tarot
          </button>
        </div>
      </div>
    </div>
  );
}
