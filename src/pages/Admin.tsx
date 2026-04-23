import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useServices, type Service } from "@/hooks/useServices";
import { useContactInfo } from "@/hooks/useContactInfo";
import {
  Shield, LogOut, Loader2, Star, Wrench, Phone, BarChart3,
  Check, X, Trash2, Plus, Pencil, Save, Inbox, Mail, MessageSquare, TrendingUp, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/ui/star-rating";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import logoOrig from "@/assets/logo-original.jpeg";

type Review = {
  id: string; name: string; rating: number; comment: string;
  service: string | null; city: string | null; approved: boolean; created_at: string;
};

type Message = {
  id: string; name: string; email: string; phone: string | null;
  service: string | null; message: string; status: string; is_read: boolean; created_at: string;
};

type Tab = "stats" | "messages" | "reviews" | "services" | "contact";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: roleLoading } = useUserRole();
  const [tab, setTab] = useState<Tab>("stats");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!roleLoading) {
      if (!user) navigate("/auth", { replace: true });
      else if (!isAdmin) {
        toast.error("Accès refusé : compte non administrateur");
        navigate("/", { replace: true });
      }
    }
  }, [user, isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = () =>
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false)
        .then(({ count }) => setUnreadCount(count || 0));
    load();
    const channel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (roleLoading || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fire" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; Icon: typeof Star; badge?: number }[] = [
    { key: "stats", label: "Statistiques", Icon: BarChart3 },
    { key: "messages", label: "Messages", Icon: Inbox, badge: unreadCount },
    { key: "reviews", label: "Avis", Icon: Star },
    { key: "services", label: "Services", Icon: Wrench },
    { key: "contact", label: "Contact", Icon: Phone },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* Animated background */}
      <AdminBackground />

      <div className="container relative z-10">
        {/* Header with logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 rounded-full border-2 border-dashed border-fire/40"
              />
              <img src={logoOrig} alt="Rami Clim" className="relative w-14 h-14 object-contain rounded-full bg-white p-1 shadow-fire" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-fire" />
                <h1 className="font-display text-2xl md:text-3xl text-primary">Tableau de bord</h1>
              </div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 glass rounded-2xl border border-border/60 mb-8 overflow-x-auto">
          {tabs.map(({ key, label, Icon, badge }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                tab === key ? "gradient-fire text-fire-foreground shadow-fire" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
              {badge ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-fire text-fire-foreground text-[10px] font-black flex items-center justify-center shadow-fire animate-pulse">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "stats" && <StatsTab />}
            {tab === "messages" && <MessagesTab />}
            {tab === "reviews" && <ReviewsTab />}
            {tab === "services" && <ServicesTab />}
            {tab === "contact" && <ContactTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────  ANIMATED BG  ───────────── */
const AdminBackground = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-background to-accent/30" />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--primary) / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
    <motion.div
      animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 -left-32 w-[28rem] h-[28rem] rounded-full gradient-ice opacity-20 blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 -right-32 w-[32rem] h-[32rem] rounded-full gradient-fire opacity-15 blur-3xl"
    />
  </>
);

