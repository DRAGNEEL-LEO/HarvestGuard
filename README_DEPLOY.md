Deployment instructions for HarvestGuard (fresh Vercel project)

This repo is configured to deploy cleanly on Vercel using pnpm. Follow the steps below to create a fresh Vercel project and deploy without hassle.

Prerequisites
- A Vercel account
- The project repository (this repo) pushed to GitHub
- Your environment variable values ready (Supabase url/key, Gemini/OpenAI key, OpenWeather key)

What I changed in the repo to make deployment easier
- Added `packageManager: pnpm@8` and `engines.node: >=18` to `package.json` so Vercel detects pnpm and recommended Node.
- `vercel.json` sets `installCommand` to `pnpm install --frozen-lockfile` and `buildCommand` to `pnpm build`.
- `.vercelignore` keeps `pnpm-lock.yaml` so Vercel can detect pnpm and install dependencies correctly.

Environment variables (add these in Vercel Dashboard)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_GEMINI_API_KEY
- OPENWEATHER_API_KEY

Recommended Vercel project settings
1. Create a new project in Vercel and import this GitHub repository.
2. In the Project Settings -> General -> Framework Preset, keep it as `Next.js`.
3. In Project Settings -> Environment Variables, add the variables listed above. Set them for the environments you need (Preview/Production).
4. (Optional) In Project Settings -> General -> Build & Development Settings, ensure:
   - Install Command: `pnpm install --frozen-lockfile` (should be picked up from `vercel.json` automatically)
   - Build Command: `pnpm build`
   - Output Directory: (leave blank for Next.js)

Deploy
- After adding env vars, trigger a deploy by clicking "Deploy" or pushing a new commit to the main branch.

If you see module-not-found errors for packages (like `leaflet`)
- Verify that `pnpm-lock.yaml` exists in the repo (it should).
- Verify that `pnpm` is used by Vercel: the `packageManager` field helps; otherwise set `Install Command` explicitly as above.

If Vercel complains about missing secrets referenced in `vercel.json`
- We removed secret references from `vercel.json` to avoid build-time failures. Instead, add env vars in the Vercel dashboard (see list above).

Cleanup
- You can safely remove `.vercel-deploy-trigger` after a successful deploy.

Notes
- For local development: run `pnpm install` then `pnpm dev`.
- If you want me to also add CI checks, GitHub Actions, or more automation for secret propagation, tell me and I will add them.
