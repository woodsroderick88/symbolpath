import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Sparkles } from "lucide-react-native";
import { oracleDecks } from "@/data/oracle-decks";

export function OracleDeckSelection({ onSelectDeck, onSwitchToTarot }) {
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
          paddingHorizontal: 24,
          paddingVertical: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#E9D5FF" }}>
            Oracle Reading
          </Text>
          <Text style={{ fontSize: 14, color: "#9B7FD4", marginTop: 4 }}>
            Choose an oracle deck
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSwitchToTarot}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.3)",
            backgroundColor: "rgba(139,92,246,0.1)",
          }}
        >
          <Text style={{ color: "#C4B5FD", fontWeight: "600", fontSize: 12 }}>
            Tarot
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {oracleDecks.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            onPress={() => onSelectDeck(deck.id)}
            activeOpacity={0.7}
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.25)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#C4B5FD",
                  marginBottom: 4,
                }}
              >
                {deck.name}
              </Text>
              <Text style={{ fontSize: 13, color: "#9B7FD4", marginTop: 2 }}>
                {deck.description}
              </Text>
              <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                {deck.cards.length} cards · {deck.theme}
              </Text>
            </View>
            <Sparkles size={20} color="#7C3AED" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
