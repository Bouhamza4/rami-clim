import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logoHd from "@/assets/logo-hd.png";
import { CONTACT } from "@/lib/contact";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Animated airflow lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-ice-glow to-transparent animate-airflow"
            style={{ top: `${15 + i * 22}%`, animationDelay: `${i * 1.8}s` }}
          />
        ))}
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-fire-glow" />
            {t("hero.badge")}
          </motion.div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
            {t("hero.title1")}{" "}
            <span className="text-gradient-fire-ice">{t("hero.title2")}</span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-xl mb-8">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              {t("cta.request")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Link>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-dark border border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {CONTACT.phoneDisplay}
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/15">
            {[
              { v: "500+", l: t("hero.stat1") },
              { v: "7", l: t("hero.stat2") },
              { v: "10+", l: t("hero.stat3") },
              { v: "24/7", l: t("hero.stat4") },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="font-display text-3xl md:text-4xl text-gradient-fire-ice">{s.v}</div>
                <div className="text-xs uppercase tracking-wider opacity-80 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex justify-center items-center relative"
        >
          <div className="absolute inset-0 gradient-fire-ice rounded-full blur-3xl opacity-40 animate-pulse-glow" />
          <div className="relative animate-float-slow">
            <img src={logoHd} alt="Rami Clim Logo" className="w-[420px] h-[420px] object-contain drop-shadow-2xl" />
          </div>
          {/* orbiting dot */}
          <div className="absolute w-full h-full animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-fire-glow shadow-glow" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
