# HarvestGuard — Setup and Development Guide
Team :<br>

1.Asad Uz Zaman - FrontEnd & Backend<br>
2.Mohammad Fahim - FrontEnd & Ui <br>
3.Usaidur Rahman - Ui and design suggestions<br>
This guide explains how to set up and run the HarvestGuard NextJS project locally, configure Supabase, and prepare for production deployment.

---

## Quick Overview

- Tech stack: Next.js (v16), React, TypeScript
- Data and Auth: Supabase (uses RLS, Auth and Postgres)
- Styling: Tailwind CSS

---

## Prerequisites ✅

- Node.js 18+ (Node 20 recommended). Verify with:

```powershell
node -v
```

- pnpm (preferred) or npm/yarn

```powershell
npm install -g pnpm
# or
# npm install -g yarn
```

- A Supabase account & project
- Optional: `supabase` CLI if you prefer to run migrations from your machine
  - Install via `npm i -g supabase`

---

## Environment Variables (.env.local) ⚠️

This project expects a `.env.local` file at the repo root.

Required environment variables (minimum):

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL (e.g. `https://<project-ref>.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public anon key

Optional variables:

- `OPENWEATHER_API_KEY` — If you want real weather data (default `demo` is used for mock data)

Example `.env.local` (DO NOT COMMIT):

```
NEXT_PUBLIC_SUPABASE_URL=https://my-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (public anon key)
OPENWEATHER_API_KEY=abcdef123456
```

> Security note: Do not commit `.env.local` to git. Add it to `.gitignore` if needed.

You can validate your `.env.local` format using the included helper script:

```powershell
node scripts/check_env.js
```

This script checks for basic formatting and length warnings.

---

## Supabase Setup (Database and Auth) 🗄️

1. Create a new Supabase project at https://app.supabase.com.
2. In the Supabase dashboard go to `Project Settings` → `API` and copy the project URL and ANON key into `.env.local`.
3. Run the DB schema & policies SQL to create the tables and RLS policies (provided in `scripts/001_create_schema.sql`):

- Use the Supabase Dashboard → SQL Editor → New Query → paste the contents of `scripts/001_create_schema.sql` → Run.
- Or, if using Supabase CLI:

```powershell
# login and set up your supabase cli first
supabase login
# run SQL (replace placeholders with real project values) - CLI usage may vary by version
# tips: use the SQL editor for a quick run
```

4. After running the migration, the following tables are created:
- `public.profiles`
- `public.crop_batches`
- `public.risk_assessments`

And appropriate RLS policies are enabled and added so only the authenticated user can access their own data.

---

## Install & Run Locally 🛠️

1. Install dependencies (recommended: pnpm):

```powershell
pnpm install
# OR if you prefer npm
# npm ci
```

2. Start the local development server:

```powershell
pnpm dev
# or using npm
# npm run dev
```

3. Visit `http://localhost:3000` in your browser.

---

## Production Build & Start 🧭

Build the project and run the app in production mode:

```powershell
pnpm build
pnpm start
# npm equivalents
# npm run build
# npm run start
```

---

## Testing Authentication & API

- Visit `/register` to create a new account and let the `on_auth_user_created` trigger add the profile.
- Use the `app/api/batches` endpoints to create and retrieve crop batches; these rely on the Supabase session cookie for authentication.

---

## Optional: Connect a Real Weather API 🌤️

The project includes an example weather API (mocked by default). If you have an OpenWeatherMap API Key:

- Add `OPENWEATHER_API_KEY` to `.env.local`.
- The code in `app/api/weather/route.ts` uses this key and the `demo` fallback if not provided.

---

## Deployment Notes (Vercel recommended) 🚀

- Configure environment variables in Vercel's project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `OPENWEATHER_API_KEY` (optional)

- Add build command (if needed) and use the `next` adapter. Vercel defaults should work with `pnpm` if present.
- Make sure to keep the `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a public client key; if you require server-side admin tasks, use the service role key only on server-side and never expose it in public env variables.

---

## Linting and Formatting

- Run linting:

```powershell
pnpm lint
# or
# npm run lint
```

> Note: TypeScript compile errors are ignored at build time (`ignoreBuildErrors: true` in `next.config.mjs`). You may want to enable this in production by changing `next.config.mjs`.

---

## Useful Scripts & Files

- `scripts/check_env.js` — verifies `.env.local` file format
- `scripts/001_create_schema.sql` — DB schema and policies
- `scripts/find_duplicates.js` — find duplicated files
- `app/` — Next.js application source
- `lib/supabase` — supabase client/server utilities
- `components/` — UI components

---

## Troubleshooting ⚠️

- If you see an error around Supabase connectivity or `Network error: failed to reach Supabase`, verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
- If `NEXT_PUBLIC_SUPABASE_ANON_KEY` is invalid you may receive `401 Unauthorized` for API endpoints.
- If `pnpm dev` fails, try `npm install` and `npm run dev` as fallback.

---

## FAQ & Security Tips 🔑

- Q: Which keys are safe to expose as `NEXT_PUBLIC_`?
  - A: Only anonymous/public keys should be exposed client-side. Never expose service role keys.

- Q: How can I seed test data?
  - A: Use Supabase SQL Editor or create quick seed scripts using server-side supabase client.

---

If you'd like, I can also:
- Add `README.md` content to a new `SETUP.md` or update the `package.json` with helpful `dev` scripts
- Add a GitHub Action or Vercel config for automatic deploys
- Add a `.env.example` file to demonstrate required environment variables without secrets

Which of these would you like next?
