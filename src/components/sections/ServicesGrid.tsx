import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Snowflake, Flame, Sun, Zap, Wrench, Settings, AlarmClock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS = {
  ac: { Icon: Snowflake, tone: "ice", anim: "animate-pulse-ice" },
  heat: { Icon: Flame, tone: "fire", anim: "animate-pulse-glow" },
  solar: { Icon: Sun, tone: "fire", anim: "animate-spin-slow" },
  elec: { Icon: Zap, tone: "ice", anim: "" },
  maint: { Icon: Wrench, tone: "ice", anim: "" },
  install: { Icon: Settings, tone: "fire", anim: "animate-spin-slow" },
  repair: { Icon: AlarmClock, tone: "fire", anim: "animate-pulse-glow" },
} as const;

type Key = keyof typeof ICONS;
const KEYS: Key[] = ["ac", "heat", "solar", "elec", "maint", "install", "repair"];

export const ServicesGrid = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation();
  const items = compact ? KEYS.slice(0, 4) : KEYS;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px gradient-fire-ice opacity-40" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-fire text-xs font-bold uppercase tracking-widest mb-4">
            {t("services.title")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-primary">
            <span className="text-gradient-fire-ice">{t("services.title")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("services.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((key, i) => {
            const { Icon, tone, anim } = ICONS[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative gradient-card rounded-3xl p-6 border border-border/50 hover:shadow-elegant transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-500 ${tone === "fire" ? "gradient-fire" : "gradient-ice"}`} />

                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tone === "fire" ? "gradient-fire shadow-fire" : "gradient-ice shadow-ice"}`}>
                  <Icon className={`w-7 h-7 text-white ${anim}`} />
                </div>

                <h3 className="font-display text-xl text-primary mb-2">
                  {t(`services.items.${key}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`services.items.${key}.desc`)}
                </p>

                <Link
                  to="/contact"
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold ${tone === "fire" ? "text-fire" : "text-ice"} group-hover:gap-3 transition-all`}
                >
                  → <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
