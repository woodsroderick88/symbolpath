import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Check } from "lucide-react-native";
import { tarotCards } from "@/data/tarot-cards";

export function ManualPickScreen({ spread, onConfirm, onBack }) {
  const [selected, setSelected] = useState([]);
  const insets = useSafeAreaInsets();
  const limit = spread.positions.length;

  const toggleCard = (card) => {
    const exists = selected.find((c) => c.id === card.id);
    if (exists) setSelected(selected.filter((c) => c.id !== card.id));
    else if (selected.length < limit) setSelected([...selected, card]);
  };

  const handleConfirm = () => {
    if (selected.length !== limit) return;
    onConfirm(
      selected.map((card) => ({ card, isReversed: Math.random() > 0.5 })),
    );
  };

  const renderCard = ({ item }) => {
    const isSelected = !!selected.find((c) => c.id === item.id);
    const isDisabled = !isSelected && selected.length >= limit;
    return (
      <TouchableOpacity
        onPress={() => toggleCard(item)}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={{
          flex: 1,
          margin: 4,
          paddingVertical: 10,
          paddingHorizontal: 6,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isSelected ? "#7C3AED" : "rgba(139,92,246,0.2)",
          backgroundColor: isSelected
            ? "rgba(124,58,237,0.2)"
            : "rgba(255,255,255,0.03)",
          alignItems: "center",
          opacity: isDisabled ? 0.35 : 1,
        }}
      >
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "#7C3AED",
              borderRadius: 9,
              width: 18,
              height: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={10} color="#fff" />
          </View>
        )}
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: isSelected ? "#C4B5FD" : "#9CA3AF",
            textAlign: "center",
            lineHeight: 15,
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 3 }}>
          {item.arcana === "major" ? "Major" : item.suit}
        </Text>
      </TouchableOpacity>
    );
  };

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
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#C4B5FD" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}>
            Pick Your Cards
          </Text>
          <Text style={{ fontSize: 12, color: "#9B7FD4" }}>
            {selected.length} of {limit} selected
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={selected.length !== limit}
          activeOpacity={0.8}
          style={{
            backgroundColor:
              selected.length === limit ? "#4F46E5" : "rgba(139,92,246,0.15)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: selected.length === limit ? "#fff" : "#4B5563",
              fontWeight: "700",
              fontSize: 13,
            }}
          >
            Reveal
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          paddingVertical: 10,
          backgroundColor: "#1C1332",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139,92,246,0.15)",
        }}
      >
        {spread.positions.map((pos, i) => (
          <View key={i} style={{ alignItems: "center", gap: 3 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i < selected.length ? "#7C3AED" : "#2D1F5E",
              }}
            />
            <Text style={{ fontSize: 9, color: "#6B7280" }}>{pos.name}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={tarotCards}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderCard}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
