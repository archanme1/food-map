# Spec NN: <Feature Title>

**Branch:** `feature/<slug>`
**Product spec:** `docs/product/v1.md` §<section numbers>
**Plan mode:** required | optional — <one-line reason>
**Status:** 📝 Spec written

## Overview
One paragraph: what the user can do after this ships, and why it comes at this point in the roadmap.

## Depends on
Previous specs that must be ✅ Shipped. "None" if none.

## Context to load
The ONLY files Claude should read to start this feature (keeps the session small).
- `docs/product/v1.md` §<n>
- `src/features/<x>/api.ts`
- ...

## User stories
- As a <customer | seller | visitor>, I can <action> so that <benefit>.

## Screens & routes
- `app/(tabs)/<path>.tsx` — <what it shows> — <access: public | signed-in | seller>

## Database changes
New tables / columns / constraints / indexes, written as a short SQL sketch.
For each table: **RLS policies** (who can select / insert / update / delete).
Postgres functions for status changes.
"No database changes" if none.

## Storage
Buckets, path pattern, and policies. "None" if none.

## Edge Functions
Name, input, output, secrets used. "None" if none.

## Components & hooks
- `src/features/<x>/components/<Name>.tsx` — purpose
- `src/features/<x>/hooks/use<Name>.ts` — query/mutation

## Files to create
## Files to change

## New dependencies
Package + reason. Install with `npx expo install`. "No new dependencies" if none.

## Rules for implementation
Always include:
- RLS on every new table + pgTAP test
- Supabase calls only in `src/features/<x>/api.ts`
- Theme tokens only, no hardcoded colors/sizes
- Loading / empty / error / success states on every screen
- Accessibility labels on every touchable
Feature-specific rules:
- ...

## Out of scope
What this spec deliberately does NOT do (prevents scope creep).

## Definition of done
Specific, testable checklist. Each item verifiable by running the app or a test.
- [ ] ...

## Test plan
- Unit/component tests (jest): ...
- Database tests (pgTAP): ...
- Manual check on device: ...
