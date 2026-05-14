"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  MessageCircle,
  Plus,
  TrendingUp,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Send,
  Lock,
  Globe,
  Copy,
  LogIn,
  BookOpen,
  Star,
  Wand2,
  UserCheck,
  Layers,
  ArrowRight,
  Shield,
} from "lucide-react";

const DARK = "#0F0A1E";
const CARD_BG = "rgba(255,255,255,0.03)";
const BORDER = "rgba(139,92,246,0.25)";
const BORDER_ACTIVE = "#7C3AED";
const TEXT = "#E9D5FF";
const MUTED = "#9B7FD4";
const DIM = "#6B7280";

const TAROT_IMAGES = (() => {
  const B = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  return {
    the_fool: `${B}RWS_Tarot_00_Fool.jpg`,
    the_magician: `${B}RWS_Tarot_01_Magician.jpg`,
    the_high_priestess: `${B}RWS_Tarot_02_High_Priestess.jpg`,
    the_empress: `${B}RWS_Tarot_03_Empress.jpg`,
    the_emperor: `${B}RWS_Tarot_04_Emperor.jpg`,
    the_hierophant: `${B}RWS_Tarot_05_Hierophant.jpg`,
    the_lovers: `${B}RWS_Tarot_06_Lovers.jpg`,
    the_chariot: `${B}RWS_Tarot_07_Chariot.jpg`,
    strength: `${B}RWS_Tarot_08_Strength.jpg`,
    the_hermit: `${B}RWS_Tarot_09_Hermit.jpg`,
    wheel_of_fortune: `${B}RWS_Tarot_10_Wheel_of_Fortune.jpg`,
    justice: `${B}RWS_Tarot_11_Justice.jpg`,
    the_hanged_man: `${B}RWS_Tarot_12_Hanged_Man.jpg`,
    death: `${B}RWS_Tarot_13_Death.jpg`,
    temperance: `${B}RWS_Tarot_14_Temperance.jpg`,
    the_devil: `${B}RWS_Tarot_15_Devil.jpg`,
    the_tower: `${B}RWS_Tarot_16_Tower.jpg`,
    the_star: `${B}RWS_Tarot_17_Star.jpg`,
    the_moon: `${B}RWS_Tarot_18_Moon.jpg`,
    the_sun: `${B}RWS_Tarot_19_Sun.jpg`,
    judgement: `${B}RWS_Tarot_20_Judgement.jpg`,
    the_world: `${B}RWS_Tarot_21_World.jpg`,
    ace_of_wands: `${B}Wands01.jpg`,
    ace_of_cups: `${B}Cups01.jpg`,
    ace_of_swords: `${B}Swords01.jpg`,
    ace_of_pentacles: `${B}Pents01.jpg`,
  };
})();

// ── Shared helpers ────────────────────────────────────────────────────────────
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  rows = 3,
}) {
  const base = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "10px 14px",
    color: TEXT,
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    outline: "none",
    resize: "vertical",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: MUTED,
            marginBottom: 6,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={base}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

function PurpleBtn({ children, onClick, disabled, small, outline, full }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: small ? "7px 14px" : "11px 20px",
        width: full ? "100%" : "auto",
        background: outline
          ? "transparent"
          : disabled
            ? "rgba(124,58,237,0.25)"
            : "linear-gradient(135deg,#4F46E5,#7C3AED)",
        color: disabled ? DIM : outline ? "#C4B5FD" : "#fff",
        border: outline ? `1px solid ${BORDER_ACTIVE}` : "none",
        borderRadius: 10,
        fontSize: small ? 13 : 14,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow:
          outline || disabled ? "none" : "0 4px 16px rgba(124,58,237,0.3)",
        justifyContent: full ? "center" : "flex-start",
      }}
    >
      {children}
    </button>
  );
}

function CardShell({ children, highlight }) {
  return (
    <div
      style={{
        background: CARD_BG,
        borderRadius: 16,
        border: `1px solid ${highlight ? BORDER_ACTIVE : BORDER}`,
        padding: 20,
        marginBottom: 14,
        transition: "border-color 0.2s",
      }}
    >
      {children}
    </div>
  );
}

function MiniCardStrip({ cards }) {
  const shown = (cards || []).slice(0, 4);
  return (
    <div style={{ display: "flex", gap: 0 }}>
      {shown.map((c, i) => (
        <div
          key={i}
          style={{
            width: 28,
            height: 44,
            borderRadius: 5,
            overflow: "hidden",
            marginLeft: i > 0 ? -8 : 0,
            border: "1px solid rgba(139,92,246,0.35)",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src={TAROT_IMAGES[c.card?.id] || TAROT_IMAGES.the_fool}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: c.isReversed ? "rotate(180deg)" : "none",
            }}
          />
        </div>
      ))}
      {(cards || []).length > 4 && (
        <div
          style={{
            width: 28,
            height: 44,
            borderRadius: 5,
            marginLeft: -8,
            background: "rgba(124,58,237,0.3)",
            border: "1px solid rgba(139,92,246,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "#C4B5FD",
            fontWeight: 700,
          }}
        >
          +{(cards || []).length - 4}
        </div>
      )}
    </div>
  );
}

