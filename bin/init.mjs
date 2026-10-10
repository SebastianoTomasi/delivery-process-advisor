#!/usr/bin/env node

// Delivery process advisor — initialization.
//
// Writes the payload in `src/` into a target project. The contract this
// implements is docs/architecture/initialization.md. Code establishes current
// behavior; a conflict with that contract needs clarification of the intended
// change before either is treated as wrong.
//
// Nothing here exercises judgement about content. Every destination comes from
// the mapping below, asset bytes are copied unchanged, and the only
// file whose existing content is read is the instruction file, to see whether
// its advisor references are already there. New skill links are always relative.

import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  lstatSync,
  symlinkSync,
  rmSync,
  unlinkSync,
} from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAYLOAD = join(PLUGIN_ROOT, 'src');
const MANIFEST = join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');

// The two skill hosts. A skill's files are written once, under the file host,
// and the link host reaches them through one link per skill. A delivered
// project holds one copy of a skill, so editing it cannot leave the two hosts
// disagreeing about what the skill says.
const SKILL_FILE_HOST = join('.agents', 'skills');
const SKILL_LINK_HOST = join('.claude', 'skills');

// Keep every unprefixed name ever delivered here, including retired names,
// so later releases can remove their entries without claiming unrelated skills.
// The legacy prefix remains reserved for cleaning up older installations.
const OWNED_SKILLS = new Set(['next-work', 'propagate-change', 'migrate-docs']);
const LEGACY_SKILL_PREFIX = 'advisor-';

// Assets held under neutral names because their destination is
// instruction-bearing.
const SKILL_ENTRY_ASSET = 'skill-asset.md';
const SKILL_ENTRY_DESTINATION = 'SKILL.md';

// Both hosts read AGENTS.md, so one seed serves them; it becomes the project's
// own file once written. Each directive is the reference one host acts on:
// Claude Code expands the import, Codex follows the explicit sentence.
const INSTRUCTION_FILE = {
  asset: join('instructions', 'instruction-agents.md'),
  destination: 'AGENTS.md',
  directives: [
    '@advisor-agents.md',
    'Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).',
  ],
};

class DeliveryError extends Error {}

function fail(message) {
  throw new DeliveryError(message);
}

// System errors expose errno and code; programming errors must keep their stack.
function isFilesystemError(error) {
  return typeof error?.errno === 'number' && typeof error?.code === 'string';
}

