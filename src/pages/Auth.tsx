import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogIn, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .order("role")
      .limit(1)
      .maybeSingle();
    navigate(data?.role === "admin" ? "/admin" : "/client", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) redirectByRole(s.user.id);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) redirectByRole(session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [redirectByRole]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6 || (mode === "signup" && fullName.trim().length < 2)) {
      toast.error(t("auth.invalid"));
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/client`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });
      if (error) toast.error(error.message);
      else toast.success(t("auth.signupOk"));
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full gradient-fire blur-3xl opacity-20" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 rounded-full gradient-ice blur-3xl opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md gradient-card rounded-3xl p-8 md:p-10 shadow-elegant border border-border/50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-fire-ice flex items-center justify-center shadow-fire mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-2">{t("auth.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? t("auth.loginSub") : t("auth.signupSub")}
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-full mb-6">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                mode === m ? "gradient-fire text-fire-foreground shadow-fire" : "text-muted-foreground"
              }`}
            >
              {m === "login" ? t("auth.loginTab") : t("auth.signupTab")}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                required
                minLength={2}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("auth.fullNamePh")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("auth.phonePh")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
              />
            </>
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPh")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPh")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {mode === "login" ? t("auth.loginBtn") : t("auth.signupBtn")}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          {t("auth.footer")}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
