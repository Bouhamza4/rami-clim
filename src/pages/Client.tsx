import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Save, User } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Client = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useUserRole();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setFullName((user.user_metadata?.full_name as string) || "");
    setPhone((user.user_metadata?.phone as string) || "");
  }, [user]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
      },
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(t("client.saved"));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fire" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="container max-w-3xl">
        <div className="gradient-card rounded-3xl p-8 border border-border/50 shadow-elegant">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-fire-ice flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-primary">{t("client.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("client.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              {t("client.logout")}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t("client.fullName")}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/70 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
                placeholder={t("client.fullNamePh")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t("client.phone")}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/70 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
                placeholder={t("client.phonePh")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t("client.email")}</label>
              <input
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground"
              />
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("client.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Client;
