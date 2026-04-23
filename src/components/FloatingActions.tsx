import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";
import { buildWhatsappLink } from "@/lib/contact";
import { useContactInfo } from "@/hooks/useContactInfo";

export const FloatingActions = () => {
  const { info } = useContactInfo();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={buildWhatsappLink("Bonjour Rami Clim, je suis intéressé par vos services", info.whatsapp || undefined)}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-7 h-7" />
        </span>
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full gradient-fire text-fire-foreground shadow-fire flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-fade-in"
          aria-label="top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
