import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync,
  readFileSync, readdirSync, readlinkSync, realpathSync, renameSync, rmSync,
  symlinkSync, writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const faultLoader = pathToFileURL(join(repository, 'test/fixtures/filesystem-fault.mjs')).href;
const claudeImport = '@advisor-agents.md';
const codexDirective = 'Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'advisor-init-test-'));
  t.after(() => {
    // Recursive cleanup is restricted to this test's allocated temporary tree.
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(basename(root).startsWith('advisor-init-test-'));
    rmSync(root, { recursive: true, force: true });
  });
  const plugin = join(root, 'plugin');
  mkdirSync(join(plugin, 'bin'), { recursive: true });
  cpSync(join(repository, 'bin/init.mjs'), join(plugin, 'bin/init.mjs'));
  cpSync(join(repository, 'src'), join(plugin, 'src'), { recursive: true });
  mkdirSync(join(plugin, '.claude-plugin'));
  cpSync(join(repository, '.claude-plugin/plugin.json'), join(plugin, '.claude-plugin/plugin.json'));
  const target = join(root, 'target with spaces');
  mkdirSync(target);
  return { root, plugin, target };
}

function run(f, { args = ['--target', f.target], cwd = f.root, fault } = {}) {
  const child = spawnSync(process.execPath, [
    ...(fault ? ['--import', faultLoader] : []), join(f.plugin, 'bin/init.mjs'), ...args,
  ], {
    cwd, encoding: 'utf8', timeout: 20000,
    env: { ...process.env, ...(fault ? { ADVISOR_TEST_FAULT: JSON.stringify(fault) } : {}) },
  });
  assert.ifError(child.error);
  return child;
}

function success(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
}

function operationalFailure(result, path) {
  assert.equal(result.status, 1, result.stdout);
  assert.match(result.stderr, /^initialization failed: /);
  assert.ok(result.stderr.includes(path), result.stderr);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
  assert.doesNotMatch(result.stdout, /\d+ written, \d+ linked/);
}

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? filesUnder(join(directory, entry.name)).map(path => join(entry.name, path))
      : [entry.name]);
}

function deliveredAssets(f) {
  const mirror = join(f.plugin, 'src/target');
  const assets = filesUnder(mirror).map(path => [join(mirror, path), join(f.target, path)]);
  const skills = join(f.plugin, 'src/skills');
  for (const skill of readdirSync(skills)) {
    for (const path of filesUnder(join(skills, skill))) {
      assets.push([join(skills, skill, path), join(f.target, '.agents/skills', skill,
        path === 'skill-asset.md' ? 'SKILL.md' : path)]);
    }
  }
  assets.push([join(f.plugin, 'src/instructions/instruction-agents.md'), join(f.target, 'AGENTS.md')]);
  return assets;
}

test('fresh delivery preserves all asset bytes, reports its release, and is idempotent', t => {
  const f = fixture(t);
  // Literal token and non-UTF8 bytes detect both substitution and text re-encoding.
  writeFileSync(join(f.plugin, 'src/target/byte-probe.bin'),
    Buffer.concat([Buffer.from('{{release}}\r\n'), Buffer.from([0xff, 0, 0x80])]));
  const first = run(f);
  success(first);
  for (const [source, target] of deliveredAssets(f)) {
    assert.deepEqual(readFileSync(target), readFileSync(source), target);
  }
  const version = JSON.parse(readFileSync(join(f.plugin, '.claude-plugin/plugin.json'))).version;
  assert.ok(first.stdout.includes(`delivery-process-advisor@${version}`));
  assert.doesNotMatch(first.stdout, /copied/);
  // No record directory is scaffolded: deferred work lives in the tracker and
  // conversation handoffs are written outside the project.
  for (const absent of ['docs/deferred', 'docs/handoffs', 'handoffs']) {
    assert.equal(existsSync(join(f.target, absent)), false, absent);
  }
  const before = deliveredAssets(f).map(([, path]) => [path, readFileSync(path)]);
  // What the project owns must not be rewritten; what the advisor owns may be,
  // as long as the bytes it writes again are the same.
  // Claude Code reads AGENTS.md, so no CLAUDE.md is seeded.
  assert.equal(existsSync(join(f.target, 'CLAUDE.md')), false);
  const untouched = [join(f.target, 'AGENTS.md')].map(path => [path, lstatSync(path).mtimeMs]);
  const second = run(f);
  success(second);
  assert.match(second.stdout, /0 written, \d+ replaced, 0 linked, 0 appended, \d+ skipped, 0 removed/);
  for (const [path, mtime] of untouched) assert.equal(lstatSync(path).mtimeMs, mtime, path);
  for (const [path, bytes] of before) assert.deepEqual(readFileSync(path), bytes, path);
});

