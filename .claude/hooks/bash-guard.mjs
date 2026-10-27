#!/usr/bin/env node
// PreToolUse (Bash): block risky shell commands.
import { readInput, block, projectDir, git } from './lib.mjs';

const input = await readInput();
const cmd = String(input?.tool_input?.command || '');
if (!cmd) process.exit(0);

const root = projectDir(input);
// Split on shell separators so each sub-command is checked.
const parts = cmd.split(/&&|\|\||;|\n|\|/).map((s) => s.trim()).filter(Boolean);

for (const p of parts) {
  // --- git staging: explicit files only
  if (/^git\s+add\s+(\.|-A|--all|-u|\*)(\s|$)/.test(p)) {
    block('Stage files by name (git add path/to/file ...). Bulk staging can commit secrets or databases.');
  }

  // --- git push safety
  if (/^git\s+push\b/.test(p)) {
    if (/\s(--force|-f)(\s|$)|--force-with-lease/.test(p)) {
      block('Force-push is not allowed.');
    }
    // git push [flags] <remote> <refspec...> — check refspecs (skip the remote)
    const args = p.split(/\s+/).slice(2).filter((t) => !t.startsWith('-'));
    const refspecs = args.slice(1);
    if (refspecs.some((r) => /(^|:|\/)(main|master)$/.test(r))) {
      block('Never push to main. Push the feature branch and open a PR (/ship-feature).');
    }
    const branch = git(['branch', '--show-current'], root);
    if (branch === 'main' || branch === 'master') {
      block('You are on main. Create a feature branch first (/createspecs).');
    }
  }

  // --- commits on main
  if (/^git\s+commit\b/.test(p)) {
    const branch = git(['branch', '--show-current'], root);
    if (branch === 'main' || branch === 'master') {
      block('Do not commit on main. Switch to the feature branch.');
    }
  }

  // --- history rewriting / destructive git
  if (/^git\s+(reset\s+--hard|clean\s+-[a-z]*f|filter-branch|rebase\s+-i)/.test(p)) {
    block('Destructive git command. Ask the user to run it themselves if really needed.');
  }

  // --- remote database changes
  if (/supabase\s+db\s+(push|reset\s+.*--linked)/.test(p) || /supabase\s+db\s+reset\s+--linked/.test(p)) {
    block('Remote database changes go through CI/release, not a dev session. Use local `npx supabase db reset`.');
  }
  if (/supabase\s+(projects\s+delete|link\b)/.test(p)) {
    block('Linking or deleting Supabase projects must be done by the user.');
  }

  // --- secrets
  if (/(^|\s)(cat|less|more|head|tail|grep|sed|awk|bat|open|code)\b[^|]*\.env(?!\.example)(\.|\s|$)/.test(p)) {
    block('Do not read .env files. Use .env.example for variable names.');
  }

  // --- deleting protected paths
  if (/^(rm|unlink|truncate|mv)\b/.test(p) && /(supabase\/migrations|\.git(\/|\s|$)|\.env(?!\.example)|\.claude\/(specs|hooks))/.test(p)) {
    block('This path is protected (migrations, .git, .env, specs, hooks).');
  }
}

process.exit(0);
