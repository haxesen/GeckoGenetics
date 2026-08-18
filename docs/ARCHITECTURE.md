# GeckoGenetics Hub — System Architecture & Data Flow

## 1. Overview
GeckoGenetics Hub is a web application designed for Crested Gecko (*Correlophus ciliatus*) breeders. It provides pedigree tracking, morph genetics calculations (including co-dominant, recessive, and polygenic traits), weight monitoring, egg clutch incubation management, and cloud synchronization via Supabase.

---

## 2. Core Modules & Data Models

### Gekko Model (`Gecko`)
- **Key attributes**: `id`, `code` (e.g. `CG-2024-001`), `name`, `gender` (`male`, `female`, `unsexed`), `morph`, `status` (`breeder`, `for_sale`, `reserved`, `sold`, `pet`, `deceased`), `weightGrams`, `notes`, `mainImageUrl`.
- **Genetics object (`GeckoGenetics`)**:
  - `lillyWhite`: boolean
  - `axanthic`: `'visual' | 'het' | 'none'`
  - `cappuccino`: `'super' | 'visual' | 'none'`
  - `phantom`: boolean
  - `sable`: boolean
  - `pattern`: `'patternless' | 'bicolor' | 'flame' | 'harlequin' | 'extreme_harlequin' | 'tricolor'`
  - `pinstripe`: `'none' | 'low' | 'partial' | 'full' | 'quadstripe'`
  - `dalmatian`: `'none' | 'low' | 'high' | 'super'`
  - `whitewall`: boolean
  - `inkSpot`: boolean

### Weight Entry (`WeightEntry`)
- Tracks weight progression over time (`weightGrams`, `date`, `notes`).

### Clutch & Incubation (`Clutch`)
- Tracks egg clutches (`laidDate`, `eggCount`, `fertileCount`, `incubationTempC`, `expectedHatchDate`, `status`).

---

## 3. Genetics Engine (`src/utils/genetics.ts`)
- Implements Mendelian & co-dominant Punnett calculations for Crested Gecko morphs.
- Automatically calculates probability percentages for offspring morph combinations.
- Detects lethal combinations: **Lilly White x Lilly White** produces 25% homozygous *Super Lilly White* embryos (lethal in ovo).

---

## 4. State Management & Supabase Sync (`src/context/GeckoContext.tsx`)
- App state is provided via React Context (`GeckoProvider`).
- **Primary Data Store**: Supabase PostgreSQL (`cg_geckos`, `cg_weight_logs`, `cg_clutches`).
- **Fallback Store**: Browser `localStorage` (`crested_geckos_db`, `crested_weights_db`, `crested_clutches_db`).
