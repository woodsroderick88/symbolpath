const LANGUAGE_KEY = "app_language";

export const getLanguage = () => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANGUAGE_KEY) || "en";
};

export const setLanguage = (lang) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];
