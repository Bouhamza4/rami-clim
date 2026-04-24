# Rami Clim

## Local setup

Create a `.env` file with:

```bash
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
```

Then run:

```bash
npm install
npm run dev
```

## Vercel deployment

This is a Vite SPA, so `vercel.json` includes a rewrite to `/index.html` for routes like `/auth` and `/admin`.

In Vercel Project Settings -> Environment Variables, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

In Supabase Auth settings, add your domains to:

- `Site URL` (your production domain)
- `Redirect URLs` (for example `https://your-domain.com/admin` and your preview domains)

## Contact email notifications

The contact form saves messages in `contact_messages` and also calls a Supabase Edge Function named `contact-notify` to send an email notification.

Set these Supabase secrets:

- `RESEND_API_KEY` (required)
- `CONTACT_NOTIFY_TO` (optional, defaults to `Younesrm07@gmail.com`)
- `CONTACT_NOTIFY_FROM` (optional, defaults to `Rami Clim <onboarding@resend.dev>`)

Deploy function:

```bash
supabase functions deploy contact-notify --no-verify-jwt
```

## Google authentication

This app supports Google login via Supabase Auth.

1) In Supabase Dashboard -> Authentication -> Providers, enable `Google` and configure Client ID/Secret.
2) In Supabase Dashboard -> Authentication -> URL Configuration, add your domains to `Site URL` and `Redirect URLs` (include `/auth`).

The UI button is in `src/pages/Auth.tsx`.

## AI Agent (Edge Function)

The `/assistant` page calls a Supabase Edge Function named `ai-agent`.
It loads its "knowledge base" from your Supabase database tables: `services` and `contact_info`.

If the Edge Function is not deployed, the app automatically falls back to a Vercel Serverless Function at `/api/ai-agent` (recommended for Vercel deployments).

Set these Supabase secrets:

- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)

Deploy function:

```bash
supabase functions deploy ai-agent
```

### Vercel API (fallback / recommended)

Add these env vars in Vercel Project Settings:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
