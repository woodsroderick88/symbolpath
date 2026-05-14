import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  Bell,
  BellOff,
  Globe,
  Moon,
  Volume2,
  RotateCcw,
  BookOpen,
  Users,
  Brain,
  TrendingUp,
  Heart,
  Stars,
  ChevronRight,
} from "lucide-react-native";
import { getLanguage, setLanguage, languages } from "@/utils/language";
import { TRACK_INFO, AMBIENT_TRACKS } from "@/utils/ambientAudio";
import { tarotCards } from "@/data/tarot-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Moon phase notification messages
const MOON_NOTIFICATIONS = {
  newMoon: {
    title: "🌑 New Moon Tonight",
    body: "A fresh cycle begins. Set your intentions and draw a New Moon Intentions spread.",
  },
  fullMoon: {
    title: "🌕 Full Moon Tonight",
    body: "The moon is full! Time to celebrate, release, and try a Full Moon Release reading.",
  },
  firstQuarter: {
    title: "🌓 First Quarter Moon",
    body: "Take action on your intentions. The moon is building — draw a card for guidance.",
  },
  lastQuarter: {
    title: "🌗 Last Quarter Moon",
    body: "Time to reflect and let go. Try a Waning Moon Reflection spread.",
  },
};

// Card of the Day insights for enhanced notifications
const CARD_INSIGHTS = {
  the_fool: "A leap of faith awaits — trust the unknown",
  the_magician: "You have everything you need to create magic today",
  the_high_priestess: "Listen to your intuition — it knows the way",
  the_empress: "Abundance flows to those who nurture",
  the_emperor: "Structure and discipline will serve you well",
  the_hierophant: "Seek wisdom in tradition and mentorship",
  the_lovers: "An important choice shapes your path today",
  the_chariot: "Determination will carry you to victory",
  strength: "Gentle persistence overcomes all obstacles",
  the_hermit: "Solitude holds the answers you seek",
  wheel_of_fortune: "Change is in the air — embrace the turn",
  justice: "Truth and fairness will prevail",
  the_hanged_man: "Surrender to gain a new perspective",
  death: "Endings make space for beautiful beginnings",
  temperance: "Balance and patience create harmony",
  the_devil: "Break free from what no longer serves you",
  the_tower: "Disruption clears the way for rebuilding",
  the_star: "Hope and inspiration guide your steps",
  the_moon: "Navigate your fears — clarity comes with dawn",
  the_sun: "Joy and vitality radiate from within",
  judgement: "Answer the call to your higher purpose",
  the_world: "Completion and celebration are here",
};

