import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BeforeAfter } from "@/components/BeforeAfter";
import b1 from "@/assets/ba-1-before.jpg";
import a1 from "@/assets/ba-1-after.jpg";
import b2 from "@/assets/ba-2-before.jpg";
import a2 from "@/assets/ba-2-after.jpg";

export const BeforeAfterSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-1/3 w-96 h-96 rounded-full gradient-ice blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-96 h-96 rounded-full gradient-fire blur-3xl" />
      </div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-fire text-xs font-bold uppercase tracking-widest mb-4">
            {t("ba.badge")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-primary">
            <span className="text-gradient-fire-ice">{t("ba.title")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("ba.subtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <BeforeAfter before={b1} after={a1} label={t("services.items.ac.name")} />
          <BeforeAfter before={b2} after={a2} label={t("services.items.solar.name")} />
        </div>
      </div>
    </section>
  );
};
