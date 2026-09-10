#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReader } from './reader.mjs';
import { execute } from './execution.mjs';
import { fixture } from './test-helpers.mjs';

test('immediate listing includes empty directories; recursion is explicit', t => {
  const { target } = fixture(t);
  mkdirSync(join(target, 'empty')); mkdirSync(join(target, 'nested')); writeFileSync(join(target, 'nested', 'body.md'), 'hello');
  const reader = createReader(target);
  const immediate = reader('list_files').structuredContent;
  assert.equal(immediate.complete, true);
  assert.deepEqual(immediate.entries.map(({ path, type }) => ({ path, type })), [{ path: 'empty', type: 'directory' }, { path: 'nested', type: 'directory' }]);
  assert.ok(reader('list_files', { recursive: true }).structuredContent.entries.some(e => e.path === 'nested/body.md'));
  assert.deepEqual(reader('list_files', { path: 'empty' }).structuredContent.entries, []);
  assert.throws(() => reader('list_files', { path: 'missing' }), /ENOENT/);
});
test('bounded reads report true ranges and EOF without inventing a trailing line', t => {
  const { target } = fixture(t), path = join(target, 'body.md');
  writeFileSync(path, 'alpha\nbeta\n'); writeFileSync(join(target, 'empty.md'), '');
  const reader = createReader(target);
  assert.deepEqual(reader('read_file', { path: 'body.md', end_line: 1 }).structuredContent, { path: 'body.md', total_lines: 2, start_line: 1, end_line: 1, eof: false, text: '1: alpha' });
  const tail = reader('read_file', { path: 'body.md', start_line: 2 }).structuredContent;
  assert.equal(tail.text, '2: beta'); assert.equal(tail.eof, true); assert.equal(tail.start_line, 2);
  const beyond = reader('read_file', { path: 'body.md', start_line: 5 }).structuredContent;
  assert.equal(beyond.start_line, null); assert.equal(beyond.text, ''); assert.equal(beyond.eof, true);
  assert.equal(reader('read_file', { path: 'empty.md' }).structuredContent.total_lines, 0);
  assert.throws(() => reader('read_file', { path: 'body.md', start_line: 2, end_line: 1 }), /range/);
});
test('search retains valid results and explicitly reports unreadable files', t => {
  const { target } = fixture(t);
  writeFileSync(join(target, 'good.md'), 'needle'); writeFileSync(join(target, 'denied.md'), 'needle');
  const reader = createReader(target, { readFileSync(path, encoding) { if (path.endsWith('denied.md')) throw new Error('EACCES: test denial'); return readFileSync(path, encoding); } });
  const result = reader('search', { pattern: 'needle' });
  assert.equal(result.isError, true); assert.equal(result.structuredContent.complete, false);
  assert.equal(result.structuredContent.matches[0].path, 'good.md');
  assert.equal(result.structuredContent.errors[0].path, 'denied.md');
  assert.throws(() => reader('search', { pattern: '[' }));
});
test('confinement rejects lexical and real escapes, preserves aliases and breaks cycles', t => {
  const { root, target } = fixture(t), outside = join(root, 'outside'), inside = join(target, 'inside');
  mkdirSync(outside); mkdirSync(inside); writeFileSync(join(outside, 'secret.md'), 'OUTSIDE'); writeFileSync(join(inside, 'body.md'), 'inside');
  const kind = process.platform === 'win32' ? 'junction' : 'dir';
  symlinkSync(outside, join(target, 'external'), kind); symlinkSync(inside, join(target, 'alias'), kind); symlinkSync(inside, join(inside, 'cycle'), kind);
  const reader = createReader(target);
  for (const path of ['../outside/secret.md', join(outside, 'secret.md'), 'external/secret.md']) assert.throws(() => reader('read_file', { path }), /outside/);
  for (const name of ['list_files', 'search']) assert.throws(() => reader(name, { path: 'external', pattern: '.' }), /outside/);
  assert.equal(reader('read_file', { path: 'alias/body.md' }).structuredContent.text, '1: inside');
  const listed = reader('list_files', { recursive: true }).structuredContent;
  assert.equal(listed.complete, false); assert.ok(listed.errors.some(e => e.path === 'external'));
  assert.ok(listed.entries.some(e => e.path === 'alias/body.md')); assert.ok(listed.entries.length < 20);
  const searched = reader('search', { pattern: '.' }).structuredContent;
  assert.equal(searched.complete, false); assert.ok(searched.matches.every(e => !e.text.includes('OUTSIDE')));
  assert.ok(searched.matches.some(e => e.path === 'alias/body.md'));
});
test('MCP startup/discovery, bounded read and unsupported mutation work over the real transport', async t => {
  const { target } = fixture(t); writeFileSync(join(target, 'body.md'), 'alpha\nbeta\n');
  const requests = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'read_file', arguments: { path: 'body.md', end_line: 1 } } },
    { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'write_file', arguments: { path: 'body.md', text: 'changed' } } },
  ];
  let stdout = '';
  const processResult = await execute(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'target-reader.mjs'), target], { input: requests.map(r => JSON.stringify(r)).join('\n') + '\n', onChunk: (stream, chunk) => { if (stream === 'stdout') stdout += chunk; } });
  assert.equal(processResult.code, 0);
  const responses = stdout.trim().split('\n').map(line => JSON.parse(line));
  assert.equal(responses[0].result.serverInfo.version, '2.0.0');
  assert.deepEqual(responses[1].result.tools.map(t => t.name), ['list_files', 'read_file', 'search']);
  assert.equal(responses[2].result.structuredContent.eof, false);
  assert.equal(responses[3].result.isError, true); assert.equal(readFileSync(join(target, 'body.md'), 'utf8'), 'alpha\nbeta\n');
});
