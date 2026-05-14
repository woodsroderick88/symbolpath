import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Sparkles, Layers } from "lucide-react-native";

export function OracleResultScreen({
  oracleResult,
  onDrawAnother,
  onSwitchToTarot,
  onBack,
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
            {oracleResult.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#9B7FD4" }}>
            {oracleResult.deck}
          </Text>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 80,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#4F46E5",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <Sparkles size={40} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "rgba(124,58,237,0.15)",
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.35)",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#E9D5FF",
              fontSize: 17,
              lineHeight: 28,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {oracleResult.meaning}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDrawAnother}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#4F46E5",
            paddingVertical: 15,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Sparkles size={18} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Draw Another
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSwitchToTarot}
          activeOpacity={0.8}
          style={{
            paddingVertical: 15,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: "#7C3AED",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Layers size={18} color="#C4B5FD" />
          <Text style={{ color: "#C4B5FD", fontWeight: "700", fontSize: 16 }}>
            Switch to Tarot
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
