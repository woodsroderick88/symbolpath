import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Brain,
  Trash2,
  TrendingUp,
  Shield,
  ChevronDown,
  Sparkles,
  Target,
  Lightbulb,
  PenLine,
  Flame,
  BookOpen,
} from "lucide-react-native";
import { EMOTIONS, DEFENSE_MECHANISMS, getDailyEmotion } from "@/data/emotions";
import { tarotCards } from "@/data/tarot-cards";

const CONSEQUENCES = [
  "Positive if repeated",
  "Neutral",
  "Negative if repeated",
];

function OptionPicker({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          color: "#C4B5FD",
          marginBottom: 6,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        style={{
          backgroundColor: "rgba(15,10,30,0.8)",
          borderWidth: 1,
          borderColor: "rgba(139,92,246,0.3)",
          borderRadius: 10,
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#E9D5FF", fontSize: 14 }}>{selected}</Text>
        <ChevronDown size={16} color="#9B7FD4" />
      </TouchableOpacity>
      {open && (
        <View
          style={{
            marginTop: 4,
            backgroundColor: "#1C1332",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.3)",
            overflow: "hidden",
            maxHeight: 250,
          }}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {options.map((opt) => {
              const val = typeof opt === "string" ? opt : opt.name;
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => {
                    onSelect(val);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    padding: 12,
                    backgroundColor:
                      selected === val ? "rgba(124,58,237,0.2)" : "transparent",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(139,92,246,0.1)",
                  }}
                >
                  <Text
                    style={{
                      color: selected === val ? "#C4B5FD" : "#D1D5DB",
                      fontSize: 14,
                      fontWeight: selected === val ? "600" : "400",
                    }}
                  >
                    {val}
                  </Text>
                  {typeof opt === "object" && opt.description && (
                    <Text
                      style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}
                    >
                      {opt.description}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function DecisionMirrorScreen() {
  const insets = useSafeAreaInsets();
  const [decisions, setDecisions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("reflect");

  const dailyEmotion = useMemo(() => getDailyEmotion(), []);
  const dailyTarot = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000,
    );
    return tarotCards[dayOfYear % tarotCards.length];
  }, []);

  const [situation, setSituation] = useState("");
  const [emotion, setEmotion] = useState(dailyEmotion.name);
  const [defense, setDefense] = useState("None");
  const [consequence, setConsequence] = useState("Neutral");
  const [decisionTaken, setDecisionTaken] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [internalState, setInternalState] = useState("");
  const [actionResult, setActionResult] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [microAction, setMicroAction] = useState("");
  const [journalReflection, setJournalReflection] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRes, iRes] = await Promise.all([
        fetch("/api/decisions?userId=anonymous"),
        fetch("/api/decisions/insights?userId=anonymous"),
      ]);
      setDecisions(await dRes.json());
      setInsights(await iRes.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!situation.trim() || !decisionTaken.trim()) {
      Alert.alert("Missing Info", "Please fill in the situation and decision.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          emotion,
          defense,
          consequence,
          decisionTaken,
          triggerEvent: triggerEvent || null,
          internalState: internalState || null,
          actionResult: actionResult || null,
          newResponse: newResponse || null,
          microAction: microAction || null,
          journalReflection: journalReflection || null,
          userId: "anonymous",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSituation("");
      setEmotion(dailyEmotion.name);
      setDefense("None");
      setConsequence("Neutral");
      setDecisionTaken("");
      setTriggerEvent("");
      setInternalState("");
      setActionResult("");
      setNewResponse("");
      setMicroAction("");
      setJournalReflection("");
      await loadData();
      Alert.alert("Saved", "Your reflection has been logged.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) =>
    Alert.alert("Delete", "Remove this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await fetch(`/api/decisions/${id}`, { method: "DELETE" });
          await loadData();
        },
      },
    ]);
  const getDefenseColor = (d) => (d === "None" ? "#34D399" : "#FBBF24");
  const inputStyle = {
    backgroundColor: "rgba(15,10,30,0.8)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
    borderRadius: 10,
    padding: 12,
    color: "#E9D5FF",
    fontSize: 14,
  };
  const labelStyle = {
    fontSize: 13,
    color: "#C4B5FD",
    marginBottom: 6,
    fontWeight: "600",
  };
  const cardStyle = {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.25)",
    padding: 20,
    marginBottom: 16,
  };

  const sectionTabs = [
    { id: "reflect", label: "Reflect", Icon: Sparkles },
    { id: "pattern", label: "Pattern", Icon: Target },
    { id: "defense", label: "Defense", Icon: Shield },
    { id: "redesign", label: "Redesign", Icon: Lightbulb },
    { id: "journal", label: "Journal", Icon: PenLine },
  ];

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
          gap: 12,
        }}
      >
        <Brain size={28} color="#A78BFA" />
        <View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#E9D5FF" }}>
            Inner Pattern Lab
          </Text>
          <Text style={{ fontSize: 11, color: "#9B7FD4", marginTop: 2 }}>
            Decision Mirror + Pattern Analysis
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#A78BFA"
          />
        }
      >
        {insights && (
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
            {[
              {
                val: insights.total,
                label: "Entries",
                color: "#C4B5FD",
                bg: "rgba(139,92,246,0.1)",
                bc: "rgba(139,92,246,0.25)",
              },
              {
                val: insights.streak,
                label: "Streak",
                color: "#34D399",
                bg: "rgba(52,211,153,0.08)",
                bc: "rgba(52,211,153,0.25)",
              },
              {
                val: insights.aligned,
                label: "Clear",
                color: "#34D399",
                bg: "rgba(52,211,153,0.08)",
                bc: "rgba(52,211,153,0.25)",
              },
              {
                val: insights.distorted,
                label: "Defense",
                color: "#FBBF24",
                bg: "rgba(251,191,36,0.08)",
                bc: "rgba(251,191,36,0.25)",
              },
            ].map((s, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: s.bg,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: s.bc,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "700", color: s.color }}
                >
                  {s.val}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: s.color,
                    opacity: 0.8,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 16 }}
          contentContainerStyle={{ gap: 6 }}
        >
          {sectionTabs.map((tab) => {
            const IconComp = tab.Icon;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveSection(tab.id)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    activeSection === tab.id
                      ? "#7C3AED"
                      : "rgba(139,92,246,0.1)",
                }}
              >
                <IconComp
                  size={14}
                  color={activeSection === tab.id ? "#fff" : "#9B7FD4"}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: activeSection === tab.id ? "700" : "500",
                    color: activeSection === tab.id ? "#fff" : "#9B7FD4",
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeSection === "reflect" && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Sparkles size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Daily Reflection
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(124,58,237,0.1)",
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: "rgba(139,92,246,0.2)",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#9B7FD4",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Today's Tarot Symbol
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#C4B5FD",
                  marginTop: 6,
                }}
              >
                {dailyTarot.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#D1D5DB",
                  marginTop: 4,
                  lineHeight: 18,
                }}
                numberOfLines={3}
              >
                {dailyTarot.upright.meaning}
              </Text>
            </View>
            <View
              style={{
                backgroundColor:
                  dailyEmotion.category === "shadow"
                    ? "rgba(248,113,113,0.08)"
                    : "rgba(52,211,153,0.08)",
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor:
                  dailyEmotion.category === "shadow"
                    ? "rgba(248,113,113,0.2)"
                    : "rgba(52,211,153,0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#9B7FD4",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Today's Emotion
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color:
                    dailyEmotion.category === "shadow" ? "#F87171" : "#34D399",
                  marginTop: 6,
                }}
              >
                {dailyEmotion.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#D1D5DB",
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                Root: {dailyEmotion.root}
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={labelStyle}>Situation</Text>
                <TextInput
                  value={situation}
                  onChangeText={setSituation}
                  placeholder="What happened?"
                  placeholderTextColor="#6B7280"
                  multiline
                  style={{
                    ...inputStyle,
                    height: 80,
                    textAlignVertical: "top",
                  }}
                />
              </View>
              <OptionPicker
                label="Emotion"
                options={EMOTIONS.map((e) => e.name)}
                selected={emotion}
                onSelect={setEmotion}
              />
              <OptionPicker
                label="Reality Check"
                options={CONSEQUENCES}
                selected={consequence}
                onSelect={setConsequence}
              />
              <View>
                <Text style={labelStyle}>Decision Taken</Text>
                <TextInput
                  value={decisionTaken}
                  onChangeText={setDecisionTaken}
                  placeholder="What did you decide?"
                  placeholderTextColor="#6B7280"
                  style={inputStyle}
                />
              </View>
            </View>
          </View>
        )}

        {activeSection === "pattern" && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Target size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Pattern Mapping
              </Text>
            </View>
            <Text style={{ color: "#9B7FD4", fontSize: 12, marginBottom: 14 }}>
              Trigger → Internal State → Action → Result
            </Text>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={labelStyle}>Trigger</Text>
                <TextInput
                  value={triggerEvent}
                  onChangeText={setTriggerEvent}
                  placeholder="What activated the response?"
                  placeholderTextColor="#6B7280"
                  style={inputStyle}
                />
              </View>
              <View>
                <Text style={labelStyle}>Internal State</Text>
                <TextInput
                  value={internalState}
                  onChangeText={setInternalState}
                  placeholder="What did you feel inside?"
                  placeholderTextColor="#6B7280"
                  style={inputStyle}
                />
              </View>
              <View>
                <Text style={labelStyle}>Result</Text>
                <TextInput
                  value={actionResult}
                  onChangeText={setActionResult}
                  placeholder="What was the outcome?"
                  placeholderTextColor="#6B7280"
                  style={inputStyle}
                />
              </View>
            </View>
          </View>
        )}

        {activeSection === "defense" && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Shield size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Defense Check
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {DEFENSE_MECHANISMS.map((dm) => (
                <TouchableOpacity
                  key={dm.id}
                  onPress={() => setDefense(dm.name)}
                  activeOpacity={0.7}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor:
                      defense === dm.name
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.02)",
                    borderWidth: 2,
                    borderColor:
                      defense === dm.name ? "#7C3AED" : "rgba(139,92,246,0.15)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: defense === dm.name ? "#C4B5FD" : "#D1D5DB",
                    }}
                  >
                    {dm.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#9B7FD4",
                      marginTop: 3,
                      lineHeight: 16,
                    }}
                  >
                    {dm.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeSection === "redesign" && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Lightbulb size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Behavior Redesign
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={labelStyle}>New Response</Text>
                <TextInput
                  value={newResponse}
                  onChangeText={setNewResponse}
                  placeholder="How would you respond differently?"
                  placeholderTextColor="#6B7280"
                  multiline
                  style={{
                    ...inputStyle,
                    height: 80,
                    textAlignVertical: "top",
                  }}
                />
              </View>
              <View>
                <Text style={labelStyle}>Micro Action</Text>
                <TextInput
                  value={microAction}
                  onChangeText={setMicroAction}
                  placeholder="e.g. pause and breathe for 5 seconds"
                  placeholderTextColor="#6B7280"
                  style={inputStyle}
                />
              </View>
            </View>
          </View>
        )}

        {activeSection === "journal" && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <PenLine size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Reflection Writing
              </Text>
            </View>
            <TextInput
              value={journalReflection}
              onChangeText={setJournalReflection}
              placeholder="Write freely..."
              placeholderTextColor="#6B7280"
              multiline
              style={{
                ...inputStyle,
                height: 200,
                textAlignVertical: "top",
                lineHeight: 22,
              }}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || !situation.trim() || !decisionTaken.trim()}
          activeOpacity={0.8}
          style={{
            backgroundColor:
              !situation.trim() || !decisionTaken.trim()
                ? "#2D1F5E"
                : "#4F46E5",
            paddingVertical: 14,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Flame
            size={16}
            color={
              !situation.trim() || !decisionTaken.trim() ? "#6B7280" : "#fff"
            }
          />
          <Text
            style={{
              color:
                !situation.trim() || !decisionTaken.trim() ? "#6B7280" : "#fff",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {saving ? "Saving…" : "Save Reflection"}
          </Text>
        </TouchableOpacity>

        {insights && (insights.topEmotion || insights.topDefense) && (
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <TrendingUp size={18} color="#A78BFA" />
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#E9D5FF" }}
              >
                Pattern Insights
              </Text>
            </View>
            {insights.topEmotion && (
              <View
                style={{
                  backgroundColor: "rgba(124,58,237,0.1)",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "rgba(139,92,246,0.2)",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 11, color: "#9B7FD4" }}>
                  Most frequent emotion
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#C4B5FD",
                    marginTop: 4,
                  }}
                >
                  {insights.topEmotion}
                </Text>
              </View>
            )}
            {insights.topDefense && (
              <View
                style={{
                  backgroundColor: "rgba(251,191,36,0.08)",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "rgba(251,191,36,0.2)",
                }}
              >
                <Text style={{ fontSize: 11, color: "#FCD34D" }}>
                  Top defense
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#FBBF24",
                    marginTop: 4,
                  }}
                >
                  {insights.topDefense}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={cardStyle}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#E9D5FF",
              marginBottom: 14,
            }}
          >
            Reflection History
          </Text>
          {decisions.length === 0 && !loading && (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Brain size={40} color="#4B5563" />
              <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 10 }}>
                No reflections yet
              </Text>
            </View>
          )}
          {decisions.map((d) => (
            <View
              key={d.id}
              style={{
                backgroundColor: "rgba(15,10,30,0.5)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor:
                  d.defense === "None"
                    ? "rgba(52,211,153,0.2)"
                    : "rgba(251,191,36,0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#E9D5FF",
                    flex: 1,
                    marginBottom: 8,
                  }}
                >
                  {d.situation}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(d.id)}
                  style={{ padding: 4 }}
                >
                  <Trash2 size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(124,58,237,0.2)",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#C4B5FD",
                      fontWeight: "500",
                    }}
                  >
                    {d.emotion}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: getDefenseColor(d.defense) + "20",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: getDefenseColor(d.defense),
                      fontWeight: "500",
                    }}
                  >
                    {d.defense}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 4 }}>
                <Text style={{ color: "#C4B5FD", fontWeight: "600" }}>
                  Decision:{" "}
                </Text>
                {d.decision_taken}
              </Text>
              {d.trigger_event && (
                <Text
                  style={{ fontSize: 11, color: "#9B7FD4", marginBottom: 2 }}
                >
                  Trigger: {d.trigger_event}
                </Text>
              )}
              {d.new_response && (
                <Text
                  style={{ fontSize: 11, color: "#6EE7B7", marginBottom: 2 }}
                >
                  New Response: {d.new_response}
                </Text>
              )}
              {d.micro_action && (
                <Text
                  style={{ fontSize: 11, color: "#A78BFA", marginBottom: 2 }}
                >
                  Micro Action: {d.micro_action}
                </Text>
              )}
              <Text style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>
                {new Date(d.created_at).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
