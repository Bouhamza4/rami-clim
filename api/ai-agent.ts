import { createClient } from "@supabase/supabase-js";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Payload = {
  messages: ChatMessage[];
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

const clampMessages = (messages: ChatMessage[]) =>
  messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

const norm = (v: string) => v.toLowerCase().normalize("NFKD");

const pickRelevantServices = (question: string, services: ServiceRow[]) => {
  const q = norm(question);
  const byDirectMatch = services.filter((s) => q.includes(norm(s.slug)) || q.includes(norm(s.title)));
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

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.status(200).send("ok");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({ error: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY" });
      return;
    }

    if (!openaiKey) {
      res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      return;
    }

    const body = (req.body || {}) as Payload;
    const messages = clampMessages(Array.isArray(body?.messages) ? body.messages : []);
    if (messages.length === 0) {
      res.status(400).json({ error: "Missing messages" });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
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
      res.status(502).json({ error: "AI provider error", details });
      return;
    }

    const json = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      res.status(502).json({ error: "Empty AI response" });
      return;
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