// ── TAB: FEED ─────────────────────────────────────────────────────────────────
function FeedTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    spread_name: "",
    interpretation: "",
    user_name: "",
  });
  const [expandedId, setExpandedId] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: () => fetch("/api/community/posts").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-posts"] });
      setShowForm(false);
      setForm({ spread_name: "", interpretation: "", user_name: "" });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`/api/community/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upvote: true }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community-posts"] }),
  });

  const handleSubmit = () => {
    if (!form.spread_name) return;
    createMutation.mutate({
      spread_id: "community",
      spread_name: form.spread_name,
      cards: [],
      interpretation: form.interpretation,
      user_name: form.user_name || "Anonymous",
    });
  };

  return (
    <div>
      {/* New Post toggle */}
      <div style={{ marginBottom: 20 }}>
        <PurpleBtn onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Share a Reading"}
        </PurpleBtn>
      </div>

      {showForm && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Share Your Reading
          </p>
          <Input
            label="YOUR NAME"
            value={form.user_name}
            onChange={(v) => setForm((f) => ({ ...f, user_name: v }))}
            placeholder="Anonymous"
          />
          <Input
            label="SPREAD NAME"
            value={form.spread_name}
            onChange={(v) => setForm((f) => ({ ...f, spread_name: v }))}
            placeholder="e.g. Three-Card Spread"
          />
          <Input
            label="YOUR INTERPRETATION"
            value={form.interpretation}
            onChange={(v) => setForm((f) => ({ ...f, interpretation: v }))}
            placeholder="What did the cards reveal to you?"
            multiline
            rows={4}
          />
          <PurpleBtn
            onClick={handleSubmit}
            disabled={!form.spread_name || createMutation.isPending}
            full
          >
            <Send size={14} />{" "}
            {createMutation.isPending ? "Posting…" : "Post to Community"}
          </PurpleBtn>
        </CardShell>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <Sparkles size={28} style={{ marginBottom: 12 }} /> Loading posts…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Users size={40} style={{ color: DIM, marginBottom: 12 }} />
          <p style={{ color: MUTED }}>
            No posts yet. Be the first to share a reading!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <CardShell key={post.id}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(124,58,237,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "#C4B5FD",
                      fontWeight: 700,
                    }}
                  >
                    {(post.user_name || "A")[0].toUpperCase()}
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#C4B5FD" }}
                  >
                    {post.user_name || "Anonymous"}
                  </span>
                  <span style={{ fontSize: 11, color: DIM }}>
                    · {fmtDate(post.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {post.spread_name}
                </p>
                {post.interpretation && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#D1D5DB",
                      lineHeight: 1.75,
                      ...(expandedId !== post.id && {
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }),
                    }}
                  >
                    {post.interpretation}
                  </p>
                )}
                {post.interpretation && post.interpretation.length > 200 && (
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === post.id ? null : post.id)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: MUTED,
                      fontSize: 12,
                      cursor: "pointer",
                      padding: "4px 0",
                    }}
                  >
                    {expandedId === post.id ? "Show less ↑" : "Read more ↓"}
                  </button>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 14,
              }}
            >
              <button
                onClick={() => upvoteMutation.mutate(post.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "none",
                  border: "none",
                  color: "#C4B5FD",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Heart size={16} /> {post.upvotes || 0}
              </button>
            </div>
          </CardShell>
        ))
      )}
    </div>
  );
}

// ── TAB: DISCUSSIONS ──────────────────────────────────────────────────────────
function DiscussionsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topic: "", content: "", user_name: "" });
  const [openThread, setOpenThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: () => fetch("/api/community/discussions").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/community/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discussions"] });
      setShowForm(false);
      setForm({ topic: "", content: "", user_name: "" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }) =>
      fetch(`/api/community/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discussions"] });
      setReplyText("");
    },
  });

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    replyMutation.mutate({
      id,
      reply: `${replyName || "Anonymous"}: ${replyText}`,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <PurpleBtn onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Start Discussion"}
        </PurpleBtn>
      </div>

      {showForm && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Start a Discussion
          </p>
          <Input
            label="YOUR NAME"
            value={form.user_name}
            onChange={(v) => setForm((f) => ({ ...f, user_name: v }))}
            placeholder="Anonymous"
          />
          <Input
            label="TOPIC"
            value={form.topic}
            onChange={(v) => setForm((f) => ({ ...f, topic: v }))}
            placeholder="What do you want to explore?"
          />
          <Input
            label="YOUR THOUGHTS"
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            placeholder="Share your perspective…"
            multiline
            rows={4}
          />
          <PurpleBtn
            onClick={() =>
              createMutation.mutate({
                topic: form.topic,
                content: form.content,
                user_name: form.user_name || "Anonymous",
              })
            }
            disabled={!form.topic || !form.content || createMutation.isPending}
            full
          >
            <MessageCircle size={14} />{" "}
            {createMutation.isPending ? "Posting…" : "Start Discussion"}
          </PurpleBtn>
        </CardShell>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <Sparkles size={28} style={{ marginBottom: 12 }} />
        </div>
      ) : discussions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <MessageCircle size={40} style={{ color: DIM, marginBottom: 12 }} />
          <p style={{ color: MUTED }}>No discussions yet. Start one!</p>
        </div>
      ) : (
        discussions.map((d) => (
          <CardShell key={d.id}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(79,70,229,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#C4B5FD",
                      fontWeight: 700,
                    }}
                  >
                    {(d.user_name || "A")[0].toUpperCase()}
                  </div>
                  <span
                    style={{ fontSize: 13, color: "#C4B5FD", fontWeight: 600 }}
                  >
                    {d.user_name || "Anonymous"}
                  </span>
                  <span style={{ fontSize: 11, color: DIM }}>
                    · {fmtDate(d.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {d.topic}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#D1D5DB",
                    lineHeight: 1.75,
                  }}
                >
                  {d.content}
                </p>
              </div>
            </div>

            {/* Reply count + toggle */}
            <button
              onClick={() => setOpenThread(openThread === d.id ? null : d.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: MUTED,
                cursor: "pointer",
                fontSize: 13,
                marginTop: 12,
              }}
            >
              <MessageCircle size={14} /> {(d.replies || []).length}{" "}
              {(d.replies || []).length === 1 ? "reply" : "replies"}
              {openThread === d.id ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}
            </button>

            {openThread === d.id && (
              <div
                style={{
                  marginTop: 12,
                  borderTop: `1px solid ${BORDER}`,
                  paddingTop: 14,
                }}
              >
                {/* Replies */}
                {(d.replies || []).map((r, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 10,
                      padding: "10px 12px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: 10,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#D1D5DB",
                        lineHeight: 1.7,
                      }}
                    >
                      {r.content || r}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 10, color: DIM }}>
                      {r.created_at ? fmtDate(r.created_at) : ""}
                    </p>
                  </div>
                ))}

                {/* Reply form */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    placeholder="Your name"
                    style={{
                      flex: "0 0 120px",
                      padding: "9px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      color: TEXT,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                    style={{
                      flex: 1,
                      minWidth: 140,
                      padding: "9px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      color: TEXT,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "sans-serif",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleReply(d.id)}
                  />
                  <button
                    onClick={() => handleReply(d.id)}
                    disabled={!replyText.trim()}
                    style={{
                      padding: "9px 16px",
                      background: "#4F46E5",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
          </CardShell>
        ))
      )}
    </div>
  );
}