test('all new host links are relative and survive moving the whole target', t => {
  const f = fixture(t);
  success(run(f));
  const moved = join(f.root, 'moved project');
  assert.equal(dirname(resolve(f.target)), resolve(f.root));
  assert.equal(dirname(resolve(moved)), resolve(f.root));
  renameSync(f.target, moved);
  for (const skill of readdirSync(join(moved, '.agents/skills'))) {
    const link = join(moved, '.claude/skills', skill);
    const canonical = join(moved, '.agents/skills', skill);
    assert.ok(lstatSync(link).isSymbolicLink());
    assert.equal(isAbsolute(readlinkSync(link)), false);
    assert.equal(realpathSync(link), realpathSync(canonical));
    assert.deepEqual(readFileSync(join(link, 'SKILL.md')), readFileSync(join(canonical, 'SKILL.md')));
  }
});

test('a dangling asset link is replaced as an entry without creating its referent', t => {
  const f = fixture(t);
  const referent = join(f.root, 'not-created.md');
  const link = join(f.target, 'advisor-agents.md');
  symlinkSync(referent, link, 'file');
  const result = run(f);
  success(result);
  assert.equal(lstatSync(link).isSymbolicLink(), false);
  assert.deepEqual(readFileSync(link), readFileSync(join(f.plugin, 'src/target/advisor-agents.md')));
  assert.equal(existsSync(referent), false);
  assert.match(result.stdout, /replaced\s+advisor-agents\.md/);
});

test('AGENTS.md: regular instructions receive both references once, preserving existing text', t => {
  const f = fixture(t);
  const path = join(f.target, 'AGENTS.md');
  writeFileSync(path, 'existing instructions');
  success(run(f));
  const updated = readFileSync(path, 'utf8');
  assert.equal(updated, `existing instructions\n\n${claudeImport}\n\n${codexDirective}\n`);
  success(run(f));
  assert.equal(readFileSync(path, 'utf8'), updated);
});

for (const [present, absent] of [[claudeImport, codexDirective], [codexDirective, claudeImport]]) {
  test(`AGENTS.md: holding only ${present === claudeImport ? 'the import' : 'the directive'} receives just the other reference`, t => {
    const f = fixture(t);
    const path = join(f.target, 'AGENTS.md');
    writeFileSync(path, `existing instructions\n\n${present}\n`);
    success(run(f));
    assert.equal(readFileSync(path, 'utf8'), `existing instructions\n\n${present}\n\n${absent}\n`);
  });
}

for (const kind of ['present', 'partial', 'missing', 'dangling']) {
  test(`AGENTS.md: ${kind} references through a link never modify their referent`, t => {
    const f = fixture(t);
    const referent = join(f.root, 'instructions.md');
    const path = join(f.target, 'AGENTS.md');
    const text = {
      present: `prefix ${claudeImport} ${codexDirective} suffix\n`,
      partial: `prefix ${codexDirective} suffix\n`,
    }[kind] ?? 'keep these instructions\n';
    if (kind !== 'dangling') writeFileSync(referent, text);
    symlinkSync(referent, path, 'file');
    const result = run(f);
    if (kind === 'present') success(result);
    else operationalFailure(result, path);
    assert.ok(lstatSync(path).isSymbolicLink());
    if (kind === 'dangling') assert.equal(existsSync(referent), false);
    else assert.equal(readFileSync(referent, 'utf8'), text);
  });
}

test('an existing CLAUDE.md is the project\'s own and is left untouched', t => {
  const f = fixture(t);
  const path = join(f.target, 'CLAUDE.md');
  writeFileSync(path, 'claude instructions');
  success(run(f));
  assert.equal(readFileSync(path, 'utf8'), 'claude instructions');
});

test('an unreadable instruction referent fails without being modified', t => {
  const f = fixture(t);
  const referent = join(f.root, 'instructions.md');
  const path = join(f.target, 'AGENTS.md');
  writeFileSync(referent, codexDirective);
  symlinkSync(referent, path, 'file');
  operationalFailure(run(f, { fault: { method: 'readFileSync', path, code: 'EACCES' } }), path);
  assert.equal(readFileSync(referent, 'utf8'), codexDirective);
});

