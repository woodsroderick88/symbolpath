import { useState, useEffect } from "react";
import { RotateCcw, BookOpen, Volume2, VolumeX, Sparkles } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { ThreeCardLayout } from "./ThreeCardLayout";
import { CelticCrossLayout } from "./CelticCrossLayout";
import { AIReadingPanel } from "./AIReadingPanel";
import Card3DViewer from "@/components/Card3DViewer";
import { TAROT_IMAGES, getYesNoVerdict } from "@/data/tarot-images";

// ── Yes/No Answer Panel ───────────────────────────────────────────────────────
function YesNoPanel({ card, isReversed }) {
  const { verdict, color, bg, msg } = getYesNoVerdict(card.id, isReversed);
  return (
    <div
      style={{
        marginBottom: 20,
        borderRadius: 16,
        padding: "28px 24px",
        textAlign: "center",
        background: bg,
        border: `1px solid ${color}40`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 11,
          fontWeight: 700,
          color: "#9B7FD4",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        The Verdict
      </p>
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color,
          letterSpacing: "0.06em",
          marginBottom: 12,
          textShadow: `0 0 28px ${color}60`,
        }}
      >
        {verdict}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: "#D1D5DB",
          lineHeight: 1.75,
          fontStyle: "italic",
          maxWidth: 420,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {msg}
      </p>
      {isReversed && (
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#9B7FD4" }}>
          ↕ Card drawn in reverse — energy may be delayed or internalized
        </p>
      )}
    </div>
  );
}

