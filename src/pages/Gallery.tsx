import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CTA } from "@/components/sections/CTA";
import g1 from "@/assets/gallery-card.jpg";
import g2 from "@/assets/gallery-cashplus.jpg";
import g3 from "@/assets/gallery-ducts.jpg";
import g4 from "@/assets/gallery-unit.jpg";
import g5 from "@/assets/gallery-ducts2.jpg";
import ac from "@/assets/service-ac.jpg";
import solar from "@/assets/service-solar.jpg";
import heating from "@/assets/service-heating.jpg";

const items = [
  { src: g3, key: "install", label: "Installation gaines" },
  { src: g1, key: "maint", label: "Carte de visite" },
  { src: g2, key: "install", label: "Cash Plus — Climatisation" },
  { src: g4, key: "ac", label: "Unité intérieure" },
  { src: g5, key: "install", label: "Réseau aéraulique" },
  { src: ac, key: "ac", label: "Climatisation" },
  { src: solar, key: "solar", label: "Panneaux solaires" },
  { src: heating, key: "heat", label: "Chauffage" },
];

const Gallery = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="pt-32 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4">
            <span className="text-gradient-fire-ice">{t("nav.gallery")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("services.subtitle")}</p>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`group relative overflow-hidden rounded-3xl shadow-elegant ${i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"}`}
              >
                <img src={it.src} alt={it.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <span className="text-white font-display text-lg drop-shadow">{it.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
};

export default Gallery;
