import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";

export default function MoonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [moonData, setMoonData] = useState(null);
  const [rituals, setRituals] = useState([]);
  const [intentions, setIntentions] = useState([]);
  const [showRitualForm, setShowRitualForm] = useState(false);
  const [showIntentionForm, setShowIntentionForm] = useState(false);
  const [ritualTitle, setRitualTitle] = useState("");
  const [ritualDescription, setRitualDescription] = useState("");
  const [intentionText, setIntentionText] = useState("");

  useEffect(() => {
    fetchMoonData();
    fetchRituals();
    fetchIntentions();
  }, []);

  const fetchMoonData = async () => {
    try {
      const response = await fetch("/api/moon");
      if (!response.ok) throw new Error("Failed to fetch moon data");
      const data = await response.json();
      setMoonData(data);
    } catch (error) {
      console.error("Error fetching moon data:", error);
    }
  };

  const fetchRituals = async () => {
    try {
      const response = await fetch("/api/rituals");
      if (!response.ok) throw new Error("Failed to fetch rituals");
      const data = await response.json();
      setRituals(data.rituals || []);
    } catch (error) {
      console.error("Error fetching rituals:", error);
    }
  };

  const fetchIntentions = async () => {
    try {
      const response = await fetch("/api/intentions");
      if (!response.ok) throw new Error("Failed to fetch intentions");
      const data = await response.json();
      setIntentions(data.intentions || []);
    } catch (error) {
      console.error("Error fetching intentions:", error);
    }
  };

  const createRitual = async () => {
    if (!ritualTitle || !moonData) return;

    try {
      const response = await fetch("/api/rituals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moon_phase: moonData.current.name,
          title: ritualTitle,
          description: ritualDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to create ritual");

      setRitualTitle("");
      setRitualDescription("");
      setShowRitualForm(false);
      fetchRituals();
    } catch (error) {
      console.error("Error creating ritual:", error);
    }
  };

  const createIntention = async () => {
    if (!intentionText || !moonData) return;

    try {
      const response = await fetch("/api/intentions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moon_phase: moonData.current.name,
          intention: intentionText,
        }),
      });

      if (!response.ok) throw new Error("Failed to create intention");

      setIntentionText("");
      setShowIntentionForm(false);
      fetchIntentions();
    } catch (error) {
      console.error("Error creating intention:", error);
    }
  };

  const deleteRitual = async (id) => {
    try {
      const response = await fetch(`/api/rituals/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete ritual");
      fetchRituals();
    } catch (error) {
      console.error("Error deleting ritual:", error);
    }
  };

  const toggleIntention = async (intention) => {
    try {
      const response = await fetch(`/api/intentions/${intention.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !intention.completed }),
      });
      if (!response.ok) throw new Error("Failed to update intention");
      fetchIntentions();
    } catch (error) {
      console.error("Error updating intention:", error);
    }
  };

  const startMoonReading = () => {
    if (moonData?.recommendedSpread) {
      router.push({
        pathname: "/(tabs)/reading",
        params: {
          spreadId: moonData.recommendedSpread.spreadId,
          spreadName: moonData.recommendedSpread.spreadName,
          positions: JSON.stringify(moonData.recommendedSpread.positions),
        },
      });
    }
  };

  if (!moonData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0F0A1E",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="light" />
        <Text style={{ color: "#C084FC", fontSize: 16 }}>
          Loading lunar data...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0F0A1E", paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Moon Phase Display */}
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ fontSize: 80, marginBottom: 8 }}>
            {moonData.current.emoji}
          </Text>
          <Text
            style={{
              color: "#C084FC",
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {moonData.current.name}
          </Text>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            {moonData.current.description}
          </Text>
        </View>

        {/* Moon Reading Recommendation */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            backgroundColor: "#1F1535",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#7C3AED",
          }}
        >
          <Text
            style={{
              color: "#C084FC",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Recommended Reading
          </Text>
          <Text style={{ color: "#E5E7EB", fontSize: 16, marginBottom: 4 }}>
            {moonData.recommendedSpread.spreadName}
          </Text>
          <Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 12 }}>
            {moonData.recommendedSpread.theme}
          </Text>
          <TouchableOpacity
            onPress={startMoonReading}
            style={{
              backgroundColor: "#7C3AED",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
            >
              Begin Moon Reading
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Moon Phases */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: "#C084FC",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            Upcoming Phases
          </Text>
          {moonData.upcoming.map((phase, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#1F1535",
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, marginRight: 12 }}>
                {phase.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "#E5E7EB", fontSize: 16, fontWeight: "bold" }}
                >
                  {phase.name}
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                  {new Date(phase.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Intentions Section */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ color: "#C084FC", fontSize: 18, fontWeight: "bold" }}
            >
              Intentions
            </Text>
            <TouchableOpacity
              onPress={() => setShowIntentionForm(!showIntentionForm)}
            >
              <Plus color="#C084FC" size={24} />
            </TouchableOpacity>
          </View>

          {showIntentionForm && (
            <View
              style={{
                backgroundColor: "#1F1535",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <TextInput
                placeholder="Set your intention..."
                placeholderTextColor="#6B7280"
                value={intentionText}
                onChangeText={setIntentionText}
                multiline
                style={{
                  color: "#E5E7EB",
                  fontSize: 16,
                  marginBottom: 12,
                  minHeight: 60,
                }}
              />
              <TouchableOpacity
                onPress={createIntention}
                style={{
                  backgroundColor: "#7C3AED",
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  Set Intention
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {intentions.map((intention) => (
            <TouchableOpacity
              key={intention.id}
              onPress={() => toggleIntention(intention)}
              style={{
                backgroundColor: "#1F1535",
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                opacity: intention.completed ? 0.6 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#C084FC", fontSize: 12, marginBottom: 4 }}
                  >
                    {intention.moon_phase}
                  </Text>
                  <Text
                    style={{
                      color: "#E5E7EB",
                      fontSize: 16,
                      textDecorationLine: intention.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {intention.intention}
                  </Text>
                </View>
                <Text style={{ fontSize: 20 }}>
                  {intention.completed ? "✓" : "○"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rituals Section */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ color: "#C084FC", fontSize: 18, fontWeight: "bold" }}
            >
              Ritual Log
            </Text>
            <TouchableOpacity
              onPress={() => setShowRitualForm(!showRitualForm)}
            >
              <Plus color="#C084FC" size={24} />
            </TouchableOpacity>
          </View>

          {showRitualForm && (
            <View
              style={{
                backgroundColor: "#1F1535",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <TextInput
                placeholder="Ritual title..."
                placeholderTextColor="#6B7280"
                value={ritualTitle}
                onChangeText={setRitualTitle}
                style={{ color: "#E5E7EB", fontSize: 16, marginBottom: 8 }}
              />
              <TextInput
                placeholder="Description..."
                placeholderTextColor="#6B7280"
                value={ritualDescription}
                onChangeText={setRitualDescription}
                multiline
                style={{
                  color: "#E5E7EB",
                  fontSize: 14,
                  marginBottom: 12,
                  minHeight: 60,
                }}
              />
              <TouchableOpacity
                onPress={createRitual}
                style={{
                  backgroundColor: "#7C3AED",
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  Save Ritual
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {rituals.map((ritual) => (
            <View
              key={ritual.id}
              style={{
                backgroundColor: "#1F1535",
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#C084FC", fontSize: 12, marginBottom: 4 }}
                  >
                    {ritual.moon_phase}
                  </Text>
                  <Text
                    style={{
                      color: "#E5E7EB",
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {ritual.title}
                  </Text>
                  {ritual.description && (
                    <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                      {ritual.description}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => deleteRitual(ritual.id)}>
                  <Trash2 color="#EF4444" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