// ── TAB: SPREADS ──────────────────────────────────────────────────────────────
function SpreadsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    created_by: "",
    positions: [{ name: "" }, { name: "" }, { name: "" }],
  });
  const [voted, setVoted] = useState({});
  const [usingSpread, setUsingSpread] = useState(null);

  const { data: spreads = [], isLoading } = useQuery({
    queryKey: ["community-spreads"],
    queryFn: () => fetch("/api/community/spreads").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/community/spreads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-spreads"] });
      setShowForm(false);
      setForm({
        name: "",
        description: "",
        created_by: "",
        positions: [{ name: "" }, { name: "" }, { name: "" }],
      });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`/api/community/spreads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upvote: true }),
      }),
    onSuccess: (_, id) => {
      setVoted((v) => ({ ...v, [id]: true }));
      qc.invalidateQueries({ queryKey: ["community-spreads"] });
    },
  });

  const addPosition = () =>
    setForm((f) => ({ ...f, positions: [...f.positions, { name: "" }] }));
  const removePosition = (i) =>
    setForm((f) => ({
      ...f,
      positions: f.positions.filter((_, idx) => idx !== i),
    }));
  const updatePosition = (i, name) =>
    setForm((f) => ({
      ...f,
      positions: f.positions.map((p, idx) => (idx === i ? { name } : p)),
    }));

  const handleUseSpread = (spread) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "communitySpread",
        JSON.stringify({
          id: `community-${spread.id}`,
          name: spread.name,
          description: spread.description,
          positions: spread.positions,
          category: "community",
        }),
      );
      window.location.href = "/reading?community=1";
    }
  };

  const handleSubmit = () => {
    const validPositions = form.positions.filter((p) => p.name.trim());
    if (!form.name || validPositions.length < 2) return;
    createMutation.mutate({
      name: form.name,
      description: form.description,
      created_by: form.created_by || "Anonymous",
      positions: validPositions,
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <PurpleBtn onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Create Spread"}
        </PurpleBtn>
        <p style={{ margin: 0, fontSize: 13, color: DIM }}>
          Browse community spreads — vote for your favorites and use them
          directly in a reading.
        </p>
      </div>

      {showForm && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Create a Custom Spread
          </p>
          <Input
            label="YOUR NAME"
            value={form.created_by}
            onChange={(v) => setForm((f) => ({ ...f, created_by: v }))}
            placeholder="Anonymous"
          />
          <Input
            label="SPREAD NAME"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="Give your spread a name"
          />
          <Input
            label="DESCRIPTION"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            placeholder="What is this spread for?"
          />

          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}
          >
            POSITIONS (min 2)
          </label>
          {form.positions.map((pos, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(124,58,237,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#C4B5FD",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <input
                value={pos.name}
                onChange={(e) => updatePosition(i, e.target.value)}
                placeholder={`Position ${i + 1} name`}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  color: TEXT,
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "sans-serif",
                }}
              />
              {form.positions.length > 2 && (
                <button
                  onClick={() => removePosition(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: DIM,
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              onClick={addPosition}
              style={{
                fontSize: 13,
                color: MUTED,
                background: "none",
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Plus size={13} /> Add Position
            </button>
            <PurpleBtn
              onClick={handleSubmit}
              disabled={
                !form.name ||
                form.positions.filter((p) => p.name.trim()).length < 2 ||
                createMutation.isPending
              }
            >
              <Check size={14} />{" "}
              {createMutation.isPending ? "Creating…" : "Create Spread"}
            </PurpleBtn>
          </div>
        </CardShell>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <Sparkles size={28} style={{ marginBottom: 12 }} />
        </div>
      ) : spreads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Layers size={40} style={{ color: DIM, marginBottom: 12 }} />
          <p style={{ color: MUTED }}>
            No community spreads yet. Create one above!
          </p>
        </div>
      ) : (
        spreads.map((spread) => (
          <CardShell key={spread.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {spread.name}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: DIM }}>
                  by {spread.created_by} · {fmtDate(spread.created_at)}
                </p>
                {spread.description && (
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 13,
                      color: "#D1D5DB",
                    }}
                  >
                    {spread.description}
                  </p>
                )}
                {/* Position list */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  {(spread.positions || []).map((p, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        background: "rgba(109,40,217,0.2)",
                        color: "#A78BFA",
                        padding: "3px 9px",
                        borderRadius: 20,
                      }}
                    >
                      {p.name || p}
                    </span>
                  ))}
                </div>
              </div>
              {/* Medal for top 3 */}
              {spread.upvotes >= 5 && <div style={{ fontSize: 22 }}>🏆</div>}
              {spread.upvotes >= 2 && spread.upvotes < 5 && (
                <div style={{ fontSize: 22 }}>⭐</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {/* Vote */}
              <button
                onClick={() =>
                  !voted[spread.id] && upvoteMutation.mutate(spread.id)
                }
                disabled={voted[spread.id]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  background: voted[spread.id]
                    ? "rgba(124,58,237,0.25)"
                    : "rgba(124,58,237,0.1)",
                  color: voted[spread.id] ? "#C4B5FD" : MUTED,
                  border: `1px solid ${voted[spread.id] ? "#7C3AED" : BORDER}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: voted[spread.id] ? "default" : "pointer",
                }}
              >
                <TrendingUp size={13} /> {spread.upvotes || 0}{" "}
                {voted[spread.id] ? "Voted" : "Vote"}
              </button>

              {/* Use this spread */}
              <PurpleBtn small onClick={() => handleUseSpread(spread)}>
                <Wand2 size={13} /> Use This Spread
              </PurpleBtn>
            </div>
          </CardShell>
        ))
      )}
    </div>
  );
}

