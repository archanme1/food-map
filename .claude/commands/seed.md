---
description: Seed the LOCAL database with realistic demo data (restaurants, homemade sellers, users, food-log uploads, requests)
argument-hint: "<what> [count] e.g. restaurants 100 | homemade 20 | users 50 | uploads <username> 120 | requests 30 | all"
allowed-tools: Read, Glob, Grep, Write, Bash(npx supabase status:*), Bash(npx supabase db reset:*), Bash(node:*), Bash(npx tsx:*)
---

Seed the local Supabase database. Input: $ARGUMENTS

## Safety
- LOCAL ONLY. Run `npx supabase status`; use only the local API URL / service key it prints
  (http://127.0.0.1:54321). If anything points to a `*.supabase.co` host, STOP.
- Never write seed scripts that contain real people's data.

## Step 1 — Understand the schema
Read `src/types/database.ts` and the latest migrations. Only seed tables that exist.
If a requested table doesn't exist yet, say which spec creates it and stop.

## Step 2 — Generate
Write/extend a script in `scripts/seed/<what>.ts` (run with `npx tsx`) that uses supabase-js with the local service-role key read from the environment.

Data rules (use the **launch city** from `docs/product/v1.md` §1; if it says TBD, ask the user which city):
- **restaurants**: realistic names across many cuisines; real-looking street addresses inside the city bounds; lat/lng inside the city; `cuisine_id` from the `cuisines` table; ~70% with itemized menus (4–12 items, CAD prices), ~30% menu-photo only (use placeholder image URLs); ~30% accept table requests.
- **homemade**: home-cook sellers with approximate location only in public fields; exact address in the private table; 2–6 listings each.
- **users**: realistic Canadian-diverse names, unique usernames/emails ending `@example.com`, password `password123`.
- **uploads <username> <n>**: spread over the last 12 months with uneven density (some streaks, some gaps, some days with 4+ uploads, some mixed-cuisine days) so both activity-grid views are exercised; set `local_date` consistently.
- **requests**: mix of pending / accepted / declined / expired / completed for existing sellers.
- **promotions**: 3–5 active campaigns among seeded sellers.
- **all**: users → restaurants → homemade → uploads (for 3 users) → requests → promotions.

Insert in a single transaction per table batch; roll back on error.

## Step 3 — Report
Rows inserted per table, a sample of 5 rows, and demo logins.