// With no target value, delivery goes to the repository the helper was run from:
// the nearest directory at or above the working directory holding a `.git`, and
// the working directory itself when none does.
function currentRepositoryRoot() {
  let dir = process.cwd();
  for (;;) {
    if (occupied(join(dir, '.git'))) return dir;
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
  const content = readFileSync(MANIFEST, 'utf8');
  try {
    manifest = JSON.parse(content);
  } catch (cause) {
    if (!(cause instanceof SyntaxError)) throw cause;
    fail(`cannot parse the plugin manifest at ${MANIFEST}: ${cause.message}`);
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

// The delivery mapping is fixed and enumerated: mirrored assets keep their
// path, and each skill becomes files under one host plus a link under the
// other. Nothing is derived from the target.
function mapping() {
  const entries = [];

  // src/target/ is a literal mirror — the mapping is the identity.
  const mirror = join(PAYLOAD, 'target');
  if (!occupied(mirror)) fail(`the payload mirror is missing at ${mirror}`);
  for (const path of filesUnder(mirror)) {
    entries.push({ asset: join(mirror, path), destination: path, mode: 'write' });
  }

  // Skills are directories, written whole to the file host, then linked from
  // the link host. A skill's link entry follows its files, so the files are
  // there by the time the link is made.
  const skills = join(PAYLOAD, 'skills');
  const releaseSkills = [];
  if (occupied(skills)) {
    for (const skill of readdirSync(skills, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      const source = join(skills, skill.name);
      if (!OWNED_SKILLS.has(skill.name)) {
        fail(`the payload skill ${source} is not registered as advisor-owned`);
      }
      releaseSkills.push(skill.name);
      const delivered = [];
      for (const path of filesUnder(source)) {
        const name = path === SKILL_ENTRY_ASSET ? SKILL_ENTRY_DESTINATION : path;
        delivered.push(name);
        entries.push({
          asset: join(source, path),
          destination: join(SKILL_FILE_HOST, skill.name, name),
          mode: 'write',
        });
      }
      // The release's files are in place before anything else there is removed.
      entries.push({
        destination: join(SKILL_FILE_HOST, skill.name),
        keep: delivered,
        mode: 'prune',
      });
      entries.push({
        destination: join(SKILL_LINK_HOST, skill.name),
        linked: join(SKILL_FILE_HOST, skill.name),
        mode: 'link',
      });
    }
  }
  entries.push({ hosts: [SKILL_FILE_HOST, SKILL_LINK_HOST], delivered: releaseSkills, mode: 'retire' });

  // The instruction file is ensured rather than written.
  entries.push({ ...INSTRUCTION_FILE, asset: join(PAYLOAD, INSTRUCTION_FILE.asset), mode: 'ensure' });

  return entries;
}

// Inspect the directory entry without following links. Only ENOENT means absent;
// permission errors and non-directory parents must stop delivery.
function entryAt(path) {
  try {
    return lstatSync(path);
  } catch (cause) {
    if (isFilesystemError(cause) && cause.code === 'ENOENT') return null;
    throw cause;
  }
}

function occupied(path) {
  return entryAt(path) !== null;
}

// Rules 1 to 3: write if absent, replace what the advisor owns, refuse a
// directory. A link occupying the name is replaced as an entry and never
// written through, so its referent is left where it is.
function write(entry, target) {
  const path = join(target, entry.destination);
  const existing = entryAt(path);
  if (existing === null) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, readFileSync(entry.asset), { flag: 'wx' });
    return 'written';
  }
  if (existing.isDirectory()) {
    fail(`cannot deliver ${path}: a directory occupies this advisor-owned file destination`);
  }
  removeEntry(path, existing);
  writeFileSync(path, readFileSync(entry.asset), { flag: 'wx' });
  return 'replaced';
}

// Remove the directory entry itself and never what it points at. `rmSync` with
// `force` is wrong here: a dangling link resolves to nothing, so it would be
// left in place and the write that follows would go through the link.
function removeEntry(path, existing) {
  if (existing.isDirectory()) rmSync(path, { recursive: true, force: true });
  else unlinkSync(path);
}

// Rule 2 for a delivered skill directory, which the advisor owns whole: a file
// the invoked release does not contain is not dead weight but an instruction
// the host still loads. Outside the advisor's own skill entries nothing is
// ever removed.
function prune(entry, target) {
  const root = join(target, entry.destination);
  const current = entryAt(root);
  if (current === null || !current.isDirectory()) return [];
  const removed = [];
  for (const path of filesUnder(root)) {
    if (entry.keep.includes(path)) continue;
    rmSync(join(root, path), { force: true });
    removed.push(join(entry.destination, path));
  }
  return removed;
}

// Rule 2 for a skill the invoked release no longer delivers: an advisor-owned
// entry left in either host is an instruction the host still loads, so it is
// removed as an entry, never followed. Only registered names and the legacy
// prefix are owned; other entries and hosts that are themselves links stay.
function retire(entry, target) {
  const removed = [];
  for (const host of entry.hosts) {
    const root = join(target, host);
    const current = entryAt(root);
    if (current === null || !current.isDirectory()) continue;
    for (const name of readdirSync(root)) {
      if ((!OWNED_SKILLS.has(name) && !name.startsWith(LEGACY_SKILL_PREFIX))
        || entry.delivered.includes(name)) continue;
      const path = join(root, name);
      removeEntry(path, entryAt(path));
      removed.push(join(host, name));
    }
  }
  return removed;
}

// Rules 1 and 2 for the second host. A relative symlink preserves the connection
// when the whole project moves. Failure has no junction or copy fallback.
// The advisor owns this entry, so an older link, junction, or independent copy
// is removed and replaced rather than kept forever.
function link(entry, target) {
  const path = join(target, entry.destination);
  const destination = join(target, entry.linked);
  if (!statSync(destination).isDirectory()) {
    fail(`cannot link ${path}: ${destination} is not a directory`);
  }
  const existing = entryAt(path);
  const outcome = existing === null ? 'linked' : 'replaced';
  if (existing !== null) removeEntry(path, existing);
  mkdirSync(dirname(path), { recursive: true });

  try {
    symlinkSync(relative(dirname(path), destination), path, 'dir');
    return outcome;
  } catch (cause) {
    if (!isFilesystemError(cause)) throw cause;
    const hint = process.platform === 'win32' && ['EPERM', 'EACCES'].includes(cause.code)
      ? ' Enable Windows Developer Mode or retry with appropriate administrator permissions.'
      : '';
    fail(`cannot create relative symlink ${path} -> ${destination}: ${cause.message}.${hint}`);
  }
}

// Rule 4: ensure the file carries every host-specific advisor reference. Created
// if absent, appended to with the missing references if present, left alone if
// they are all already there.
function ensure(entry, target) {
  const path = join(target, entry.destination);
  const existingEntry = entryAt(path);
  if (existingEntry === null) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, readFileSync(entry.asset), { flag: 'wx' });
    return 'written';
  }
  if (!existingEntry.isFile() && !existingEntry.isSymbolicLink()) {
    fail(`cannot ensure instruction reference in ${path}: not a regular file or symbolic link`);
  }
  const existing = readFileSync(path, 'utf8');
  const missing = entry.directives.filter(directive => !existing.includes(directive));
  if (missing.length === 0) return 'skipped';
  if (existingEntry.isSymbolicLink()) {
    fail(`cannot ensure instruction reference in ${path}: the linked file lacks a required reference; initialization never appends through a link`);
  }
  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  appendFileSync(path, `${separator}${missing.join('\n\n')}\n`);
  return 'appended';
}

