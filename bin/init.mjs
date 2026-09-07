#!/usr/bin/env node

// Delivery process advisor — initialization.
//
// Writes the payload in `src/` into a target project. The contract this
// implements is docs/architecture/initialization.md; where the two disagree the
// contract is right and this file is wrong.
//
// Nothing here exercises judgement. Every destination comes from the mapping
// below, the only substitution is the release marker, and the only file whose
// existing content is read is an instruction file, to see whether its advisor
// reference is already there.

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAYLOAD = join(PLUGIN_ROOT, 'src');
const MANIFEST = join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');

// The two skill hosts. A skill is copied to both from one asset.
const SKILL_HOSTS = [join('.claude', 'skills'), join('.agents', 'skills')];

// Assets held under neutral names because their destination is
// instruction-bearing.
const SKILL_ENTRY_ASSET = 'skill-asset.md';
const SKILL_ENTRY_DESTINATION = 'SKILL.md';

// One seed per host. Each becomes the project's own file once written.
const INSTRUCTION_FILES = [
  {
    asset: join('instructions', 'instruction-claude.md'),
    destination: 'CLAUDE.md',
    directive: '@advisor-agents.md',
  },
  {
    asset: join('instructions', 'instruction-agents.md'),
    destination: 'AGENTS.md',
    directive: 'Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).',
  },
];
const RELEASE_MARKER = '{{release}}';

class DeliveryError extends Error {}

function fail(message) {
  throw new DeliveryError(message);
}

// With no `--target`, delivery goes to the repository the helper was run from:
// the nearest directory at or above the working directory holding a `.git`, and
// the working directory itself when none does.
function currentRepositoryRoot() {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(join(dir, '.git'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

function parseArguments(argv) {
  let target = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--target') {
      target = argv[i + 1];
      i += 1;
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      return { help: true };
    } else {
      fail(`unrecognized argument: ${argv[i]}`);
    }
  }
  if (!target) return { target: currentRepositoryRoot(), implicit: true };
  return { target: resolve(target), implicit: false };
}

function release() {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  } catch (cause) {
    fail(`cannot read the plugin manifest at ${MANIFEST}: ${cause.message}`);
  }
  if (!manifest.version) fail('the plugin manifest declares no version');
  return manifest.version;
}

// Every file under `dir`, as paths relative to it.
function filesUnder(dir) {
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) found.push(relative(dir, path));
    }
  };
  walk(dir);
  return found;
}

// The asset-to-destination mapping. Fixed and enumerated: a skill fans out to
// one destination per host, and nothing here is derived from the target.
function mapping() {
  const entries = [];

  // src/target/ is a literal mirror — the mapping is the identity.
  const mirror = join(PAYLOAD, 'target');
  if (!existsSync(mirror)) fail(`the payload mirror is missing at ${mirror}`);
  for (const path of filesUnder(mirror)) {
    entries.push({ asset: join(mirror, path), destination: path, mode: 'write' });
  }

  // Skills are directories, copied whole, to every host.
  const skills = join(PAYLOAD, 'skills');
  if (existsSync(skills)) {
    for (const skill of readdirSync(skills, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      const source = join(skills, skill.name);
      for (const path of filesUnder(source)) {
        const name = path === SKILL_ENTRY_ASSET ? SKILL_ENTRY_DESTINATION : path;
        for (const host of SKILL_HOSTS) {
          entries.push({ asset: join(source, path), destination: join(host, skill.name, name), mode: 'write' });
        }
      }
    }
  }

  // Instruction files are ensured rather than written.
  for (const seed of INSTRUCTION_FILES) {
    entries.push({
      asset: join(PAYLOAD, seed.asset),
      destination: seed.destination,
      directive: seed.directive,
      mode: 'ensure',
    });
  }

  return entries;
}

function read(asset, version) {
  let content;
  try {
    content = readFileSync(asset, 'utf8');
  } catch (cause) {
    fail(`cannot read asset ${relative(PLUGIN_ROOT, asset)}: ${cause.message}`);
  }
  return content.split(RELEASE_MARKER).join(version);
}

// Rules 1 and 2: write if absent, skip if occupied.
function write(entry, target, version) {
  const path = join(target, entry.destination);
  if (existsSync(path)) return 'skipped';
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, read(entry.asset, version));
  return 'written';
}

// Rule 3: ensure the file carries its host-specific advisor reference. Created
// if absent, appended to if present, left alone if the reference is already there.
function ensure(entry, target, version) {
  const path = join(target, entry.destination);
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, read(entry.asset, version));
    return 'written';
  }
  const existing = readFileSync(path, 'utf8');
  if (existing.includes(entry.directive)) return 'skipped';
  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  appendFileSync(path, `${separator}${entry.directive}\n`);
  return 'appended';
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      'usage: init.mjs [--target <target-project-root>]\n' +
      'with no --target, the current repository root is used\n'
    );
    return 0;
  }

  const target = options.target;
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    fail(`the target root is not a directory: ${target}`);
  }

  // The implicit target is never silent: it is named before anything is
  // written, so the report says which project received the payload and why.
  if (options.implicit) {
    process.stdout.write(`no --target given; delivering to the current repository root: ${target}\n\n`);
  }

  const version = release();
  const counts = { written: 0, skipped: 0, appended: 0 };

  // Delivery is not atomic. On failure what was written stays written, which is
  // safe because nothing pre-existing is ever overwritten.
  for (const entry of mapping()) {
    const outcome = entry.mode === 'ensure' ? ensure(entry, target, version) : write(entry, target, version);
    counts[outcome] += 1;
    process.stdout.write(`${outcome.padEnd(8)} ${entry.destination.split(sep).join('/')}\n`);
  }

  process.stdout.write(
    `\ndelivery-process-advisor@${version} -> ${target}\n` +
    `${counts.written} written, ${counts.appended} appended, ${counts.skipped} skipped\n`
  );
  return 0;
}

try {
  process.exit(main());
} catch (error) {
  if (!(error instanceof DeliveryError)) throw error;
  process.stderr.write(`initialization failed: ${error.message}\n`);
  process.exit(1);
}
