#!/usr/bin/env node

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const reader = resolve(dirname(fileURLToPath(import.meta.url)), 'target-reader.mjs');
const temporaryRoot = resolve(tmpdir());
const runRoot = mkdtempSync(join(temporaryRoot, 'advisor-target-reader-test-'));
const target = join(runRoot, 'target');
const outside = join(runRoot, 'outside');

mkdirSync(join(target, 'nested'), { recursive: true });
mkdirSync(outside, { recursive: true });
writeFileSync(join(target, 'hello.md'), 'alpha\nbeta\n');
writeFileSync(join(target, 'nested', 'note.md'), 'nested body\n');
writeFileSync(join(outside, 'marker.md'), 'SYNTHETIC_OUTSIDE_TARGET\n');
symlinkSync(join(target, 'nested'), join(target, 'linked-inside'), process.platform === 'win32' ? 'junction' : 'dir');
symlinkSync(outside, join(target, 'linked-outside'), process.platform === 'win32' ? 'junction' : 'dir');

const requests = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } },
  { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
  { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'read_file', arguments: { path: 'hello.md' } } },
  { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'search', arguments: { path: 'nested', pattern: 'body' } } },
  { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'read_file', arguments: { path: '../outside/marker.md' } } },
  { jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'read_file', arguments: { path: 'linked-outside/marker.md' } } },
  { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_files', arguments: { path: 'linked-outside' } } },
  { jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'search', arguments: { path: 'linked-outside', pattern: 'SYNTHETIC' } } },
  { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'read_file', arguments: { path: 'linked-inside/note.md' } } },
  { jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'list_files', arguments: { path: 'linked-inside' } } },
  { jsonrpc: '2.0', id: 11, method: 'tools/call', params: { name: 'search', arguments: { path: 'linked-inside', pattern: 'body' } } },
  { jsonrpc: '2.0', id: 12, method: 'tools/call', params: { name: 'read_file', arguments: { path: 'hello.md', start_line: 2, end_line: 2 } } },
  { jsonrpc: '2.0', id: 13, method: 'tools/call', params: { name: 'list_files', arguments: { path: 'absent' } } },
  { jsonrpc: '2.0', id: 14, method: 'tools/call', params: { name: 'write_file', arguments: { path: 'hello.md', text: 'changed' } } },
  { jsonrpc: '2.0', id: 15, method: 'tools/call', params: { name: 'read_file', arguments: { path: join(outside, 'marker.md') } } },
];

const child = spawn(process.execPath, [reader, target], {
  stdio: ['pipe', 'pipe', 'inherit'],
  windowsHide: true,
});
const responses = new Map();
const lines = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
lines.on('line', (line) => {
  const response = JSON.parse(line);
  if (response.id !== undefined) responses.set(response.id, response);
});

for (const request of requests) child.stdin.write(`${JSON.stringify(request)}\n`);
child.stdin.end();

await new Promise((resolveExit, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolveExit() : reject(new Error(`reader exited ${code}`)));
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function responseText(id) {
  return responses.get(id)?.result?.content?.[0]?.text ?? '';
}

assert(responses.get(2)?.result?.tools?.map((tool) => tool.name).join(',') === 'list_files,read_file,search', 'tool discovery mismatch');
assert(responseText(3).includes('1: alpha') && responseText(3).includes('2: beta'), 'normal read failed');
assert(responseText(4) === 'nested/note.md:1:nested body', 'scoped search failed');
for (const id of [5, 6, 7, 8, 15]) assert(responses.get(id)?.error, `outside path request ${id} was not rejected`);
assert(responseText(9).includes('1: nested body'), 'internal junction read failed');
assert(responseText(10) === 'linked-inside/note.md', 'internal junction listing did not preserve requested path');
assert(responseText(11) === 'linked-inside/note.md:1:nested body', 'internal junction search did not preserve requested path');
assert(responseText(12) === '2: beta', 'bounded line read failed');
assert(responses.get(13)?.error, 'missing directory was not rejected');
assert(responses.get(14)?.result?.isError === true, 'unsupported write was not rejected');
assert(readFileSync(join(target, 'hello.md'), 'utf8') === 'alpha\nbeta\n', 'unsupported write changed the fixture');

const cleanupTarget = resolve(runRoot);
if (!cleanupTarget.startsWith(`${temporaryRoot}${sep}`)) throw new Error(`unsafe cleanup target: ${cleanupTarget}`);
rmSync(cleanupTarget, { recursive: true, force: true });

process.stdout.write('15 target-reader checks passed\n');
