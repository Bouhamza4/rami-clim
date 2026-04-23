import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import {
  Phone, Mail, MapPin, Instagram, Facebook, Download,
  Contact, QrCode, RotateCw, Share2, Globe, Sparkles
} from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";
import logoOrig from "@/assets/logo-original.jpeg";
import { toast } from "sonner";

const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://rami-clim.lovable.app";

const Carte = () => {
  const { t } = useTranslation();
  const { info } = useContactInfo();
  const ADDRESS = `${info.address || "Tanger"}${info.city ? ", " + info.city : ", Maroc"}`;
  const MAPS_LINK = info.maps_url || `https://maps.google.com/?q=${encodeURIComponent(info.address || "Tanger")},Maroc`;
  const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(info.address || "Tanger")},Maroc&z=10&output=embed`;
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadVCard = () => {
    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:Rami Clim
ORG:Rami Clim - HVAC & Solar
TITLE:Climatisation, Chauffage, Énergie Solaire
TEL;TYPE=CELL:${info.phone}
EMAIL:${info.email}
ADR;TYPE=WORK:;;${ADDRESS};Tanger;;;Maroc
URL:${SITE_URL}
URL;type=Instagram:${(info.instagram_url || "#")}
URL;type=Facebook:${(info.facebook_url || "#")}
NOTE:Expert en climatisation, chauffage, panneaux solaires et électricité.
END:VCARD`;
    const blob = new Blob([vcf], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Rami-Clim.vcf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.success(t("carte.vcardOk"));
  };

  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [85, 55] });
      // Background
      pdf.setFillColor(15, 28, 60);
      pdf.rect(0, 0, 85, 55, "F");
      // Accent stripe
      pdf.setFillColor(255, 100, 30);
      pdf.rect(0, 0, 85, 4, "F");
      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Rami Clim", 6, 16);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(255, 180, 130);
      pdf.text("HVAC • SOLAR • ENERGY", 6, 21);
      // Info
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(`Tel: ${info.phone_display}`, 6, 32);
      pdf.text(`Email: ${info.email}`, 6, 38);
      pdf.text(`${ADDRESS}`, 6, 44);
      pdf.text(`${SITE_URL.replace("https://", "")}`, 6, 50);
      pdf.save("Rami-Clim-Carte.pdf");
      toast.success(t("carte.pdfOk"));
    } catch (e) {
      toast.error("PDF error");
    }
  };

  const share = async () => {
    const shareData = {
      title: "Rami Clim",
      text: "Expert en Climatisation, Chauffage & Énergie Solaire — Tanger / Tétouan",
      url: SITE_URL,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(SITE_URL);
      toast.success(t("carte.copied"));
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full gradient-fire blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full gradient-ice blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-fire text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {t("carte.badge")}
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-3">
            <span className="text-gradient-fire-ice">{t("carte.title")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("carte.subtitle")}</p>
        </motion.div>
      </section>

      {/* Card */}
      <section className="pb-16">
        <div className="container">
          <div className="max-w-md mx-auto" style={{ perspective: "1500px" }}>
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full aspect-[1.6/1] cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setFlipped(!flipped)}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                className="absolute inset-0 w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 rounded-3xl shadow-elegant overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-0 bg-primary" />
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute -top-32 -right-20 w-72 h-72 rounded-full gradient-fire blur-3xl" />
                    <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full gradient-ice blur-3xl" />
                  </div>
                  <div className="absolute top-0 inset-x-0 h-1.5 gradient-fire-ice" />
                  <div className="relative h-full p-6 flex flex-col justify-between text-white" dir="ltr">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={logoOrig} alt="" className="w-14 h-14 rounded-full bg-white p-1 object-contain shadow-glow" />
                        <div>
                          <div className="font-script text-2xl text-fire-glow leading-none">Rami Clim</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1">HVAC • SOLAR</div>
                        </div>
                      </div>
                      <RotateCw className="w-4 h-4 opacity-50 animate-pulse" />
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-fire-glow flex-shrink-0" />
                        <span className="font-mono">{info.phone_display}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-ice-glow flex-shrink-0" />
                        <span className="text-xs opacity-90">{info.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-fire-glow flex-shrink-0" />
                        <span className="text-xs opacity-90">{ADDRESS}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 rounded-3xl shadow-elegant overflow-hidden bg-white"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="absolute top-0 inset-x-0 h-1.5 gradient-fire-ice" />
                  <div className="absolute bottom-0 inset-x-0 h-1.5 gradient-fire-ice" />
                  <div className="relative h-full p-5 flex items-center gap-5" dir="ltr">
                    <div className="flex-shrink-0 p-3 bg-white rounded-2xl border-2 border-primary/10">
                      <QRCodeSVG
                        value={SITE_URL}
                        size={110}
                        bgColor="#ffffff"
                        fgColor="#0a1f3d"
                        level="H"
                        marginSize={0}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-script text-xl text-fire">Rami Clim</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Scan & Save</div>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {t("carte.scanText")}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-fire font-bold uppercase">
                        <Globe className="w-3 h-3" /> rami-clim.lovable.app
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <RotateCw className="w-3 h-3" /> {t("carte.tapHint")}
            </div>

            {/* Action buttons */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={downloadVCard}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl gradient-card border border-border/50 hover:shadow-fire hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-xl gradient-fire flex items-center justify-center shadow-fire group-hover:scale-110 transition-transform">
                  <Contact className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-primary text-center">{t("carte.vcard")}</span>
              </button>
              <button
                onClick={downloadPDF}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl gradient-card border border-border/50 hover:shadow-ice hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-xl gradient-ice flex items-center justify-center shadow-ice group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-primary text-center">{t("carte.pdf")}</span>
              </button>
              <button
                onClick={() => setFlipped(!flipped)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl gradient-card border border-border/50 hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-xl gradient-fire-ice flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-primary text-center">{t("carte.qr")}</span>
              </button>
              <button
                onClick={share}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl gradient-card border border-border/50 hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-primary text-center">{t("carte.share")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-3">
              <span className="text-gradient-fire-ice">{t("carte.findUs")}</span>
            </h2>
            <p className="text-muted-foreground">{t("carte.mapSub")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/50 max-w-5xl mx-auto"
          >
            <div className="absolute top-0 inset-x-0 h-1 gradient-fire-ice z-10" />
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rami Clim location"
            />
            <div className="p-5 bg-card flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-fire flex items-center justify-center shadow-fire">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-primary">Rami Clim</div>
                  <div className="text-sm text-muted-foreground">{ADDRESS}</div>
                </div>
              </div>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-fire text-fire-foreground text-sm font-bold shadow-fire hover:shadow-glow hover:scale-105 transition-all"
              >
                <MapPin className="w-4 h-4" /> {t("carte.openMaps")}
              </a>
            </div>
          </motion.div>

          {/* Quick contact buttons */}
          <div className="max-w-3xl mx-auto mt-10 grid sm:grid-cols-3 gap-4">
            <a
              href={`tel:${info.phone}`}
              className="group flex items-center gap-3 p-5 rounded-2xl gradient-card border border-border/50 hover:shadow-fire hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl gradient-fire flex items-center justify-center shadow-fire group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{t("cta.call")}</div>
                <div className="font-bold text-primary text-sm truncate">{info.phone_display}</div>
              </div>
            </a>
            <a
              href={`mailto:${info.email}`}
              className="group flex items-center gap-3 p-5 rounded-2xl gradient-card border border-border/50 hover:shadow-ice hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl gradient-ice flex items-center justify-center shadow-ice group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="font-bold text-primary text-sm truncate">{info.email}</div>
              </div>
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={(info.instagram_url || "#")} target="_blank" rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1 p-5 rounded-2xl gradient-card border border-border/50 hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <Instagram className="w-6 h-6 text-fire" />
                <span className="text-[10px] font-bold text-primary uppercase">Instagram</span>
              </a>
              <a
                href={(info.facebook_url || "#")} target="_blank" rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1 p-5 rounded-2xl gradient-card border border-border/50 hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <Facebook className="w-6 h-6 text-ice" />
                <span className="text-[10px] font-bold text-primary uppercase">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Carte;
