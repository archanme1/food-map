#!/usr/bin/env node
// PostToolUse (Edit|Write|MultiEdit): format code with the project's Prettier.
// Silently does nothing until Prettier is installed (spec 01).
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readInput, projectDir } from './lib.mjs';

const input = await readInput();
const filePath = input?.tool_input?.file_path;
if (!filePath) process.exit(0);
if (!/\.(ts|tsx|js|jsx|mjs|cjs|json)$/.test(filePath)) process.exit(0);
if (filePath.includes('node_modules') || filePath.endsWith('src/types/database.ts')) process.exit(0);

const root = projectDir(input);
const prettier = path.join(root, 'node_modules', '.bin', 'prettier');
if (!existsSync(prettier)) process.exit(0);

try {
  execFileSync(prettier, ['--write', '--log-level', 'warn', filePath], { cwd: root, stdio: 'ignore' });
} catch {
  // Formatting failure (e.g. syntax error) shouldn't block; lint/typecheck will report it.
}
process.exit(0);
