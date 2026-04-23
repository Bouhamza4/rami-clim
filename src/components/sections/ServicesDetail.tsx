import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Snowflake, Flame, Sun, Zap, Wrench, Settings, AlarmClock, CheckCircle2, Package, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ICONS = {
  ac: { Icon: Snowflake, tone: "ice" },
  heat: { Icon: Flame, tone: "fire" },
  solar: { Icon: Sun, tone: "fire" },
  elec: { Icon: Zap, tone: "ice" },
  maint: { Icon: Wrench, tone: "ice" },
  install: { Icon: Settings, tone: "fire" },
  repair: { Icon: AlarmClock, tone: "fire" },
} as const;

const KEYS = ["ac", "heat", "solar", "elec", "maint", "install", "repair"] as const;

export const ServicesDetail = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-primary">
            <span className="text-gradient-fire-ice">{t("servicesDetail.title")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("servicesDetail.subtitle")}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {KEYS.map((key, i) => {
              const { Icon, tone } = ICONS[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AccordionItem value={key} className="border border-border/50 rounded-2xl overflow-hidden gradient-card data-[state=open]:shadow-elegant transition-shadow">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                      <div className="flex items-center gap-4 flex-1 text-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform ${tone === "fire" ? "gradient-fire shadow-fire" : "gradient-ice shadow-ice"}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-display text-lg text-primary">{t(`services.items.${key}.name`)}</div>
                          <div className="text-xs text-muted-foreground">{t(`services.items.${key}.desc`)}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="grid md:grid-cols-3 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-accent/40 border border-border/40">
                          <div className="flex items-center gap-2 mb-2 text-ice font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            {t("servicesDetail.do")}
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed">{t(`servicesDetail.items.${key}.do`)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/40 border border-border/40">
                          <div className="flex items-center gap-2 mb-2 text-fire font-bold text-sm">
                            <Package className="w-4 h-4" />
                            {t("servicesDetail.install")}
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed">{t(`servicesDetail.items.${key}.install`)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/40 border border-border/40">
                          <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            {t("servicesDetail.issues")}
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed">{t(`servicesDetail.items.${key}.issues`)}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
