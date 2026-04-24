import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type IncomingMessage = { role: "user" | "assistant"; content: string };

type Payload = {
  messages: IncomingMessage[];
};

type ServiceRow = {
  slug: string;
  title: string;
  short_description: string;
  what_we_do: string | null;
  what_we_install: string | null;
  problems_solutions: string | null;
};

type ContactRow = {
  phone: string | null;
  phone_display: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  whatsapp: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  maps_url: string | null;
};

const clampMessages = (messages: IncomingMessage[]) =>
  messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

const norm = (v: string) => v.toLowerCase().normalize("NFKD");

const pickRelevantServices = (question: string, services: ServiceRow[]) => {
  const q = norm(question);
  const byDirectMatch = services.filter((s) => {
    const slug = norm(s.slug);
    const title = norm(s.title);
    return q.includes(slug) || q.includes(title);
  });
  if (byDirectMatch.length > 0) return byDirectMatch.slice(0, 2);
  return [];
};

const buildKnowledge = (question: string, contact: ContactRow | null, services: ServiceRow[]) => {
  const relevant = pickRelevantServices(question, services);
  const servicesList = services.slice(0, 12).map((s) => ({
    slug: s.slug,
    title: s.title,
    short_description: s.short_description,
  }));

  const out: Record<string, unknown> = {
    contact_info: contact,
    services: servicesList,
  };

  if (relevant.length > 0) {
    out.relevant_service_details = relevant.map((s) => ({
      slug: s.slug,
      title: s.title,
      what_we_do: s.what_we_do,
      what_we_install: s.what_we_install,
      problems_solutions: s.problems_solutions,
    }));
  }

  return JSON.stringify(out);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const openaiModel = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;
    const messages = clampMessages(Array.isArray(body?.messages) ? body.messages : []);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Missing messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const question = messages[messages.length - 1]?.content || "";

    const [{ data: contact }, { data: services }] = await Promise.all([
      supabase
        .from("contact_info")
        .select("phone, phone_display, email, address, city, whatsapp, facebook_url, instagram_url, maps_url")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<ContactRow>(),
      supabase
        .from("services")
        .select("slug, title, short_description, what_we_do, what_we_install, problems_solutions")
        .eq("active", true)
        .order("display_order", { ascending: true })
        .returns<ServiceRow[]>(),
    ]);

    const knowledge = buildKnowledge(question, contact ?? null, services ?? []);

    if (!openaiKey) {
      return new Response(JSON.stringify({ reply: "AI agent is not configured yet (missing OPENAI_API_KEY).", knowledge }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `You are an AI assistant for "Rami Clim" (HVAC, heating, solar energy, maintenance, and repair in Morocco).
Answer in the same language as the user. Be concise and practical.
Use ONLY the provided business data when referring to services/contact info.
If the user asks for an urgent intervention, suggest contacting the company directly via the website contact page.

BUSINESS_DATA_JSON:
${knowledge}`;

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.2,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!upstream.ok) {
      const details = await upstream.text();
      return new Response(JSON.stringify({ error: "AI provider error", details }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return new Response(JSON.stringify({ error: "Empty AI response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply }), {
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
