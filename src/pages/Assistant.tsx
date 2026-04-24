import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type ChatMessage = { role: "user" | "assistant"; content: string };

const Assistant = () => {
  const { t } = useTranslation();
  const { user, loading } = useUserRole();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const initialMessages = useMemo<ChatMessage[]>(
    () => [{ role: "assistant", content: t("assistant.welcome") }],
    [t]
  );

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const clear = () => setMessages(initialMessages);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    const next = [...messages, { role: "user", content: text } satisfies ChatMessage];
    setMessages(next);

    const payload = { messages: next.slice(-12) };
    let reply: string | undefined;

    const supa = await supabase.functions.invoke("ai-agent", { body: payload });
    if (!supa.error) {
      reply = (supa.data as { reply?: string } | null)?.reply?.trim();
    } else {
      try {
        const res = await fetch("/api/ai-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = (await res.json()) as { reply?: string };
          reply = json.reply?.trim();
        } else {
          const details = await res.text();
          toast.error(`${t("assistant.error")} (${supa.error.message}) (${details})`.slice(0, 220));
          setSending(false);
          return;
        }
      } catch (e) {
        toast.error(
          `${t("assistant.error")} (${supa.error.message}) (${
            e instanceof Error ? e.message : "fallback failed"
          })`.slice(0, 220)
        );
        setSending(false);
        return;
      }
    }

    if (!reply) {
      toast.error(t("assistant.error"));
      setSending(false);
      return;
    }

    setMessages([...next, { role: "assistant", content: reply }]);
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fire" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg gradient-card rounded-3xl p-8 border border-border/50 shadow-elegant text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-fire-ice flex items-center justify-center shadow-fire mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl text-primary mb-2">{t("assistant.title")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("assistant.subtitle")}</p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform"
          >
            {t("nav.auth")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 -left-32 w-96 h-96 rounded-full gradient-ice blur-3xl opacity-20" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 rounded-full gradient-fire blur-3xl opacity-20" />
      </div>

      <div className="container max-w-4xl">
        <div className="gradient-card rounded-3xl border border-border/50 shadow-elegant overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border/50 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-fire-ice flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-primary">{t("assistant.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("assistant.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={clear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-accent transition-colors text-sm font-bold"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
              {t("assistant.clear")}
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="h-[46vh] md:h-[52vh] overflow-auto rounded-2xl border border-border bg-background/60 p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto gradient-fire text-fire-foreground shadow-fire"
                      : "mr-auto bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="mr-auto max-w-[92%] rounded-2xl px-4 py-3 text-sm bg-muted text-foreground inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("assistant.thinking")}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={t("assistant.placeholder")}
                className="flex-1 min-h-[52px] max-h-40 resize-y px-4 py-3 rounded-2xl border border-border bg-background/70 focus:border-fire focus:ring-2 focus:ring-fire/20 outline-none"
              />
              <button
                onClick={() => void send()}
                disabled={sending || input.trim().length === 0}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gradient-fire text-fire-foreground font-bold shadow-fire hover:scale-105 transition-transform disabled:opacity-60"
                type="button"
              >
                <Send className="w-4 h-4" />
                {t("assistant.send")}
              </button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {t("assistant.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
