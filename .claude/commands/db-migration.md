---
description: Create a new Supabase migration the safe way (RLS + pgTAP test + regenerated types)
argument-hint: "<snake_case_name> e.g. create_pickup_requests"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(npx supabase migration new:*), Bash(npx supabase db reset:*), Bash(npx supabase status:*), Bash(npx supabase test db:*), Bash(npm run db:types:*)
---

Create a database migration named $ARGUMENTS. Load the **supabase-patterns** skill first.

If no argument: stop with "Usage: /db-migration <snake_case_name>".

## Step 1 — Check
- `npx supabase status` must show the local stack running. If not, stop and say "Run `npx supabase start` first (Docker must be running)."
- Identify the active spec from the current branch. The migration must match that spec's **Database changes** section. If it adds anything not in the spec, stop and ask.

## Step 2 — Create
`npx supabase migration new $ARGUMENTS` — then write SQL into the new file only.
Every migration must:
- Enable RLS on each new table and add explicit policies (select/insert/update/delete as needed)
- Add foreign keys, NOT NULL, CHECK constraints for status enums, and indexes for foreign keys and frequent filters
- Use `timestamptz default now()` for server-owned times
- Put status transitions in `security definer` functions with `set search_path = ''` and explicit ownership checks
- Be idempotent-safe for a fresh `db reset`

Never edit an older migration file. (A hook will block it.)

## Step 3 — Apply locally
`npx supabase db reset` (local only). On error: fix the NEW migration and retry.

## Step 4 — Test + types
- Add/extend `supabase/tests/<spec>.test.sql` with pgTAP checks: RLS enabled, owner can, outsider cannot, invalid status transition rejected.
- `npx supabase test db`
- `npm run db:types`

## Step 5 — Report
File created, tables/functions/policies added, test results, and "types regenerated".