function getDailyCard() {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % tarotCards.length;
  const card = tarotCards[index];
  const insight =
    CARD_INSIGHTS[card.id] ||
    card.upright?.keywords?.[0] ||
    "Reflect on this card's meaning today";
  return { card, insight };
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [moonNotificationsEnabled, setMoonNotificationsEnabled] =
    useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [hasPermission, setHasPermission] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [defaultTrack, setDefaultTrack] = useState("mystical");
  const [showTrackPicker, setShowTrackPicker] = useState(false);
  const [allowReversals, setAllowReversalsState] = useState(true);

  useEffect(() => {
    checkNotificationPermissions();
    loadNotificationSettings();
    loadLanguage();
    loadReversalsPref();
  }, []);

  const loadReversalsPref = async () => {
    try {
      const val = await AsyncStorage.getItem("tarot_allow_reversals");
      if (val !== null) setAllowReversalsState(val === "true");
    } catch {}
  };

  const toggleReversals = async (value) => {
    setAllowReversalsState(value);
    try {
      await AsyncStorage.setItem("tarot_allow_reversals", String(value));
    } catch {}
  };

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setCurrentLanguage(lang);
  };

  const changeLanguage = async (langCode) => {
    await setLanguage(langCode);
    setCurrentLanguage(langCode);
    Alert.alert("Language Changed", "Language has been updated successfully.");
  };

  const checkNotificationPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    setHasPermission(existingStatus === "granted");
  };

  const loadNotificationSettings = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const hasDailyReminder = scheduled.some((n) =>
        n.content.title?.includes("Daily Tarot"),
      );
      const hasMoonNotification = scheduled.some((n) =>
        n.content.title?.includes("Moon"),
      );
      setNotificationsEnabled(hasDailyReminder);
      setMoonNotificationsEnabled(hasMoonNotification);
    } catch (err) {
      console.error("Failed to load notification settings:", err);
    }
  };

  const requestPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in your device settings to receive reminders.",
      );
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-reminder", {
        name: "Daily Tarot Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#7C3AED",
      });
      await Notifications.setNotificationChannelAsync("moon-phases", {
        name: "Moon Phase Alerts",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#C084FC",
      });
    }

    setHasPermission(true);
    return true;
  };

  const scheduleDailyReminder = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of scheduled) {
        if (n.content.title?.includes("Daily Tarot")) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }

      const [hours, minutes] = reminderTime.split(":").map(Number);

      // Enhanced: include card of the day in notification
      const { card, insight } = getDailyCard();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔮 Daily Tarot: ${card.name}`,
          body: `${insight}\n\nTap to see your full reading.`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { screen: "reading", cardId: card.id },
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      return true;
    } catch (err) {
      console.error("Failed to schedule notification:", err);
      Alert.alert("Error", "Failed to schedule daily reminder.");
      return false;
    }
  };

  const scheduleMoonPhaseNotifications = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of scheduled) {
        if (n.content.title?.includes("Moon")) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }

      const now = new Date();
      const lunarCycle = 29.5305882;

      const phases = [
        { key: "newMoon", dayOffset: 0 },
        { key: "firstQuarter", dayOffset: lunarCycle / 4 },
        { key: "fullMoon", dayOffset: lunarCycle / 2 },
        { key: "lastQuarter", dayOffset: (3 * lunarCycle) / 4 },
      ];

      for (let cycle = 0; cycle < 3; cycle++) {
        for (const phase of phases) {
          const daysFromNow = cycle * lunarCycle + phase.dayOffset;
          const phaseDate = new Date(
            now.getTime() + daysFromNow * 24 * 60 * 60 * 1000,
          );

          if (phaseDate > now) {
            const notifContent = MOON_NOTIFICATIONS[phase.key];
            await Notifications.scheduleNotificationAsync({
              content: {
                title: notifContent.title,
                body: notifContent.body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: { screen: "moon", phase: phase.key },
              },
              trigger: {
                date: phaseDate,
              },
            });
          }
        }
      }

      return true;
    } catch (err) {
      console.error("Failed to schedule moon notifications:", err);
      Alert.alert("Error", "Failed to schedule moon phase alerts.");
      return false;
    }
  };

  const toggleNotifications = async (value) => {
    if (value) {
      const permitted = hasPermission || (await requestPermissions());
      if (!permitted) {
        setNotificationsEnabled(false);
        return;
      }

      const scheduled = await scheduleDailyReminder();
      if (scheduled) {
        setNotificationsEnabled(true);
        Alert.alert(
          "Reminder Set",
          `You'll receive a daily tarot reminder at ${reminderTime}.`,
        );
      }
    } else {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of scheduled) {
        if (n.content.title?.includes("Daily Tarot")) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }
      setNotificationsEnabled(false);
      Alert.alert("Reminder Disabled", "Daily reminders have been turned off.");
    }
  };

  const toggleMoonNotifications = async (value) => {
    if (value) {
      const permitted = hasPermission || (await requestPermissions());
      if (!permitted) {
        setMoonNotificationsEnabled(false);
        return;
      }

      const scheduled = await scheduleMoonPhaseNotifications();
      if (scheduled) {
        setMoonNotificationsEnabled(true);
        Alert.alert(
          "Moon Alerts Active",
          "You'll receive notifications for New Moon, Full Moon, First Quarter, and Last Quarter phases.",
        );
      }
    } else {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of scheduled) {
        if (n.content.title?.includes("Moon")) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }
      setMoonNotificationsEnabled(false);
      Alert.alert(
        "Moon Alerts Disabled",
        "Moon phase alerts have been turned off.",
      );
    }
  };

  const timeOptions = [
    { label: "6:00 AM", value: "06:00" },
    { label: "9:00 AM", value: "09:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "6:00 PM", value: "18:00" },
    { label: "9:00 PM", value: "21:00" },
  ];

  const updateReminderTime = async (newTime) => {
    setReminderTime(newTime);
    if (notificationsEnabled) {
      await scheduleDailyReminder();
      Alert.alert("Time Updated", `Reminder time changed to ${newTime}.`);
    }
  };

  const trackKeys = Object.keys(TRACK_INFO);

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
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#E9D5FF" }}>
          More
        </Text>
        <Text style={{ fontSize: 14, color: "#9B7FD4", marginTop: 4 }}>
          All features & settings
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Access Navigation */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#7C6FA0",
              letterSpacing: 0.8,
              textTransform: "uppercase",
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            Features
          </Text>
          {[
            {
              icon: BookOpen,
              label: "Journal",
              desc: "Reading journal & reflections",
              route: "/(tabs)/journal",
            },
            {
              icon: Brain,
              label: "Decision Mirror",
              desc: "Symbolic decision analysis",
              route: "/(tabs)/decision-mirror",
            },
            {
              icon: Users,
              label: "Community",
              desc: "Shared readings & discussions",
              route: "/(tabs)/community",
            },
            {
              icon: TrendingUp,
              label: "Progress",
              desc: "Streaks, badges & stats",
              route: "/(tabs)/progress",
            },
            {
              icon: Heart,
              label: "Wellness",
              desc: "Breathing & affirmations",
              route: "/(tabs)/wellness",
            },
            {
              icon: Stars,
              label: "Astrology",
              desc: "Birth chart & transits",
              route: "/(tabs)/astrology",
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.route)}
              activeOpacity={0.6}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: "rgba(139,92,246,0.08)",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "rgba(124,58,237,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <item.icon size={18} color="#A78BFA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#E9D5FF" }}
                >
                  {item.label}
                </Text>
                <Text style={{ fontSize: 12, color: "#7C6FA0", marginTop: 1 }}>
                  {item.desc}
                </Text>
              </View>
              <ChevronRight size={16} color="#4B5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings section label */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#7C6FA0",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          Settings
        </Text>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Globe size={20} color="#7C3AED" />
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#E9D5FF" }}>
              Language / भाषा
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            Choose your preferred language for the interface
          </Text>

          <View style={{ gap: 8 }}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => changeLanguage(lang.code)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  backgroundColor:
                    currentLanguage === lang.code
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(255,255,255,0.02)",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor:
                    currentLanguage === lang.code
                      ? "#7C3AED"
                      : "rgba(139,92,246,0.15)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{lang.flag}</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        currentLanguage === lang.code ? "#C4B5FD" : "#D1D5DB",
                      fontWeight: currentLanguage === lang.code ? "600" : "400",
                    }}
                  >
                    {lang.name}
                  </Text>
                </View>
                {currentLanguage === lang.code && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#7C3AED",
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reversals Preference */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <RotateCcw
                size={20}
                color={allowReversals ? "#7C3AED" : "#6B7280"}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "700", color: "#E9D5FF" }}
              >
                Reversed Cards
              </Text>
            </View>
            <Switch
              value={allowReversals}
              onValueChange={toggleReversals}
              trackColor={{ false: "#374151", true: "#7C3AED" }}
              thumbColor={allowReversals ? "#C4B5FD" : "#9CA3AF"}
            />
          </View>
          <Text style={{ fontSize: 13, color: "#9B7FD4", lineHeight: 20 }}>
            {allowReversals
              ? "Cards can appear reversed with shadow meanings. This adds depth and nuance to readings."
              : "All cards will appear upright only. Reversed meanings will not be used."}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {notificationsEnabled ? (
                <Bell size={20} color="#7C3AED" />
              ) : (
                <BellOff size={20} color="#6B7280" />
              )}
              <Text
                style={{ fontSize: 17, fontWeight: "700", color: "#E9D5FF" }}
              >
                Daily Reminder
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#374151", true: "#7C3AED" }}
              thumbColor={notificationsEnabled ? "#C4B5FD" : "#9CA3AF"}
            />
          </View>
          <Text
            style={{
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            Get a daily notification to draw your tarot card and reflect on your
            journey.
          </Text>

          {notificationsEnabled && (
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#9B7FD4",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Reminder Time
              </Text>
              <View style={{ gap: 8 }}>
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => updateReminderTime(option.value)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 12,
                      backgroundColor:
                        reminderTime === option.value
                          ? "rgba(124,58,237,0.2)"
                          : "rgba(255,255,255,0.02)",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor:
                        reminderTime === option.value
                          ? "#7C3AED"
                          : "rgba(139,92,246,0.15)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          reminderTime === option.value ? "#C4B5FD" : "#D1D5DB",
                        fontWeight:
                          reminderTime === option.value ? "600" : "400",
                      }}
                    >
                      {option.label}
                    </Text>
                    {reminderTime === option.value && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#7C3AED",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Moon
                size={20}
                color={moonNotificationsEnabled ? "#C084FC" : "#6B7280"}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "700", color: "#E9D5FF" }}
              >
                Moon Phase Alerts
              </Text>
            </View>
            <Switch
              value={moonNotificationsEnabled}
              onValueChange={toggleMoonNotifications}
              trackColor={{ false: "#374151", true: "#C084FC" }}
              thumbColor={moonNotificationsEnabled ? "#E9D5FF" : "#9CA3AF"}
            />
          </View>
          <Text
            style={{
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Get notified when the moon enters a new phase — New Moon, Full Moon,
            First Quarter, and Last Quarter.
          </Text>

          {moonNotificationsEnabled && (
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#9B7FD4",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                You'll Be Notified For
              </Text>
              {[
                {
                  emoji: "🌑",
                  name: "New Moon",
                  desc: "Set intentions for the cycle",
                },
                {
                  emoji: "🌓",
                  name: "First Quarter",
                  desc: "Take action, overcome challenges",
                },
                {
                  emoji: "🌕",
                  name: "Full Moon",
                  desc: "Celebrate and release",
                },
                {
                  emoji: "🌗",
                  name: "Last Quarter",
                  desc: "Reflect, forgive, let go",
                },
              ].map((phase) => (
                <View
                  key={phase.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: "rgba(192,132,252,0.08)",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "rgba(192,132,252,0.15)",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{phase.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#E9D5FF",
                      }}
                    >
                      {phase.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#9B7FD4" }}>
                      {phase.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Volume2 size={20} color="#7C3AED" />
              <Text
                style={{ fontSize: 17, fontWeight: "700", color: "#E9D5FF" }}
              >
                Ambient Audio
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowTrackPicker(!showTrackPicker)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: "rgba(124,58,237,0.2)",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "rgba(139,92,246,0.3)",
              }}
            >
              <Text
                style={{ color: "#C4B5FD", fontSize: 13, fontWeight: "600" }}
              >
                {TRACK_INFO[defaultTrack]?.emoji}{" "}
                {TRACK_INFO[defaultTrack]?.name}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Choose your preferred ambient soundscape for readings. The app will
            also suggest tracks based on the cards you draw.
          </Text>

          {showTrackPicker && (
            <View style={{ gap: 8 }}>
              {trackKeys.map((key) => {
                const track = TRACK_INFO[key];
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      setDefaultTrack(key);
                      setShowTrackPicker(false);
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      backgroundColor:
                        defaultTrack === key
                          ? "rgba(124,58,237,0.2)"
                          : "rgba(255,255,255,0.02)",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor:
                        defaultTrack === key
                          ? "#7C3AED"
                          : "rgba(139,92,246,0.15)",
                      gap: 12,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{track.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: defaultTrack === key ? "700" : "400",
                          color: defaultTrack === key ? "#C4B5FD" : "#D1D5DB",
                        }}
                      >
                        {track.name}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#9B7FD4" }}>
                        {track.description}
                      </Text>
                    </View>
                    {defaultTrack === key && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#7C3AED",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "rgba(76,29,149,0.15)",
            borderRadius: 12,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: "#7C3AED",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#C4B5FD",
              lineHeight: 20,
            }}
          >
            💡 Tip: Moon phase notifications help you align your readings with
            lunar energy. Full moons are great for release readings, new moons
            for setting intentions.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.22)",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#E9D5FF",
              marginBottom: 12,
            }}
          >
            Moon Phase Reading Guide
          </Text>
          {[
            { emoji: "🌑", phase: "New Moon", spread: "New Moon Intentions" },
            {
              emoji: "🌒",
              phase: "Waxing Crescent",
              spread: "Waxing Moon Growth",
            },
            {
              emoji: "🌓",
              phase: "First Quarter",
              spread: "Decision Crossroads",
            },
            {
              emoji: "🌔",
              phase: "Waxing Gibbous",
              spread: "Self-Love Check-In",
            },
            { emoji: "🌕", phase: "Full Moon", spread: "Full Moon Release" },
            {
              emoji: "🌖",
              phase: "Waning Gibbous",
              spread: "Chakra Alignment",
            },
            { emoji: "🌗", phase: "Last Quarter", spread: "Shadow Work" },
            {
              emoji: "🌘",
              phase: "Waning Crescent",
              spread: "Waning Moon Reflection",
            },
          ].map((item) => (
            <View
              key={item.phase}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(139,92,246,0.1)",
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#C4B5FD" }}
                >
                  {item.phase}
                </Text>
                <Text style={{ fontSize: 11, color: "#9B7FD4" }}>
                  Try: {item.spread}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
