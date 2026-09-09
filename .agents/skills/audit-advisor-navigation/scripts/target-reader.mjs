#!/usr/bin/env node

import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import readline from 'node:readline';

const requestedRoot = resolve(process.argv[2] ?? '.');
const realRoot = realpathSync.native(requestedRoot);

function isContained(root, candidate) {
  const rel = relative(root, candidate);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
}

function checkedPath(input = '.') {
  const requested = resolve(requestedRoot, input);
  if (!isContained(requestedRoot, requested)) {
    throw new Error(`path is outside the declared target: ${input}`);
  }

  const real = realpathSync.native(requested);
  if (!isContained(realRoot, real)) {
    throw new Error(`path resolves outside the declared target: ${input}`);
  }

  return { requested, real };
}

function relativeName(path) {
  const rel = relative(requestedRoot, path).split(sep).join('/');
  return rel || '.';
}

function filesUnder(start = '.') {
  const base = checkedPath(start);
  const files = [];

  const walk = (requestedDirectory, ancestors) => {
    const current = checkedPath(relativeName(requestedDirectory));
    const key = process.platform === 'win32' ? current.real.toLowerCase() : current.real;
    if (ancestors.has(key)) return;

    const nextAncestors = new Set(ancestors);
    nextAncestors.add(key);

    for (const entry of readdirSync(current.real, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const requestedChild = resolve(requestedDirectory, entry.name);
      const child = checkedPath(relativeName(requestedChild));
      const type = statSync(child.real);
      if (type.isDirectory()) walk(requestedChild, nextAncestors);
      else if (type.isFile()) files.push(relativeName(requestedChild));
    }
  };

  const type = statSync(base.real);
  if (type.isDirectory()) walk(base.requested, new Set());
  else if (type.isFile()) files.push(relativeName(base.requested));
  return files.sort();
}

function textResult(text, isError = false) {
  return { content: [{ type: 'text', text }], isError };
}

const tools = [
  {
    name: 'list_files',
    description: 'List target-relative files under a target-relative directory. Read-only and confined to the declared target root.',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Target-relative directory; defaults to the target root.' } },
      additionalProperties: false,
    },
  },
  {
    name: 'read_file',
    description: 'Read a UTF-8 target file with line numbers. Read-only and confined to the declared target root.',
    inputSchema: {
      type: 'object',
      required: ['path'],
      properties: {
        path: { type: 'string', description: 'Target-relative file path.' },
        start_line: { type: 'integer', minimum: 1 },
        end_line: { type: 'integer', minimum: 1 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'search',
    description: 'Search UTF-8 files under a target-relative directory using a JavaScript regular expression. Read-only and target-confined.',
    inputSchema: {
      type: 'object',
      required: ['pattern'],
      properties: {
        pattern: { type: 'string' },
        path: { type: 'string', description: 'Target-relative directory; defaults to the target root.' },
      },
      additionalProperties: false,
    },
  },
];

function callTool(name, args = {}) {
  if (name === 'list_files') return textResult(filesUnder(args.path ?? '.').join('\n'));

  if (name === 'read_file') {
    const path = checkedPath(args.path);
    const lines = readFileSync(path.real, 'utf8').split(/\r?\n/);
    const start = Math.max(1, args.start_line ?? 1);
    const end = Math.min(lines.length, args.end_line ?? lines.length);
    const shown = [];
    for (let line = start; line <= end; line += 1) {
      shown.push(`${line}: ${lines[line - 1]}`);
    }
    return textResult(shown.join('\n'));
  }

  if (name === 'search') {
    const expression = new RegExp(args.pattern, 'i');
    const matches = [];
    for (const name of filesUnder(args.path ?? '.')) {
      const path = checkedPath(name);
      let lines;
      try {
        lines = readFileSync(path.real, 'utf8').split(/\r?\n/);
      } catch {
        continue;
      }
      lines.forEach((line, index) => {
        if (expression.test(line)) matches.push(`${name}:${index + 1}:${line}`);
      });
    }
    return textResult(matches.join('\n'));
  }

  return textResult(`unknown tool: ${name}`, true);
}

function reply(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`);
}

function fail(id, error) {
  process.stdout.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: { code: -32000, message: error instanceof Error ? error.message : String(error) },
  })}\n`);
}

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on('line', (line) => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
    if (request.method === 'initialize') {
      reply(request.id, {
        protocolVersion: request.params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'audit-target-reader', version: '1.1.0' },
      });
    } else if (request.method === 'tools/list') {
      reply(request.id, { tools });
    } else if (request.method === 'tools/call') {
      reply(request.id, callTool(request.params?.name, request.params?.arguments));
    } else if (request.id !== undefined) {
      reply(request.id, {});
    }
  } catch (error) {
    if (request?.id !== undefined) fail(request.id, error);
  }
});