export function ReadingResults({
  currentSpread,
  drawnCards,
  ambientEnabled,
  onToggleAmbient,
  savedId,
  saving,
  saveError,
  onSaveReading,
  onResetReading,
  view3DCard,
  setView3DCard,
  onDrawAgain,
  moonPhaseName,
}) {
  const [transits, setTransits] = useState([]);

  // Fetch current planetary transits for AI context
  useEffect(() => {
    fetch("/api/astrology")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.transits) setTransits(data.transits);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      {/* 3D Card Viewer Modal */}
      {view3DCard && (
        <Card3DViewer
          cardName={view3DCard.name}
          cardImage={TAROT_IMAGES[view3DCard.id]}
          onClose={() => setView3DCard(null)}
        />
      )}

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              {currentSpread.name}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
              Click each card to reveal it
            </p>
            {/* Moon phase badge for daily card */}
            {currentSpread.id === "daily" && moonPhaseName && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  background: "rgba(109,40,217,0.2)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: 20,
                  padding: "4px 12px",
                }}
              >
                <span style={{ fontSize: 14 }}>🌙</span>
                <span
                  style={{ fontSize: 12, color: "#C4B5FD", fontWeight: 600 }}
                >
                  {moonPhaseName} — cards weighted by lunar energy
                </span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={onToggleAmbient}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                background: ambientEnabled
                  ? "rgba(124,58,237,0.3)"
                  : "rgba(124,58,237,0.1)",
                color: ambientEnabled ? "#C4B5FD" : "#9B7FD4",
                border: `1px solid ${ambientEnabled ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.3)"}`,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {ambientEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{ambientEnabled ? "Audio On" : "Audio Off"}</span>
            </button>
            {savedId ? (
              <a
                href="/journal"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  background: "rgba(124,58,237,0.2)",
                  color: "#C4B5FD",
                  border: "1px solid rgba(139,92,246,0.4)",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <BookOpen size={14} /> View Journal
              </a>
            ) : (
              <button
                onClick={() => onSaveReading(null)}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  background: saving
                    ? "rgba(124,58,237,0.1)"
                    : "rgba(124,58,237,0.2)",
                  color: saving ? "#6B7280" : "#C4B5FD",
                  border: "1px solid rgba(139,92,246,0.4)",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                <BookOpen size={14} />
                {saving ? "Saving…" : "Save Reading"}
              </button>
            )}
            <button
              onClick={onResetReading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.04)",
                color: "#9B7FD4",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 10,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> New Reading
            </button>
          </div>
        </div>
        {saveError && (
          <p style={{ color: "#F87171", fontSize: 13, marginBottom: 12 }}>
            {saveError}
          </p>
        )}

        {/* Spread Layout */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 20,
            padding: 24,
            border: "1px solid rgba(139,92,246,0.2)",
            marginBottom: 20,
          }}
        >
          {currentSpread.id === "three-card" && (
            <ThreeCardLayout drawnCards={drawnCards} spread={currentSpread} />
          )}
          {(currentSpread.id === "daily" || currentSpread.id === "yes-no") && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FlipCard
                card={drawnCards[0].card}
                isReversed={drawnCards[0].isReversed}
                position={currentSpread.positions[0]}
                size="md"
              />
            </div>
          )}
          {currentSpread.id === "celtic-cross" && (
            <CelticCrossLayout drawnCards={drawnCards} spread={currentSpread} />
          )}
          {!["three-card", "daily", "yes-no", "celtic-cross"].includes(
            currentSpread.id,
          ) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
                padding: "8px 0",
              }}
            >
              {drawnCards.map((drawn, i) => (
                <FlipCard
                  key={i}
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  position={currentSpread.positions[i]}
                  size="md"
                />
              ))}
            </div>
          )}
        </div>

        {/* Yes/No Verdict Panel */}
        {currentSpread.id === "yes-no" && drawnCards[0] && (
          <YesNoPanel
            card={drawnCards[0].card}
            isReversed={drawnCards[0].isReversed}
          />
        )}

        {/* AI Reading */}
        <AIReadingPanel
          drawnCards={drawnCards}
          spread={currentSpread}
          transits={transits}
          moonPhase={moonPhaseName}
        />

        {/* Meanings Panel */}
        <div
          style={{
            marginTop: 20,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            border: "1px solid rgba(139,92,246,0.2)",
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: 18,
              fontWeight: 700,
              color: "#C4B5FD",
            }}
          >
            Card Meanings
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {drawnCards.map((drawn, index) => {
              const orient = drawn.isReversed
                ? drawn.card.reversed
                : drawn.card.upright;
              return (
                <div
                  key={index}
                  style={{
                    paddingBottom: 18,
                    marginBottom: 18,
                    borderBottom:
                      index < drawnCards.length - 1
                        ? "1px solid rgba(139,92,246,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Card image thumbnail */}
                    <div
                      style={{
                        width: 52,
                        height: 82,
                        borderRadius: 7,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(139,92,246,0.3)",
                        boxShadow: "0 0 12px rgba(124,58,237,0.2)",
                      }}
                    >
                      <img
                        src={TAROT_IMAGES[drawn.card.id]}
                        alt={drawn.card.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: drawn.isReversed
                            ? "rotate(180deg)"
                            : "none",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 6px",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#E9D5FF",
                        }}
                      >
                        {currentSpread.positions[index].name}: {drawn.card.name}
                        {drawn.isReversed && (
                          <span
                            style={{
                              fontWeight: 400,
                              color: "#9CA3AF",
                              fontSize: 13,
                            }}
                          >
                            {" "}
                            (Reversed)
                          </span>
                        )}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        {orient.keywords.map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 11,
                              background: "rgba(109,40,217,0.2)",
                              color: "#A78BFA",
                              padding: "2px 8px",
                              borderRadius: 6,
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#D1D5DB",
                          lineHeight: 1.75,
                        }}
                      >
                        {orient.meaning}
                      </p>
                      <button
                        onClick={() => setView3DCard(drawn.card)}
                        style={{
                          marginTop: 8,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 12px",
                          background: "rgba(124,58,237,0.15)",
                          color: "#A78BFA",
                          border: "1px solid rgba(139,92,246,0.25)",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Sparkles size={11} /> View in 3D
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draw Again */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        >
          <button
            onClick={onDrawAgain}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              background: "transparent",
              color: "#C4B5FD",
              border: "2px solid #7C3AED",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} /> Draw Again
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.3); border-radius:4px; }
      `}</style>
    </div>
  );
}
