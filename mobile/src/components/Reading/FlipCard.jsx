import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Image } from "expo-image";
import { Sparkles } from "lucide-react-native";
import { tarotImages } from "@/data/tarot-images";
import * as Haptics from "expo-haptics";

export function FlipCard({ card, isReversed, position }) {
  const [revealed, setRevealed] = useState(false);
  const [showingFront, setShowingFront] = useState(false);
  const scaleX = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const imageUrl = tarotImages[card.id];

  const startGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };

  const handleFlip = () => {
    if (revealed) return;
    setRevealed(true);
    // Haptic feedback on flip start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(scaleX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setShowingFront(true);
      // Haptic feedback on card reveal
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.timing(scaleX, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start(() => startGlow());
    });
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });
  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 22],
  });

  return (
    <View style={{ alignItems: "center", marginBottom: 12 }}>
      <TouchableOpacity
        onPress={handleFlip}
        activeOpacity={0.88}
        disabled={revealed}
      >
        <Animated.View
          style={{
            transform: [{ scaleX }],
            width: 96,
            height: 152,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {!showingFront ? (
            <View
              style={{
                flex: 1,
                backgroundColor: "#4F46E5",
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.12)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={26} color="rgba(255,255,255,0.4)" />
              {!revealed && (
                <Text
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 10,
                    marginTop: 6,
                    fontWeight: "500",
                  }}
                >
                  Tap to reveal
                </Text>
              )}
            </View>
          ) : (
            <Animated.View
              style={{
                flex: 1,
                shadowColor: "#7C3AED",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: glowOpacity,
                shadowRadius: glowRadius,
                elevation: 12,
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  transform: [{ rotate: isReversed ? "180deg" : "0deg" }],
                  flex: 1,
                }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 96, height: 152, borderRadius: 12 }}
                  contentFit="cover"
                  transition={200}
                />
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
      <View style={{ marginTop: 8, alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#C4B5FD" }}>
          {position.name}
        </Text>
        {showingFront && isReversed && (
          <View
            style={{
              marginTop: 3,
              backgroundColor: "#78350F",
              paddingHorizontal: 7,
              paddingVertical: 2,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, color: "#FCD34D", fontWeight: "500" }}>
              Reversed
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
