---
description: Commit, push, open PR, wait for CI to pass, squash-merge, clean up, and mark the feature shipped
allowed-tools: Read, Edit, Glob, Bash(git:*), Bash(gh pr:*), Bash(gh run:*), Bash(npm run lint:*), Bash(npm run typecheck:*), Bash(npm test:*), mcp__github
---

Ship the current feature branch. Stop at the first failure and report it.

## Step 1 — Preconditions
- `git branch --show-current` → CURRENT_BRANCH. If it is `main`, STOP: "Never ship from main."
- Find the spec whose **Branch** line equals CURRENT_BRANCH in `.claude/specs/`. If none, STOP and ask which spec this is. Call it SPEC.
- Run locally, in order: `npm run lint`, `npm run typecheck`, `npm test`. If any fail, STOP and show the failure. (Skip a script that doesn't exist yet, with a note — e.g. before spec 01 is done.)

## Step 2 — Mark shipped (goes into the PR)
- In CLAUDE.md Feature status table: set SPEC's row to `✅ Shipped`.
- In SPEC: set `**Status:**` to `✅ Shipped` and tick every Definition-of-done item that is verified. If any item is NOT verified, STOP and list it — do not ship.

## Step 3 — Commit (explicit staging only)
- `git status --porcelain` to list changes.
- Refuse to stage: `.env*` (except `.env.example`), `*.db`, `*.sqlite`, `node_modules/`, `ios/`, `android/`, anything > 5 MB. If any are present and unignored, STOP and report.
- `git add <file> <file> ...` — name every file. Never `git add .` / `-A`.
- Conventional Commit message from the diff + spec: lowercase, no period, < 72 chars, describes what the USER can now do.
  - Good: `feat: let customers send pickup requests to restaurants`
  - Bad: `feat: add requests table and api.ts`
- `git commit -m "<message>"`

## Step 4 — Push
`git push -u origin CURRENT_BRANCH`

## Step 5 — Open PR
Use the GitHub MCP (fallback: `gh pr create`), base `main`.
Title: plain English, no prefix. Body:

```markdown
## What this PR does
<Overview paragraph from SPEC>

## Spec
`.claude/specs/<SPEC>.md`

## Changes
- `<file>` — one line each

## Definition of done
<checked list from SPEC>

## How to test
1. `npx supabase start && npx supabase db reset`
2. `npx expo start`
3. <steps from SPEC test plan>
```

## Step 6 — Wait for CI
Run `gh pr checks <PR number> --watch --fail-fast`.
- If any check fails: STOP. Show the failing job name and the relevant log lines
  (`gh run view <run-id> --log-failed`). Do NOT merge. Offer to fix on this branch.
- If no checks are reported after 2 minutes, STOP and say CI is not configured or not triggering.

## Step 7 — Merge
Squash-merge via GitHub MCP (fallback: `gh pr merge <n> --squash --delete-branch`). Delete the remote branch.

## Step 8 — Clean up locally
```
git checkout main
git pull origin main
git branch -D CURRENT_BRANCH
```

## Final summary
```
/ship-feature complete — <SPEC>
✓ Local checks passed
✓ Committed — <message>
✓ PR #<n> — <url>
✓ CI passed
✓ Squash-merged, branches deleted
✓ CLAUDE.md status → ✅
Next: /clear then /createspecs <next number> <next slug>
```
(Read the next row from CLAUDE.md's Feature status table.)

## Rules
- Never merge with failing or missing CI.
- Never force-push.
- If the GitHub MCP is not connected and `gh` is not authenticated, STOP: "Connect GitHub: run /mcp, or `gh auth login`."
