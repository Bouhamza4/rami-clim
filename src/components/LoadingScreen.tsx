import { useEffect, useState } from "react";
import logoOrig from "@/assets/logo-original.jpeg";

export const LoadingScreen = () => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 gradient-fire-ice rounded-full blur-3xl opacity-50 animate-pulse-glow" />
        <img src={logoOrig} alt="Rami Clim" className="relative w-32 h-32 object-contain animate-float-slow rounded-full bg-white p-3 shadow-elegant" />
      </div>
    </div>
  );
};
