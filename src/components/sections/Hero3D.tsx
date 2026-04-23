import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Phone, Sparkles, Snowflake, Flame, Sun } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import sky from "@/assets/tangier-sky.jpg";
import skyline from "@/assets/tangier-skyline.png";
import medina from "@/assets/tangier-medina.png";
import logoHd from "@/assets/logo-hd.png";

export const Hero3D = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setM({ x, y });
    };
    const el = ref.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  const tx = (depth: number) => `translate3d(${m.x * depth}px, ${m.y * depth}px, 0)`;

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-primary">
      {/* Sky layer */}
      <div className="absolute inset-0" style={{ transform: tx(-15) }}>
        <img src={sky} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/90" />
      </div>

      {/* Sun */}
      <div
        className="absolute top-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 rounded-full gradient-fire blur-2xl opacity-70 animate-pulse-glow"
        style={{ transform: tx(-25) }}
      />

      {/* Skyline back */}
      <div
        className="absolute bottom-0 inset-x-0 pointer-events-none opacity-90"
        style={{ transform: tx(20) }}
      >
        <img src={skyline} alt="" className="w-full object-bottom" loading="eager" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`s-${i}`}
            className="absolute"
            initial={{ y: -50, x: `${i * 13}%`, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 0] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
          >
            <Snowflake className="w-4 h-4 text-ice-glow drop-shadow-[0_0_8px_hsl(var(--ice-glow)/0.8)]" />
          </motion.div>
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`f-${i}`}
            className="absolute"
            initial={{ y: "100vh", x: `${10 + i * 15}%`, opacity: 0 }}
            animate={{ y: -50, opacity: [0, 0.8, 0] }}
            transition={{ duration: 10 + i, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
          >
            <Flame className="w-3.5 h-3.5 text-fire-glow drop-shadow-[0_0_8px_hsl(var(--fire-glow)/0.9)]" />
          </motion.div>
        ))}
      </div>

      {/* Medina foreground */}
      <div
        className="absolute bottom-0 inset-x-0 pointer-events-none"
        style={{ transform: tx(40) }}
      >
        <img src={medina} alt="Tanger" className="w-full object-bottom opacity-95" loading="eager" />
      </div>

      {/* Content */}
      <div className="relative z-10 container min-h-screen flex flex-col justify-center pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl text-white"
          style={{ transform: tx(-8) }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-fire-glow" />
            {t("hero.badge")}
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-4">
            {t("hero.title1")}{" "}
            <span className="text-gradient-fire-ice">{t("hero.title2")}</span>
          </h1>

          <p className="text-base md:text-lg opacity-90 mb-3 italic">
            {t("hero3d.tagline")}
          </p>
          <p className="text-base md:text-lg opacity-80 max-w-xl mb-8">{t("hero.subtitle")}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              {t("hero3d.cta")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-dark border border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {CONTACT.phoneDisplay}
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/15">
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
                <div className="font-display text-2xl md:text-3xl text-gradient-fire-ice">{s.v}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-80 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="hidden lg:block absolute right-12 top-1/3"
          style={{ transform: `${tx(-30)} translate3d(0,0,0)` }}
        >
          <div className="relative animate-float-slow">
            <div className="absolute inset-0 gradient-fire-ice rounded-full blur-3xl opacity-50" />
            <img src={logoHd} alt="" className="relative w-72 h-72 object-contain drop-shadow-2xl" />
            <Sun className="absolute -top-4 -right-4 w-10 h-10 text-fire-glow animate-spin-slow" />
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-2 animate-pulse">
          <span>↖</span> {t("hero3d.move")} <span>↗</span>
        </div>
      </div>
    </section>
  );
};
