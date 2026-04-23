import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Mail, Instagram, Facebook, MapPin } from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";
import logoOrig from "@/assets/logo-original.jpeg";

export const Footer = () => {
  const { t } = useTranslation();
  const { info } = useContactInfo();
  return (
    <footer className="relative mt-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full gradient-fire blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full gradient-ice blur-3xl" />
      </div>
      <div className="relative container py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logoOrig} alt="" className="w-14 h-14 object-contain rounded-full bg-white p-1" />
            <div>
              <div className="font-script text-2xl text-fire-glow">Rami Clim</div>
              <div className="text-xs uppercase tracking-widest opacity-70">{t("footer.tagline")}</div>
            </div>
          </div>
          <p className="opacity-80 max-w-md leading-relaxed">{t("about.p1")}</p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-fire-glow">{t("contact.info")}</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-ice-glow" /><a href={`tel:${info.phone}`}>{info.phone_display}</a></li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-ice-glow" /><a href={`mailto:${info.email}`}>{info.email}</a></li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-ice-glow" />{info.city || info.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-fire-glow">Social</h4>
          <div className="flex gap-3">
            {info.instagram_url && (
              <a href={info.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:gradient-fire transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {info.facebook_url && (
              <a href={info.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:gradient-ice transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link to="/services" className="opacity-80 hover:opacity-100 hover:text-fire-glow transition-colors">{t("nav.services")}</Link>
            <Link to="/about" className="opacity-80 hover:opacity-100 hover:text-fire-glow transition-colors">{t("nav.about")}</Link>
            <Link to="/contact" className="opacity-80 hover:opacity-100 hover:text-fire-glow transition-colors">{t("nav.contact")}</Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-6 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Rami Clim — {t("footer.rights")}
      </div>
    </footer>
  );
};
