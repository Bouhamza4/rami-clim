import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader2 } from "lucide-react";
import { useWeather, weatherCategory } from "@/hooks/useWeather";

const ICONS = {
  sun: { I: Sun, color: "text-fire-glow", glow: "drop-shadow-[0_0_8px_hsl(var(--fire-glow)/0.8)]" },
  cloud: { I: Cloud, color: "text-ice-glow", glow: "" },
  rain: { I: CloudRain, color: "text-ice", glow: "" },
  snow: { I: CloudSnow, color: "text-ice-glow", glow: "drop-shadow-[0_0_6px_hsl(var(--ice-glow)/0.8)]" },
  storm: { I: CloudLightning, color: "text-fire", glow: "" },
  fog: { I: CloudFog, color: "text-muted-foreground", glow: "" },
};

export const WeatherWidget = ({ compact = false }: { compact?: boolean }) => {
  const { weather, loading } = useWeather();

  if (loading || !weather) {
    return (
      <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass border border-border/50 ${compact ? "" : ""}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cat = weatherCategory(weather.code);
  const { I, color, glow } = ICONS[cat];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      title="Tanger"
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass border border-border/50 hover:border-fire/40 transition-colors"
    >
      <motion.span
        animate={cat === "sun" ? { rotate: 360 } : {}}
        transition={cat === "sun" ? { duration: 25, repeat: Infinity, ease: "linear" } : {}}
        className="inline-flex"
      >
        <I className={`w-4 h-4 ${color} ${glow}`} />
      </motion.span>
      <span className="text-xs font-bold text-foreground tabular-nums">{weather.temp}°</span>
      <span className="hidden md:inline text-[10px] uppercase tracking-wider text-muted-foreground">Tanger</span>
    </motion.div>
  );
};
