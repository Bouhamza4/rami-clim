import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quote, Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/ui/star-rating";
import { toast } from "sonner";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string | null;
  city: string | null;
  created_at: string;
};

export const Reviews = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("");
  const [city, setCity] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    if (!error && data) setList(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || comment.trim().length < 5) {
      toast.error(t("reviews.errInvalid"));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      rating,
      comment: comment.trim(),
      service: service || null,
      city: city || null,
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t("reviews.errSubmit"));
      return;
    }
    toast.success(t("reviews.thanks"), { duration: 5000 });
    setName(""); setComment(""); setService(""); setCity(""); setRating(5);
  };

  const avg = list.length
    ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)
    : "5.0";

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full gradient-fire blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full gradient-ice blur-3xl" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-fire text-xs font-bold uppercase tracking-widest mb-4">
            {t("reviews.badge")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-primary">
            <span className="text-gradient-fire-ice">{t("reviews.title")}</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-lg">
            <StarRating value={Math.round(Number(avg))} readOnly size={28} />
            <span className="font-display text-2xl text-primary">{avg}</span>
            <span className="text-muted-foreground">/ 5 · {list.length} {t("reviews.count")}</span>
          </div>
        </motion.div>

        {/* Grid of reviews */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-muted/40 animate-pulse" />
          ))}
          {!loading && list.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative gradient-card rounded-3xl p-6 border border-border/50 hover:shadow-elegant transition-all duration-500 overflow-hidden"
            >
              <Quote className="absolute -top-2 -right-2 w-20 h-20 text-fire/5 group-hover:text-fire/10 transition-colors" />
              <StarRating value={r.rating} readOnly size={18} />
              <p className="mt-4 text-foreground/85 leading-relaxed text-sm relative">
                "{r.comment}"
              </p>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-primary text-sm">{r.name}</div>
                  {(r.service || r.city) && (
                    <div className="text-xs text-muted-foreground">
                      {[r.service, r.city].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full gradient-fire-ice flex items-center justify-center text-white font-bold text-sm shadow-fire">
                  {r.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </motion.article>
          ))}
          {!loading && list.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {t("reviews.empty")}
            </div>
          )}
        </div>

        {/* Submit form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative gradient-card rounded-3xl p-8 md:p-10 border border-border/50 shadow-elegant overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full gradient-fire opacity-10 blur-2xl" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-fire flex items-center justify-center shadow-fire">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-primary">{t("reviews.formTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("reviews.formSub")}</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4 relative">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required minLength={2} maxLength={80}
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t("reviews.name")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 backdrop-blur focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none transition-all"
                />
                <input
                  value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder={t("reviews.city")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 backdrop-blur focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none transition-all"
                />
              </div>

              <select
                value={service} onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 backdrop-blur focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none transition-all"
              >
                <option value="">{t("reviews.servicePh")}</option>
                {["ac","heat","solar","elec","maint","install","repair"].map((k) => (
                  <option key={k} value={t(`services.items.${k}.name`)}>
                    {t(`services.items.${k}.name`)}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between p-4 rounded-xl bg-accent/40 border border-border/50">
                <span className="font-bold text-primary text-sm">{t("reviews.yourRating")}</span>
                <StarRating value={rating} onChange={setRating} size={28} />
              </div>

              <textarea
                required minLength={5} maxLength={1000} rows={4}
                value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder={t("reviews.commentPh")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 backdrop-blur focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none transition-all resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:shadow-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {submitting ? t("reviews.sending") : t("reviews.submit")}
              </button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ice" />
                {t("reviews.moderation")}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
