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
  for (const host of ['agents', 'claude']) {
    assets.push([join(f.plugin, `src/instructions/instruction-${host}.md`),
      join(f.target, `${host.toUpperCase()}.md`)]);
  }
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
  const handoffDirectory = join(f.target, 'docs/handoffs');
  assert.ok(lstatSync(handoffDirectory).isDirectory());
  assert.deepEqual(readdirSync(handoffDirectory), []);
  assert.match(first.stdout, /written\s+docs\/handoffs\//);
  assert.equal(existsSync(join(f.target, 'handoffs')), false);
  const before = deliveredAssets(f).map(([, path]) => [path, readFileSync(path), lstatSync(path).mtimeMs]);
  const handoffDirectoryMtime = lstatSync(handoffDirectory).mtimeMs;
  const second = run(f);
  success(second);
  assert.match(second.stdout, /0 written, 0 linked, 0 appended, \d+ skipped/);
  assert.match(second.stdout, /skipped\s+docs\/handoffs\//);
  assert.equal(lstatSync(handoffDirectory).mtimeMs, handoffDirectoryMtime);
  for (const [path, bytes, mtime] of before) {
    assert.deepEqual(readFileSync(path), bytes);
    assert.equal(lstatSync(path).mtimeMs, mtime);
  }
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

test('dangling asset links are skipped without creating their referent', t => {
  const f = fixture(t);
  const referent = join(f.root, 'not-created.md');
  const link = join(f.target, 'advisor-agents.md');
  symlinkSync(referent, link, 'file');
  success(run(f));
  assert.ok(lstatSync(link).isSymbolicLink());
  assert.equal(readlinkSync(link), referent);
  assert.equal(existsSync(referent), false);
});

for (const kind of ['file', 'dangling link']) {
  test(`an occupied handoff directory destination is skipped when it is a ${kind}`, t => {
    const f = fixture(t);
    const path = join(f.target, 'docs/handoffs');
    mkdirSync(dirname(path), { recursive: true });
    let referent;
    if (kind === 'file') {
      writeFileSync(path, 'keep me');
    } else {
      referent = join(f.root, 'missing-handoffs');
      symlinkSync(relative(dirname(path), referent), path, 'dir');
    }

    const result = run(f);
    success(result);
    assert.match(result.stdout, /skipped\s+docs\/handoffs\//);
    if (kind === 'file') assert.equal(readFileSync(path, 'utf8'), 'keep me');
    else {
      assert.ok(lstatSync(path).isSymbolicLink());
      assert.equal(existsSync(referent), false);
    }
  });
}

for (const [host, directive] of [['AGENTS.md', codexDirective], ['CLAUDE.md', '@advisor-agents.md']]) {
  test(`${host}: regular instructions are appended once, preserving existing text`, t => {
    const f = fixture(t);
    const path = join(f.target, host);
    writeFileSync(path, 'existing instructions');
    success(run(f));
    const updated = readFileSync(path, 'utf8');
    assert.equal(updated, `existing instructions\n\n${directive}\n`);
    success(run(f));
    assert.equal(readFileSync(path, 'utf8'), updated);
  });

  for (const kind of ['present', 'missing', 'dangling']) {
    test(`${host}: ${kind} reference through a link never modifies its referent`, t => {
      const f = fixture(t);
      const referent = join(f.root, 'instructions.md');
      const path = join(f.target, host);
      const text = kind === 'present' ? `prefix ${directive} suffix\n` : 'keep these instructions\n';
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
}

test('an unreadable instruction referent fails without being modified', t => {
  const f = fixture(t);
  const referent = join(f.root, 'instructions.md');
  const path = join(f.target, 'AGENTS.md');
  writeFileSync(referent, codexDirective);
  symlinkSync(referent, path, 'file');
  operationalFailure(run(f, { fault: { method: 'readFileSync', path, code: 'EACCES' } }), path);
  assert.equal(readFileSync(referent, 'utf8'), codexDirective);
});

test('unusable ordinary destinations are skipped without certifying reachability', t => {
  const f = fixture(t);
  mkdirSync(join(f.target, 'advisor-agents.md'));
  const skill = readdirSync(join(f.plugin, 'src/skills'))[0];
  const link = join(f.target, '.claude/skills', skill);
  mkdirSync(dirname(link), { recursive: true });
  const missing = join(f.root, 'missing-skill');
  symlinkSync(relative(dirname(link), missing), link, 'dir');
  success(run(f));
  assert.ok(lstatSync(join(f.target, 'advisor-agents.md')).isDirectory());
  assert.ok(lstatSync(link).isSymbolicLink());
  assert.equal(existsSync(missing), false);
});

test('a newer release preserves occupied assets and adds absent ones', t => {
  const f = fixture(t);
  success(run(f));
  const existing = readFileSync(join(f.target, 'advisor-agents.md'));
  appendFileSync(join(f.plugin, 'src/target/advisor-agents.md'), '\nnew release content\n');
  writeFileSync(join(f.plugin, 'src/target/new-asset.md'), 'new asset');
  const manifestPath = join(f.plugin, '.claude-plugin/plugin.json');
  const manifest = JSON.parse(readFileSync(manifestPath));
  manifest.version = '99.0.0';
  writeFileSync(manifestPath, JSON.stringify(manifest));
  const result = run(f);
  success(result);
  assert.deepEqual(readFileSync(join(f.target, 'advisor-agents.md')), existing);
  assert.equal(readFileSync(join(f.target, 'new-asset.md'), 'utf8'), 'new asset');
  assert.match(result.stdout, /delivery-process-advisor@99\.0\.0/);
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

test('a denied handoff-directory creation fails concisely after earlier writes', t => {
  const f = fixture(t);
  const path = join(f.target, 'docs/handoffs');
  const result = run(f, { fault: { method: 'mkdirSync', path, code: 'EACCES' } });
  operationalFailure(result, path);
  assert.match(result.stderr, /EACCES/);
  assert.equal(existsSync(path), false);
  assert.ok(existsSync(join(f.target, 'advisor-agents.md')));
  assert.equal(existsSync(join(f.target, '.agents')), false);
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
