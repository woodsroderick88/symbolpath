import { ChevronLeft, Sparkles, Check } from "lucide-react";

export function DrawingScreen({
  currentSpread,
  isDrawing,
  onDrawRandom,
  onDrawManual,
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
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
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
          <ChevronLeft size={15} /> Choose Spread
        </button>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#E9D5FF",
            marginBottom: 6,
          }}
        >
          {currentSpread.name}
        </h1>
        <p style={{ color: "#9B7FD4", marginBottom: 36 }}>
          {currentSpread.description}
        </p>

        {isDrawing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "80px 0",
              gap: 16,
            }}
          >
            <Sparkles
              size={48}
              style={{
                color: "#7C3AED",
                animation: "spin 2s linear infinite",
              }}
            />
            <p style={{ color: "#9B7FD4", fontSize: 16 }}>
              Shuffling the deck…
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              padding: "32px 0",
            }}
          >
            <div
              style={{
                width: 120,
                height: 185,
                background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 40px 8px rgba(124,58,237,0.35)",
              }}
            >
              <Sparkles size={36} style={{ color: "rgba(255,255,255,0.35)" }} />
            </div>
            <p style={{ color: "#9B7FD4", fontSize: 14 }}>
              How would you like to draw?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                width: "100%",
                maxWidth: 320,
              }}
            >
              <button
                onClick={onDrawRandom}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                }}
              >
                <Sparkles size={16} /> Random Draw
              </button>
              <button
                onClick={onDrawManual}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 24px",
                  background: "transparent",
                  color: "#C4B5FD",
                  border: "2px solid #7C3AED",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Check size={16} /> Pick Manually
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
