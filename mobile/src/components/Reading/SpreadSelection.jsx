import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Sparkles, Layers } from "lucide-react-native";
import { SPREAD_TYPES, SPREAD_CATEGORIES } from "@/data/spreads";

export function SpreadSelection({
  spreadFilter,
  onFilterChange,
  onSelectSpread,
  onSwitchToOracle,
}) {
  const insets = useSafeAreaInsets();

  const filteredSpreads =
    spreadFilter === "all"
      ? SPREAD_TYPES
      : SPREAD_TYPES.filter((s) => s.category === spreadFilter);

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
            Tarot Reading
          </Text>
          <Text style={{ fontSize: 14, color: "#9B7FD4", marginTop: 4 }}>
            Choose a spread to begin
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSwitchToOracle}
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
          <Layers size={14} color="#C4B5FD" />
          <Text style={{ color: "#C4B5FD", fontWeight: "600", fontSize: 12 }}>
            Oracle
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139,92,246,0.1)",
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {SPREAD_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onFilterChange(cat.id)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                spreadFilter === cat.id ? "#7C3AED" : "rgba(139,92,246,0.1)",
              borderWidth: 1,
              borderColor:
                spreadFilter === cat.id ? "#7C3AED" : "rgba(139,92,246,0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: spreadFilter === cat.id ? "700" : "500",
                color: spreadFilter === cat.id ? "#FFFFFF" : "#9B7FD4",
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredSpreads.map((spread) => (
          <TouchableOpacity
            key={spread.id}
            onPress={() => onSelectSpread(spread.id)}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: "#C4B5FD",
                  }}
                >
                  {spread.name}
                </Text>
                {spread.category === "lunar" && (
                  <Text style={{ fontSize: 14 }}>🌙</Text>
                )}
                {spread.category === "spiritual" && (
                  <Text style={{ fontSize: 14 }}>✨</Text>
                )}
              </View>
              <Text style={{ fontSize: 13, color: "#9B7FD4", marginTop: 2 }}>
                {spread.description}
              </Text>
              <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                {spread.positions.length} card
                {spread.positions.length > 1 ? "s" : ""} · {spread.category}
              </Text>
            </View>
            <Sparkles size={20} color="#7C3AED" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
