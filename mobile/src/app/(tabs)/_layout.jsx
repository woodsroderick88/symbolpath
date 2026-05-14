import { Tabs } from "expo-router";
import {
  BookOpen,
  Sparkles,
  Compass,
  Moon,
  Settings,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F0A1F",
          borderTopWidth: 1,
          borderTopColor: "rgba(139,92,246,0.15)",
          paddingTop: 6,
          paddingBottom: 2,
        },
        tabBarActiveTintColor: "#C4B5FD",
        tabBarInactiveTintColor: "#4B5563",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: "Reading",
          tabBarIcon: ({ color }) => <Sparkles color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "SymbolPath",
          tabBarIcon: ({ color }) => <Compass color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="moon"
        options={{
          title: "Moon",
          tabBarIcon: ({ color }) => <Moon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />
      {/* Hidden tabs — accessible via navigation but not in the tab bar */}
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="decision-mirror" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="wellness" options={{ href: null }} />
      <Tabs.Screen name="astrology" options={{ href: null }} />
    </Tabs>
  );
}
