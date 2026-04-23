import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Phone, Sparkles, Snowflake, Flame, Sun, Zap, Wind } from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";

export const HeroTech = () => {
  const { t, i18n } = useTranslation();
  const { info } = useContactInfo();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="relative min-h-[88svh] md:min-h-[100svh] overflow-hidden bg-primary flex items-center pt-24 md:pt-28 pb-12 md:pb-16">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ice) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ice) / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Animated scan line */}
      <motion.div
        animate={{ y: ["-10%", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--ice) / 0.12), transparent)" }}
      />

      {/* Glow orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-[22rem] md:w-[28rem] h-[22rem] md:h-[28rem] rounded-full gradient-ice opacity-30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -right-20 w-[24rem] md:w-[32rem] h-[24rem] md:h-[32rem] rounded-full gradient-fire opacity-30 blur-3xl"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`s-${i}`}
            className="absolute"
            initial={{ y: -50, x: `${10 + i * 15}%`, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 0] }}
            transition={{ duration: 14 + i * 2, repeat: Infinity, delay: i * 2.2, ease: "linear" }}
          >
            <Snowflake className="w-3.5 h-3.5 md:w-4 md:h-4 text-ice-glow drop-shadow-[0_0_8px_hsl(var(--ice-glow)/0.9)]" />
          </motion.div>
        ))}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`f-${i}`}
            className="absolute"
            initial={{ y: "100vh", x: `${20 + i * 20}%`, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 0.9, 0] }}
            transition={{ duration: 12 + i, repeat: Infinity, delay: i * 2.5, ease: "easeOut" }}
          >
            <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-fire-glow drop-shadow-[0_0_8px_hsl(var(--fire-glow)/0.9)]" />
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center lg:text-start"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-ice/30 text-[11px] md:text-xs font-bold mb-5 md:mb-6 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire-glow opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fire" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-fire-glow" />
            {t("hero.badge")}
          </motion.div>

          <h1 className={`font-display leading-[1.1] mb-4 md:mb-5 tracking-tight ${
            isRTL
              ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              : "text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl"
          }`}>
            {t("hero.title1")}{" "}
            <span className="text-gradient-fire-ice block sm:inline">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="text-sm md:text-lg text-white/85 max-w-xl mx-auto lg:mx-0 mb-7 md:mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 md:mb-10">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-full gradient-fire text-fire-foreground text-sm md:text-base font-bold shadow-fire hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              {t("hero3d.cta")}
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <a
              href={`tel:${info.phone}`}
              className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-full glass-dark border border-white/30 text-white text-sm md:text-base font-bold hover:bg-white/15 transition-all duration-300"
            >
              <Phone className="w-4 md:w-5 h-4 md:h-5" />
              <span className="tabular-nums">{info.phone_display}</span>
            </a>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4 pt-5 md:pt-6 border-t border-white/15">
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
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center lg:text-start"
              >
                <div className="font-display text-xl md:text-3xl text-gradient-fire-ice leading-none">{s.v}</div>
                <div className="text-[9px] md:text-xs uppercase tracking-wider text-white/70 mt-1.5 leading-tight">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D HVAC orbital scene — visible on all sizes (small on mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[260px] sm:h-[380px] lg:h-[560px] mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 sm:inset-0 rounded-full border border-ice/20"
            style={{ borderStyle: "dashed" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 sm:inset-8 rounded-full border border-fire/15"
            style={{ borderStyle: "dashed" }}
          />

          {/* Center HVAC unit */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
          >
            <div className="absolute inset-0 gradient-fire-ice rounded-3xl blur-2xl opacity-60" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/95 to-ice/20 backdrop-blur-xl border-2 border-white/40 shadow-2xl flex flex-col items-center justify-center p-3 sm:p-6">
              <div className="w-full space-y-1 sm:space-y-1.5 mb-2 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleX: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    className="h-1 bg-primary/40 rounded-full"
                  />
                ))}
              </div>
              <div className="font-display text-[9px] sm:text-xs uppercase tracking-widest text-primary/70 mb-0.5">Rami Clim</div>
              <div className="text-xl sm:text-3xl font-display text-gradient-fire-ice">22°</div>
              <div className="flex gap-1 mt-1 sm:mt-2">
                <Snowflake className="w-3 h-3 text-ice" />
                <Wind className="w-3 h-3 text-ice/60" />
              </div>
            </div>
          </motion.div>

          {/* Orbiting icons — radius scales with screen */}
          {[
            { Icon: Snowflake, bg: "gradient-ice", angle: 0 },
            { Icon: Flame, bg: "gradient-fire", angle: 90 },
            { Icon: Sun, bg: "gradient-fire", angle: 180, anim: "animate-spin-slow" },
            { Icon: Zap, bg: "gradient-ice", angle: 270 },
          ].map(({ Icon, bg, angle, anim }, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
              style={{ marginTop: -20, marginLeft: -20 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
            >
              <div
                className="absolute orbit-radius"
                style={{
                  // CSS variable lets us control radius responsively below
                  transform: `rotate(${angle}deg) translateX(var(--orbit-r, 110px)) rotate(-${angle}deg)`,
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl ${bg} flex items-center justify-center shadow-2xl border-2 border-white/30`}
                >
                  <Icon className={`w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white ${anim || ""}`} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Responsive orbit radius */}
      <style>{`
        .orbit-radius { --orbit-r: 95px; }
        @media (min-width: 640px) { .orbit-radius { --orbit-r: 150px; } }
        @media (min-width: 1024px) { .orbit-radius { --orbit-r: 200px; } }
      `}</style>
    </section>
  );
};
