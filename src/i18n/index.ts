import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar";
import dr from "./locales/dr";
import fr from "./locales/fr";
import en from "./locales/en";
import es from "./locales/es";
import nl from "./locales/nl";

export const LANGS = [
  { code: "ar", label: "العربية", flag: "🇲🇦", dir: "rtl" },
  { code: "dr", label: "الدارجة", flag: "🇲🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", dir: "ltr" },
] as const;

const SUPPORTED = ["ar", "dr", "fr", "en", "es", "nl"] as const;

const detectLang = (): string => {
  if (typeof window === "undefined") return "fr";
  const saved = localStorage.getItem("lang");
  if (saved && SUPPORTED.includes(saved as any)) return saved;
  const nav = (navigator.language || "fr").toLowerCase();
  const short = nav.split("-")[0];
  // Moroccan Arabic → darija
  if (nav.startsWith("ar-ma")) return "dr";
  if (SUPPORTED.includes(short as any)) return short;
  return "fr";
};

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    dr: { translation: dr },
    fr: { translation: fr },
    en: { translation: en },
    es: { translation: es },
    nl: { translation: nl },
  },
  lng: detectLang(),
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export const applyDir = (lng: string) => {
  const l = LANGS.find((x) => x.code === lng);
  if (typeof document !== "undefined") {
    document.documentElement.dir = l?.dir || "ltr";
    document.documentElement.lang = lng;
  }
};

applyDir(i18n.language);
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  applyDir(lng);
});

export default i18n;
