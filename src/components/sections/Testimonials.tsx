import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const { t } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as { name: string; text: string }[];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl text-primary">
            <span className="text-gradient-fire-ice">{t("testimonials.title")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-card rounded-3xl p-8 shadow-elegant border border-border/50 hover:shadow-fire transition-all duration-500 hover:-translate-y-2"
            >
              <Quote className="absolute top-6 right-6 rtl:right-auto rtl:left-6 w-10 h-10 text-fire/15" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-fire text-fire" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6">"{it.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-fire-ice flex items-center justify-center text-white font-bold">
                  {it.name.charAt(0)}
                </div>
                <div className="font-semibold text-primary">{it.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
