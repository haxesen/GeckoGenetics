import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcbpyjpcxrfacecceljb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYnB5anBjeHJmYWNlY2NlbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzkwNDEsImV4cCI6MjA4MjUxNTA0MX0.8GUrSh2UcfjYrYIKnCk3-AFAWjvSHWhS6HLdZ0RnhD4';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;


export const SQL_SCHEMA_SCRIPT = `-- ==========================================
-- VITORLÁS GEKKÓ TENYÉSZET ADATBÁZIS SÉMA (cg_ előtaggal)
-- N3xt-level.eu Supabase Projekt elszeparált táblái
-- ==========================================

-- 1. Gekkók fő táblája
CREATE TABLE IF NOT EXISTS public.cg_geckos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unsexed')),
    hatch_date DATE,
    morph VARCHAR(255) NOT NULL,
    genetics JSONB DEFAULT '{}'::jsonb,
    breeder_name VARCHAR(255),
    purchase_price DECIMAL(10, 2),
    purchase_date DATE,
    status VARCHAR(50) DEFAULT 'breeder' CHECK (status IN ('breeder', 'for_sale', 'reserved', 'sold', 'pet', 'deceased')),
    father_id UUID REFERENCES public.cg_geckos(id) ON DELETE SET NULL,
    mother_id UUID REFERENCES public.cg_geckos(id) ON DELETE SET NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    weight_grams DECIMAL(5, 2),
    notes TEXT,
    main_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Súly / Fejlődés napló
CREATE TABLE IF NOT EXISTS public.cg_weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gecko_id UUID REFERENCES public.cg_geckos(id) ON DELETE CASCADE,
    weight_grams DECIMAL(5, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Fészekaljak / Tojások
CREATE TABLE IF NOT EXISTS public.cg_clutches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    father_id UUID REFERENCES public.cg_geckos(id) ON DELETE SET NULL,
    mother_id UUID REFERENCES public.cg_geckos(id) ON DELETE SET NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    laid_date DATE NOT NULL,
    egg_count INT NOT NULL DEFAULT 2,
    fertile_count INT DEFAULT 2,
    incubation_temp_c DECIMAL(4, 1) DEFAULT 23.5,
    expected_hatch_date DATE,
    status VARCHAR(50) DEFAULT 'incubating' CHECK (status IN ('incubating', 'hatched', 'spoiled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) engedélyezése
ALTER TABLE public.cg_geckos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cg_weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cg_clutches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on cg_geckos" ON public.cg_geckos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cg_geckos" ON public.cg_geckos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cg_geckos" ON public.cg_geckos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cg_geckos" ON public.cg_geckos FOR DELETE USING (true);

CREATE POLICY "Allow public select on cg_weight_logs" ON public.cg_weight_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cg_weight_logs" ON public.cg_weight_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on cg_clutches" ON public.cg_clutches FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cg_clutches" ON public.cg_clutches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cg_clutches" ON public.cg_clutches FOR UPDATE USING (true);
`;

