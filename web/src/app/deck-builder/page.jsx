"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Plus,
  X,
  Trash2,
  Sparkles,
  Save,
  Eye,
  Upload,
  Edit3,
  Check,
  Image as ImageIcon,
  Layers,
  Globe,
  Lock,
} from "lucide-react";
import useUpload from "@/utils/useUpload";

const BG = "#0F0A1E";
const CARD_BG = "rgba(255,255,255,0.03)";
const BORDER = "rgba(139,92,246,0.25)";
const ACTIVE = "#7C3AED";
const TEXT = "#E9D5FF";
const MUTED = "#9B7FD4";
const DIM = "#6B7280";

function Input({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  style: extra,
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
    ...extra,
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

const EMPTY_CARD = {
  name: "",
  meaning_upright: "",
  meaning_reversed: "",
  keywords: "",
  image_url: "",
};

export default function DeckBuilderPage() {
  const qc = useQueryClient();
  const [view, setView] = useState("list"); // list | create | edit
  const [editingDeck, setEditingDeck] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    cards: [{ ...EMPTY_CARD }],
    is_public: false,
  });
  const [previewCard, setPreviewCard] = useState(null);
  const [uploadingCard, setUploadingCard] = useState(null);
  const [upload, { loading: uploadLoading }] = useUpload();

  const { data: decks = [], isLoading } = useQuery({
    queryKey: ["custom-decks"],
    queryFn: () =>
      fetch("/api/custom-decks?userId=anonymous&includePublic=true").then((r) =>
        r.json(),
      ),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const method = editingDeck ? "PUT" : "POST";
      const url = editingDeck
        ? `/api/custom-decks/${editingDeck.id}`
        : "/api/custom-decks";
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error("Save failed");
        return r.json();
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-decks"] });
      setView("list");
      setEditingDeck(null);
      setForm({
        name: "",
        description: "",
        cards: [{ ...EMPTY_CARD }],
        is_public: false,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`/api/custom-decks/${id}`, { method: "DELETE" }).then((r) =>
        r.json(),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custom-decks"] }),
  });

  const addCard = () =>
    setForm((f) => ({ ...f, cards: [...f.cards, { ...EMPTY_CARD }] }));
  const removeCard = (i) =>
    setForm((f) => ({ ...f, cards: f.cards.filter((_, idx) => idx !== i) }));
  const updateCard = (i, field, value) =>
    setForm((f) => ({
      ...f,
      cards: f.cards.map((c, idx) =>
        idx === i ? { ...c, [field]: value } : c,
      ),
    }));

  const handleImageUpload = useCallback(
    async (cardIndex) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCard(cardIndex);
        try {
          const reader = new FileReader();
          reader.onload = async () => {
            const result = await upload({ url: reader.result });
            if (result.error) {
              console.error("Upload error:", result.error);
              alert("Failed to upload image. Please try again.");
            } else {
              updateCard(cardIndex, "image_url", result.url);
            }
            setUploadingCard(null);
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error(err);
          setUploadingCard(null);
        }
      };
      input.click();
    },
    [upload],
  );

  const handleSave = () => {
    const validCards = form.cards.filter((c) => c.name.trim());
    if (!form.name || validCards.length === 0) return;
    saveMutation.mutate({
      name: form.name,
      description: form.description,
      cards: validCards.map((c) => ({
        name: c.name,
        meaning_upright: c.meaning_upright,
        meaning_reversed: c.meaning_reversed,
        keywords: c.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        image_url: c.image_url,
      })),
      is_public: form.is_public,
      user_id: "anonymous",
    });
  };

  const openEdit = (deck) => {
    setEditingDeck(deck);
    setForm({
      name: deck.name,
      description: deck.description || "",
      cards: (deck.cards || []).map((c) => ({
        name: c.name || "",
        meaning_upright: c.meaning_upright || "",
        meaning_reversed: c.meaning_reversed || "",
        keywords: (c.keywords || []).join(", "),
        image_url: c.image_url || "",
      })),
      is_public: deck.is_public || false,
    });
    setView("edit");
  };

  // ── CREATE / EDIT VIEW ──
  if (view === "create" || view === "edit") {
    return (
      <div
        style={{ minHeight: "100vh", background: BG, fontFamily: "sans-serif" }}
      >
        <div
          style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px 80px" }}
        >
          <button
            onClick={() => {
              setView("list");
              setEditingDeck(null);
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
              marginBottom: 24,
            }}
          >
            <ChevronLeft size={14} /> Back to Decks
          </button>

          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 28,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            {editingDeck ? "Edit Deck" : "Create Custom Deck"}
          </h1>
          <p style={{ margin: "0 0 28px", color: MUTED }}>
            Design your own card deck with custom meanings
          </p>

          {/* Deck Info */}
          <div
            style={{
              background: CARD_BG,
              borderRadius: 16,
              border: `1px solid ${BORDER}`,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Input
              label="DECK NAME"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="e.g. Moon Goddess Oracle"
            />
            <Input
              label="DESCRIPTION"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="What is this deck about?"
              multiline
              rows={2}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <button
                onClick={() =>
                  setForm((f) => ({ ...f, is_public: !f.is_public }))
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  background: form.is_public
                    ? "rgba(124,58,237,0.25)"
                    : CARD_BG,
                  border: `1px solid ${form.is_public ? ACTIVE : BORDER}`,
                  borderRadius: 8,
                  color: form.is_public ? "#C4B5FD" : MUTED,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {form.is_public ? <Globe size={13} /> : <Lock size={13} />}{" "}
                {form.is_public ? "Public" : "Private"}
              </button>
              <span style={{ fontSize: 12, color: DIM }}>
                {form.is_public
                  ? "Anyone can see this deck"
                  : "Only you can see this deck"}
              </span>
            </div>
          </div>

          {/* Cards Editor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h2
              style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT }}
            >
              {form.cards.length} Card{form.cards.length !== 1 ? "s" : ""}
            </h2>
            <button
              onClick={addCard}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                background: "rgba(124,58,237,0.15)",
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                color: "#C4B5FD",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={13} /> Add Card
            </button>
          </div>

          {form.cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: CARD_BG,
                borderRadius: 14,
                border: `1px solid ${BORDER}`,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
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
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
                    {card.name || `Card ${i + 1}`}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {card.image_url && (
                    <button
                      onClick={() =>
                        setPreviewCard(previewCard === i ? null : i)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: MUTED,
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  {form.cards.length > 1 && (
                    <button
                      onClick={() => removeCard(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#F87171",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {/* Card image */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  {card.image_url ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={card.image_url}
                        alt=""
                        style={{
                          width: 80,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: `1px solid ${BORDER}`,
                        }}
                      />
                      <button
                        onClick={() => updateCard(i, "image_url", "")}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#EF4444",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleImageUpload(i)}
                      disabled={uploadingCard === i}
                      style={{
                        width: 80,
                        height: 120,
                        borderRadius: 8,
                        border: `2px dashed ${BORDER}`,
                        background: "transparent",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: "pointer",
                        color: MUTED,
                      }}
                    >
                      {uploadingCard === i ? (
                        <span style={{ fontSize: 11 }}>…</span>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span style={{ fontSize: 10 }}>Image</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <Input
                    label="CARD NAME"
                    value={card.name}
                    onChange={(v) => updateCard(i, "name", v)}
                    placeholder="e.g. The Dreamer"
                  />
                  <Input
                    label="UPRIGHT MEANING"
                    value={card.meaning_upright}
                    onChange={(v) => updateCard(i, "meaning_upright", v)}
                    placeholder="What does this card mean upright?"
                  />
                  <Input
                    label="REVERSED MEANING"
                    value={card.meaning_reversed}
                    onChange={(v) => updateCard(i, "meaning_reversed", v)}
                    placeholder="What does it mean reversed?"
                  />
                  <Input
                    label="KEYWORDS (comma-separated)"
                    value={card.keywords}
                    onChange={(v) => updateCard(i, "keywords", v)}
                    placeholder="e.g. intuition, clarity, truth"
                  />
                </div>
              </div>

              {/* Preview */}
              {previewCard === i && card.image_url && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <img
                    src={card.image_url}
                    alt={card.name}
                    style={{
                      maxWidth: 180,
                      maxHeight: 280,
                      borderRadius: 12,
                      border: `2px solid ${ACTIVE}`,
                      boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Save */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSave}
              disabled={
                !form.name ||
                form.cards.filter((c) => c.name.trim()).length === 0 ||
                saveMutation.isPending
              }
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 20px",
                background: saveMutation.isPending
                  ? "rgba(124,58,237,0.25)"
                  : "linear-gradient(135deg,#4F46E5,#7C3AED)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: saveMutation.isPending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}
            >
              <Save size={16} />{" "}
              {saveMutation.isPending
                ? "Saving…"
                : editingDeck
                  ? "Update Deck"
                  : "Create Deck"}
            </button>
            <button
              onClick={() => {
                setView("list");
                setEditingDeck(null);
              }}
              style={{
                padding: "14px 20px",
                background: CARD_BG,
                color: MUTED,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div
      style={{ minHeight: "100vh", background: BG, fontFamily: "sans-serif" }}
    >
      <div
        style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px 80px" }}
      >
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: 32,
                fontWeight: 700,
                color: TEXT,
              }}
            >
              Custom Decks
            </h1>
            <p style={{ margin: 0, color: MUTED }}>
              Create your own card decks with custom meanings and imagery
            </p>
          </div>
          <button
            onClick={() => {
              setForm({
                name: "",
                description: "",
                cards: [{ ...EMPTY_CARD }],
                is_public: false,
              });
              setEditingDeck(null);
              setView("create");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "11px 20px",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              flexShrink: 0,
            }}
          >
            <Plus size={15} /> New Deck
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
            <Sparkles size={28} style={{ marginBottom: 12 }} /> Loading decks…
          </div>
        ) : decks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Layers size={48} style={{ color: DIM, marginBottom: 16 }} />
            <h2 style={{ margin: "0 0 8px", color: TEXT, fontSize: 20 }}>
              No Custom Decks Yet
            </h2>
            <p
              style={{
                color: MUTED,
                maxWidth: 360,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Create your first deck with custom card names, meanings, and
              images. Perfect for personal oracle decks.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {decks.map((deck) => {
              const cardCount = (deck.cards || []).length;
              const coverCards = (deck.cards || [])
                .filter((c) => c.image_url)
                .slice(0, 3);
              return (
                <div
                  key={deck.id}
                  style={{
                    background: CARD_BG,
                    borderRadius: 16,
                    border: `1px solid ${BORDER}`,
                    padding: 20,
                    transition: "border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
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
                            fontSize: 18,
                            fontWeight: 700,
                            color: TEXT,
                          }}
                        >
                          {deck.name}
                        </p>
                        {deck.is_public ? (
                          <Globe size={12} style={{ color: MUTED }} />
                        ) : (
                          <Lock size={12} style={{ color: DIM }} />
                        )}
                      </div>
                      {deck.description && (
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 13,
                            color: MUTED,
                          }}
                        >
                          {deck.description}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: 12, color: DIM }}>
                        {cardCount} card{cardCount !== 1 ? "s" : ""} · Created{" "}
                        {new Date(deck.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Cover image previews */}
                    {coverCards.length > 0 && (
                      <div style={{ display: "flex", gap: 0 }}>
                        {coverCards.map((c, ci) => (
                          <div
                            key={ci}
                            style={{
                              width: 40,
                              height: 62,
                              borderRadius: 6,
                              overflow: "hidden",
                              marginLeft: ci > 0 ? -10 : 0,
                              border: `1px solid ${BORDER}`,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                          >
                            <img
                              src={c.image_url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Keywords preview */}
                  {(deck.cards || [])
                    .slice(0, 3)
                    .some((c) => c.keywords?.length > 0) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        marginTop: 10,
                      }}
                    >
                      {(deck.cards || [])
                        .slice(0, 6)
                        .flatMap((c) => (c.keywords || []).slice(0, 2))
                        .slice(0, 8)
                        .map((kw, ki) => (
                          <span
                            key={ki}
                            style={{
                              fontSize: 10,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: "rgba(109,40,217,0.2)",
                              color: "#A78BFA",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button
                      onClick={() => openEdit(deck)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 14px",
                        background: "rgba(124,58,237,0.15)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 8,
                        color: "#C4B5FD",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${deck.name}"?`))
                          deleteMutation.mutate(deck.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 14px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: 8,
                        color: "#F87171",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        textarea, input { color-scheme: dark; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
