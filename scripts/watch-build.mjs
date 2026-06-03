#!/usr/bin/env node
/**
 * Rebuild `dist/` when `src/` changes (used by `yarn dev` in sibling packages).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = resolve(pkgRoot, 'src');

function ensureInstall() {
  if (existsSync(resolve(pkgRoot, 'node_modules'))) return;
  console.log(`[${pkgRoot.split('/').pop()}] yarn install…`);
  const install = spawnSync('yarn', ['install'], {
    cwd: pkgRoot,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (install.status !== 0) process.exit(install.status ?? 1);
}

function build() {
  ensureInstall();
  const label = pkgRoot.split('/').pop() ?? 'package';
  console.log(`[${label}] building…`);
  const result = spawnSync('yarn', ['build'], {
    cwd: pkgRoot,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

build();

let timer = null;
watch(srcRoot, { recursive: true }, (_event, filename) => {
  if (filename === undefined) return;
  clearTimeout(timer);
  timer = setTimeout(build, 120);
});

console.log(`[${pkgRoot.split('/').pop()}] watching ${srcRoot}`);
