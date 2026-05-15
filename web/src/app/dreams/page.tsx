"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Moon,
  Search,
  X,
  Sparkles,
  Eye,
  BarChart3,
  Repeat,
} from "lucide-react";
import {
  DREAM_SYMBOLS,
  DREAM_MOODS,
  detectDreamSymbols,
} from "@/data/dream-symbols";

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

function LogDreamModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamDate, setDreamDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [mood, setMood] = useState(null);
  const [lucidity, setLucidity] = useState(1);
  const [recurring, setRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const detected = useMemo(
    () => detectDreamSymbols(title + " " + description),
    [title, description],
  );

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          title: title.trim(),
          description: description.trim() || null,
          dreamDate,
          mood,
          lucidity,
          recurring,
          symbolsDetected: detected,
        }),
      });
      if (res.ok) onSave();
      else onClose();
    } catch {
      onClose();
    }
    setSaving(false);
  };

  const lucidityLabel =
    ["", "Foggy", "Normal", "Clear", "Vivid", "Lucid"][lucidity] || "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1C1332",
          border: "1px solid rgba(139,92,246,0.35)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 560,
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#E9D5FF",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Log a Dream
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
              Capture it before it fades.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} color="#9B7FD4" />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 11,
              color: "#9B7FD4",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Dream Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The river at the edge of the forest"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10,
              color: "#E9D5FF",
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 11,
              color: "#9B7FD4",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe everything you remember…"
            style={{
              width: "100%",
              marginTop: 6,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10,
              color: "#E9D5FF",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              minHeight: 100,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Live symbol detection */}
        {detected.length > 0 && (
          <div
            style={{
              marginBottom: 14,
              padding: 14,
              background: "rgba(167,139,250,0.06)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Sparkles size={13} style={{ color: "#A78BFA" }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#C4B5FD",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Symbols Detected ({detected.length})
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {detected.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 8,
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.2)",
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#C4B5FD" }}
                  >
                    {s.symbol}
                  </span>
                  <span style={{ fontSize: 10, color: "#9B7FD4" }}>
                    ({s.keyword})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date + Lucidity + Recurring */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                color: "#9B7FD4",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Date
            </label>
            <input
              type="date"
              value={dreamDate}
              onChange={(e) => setDreamDate(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 10,
                color: "#E9D5FF",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                color: "#9B7FD4",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Lucidity ({lucidityLabel})
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={lucidity}
              onChange={(e) => setLucidity(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: 12, accentColor: "#7C3AED" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              minWidth: 64,
            }}
          >
            <label
              style={{
                fontSize: 11,
                color: "#9B7FD4",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Recurring?
            </label>
            <button
              onClick={() => setRecurring(!recurring)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 4,
                background: recurring
                  ? "rgba(248,113,113,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${recurring ? "rgba(248,113,113,0.3)" : "rgba(139,92,246,0.15)"}`,
                color: recurring ? "#F87171" : "#6B7280",
              }}
            >
              {recurring ? "Yes 🔄" : "No"}
            </button>
          </div>
        </div>

        {/* Mood */}
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
            Dream Mood
          </label>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {DREAM_MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(mood === m.id ? null : m.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 18,
                  cursor: "pointer",
                  fontSize: 12,
                  background:
                    mood === m.id ? `${m.color}20` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${mood === m.id ? m.color : "rgba(139,92,246,0.12)"}`,
                  color: mood === m.id ? m.color : "#6B7280",
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              background: "transparent",
              color: "#9B7FD4",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 12,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            style={{
              flex: 2,
              padding: 12,
              background: title.trim()
                ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                : "rgba(124,58,237,0.2)",
              color: title.trim() ? "#fff" : "#6B7280",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Log Dream"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DreamsPage() {
  const [dreams, setDreams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [expandedDream, setExpandedDream] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dreams?userId=anonymous");
      if (res.ok) {
        const data = await res.json();
        setDreams(data.dreams || []);
        setStats(data.stats || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return dreams;
    const q = search.toLowerCase();
    return dreams.filter(
      (d) =>
        (d.title || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q),
    );
  }, [dreams, search]);

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
              Dreams
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 2px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#E9D5FF",
                }}
              >
                😴 Dream Journal
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                Track your dreams and discover the symbols within.
              </p>
            </div>
            <button
              onClick={() => setShowLog(true)}
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
              <Plus size={14} /> Log Dream
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 80px" }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#9B7FD4" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
            <p>Loading dreams…</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats */}
            {stats && stats.totalDreams > 0 && (
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#C4B5FD",
                    }}
                  >
                    {stats.totalDreams}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Dreams
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#F87171",
                    }}
                  >
                    {stats.recurringCount}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Recurring
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#FBBF24",
                    }}
                  >
                    {stats.topSymbols?.length || 0}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Symbols
                  </p>
                </div>
              </div>
            )}

            {/* Top symbols */}
            {stats?.topSymbols?.length > 0 && (
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
                    marginBottom: 12,
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
                    Most Frequent Dream Symbols
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {stats.topSymbols.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 10,
                        background: "rgba(167,139,250,0.06)",
                        border: "1px solid rgba(167,139,250,0.15)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#C4B5FD",
                        }}
                      >
                        {s.symbol}
                      </span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>
                        {s.count}×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood distribution */}
            {stats?.moodCounts && Object.keys(stats.moodCounts).length > 0 && (
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
                    marginBottom: 12,
                  }}
                >
                  <BarChart3 size={15} style={{ color: "#A78BFA" }} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C4B5FD",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Dream Moods
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(stats.moodCounts).map(([moodId, count]) => {
                    const m = DREAM_MOODS.find((dm) => dm.id === moodId);
                    if (!m) return null;
                    return (
                      <div
                        key={moodId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 10px",
                          borderRadius: 10,
                          background: `${m.color}10`,
                          border: `1px solid ${m.color}30`,
                        }}
                      >
                        <span>{m.emoji}</span>
                        <span
                          style={{
                            fontSize: 12,
                            color: m.color,
                            fontWeight: 600,
                          }}
                        >
                          {m.label}
                        </span>
                        <span style={{ fontSize: 11, color: "#6B7280" }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: 12,
                  color: "#6B7280",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dreams…"
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: 12,
                  color: "#E9D5FF",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Dream list */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌙</div>
                <h3
                  style={{ margin: "0 0 8px", color: "#E9D5FF", fontSize: 18 }}
                >
                  {search ? "No matching dreams" : "Your dream journal awaits"}
                </h3>
                <p style={{ margin: 0, color: "#9B7FD4", fontSize: 14 }}>
                  {search
                    ? "Try a different search term."
                    : "Log your first dream to start discovering symbols in your sleep."}
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {filtered.map((dream) => {
                  const isOpen = expandedDream === dream.id;
                  const d = new Date(dream.dream_date);
                  const dateStr = d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const moodData = DREAM_MOODS.find((m) => m.id === dream.mood);
                  const symbols = dream.symbols_detected || [];
                  const lucLabels = [
                    "",
                    "Foggy",
                    "Normal",
                    "Clear",
                    "Vivid",
                    "Lucid",
                  ];
                  const lucLabel = lucLabels[dream.lucidity] || "";

                  return (
                    <div
                      key={dream.id}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(139,92,246,0.15)",
                        borderRadius: 16,
                        overflow: "hidden",
                        borderLeft: dream.recurring
                          ? "4px solid #F87171"
                          : undefined,
                      }}
                    >
                      <div
                        onClick={() =>
                          setExpandedDream(isOpen ? null : dream.id)
                        }
                        style={{ padding: "14px 18px", cursor: "pointer" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {moodData && (
                              <span style={{ fontSize: 20 }}>
                                {moodData.emoji}
                              </span>
                            )}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#E9D5FF",
                                  }}
                                >
                                  {dream.title}
                                </span>
                                {dream.recurring && (
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "#F87171",
                                      background: "rgba(248,113,113,0.1)",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                      fontWeight: 600,
                                    }}
                                  >
                                    🔄 Recurring
                                  </span>
                                )}
                                {lucLabel && (
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "#9B7FD4",
                                      background: "rgba(255,255,255,0.04)",
                                      padding: "2px 8px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    {lucLabel}
                                  </span>
                                )}
                              </div>
                              {symbols.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 4,
                                    marginTop: 4,
                                  }}
                                >
                                  {symbols.slice(0, 4).map((s, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: 11,
                                        color: "#A78BFA",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {s.symbol}
                                    </span>
                                  ))}
                                  {symbols.length > 4 && (
                                    <span
                                      style={{ fontSize: 11, color: "#6B7280" }}
                                    >
                                      +{symbols.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              flexShrink: 0,
                            }}
                          >
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      {isOpen && (
                        <div
                          style={{
                            padding: "0 18px 18px",
                            borderTop: "1px solid rgba(139,92,246,0.1)",
                          }}
                        >
                          {dream.description && (
                            <p
                              style={{
                                margin: "12px 0",
                                color: "#D1D5DB",
                                fontSize: 14,
                                lineHeight: 1.7,
                              }}
                            >
                              {dream.description}
                            </p>
                          )}

                          {symbols.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#C4B5FD",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                }}
                              >
                                Symbols Found
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                  marginTop: 8,
                                }}
                              >
                                {symbols.map((s, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      padding: "8px 12px",
                                      borderRadius: 10,
                                      background: "rgba(167,139,250,0.06)",
                                      border:
                                        "1px solid rgba(167,139,250,0.15)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#C4B5FD",
                                      }}
                                    >
                                      {s.symbol}
                                    </span>
                                    <span
                                      style={{ fontSize: 12, color: "#9B7FD4" }}
                                    >
                                      "{s.keyword}"
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: "#6B7280",
                                        flex: 1,
                                      }}
                                    >
                                      {s.meaning}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showLog && (
        <LogDreamModal
          onClose={() => setShowLog(false)}
          onSave={() => {
            setShowLog(false);
            load();
          }}
        />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
