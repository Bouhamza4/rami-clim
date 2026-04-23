import { useEffect, useRef, useState } from "react";
import introVideo from "@/assets/intro-tech.mp4.asset.json";
import logoOrig from "@/assets/logo-original.jpeg";

const KEY = "rc_intro_seen";

export const IntroVideo = () => {
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(KEY) !== "1";
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
    const max = setTimeout(() => finish(), 6000);
    return () => {
      clearTimeout(max);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const finish = () => {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("intro-finished"));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
      <video
        ref={videoRef}
        src={introVideo.url}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <img
          src={logoOrig}
          alt="Rami Clim"
          className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full bg-white p-3 shadow-glow animate-float-slow mb-6"
        />
        <h1 className="font-script text-5xl md:text-7xl text-white drop-shadow-lg">
          Rami <span className="text-fire-glow">Clim</span>
        </h1>
        <p className="mt-3 text-white/80 uppercase tracking-[0.4em] text-xs md:text-sm">
          Climatisation • Chauffage • Solaire
        </p>
      </div>
      <button
        onClick={finish}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 px-6 py-3 rounded-full gradient-fire text-fire-foreground font-bold text-sm shadow-fire hover:scale-105 transition-transform z-10"
      >
        Skip ›
      </button>
    </div>
  );
};