/* ─────────────  STATS  ───────────── */
const StatsTab = () => {
  const [data, setData] = useState<{
    total: number; approved: number; pending: number; avg: number; services: number;
    msgs: number; unread: number;
    ratingDist: { rating: string; count: number }[];
    monthly: { month: string; reviews: number; messages: number }[];
    serviceDist: { name: string; value: number }[];
  } | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("reviews").select("rating, approved, created_at, service"),
      supabase.from("services").select("id"),
      supabase.from("contact_messages").select("created_at, is_read, service"),
    ]).then(([r, s, m]) => {
      const reviews = (r.data || []) as { rating: number; approved: boolean; created_at: string; service: string | null }[];
      const messages = (m.data || []) as { created_at: string; is_read: boolean; service: string | null }[];
      const approved = reviews.filter((x) => x.approved);
      const avg = approved.length ? approved.reduce((sum, x) => sum + x.rating, 0) / approved.length : 0;

      // Rating distribution
      const ratingDist = [1, 2, 3, 4, 5].map((n) => ({
        rating: `${n}★`,
        count: approved.filter((x) => x.rating === n).length,
      }));

      // Last 6 months
      const months: { month: string; reviews: number; messages: number }[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleDateString("fr-FR", { month: "short" });
        const inMonth = (iso: string) => {
          const dd = new Date(iso);
          return dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear();
        };
        months.push({
          month: label,
          reviews: reviews.filter((x) => inMonth(x.created_at)).length,
          messages: messages.filter((x) => inMonth(x.created_at)).length,
        });
      }

      // Service breakdown (combined)
      const counts = new Map<string, number>();
      [...reviews, ...messages].forEach((x) => {
        const k = x.service || "Autre";
        counts.set(k, (counts.get(k) || 0) + 1);
      });
      const serviceDist = Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setData({
        total: reviews.length,
        approved: approved.length,
        pending: reviews.length - approved.length,
        avg: Number(avg.toFixed(1)),
        services: s.data?.length || 0,
        msgs: messages.length,
        unread: messages.filter((x) => !x.is_read).length,
        ratingDist,
        monthly: months,
        serviceDist,
      });
    });
  }, []);

  if (!data) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-fire" />;

  const cards = [
    { label: "Avis totaux", value: data.total, Icon: Star, tone: "ice" },
    { label: "Approuvés", value: data.approved, Icon: Check, tone: "fire" },
    { label: "En attente", value: data.pending, Icon: Eye, tone: "primary" },
    { label: "Note moyenne", value: data.avg + "★", Icon: TrendingUp, tone: "fire" },
    { label: "Messages", value: data.msgs, Icon: MessageSquare, tone: "ice" },
    { label: "Non lus", value: data.unread, Icon: Mail, tone: "fire" },
  ] as const;

  const PIE_COLORS = ["hsl(var(--fire))", "hsl(var(--ice))", "hsl(var(--fire-glow))", "hsl(var(--ice-glow))", "hsl(var(--primary))", "hsl(var(--muted-foreground))"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="gradient-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{c.label}</div>
              <c.Icon className={`w-4 h-4 ${c.tone === "fire" ? "text-fire" : c.tone === "ice" ? "text-ice" : "text-primary"} group-hover:scale-125 transition-transform`} />
            </div>
            <div className={`font-display text-3xl ${c.tone === "fire" ? "text-fire" : c.tone === "ice" ? "text-ice" : "text-primary"}`}>
              {c.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-2xl p-5 border border-border/50 shadow-sm"
        >
          <h3 className="font-display text-lg text-primary mb-1">Activité — 6 derniers mois</h3>
          <p className="text-xs text-muted-foreground mb-4">Avis & messages reçus par mois</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.monthly}>
              <defs>
                <linearGradient id="gFire" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--fire))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--fire))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gIce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--ice))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--ice))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="reviews" name="Avis" stroke="hsl(var(--fire))" fill="url(#gFire)" strokeWidth={2} />
              <Area type="monotone" dataKey="messages" name="Messages" stroke="hsl(var(--ice))" fill="url(#gIce)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-2xl p-5 border border-border/50 shadow-sm"
        >
          <h3 className="font-display text-lg text-primary mb-1">Distribution des notes</h3>
          <p className="text-xs text-muted-foreground mb-4">Avis approuvés par étoile</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.ratingDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="rating" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Bar dataKey="count" name="Avis" fill="hsl(var(--fire))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {data.serviceDist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="gradient-card rounded-2xl p-5 border border-border/50 shadow-sm lg:col-span-2"
          >
            <h3 className="font-display text-lg text-primary mb-1">Services les plus demandés</h3>
            <p className="text-xs text-muted-foreground mb-4">Avis & messages combinés</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.serviceDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name}>
                  {data.serviceDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─────────────  MESSAGES  ───────────── */
const MessagesTab = () => {
  const [list, setList] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setList((data as Message[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (m: Message) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) toast.error(error.message); else load();
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Supprimé"); load(); }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-fire" />;

  const visible = filter === "unread" ? list.filter((m) => !m.is_read) : list;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === f ? "gradient-fire text-fire-foreground shadow-fire" : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? `Tous (${list.length})` : `Non lus (${list.filter((m) => !m.is_read).length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 && <div className="text-center text-muted-foreground py-12">Aucun message</div>}

      <AnimatePresence>
        {visible.map((m, i) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ delay: i * 0.04 }}
            className={`gradient-card rounded-2xl p-5 border-2 ${m.is_read ? "border-border/50" : "border-fire/40 shadow-fire"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-primary">{m.name}</span>
                  {!m.is_read && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-fire/15 text-fire animate-pulse">NOUVEAU</span>
                  )}
                  {m.service && <span className="text-[10px] px-2 py-0.5 rounded-full bg-ice/15 text-ice font-bold">{m.service}</span>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="hover:text-fire flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</a>
                  {m.phone && <a href={`tel:${m.phone}`} className="hover:text-fire flex items-center gap-1"><Phone className="w-3 h-3" /> {m.phone}</a>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleRead(m)} className={`p-2 rounded-lg ${m.is_read ? "bg-fire/10 text-fire" : "bg-ice/10 text-ice"} hover:scale-110 transition-transform`} title={m.is_read ? "Marquer non lu" : "Marquer lu"}>
                  {m.is_read ? <Eye className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(m.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:scale-110 transition-transform">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{m.message}</p>
            <div className="text-xs text-muted-foreground mt-3">{new Date(m.created_at).toLocaleString("fr-FR")}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────  REVIEWS  ───────────── */
const ReviewsTab = () => {
  const [list, setList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setList((data as Review[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved: !approved }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(!approved ? "Avis approuvé" : "Avis retiré"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); load(); }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-fire" />;

  return (
    <div className="space-y-4">
      {list.length === 0 && <div className="text-center text-muted-foreground py-12">Aucun avis</div>}
      <AnimatePresence>
        {list.map((r, i) => (
          <motion.div
            key={r.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ delay: i * 0.04 }}
            className={`gradient-card rounded-2xl p-5 border-2 ${r.approved ? "border-ice/30" : "border-fire/30"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-primary">{r.name}</span>
                  {r.city && <span className="text-xs text-muted-foreground">· {r.city}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${r.approved ? "bg-ice/15 text-ice" : "bg-fire/15 text-fire"}`}>
                    {r.approved ? "Approuvé" : "En attente"}
                  </span>
                </div>
                <StarRating value={r.rating} readOnly size={16} />
                {r.service && <div className="text-xs text-muted-foreground mt-1">{r.service}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(r.id, r.approved)} className={`p-2 rounded-lg ${r.approved ? "bg-fire/10 text-fire" : "bg-ice/10 text-ice"} hover:scale-110 transition-transform`}>
                  {r.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(r.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:scale-110 transition-transform">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/80">"{r.comment}"</p>
            <div className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString("fr-FR")}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────  SERVICES  ───────────── */
const emptyService: Partial<Service> = {
  slug: "", icon: "wrench", title: "", short_description: "",
  what_we_do: "", what_we_install: "", problems_solutions: "",
  display_order: 0, active: true,
};

const ServicesTab = () => {
  const { services, reload, loading } = useServices(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const save = async () => {
    if (!editing?.slug || !editing.title || !editing.short_description) {
      toast.error("Slug, titre et description courte requis"); return;
    }
    const payload = { ...editing } as any;
    if (payload.id) {
      const { id, ...upd } = payload;
      const { error } = await supabase.from("services").update(upd).eq("id", id);
      if (error) return toast.error(error.message);
      toast.success("Service mis à jour");
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Service ajouté");
    }
    setEditing(null); reload();
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer ce service ?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); reload(); }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-fire" />;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setEditing(emptyService)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform"
      >
        <Plus className="w-4 h-4" /> Ajouter un service
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04 }}
              className={`gradient-card rounded-2xl p-5 border-2 hover:shadow-elegant transition-all ${s.active ? "border-border/50" : "border-destructive/30 opacity-70"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-display text-lg text-primary">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.slug} · ordre {s.display_order} · {s.active ? "actif" : "inactif"}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(s)} className="p-2 rounded-lg bg-ice/10 text-ice hover:scale-110 transition-transform"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(s.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-sm text-foreground/80">{s.short_description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[150] bg-primary/70 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-background rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 shadow-elegant"
          >
            <h3 className="font-display text-xl text-primary mb-4">{editing.id ? "Modifier" : "Nouveau"} service</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="px-4 py-2.5 rounded-xl border border-border bg-background" placeholder="Slug (clim, chauffage...)" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <input className="px-4 py-2.5 rounded-xl border border-border bg-background" placeholder="Icône (snowflake, flame, sun...)" value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
              <input className="px-4 py-2.5 rounded-xl border border-border bg-background sm:col-span-2" placeholder="Titre" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <textarea className="px-4 py-2.5 rounded-xl border border-border bg-background sm:col-span-2" rows={2} placeholder="Description courte" value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              <textarea className="px-4 py-2.5 rounded-xl border border-border bg-background sm:col-span-2" rows={2} placeholder="Ce que nous faisons" value={editing.what_we_do || ""} onChange={(e) => setEditing({ ...editing, what_we_do: e.target.value })} />
              <textarea className="px-4 py-2.5 rounded-xl border border-border bg-background sm:col-span-2" rows={2} placeholder="Ce que nous installons" value={editing.what_we_install || ""} onChange={(e) => setEditing({ ...editing, what_we_install: e.target.value })} />
              <textarea className="px-4 py-2.5 rounded-xl border border-border bg-background sm:col-span-2" rows={2} placeholder="Problèmes & solutions" value={editing.problems_solutions || ""} onChange={(e) => setEditing({ ...editing, problems_solutions: e.target.value })} />
              <input type="number" className="px-4 py-2.5 rounded-xl border border-border bg-background" placeholder="Ordre" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
              <label className="flex items-center gap-2 px-4 py-2.5">
                <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                Service actif
              </label>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full bg-muted hover:bg-muted/70 font-bold">Annuler</button>
              <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire">
                <Save className="w-4 h-4" /> Enregistrer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

/* ─────────────  CONTACT  ───────────── */
const ContactTab = () => {
  const { info, loading } = useContactInfo();
  const [form, setForm] = useState(info);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(info); }, [info]);

  const save = async () => {
    setSaving(true);
    const payload = { ...form } as any;
    delete payload.id;
    let error;
    if (info.id) {
      ({ error } = await supabase.from("contact_info").update(payload).eq("id", info.id));
    } else {
      ({ error } = await supabase.from("contact_info").insert(payload));
    }
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Informations enregistrées");
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-fire" />;

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: "phone", label: "Téléphone (intl, ex: +212657109410)" },
    { key: "phone_display", label: "Téléphone (affichage)" },
    { key: "email", label: "Email" },
    { key: "whatsapp", label: "WhatsApp (sans +)" },
    { key: "address", label: "Adresse" },
    { key: "city", label: "Ville(s)" },
    { key: "facebook_url", label: "Facebook URL" },
    { key: "instagram_url", label: "Instagram URL" },
    { key: "maps_url", label: "Google Maps URL" },
  ];

  return (
    <div className="gradient-card rounded-2xl p-6 border border-border/50 max-w-2xl shadow-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key as string} className={f.key === "maps_url" ? "sm:col-span-2" : ""}>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{f.label}</label>
            <input
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-border bg-background"
              value={(form as any)[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value } as any)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
      </button>
    </div>
  );
};

export default Admin;
