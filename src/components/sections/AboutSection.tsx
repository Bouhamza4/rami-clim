import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Clock, Tag, Award } from "lucide-react";
import serviceAc from "@/assets/service-ac.jpg";

export const AboutSection = () => {
  const { t } = useTranslation();
  const features = [
    { Icon: ShieldCheck, key: "f1" },
    { Icon: Clock, key: "f2" },
    { Icon: Tag, key: "f3" },
    { Icon: Award, key: "f4" },
  ];
  return (
    <section className="py-24 relative">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-6 gradient-fire-ice rounded-[2.5rem] opacity-20 blur-2xl" />
          <div className="relative rounded-3xl overflow-hidden shadow-elegant aspect-[4/3]">
            <img src={serviceAc} alt={t("about.title")} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 -right-6 rtl:-right-auto rtl:-left-6 glass border border-border rounded-2xl p-5 shadow-elegant max-w-[200px]">
            <div className="font-display text-3xl text-gradient-fire">10+</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{t("hero.stat3")}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-fire text-xs font-bold uppercase tracking-widest mb-4">
            {t("about.subtitle")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-6">
            {t("about.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("about.p1")}</p>
          <p className="text-muted-foreground leading-relaxed mb-8">{t("about.p2")}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60 hover:bg-accent transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl gradient-fire-ice flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-sm text-primary">{t(`about.${key}`)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
