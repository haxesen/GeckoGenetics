# GeckoGenetics Hub — Agent Rules & System Architecture

This repository contains the **GeckoGenetics Hub** (Vitorlás Gekkó Tenyészet Adatbázis & Genetikai Törzskönyv) web application built with React 19, TypeScript, Vite, Recharts, and Supabase.

---

## 1. Core Architecture & Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 8
- **UI & Styling**: HSL-tailored Dark Glassmorphism Design System (`src/index.css`), Lucide Icons, Recharts for weight graphs
- **State Management**: [`GeckoContext.tsx`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/context/GeckoContext.tsx) with LocalStorage fallback and active Supabase sync
- **Database**: Supabase PostgreSQL (`n3xt-level.eu` project, `fcbpyjpcxrfacecceljb.supabase.co`)
- **Deployment**: Vercel CI/CD hooked to GitHub `main` branch (`https://gecko-genetics-drab.vercel.app`)

---

## 2. Database & Supabase Policies (CRITICAL)

- **Database Project**: `n3xt-level.eu` (`https://fcbpyjpcxrfacecceljb.supabase.co`).
- **Table Name Isolation (`cg_` Prefix)**:
  - `cg_geckos`: Main gecko collection and genetic traits
  - `cg_weight_logs`: Growth and weight history logs
  - `cg_clutches`: Egg incubation and clutch tracking
- **STRICT RULE**: The `n3xt-level.eu` Supabase database contains tables from other applications (e.g. `collini_*`, `leads`, `orders`). **NEVER drop, alter, or query tables outside the `cg_*` namespace.**

---

## 3. Data Mapping Standard (camelCase <-> snake_case)

When transferring data between TypeScript and Supabase:
- `Gecko.hatchDate` <-> `cg_geckos.hatch_date`
- `Gecko.breederName` <-> `cg_geckos.breeder_name`
- `Gecko.purchasePrice` <-> `cg_geckos.purchase_price`
- `Gecko.purchaseDate` <-> `cg_geckos.purchase_date`
- `Gecko.fatherId` <-> `cg_geckos.father_id`
- `Gecko.motherId` <-> `cg_geckos.mother_id`
- `Gecko.fatherName` <-> `cg_geckos.father_name`
- `Gecko.motherName` <-> `cg_geckos.mother_name`
- `Gecko.fatherImageUrl` <-> `cg_geckos.father_image_url`
- `Gecko.motherImageUrl` <-> `cg_geckos.mother_image_url`
- `Gecko.weightGrams` <-> `cg_geckos.weight_grams`
- `Gecko.mainImageUrl` <-> `cg_geckos.main_image_url`

---

## 4. Key UI Components & Modals

- **`ImageCropModal`**: WebP compression, aspect ratio toggling (4:3 / 1:1), rotation (90°), automatic fit scale, and `Teljes Kép Használata` bypass.
- **`ImageLightboxModal`**: Full-screen high-resolution zoom overlay for thumbnails, main photo, and parent photos.
- **`DashboardView`**: Collapsible `Gyors Párzási Szimulátor` and `Inkubációs Visszaszámláló` panels (collapsed by default), ambient glass blur card image presentation.
- **`MorphCalculatorView`**: Independent parent selection (Database Gecko vs Custom Genetics for Father & Mother) with DB-to-custom genetics cloning.

---

## 5. Deployment & Build Verification Workflow

Before pushing code changes to GitHub:
1. Run `npm run build` locally to verify TypeScript type-checking and bundling.
2. Commit changes with clear conventional commit messages (`feat:`, `fix:`, `docs:`, `refactor:`).
3. Push to `main` branch on GitHub (`https://github.com/haxesen/GeckoGenetics.git`) to trigger automatic Vercel deployment.

