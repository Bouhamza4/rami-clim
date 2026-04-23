import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

export const StarRating = ({ value, onChange, size = 24, readOnly = false, className }: Props) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={cn("inline-flex items-center gap-1", className)} dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={cn(
              "transition-all duration-200",
              !readOnly && "hover:scale-125 cursor-pointer",
              readOnly && "cursor-default"
            )}
            aria-label={`${n} stars`}
          >
            <Star
              size={size}
              className={cn(
                "transition-all duration-200",
                filled
                  ? "fill-fire-glow text-fire-glow drop-shadow-[0_0_8px_hsl(var(--fire-glow)/0.6)]"
                  : "fill-transparent text-muted-foreground/40"
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};
