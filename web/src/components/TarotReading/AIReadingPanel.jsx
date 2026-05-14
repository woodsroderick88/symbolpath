import { useState, useCallback } from "react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";
import { Wand2, Sparkles } from "lucide-react";

export function AIReadingPanel({ drawnCards, spread, transits, moonPhase }) {
  const [narrative, setNarrative] = useState("");
  const [streaming, setStreamingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = useCallback((msg) => {
    setNarrative(msg);
    setStreamingMessage("");
    setLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setGenerated(true);
    setNarrative("");

    const cardDescriptions = drawnCards
      .map((d, i) => {
        const pos = spread.positions[i];
        const orient = d.isReversed ? d.card.reversed : d.card.upright;
        return `Position ${i + 1} — ${pos.name}: ${d.card.name}${d.isReversed ? " (Reversed)" : ""}. Keywords: ${orient.keywords.join(", ")}.`;
      })
      .join("\n");

    // Build transit context if available
    let transitContext = "";
    if (transits && transits.length > 0) {
      const retroList = transits
        .map((t) => `${t.planet} is retrograde (influences ${t.influence})`)
        .join("; ");
      transitContext = `\n\nCurrent planetary transits: ${retroList}. Weave these astrological influences subtly into your interpretation where relevant.`;
    }

    let moonContext = "";
    if (moonPhase) {
      moonContext = `\nThe current moon phase is ${moonPhase}. Let this lunar energy color your reading.`;
    }

    const systemPrompt = `You are a wise and compassionate tarot reader with deep knowledge of the Rider-Waite deck and astrology. Speak in a mystical yet grounded tone. Write flowing, poetic prose — not bullet points. Keep the narrative to 3-5 sentences.${transitContext}${moonContext}`;
    const userPrompt = `Please give a unified, flowing tarot reading for this ${spread.name} spread:\n\n${cardDescriptions}\n\nWeave the cards together into one cohesive narrative that tells a story.`;

    try {
      const res = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      });
      if (!res.ok) throw new Error("AI request failed");
      handleStreamResponse(res);
    } catch (e) {
      console.error(e);
      setError("Could not generate AI reading. Please try again.");
      setLoading(false);
    }
  };

  const displayed = narrative || streaming;

  return (
    <div
      style={{
        marginTop: 20,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(139,92,246,0.35)",
        background:
          "linear-gradient(135deg,rgba(76,29,149,0.3),rgba(30,10,60,0.4))",
      }}
    >
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Wand2 size={18} style={{ color: "#A78BFA" }} />
          <span
            style={{
              color: "#C4B5FD",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.05em",
            }}
          >
            AI NARRATIVE READING
          </span>
        </div>
        {!generated && (
          <button
            onClick={generate}
            style={{
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Sparkles size={14} />
            Generate
          </button>
        )}
        {generated && !loading && (
          <button
            onClick={() => {
              setGenerated(false);
              setNarrative("");
            }}
            style={{
              background: "transparent",
              color: "#9B7FD4",
              border: "1px solid #4C1D95",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Regenerate
          </button>
        )}
      </div>

      {generated && (
        <div style={{ padding: 24 }}>
          {loading && !displayed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#9B7FD4",
              }}
            >
              <Sparkles
                size={16}
                style={{ animation: "spin 1.5s linear infinite" }}
              />
              <span style={{ fontSize: 14, fontStyle: "italic" }}>
                The cards are speaking…
              </span>
            </div>
          )}
          {error && <p style={{ color: "#F87171", fontSize: 14 }}>{error}</p>}
          {displayed && (
            <p
              style={{
                color: "#E9D5FF",
                fontSize: 15,
                lineHeight: 1.85,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {displayed}
              {loading && (
                <span
                  style={{
                    opacity: 0.5,
                    animation: "blink 1s step-start infinite",
                  }}
                >
                  ▌
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
