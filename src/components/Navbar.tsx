import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Shield } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WeatherWidget } from "./WeatherWidget";
import { useUserRole } from "@/hooks/useUserRole";
import logoOrig from "@/assets/logo-original.jpeg";

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/carte", label: t("nav.carte") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-elegant py-2" : "bg-background/70 backdrop-blur-md py-3 border-b border-border/40"}`}>
      <div className="container flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
            <div className="absolute inset-0 gradient-fire-ice rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
            <img src={logoOrig} alt="Rami Clim" className="relative w-12 h-12 object-contain rounded-full bg-white p-1" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-script text-xl text-fire">Rami Clim</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">HVAC • Solar</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-fire bg-fire/10"
                    : "text-foreground hover:text-fire hover:bg-fire/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full gradient-fire" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WeatherWidget />
          <LanguageSwitcher />
          {isAdmin && (
            <Link to="/admin" className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform" title="Admin">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full gradient-fire text-fire-foreground text-sm font-bold shadow-fire hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            {t("cta.request")}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full glass border border-border/50"
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border/50 mt-2 animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive ? "gradient-fire text-fire-foreground" : "text-foreground hover:bg-accent"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
