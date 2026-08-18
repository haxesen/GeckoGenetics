---
name: supabase-cg-migration
description: >-
  Guidelines and SQL scripts for managing isolated cg_ prefixed tables in the n3xt-level.eu Supabase project.
---

# Supabase Migration & Data Access Guide (`n3xt-level.eu`)

Use this skill when inspecting, querying, or running DDL operations on the Supabase database for GeckoGenetics Hub.

---

## 1. Project Identifiers

- **Project Name**: `n3xt-level.eu`
- **Project Ref / ID**: `fcbpyjpcxrfacecceljb`
- **Database Host**: `db.fcbpyjpcxrfacecceljb.supabase.co`
- **URL**: `https://fcbpyjpcxrfacecceljb.supabase.co`

---

## 2. Table Namespace Standard

All tables belonging to GeckoGenetics Hub **MUST** use the `cg_` prefix:
- `cg_geckos`: Main gecko collection
- `cg_weight_logs`: Growth and weight history
- `cg_clutches`: Egg clutches and incubation tracking

> **WARNING**: Do NOT drop or modify non-`cg_` tables on `n3xt-level.eu` as they belong to other industrial/portfolio projects!

---

## 3. Standard RLS Template

When creating new tables for this project, always apply RLS policies:

```sql
ALTER TABLE public.cg_table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on cg_table_name" ON public.cg_table_name FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cg_table_name" ON public.cg_table_name FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cg_table_name" ON public.cg_table_name FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cg_table_name" ON public.cg_table_name FOR DELETE USING (true);
```
