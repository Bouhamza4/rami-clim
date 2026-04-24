import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactPayload = {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ContactPayload;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("CONTACT_NOTIFY_TO") || "Younesrm07@gmail.com";
    const fromEmail = Deno.env.get("CONTACT_NOTIFY_FROM") || "Rami Clim <onboarding@resend.dev>";

    if (!resendKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safe = {
      name: escapeHtml(body.name || ""),
      email: escapeHtml(body.email || ""),
      phone: escapeHtml(body.phone || "-"),
      service: escapeHtml(body.service || "-"),
      message: escapeHtml(body.message || ""),
    };

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `Nouveau message contact - ${safe.name}`,
        html: `
          <h2>Nouveau message depuis le site Rami Clim</h2>
          <p><strong>Nom:</strong> ${safe.name}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Téléphone:</strong> ${safe.phone}</p>
          <p><strong>Service:</strong> ${safe.service}</p>
          <p><strong>Message:</strong></p>
          <p>${safe.message.replaceAll("\n", "<br/>")}</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const details = await emailRes.text();
      return new Response(JSON.stringify({ error: "Email provider error", details }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
