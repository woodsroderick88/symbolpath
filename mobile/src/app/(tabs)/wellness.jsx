import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Heart,
  Wind,
  Smile,
  Sparkles,
  Play,
  Pause,
  Volume2,
} from "lucide-react-native";

export default function WellnessScreen() {
  const insets = useSafeAreaInsets();
  const [affirmation, setAffirmation] = useState("");
  const [breathingExercise, setBreathingExercise] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [moodBefore, setMoodBefore] = useState("");
  const [moodAfter, setMoodAfter] = useState("");
  const [notes, setNotes] = useState("");
  const breathScale = useRef(new Animated.Value(1)).current;
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadDailyAffirmation();
    loadBreathingExercise();
  }, []);

  useEffect(() => {
    if (isBreathing && breathingExercise) {
      runBreathingCycle();
    }
  }, [isBreathing, breathPhase]);

  const loadDailyAffirmation = async () => {
    try {
      const response = await fetch("/api/wellness/affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardName: "The Star",
          cardMeaning: "Hope, inspiration, and spiritual guidance",
        }),
      });
      const data = await response.json();
      setAffirmation(data.affirmation);
    } catch (error) {
      console.error("Error loading affirmation:", error);
      setAffirmation("I am open to the wisdom of the universe.");
    }
  };

  const loadBreathingExercise = async () => {
    try {
      const response = await fetch("/api/wellness/breathing?cardName=The Star");
      const data = await response.json();
      setBreathingExercise(data);
    } catch (error) {
      console.error("Error loading breathing exercise:", error);
    }
  };

  const runBreathingCycle = () => {
    if (!breathingExercise || !isBreathing) return;

    const currentPhase =
      breathingExercise.pattern[breathPhase % breathingExercise.pattern.length];

    Animated.timing(breathScale, {
      toValue:
        currentPhase.phase === "inhale"
          ? 1.3
          : currentPhase.phase === "exhale"
            ? 0.8
            : 1,
      duration: currentPhase.duration * 1000,
      useNativeDriver: true,
    }).start(() => {
      if (isBreathing) {
        setBreathPhase((prev) => prev + 1);
      }
    });
  };

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathPhase(0);
    }
  };

  const speakAffirmation = () => {
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(affirmation);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      // Native iOS/Android — expo-speech is not available, show affirmation prominently
      alert("🔮 " + affirmation);
    }
  };

  const saveMoodLog = async () => {
    try {
      await fetch("/api/mood-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          moodBefore,
          moodAfter,
          affirmation,
          notes,
        }),
      });

      setMoodBefore("");
      setMoodAfter("");
      setNotes("");
      alert("Mood logged successfully!");
    } catch (error) {
      console.error("Error saving mood log:", error);
    }
  };

  const getCurrentInstruction = () => {
    if (!breathingExercise || !isBreathing) return "Tap play to begin";
    const currentPhase =
      breathingExercise.pattern[breathPhase % breathingExercise.pattern.length];
    return currentPhase.instruction;
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0a0a0f", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <View
        style={{ padding: 20, borderBottomWidth: 1, borderColor: "#1a1a2e" }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#fff",
            marginBottom: 4,
          }}
        >
          Wellness
        </Text>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>
          Mindfulness and self-care practices
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
      >
        <View
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#4a1d96",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Sparkles size={24} color="#fbbf24" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#fff",
                marginLeft: 8,
              }}
            >
              Daily Affirmation
            </Text>
          </View>

          <Text
            style={{
              color: "#d1d5db",
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 16,
              fontStyle: "italic",
            }}
          >
            "{affirmation}"
          </Text>

          <TouchableOpacity
            onPress={speakAffirmation}
            style={{
              backgroundColor: isSpeaking ? "#dc2626" : "#4a1d96",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Volume2 size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              {isSpeaking ? "Stop Speaking" : "Listen to Affirmation"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#2a2a4e",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Wind size={24} color="#60a5fa" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#fff",
                marginLeft: 8,
              }}
            >
              Breathing Exercise
            </Text>
          </View>

          {breathingExercise && (
            <>
              <Text
                style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}
              >
                {breathingExercise.description}
              </Text>

              <View style={{ alignItems: "center", marginVertical: 24 }}>
                <Animated.View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "#4a1d96",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ scale: breathScale }],
                  }}
                >
                  <Wind size={48} color="#fff" />
                </Animated.View>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "600",
                    marginTop: 16,
                  }}
                >
                  {getCurrentInstruction()}
                </Text>
              </View>

              <TouchableOpacity
                onPress={toggleBreathing}
                style={{
                  backgroundColor: isBreathing ? "#dc2626" : "#4a1d96",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isBreathing ? (
                  <Pause size={20} color="#fff" />
                ) : (
                  <Play size={20} color="#fff" />
                )}
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  {isBreathing ? "Stop" : "Start"} Exercise
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#2a2a4e",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Smile size={24} color="#a78bfa" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#fff",
                marginLeft: 8,
              }}
            >
              Mood Tracker
            </Text>
          </View>

          <Text style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>
            How are you feeling?
          </Text>

          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ color: "#d1d5db", fontSize: 12, marginBottom: 6 }}>
                Before Practice
              </Text>
              <TextInput
                value={moodBefore}
                onChangeText={setMoodBefore}
                placeholder="e.g., Anxious, Scattered"
                placeholderTextColor="#6b7280"
                style={{
                  backgroundColor: "#0a0a0f",
                  color: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              />
            </View>

            <View>
              <Text style={{ color: "#d1d5db", fontSize: 12, marginBottom: 6 }}>
                After Practice
              </Text>
              <TextInput
                value={moodAfter}
                onChangeText={setMoodAfter}
                placeholder="e.g., Calm, Centered"
                placeholderTextColor="#6b7280"
                style={{
                  backgroundColor: "#0a0a0f",
                  color: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              />
            </View>

            <View>
              <Text style={{ color: "#d1d5db", fontSize: 12, marginBottom: 6 }}>
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any insights or reflections..."
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: "#0a0a0f",
                  color: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                  height: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>

            <TouchableOpacity
              onPress={saveMoodLog}
              disabled={!moodBefore && !moodAfter}
              style={{
                backgroundColor:
                  !moodBefore && !moodAfter ? "#2a2a4e" : "#4a1d96",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                Log Mood
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
