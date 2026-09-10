#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, json, outside, readJson, snapshot } from './audit-files.mjs';
import { executionIdentity, runScenario } from './execution.mjs';
import { checkFixture } from './check-fixture.mjs';

function fingerprint(item) {
  return { target: snapshot(item.target).sha256, scenario: hash(readFileSync(item.scenario)), payload: item.payload ? snapshot(item.payload).sha256 : null, fixtures: item.fixtures ? snapshot(item.fixtures).sha256 : null };
}
export async function runBatch(suitePath, { resume = false, ...runtime } = {}) {
  suitePath = resolve(suitePath);
  const bytes = readFileSync(suitePath), suite = JSON.parse(bytes), base = dirname(suitePath);
  if (!Array.isArray(suite.cases) || !suite.cases.length || typeof suite.outputDir !== 'string') throw new Error('suite requires outputDir and nonempty cases');
  const outputDir = resolve(base, suite.outputDir), statePath = join(outputDir, 'batch.json'), ids = new Set();
  const cases = suite.cases.map(item => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id)) throw new Error(`invalid or duplicate case id: ${item.id}`);
    ids.add(item.id);
    const resolved = { ...item };
    for (const key of ['target', 'scenario', 'payload', 'fixtures']) {
      if (item[key]) resolved[key] = resolve(base, item[key]);
      else if (['target', 'scenario'].includes(key)) throw new Error(`missing ${key}: ${item.id}`);
    }
    // Reviewer inputs and every output remain outside every simulator target.
    outside(resolved.target, suitePath); outside(resolved.target, outputDir);
    return resolved;
  });
  for (const targetCase of cases) for (const item of cases) for (const key of ['scenario', 'payload', 'fixtures']) if (item[key]) outside(targetCase.target, item[key]);
  let state;
  const environments = await Promise.all(cases.map(async item => (await executionIdentity(item, runtime)).identity));
  if (existsSync(statePath)) {
    if (!resume) throw new Error('batch exists; use --resume or a new outputDir');
    state = readJson(statePath);
    if (state.suiteRevision !== hash(bytes)) throw new Error('suite changed; create a new run');
    if (JSON.stringify(state.environments) !== JSON.stringify(environments)) throw new Error('execution conditions changed; create a new run');
  } else {
    if (resume) throw new Error('no saved batch to resume');
    state = { format: 1, suiteRevision: hash(bytes), environments, cases: cases.map(item => ({ id: item.id, status: 'not_run', reason: null, fingerprint: fingerprint(item), attempts: [] })) };
    mkdirSync(outputDir, { recursive: true }); json(statePath, state);
  }
  for (let index = 0; index < cases.length; index++) {
    const item = cases[index], record = state.cases[index];
    try {
      if (JSON.stringify(fingerprint(item)) !== JSON.stringify(record.fingerprint)) throw new Error('starting facts or payload changed; create a new run');
      if (record.status === 'completed') continue;
      if (runtime.signal?.aborted) break;
      const attemptNumber = record.attempts.length + 1;
      const output = join(outputDir, `${item.id}-${attemptNumber}.md`);
      const check = checkFixture(item.target);
      json(join(outputDir, `${item.id}-${attemptNumber}.fixture.json`), check);
      if (!check.valid) { record.status = 'setup_error'; record.reason = 'fixture_links'; record.attempts.push({ output: null, status: record.status, reason: record.reason }); json(statePath, state); continue; }
      // Persist the attempted path before spawning, so a hard interruption can
      // resume with a new path rather than overwrite partial evidence.
      const attempt = { output, status: 'interrupted', reason: 'process_not_finished' };
      record.attempts.push(attempt); record.status = attempt.status; record.reason = attempt.reason; json(statePath, state);
      const result = await runScenario({ ...item, output }, { ...runtime, expectedIdentity: environments[index] });
      Object.assign(attempt, { status: result.status, reason: result.reason });
      record.status = result.status; record.reason = result.reason;
      json(statePath, state);
      if (['usage_limit', 'rate_limit', 'authentication', 'signal'].includes(result.reason) || runtime.signal?.aborted) {
        for (const remaining of state.cases.slice(index + 1)) if (remaining.status === 'not_run') remaining.reason = `paused_after_${result.reason}`;
        break;
      }
    } catch (error) { record.status = 'setup_error'; record.reason = error.message; json(statePath, state); }
  }
  json(statePath, state);
  return state;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const controller = new AbortController(), stop = () => controller.abort();
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
  try {
    const args = process.argv.slice(2);
    if (args[0] !== '--suite' || !args[1] || args.slice(2).some(arg => arg !== '--resume')) throw new Error('usage: node run-batch.mjs --suite <suite.json> [--resume]');
    const result = await runBatch(args[1], { resume: args.includes('--resume'), signal: controller.signal });
    console.log(result.cases.map(item => `${item.id}: ${item.status}${item.reason ? ` (${item.reason})` : ''}`).join('\n'));
    process.exitCode = result.cases.every(item => item.status === 'completed') ? 0 : 1;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
  finally { process.off('SIGINT', stop); process.off('SIGTERM', stop); }
}