test('a directory occupying an advisor-owned file destination stops delivery intact', t => {
  const f = fixture(t);
  const blocked = join(f.target, 'advisor-agents.md');
  mkdirSync(blocked);
  writeFileSync(join(blocked, 'kept.md'), 'project content');
  const result = run(f);
  operationalFailure(result, blocked);
  assert.ok(lstatSync(blocked).isDirectory());
  assert.equal(readFileSync(join(blocked, 'kept.md'), 'utf8'), 'project content');
});

for (const [kind, occupy] of [
  ['a dangling link', (link, f) =>
    symlinkSync(relative(dirname(link), join(f.root, 'missing-skill')), link, 'dir')],
  ['an independent copy', link => {
    mkdirSync(link, { recursive: true });
    writeFileSync(join(link, 'SKILL.md'), 'a copy left by an older release');
  }],
]) {
  test(`${kind} at a Claude skill destination becomes a relative link`, t => {
    const f = fixture(t);
    const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
    const link = join(f.target, '.claude/skills', skill);
    mkdirSync(dirname(link), { recursive: true });
    occupy(link, f);
    const result = run(f);
    success(result);
    assert.ok(lstatSync(link).isSymbolicLink());
    assert.equal(isAbsolute(readlinkSync(link)), false);
    assert.equal(realpathSync(link), realpathSync(join(f.target, '.agents/skills', skill)));
    assert.equal(existsSync(join(f.root, 'missing-skill')), false);
    assert.match(result.stdout, new RegExp(`replaced\\s+\\.claude/skills/${skill}`));
  });
}

test('a newer release replaces occupied assets and adds absent ones', t => {
  const f = fixture(t);
  success(run(f));
  appendFileSync(join(f.plugin, 'src/target/advisor-agents.md'), '\nnew release content\n');
  writeFileSync(join(f.plugin, 'src/target/new-asset.md'), 'new asset');
  const manifestPath = join(f.plugin, '.claude-plugin/plugin.json');
  const manifest = JSON.parse(readFileSync(manifestPath));
  manifest.version = '99.0.0';
  writeFileSync(manifestPath, JSON.stringify(manifest));
  const result = run(f);
  success(result);
  assert.deepEqual(readFileSync(join(f.target, 'advisor-agents.md')),
    readFileSync(join(f.plugin, 'src/target/advisor-agents.md')));
  assert.equal(readFileSync(join(f.target, 'new-asset.md'), 'utf8'), 'new asset');
  assert.match(result.stdout, /delivery-process-advisor@99\.0\.0/);
  assert.match(result.stdout, /replaced\s+advisor-agents\.md/);
});

test('a delivered skill directory loses the files the invoked release dropped', t => {
  const f = fixture(t);
  success(run(f));
  const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
  const installed = join(f.target, '.agents/skills', skill);
  const stale = join(installed, 'obsolete-reference.md');
  writeFileSync(stale, 'an instruction the host would still load');
  writeFileSync(join(installed, 'SKILL.md'), 'a hand edit');
  const result = run(f);
  success(result);
  assert.equal(existsSync(stale), false);
  assert.match(result.stdout,
    new RegExp(`removed\\s+\\.agents/skills/${skill}/obsolete-reference\\.md`));
  assert.deepEqual(readFileSync(join(installed, 'SKILL.md')),
    readFileSync(join(f.plugin, 'src/skills', skill, 'skill-asset.md')));
});

test('project files beside the delivered scaffolding are never touched', t => {
  const f = fixture(t);
  success(run(f));
  const artifact = join(f.target, 'docs/product/overview.md');
  writeFileSync(artifact, 'a project artifact the payload does not map');
  const record = join(f.target, 'docs/deferred/0001-deferred-question.md');
  mkdirSync(dirname(record), { recursive: true });
  writeFileSync(record, 'a deferred item');
  success(run(f));
  assert.equal(readFileSync(artifact, 'utf8'), 'a project artifact the payload does not map');
  assert.equal(readFileSync(record, 'utf8'), 'a deferred item');
});

