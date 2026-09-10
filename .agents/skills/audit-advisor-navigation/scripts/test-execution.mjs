import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixture } from './test-helpers.mjs';
import { hash, json, readJson, snapshot } from './audit-files.mjs';
import { failureReason, runScenario } from './execution.mjs';
import { runBatch } from './run-batch.mjs';
import { checkFixture } from './check-fixture.mjs';
const here = dirname(fileURLToPath(import.meta.url));
function setup(t, prompt = 'ordinary scenario') {
  const f = fixture(t), scenario = join(f.root, 'scenario.md'), output = join(f.root, 'trace.md'), control = join(f.root, 'control.json');
  writeFileSync(scenario, prompt); writeFileSync(join(f.target, 'data.md'), '# Data\n'); json(control, { quota: true });
  return { ...f, scenario, output, control, runtime: { executable: process.execPath, prefixArgs: [join(here, 'fake-codex.mjs'), control] } };
}
test('successful orchestration archives exact inputs, tools, logs and integrity separately from navigation judgment', async t => {
  const f = setup(t), result = await runScenario(f, f.runtime), evidence = `${f.output}.evidence`;
  assert.equal(result.status, 'completed'); assert.equal(result.navigationVerdict, 'not_reviewed'); assert.equal(result.targetUnchanged, true);
  assert.equal(result.scenarioRevision, hash(readFileSync(f.scenario)));
  assert.ok(existsSync(join(evidence, 'reader.mjs'))); assert.ok(existsSync(join(evidence, 'events.jsonl'))); assert.ok(existsSync(join(evidence, 'stderr.log')));
  const archived = readJson(join(evidence, 'target-before.json'));
  assert.equal(Buffer.from(archived.entries.find(e => e.path === 'data.md').bytes, 'base64').toString(), '# Data\n');
  assert.deepEqual(result.usage, [{ input_tokens: 1, output_tokens: 1 }]);
  await assert.rejects(runScenario(f, f.runtime), /occupied/);
});
test('reviewer inputs and output aliases cannot enter the target', async t => {
  const f = setup(t), kind = process.platform === 'win32' ? 'junction' : 'dir';
  symlinkSync(f.target, join(f.root, 'alias'), kind);
  await assert.rejects(runScenario({ ...f, output: join(f.root, 'alias', 'trace.md') }, f.runtime), /outside/);
  await assert.rejects(runScenario({ ...f, scenario: join(f.target, 'data.md') }, f.runtime), /outside/);
  assert.equal(existsSync(join(f.target, 'trace.md')), false);
});
for (const [prompt, status, reason] of [
  ['FAKE_QUOTA', 'interrupted', 'usage_limit'], ['FAKE_AUTH', 'interrupted', 'authentication'],
  ['FAKE_RATE', 'interrupted', 'rate_limit'],
  ['FAKE_EMPTY', 'setup_error', 'missing_trace'], ['FAKE_FAIL_WITH_TRACE', 'interrupted', 'runtime_error'],
  ['FAKE_MUTATE', 'interrupted', 'target_changed'], ['FAKE_TIMEOUT', 'interrupted', 'timeout'],
]) test(`execution records ${reason} without marking navigation successful`, async t => {
  const f = setup(t, prompt), result = await runScenario({ ...f, timeoutMs: prompt === 'FAKE_TIMEOUT' ? 200 : 5000 }, f.runtime);
  assert.equal(result.status, status); assert.equal(result.reason, reason); assert.equal(result.navigationVerdict, 'not_reviewed');
  assert.equal(readJson(join(`${f.output}.evidence`, 'result.json')).reason, reason);
});
test('missing executable yields an archived setup error', async t => {
  const f = setup(t), result = await runScenario(f, { executable: join(f.root, 'missing-executable') });
  assert.equal(result.status, 'setup_error'); assert.equal(result.reason, 'process_start');
});
test('quota words in successful model prose do not trigger pause', () => {
  assert.equal(failureReason('', [{ type: 'item.completed', item: { text: 'usage limit' } }]), null);
  assert.equal(failureReason('', [{ type: 'error', message: 'insufficient_quota' }]), 'usage_limit');
  assert.equal(failureReason('429 Too Many Requests', []), 'rate_limit');
  assert.equal(failureReason('authentication failed', []), 'authentication');
});
test('local link checks detect broken paths and anchors while excluding fenced examples', t => {
  const f = setup(t);
  writeFileSync(join(f.target, 'data.md'), '# Data\n[ok](other.md#same-1)\n[missing](missing.md)\n[bad](other.md#absent)\n[ref][r]\n[r]: other.md#same\n```md\n[example](ignored.md)\n```\n');
  writeFileSync(join(f.target, 'other.md'), '# Same\n# Same\n');
  const result = checkFixture(f.target);
  assert.equal(result.valid, false); assert.equal(result.problems.length, 2);
  assert.ok(result.problems.some(e => e.link === 'missing.md')); assert.ok(result.problems.some(e => e.link === 'other.md#absent'));
  assert.equal(result.semanticReview, 'required');
});
test('batch pauses queued cases on quota, resumes into new attempts and refuses changed inputs', async t => {
  const f = setup(t), cases = [];
  for (const [id, prompt] of [['one', 'ordinary'], ['two', 'FAKE_QUOTA'], ['three', 'ordinary']]) {
    const target = join(f.root, id); mkdirSync(target); writeFileSync(join(target, 'data.md'), '# Data\n');
    const scenario = join(f.root, `${id}.md`); writeFileSync(scenario, prompt); cases.push({ id, target, scenario });
  }
  const suite = join(f.root, 'suite.json'); json(suite, { outputDir: 'results', cases });
  const first = await runBatch(suite, f.runtime);
  assert.deepEqual(first.cases.map(c => c.status), ['completed', 'interrupted', 'not_run']);
  assert.equal(existsSync(join(f.root, 'results', 'three-1.md.evidence')), false);
  json(f.control, { quota: false });
  const resumed = await runBatch(suite, { ...f.runtime, resume: true });
  assert.ok(resumed.cases.every(c => c.status === 'completed'));
  assert.equal(resumed.cases[0].attempts.length, 1); assert.equal(resumed.cases[1].attempts.length, 2);
  assert.ok(existsSync(join(f.root, 'results', 'two-1.md.evidence'))); assert.ok(existsSync(join(f.root, 'results', 'two-2.md')));
  writeFileSync(cases[0].scenario, 'changed facts');
  const changed = await runBatch(suite, { ...f.runtime, resume: true });
  assert.equal(changed.cases[0].status, 'setup_error'); assert.match(changed.cases[0].reason, /changed/);
});
test('snapshots include empty directories and identify fixture changes', t => {
  const f = setup(t), before = snapshot(f.target); mkdirSync(join(f.target, 'empty'));
  const after = snapshot(f.target); assert.notEqual(before.sha256, after.sha256); assert.ok(after.entries.some(e => e.path === 'empty' && e.type === 'directory'));
});
test('fixture check handles balanced link parentheses, linked headings, longer fences and shortcut definitions', t => {
  const f = setup(t);
  writeFileSync(join(f.target, 'data.md'), '# Data\n[valid](guide(v2).md)\n[heading](other.md#foo)\n````md\n```\n[example](not-a-real-file.md)\n````\n[guide]\n[guide]: missing.md\n');
  writeFileSync(join(f.target, 'guide(v2).md'), '# Guide\n');
  writeFileSync(join(f.target, 'other.md'), '# [Foo](https://example.com)\n');
  const result = checkFixture(f.target);
  assert.equal(result.problems.length, 1); assert.equal(result.problems[0].link, 'missing.md');
});
test('resume refuses a changed CLI version, preserving the interrupted batch', async t => {
  const f = setup(t, 'FAKE_QUOTA'), suite = join(f.root, 'suite.json');
  json(suite, { outputDir: 'results', cases: [{ id: 'one', target: f.target, scenario: f.scenario }] });
  await runBatch(suite, f.runtime);
  json(f.control, { quota: false, version: 2 });
  await assert.rejects(runBatch(suite, { ...f.runtime, resume: true }), /execution conditions changed/);
  assert.equal(readJson(join(f.root, 'results', 'batch.json')).cases[0].attempts.length, 1);
});
test('failed checkpoint replacement leaves the last complete JSON available', t => {
  const f = setup(t), checkpoint = join(f.root, 'checkpoint.json');
  json(checkpoint, { status: 'before' });
  assert.throws(() => json(checkpoint, { status: 'after' }, { replace() { throw new Error('simulated interruption before rename'); } }), /interruption/);
  assert.deepEqual(readJson(checkpoint), { status: 'before' });
  json(checkpoint, { status: 'after' }); assert.deepEqual(readJson(checkpoint), { status: 'after' });
});
