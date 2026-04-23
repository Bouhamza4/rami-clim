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
