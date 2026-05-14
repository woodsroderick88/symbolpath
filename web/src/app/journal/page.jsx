"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Trash2,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  Calendar as CalendarIcon,
  Share2,
  GitCompare,
  Download,
  CheckSquare,
  Square,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const TAROT_IMAGES = {
  the_fool: `${BASE}RWS_Tarot_00_Fool.jpg`,
  the_magician: `${BASE}RWS_Tarot_01_Magician.jpg`,
  the_high_priestess: `${BASE}RWS_Tarot_02_High_Priestess.jpg`,
  the_empress: `${BASE}RWS_Tarot_03_Empress.jpg`,
  the_emperor: `${BASE}RWS_Tarot_04_Emperor.jpg`,
  the_hierophant: `${BASE}RWS_Tarot_05_Hierophant.jpg`,
  the_lovers: `${BASE}RWS_Tarot_06_Lovers.jpg`,
  the_chariot: `${BASE}RWS_Tarot_07_Chariot.jpg`,
  strength: `${BASE}RWS_Tarot_08_Strength.jpg`,
  the_hermit: `${BASE}RWS_Tarot_09_Hermit.jpg`,
  wheel_of_fortune: `${BASE}RWS_Tarot_10_Wheel_of_Fortune.jpg`,
  justice: `${BASE}RWS_Tarot_11_Justice.jpg`,
  the_hanged_man: `${BASE}RWS_Tarot_12_Hanged_Man.jpg`,
  death: `${BASE}RWS_Tarot_13_Death.jpg`,
  temperance: `${BASE}RWS_Tarot_14_Temperance.jpg`,
  the_devil: `${BASE}RWS_Tarot_15_Devil.jpg`,
  the_tower: `${BASE}RWS_Tarot_16_Tower.jpg`,
  the_star: `${BASE}RWS_Tarot_17_Star.jpg`,
  the_moon: `${BASE}RWS_Tarot_18_Moon.jpg`,
  the_sun: `${BASE}RWS_Tarot_19_Sun.jpg`,
  judgement: `${BASE}RWS_Tarot_20_Judgement.jpg`,
  the_world: `${BASE}RWS_Tarot_21_World.jpg`,
  ace_of_wands: `${BASE}Wands01.jpg`,
  two_of_wands: `${BASE}RWS_Tarot_Wands_02.jpg`,
  three_of_wands: `${BASE}RWS_Tarot_Wands_03.jpg`,
  four_of_wands: `${BASE}RWS_Tarot_Wands_04.jpg`,
  five_of_wands: `${BASE}RWS_Tarot_Wands_05.jpg`,
  six_of_wands: `${BASE}RWS_Tarot_Wands_06.jpg`,
  seven_of_wands: `${BASE}RWS_Tarot_Wands_07.jpg`,
  eight_of_wands: `${BASE}RWS_Tarot_Wands_08.jpg`,
  nine_of_wands: `${BASE}RWS_Tarot_Wands_09.jpg`,
  ten_of_wands: `${BASE}RWS_Tarot_Wands_10.jpg`,
  page_of_wands: `${BASE}Wands11.jpg`,
  knight_of_wands: `${BASE}Wands12.jpg`,
  queen_of_wands: `${BASE}Wands13.jpg`,
  king_of_wands: `${BASE}Wands14.jpg`,
  ace_of_cups: `${BASE}Cups01.jpg`,
  two_of_cups: `${BASE}RWS_Tarot_Cups_02.jpg`,
  three_of_cups: `${BASE}RWS_Tarot_Cups_03.jpg`,
  four_of_cups: `${BASE}RWS_Tarot_Cups_04.jpg`,
  five_of_cups: `${BASE}RWS_Tarot_Cups_05.jpg`,
  six_of_cups: `${BASE}RWS_Tarot_Cups_06.jpg`,
  seven_of_cups: `${BASE}RWS_Tarot_Cups_07.jpg`,
  eight_of_cups: `${BASE}RWS_Tarot_Cups_08.jpg`,
  nine_of_cups: `${BASE}RWS_Tarot_Cups_09.jpg`,
  ten_of_cups: `${BASE}RWS_Tarot_Cups_10.jpg`,
  page_of_cups: `${BASE}Cups11.jpg`,
  knight_of_cups: `${BASE}Cups12.jpg`,
  queen_of_cups: `${BASE}Cups13.jpg`,
  king_of_cups: `${BASE}Cups14.jpg`,
  ace_of_swords: `${BASE}Swords01.jpg`,
  two_of_swords: `${BASE}RWS_Tarot_Swords_02.jpg`,
  three_of_swords: `${BASE}RWS_Tarot_Swords_03.jpg`,
  four_of_swords: `${BASE}RWS_Tarot_Swords_04.jpg`,
  five_of_swords: `${BASE}RWS_Tarot_Swords_05.jpg`,
  six_of_swords: `${BASE}RWS_Tarot_Swords_06.jpg`,
  seven_of_swords: `${BASE}RWS_Tarot_Swords_07.jpg`,
  eight_of_swords: `${BASE}RWS_Tarot_Swords_08.jpg`,
  nine_of_swords: `${BASE}RWS_Tarot_Swords_09.jpg`,
  ten_of_swords: `${BASE}RWS_Tarot_Swords_10.jpg`,
  page_of_swords: `${BASE}Swords11.jpg`,
  knight_of_swords: `${BASE}Swords12.jpg`,
  queen_of_swords: `${BASE}Swords13.jpg`,
  king_of_swords: `${BASE}Swords14.jpg`,
  ace_of_pentacles: `${BASE}Pents01.jpg`,
  two_of_pentacles: `${BASE}RWS_Tarot_Pents_02.jpg`,
  three_of_pentacles: `${BASE}RWS_Tarot_Pents_03.jpg`,
  four_of_pentacles: `${BASE}RWS_Tarot_Pents_04.jpg`,
  five_of_pentacles: `${BASE}RWS_Tarot_Pents_05.jpg`,
  six_of_pentacles: `${BASE}RWS_Tarot_Pents_06.jpg`,
  seven_of_pentacles: `${BASE}RWS_Tarot_Pents_07.jpg`,
  eight_of_pentacles: `${BASE}RWS_Tarot_Pents_08.jpg`,
  nine_of_pentacles: `${BASE}RWS_Tarot_Pents_09.jpg`,
  ten_of_pentacles: `${BASE}RWS_Tarot_Pents_10.jpg`,
  page_of_pentacles: `${BASE}Pents11.jpg`,
  knight_of_pentacles: `${BASE}Pents12.jpg`,
  queen_of_pentacles: `${BASE}Pents13.jpg`,
  king_of_pentacles: `${BASE}Pents14.jpg`,
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Compare Modal ─────────────────────────────────────────────────────────────
function CompareModal({ readingA, readingB, onClose }) {
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const col = (reading) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ marginBottom: 12 }}>
        <p
          style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#C4B5FD" }}
        >
          {reading.spread_name}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9B7FD4" }}>
          {formatDate(reading.created_at)}
        </p>
      </div>
      {/* Cards */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}
      >
        {(reading.cards || []).map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 52,
                height: 82,
                borderRadius: 7,
                overflow: "hidden",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <img
                src={TAROT_IMAGES[c.card?.id]}
                alt={c.card?.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: c.isReversed ? "rotate(180deg)" : "none",
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 9,
                color: "#C4B5FD",
                textAlign: "center",
                maxWidth: 56,
                lineHeight: 1.2,
              }}
            >
              {c.position || c.card?.name}
            </p>
          </div>
        ))}
      </div>
      {/* Cards list */}
      <div style={{ marginBottom: 12 }}>
        {(reading.cards || []).map((c, i) => (
          <p
            key={i}
            style={{ margin: "2px 0", fontSize: 12, color: "#D1D5DB" }}
          >
            <span style={{ color: "#9B7FD4", fontWeight: 600 }}>
              {c.position}:{" "}
            </span>
            {c.card?.name}
            {c.isReversed ? " (Rev.)" : ""}
          </p>
        ))}
      </div>
      {reading.ai_narrative && (
        <div
          style={{
            background: "rgba(76,29,149,0.2)",
            borderRadius: 10,
            padding: 12,
            borderLeft: "3px solid #7C3AED",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#E9D5FF",
              lineHeight: 1.75,
              fontStyle: "italic",
            }}
          >
            {reading.ai_narrative.slice(0, 300)}
            {reading.ai_narrative.length > 300 ? "…" : ""}
          </p>
        </div>
      )}
      {reading.notes && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#9B7FD4",
            fontStyle: "italic",
          }}
        >
          "{reading.notes}"
        </p>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(9,4,20,0.8)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "#1C1332",
          width: "100%",
          maxWidth: 800,
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(139,92,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GitCompare size={18} style={{ color: "#A78BFA" }} />
            <span style={{ color: "#E9D5FF", fontSize: 16, fontWeight: 700 }}>
              Reading Comparison
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9B7FD4",
              fontSize: 20,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>
        {/* Side-by-side */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ display: "flex", gap: 20 }}>
            {col(readingA)}
            <div
              style={{
                width: 1,
                background: "rgba(139,92,246,0.2)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            />
            {col(readingB)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reading Entry ─────────────────────────────────────────────────────────────
function ReadingEntry({
  reading,
  onDelete,
  onUpdateNotes,
  compareMode,
  isSelectedForCompare,
  onToggleCompare,
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(reading.notes || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const shareRef = useRef(null);

  const saveNotes = () => {
    onUpdateNotes(reading.id, notesDraft);
    setEditingNotes(false);
  };

  const handleShare = async () => {
    try {
      if (!shareRef.current) return;

      // Use html2canvas to capture the reading
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#0F0A1E",
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        const file = new File([blob], "tarot-reading.png", {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: `${reading.spread_name} - Tarot Reading`,
            text: "Check out my tarot reading!",
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "tarot-reading.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error("Failed to share:", err);
      alert("Failed to share reading.");
    }
  };

  const cards = reading.cards || [];

  return (
    <div
      style={{
        background:
          compareMode && isSelectedForCompare
            ? "rgba(124,58,237,0.08)"
            : "rgba(255,255,255,0.03)",
        borderRadius: 16,
        border: `1px solid ${compareMode && isSelectedForCompare ? "#7C3AED" : "rgba(139,92,246,0.22)"}`,
        overflow: "hidden",
        marginBottom: 16,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Entry Header */}
      <button
        onClick={() =>
          compareMode ? onToggleCompare(reading.id) : setExpanded(!expanded)
        }
        style={{
          width: "100%",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Compare checkbox */}
          {compareMode && (
            <div
              style={{
                flexShrink: 0,
                color: isSelectedForCompare ? "#7C3AED" : "#6B7280",
              }}
            >
              {isSelectedForCompare ? (
                <CheckSquare size={20} />
              ) : (
                <Square size={20} />
              )}
            </div>
          )}
          {/* Card thumbnails */}
          <div style={{ display: "flex", gap: -6 }}>
            {cards.slice(0, 3).map((c, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 56,
                  borderRadius: 6,
                  overflow: "hidden",
                  marginLeft: i > 0 ? -10 : 0,
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={TAROT_IMAGES[c.card?.id]}
                  alt={c.card?.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: c.isReversed ? "rotate(180deg)" : "none",
                  }}
                />
              </div>
            ))}
            {cards.length > 3 && (
              <div
                style={{
                  width: 36,
                  height: 56,
                  borderRadius: 6,
                  marginLeft: -10,
                  background: "rgba(124,58,237,0.3)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#C4B5FD",
                  fontWeight: 700,
                }}
              >
                +{cards.length - 3}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              {reading.spread_name}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9B7FD4" }}>
              {new Date(reading.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              ·{" "}
              {new Date(reading.created_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#6B7280",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {cards.map((c) => c.card?.name).join(" · ")}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {!compareMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  /* share */
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  color: "#7C3AED",
                  borderRadius: 6,
                }}
              >
                <Share2 size={15} />
              </button>
              {confirmDelete ? (
                <div
                  style={{ display: "flex", gap: 6 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onDelete(reading.id)}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "#7F1D1D",
                      color: "#FCA5A5",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "transparent",
                      color: "#9B7FD4",
                      border: "1px solid rgba(139,92,246,0.3)",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 6,
                    color: "#6B7280",
                    borderRadius: 6,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </>
          )}
          {!compareMode &&
            (expanded ? (
              <ChevronUp size={16} style={{ color: "#9B7FD4" }} />
            ) : (
              <ChevronDown size={16} style={{ color: "#9B7FD4" }} />
            ))}
        </div>
      </button>

      {/* Expanded Content */}
      {!compareMode && expanded && (
        <div
          ref={shareRef}
          style={{
            borderTop: "1px solid rgba(139,92,246,0.15)",
            padding: "20px 24px",
            background: "#0F0A1E",
          }}
        >
          {/* Full-size card images */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {cards.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 114,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid rgba(139,92,246,0.3)",
                    boxShadow: "0 0 14px 3px rgba(124,58,237,0.25)",
                  }}
                >
                  <img
                    src={TAROT_IMAGES[c.card?.id]}
                    alt={c.card?.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: c.isReversed ? "rotate(180deg)" : "none",
                    }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "#C4B5FD",
                    textAlign: "center",
                    maxWidth: 76,
                  }}
                >
                  {c.position || c.card?.name}
                </p>
                {c.isReversed && (
                  <span
                    style={{
                      fontSize: 9,
                      background: "#78350F",
                      color: "#FCD34D",
                      padding: "1px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Rev.
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* AI Narrative */}
          {reading.ai_narrative && (
            <div
              style={{
                background: "rgba(76,29,149,0.2)",
                borderRadius: 12,
                padding: 16,
                borderLeft: "3px solid #7C3AED",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#A78BFA",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                ✦ AI Narrative
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#E9D5FF",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                {reading.ai_narrative}
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9B7FD4",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Journal Notes
              </p>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "transparent",
                    border: "none",
                    color: "#9B7FD4",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <div>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Write your personal reflection here…"
                  style={{
                    width: "100%",
                    minHeight: 100,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    borderRadius: 10,
                    padding: 12,
                    color: "#E9D5FF",
                    fontSize: 13,
                    lineHeight: 1.7,
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => {
                      onUpdateNotes(reading.id, notesDraft);
                      setEditingNotes(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "#4F46E5",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Check size={13} /> Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingNotes(false);
                      setNotesDraft(reading.notes || "");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "transparent",
                      color: "#9B7FD4",
                      border: "1px solid rgba(139,92,246,0.3)",
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: reading.notes ? "#D1D5DB" : "#4B5563",
                  lineHeight: 1.75,
                  fontStyle: reading.notes ? "normal" : "italic",
                }}
              >
                {reading.notes ||
                  "No notes yet. Click Edit to add your reflections."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Journal Page ──────────────────────────────────────────────────────────────
export default function JournalPage() {
  const queryClient = useQueryClient();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareReading, setCompareReading] = useState(null); // { a, b }

  const {
    data: readings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const res = await fetch("/api/readings");
      if (!res.ok) throw new Error("Failed to load readings");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      const res = await fetch(`/api/readings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });

  const handleUpdateNotes = useCallback(
    (id, notes) => {
      updateNotesMutation.mutate({ id, notes });
    },
    [updateNotesMutation],
  );

  const toggleCompareSelect = (id) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, id];
    });
  };

  const openCompare = () => {
    const [idA, idB] = selectedForCompare;
    const a = readings.find((r) => r.id === idA);
    const b = readings.find((r) => r.id === idB);
    if (a && b) setCompareReading({ a, b });
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedForCompare([]);
  };

  const handleExportPDF = () => {
    if (typeof window !== "undefined") window.print();
  };

  // Filter readings by selected date
  const filteredReadings = selectedDate
    ? readings.filter((r) => {
        const readingDate = new Date(r.created_at).toISOString().split("T")[0];
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        return readingDate === selectedDateStr;
      })
    : readings;

  // Create dates with readings for calendar
  const datesWithReadings = readings.map(
    (r) => new Date(r.created_at.split("T")[0]),
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      {/* Compare Modal */}
      {compareReading && (
        <CompareModal
          readingA={compareReading.a}
          readingB={compareReading.b}
          onClose={() => setCompareReading(null)}
        />
      )}

      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div style={{ flex: 1 }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#9B7FD4",
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              <ChevronLeft size={14} /> Back to Archive
            </a>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              Reading Journal
            </h1>
            <p style={{ margin: "6px 0 0", color: "#9B7FD4", fontSize: 14 }}>
              Your saved readings and reflections
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {/* Compare mode controls */}
            {compareMode ? (
              <>
                <span style={{ fontSize: 13, color: "#9B7FD4" }}>
                  {selectedForCompare.length}/2 selected
                </span>
                <button
                  onClick={openCompare}
                  disabled={selectedForCompare.length < 2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    background:
                      selectedForCompare.length === 2
                        ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                        : "rgba(124,58,237,0.15)",
                    color: selectedForCompare.length === 2 ? "#fff" : "#6B7280",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor:
                      selectedForCompare.length === 2
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <GitCompare size={14} /> Compare
                </button>
                <button
                  onClick={exitCompareMode}
                  style={{
                    padding: "9px 14px",
                    background: "transparent",
                    color: "#9B7FD4",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: 10,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Calendar filter */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      background: selectedDate
                        ? "rgba(124,58,237,0.3)"
                        : "rgba(255,255,255,0.05)",
                      border: selectedDate
                        ? "1px solid #7C3AED"
                        : "1px solid rgba(139,92,246,0.2)",
                      borderRadius: 12,
                      color: selectedDate ? "#C4B5FD" : "#9B7FD4",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <CalendarIcon size={16} />
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Filter"}
                  </button>
                  {showCalendar && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "#1C1332",
                        border: "1px solid rgba(139,92,246,0.3)",
                        borderRadius: 12,
                        padding: 16,
                        zIndex: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      }}
                    >
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setShowCalendar(false);
                        }}
                        modifiers={{
                          hasReading: datesWithReadings,
                        }}
                        modifiersStyles={{
                          hasReading: {
                            fontWeight: "bold",
                            textDecoration: "underline",
                            color: "#C4B5FD",
                          },
                        }}
                        styles={{
                          caption: { color: "#E9D5FF" },
                          head_cell: { color: "#9B7FD4" },
                          cell: { color: "#E9D5FF" },
                          day: { color: "#E9D5FF" },
                          day_selected: {
                            backgroundColor: "#7C3AED",
                            color: "#fff",
                          },
                          day_today: { color: "#C4B5FD", fontWeight: "bold" },
                        }}
                      />
                      {selectedDate && (
                        <button
                          onClick={() => {
                            setSelectedDate(null);
                            setShowCalendar(false);
                          }}
                          style={{
                            width: "100%",
                            marginTop: 12,
                            padding: "8px",
                            background: "rgba(124,58,237,0.2)",
                            border: "1px solid #7C3AED",
                            borderRadius: 8,
                            color: "#C4B5FD",
                            cursor: "pointer",
                            fontSize: 13,
                          }}
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* Compare button */}
                <button
                  onClick={() => setCompareMode(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 12,
                    color: "#9B7FD4",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <GitCompare size={15} /> Compare
                </button>
                {/* Export PDF */}
                <button
                  onClick={handleExportPDF}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 12,
                    color: "#9B7FD4",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <Download size={15} /> Export PDF
                </button>
                <a
                  href="/reading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                    color: "#fff",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                  }}
                >
                  <Sparkles size={15} /> New Reading
                </a>
              </>
            )}
          </div>
        </div>

        {/* Stats bar */}
        {readings.length > 0 && !compareMode && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Readings", value: readings.length },
              {
                label: "This Month",
                value: readings.filter(
                  (r) =>
                    new Date(r.created_at).getMonth() === new Date().getMonth(),
                ).length,
              },
              {
                label: "With Notes",
                value: readings.filter((r) => r.notes).length,
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#C4B5FD",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{ margin: "3px 0 0", fontSize: 11, color: "#6B7280" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {compareMode && (
          <div
            style={{
              marginBottom: 20,
              padding: "14px 18px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: "#C4B5FD" }}>
              <GitCompare
                size={15}
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              Select 2 readings to compare them side by side — see how themes
              and cards evolved over time.
            </p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 12,
            }}
          >
            <Sparkles size={24} style={{ color: "#7C3AED" }} />
            <span style={{ color: "#9B7FD4", fontSize: 15 }}>
              Loading your readings…
            </span>
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#F87171" }}
          >
            Failed to load readings. Please try again.
          </div>
        ) : filteredReadings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <BookOpen
              size={40}
              style={{ color: "#4C1D95", marginBottom: 16 }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#C4B5FD",
                marginBottom: 8,
              }}
            >
              {selectedDate ? "No readings on this date" : "No readings yet"}
            </h2>
            <p
              style={{
                margin: "0 auto 24px",
                fontSize: 14,
                color: "#9B7FD4",
                maxWidth: 300,
              }}
            >
              {selectedDate
                ? "Try selecting a different date or clear the filter."
                : "Complete a reading and save it here to build your personal tarot journal."}
            </p>
            {!selectedDate && (
              <a
                href="/reading"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  background: "#4F46E5",
                  color: "#fff",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Sparkles size={15} /> Start Your First Reading
              </a>
            )}
          </div>
        ) : (
          <div>
            {filteredReadings.map((reading) => (
              <ReadingEntry
                key={reading.id}
                reading={reading}
                onDelete={(id) => deleteMutation.mutate(id)}
                onUpdateNotes={handleUpdateNotes}
                compareMode={compareMode}
                isSelectedForCompare={selectedForCompare.includes(reading.id)}
                onToggleCompare={toggleCompareSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Print/PDF styles */}
      <style jsx global>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          nav, button, a[href="/reading"], .no-print { display: none !important; }
          [style*="background: #0F0A1E"], [style*="background:#0F0A1E"] { background: #fff !important; }
          [style*="color: #E9D5FF"], [style*="color:#E9D5FF"] { color: #1a1a1a !important; }
          [style*="color: #9B7FD4"], [style*="color:#9B7FD4"] { color: #555 !important; }
          [style*="color: #C4B5FD"], [style*="color:#C4B5FD"] { color: #333 !important; }
          [style*="color: #D1D5DB"], [style*="color:#D1D5DB"] { color: #444 !important; }
          [style*="border: 1px solid rgba(139,92,246"] { border-color: #ccc !important; }
        }
      `}</style>
    </div>
  );
}
