import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "@app_language";

export const getLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang || "en";
  } catch (error) {
    console.error("Error getting language:", error);
    return "en";
  }
};

export const setLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.error("Error setting language:", error);
  }
};

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];
