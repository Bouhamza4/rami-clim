import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGS } from "@/i18n";
import { Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const KEY = "rc_lang_picked";
const INTRO_KEY = "rc_intro_seen";

export const LanguagePickerModal = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY) === "1") return;
    const check = () => {
      if (sessionStorage.getItem(KEY) === "1") {
        clearInterval(id);
        return;
      }
      if (sessionStorage.getItem(INTRO_KEY) === "1") {
        setOpen(true);
        clearInterval(id);
      }
    };
    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  const pick = (code: string) => {
    i18n.changeLanguage(code);
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  };

  const dismiss = () => {
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[180] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md gradient-card rounded-3xl p-8 shadow-elegant border border-border/50"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-fire-ice flex items-center justify-center shadow-fire mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl text-primary mb-2">
                Choose your language
              </h2>
              <p className="text-sm text-muted-foreground">
                اختر لغتك · Choisis ta langue
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => pick(l.code)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    i18n.language === l.code
                      ? "border-fire bg-fire/5 shadow-fire"
                      : "border-border hover:border-fire/50"
                  }`}
                >
                  <span className="text-3xl">{l.flag}</span>
                  <span className="font-bold text-sm text-foreground">{l.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
