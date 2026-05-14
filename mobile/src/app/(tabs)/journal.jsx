import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  Trash2,
  Calendar as CalendarIcon,
  Share2,
} from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { tarotImages } from "@/data/tarot-images";

const BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const TAROT_IMAGES_FALLBACK = {
  the_fool: `${BASE}RWS_Tarot_00_Fool.jpg`,
  the_magician: `${BASE}RWS_Tarot_01_Magician.jpg`,
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getImage(cardId) {
  return tarotImages[cardId] || TAROT_IMAGES_FALLBACK[cardId] || null;
}

// ── Reading Entry ─────────────────────────────────────────────────────────────
function ReadingEntry({ reading, onDelete, onUpdateNotes }) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(reading.notes || "");

  const cards = reading.cards || [];

  const handleDelete = () => {
    Alert.alert("Delete Reading", "Remove this reading from your journal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(reading.id),
      },
    ]);
  };

  const saveNotes = () => {
    onUpdateNotes(reading.id, notesDraft);
    setEditingNotes(false);
  };

  const handleShare = () => {
    const cardNames = cards
      .map((c) => c.card?.name)
      .filter(Boolean)
      .join(", ");
    const shareText = `🔮 ${reading.spread_name}\n\nCards: ${cardNames}\n\n${reading.ai_narrative || ""}\n\nDate: ${formatDate(reading.created_at)}`;

    Alert.alert("Share Reading", "Share this reading as text", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Share",
        onPress: () => {
          // Copy to clipboard as a simple share mechanism
          Alert.alert("Reading Text", shareText, [{ text: "OK" }]);
        },
      },
    ]);
  };

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(139,92,246,0.22)",
        marginBottom: 14,
        overflow: "hidden",
      }}
    >
      {/* Header Row */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={{
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Thumbnails */}
        <View style={{ flexDirection: "row" }}>
          {cards.slice(0, 3).map((c, i) => {
            const uri = getImage(c.card?.id);
            return (
              <View
                key={i}
                style={{
                  width: 34,
                  height: 52,
                  borderRadius: 6,
                  overflow: "hidden",
                  marginLeft: i > 0 ? -10 : 0,
                  borderWidth: 1,
                  borderColor: "rgba(139,92,246,0.35)",
                }}
              >
                {uri ? (
                  <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    imageStyle={{
                      transform: [{ rotate: c.isReversed ? "180deg" : "0deg" }],
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#4F46E5",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={12} color="rgba(255,255,255,0.4)" />
                  </View>
                )}
              </View>
            );
          })}
          {cards.length > 3 && (
            <View
              style={{
                width: 34,
                height: 52,
                borderRadius: 6,
                marginLeft: -10,
                backgroundColor: "rgba(124,58,237,0.3)",
                borderWidth: 1,
                borderColor: "rgba(139,92,246,0.35)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "#C4B5FD", fontSize: 10, fontWeight: "700" }}
              >
                +{cards.length - 3}
              </Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#E9D5FF" }}>
            {reading.spread_name}
          </Text>
          <Text style={{ fontSize: 11, color: "#9B7FD4", marginTop: 2 }}>
            {formatDate(reading.created_at)} · {formatTime(reading.created_at)}
          </Text>
          <Text
            style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}
            numberOfLines={1}
          >
            {cards
              .map((c) => c.card?.name)
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Share2 size={15} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={15} color="#6B7280" />
          </TouchableOpacity>
          {expanded ? (
            <ChevronUp size={15} color="#9B7FD4" />
          ) : (
            <ChevronDown size={15} color="#9B7FD4" />
          )}
        </View>
      </TouchableOpacity>

      {/* Expanded */}
      {expanded && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "rgba(139,92,246,0.15)",
            padding: 18,
          }}
        >
          {/* Card images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
          >
            {cards.map((c, i) => {
              const uri = getImage(c.card?.id);
              return (
                <View key={i} style={{ alignItems: "center", gap: 6 }}>
                  <View
                    style={{
                      width: 64,
                      height: 102,
                      borderRadius: 8,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "rgba(139,92,246,0.35)",
                      shadowColor: "#7C3AED",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                    }}
                  >
                    {uri ? (
                      <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        imageStyle={{
                          transform: [
                            { rotate: c.isReversed ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "#4F46E5",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sparkles size={18} color="rgba(255,255,255,0.4)" />
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#C4B5FD",
                      textAlign: "center",
                      maxWidth: 68,
                    }}
                    numberOfLines={2}
                  >
                    {c.position || c.card?.name}
                  </Text>
                  {c.isReversed && (
                    <View
                      style={{
                        backgroundColor: "#78350F",
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 9, color: "#FCD34D" }}>
                        Rev.
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* AI Narrative */}
          {reading.ai_narrative ? (
            <View
              style={{
                backgroundColor: "rgba(76,29,149,0.2)",
                borderRadius: 12,
                padding: 14,
                borderLeftWidth: 3,
                borderLeftColor: "#7C3AED",
                marginTop: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#A78BFA",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                ✦ AI Narrative
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#E9D5FF",
                  lineHeight: 22,
                  fontStyle: "italic",
                }}
              >
                {reading.ai_narrative}
              </Text>
            </View>
          ) : null}

          {/* Notes */}
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#9B7FD4",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Journal Notes
              </Text>
              {!editingNotes && (
                <TouchableOpacity
                  onPress={() => setEditingNotes(true)}
                  activeOpacity={0.7}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Edit3 size={12} color="#9B7FD4" />
                  <Text style={{ fontSize: 12, color: "#9B7FD4" }}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            {editingNotes ? (
              <View>
                <TextInput
                  value={notesDraft}
                  onChangeText={setNotesDraft}
                  multiline
                  numberOfLines={4}
                  placeholder="Write your personal reflection here…"
                  placeholderTextColor="#4B5563"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderWidth: 1,
                    borderColor: "rgba(139,92,246,0.4)",
                    borderRadius: 10,
                    padding: 12,
                    color: "#E9D5FF",
                    fontSize: 13,
                    lineHeight: 22,
                    minHeight: 90,
                    textAlignVertical: "top",
                  }}
                />
                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={saveNotes}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: "#4F46E5",
                      borderRadius: 8,
                    }}
                  >
                    <Check size={13} color="#fff" />
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingNotes(false);
                      setNotesDraft(reading.notes || "");
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "rgba(139,92,246,0.3)",
                    }}
                  >
                    <X size={13} color="#9B7FD4" />
                    <Text style={{ color: "#9B7FD4", fontSize: 13 }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 13,
                  color: reading.notes ? "#D1D5DB" : "#4B5563",
                  lineHeight: 21,
                  fontStyle: reading.notes ? "normal" : "italic",
                }}
              >
                {reading.notes ||
                  "No notes yet. Tap Edit to add your reflections."}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Journal Screen ────────────────────────────────────────────────────────────
export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    data: readings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const res = await fetch("/api/readings");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      const res = await fetch(`/api/readings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });

  const handleUpdateNotes = useCallback(
    (id, notes) => {
      updateNotesMutation.mutate({ id, notes });
    },
    [updateNotesMutation],
  );

  // Filter readings by selected date
  const filteredReadings = selectedDate
    ? readings.filter((r) => {
        const readingDate = new Date(r.created_at).toISOString().split("T")[0];
        return readingDate === selectedDate;
      })
    : readings;

  // Create marked dates for calendar
  const markedDates = {};
  readings.forEach((r) => {
    const dateKey = new Date(r.created_at).toISOString().split("T")[0];
    markedDates[dateKey] = {
      marked: true,
      dotColor: "#7C3AED",
      selected: dateKey === selectedDate,
      selectedColor: "#7C3AED",
    };
  });

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      setSelectedDate(null); // Clear filter
    } else {
      setSelectedDate(day.dateString);
    }
    setShowCalendar(false);
  };

  const thisMonth = readings.filter(
    (r) => new Date(r.created_at).getMonth() === new Date().getMonth(),
  ).length;
  const withNotes = readings.filter((r) => r.notes).length;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0F0A1E", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1C1332",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139,92,246,0.2)",
          paddingHorizontal: 24,
          paddingVertical: 18,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#E9D5FF" }}>
              Reading Journal
            </Text>
            <Text style={{ fontSize: 14, color: "#9B7FD4", marginTop: 4 }}>
              Your saved readings & reflections
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            activeOpacity={0.7}
            style={{
              padding: 10,
              backgroundColor: selectedDate
                ? "rgba(124,58,237,0.3)"
                : "rgba(255,255,255,0.05)",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedDate ? "#7C3AED" : "rgba(139,92,246,0.2)",
            }}
          >
            <CalendarIcon
              size={20}
              color={selectedDate ? "#C4B5FD" : "#9B7FD4"}
            />
          </TouchableOpacity>
        </View>

        {selectedDate && (
          <TouchableOpacity
            onPress={() => setSelectedDate(null)}
            activeOpacity={0.7}
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "rgba(124,58,237,0.2)",
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ fontSize: 12, color: "#C4B5FD" }}>
              Showing:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Calendar */}
      {showCalendar && (
        <View
          style={{
            backgroundColor: "#1C1332",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(139,92,246,0.2)",
            padding: 16,
          }}
        >
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: "#1C1332",
              calendarBackground: "#1C1332",
              textSectionTitleColor: "#9B7FD4",
              selectedDayBackgroundColor: "#7C3AED",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#C4B5FD",
              dayTextColor: "#E9D5FF",
              textDisabledColor: "#4B5563",
              dotColor: "#7C3AED",
              selectedDotColor: "#ffffff",
              arrowColor: "#C4B5FD",
              monthTextColor: "#E9D5FF",
              indicatorColor: "#7C3AED",
            }}
            enableSwipeMonths={true}
          />
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        {readings.length > 0 && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Total", value: readings.length },
              { label: "This Month", value: thisMonth },
              { label: "With Notes", value: withNotes },
            ].map((stat, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "rgba(139,92,246,0.2)",
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "700", color: "#C4B5FD" }}
                >
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Content */}
        {isLoading ? (
          <View style={{ alignItems: "center", padding: 60, gap: 12 }}>
            <Sparkles size={28} color="#7C3AED" />
            <Text style={{ color: "#9B7FD4", fontSize: 15 }}>
              Loading your readings…
            </Text>
          </View>
        ) : error ? (
          <View style={{ alignItems: "center", padding: 60 }}>
            <Text style={{ color: "#F87171", fontSize: 14 }}>
              Failed to load readings. Please try again.
            </Text>
          </View>
        ) : filteredReadings.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              padding: 48,
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.15)",
            }}
          >
            <BookOpen size={40} color="#4C1D95" style={{ marginBottom: 16 }} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#C4B5FD",
                marginBottom: 8,
              }}
            >
              {selectedDate ? "No readings on this date" : "No readings yet"}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#9B7FD4",
                textAlign: "center",
                maxWidth: 260,
                lineHeight: 20,
              }}
            >
              {selectedDate
                ? "Try selecting a different date or clear the filter."
                : "Complete a reading and save it to build your personal tarot journal."}
            </Text>
          </View>
        ) : (
          filteredReadings.map((reading) => (
            <ReadingEntry
              key={reading.id}
              reading={reading}
              onDelete={(id) => deleteMutation.mutate(id)}
              onUpdateNotes={handleUpdateNotes}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