test('missing target values select the nearest .git entry and announce it first', t => {
  const f = fixture(t);
  writeFileSync(join(f.root, '.git'), 'outer');
  writeFileSync(join(f.target, '.git'), 'gitdir: another location');
  const cwd = join(f.target, 'nested/deep');
  mkdirSync(cwd, { recursive: true });
  for (const args of [[], ['--target']]) {
    const result = run(f, { args, cwd });
    success(result);
    assert.ok(result.stdout.startsWith(`using the default target: ${f.target}\n\n`));
    assert.doesNotMatch(result.stdout, /no --target given/);
    assert.equal(existsSync(join(cwd, 'advisor-agents.md')), false);
  }
});

test('without a .git ancestor the working directory is the default; explicit targets win', t => {
  const f = fixture(t);
  success(run(f, { args: [], cwd: f.target }));
  assert.ok(existsSync(join(f.target, 'advisor-agents.md')));
  const explicit = join(f.root, 'explicit');
  mkdirSync(explicit);
  const result = run(f, { args: ['--target', explicit], cwd: f.target });
  success(result);
  assert.doesNotMatch(result.stdout, /using the default target/);
  assert.ok(existsSync(join(explicit, 'advisor-agents.md')));
  const help = run(f, { args: ['--help'] });
  success(help);
  assert.match(help.stdout, /bare --target/);
  assert.match(help.stdout, /otherwise use the working directory/);
});

test('a file blocking docs fails concisely after retaining earlier writes', t => {
  const f = fixture(t);
  const path = join(f.target, 'docs');
  writeFileSync(path, 'keep me');
  const result = run(f);
  operationalFailure(result, path);
  assert.ok(existsSync(join(f.target, 'advisor-agents.md')));
  assert.equal(readFileSync(path, 'utf8'), 'keep me');
  assert.equal(existsSync(join(f.target, '.agents')), false);
});

for (const method of ['lstatSync', 'writeFileSync']) {
  test(`${method} permission failures stop instead of being treated as absence`, t => {
    const f = fixture(t);
    const path = join(f.target, 'advisor-agents.md');
    const result = run(f, { fault: { method, path, code: 'EACCES' } });
    operationalFailure(result, path);
    assert.match(result.stderr, /EACCES/);
    assert.equal(existsSync(path), false);
    assert.equal(existsSync(join(f.target, 'docs')), false);
  });
}

test('an unreadable source asset gives operation, path and cause', t => {
  const f = fixture(t);
  const path = join(f.plugin, 'src/target/advisor-agents.md');
  const result = run(f, { fault: { method: 'readFileSync', path, code: 'EACCES' } });
  operationalFailure(result, path);
  assert.match(result.stderr, /readFileSync.*advisor-agents/);
  assert.equal(existsSync(join(f.target, 'advisor-agents.md')), false);
});

test('a denied skill-directory creation fails concisely after earlier writes', t => {
  const f = fixture(t);
  const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
  const path = join(f.target, '.agents/skills', skill);
  const result = run(f, { fault: { method: 'mkdirSync', path, code: 'EACCES' } });
  operationalFailure(result, path);
  assert.match(result.stderr, /EACCES/);
  assert.equal(existsSync(path), false);
  assert.ok(existsSync(join(f.target, 'advisor-agents.md')));
});

test('relative-link failure has no junction or copy fallback', t => {
  const f = fixture(t);
  const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
  const path = join(f.target, '.claude/skills', skill);
  const result = run(f, { fault: { method: 'symlinkSync', path, code: 'EPERM' } });
  operationalFailure(result, path);
  assert.match(result.stderr, /cannot create relative symlink/);
  if (process.platform === 'win32') assert.match(result.stderr, /Developer Mode.*administrator/);
  assert.equal(existsSync(path), false);
  assert.ok(existsSync(join(f.target, '.agents/skills', skill, 'SKILL.md')));
  assert.equal(existsSync(join(f.target, 'AGENTS.md')), false);
});

for (const method of ['readFileSync', 'symlinkSync']) {
  test(`${method} programming defects retain their technical stack`, t => {
    const f = fixture(t);
    const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
    const path = method === 'readFileSync'
      ? join(f.plugin, 'src/target/advisor-agents.md')
      : join(f.target, '.claude/skills', skill);
    const result = run(f, { fault: { method, path, programmingError: true } });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /TypeError: injected programming defect/);
    assert.match(result.stderr, /\n\s+at /);
    assert.doesNotMatch(result.stderr, /^initialization failed:/);
  });
}
