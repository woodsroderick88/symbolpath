import { useState, useEffect, useMemo } from "react";
import {
  Brain,
  ChevronLeft,
  Trash2,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  MinusCircle,
  Sparkles,
  BookOpen,
  Flame,
  Target,
  Lightbulb,
  PenLine,
} from "lucide-react";
import { EMOTIONS, DEFENSE_MECHANISMS, getDailyEmotion } from "@/data/emotions";
import { tarotCards } from "@/data/tarot-cards";

const CONSEQUENCES = [
  "Positive if repeated",
  "Neutral",
  "Negative if repeated",
];

export default function DecisionMirrorPage() {
  const [decisions, setDecisions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("reflect");

  const dailyEmotion = useMemo(() => getDailyEmotion(), []);
  const dailyTarot = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000,
    );
    return tarotCards[dayOfYear % tarotCards.length];
  }, []);

  const [situation, setSituation] = useState("");
  const [emotion, setEmotion] = useState(dailyEmotion.name);
  const [defense, setDefense] = useState("None");
  const [consequence, setConsequence] = useState("Neutral");
  const [decisionTaken, setDecisionTaken] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [internalState, setInternalState] = useState("");
  const [actionResult, setActionResult] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [microAction, setMicroAction] = useState("");
  const [journalReflection, setJournalReflection] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRes, iRes] = await Promise.all([
        fetch("/api/decisions?userId=anonymous"),
        fetch("/api/decisions/insights?userId=anonymous"),
      ]);
      if (!dRes.ok || !iRes.ok) throw new Error("Failed");
      setDecisions(await dRes.json());
      setInsights(await iRes.json());
    } catch (err) {
      console.error(err);
      setError("Could not load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!situation.trim() || !decisionTaken.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          emotion,
          defense,
          consequence,
          decisionTaken,
          triggerEvent: triggerEvent || null,
          internalState: internalState || null,
          actionResult: actionResult || null,
          newResponse: newResponse || null,
          microAction: microAction || null,
          journalReflection: journalReflection || null,
          userId: "anonymous",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSituation("");
      setEmotion(dailyEmotion.name);
      setDefense("None");
      setConsequence("Neutral");
      setDecisionTaken("");
      setTriggerEvent("");
      setInternalState("");
      setActionResult("");
      setNewResponse("");
      setMicroAction("");
      setJournalReflection("");
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/decisions/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const getDefenseColor = (d) => (d === "None" ? "#34D399" : "#FBBF24");
  const getConsequenceIcon = (c) => {
    if (c === "Positive if repeated")
      return <CheckCircle size={14} style={{ color: "#34D399" }} />;
    if (c === "Negative if repeated")
      return <XCircle size={14} style={{ color: "#F87171" }} />;
    return <MinusCircle size={14} style={{ color: "#9CA3AF" }} />;
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(15,10,30,0.8)",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#E9D5FF",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    fontSize: 13,
    color: "#C4B5FD",
    marginBottom: 6,
    fontWeight: 600,
  };
  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
  };

  const sectionTabs = [
    { id: "reflect", icon: <Sparkles size={16} />, label: "Daily Reflection" },
    { id: "pattern", icon: <Target size={16} />, label: "Pattern Mapping" },
    { id: "defense", icon: <Shield size={16} />, label: "Defense Check" },
    {
      id: "redesign",
      icon: <Lightbulb size={16} />,
      label: "Behavior Redesign",
    },
    { id: "journal", icon: <PenLine size={16} />, label: "Reflection" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9B7FD4",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <ChevronLeft size={15} /> Back to Home
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 8,
          }}
        >
          <Brain size={36} style={{ color: "#A78BFA" }} />
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              Inner Pattern Lab
            </h1>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 14 }}>
              Decision Mirror + Pattern Analysis + Behavior Redesign
            </p>
          </div>
        </div>

        {insights && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 12,
              margin: "28px 0",
            }}
          >
            {[
              {
                value: insights.total,
                label: "Entries",
                bg: "rgba(139,92,246,0.1)",
                border: "rgba(139,92,246,0.25)",
                color: "#C4B5FD",
              },
              {
                value: insights.streak,
                label: "Streak",
                bg: "rgba(52,211,153,0.08)",
                border: "rgba(52,211,153,0.25)",
                color: "#34D399",
              },
              {
                value: insights.aligned,
                label: "Aligned",
                bg: "rgba(52,211,153,0.08)",
                border: "rgba(52,211,153,0.25)",
                color: "#34D399",
              },
              {
                value: insights.distorted,
                label: "Distorted",
                bg: "rgba(251,191,36,0.08)",
                border: "rgba(251,191,36,0.25)",
                color: "#FBBF24",
              },
              {
                value: insights.topDefense || "None",
                label: "Top Distortion",
                bg: "rgba(248,113,113,0.08)",
                border: "rgba(248,113,113,0.25)",
                color: "#F87171",
                isText: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  borderRadius: 14,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: stat.isText ? 16 : 28,
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    color: stat.color,
                    opacity: 0.8,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 20,
                border: "none",
                fontSize: 13,
                fontWeight: activeSection === tab.id ? 700 : 500,
                cursor: "pointer",
                background:
                  activeSection === tab.id
                    ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                    : "rgba(139,92,246,0.1)",
                color: activeSection === tab.id ? "#fff" : "#9B7FD4",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeSection === "reflect" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Sparkles size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Daily Reflection Engine
              </h2>
            </div>
            <div
              style={{
                background: "rgba(124,58,237,0.1)",
                borderRadius: 14,
                padding: 18,
                border: "1px solid rgba(139,92,246,0.2)",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#9B7FD4",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Today's Tarot Symbol
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#C4B5FD",
                }}
              >
                {dailyTarot.name}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "#D1D5DB",
                  lineHeight: 1.6,
                }}
              >
                {dailyTarot.upright.meaning}
              </p>
            </div>
            <div
              style={{
                background:
                  dailyEmotion.category === "shadow"
                    ? "rgba(248,113,113,0.08)"
                    : "rgba(52,211,153,0.08)",
                borderRadius: 14,
                padding: 18,
                border: `1px solid ${dailyEmotion.category === "shadow" ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.2)"}`,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#9B7FD4",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Today's Emotion
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 22,
                  fontWeight: 700,
                  color:
                    dailyEmotion.category === "shadow" ? "#F87171" : "#34D399",
                }}
              >
                {dailyEmotion.name}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "#D1D5DB",
                  fontStyle: "italic",
                }}
              >
                Root Meaning: {dailyEmotion.root}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Situation</label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="Describe what happened..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Emotion</label>
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {EMOTIONS.map((e) => (
                      <option key={e.name} value={e.name}>
                        {e.name} — {e.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Reality Check</label>
                  <select
                    value={consequence}
                    onChange={(e) => setConsequence(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {CONSEQUENCES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Decision Taken</label>
                <input
                  type="text"
                  value={decisionTaken}
                  onChange={(e) => setDecisionTaken(e.target.value)}
                  placeholder="What did you decide?"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "pattern" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Target size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Pattern Mapping
              </h2>
            </div>
            <p
              style={{
                color: "#9B7FD4",
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              Map the chain: Trigger → Internal State → Action → Result.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Trigger</label>
                <input
                  type="text"
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  placeholder="What activated the response?"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Internal State</label>
                <input
                  type="text"
                  value={internalState}
                  onChange={(e) => setInternalState(e.target.value)}
                  placeholder="What did you feel inside?"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Result</label>
                <input
                  type="text"
                  value={actionResult}
                  onChange={(e) => setActionResult(e.target.value)}
                  placeholder="What was the outcome?"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "defense" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Shield size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Defense Mechanism Check
              </h2>
            </div>
            <p
              style={{
                color: "#9B7FD4",
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              Honestly identify if a defense mechanism influenced this decision.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 10,
              }}
            >
              {DEFENSE_MECHANISMS.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => setDefense(dm.name)}
                  style={{
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 12,
                    cursor: "pointer",
                    background:
                      defense === dm.name
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.02)",
                    border: `2px solid ${defense === dm.name ? "#7C3AED" : "rgba(139,92,246,0.15)"}`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: defense === dm.name ? "#C4B5FD" : "#D1D5DB",
                    }}
                  >
                    {dm.name}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 11,
                      color: "#9B7FD4",
                      lineHeight: 1.5,
                    }}
                  >
                    {dm.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === "redesign" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Lightbulb size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Behavior Redesign
              </h2>
            </div>
            <p
              style={{
                color: "#9B7FD4",
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              If you could respond differently next time, what would you do?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>New Response</label>
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="How would you respond differently?"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <div>
                <label style={labelStyle}>Micro Action (smallest step)</label>
                <input
                  type="text"
                  value={microAction}
                  onChange={(e) => setMicroAction(e.target.value)}
                  placeholder="e.g. pause and breathe for 5 seconds"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "journal" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <PenLine size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Reflection Writing
              </h2>
            </div>
            <textarea
              value={journalReflection}
              onChange={(e) => setJournalReflection(e.target.value)}
              placeholder="Write freely about what you've noticed..."
              rows={8}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
            />
          </div>
        )}

        <div
          style={{
            ...cardStyle,
            padding: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          {error && (
            <p style={{ color: "#F87171", fontSize: 13, margin: 0 }}>{error}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !situation.trim() || !decisionTaken.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 32px",
              background:
                !situation.trim() || !decisionTaken.trim()
                  ? "#2D1F5E"
                  : "linear-gradient(135deg,#4F46E5,#7C3AED)",
              color:
                !situation.trim() || !decisionTaken.trim() ? "#6B7280" : "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor:
                !situation.trim() || !decisionTaken.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <Flame size={16} />
            {saving ? "Saving…" : "Save Reflection"}
          </button>
        </div>

        {insights && (insights.topEmotion || insights.topDefense) && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <TrendingUp size={20} style={{ color: "#A78BFA" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Pattern Insights
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {insights.topEmotion && (
                <div
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: "#9B7FD4" }}>
                    Most frequent emotion
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#C4B5FD",
                    }}
                  >
                    {insights.topEmotion}
                  </p>
                </div>
              )}
              {insights.topDefense && (
                <div
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid rgba(251,191,36,0.2)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: "#FCD34D" }}>
                    Top defense mechanism
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#FBBF24",
                    }}
                  >
                    {insights.topDefense}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <BookOpen size={20} style={{ color: "#A78BFA" }} />
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              Reflection History
            </h2>
          </div>
          {loading && (
            <p style={{ color: "#9B7FD4", fontSize: 14, fontStyle: "italic" }}>
              Loading…
            </p>
          )}
          {!loading && decisions.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Brain size={48} style={{ color: "#4B5563" }} />
              <p style={{ color: "#6B7280", fontSize: 14, marginTop: 12 }}>
                No reflections yet. Start above.
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {decisions.map((d) => (
              <div
                key={d.id}
                style={{
                  background: "rgba(15,10,30,0.5)",
                  borderRadius: 14,
                  padding: 18,
                  border: `1px solid ${d.defense === "None" ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#E9D5FF",
                      flex: 1,
                    }}
                  >
                    {d.situation}
                  </p>
                  <button
                    onClick={() => handleDelete(d.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={14} style={{ color: "#6B7280" }} />
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(124,58,237,0.2)",
                      color: "#C4B5FD",
                      fontWeight: 500,
                    }}
                  >
                    {d.emotion}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${getDefenseColor(d.defense)}20`,
                      color: getDefenseColor(d.defense),
                      fontWeight: 500,
                    }}
                  >
                    {d.defense}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(156,163,175,0.15)",
                      color: "#D1D5DB",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {getConsequenceIcon(d.consequence)}
                    {d.consequence}
                  </span>
                </div>
                <p
                  style={{ margin: "0 0 6px", fontSize: 14, color: "#D1D5DB" }}
                >
                  <strong style={{ color: "#C4B5FD" }}>Decision:</strong>{" "}
                  {d.decision_taken}
                </p>
                {d.trigger_event && (
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 12,
                      color: "#9B7FD4",
                    }}
                  >
                    <strong>Trigger:</strong> {d.trigger_event}
                  </p>
                )}
                {d.new_response && (
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 12,
                      color: "#6EE7B7",
                    }}
                  >
                    <strong>New Response:</strong> {d.new_response}
                  </p>
                )}
                {d.micro_action && (
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 12,
                      color: "#A78BFA",
                    }}
                  >
                    <strong>Micro Action:</strong> {d.micro_action}
                  </p>
                )}
                {d.journal_reflection && (
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 12,
                      color: "#D1D5DB",
                      fontStyle: "italic",
                    }}
                  >
                    "{d.journal_reflection.substring(0, 120)}
                    {d.journal_reflection.length > 120 ? "…" : ""}"
                  </p>
                )}
                <p
                  style={{ margin: "6px 0 0", fontSize: 11, color: "#6B7280" }}
                >
                  {new Date(d.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
