---
name: gecko-genetics-workflow
description: >-
  Standard development, genetics calculator extension, schema update, and Vercel deployment workflow for GeckoGenetics Hub.
---

# GeckoGenetics Hub Development & Deployment Workflow

Use this skill when extending genetics calculations, adding new morph traits, modifying database schemas, or preparing releases for Vercel.

---

## 1. Extending Morph & Genetics Logic

The genetics engine lives in [`src/utils/genetics.ts`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/utils/genetics.ts) and [`src/types/gecko.ts`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/types/gecko.ts).

### Adding a New Genetic Trait
1. Update `GeckoGenetics` interface in [`src/types/gecko.ts`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/types/gecko.ts).
2. Update default genetics object in [`src/components/AddGeckoModal.tsx`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/components/AddGeckoModal.tsx).
3. Update Punnett square / probability calculation logic in `calculateMorphOutcomes()` inside [`src/utils/genetics.ts`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/utils/genetics.ts).
4. Check for lethal combinations (e.g. Lilly White x Lilly White -> 25% Super Lilly White lethal flag).

---

## 2. Supabase Schema Updates

When adding new columns or tables to Supabase:
- Always use the `cg_` prefix for new tables (`cg_*`).
- Execute SQL via the Supabase MCP tool `execute_sql` targeting project `fcbpyjpcxrfacecceljb` (`n3xt-level.eu`).
- Update `SQL_SCHEMA_SCRIPT` in [`src/services/supabase.ts`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/services/supabase.ts).
- Update select, insert, and update mappings in [`src/context/GeckoContext.tsx`](file:///e:/AntiGravityProjects/Egyeni_kis_projektek/CrestedGecko_adatbazis/src/context/GeckoContext.tsx).

---

## 3. Verification & Vercel Release Checklist

1. Run `npm run build` to verify clean TypeScript compilation:
   ```bash
   npm run build
   ```
2. Commit changes:
   ```bash
   git add .
   git commit -m "feat: description of feature"
   ```
3. Push to `main` branch to trigger Vercel auto-deployment:
   ```bash
   git push -u origin main
   ```
4. Verify production deployment at `https://gecko-genetics-drab.vercel.app`.
