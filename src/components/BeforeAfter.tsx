import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MoveHorizontal } from "lucide-react";

interface Props {
  before: string;
  after: string;
  label?: string;
}

export const BeforeAfter = ({ before, after, label }: Props) => {
  const { t } = useTranslation();
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      ref={ref}
      className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-elegant border border-border/50 select-none cursor-ew-resize touch-none"
      onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => { dragging.current = true; update(e.touches[0].clientX); }}
      onTouchMove={(e) => dragging.current && update(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
    >
      <img src={after} alt="after" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="before" className="absolute inset-0 h-full object-cover" style={{ width: ref.current?.clientWidth, maxWidth: "none" }} loading="lazy" />
      </div>

      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur text-white text-xs font-bold uppercase tracking-wider">
        {t("ba.before")}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full gradient-fire text-fire-foreground text-xs font-bold uppercase tracking-wider shadow-fire">
        {t("ba.after")}
      </div>
      {label && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass text-primary text-xs font-bold whitespace-nowrap">
          {label}
        </div>
      )}

      <div className="absolute top-0 bottom-0 w-1 gradient-fire-ice shadow-glow" style={{ left: `calc(${pos}% - 2px)` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border-2 border-white shadow-elegant flex items-center justify-center">
          <MoveHorizontal className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};
