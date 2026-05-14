import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Sparkles, Check } from "lucide-react-native";

export function MethodSelection({
  spread,
  isDrawing,
  onBack,
  onRandomDraw,
  onManualPick,
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
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#C4B5FD" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#E9D5FF" }}>
            {spread.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#9B7FD4" }}>
            {spread.description}
          </Text>
        </View>
      </View>
      {isDrawing ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <Sparkles size={48} color="#7C3AED" />
          <Text style={{ color: "#9B7FD4", fontSize: 16 }}>
            Shuffling the deck…
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
            gap: 18,
          }}
        >
          <View
            style={{
              width: 110,
              height: 170,
              backgroundColor: "#4F46E5",
              borderRadius: 14,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <Sparkles size={32} color="rgba(255,255,255,0.35)" />
          </View>
          <Text style={{ fontSize: 14, color: "#9B7FD4" }}>
            How would you like to draw?
          </Text>
          <TouchableOpacity
            onPress={onRandomDraw}
            activeOpacity={0.8}
            style={{
              width: "100%",
              backgroundColor: "#4F46E5",
              paddingVertical: 15,
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Sparkles size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Random Draw
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onManualPick}
            activeOpacity={0.8}
            style={{
              width: "100%",
              paddingVertical: 15,
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderWidth: 2,
              borderColor: "#7C3AED",
              backgroundColor: "transparent",
            }}
          >
            <Check size={18} color="#C4B5FD" />
            <Text style={{ color: "#C4B5FD", fontWeight: "700", fontSize: 16 }}>
              Pick Manually
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
