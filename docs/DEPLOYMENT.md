# GeckoGenetics Hub — Deployment & Environment Configuration

## 1. Hosting & CI/CD (Vercel)
- **Production URL**: [https://gecko-genetics-drab.vercel.app](https://gecko-genetics-drab.vercel.app)
- **Deployment URL**: [https://gecko-genetics-exxb50pa6-haxesens-projects.vercel.app](https://gecko-genetics-exxb50pa6-haxesens-projects.vercel.app)
- **GitHub Repository**: [https://github.com/haxesen/GeckoGenetics.git](https://github.com/haxesen/GeckoGenetics.git)
- **Triggers**: Every commit pushed to `main` branch triggers an automated Vercel build.

---

## 2. Environment Variables

| Variable Name | Description | Value / Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Project Endpoint | `https://fcbpyjpcxrfacecceljb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public Anon API Key | See `.env` |

> **Note**: For production on Vercel, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Vercel Dashboard -> Project Settings -> Environment Variables**.

---

## 3. Database Project Details (Supabase)
- **Project Name**: `n3xt-level.eu`
- **Tables**: `public.cg_geckos`, `public.cg_weight_logs`, `public.cg_clutches`
- **Row Level Security**: Enabled with public read/write access.
