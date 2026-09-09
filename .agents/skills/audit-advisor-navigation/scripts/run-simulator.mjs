#!/usr/bin/env node

import { readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = resolve(scriptDirectory, '..');
const reader = resolve(scriptDirectory, 'target-reader.mjs');
const simulatorBrief = resolve(skillDirectory, 'references', 'simulator.md');

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

function parse(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    if (!['--target', '--scenario', '--output', '--codex'].includes(argument)) {
      fail(`unrecognized argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`missing value for ${argument}`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  for (const required of ['target', 'scenario', 'output']) {
    if (!options[required]) fail(`missing required option: --${required}`);
  }
  return options;
}

function isContained(root, candidate) {
  const rel = relative(root, candidate);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
}

const options = parse(process.argv.slice(2));
if (options.help) {
  process.stdout.write(
    'usage: node run-simulator.mjs --target <root> --scenario <input.md> --output <trace.md> [--codex <executable>]\n'
  );
  process.exit(0);
}

const target = realpathSync.native(resolve(options.target));
if (!statSync(target).isDirectory()) fail(`target is not a directory: ${target}`);

const scenario = realpathSync.native(resolve(options.scenario));
const output = resolve(options.output);
if (isContained(target, output)) fail('the simulator trace must be written outside the target');

const brief = readFileSync(simulatorBrief, 'utf8');
const marker = '## Task body';
const markerIndex = brief.indexOf(marker);
if (markerIndex < 0) fail(`simulator brief lacks ${marker}`);
const taskBody = brief.slice(markerIndex + marker.length).trim();
const scenarioInput = readFileSync(scenario, 'utf8').trim();
const prompt = `${taskBody}\n\n${scenarioInput}\n`;

const commandConfig = `mcp_servers.audit_reader.command=${JSON.stringify(process.execPath)}`;
const argumentsConfig = `mcp_servers.audit_reader.args=[${JSON.stringify(reader)},${JSON.stringify(target)}]`;
const sandboxConfig = 'sandbox_mode="read-only"';

const child = spawn(options.codex ?? 'codex', [
  'exec',
  '-C', target,
  '--approve-for-me',
  '--skip-git-repo-check',
  '--ephemeral',
  '--ignore-user-config',
  '--disable', 'shell_tool',
  '-c', sandboxConfig,
  '-c', commandConfig,
  '-c', argumentsConfig,
  '--color', 'never',
  '--output-last-message', output,
  '-',
], {
  stdio: ['pipe', 'inherit', 'inherit'],
  windowsHide: true,
});

child.on('error', (error) => fail(`cannot start Codex: ${error.message}`));
child.stdin.end(prompt);
child.on('exit', (code, signal) => {
  if (signal) fail(`Codex stopped by signal ${signal}`);
  process.exit(code ?? 1);
});

