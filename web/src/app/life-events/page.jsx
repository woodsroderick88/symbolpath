"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Calendar, Filter, X, Trash2 } from "lucide-react";

const STAGE_CONFIG = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
    emoji: "🌅",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    emoji: "🌿",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    emoji: "⛈️",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
    emoji: "🧭",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    emoji: "👑",
  },
};
const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];

const CATEGORIES = [
  { id: "all", label: "All", emoji: "✨", color: "#C4B5FD" },
  { id: "personal", label: "Personal", emoji: "🫀", color: "#F472B6" },
  { id: "career", label: "Career", emoji: "💼", color: "#60A5FA" },
  { id: "relationship", label: "Relationship", emoji: "💕", color: "#F87171" },
  { id: "spiritual", label: "Spiritual", emoji: "🕊️", color: "#A78BFA" },
  { id: "health", label: "Health", emoji: "🌿", color: "#34D399" },
  { id: "creative", label: "Creative", emoji: "🎨", color: "#FBBF24" },
];

function AddEventModal({ symbols, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [category, setCategory] = useState("personal");
  const [intensity, setIntensity] = useState(5);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [saving, setSaving] = useState(false);

  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = (symbols || []).filter((s) => s.stage === stage);
    return acc;
  }, {});

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/life-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          title: title.trim(),
          description: description.trim() || null,
          eventDate,
          category,
          intensity,
          symbolId: selectedSymbol?.id || null,
        }),
      });
      if (res.ok) onSave();
      else onClose();
    } catch {
      onClose();
    }
    setSaving(false);
  };

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
          maxWidth: 540,
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
          <h2
            style={{
              margin: 0,
              color: "#E9D5FF",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Add Life Event
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} color="#9B7FD4" />
          </button>
        </div>

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
            What happened?
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Started a creative project"
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
              When
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
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
              Intensity ({intensity}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: 12, accentColor: "#7C3AED" }}
            />
          </div>
        </div>

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
            Category
          </label>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  background:
                    category === cat.id
                      ? "rgba(124,58,237,0.3)"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${category === cat.id ? "#7C3AED" : "rgba(139,92,246,0.15)"}`,
                  color: category === cat.id ? "#C4B5FD" : "#9B7FD4",
                  fontSize: 13,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

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
            Symbol (optional)
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 8,
              maxHeight: 120,
              overflowY: "auto",
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
                      margin: "0 0 3px",
                      fontSize: 9,
                      color: sc.color,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {sc.emoji} {stage}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {stageSyms.map((sym) => (
                      <button
                        key={sym.id}
                        onClick={() =>
                          setSelectedSymbol(
                            selectedSymbol?.id === sym.id ? null : sym,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 12,
                          background:
                            selectedSymbol?.id === sym.id
                              ? sc.bg
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedSymbol?.id === sym.id ? sc.color : "rgba(139,92,246,0.1)"}`,
                          color:
                            selectedSymbol?.id === sym.id
                              ? sc.color
                              : "#6B7280",
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
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did this mean to you?"
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
              minHeight: 60,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
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
            {saving ? "Saving…" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LifeEventsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    try {
      const catParam = filter !== "all" ? `&category=${filter}` : "";
      const [evRes, symRes] = await Promise.all([
        fetch(`/api/life-events?userId=anonymous${catParam}`),
        fetch("/api/archetypes"),
      ]);
      if (evRes.ok) setData(await evRes.json());
      if (symRes.ok) {
        const symData = await symRes.json();
        setSymbols(
          Array.isArray(symData) ? symData : symData?.archetypes || [],
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/life-events?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) load();
    } catch (e) {
      console.error(e);
    }
    setDeleting(null);
  };

  const months = data?.months || {};
  const monthKeys = Object.keys(months).sort().reverse();
  const stats = data?.stats;

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
              Life Events
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
                📍 Life Events
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                Chronicle the moments that matter.
              </p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
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
              <Plus size={14} /> Add Event
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 80px" }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#9B7FD4" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
            <p>Loading events…</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats row */}
            {stats && stats.total > 0 && (
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
                    {stats.total}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Events
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
                    {stats.avgIntensity}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Avg Intensity
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(52,211,153,0.08)",
                    border: "1px solid rgba(52,211,153,0.25)",
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
                      color: "#34D399",
                    }}
                  >
                    {Object.keys(stats.categoryCounts).length}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9B7FD4" }}>
                    Categories
                  </p>
                </div>
              </div>
            )}

            {/* Stage distribution */}
            {stats?.stageCounts &&
              Object.keys(stats.stageCounts).length > 0 && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C4B5FD",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Stage Distribution
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 12,
                      height: 8,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    {STAGE_ORDER.map((stage) => {
                      const count = stats.stageCounts[stage] || 0;
                      if (!count) return null;
                      const pct = (count / stats.total) * 100;
                      const cfg = STAGE_CONFIG[stage];
                      return (
                        <div
                          key={stage}
                          title={`${stage}: ${count}`}
                          style={{
                            width: `${pct}%`,
                            background: cfg.color,
                            minWidth: 4,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 8,
                      justifyContent: "center",
                    }}
                  >
                    {STAGE_ORDER.filter((s) => stats.stageCounts[s]).map(
                      (stage) => {
                        const cfg = STAGE_CONFIG[stage];
                        return (
                          <div
                            key={stage}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: cfg.color,
                              }}
                            />
                            <span style={{ fontSize: 10, color: "#6B7280" }}>
                              {stage} ({stats.stageCounts[stage]})
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

            {/* Category filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
              }}
            >
              <Filter size={14} style={{ color: "#6B7280", flexShrink: 0 }} />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 14px",
                    borderRadius: 18,
                    cursor: "pointer",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    background:
                      filter === cat.id
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${filter === cat.id ? "#7C3AED" : "rgba(139,92,246,0.12)"}`,
                    color: filter === cat.id ? "#C4B5FD" : "#6B7280",
                    fontWeight: filter === cat.id ? 700 : 400,
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Monthly timeline */}
            {monthKeys.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                <h3
                  style={{ margin: "0 0 8px", color: "#E9D5FF", fontSize: 18 }}
                >
                  No events {filter !== "all" ? `in ${filter}` : "yet"}
                </h3>
                <p style={{ margin: 0, color: "#9B7FD4", fontSize: 14 }}>
                  Add your first life event to start chronicling your journey.
                </p>
              </div>
            ) : (
              monthKeys.map((key) => {
                const month = months[key];
                return (
                  <div key={key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background: "rgba(139,92,246,0.15)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#C4B5FD",
                        }}
                      >
                        {month.label}
                      </span>
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background: "rgba(139,92,246,0.15)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {month.items.map((ev) => {
                        const cfg = STAGE_CONFIG[ev.stage] || {
                          color: "#6B7280",
                          bg: "rgba(255,255,255,0.02)",
                          border: "rgba(139,92,246,0.12)",
                        };
                        const cat = CATEGORIES.find(
                          (c) => c.id === ev.category,
                        );
                        const d = new Date(ev.event_date);
                        const dateStr = d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });

                        return (
                          <div
                            key={ev.id}
                            style={{
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              borderRadius: 14,
                              padding: "14px 18px",
                              borderLeft: `4px solid ${cfg.color}`,
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  flex: 1,
                                }}
                              >
                                {ev.visual && (
                                  <span style={{ fontSize: 24 }}>
                                    {ev.visual}
                                  </span>
                                )}
                                <div style={{ flex: 1 }}>
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
                                      {ev.title}
                                    </span>
                                    {ev.stage && (
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: cfg.color,
                                          background: cfg.bg,
                                          padding: "2px 8px",
                                          borderRadius: 6,
                                          border: `1px solid ${cfg.border}`,
                                        }}
                                      >
                                        {ev.stage}
                                      </span>
                                    )}
                                    {cat && (
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: cat.color,
                                        }}
                                      >
                                        {cat.emoji}
                                      </span>
                                    )}
                                  </div>
                                  {ev.description && (
                                    <p
                                      style={{
                                        margin: "4px 0 0",
                                        fontSize: 12,
                                        color: "#9B7FD4",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {ev.description}
                                    </p>
                                  )}

                                  {/* Reflection prompts */}
                                  {ev.reflection_prompts?.length > 0 && (
                                    <div
                                      style={{
                                        marginTop: 8,
                                        padding: 10,
                                        background: "rgba(167,139,250,0.04)",
                                        borderRadius: 8,
                                        borderLeft: "2px solid #7C3AED",
                                      }}
                                    >
                                      <p
                                        style={{
                                          margin: 0,
                                          fontSize: 12,
                                          color: "#E9D5FF",
                                          fontStyle: "italic",
                                          lineHeight: 1.5,
                                        }}
                                      >
                                        {ev.reflection_prompts[0]}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-end",
                                  gap: 6,
                                  flexShrink: 0,
                                }}
                              >
                                <span
                                  style={{ fontSize: 12, color: "#6B7280" }}
                                >
                                  {dateStr}
                                </span>
                                {ev.intensity && (
                                  <div style={{ display: "flex", gap: 1 }}>
                                    {Array.from({ length: 10 }, (_, j) => (
                                      <div
                                        key={j}
                                        style={{
                                          width: 3,
                                          height: 8,
                                          borderRadius: 1,
                                          background:
                                            j < ev.intensity
                                              ? cfg.color
                                              : "rgba(255,255,255,0.06)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                                <button
                                  onClick={() => handleDelete(ev.id)}
                                  disabled={deleting === ev.id}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 4,
                                    opacity: 0.5,
                                  }}
                                >
                                  <Trash2 size={12} color="#F87171" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <AddEventModal
          symbols={symbols}
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
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
