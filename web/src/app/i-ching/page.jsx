"use client";
import { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Save,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  HEXAGRAMS,
  TRIGRAMS,
  castHexagram,
  getHexagramByNumber,
} from "@/data/iching";

const STAGE_CONFIG = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
  },
};

function HexagramLine({ line, index }) {
  const isYang = line.isYang;
  const isChanging = line.isChanging;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#6B7280",
          width: 14,
          textAlign: "right",
        }}
      >
        {index + 1}
      </span>
      <div
        style={{
          display: "flex",
          gap: isYang ? 0 : 8,
          width: 120,
          justifyContent: "center",
        }}
      >
        {isYang ? (
          <div
            style={{
              height: 8,
              flex: 1,
              borderRadius: 4,
              background: isChanging ? "#FBBF24" : "#E9D5FF",
              boxShadow: isChanging ? "0 0 8px rgba(251,191,36,0.4)" : "none",
            }}
          />
        ) : (
          <>
            <div
              style={{
                height: 8,
                flex: 1,
                borderRadius: 4,
                background: isChanging ? "#FBBF24" : "#E9D5FF",
                boxShadow: isChanging ? "0 0 8px rgba(251,191,36,0.4)" : "none",
              }}
            />
            <div
              style={{
                height: 8,
                flex: 1,
                borderRadius: 4,
                background: isChanging ? "#FBBF24" : "#E9D5FF",
                boxShadow: isChanging ? "0 0 8px rgba(251,191,36,0.4)" : "none",
              }}
            />
          </>
        )}
      </div>
      {isChanging && (
        <span style={{ fontSize: 10, color: "#FBBF24", fontWeight: 700 }}>
          ○
        </span>
      )}
    </div>
  );
}