const DELIVER = { write, ensure, link };
const REMOVE = { prune, retire };

function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      'usage: init.mjs [--target <target-project-root>]\n' +
      'with no target value (including a bare --target), use the nearest ancestor\n' +
      'with a .git entry, starting at the working directory; otherwise use the working directory\n'
    );
    return 0;
  }

  const target = options.target;
  if (!statSync(target).isDirectory()) {
    fail(`the target root is not a directory: ${target}`);
  }

  // The implicit target is never silent: it is named before anything is
  // written, so the report says which project received the payload and why.
  if (options.implicit) {
    process.stdout.write(`using the default target: ${target}\n\n`);
  }

  const version = release();
  const counts = { written: 0, replaced: 0, linked: 0, skipped: 0, appended: 0, removed: 0 };

  // Delivery is not atomic. On failure what was written stays written, which is
  // safe because a rerun writes the advisor's own destinations again from the
  // invoked release and still never touches what the project owns.
  for (const entry of mapping()) {
    if (entry.mode in REMOVE) {
      for (const stale of REMOVE[entry.mode](entry, target)) {
        counts.removed += 1;
        process.stdout.write(`${'removed'.padEnd(8)} ${stale.split(sep).join('/')}\n`);
      }
      continue;
    }
    const outcome = DELIVER[entry.mode](entry, target);
    counts[outcome] += 1;
    const destination = entry.destination.split(sep).join('/');
    const suffix = entry.mode === 'link' ? ` -> ${entry.linked.split(sep).join('/')}` : '';
    process.stdout.write(`${outcome.padEnd(8)} ${destination}${suffix}\n`);
  }

  process.stdout.write(
    `\ndelivery-process-advisor@${version} -> ${target}\n` +
    `${counts.written} written, ${counts.replaced} replaced, ${counts.linked} linked, ` +
    `${counts.appended} appended, ${counts.skipped} skipped, ${counts.removed} removed\n`
  );

  return 0;
}

try {
  process.exit(main());
} catch (error) {
  if (!(error instanceof DeliveryError) && !isFilesystemError(error)) throw error;
  process.stderr.write(`initialization failed: ${error.message}\n`);
  process.exit(1);
}
