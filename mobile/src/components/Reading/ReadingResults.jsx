import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RotateCcw, BookOpen, Volume2, VolumeX } from "lucide-react-native";
import { FlipCard } from "./FlipCard";
import { AIReadingPanel } from "./AIReadingPanel";
import { tarotImages } from "@/data/tarot-images";

// ── Yes/No Verdict ────────────────────────────────────────────────────────────
const YES_CARD_IDS = new Set([
  "the_fool",
  "the_magician",
  "the_empress",
  "the_emperor",
  "the_lovers",
  "the_chariot",
  "strength",
  "wheel_of_fortune",
  "the_star",
  "the_sun",
  "judgement",
  "the_world",
  "ace_of_wands",
  "ace_of_cups",
  "ace_of_pentacles",
  "three_of_cups",
  "four_of_wands",
  "six_of_wands",
  "six_of_pentacles",
  "nine_of_cups",
  "ten_of_cups",
  "ten_of_pentacles",
  "two_of_cups",
  "page_of_cups",
]);
const NO_CARD_IDS = new Set([
  "the_tower",
  "the_moon",
  "the_hanged_man",
  "the_devil",
  "death",
  "five_of_cups",
  "five_of_pentacles",
  "five_of_swords",
  "five_of_wands",
  "seven_of_swords",
  "eight_of_swords",
  "nine_of_swords",
  "ten_of_swords",
  "three_of_swords",
]);

function getYesNoVerdict(cardId, isReversed) {
  if (!isReversed && YES_CARD_IDS.has(cardId))
    return {
      verdict: "YES",
      color: "#34D399",
      msg: "The cards align in your favor. Trust yourself and move forward.",
    };
  if (!isReversed && NO_CARD_IDS.has(cardId))
    return {
      verdict: "NO",
      color: "#F87171",
      msg: "The cards counsel caution. Reflect before proceeding.",
    };
  return {
    verdict: "MAYBE",
    color: "#FBBF24",
    msg: "The answer is uncertain. Gather more clarity before deciding.",
  };
}

function YesNoPanel({ card, isReversed }) {
  const { verdict, color, msg } = getYesNoVerdict(card.id, isReversed);
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: `${color}50`,
        backgroundColor: `${color}18`,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "#9B7FD4",
          letterSpacing: 1.5,
          marginBottom: 10,
        }}
      >
        THE VERDICT
      </Text>
      <Text
        style={{ fontSize: 52, fontWeight: "900", color, marginBottom: 10 }}
      >
        {verdict}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#D1D5DB",
          lineHeight: 22,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {msg}
      </Text>
      {isReversed && (
        <Text style={{ marginTop: 8, fontSize: 12, color: "#9B7FD4" }}>
          ↕ Card reversed — energy may be delayed
        </Text>
      )}
    </View>
  );
}

export function ReadingResults({
  drawnCards,
  spread,
  saveError,
  savedId,
  saving,
  ambientEnabled,
  onSaveReading,
  onToggleAmbient,
  onReset,
  onNewReading,
  moonPhaseName,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0F0A1E", paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <View
        style={{
          backgroundColor: "#1C1332",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139,92,246,0.2)",
          paddingHorizontal: 20,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#E9D5FF" }}>
            {spread.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#9B7FD4" }}>
            Tap each card to reveal it
          </Text>
          {/* Moon phase badge for daily */}
          {spread.id === "daily" && moonPhaseName && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 4,
              }}
            >
              <Text style={{ fontSize: 12 }}>🌙</Text>
              <Text style={{ fontSize: 11, color: "#C4B5FD" }}>
                {moonPhaseName}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={onToggleAmbient}
            activeOpacity={0.8}
            style={{
              padding: 7,
              backgroundColor: ambientEnabled
                ? "rgba(124,58,237,0.3)"
                : "rgba(124,58,237,0.1)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: ambientEnabled
                ? "rgba(139,92,246,0.5)"
                : "rgba(139,92,246,0.3)",
            }}
          >
            {ambientEnabled ? (
              <Volume2 size={16} color="#C4B5FD" />
            ) : (
              <VolumeX size={16} color="#9B7FD4" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={savedId ? undefined : onSaveReading}
            disabled={saving}
            activeOpacity={savedId ? 1 : 0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingHorizontal: 12,
              paddingVertical: 7,
              backgroundColor: savedId
                ? "rgba(124,58,237,0.2)"
                : "rgba(124,58,237,0.15)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: savedId
                ? "rgba(139,92,246,0.5)"
                : "rgba(139,92,246,0.3)",
            }}
          >
            <BookOpen size={14} color={savedId ? "#C4B5FD" : "#9B7FD4"} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: savedId ? "#C4B5FD" : saving ? "#6B7280" : "#9B7FD4",
              }}
            >
              {savedId ? "Saved ✓" : saving ? "Saving…" : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReset}
            activeOpacity={0.7}
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.3)",
              borderRadius: 8,
            }}
          >
            <RotateCcw size={18} color="#9B7FD4" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {saveError && (
          <Text
            style={{
              color: "#F87171",
              fontSize: 12,
              textAlign: "center",
              paddingTop: 8,
            }}
          >
            {saveError}
          </Text>
        )}

        {/* Flip Cards */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: 20,
            gap: 12,
          }}
        >
          {drawnCards.map((drawn, index) => (
            <FlipCard
              key={index}
              card={drawn.card}
              isReversed={drawn.isReversed}
              position={spread.positions[index]}
            />
          ))}
        </View>

        {/* Yes/No Verdict Panel */}
        {spread.id === "yes-no" && drawnCards[0] && (
          <YesNoPanel
            card={drawnCards[0].card}
            isReversed={drawnCards[0].isReversed}
          />
        )}

        <AIReadingPanel drawnCards={drawnCards} spread={spread} />

        {/* Card Meanings */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#C4B5FD",
              marginBottom: 16,
            }}
          >
            Card Meanings
          </Text>
          {drawnCards.map((drawn, index) => {
            const orient = drawn.isReversed
              ? drawn.card.reversed
              : drawn.card.upright;
            return (
              <View
                key={index}
                style={{
                  borderBottomWidth: index < drawnCards.length - 1 ? 1 : 0,
                  borderBottomColor: "rgba(139,92,246,0.15)",
                  paddingBottom: 16,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {/* Card image thumbnail */}
                  <View
                    style={{
                      width: 48,
                      height: 76,
                      borderRadius: 7,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "rgba(139,92,246,0.3)",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      source={{ uri: tarotImages[drawn.card.id] }}
                      style={{ width: 48, height: 76 }}
                      contentFit="cover"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#E9D5FF",
                        marginBottom: 6,
                      }}
                    >
                      {spread.positions[index].name}: {drawn.card.name}
                      {drawn.isReversed && (
                        <Text style={{ fontWeight: "400", color: "#9CA3AF" }}>
                          {" "}
                          (Reversed)
                        </Text>
                      )}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      {orient.keywords.map((kw, i) => (
                        <View
                          key={i}
                          style={{
                            backgroundColor: "rgba(109,40,217,0.2)",
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ fontSize: 11, color: "#A78BFA" }}>
                            {kw}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 21 }}
                    >
                      {orient.meaning}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={onNewReading}
          activeOpacity={0.8}
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: "#7C3AED",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <RotateCcw size={15} color="#C4B5FD" />
          <Text style={{ color: "#C4B5FD", fontWeight: "700", fontSize: 15 }}>
            New Reading
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
