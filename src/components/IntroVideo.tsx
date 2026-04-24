import { useCallback, useEffect, useRef, useState } from "react";
import introVideo from "@/assets/intro-tech.mp4.asset.json";
import logoOrig from "@/assets/logo-original.jpeg";
import heroBg from "@/assets/hero-bg.jpg";

const KEY = "rc_intro_seen";

export const IntroVideo = () => {
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(KEY) !== "1";
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = useCallback(() => {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("intro-finished"));
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
      void v.play().catch(() => {});
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);

    const max = setTimeout(() => finish(), 5000);
    return () => {
      clearTimeout(max);
      v.removeEventListener("canplay", tryPlay);
      document.body.style.overflow = "";
    };
  }, [show, finish]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={heroBg}
        onEnded={finish}
        className="w-full h-full object-cover opacity-90"
      >
        <source src="/intro-hvac.mp4#t=0,5" type="video/mp4" />
        <source src={introVideo.url} type="video/mp4" />
      </video>
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
