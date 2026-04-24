import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MessageCircle, Send, Instagram, Facebook, MapPin, Loader2 } from "lucide-react";
import { z } from "zod";
import { buildWhatsappLink } from "@/lib/contact";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5).max(2000),
});

const Contact = () => {
  const { t } = useTranslation();
  const { info } = useContactInfo();
  const { services } = useServices();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    // Send owner email notification without blocking DB persistence.
    const { error: notifyError } = await supabase.functions.invoke("contact-notify", {
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service: parsed.data.service || null,
        message: parsed.data.message,
      },
    });
    if (notifyError) {
      toast.error(t("contact.notifyError"));
    }

    toast.success(t("contact.success"));
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <>
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-25">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full gradient-ice blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full gradient-fire blur-3xl animate-float-slow" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4">
            <span className="text-gradient-fire-ice">{t("contact.title")}</span>
          </h1>
          <p className="text-lg text-muted-foreground">{t("contact.subtitle")}</p>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-5 gap-8">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="lg:col-span-3 bg-card rounded-3xl p-8 shadow-elegant border border-border/50 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t("contact.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label={t("contact.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t("contact.phone")} type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">{t("contact.service")}</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-all"
                >
                  <option value="">{t("contact.servicePh")}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t("contact.message")}</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:shadow-glow hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {sending ? t("contact.sending") : t("contact.send")}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <InfoCard Icon={Phone} tone="fire" label={t("cta.call")} value={info.phone_display} href={`tel:${info.phone}`} />
            <InfoCard Icon={MessageCircle} tone="green" label="WhatsApp" value={info.phone_display}
              href={buildWhatsappLink("Bonjour Rami Clim, je suis intéressé par vos services")} external />
            <InfoCard Icon={Mail} tone="ice" label="Email" value={info.email} href={`mailto:${info.email}`} />
            <InfoCard Icon={MapPin} tone="primary" label={t("contact.address")} value={info.city || "Tanger"} />

            <div className="flex gap-3 pt-2">
              <a href={info.instagram_url || "#"} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl gradient-fire text-fire-foreground font-bold hover:scale-105 transition-transform">
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a href={info.facebook_url || "#"} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl gradient-ice text-ice-foreground font-bold hover:scale-105 transition-transform">
                <Facebook className="w-5 h-5" /> Facebook
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <label className="block text-sm font-semibold text-primary mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={200}
      className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-all"
    />
  </div>
);

const InfoCard = ({ Icon, label, value, href, tone, external }: { Icon: any; label: string; value: string; href?: string; tone: "fire" | "ice" | "green" | "primary"; external?: boolean }) => {
  const toneClass = { fire: "gradient-fire shadow-fire", ice: "gradient-ice shadow-ice", green: "bg-green-500", primary: "bg-primary" }[tone];
  const Inner = (
    <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-0.5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${toneClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-semibold text-primary truncate">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{Inner}</a> : Inner;
};

export default Contact;
