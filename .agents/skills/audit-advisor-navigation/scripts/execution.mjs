import { createWriteStream, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { finished } from 'node:stream/promises';
import { hash, json, outside, snapshot, unoccupied } from './audit-files.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const toolFiles = ['execution.mjs', 'run-simulator.mjs', 'run-batch.mjs', 'check-fixture.mjs', 'target-reader.mjs', 'reader.mjs', 'audit-files.mjs'];
export async function executionIdentity(options = {}, runtime = {}) {
  const executable = runtime.executable ?? options.codex ?? 'codex', prefixArgs = runtime.prefixArgs ?? [];
  let version = '', diagnostics = '';
  const versionResult = await execute(executable, [...prefixArgs, '--version'], { timeoutMs: 10000, onChunk: (stream, chunk) => { if (stream === 'stdout') version += chunk; else diagnostics += chunk; } });
  return { identity: { executable, prefixArgs, codexVersion: version.trim(), node: process.version, platform: process.platform, toolRevisions: Object.fromEntries(toolFiles.map(file => [file, hash(readFileSync(join(here, file)))])), simulatorBriefRevision: hash(readFileSync(join(here, '../references/simulator.md'))) }, versionResult, diagnostics };
}
export function execute(command, args, { input = '', timeoutMs = 0, signal, onChunk = () => {} } = {}) {
  return new Promise(resolveResult => {
    let child, timer, timedOut = false, spawnError = null;
    const abort = () => child?.kill();
    try { child = spawn(command, args, { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }); }
    catch (error) { resolveResult({ code: null, signal: null, spawnError: error.message, timedOut }); return; }
    child.stdout.on('data', chunk => onChunk('stdout', chunk));
    child.stderr.on('data', chunk => onChunk('stderr', chunk));
    child.on('error', error => { spawnError = error.message; });
    child.stdin.on('error', error => { if (error.code !== 'EPIPE') spawnError = error.message; });
    child.on('close', (code, processSignal) => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort);
      resolveResult({ code, signal: processSignal, spawnError, timedOut });
    });
    if (timeoutMs > 0) timer = setTimeout(() => { timedOut = true; abort(); }, timeoutMs);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    child.stdin.end(input);
  });
}
export function failureReason(stderr, events) {
  const errors = events.filter(e => e.type === 'error' || e.type === 'turn.failed');
  // Restrict quota detection to errors; a quoted user prompt is not a quota event.
  const text = stderr + '\n' + errors.map(e => JSON.stringify(e)).join('\n');
  if (/usage[ _-]limit|insufficient_quota|quota exceeded|credit balance|out of credits/i.test(text)) return 'usage_limit';
  if (/rate.limit|too many requests|\b429\b/i.test(text)) return 'rate_limit';
  if (/authentication|unauthorized|not logged in|invalid.api.key/i.test(text)) return 'authentication';
  return null;
}
export async function runScenario(options, runtime = {}) {
  const target = realpathSync.native(resolve(options.target));
  const scenario = outside(target, options.scenario), output = outside(target, options.output);
  const evidence = outside(target, `${output}.evidence`);
  if (scenario === output) throw new Error('scenario and output must differ');
  unoccupied(output); unoccupied(evidence);
  if (options.timeoutMs !== undefined && (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1)) throw new Error('timeoutMs must be a positive integer');
  const before = snapshot(target);
  const scenarioBytes = readFileSync(scenario);
  const brief = readFileSync(join(here, '../references/simulator.md'), 'utf8');
  const marker = '## Task body', markerIndex = brief.indexOf(marker);
  if (markerIndex < 0) throw new Error(`simulator brief lacks ${marker}`);
  const prompt = `${brief.slice(markerIndex + marker.length).trim()}\n\n${scenarioBytes.toString('utf8').trim()}\n`;
  // Validate all reviewer inputs before creating the evidence directory.
  const extra = {};
  for (const key of ['payload', 'fixtures']) if (options[key]) extra[key] = snapshot(outside(target, options[key]));
  mkdirSync(dirname(output), { recursive: true }); mkdirSync(evidence);
  json(join(evidence, 'target-before.json'), before);
  for (const [key, value] of Object.entries(extra)) json(join(evidence, `${key}.json`), value);
  writeFileSync(join(evidence, 'scenario.md'), scenarioBytes);
  writeFileSync(join(evidence, 'simulator.md'), brief);
  writeFileSync(join(evidence, 'prompt.txt'), prompt);
  // Preserve the exact executing tools as evidence, never inside the target.
  for (const file of toolFiles) writeFileSync(join(evidence, file), readFileSync(join(here, file)));
  const { identity, versionResult, diagnostics } = await executionIdentity(options, runtime);
  json(join(evidence, 'version-check.json'), { ...versionResult, diagnostics });
  if (runtime.expectedIdentity && JSON.stringify(identity) !== JSON.stringify(runtime.expectedIdentity)) throw new Error('execution conditions changed; create a new run');
  const executable = identity.executable, prefix = identity.prefixArgs;
  const args = [...prefix, 'exec', '-C', target, '--approve-for-me', '--skip-git-repo-check', '--ephemeral', '--ignore-user-config', '--disable', 'shell_tool', '-c', 'sandbox_mode="read-only"', '-c', `mcp_servers.audit_reader.command=${JSON.stringify(process.execPath)}`, '-c', `mcp_servers.audit_reader.args=[${JSON.stringify(join(here, 'target-reader.mjs'))},${JSON.stringify(target)}]`, '--json', '--output-last-message', output, '-'];
  const result = { format: 1, status: 'not_run', reason: null, navigationVerdict: 'not_reviewed', target, scenario, output, started: new Date().toISOString(), targetRevision: before.sha256, scenarioRevision: hash(scenarioBytes), promptRevision: hash(prompt), payloadRevision: extra.payload?.sha256 ?? null, fixtureRevision: extra.fixtures?.sha256 ?? null, environment: { ...identity, args }, code: null, targetUnchanged: null };
  json(join(evidence, 'result.json'), result);
  const streams = { stdout: createWriteStream(join(evidence, 'events.jsonl')), stderr: createWriteStream(join(evidence, 'stderr.log')) };
  let stdout = '', stderr = '';
  if (versionResult.code === 0) {
    result.status = 'interrupted'; result.reason = 'process_not_finished';
    json(join(evidence, 'result.json'), result);
  }
  const processResult = versionResult.code === 0 ? await execute(executable, args, { input: prompt, signal: runtime.signal, timeoutMs: options.timeoutMs ?? 600000, onChunk: (stream, chunk) => { streams[stream].write(chunk); if (stream === 'stdout') stdout += chunk; else stderr += chunk; } }) : versionResult;
  for (const stream of Object.values(streams)) stream.end();
  await Promise.all(Object.values(streams).map(stream => finished(stream)));
  const events = stdout.split(/\r?\n/).flatMap(line => { try { return [JSON.parse(line)]; } catch { return []; } });
  const externalReason = failureReason(stderr, events);
  Object.assign(result, { code: processResult.code, signal: processResult.signal, finished: new Date().toISOString(), runtimeError: processResult.spawnError, usage: events.filter(e => e.type === 'turn.completed').map(e => e.usage).filter(Boolean) });
  result.status = processResult.spawnError || versionResult.code !== 0 ? 'setup_error' : 'interrupted';
  result.reason = externalReason ?? (processResult.spawnError ? 'process_start' : processResult.timedOut ? 'timeout' : runtime.signal?.aborted || processResult.signal ? 'signal' : 'runtime_error');
  const traceExists = existsSync(output) && readFileSync(output, 'utf8').trim().length > 0;
  if (processResult.code === 0 && versionResult.code === 0 && traceExists && !externalReason && !events.some(e => e.type === 'turn.failed' || e.type === 'error')) { result.status = 'completed'; result.reason = null; }
  else if (processResult.code === 0 && !traceExists) { result.status = 'setup_error'; result.reason = 'missing_trace'; }
  try {
    const after = snapshot(target); json(join(evidence, 'target-after.json'), after);
    result.targetUnchanged = after.sha256 === before.sha256;
    if (!result.targetUnchanged) { result.status = 'interrupted'; result.reason = 'target_changed'; }
  } catch (error) { result.status = 'interrupted'; result.reason = 'target_integrity'; result.integrityError = error.message; }
  json(join(evidence, 'result.json'), result);
  return result;
}