function HexagramDisplay({ hex, lines, label }) {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      {label && (
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 11,
            color: "#9B7FD4",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </p>
      )}
      <h2
        style={{
          margin: "0 0 2px",
          fontSize: 28,
          fontWeight: 800,
          color: "#E9D5FF",
        }}
      >
        {hex.chinese}
      </h2>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 18,
          fontWeight: 700,
          color: "#C4B5FD",
        }}
      >
        #{hex.num} · {hex.name}
      </h3>
      {lines && (
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: 6,
            margin: "16px auto",
            maxWidth: 160,
          }}
        >
          {lines.map((l, i) => (
            <HexagramLine key={i} line={l} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReadingCard({ reading, onExpand, expanded }) {
  const d = new Date(reading.created_at);
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: 14,
        padding: "14px 18px",
        cursor: "pointer",
      }}
      onClick={onExpand}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>☯️</span>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#E9D5FF" }}>
              #{reading.hexagram_number} · {reading.hexagram_name}
            </span>
            {reading.relating_hexagram_name && (
              <span style={{ fontSize: 12, color: "#9B7FD4", marginLeft: 8 }}>
                → #{reading.relating_hexagram_number}
              </span>
            )}
            {reading.question && (
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  color: "#9B7FD4",
                  fontStyle: "italic",
                }}
              >
                {reading.question}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#6B7280" }}>{dateStr}</span>
          {expanded ? (
            <ChevronUp size={14} color="#6B7280" />
          ) : (
            <ChevronDown size={14} color="#6B7280" />
          )}
        </div>
      </div>
      {expanded && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid rgba(139,92,246,0.1)",
          }}
        >
          {reading.notes && (
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                color: "#D1D5DB",
                lineHeight: 1.6,
              }}
            >
              {reading.notes}
            </p>
          )}
          {reading.changing_lines?.length > 0 && (
            <p style={{ margin: 0, fontSize: 12, color: "#FBBF24" }}>
              Changing lines: {reading.changing_lines.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function IChingPage() {
  const [casting, setCasting] = useState(null);
  const [question, setQuestion] = useState("");
  const [isCasting, setIsCasting] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pastReadings, setPastReadings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);

  const loadPast = useCallback(async () => {
    setLoadingJournal(true);
    try {
      const res = await fetch("/api/iching?userId=anonymous&limit=20");
      if (res.ok) {
        const data = await res.json();
        setPastReadings(data.readings || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingJournal(false);
  }, []);

  useEffect(() => {
    loadPast();
  }, [loadPast]);

  const doCast = () => {
    setIsCasting(true);
    setSaved(false);
    setNotes("");
    setTimeout(() => {
      const result = castHexagram();
      setCasting(result);
      setIsCasting(false);
    }, 1200);
  };

  const saveReading = async () => {
    if (!casting || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/iching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          question: question.trim() || null,
          hexagramNumber: casting.primary.num,
          hexagramName: casting.primary.name,
          relatingHexagramNumber: casting.relating?.num || null,
          relatingHexagramName: casting.relating?.name || null,
          changingLines: casting.changingLineNumbers,
          linesData: casting.lines,
          notes: notes.trim() || null,
          symbolId: casting.primary.symbolId,
        }),
      });
      if (res.ok) {
        setSaved(true);
        loadPast();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const resetCasting = () => {
    setCasting(null);
    setQuestion("");
    setNotes("");
    setSaved(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0614",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(180deg,rgba(76,29,149,0.45),transparent)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          padding: "20px 24px 16px",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
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
              style={{ fontSize: 13, color: "#9B7FD4", textDecoration: "none" }}
            >
              ← Archive
            </a>
            <span style={{ color: "#374151" }}>·</span>
            <span style={{ fontSize: 13, color: "#C4B5FD", fontWeight: 600 }}>
              I‑Ching
            </span>
          </div>
          <h1
            style={{
              margin: "0 0 2px",
              fontSize: 22,
              fontWeight: 800,
              color: "#E9D5FF",
            }}
          >
            ☯️ I‑Ching Oracle
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
            Cast the coins. Receive the hexagram. Reflect on the way.
          </p>
        </div>
      </div>

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 80px" }}
      >
        {/* No casting yet — show cast UI */}
        {!casting && !isCasting && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Question */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: 18,
                padding: 24,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: "#9B7FD4",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Your Question (optional)
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What situation do you seek guidance on?"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: 12,
                  color: "#E9D5FF",
                  fontSize: 15,
                  lineHeight: 1.6,
                  resize: "vertical",
                  minHeight: 80,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={doCast}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                ☯️ Cast the Coins
              </button>
            </div>

            {/* Journal toggle */}
            <button
              onClick={() => setShowJournal(!showJournal)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                borderRadius: 12,
                background: showJournal
                  ? "rgba(124,58,237,0.15)"
                  : "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#C4B5FD",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <BookOpen size={16} /> Past Readings ({pastReadings.length})
            </button>

            {showJournal && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {loadingJournal ? (
                  <p
                    style={{
                      color: "#9B7FD4",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Loading…
                  </p>
                ) : pastReadings.length === 0 ? (
                  <p
                    style={{
                      color: "#9B7FD4",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No readings yet. Cast your first hexagram above.
                  </p>
                ) : (
                  pastReadings.map((r) => (
                    <ReadingCard
                      key={r.id}
                      reading={r}
                      expanded={expandedId === r.id}
                      onExpand={() =>
                        setExpandedId(expandedId === r.id ? null : r.id)
                      }
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Casting animation */}
        {isCasting && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>☯️</div>
            <p style={{ color: "#C4B5FD", fontSize: 16, fontWeight: 600 }}>
              Casting the coins…
            </p>
            <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
              Three coins, six times. The hexagram forms.
            </p>
          </div>
        )}

        {/* Result */}
        {casting && !isCasting && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Question echo */}
            {question.trim() && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#9B7FD4",
                    fontStyle: "italic",
                  }}
                >
                  "{question.trim()}"
                </p>
              </div>
            )}

            {/* Primary hexagram */}
            <div
              style={{
                background: "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.25)",
                borderRadius: 20,
                padding: "24px 20px",
              }}
            >
              <HexagramDisplay
                hex={casting.primary}
                lines={casting.lines}
                label="Primary Hexagram"
              />

              {/* Trigrams */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  marginBottom: 16,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 10,
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Upper
                  </p>
                  <span style={{ fontSize: 20 }}>
                    {casting.upperTrigram?.symbol}
                  </span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 11,
                      color: "#C4B5FD",
                    }}
                  >
                    {casting.upperTrigram?.quality}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 10,
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Lower
                  </p>
                  <span style={{ fontSize: 20 }}>
                    {casting.lowerTrigram?.symbol}
                  </span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 11,
                      color: "#C4B5FD",
                    }}
                  >
                    {casting.lowerTrigram?.quality}
                  </p>
                </div>
              </div>

              {/* Judgment */}
              <div
                style={{
                  borderTop: "1px solid rgba(139,92,246,0.15)",
                  paddingTop: 16,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 10,
                    color: "#9B7FD4",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  The Judgment
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#E9D5FF",
                    fontSize: 15,
                    lineHeight: 1.8,
                    fontStyle: "italic",
                  }}
                >
                  {casting.primary.judgment}
                </p>
              </div>

              {/* Image */}
              <div
                style={{
                  borderTop: "1px solid rgba(139,92,246,0.15)",
                  paddingTop: 16,
                  marginTop: 16,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 10,
                    color: "#9B7FD4",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  The Image
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#D1D5DB",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {casting.primary.image}
                </p>
              </div>

              {/* Keywords */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 16,
                  justifyContent: "center",
                }}
              >
                {casting.primary.keywords.map((k, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 16,
                      background: "rgba(167,139,250,0.1)",
                      border: "1px solid rgba(167,139,250,0.2)",
                      color: "#C4B5FD",
                      fontSize: 12,
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Changing lines */}
            {casting.hasChanging && (
              <div
                style={{
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔄</span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24" }}
                  >
                    Changing Lines: {casting.changingLineNumbers.join(", ")}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#D1D5DB",
                    lineHeight: 1.6,
                  }}
                >
                  The changing lines indicate movement from the current
                  situation toward a new one. The primary hexagram shows where
                  you are; the relating hexagram shows where things are headed.
                </p>
              </div>
            )}

            {/* Relating hexagram */}
            {casting.relating && (
              <div
                style={{
                  background: "rgba(96,165,250,0.08)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  borderRadius: 20,
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 11,
                    color: "#60A5FA",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    textAlign: "center",
                  }}
                >
                  Relating Hexagram (where this leads)
                </p>
                <h3
                  style={{
                    margin: "0 0 8px",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#E9D5FF",
                  }}
                >
                  {casting.relating.chinese} #{casting.relating.num} ·{" "}
                  {casting.relating.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#93C5FD",
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {casting.relating.judgment}
                </p>
              </div>
            )}

            {/* Notes + Save */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: "#9B7FD4",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Your Reflection
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What does this hexagram stir in you?"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: 10,
                  color: "#E9D5FF",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "vertical",
                  minHeight: 70,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  onClick={resetCasting}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    background: "transparent",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#9B7FD4",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <RotateCcw size={14} /> Cast Again
                </button>
                <button
                  onClick={saveReading}
                  disabled={saving || saved}
                  style={{
                    flex: 2,
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    background: saved
                      ? "rgba(52,211,153,0.2)"
                      : "linear-gradient(135deg,#4F46E5,#7C3AED)",
                    color: saved ? "#34D399" : "#fff",
                    border: "none",
                    cursor: saved ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Save size={14} />{" "}
                  {saved ? "Saved ✓" : saving ? "Saving…" : "Save Reading"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
