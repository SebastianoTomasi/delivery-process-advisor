#!/usr/bin/env node
import { runScenario } from './execution.mjs';
try {
  const argv = process.argv.slice(2), options = {};
  if (argv.includes('--help')) {
    console.log('usage: node run-simulator.mjs --target <root> --scenario <input.md> --output <new-trace.md> [--payload <src-root>] [--fixtures <fixture-root>] [--codex <executable>] [--timeout-ms <milliseconds>]');
  } else {
    for (let index = 0; index < argv.length; index += 2) {
      const key = argv[index];
      if (!['--target', '--scenario', '--output', '--payload', '--fixtures', '--codex', '--timeout-ms'].includes(key) || !argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error(`invalid argument: ${key}`);
      options[key === '--timeout-ms' ? 'timeoutMs' : key.slice(2)] = key === '--timeout-ms' ? Number(argv[index + 1]) : argv[index + 1];
    }
    for (const key of ['target', 'scenario', 'output']) if (!options[key]) throw new Error(`missing --${key}`);
    const controller = new AbortController();
    const stop = () => controller.abort();
    process.on('SIGINT', stop); process.on('SIGTERM', stop);
    try { const result = await runScenario(options, { signal: controller.signal }); console.log(JSON.stringify(result)); process.exitCode = result.status === 'completed' ? 0 : 1; }
    finally { process.off('SIGINT', stop); process.off('SIGTERM', stop); }
  }
} catch (error) { console.error(error.message); process.exitCode = 2; }
