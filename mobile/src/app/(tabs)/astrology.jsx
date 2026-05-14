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
import { Sparkles, AlertCircle } from "lucide-react-native";

export default function AstrologyScreen() {
  const insets = useSafeAreaInsets();
  const [birthCharts, setBirthCharts] = useState([]);
  const [astroData, setAstroData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");

  useEffect(() => {
    fetchBirthCharts();
    fetchTransits();
  }, []);

  const fetchBirthCharts = async () => {
    try {
      const response = await fetch("/api/birth-charts");
      if (!response.ok) throw new Error("Failed to fetch birth charts");
      const data = await response.json();
      setBirthCharts(data.charts || []);

      // If there's a chart, fetch astrology data for it
      if (data.charts && data.charts.length > 0) {
        fetchAstroData(data.charts[0].birth_date);
      }
    } catch (error) {
      console.error("Error fetching birth charts:", error);
    }
  };

  const fetchTransits = async () => {
    try {
      const response = await fetch("/api/astrology");
      if (!response.ok) throw new Error("Failed to fetch transits");
      const data = await response.json();
      setAstroData(data);
    } catch (error) {
      console.error("Error fetching transits:", error);
    }
  };

  const fetchAstroData = async (date) => {
    try {
      const response = await fetch(`/api/astrology?birthDate=${date}`);
      if (!response.ok) throw new Error("Failed to fetch astrology data");
      const data = await response.json();
      setAstroData(data);
    } catch (error) {
      console.error("Error fetching astrology data:", error);
    }
  };

  const createBirthChart = async () => {
    if (!birthDate) return;

    try {
      const response = await fetch("/api/birth-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_location: birthLocation || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create birth chart");

      setBirthDate("");
      setBirthTime("");
      setBirthLocation("");
      setShowForm(false);
      fetchBirthCharts();
    } catch (error) {
      console.error("Error creating birth chart:", error);
    }
  };

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
        {/* Header */}
        <View style={{ padding: 24, alignItems: "center" }}>
          <Sparkles color="#C084FC" size={48} />
          <Text
            style={{
              color: "#C084FC",
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 12,
            }}
          >
            Cosmic Insights
          </Text>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Align your readings with the stars
          </Text>
        </View>

        {/* Birth Chart Section */}
        {birthCharts.length === 0 ? (
          <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
            <View
              style={{
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
                Create Your Birth Chart
              </Text>
              <Text
                style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 16 }}
              >
                Enter your birth details to receive personalized astrological
                insights
              </Text>

              {!showForm ? (
                <TouchableOpacity
                  onPress={() => setShowForm(true)}
                  style={{
                    backgroundColor: "#7C3AED",
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Get Started
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text
                    style={{ color: "#E5E7EB", fontSize: 12, marginBottom: 4 }}
                  >
                    Birth Date (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    placeholder="1990-01-15"
                    placeholderTextColor="#6B7280"
                    value={birthDate}
                    onChangeText={setBirthDate}
                    style={{
                      backgroundColor: "#0F0A1E",
                      color: "#E5E7EB",
                      fontSize: 16,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  />

                  <Text
                    style={{ color: "#E5E7EB", fontSize: 12, marginBottom: 4 }}
                  >
                    Birth Time (Optional)
                  </Text>
                  <TextInput
                    placeholder="14:30"
                    placeholderTextColor="#6B7280"
                    value={birthTime}
                    onChangeText={setBirthTime}
                    style={{
                      backgroundColor: "#0F0A1E",
                      color: "#E5E7EB",
                      fontSize: 16,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  />

                  <Text
                    style={{ color: "#E5E7EB", fontSize: 12, marginBottom: 4 }}
                  >
                    Birth Location (Optional)
                  </Text>
                  <TextInput
                    placeholder="New York, USA"
                    placeholderTextColor="#6B7280"
                    value={birthLocation}
                    onChangeText={setBirthLocation}
                    style={{
                      backgroundColor: "#0F0A1E",
                      color: "#E5E7EB",
                      fontSize: 16,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  />

                  <TouchableOpacity
                    onPress={createBirthChart}
                    style={{
                      backgroundColor: "#7C3AED",
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Create Chart
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
            {astroData?.sunSign && (
              <View>
                {/* Sun Sign */}
                <View
                  style={{
                    backgroundColor: "#1F1535",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#7C3AED",
                  }}
                >
                  <Text
                    style={{ color: "#C084FC", fontSize: 14, marginBottom: 4 }}
                  >
                    Sun Sign
                  </Text>
                  <Text
                    style={{
                      color: "#E5E7EB",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {astroData.sunSign.symbol} {astroData.sunSign.name}
                  </Text>
                  <Text
                    style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 12 }}
                  >
                    Element: {astroData.sunSign.element}
                  </Text>
                  {astroData.sunPersonality && (
                    <View>
                      <Text
                        style={{
                          color: "#E5E7EB",
                          fontSize: 14,
                          marginBottom: 8,
                        }}
                      >
                        Traits: {astroData.sunPersonality.traits.join(", ")}
                      </Text>
                      <Text style={{ color: "#C084FC", fontSize: 14 }}>
                        Reading Focus: {astroData.sunPersonality.readingFocus}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Moon Sign */}
                <View
                  style={{
                    backgroundColor: "#1F1535",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{ color: "#C084FC", fontSize: 14, marginBottom: 4 }}
                  >
                    Moon Sign
                  </Text>
                  <Text
                    style={{
                      color: "#E5E7EB",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {astroData.moonSign.symbol} {astroData.moonSign.name}
                  </Text>
                  <Text
                    style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 12 }}
                  >
                    Element: {astroData.moonSign.element}
                  </Text>
                  {astroData.moonPersonality && (
                    <View>
                      <Text
                        style={{
                          color: "#E5E7EB",
                          fontSize: 14,
                          marginBottom: 8,
                        }}
                      >
                        Traits: {astroData.moonPersonality.traits.join(", ")}
                      </Text>
                      <Text style={{ color: "#C084FC", fontSize: 14 }}>
                        Emotional Focus:{" "}
                        {astroData.moonPersonality.readingFocus}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Current Transits */}
        {astroData?.transits && astroData.transits.length > 0 && (
          <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
            <Text
              style={{
                color: "#C084FC",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Current Transits
            </Text>
            {astroData.transits.map((transit, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#1F1535",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <AlertCircle
                  color="#F59E0B"
                  size={20}
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#E5E7EB",
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {transit.planet} Retrograde
                  </Text>
                  <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                    {transit.influence}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Astrological Guidance */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
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
              Reading Guidance
            </Text>
            <Text style={{ color: "#E5E7EB", fontSize: 14, lineHeight: 20 }}>
              Your cosmic blueprint influences how you interpret the cards. Pay
              attention to themes of{" "}
              {astroData?.sunPersonality?.readingFocus || "self-discovery"} in
              your readings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
