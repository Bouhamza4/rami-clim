import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT, buildWhatsappLink } from "@/lib/contact";

export const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden bg-primary p-12 md:p-16 text-center text-white shadow-elegant"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full gradient-fire blur-3xl opacity-40 animate-pulse-glow" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full gradient-ice blur-3xl opacity-40" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              {t("hero.title1")} <span className="text-gradient-fire-ice">{t("hero.title2")}</span>
            </h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" /> {CONTACT.phoneDisplay}
              </a>
              <a href={buildWhatsappLink("Bonjour Rami Clim, je suis intéressé par vos services")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-green-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