// ── TAB: GROUPS ───────────────────────────────────────────────────────────────
function GroupsTab() {
  const qc = useQueryClient();
  const [view, setView] = useState("list"); // 'list' | 'create' | 'join' | 'detail'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    created_by: "",
    is_private: true,
  });
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinError, setJoinError] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareForm, setShareForm] = useState({ shared_by: "", note: "" });
  const [showShareForm, setShowShareForm] = useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["reading-groups"],
    queryFn: () => fetch("/api/groups").then((r) => r.json()),
    enabled: view === "list",
  });

  const { data: groupDetail } = useQuery({
    queryKey: ["group-detail", selectedGroup?.id],
    queryFn: () =>
      fetch(`/api/groups/${selectedGroup.id}`).then((r) => r.json()),
    enabled: !!selectedGroup?.id,
  });

  const { data: groupReadings = [] } = useQuery({
    queryKey: ["group-readings", selectedGroup?.id],
    queryFn: () =>
      fetch(`/api/groups/${selectedGroup.id}/readings`).then((r) => r.json()),
    enabled: !!selectedGroup?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    onSuccess: (group) => {
      qc.invalidateQueries({ queryKey: ["reading-groups"] });
      setSelectedGroup(group);
      setView("detail");
    },
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const upper = joinCode.trim().toUpperCase();
      const listRes = await fetch("/api/groups");
      const allGroups = await listRes.json();
      const found = allGroups.find((g) => g.invite_code === upper);
      if (!found) {
        const publicRes = await fetch(`/api/groups/${upper}`);
        if (!publicRes.ok) throw new Error("Group not found");
        const publicGroup = await publicRes.json();
        const joinRes = await fetch(`/api/groups/${publicGroup.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member_name: joinName || "Anonymous",
            invite_code: upper,
          }),
        });
        if (!joinRes.ok) {
          const err = await joinRes.json();
          throw new Error(err.error || "Invalid code");
        }
        return joinRes.json();
      }
      const joinRes = await fetch(`/api/groups/${found.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name: joinName || "Anonymous",
          invite_code: upper,
        }),
      });
      if (!joinRes.ok) {
        const err = await joinRes.json();
        throw new Error(err.error || "Invalid code");
      }
      return joinRes.json();
    },
    onSuccess: (group) => {
      qc.invalidateQueries({ queryKey: ["reading-groups"] });
      setSelectedGroup(group);
      setView("detail");
      setJoinError("");
    },
    onError: (e) => setJoinError(e.message),
  });

  const shareReadingMutation = useMutation({
    mutationFn: (data) =>
      fetch(`/api/groups/${selectedGroup.id}/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["group-readings", selectedGroup?.id] });
      setShowShareForm(false);
      setShareForm({ shared_by: "", note: "" });
    },
  });

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (view === "detail" && selectedGroup) {
    const group = groupDetail || selectedGroup;
    return (
      <div>
        <button
          onClick={() => {
            setView("list");
            setSelectedGroup(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: MUTED,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          <ChevronLeft size={14} /> Back to Groups
        </button>

        {/* Group header */}
        <div
          style={{
            background: "rgba(124,58,237,0.08)",
            borderRadius: 16,
            padding: "20px 24px",
            border: `1px solid ${BORDER_ACTIVE}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
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
                {group.is_private ? (
                  <Lock size={14} style={{ color: MUTED }} />
                ) : (
                  <Globe size={14} style={{ color: MUTED }} />
                )}
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {group.name}
                </p>
              </div>
              {group.description && (
                <p style={{ margin: "4px 0 8px", fontSize: 13, color: MUTED }}>
                  {group.description}
                </p>
              )}
              <p style={{ margin: 0, fontSize: 12, color: DIM }}>
                Created by {group.created_by} · {(group.members || []).length}{" "}
                member{(group.members || []).length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: DIM }}>
                INVITE CODE
              </p>
              <button
                onClick={() => copyCode(group.invite_code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  background: "rgba(124,58,237,0.2)",
                  border: `1px solid ${BORDER_ACTIVE}`,
                  borderRadius: 10,
                  color: "#C4B5FD",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                }}
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}{" "}
                {group.invite_code}
              </button>
            </div>
          </div>
        </div>

        {/* Members strip */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {(group.members || []).map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
                borderRadius: 20,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background:
                    m.role === "admin"
                      ? "rgba(124,58,237,0.4)"
                      : "rgba(79,70,229,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#C4B5FD",
                  fontWeight: 700,
                }}
              >
                {m.member_name[0].toUpperCase()}
              </div>
              <span style={{ color: m.role === "admin" ? "#C4B5FD" : MUTED }}>
                {m.member_name}
              </span>
              {m.role === "admin" && (
                <Shield size={10} style={{ color: "#C4B5FD" }} />
              )}
            </div>
          ))}
        </div>

        {/* Share reading */}
        <div style={{ marginBottom: 20 }}>
          <PurpleBtn onClick={() => setShowShareForm(!showShareForm)}>
            {showShareForm ? <X size={14} /> : <BookOpen size={14} />}
            {showShareForm ? "Cancel" : "Share a Reading to Group"}
          </PurpleBtn>
        </div>

        {showShareForm && (
          <CardShell highlight>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 14,
                fontWeight: 700,
                color: TEXT,
              }}
            >
              Share a Reading with the Group
            </p>
            <Input
              label="YOUR NAME"
              value={shareForm.shared_by}
              onChange={(v) => setShareForm((f) => ({ ...f, shared_by: v }))}
              placeholder="Anonymous"
            />
            <Input
              label="SPREAD NAME"
              value={shareForm.spread_name || ""}
              onChange={(v) => setShareForm((f) => ({ ...f, spread_name: v }))}
              placeholder="e.g. Three-Card Spread"
            />
            <Input
              label="PERSONAL NOTE"
              value={shareForm.note}
              onChange={(v) => setShareForm((f) => ({ ...f, note: v }))}
              placeholder="What did this reading reveal for you?"
              multiline
              rows={3}
            />
            <PurpleBtn
              onClick={() =>
                shareReadingMutation.mutate({
                  shared_by: shareForm.shared_by || "Anonymous",
                  spread_name: shareForm.spread_name || "Reading",
                  cards: [],
                  note: shareForm.note,
                })
              }
              disabled={shareReadingMutation.isPending}
              full
            >
              <Send size={14} />{" "}
              {shareReadingMutation.isPending ? "Sharing…" : "Share with Group"}
            </PurpleBtn>
          </CardShell>
        )}

        {/* Group readings */}
        <div>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: MUTED,
              letterSpacing: "0.05em",
            }}
          >
            GROUP READINGS ({groupReadings.length})
          </p>
          {groupReadings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: DIM }}>
              <BookOpen size={32} style={{ marginBottom: 10 }} />
              <p>No readings shared yet. Be the first!</p>
            </div>
          ) : (
            groupReadings.map((r) => (
              <CardShell key={r.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(124,58,237,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#C4B5FD",
                      fontWeight: 700,
                    }}
                  >
                    {r.shared_by[0].toUpperCase()}
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#C4B5FD" }}
                  >
                    {r.shared_by}
                  </span>
                  <span style={{ fontSize: 11, color: DIM }}>
                    · {fmtDate(r.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {r.spread_name}
                </p>
                {r.note && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#D1D5DB",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    "{r.note}"
                  </p>
                )}
              </CardShell>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Action row */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <PurpleBtn
          onClick={() => setView(view === "create" ? "list" : "create")}
        >
          {view === "create" ? <X size={14} /> : <Plus size={14} />}
          {view === "create" ? "Cancel" : "Create Circle"}
        </PurpleBtn>
        <PurpleBtn
          outline
          onClick={() => setView(view === "join" ? "list" : "join")}
        >
          <LogIn size={14} /> {view === "join" ? "Cancel" : "Join by Code"}
        </PurpleBtn>
      </div>

      {/* Create form */}
      {view === "create" && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Create a Reading Circle
          </p>
          <Input
            label="YOUR NAME"
            value={createForm.created_by}
            onChange={(v) => setCreateForm((f) => ({ ...f, created_by: v }))}
            placeholder="Anonymous"
          />
          <Input
            label="CIRCLE NAME"
            value={createForm.name}
            onChange={(v) => setCreateForm((f) => ({ ...f, name: v }))}
            placeholder="e.g. Moon Sisters"
          />
          <Input
            label="DESCRIPTION"
            value={createForm.description}
            onChange={(v) => setCreateForm((f) => ({ ...f, description: v }))}
            placeholder="What is this circle about?"
          />
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: MUTED,
                letterSpacing: "0.04em",
              }}
            >
              VISIBILITY
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[
                {
                  val: true,
                  icon: <Lock size={13} />,
                  label: "Private (invite code)",
                },
                { val: false, icon: <Globe size={13} />, label: "Public" },
              ].map((opt) => (
                <button
                  key={opt.val.toString()}
                  onClick={() =>
                    setCreateForm((f) => ({ ...f, is_private: opt.val }))
                  }
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 12px",
                    background:
                      createForm.is_private === opt.val
                        ? "rgba(124,58,237,0.3)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${createForm.is_private === opt.val ? BORDER_ACTIVE : BORDER}`,
                    borderRadius: 10,
                    color:
                      createForm.is_private === opt.val ? "#C4B5FD" : MUTED,
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                    justifyContent: "center",
                  }}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
          <PurpleBtn
            onClick={() => createMutation.mutate(createForm)}
            disabled={!createForm.name || createMutation.isPending}
            full
          >
            <Users size={14} />{" "}
            {createMutation.isPending ? "Creating…" : "Create Circle"}
          </PurpleBtn>
        </CardShell>
      )}

      {/* Join form */}
      {view === "join" && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Join a Reading Circle
          </p>
          <Input
            label="YOUR NAME"
            value={joinName}
            onChange={setJoinName}
            placeholder="Anonymous"
          />
          <Input
            label="INVITE CODE"
            value={joinCode}
            onChange={(v) => setJoinCode(v.toUpperCase())}
            placeholder="e.g. ABCD12"
          />
          {joinError && (
            <p
              style={{ color: "#F87171", fontSize: 13, margin: "-8px 0 10px" }}
            >
              {joinError}
            </p>
          )}
          <PurpleBtn
            onClick={() => joinMutation.mutate()}
            disabled={!joinCode.trim() || joinMutation.isPending}
            full
          >
            <ArrowRight size={14} />{" "}
            {joinMutation.isPending ? "Joining…" : "Join Circle"}
          </PurpleBtn>
        </CardShell>
      )}

      {/* Groups list */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <Sparkles size={28} style={{ marginBottom: 12 }} />
        </div>
      ) : groups.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Users size={40} style={{ color: DIM, marginBottom: 12 }} />
          <p style={{ color: MUTED }}>No public circles yet. Create one!</p>
        </div>
      ) : (
        <div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: DIM }}>
            Public circles — join any, or use an invite code for private ones
          </p>
          {groups.map((g) => (
            <CardShell key={g.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                    <Globe size={13} style={{ color: MUTED }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 700,
                        color: TEXT,
                      }}
                    >
                      {g.name}
                    </p>
                  </div>
                  {g.description && (
                    <p
                      style={{ margin: "0 0 6px", fontSize: 13, color: MUTED }}
                    >
                      {g.description}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 11, color: DIM }}>
                    by {g.created_by} · {g.member_count} members
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedGroup(g);
                    setView("detail");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(124,58,237,0.15)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    color: "#C4B5FD",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View <ArrowRight size={13} />
                </button>
              </div>
            </CardShell>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TAB: MENTORS ──────────────────────────────────────────────────────────────
const SPECIALTIES = [
  "Major Arcana",
  "Minor Arcana",
  "Celtic Cross",
  "Relationship Spreads",
  "Shadow Work",
  "Numerology",
  "Astrology + Tarot",
  "Daily Practice",
  "Beginner Guidance",
  "Dream Interpretation",
];
const LEVELS = [
  { id: "beginner", label: "Beginner", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", emoji: "🌙" },
  { id: "expert", label: "Expert", emoji: "⭐" },
];

function MentorsTab() {
  const qc = useQueryClient();
  const [filterMode, setFilterMode] = useState("mentors");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    display_name: "",
    bio: "",
    experience_level: "intermediate",
    specialties: [],
    is_mentor: true,
    is_seeking: false,
    contact_hint: "",
  });
  const [requestState, setRequestState] = useState({}); // { [id]: { open, name, message, sent } }

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors", filterMode],
    queryFn: () =>
      fetch(`/api/mentors?filter=${filterMode}`).then((r) => r.json()),
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentors"] });
      setShowProfileForm(false);
    },
  });

  const requestMutation = useMutation({
    mutationFn: ({ id, seeker_name, message }) =>
      fetch(`/api/mentors/${id}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seeker_name, message }),
      }).then((r) => r.json()),
    onSuccess: (_, { id }) =>
      setRequestState((s) => ({
        ...s,
        [id]: { ...s[id], sent: true, open: false },
      })),
  });

  const toggleSpecialty = (s) =>
    setProfileForm((f) => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter((x) => x !== s)
        : [...f.specialties, s],
    }));

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {[
          {
            id: "mentors",
            label: "🧙 Mentors",
            desc: "Experienced readers offering guidance",
          },
          {
            id: "seeking",
            label: "🌱 Seekers",
            desc: "Beginners looking for a mentor",
          },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilterMode(opt.id)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${filterMode === opt.id ? BORDER_ACTIVE : BORDER}`,
              background:
                filterMode === opt.id ? "rgba(124,58,237,0.2)" : CARD_BG,
              color: filterMode === opt.id ? "#C4B5FD" : MUTED,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
              minWidth: 160,
            }}
          >
            {opt.label}
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                fontWeight: 400,
                color: filterMode === opt.id ? MUTED : DIM,
              }}
            >
              {opt.desc}
            </p>
          </button>
        ))}
        <PurpleBtn onClick={() => setShowProfileForm(!showProfileForm)}>
          {showProfileForm ? <X size={14} /> : <UserCheck size={14} />}
          {showProfileForm ? "Cancel" : "Create Profile"}
        </PurpleBtn>
      </div>

      {/* Create profile form */}
      {showProfileForm && (
        <CardShell highlight>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            ✦ Create Your Mentor Profile
          </p>
          <Input
            label="DISPLAY NAME"
            value={profileForm.display_name}
            onChange={(v) => setProfileForm((f) => ({ ...f, display_name: v }))}
            placeholder="How shall you be known?"
          />
          <Input
            label="BIO"
            value={profileForm.bio}
            onChange={(v) => setProfileForm((f) => ({ ...f, bio: v }))}
            placeholder="Share your tarot journey and what you offer…"
            multiline
            rows={3}
          />

          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}
          >
            EXPERIENCE LEVEL
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {LEVELS.map((lv) => (
              <button
                key={lv.id}
                onClick={() =>
                  setProfileForm((f) => ({ ...f, experience_level: lv.id }))
                }
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 10,
                  border: `1px solid ${profileForm.experience_level === lv.id ? BORDER_ACTIVE : BORDER}`,
                  background:
                    profileForm.experience_level === lv.id
                      ? "rgba(124,58,237,0.25)"
                      : CARD_BG,
                  color:
                    profileForm.experience_level === lv.id ? "#C4B5FD" : MUTED,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {lv.emoji} {lv.label}
              </button>
            ))}
          </div>

          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}
          >
            SPECIALTIES
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 14,
            }}
          >
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSpecialty(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: `1px solid ${profileForm.specialties.includes(s) ? BORDER_ACTIVE : BORDER}`,
                  background: profileForm.specialties.includes(s)
                    ? "rgba(124,58,237,0.25)"
                    : "transparent",
                  color: profileForm.specialties.includes(s)
                    ? "#C4B5FD"
                    : MUTED,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}
          >
            ROLE
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              { key: "is_mentor", label: "🧙 I am a Mentor" },
              { key: "is_seeking", label: "🌱 I am Seeking" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() =>
                  setProfileForm((f) => ({ ...f, [opt.key]: !f[opt.key] }))
                }
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: `1px solid ${profileForm[opt.key] ? BORDER_ACTIVE : BORDER}`,
                  background: profileForm[opt.key]
                    ? "rgba(124,58,237,0.25)"
                    : CARD_BG,
                  color: profileForm[opt.key] ? "#C4B5FD" : MUTED,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Input
            label="HOW TO REACH YOU (optional)"
            value={profileForm.contact_hint}
            onChange={(v) => setProfileForm((f) => ({ ...f, contact_hint: v }))}
            placeholder="e.g. DM on Discord, email hint…"
          />
          <PurpleBtn
            onClick={() => createProfileMutation.mutate(profileForm)}
            disabled={
              !profileForm.display_name || createProfileMutation.isPending
            }
            full
          >
            <Star size={14} />{" "}
            {createProfileMutation.isPending ? "Creating…" : "Create Profile"}
          </PurpleBtn>
        </CardShell>
      )}

      {/* List */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <Sparkles size={28} style={{ marginBottom: 12 }} />
        </div>
      ) : mentors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <UserCheck size={40} style={{ color: DIM, marginBottom: 12 }} />
          <p style={{ color: MUTED }}>
            No profiles yet in this category. Create one above!
          </p>
        </div>
      ) : (
        mentors.map((m) => {
          const rs = requestState[m.id] || {};
          return (
            <CardShell key={m.id}>
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {m.display_name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: TEXT,
                      }}
                    >
                      {m.display_name}
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "rgba(109,40,217,0.2)",
                        color: "#A78BFA",
                      }}
                    >
                      {LEVELS.find((l) => l.id === m.experience_level)?.emoji}{" "}
                      {m.experience_level}
                    </span>
                    {m.is_mentor && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background: "rgba(52,211,153,0.15)",
                          color: "#34D399",
                        }}
                      >
                        Mentor
                      </span>
                    )}
                    {m.is_seeking && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background: "rgba(251,191,36,0.15)",
                          color: "#FBBF24",
                        }}
                      >
                        Seeking
                      </span>
                    )}
                  </div>
                  {m.bio && (
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 13,
                        color: "#D1D5DB",
                        lineHeight: 1.7,
                      }}
                    >
                      {m.bio}
                    </p>
                  )}
                  {(m.specialties || []).length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 10,
                      }}
                    >
                      {(m.specialties || []).map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: "rgba(109,40,217,0.2)",
                            color: "#A78BFA",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.contact_hint && (
                    <p
                      style={{ margin: "0 0 10px", fontSize: 12, color: MUTED }}
                    >
                      📬 {m.contact_hint}
                    </p>
                  )}
                </div>
              </div>

              {/* Connect button */}
              {rs.sent ? (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#34D399",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Check size={14} /> Request sent!
                </div>
              ) : rs.open ? (
                <div style={{ marginTop: 14 }}>
                  <Input
                    value={rs.name || ""}
                    onChange={(v) =>
                      setRequestState((s) => ({
                        ...s,
                        [m.id]: { ...s[m.id], name: v },
                      }))
                    }
                    placeholder="Your name"
                  />
                  <Input
                    value={rs.message || ""}
                    onChange={(v) =>
                      setRequestState((s) => ({
                        ...s,
                        [m.id]: { ...s[m.id], message: v },
                      }))
                    }
                    placeholder={`Introduce yourself to ${m.display_name}…`}
                    multiline
                    rows={3}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <PurpleBtn
                      onClick={() =>
                        requestMutation.mutate({
                          id: m.id,
                          seeker_name: rs.name || "Anonymous",
                          message: rs.message || "",
                        })
                      }
                      disabled={requestMutation.isPending}
                      small
                    >
                      <Send size={13} />{" "}
                      {requestMutation.isPending ? "Sending…" : "Send Request"}
                    </PurpleBtn>
                    <PurpleBtn
                      outline
                      onClick={() =>
                        setRequestState((s) => ({
                          ...s,
                          [m.id]: { ...s[m.id], open: false },
                        }))
                      }
                      small
                    >
                      Cancel
                    </PurpleBtn>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setRequestState((s) => ({ ...s, [m.id]: { open: true } }))
                  }
                  style={{
                    marginTop: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: "rgba(124,58,237,0.15)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    color: "#C4B5FD",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <MessageCircle size={13} /> Connect with {m.display_name}
                </button>
              )}
            </CardShell>
          );
        })
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "feed", label: "📖 Feed", icon: BookOpen },
  { id: "discussions", label: "💬 Discussions", icon: MessageCircle },
  { id: "spreads", label: "🃏 Spreads", icon: Layers },
  { id: "groups", label: "🔮 Circles", icon: Users },
  { id: "mentors", label: "🧙 Mentors", icon: Star },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div
      style={{ minHeight: "100vh", background: DARK, fontFamily: "sans-serif" }}
    >
      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        {/* Header */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: MUTED,
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ChevronLeft size={14} /> Back to Archive
        </a>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 32,
            fontWeight: 700,
            color: TEXT,
          }}
        >
          Community
        </h1>
        <p style={{ margin: "0 0 28px", color: MUTED }}>
          Connect with fellow seekers — share readings, discuss, and grow
          together
        </p>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 28,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                border: "none",
                whiteSpace: "nowrap",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                    : "rgba(255,255,255,0.04)",
                color: activeTab === tab.id ? "#fff" : MUTED,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  activeTab === tab.id
                    ? "0 4px 16px rgba(124,58,237,0.3)"
                    : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "feed" && <FeedTab />}
        {activeTab === "discussions" && <DiscussionsTab />}
        {activeTab === "spreads" && <SpreadsTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "mentors" && <MentorsTab />}
      </div>

      <style jsx global>{`
        textarea, input { color-scheme: dark; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
