import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wand2, Sparkles } from "lucide-react-native";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export function AIReadingPanel({ drawnCards, spread }) {
  const [narrative, setNarrative] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = useCallback((msg) => {
    setNarrative(msg);
    setStreaming("");
    setLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreaming,
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
    try {
      const res = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a wise, compassionate tarot reader. Speak in mystical yet grounded prose. Write 3-5 flowing sentences — no bullet points.",
            },
            {
              role: "user",
              content: `Give a unified tarot reading for this ${spread.name} spread:\n\n${cardDescriptions}\n\nWeave the cards into one cohesive narrative.`,
            },
          ],
          stream: true,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      handleStreamResponse(res);
    } catch (e) {
      console.error(e);
      setError("Could not generate. Please try again.");
      setLoading(false);
    }
  };

  const displayed = narrative || streaming;

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(139,92,246,0.35)",
        backgroundColor: "rgba(76,29,149,0.2)",
      }}
    >
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: generated ? 1 : 0,
          borderBottomColor: "rgba(139,92,246,0.2)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Wand2 size={16} color="#A78BFA" />
          <Text
            style={{
              color: "#C4B5FD",
              fontWeight: "700",
              fontSize: 13,
              letterSpacing: 0.5,
            }}
          >
            AI NARRATIVE
          </Text>
        </View>
        {!generated ? (
          <TouchableOpacity
            onPress={generate}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#4F46E5",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
            }}
          >
            <Sparkles size={13} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
              Generate
            </Text>
          </TouchableOpacity>
        ) : !loading ? (
          <TouchableOpacity
            onPress={() => {
              setGenerated(false);
              setNarrative("");
            }}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.4)",
            }}
          >
            <Text style={{ color: "#9B7FD4", fontSize: 12 }}>Regenerate</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {generated && (
        <View style={{ padding: 16 }}>
          {loading && !displayed && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Sparkles size={14} color="#9B7FD4" />
              <Text
                style={{ color: "#9B7FD4", fontSize: 13, fontStyle: "italic" }}
              >
                The cards are speaking…
              </Text>
            </View>
          )}
          {error ? (
            <Text style={{ color: "#F87171", fontSize: 13 }}>{error}</Text>
          ) : null}
          {displayed ? (
            <Text
              style={{
                color: "#E9D5FF",
                fontSize: 14,
                lineHeight: 24,
                fontStyle: "italic",
              }}
            >
              {displayed}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
