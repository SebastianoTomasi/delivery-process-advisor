import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { confined, slash } from './audit-files.mjs';
export const toolDefinitions = [
  { name: 'list_files', description: 'List immediate files AND directories, including empty directories, with types. Set recursive=true only when needed. Target-confined and read-only.', inputSchema: { type: 'object', properties: { path: { type: 'string' }, recursive: { type: 'boolean', default: false } }, additionalProperties: false } },
  { name: 'read_file', description: 'Read numbered UTF-8 lines. Returns total_lines, returned range and eof; EOF does not imply earlier lines were read. Target-confined and read-only.', inputSchema: { type: 'object', required: ['path'], properties: { path: { type: 'string' }, start_line: { type: 'integer', minimum: 1 }, end_line: { type: 'integer', minimum: 1 } }, additionalProperties: false } },
  { name: 'search', description: 'Recursively search UTF-8 files with a JavaScript regex. Reports incomplete searches and unreadable paths. Target-confined and read-only.', inputSchema: { type: 'object', required: ['pattern'], properties: { path: { type: 'string' }, pattern: { type: 'string' } }, additionalProperties: false } },
];
const linesOf = text => text === '' ? [] : text.replace(/\r?\n$/, '').split(/\r?\n/);
function response(data) { return { content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent: data, isError: data.complete === false }; }
export function createReader(root, io = { readFileSync }) {
  root = realpathSync.native(root);
  const nameOf = path => slash(relative(root, path)) || '.';
  function inventory(input, recursive) {
    const base = confined(root, input), entries = [], errors = [];
    function walk(path, ancestors) {
      const current = confined(root, nameOf(path));
      const key = process.platform === 'win32' ? current.real.toLowerCase() : current.real;
      if (ancestors.has(key)) return;
      const next = new Set([...ancestors, key]);
      let children;
      try { children = readdirSync(current.real, { withFileTypes: true }); }
      catch (error) { errors.push({ path: nameOf(path), error: error.message }); return; }
      for (const entry of children) {
        if (entry.name === '.git') continue;
        const childPath = resolve(path, entry.name), name = nameOf(childPath);
        try {
          const child = confined(root, name), type = statSync(child.real);
          const kind = type.isDirectory() ? 'directory' : type.isFile() ? 'file' : 'other';
          entries.push({ path: name, type: kind, link: entry.isSymbolicLink() });
          if (kind === 'directory' && recursive) walk(childPath, next);
        } catch (error) { errors.push({ path: name, error: error.message }); }
      }
    }
    if (statSync(base.real).isDirectory()) walk(base.path, new Set());
    else entries.push({ path: nameOf(base.path), type: 'file', link: false });
    entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
    return { entries, errors, complete: errors.length === 0 };
  }
  return function callTool(name, args = {}) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('arguments must be an object');
    if (name === 'list_files') {
      if (args.recursive !== undefined && typeof args.recursive !== 'boolean') throw new Error('recursive must be boolean');
      return response(inventory(args.path ?? '.', args.recursive === true));
    }
    if (name === 'read_file') {
      if (typeof args.path !== 'string') throw new Error('path is required');
      const { real } = confined(root, args.path), lines = linesOf(io.readFileSync(real, 'utf8'));
      const start = args.start_line ?? 1, requestedEnd = args.end_line ?? Math.max(start, lines.length);
      if (!Number.isInteger(start) || start < 1 || !Number.isInteger(requestedEnd) || requestedEnd < start) throw new Error('invalid line range');
      const end = Math.min(requestedEnd, lines.length);
      return response({ path: args.path, total_lines: lines.length, start_line: start <= end ? start : null, end_line: start <= end ? end : null, eof: requestedEnd >= lines.length, text: lines.slice(start - 1, end).map((line, index) => `${start + index}: ${line}`).join('\n') });
    }
    if (name === 'search') {
      if (typeof args.pattern !== 'string') throw new Error('pattern is required');
      const expression = new RegExp(args.pattern, 'i'), found = inventory(args.path ?? '.', true);
      const errors = [...found.errors], matches = [];
      for (const entry of found.entries.filter(e => e.type === 'file')) {
        try {
          const { real } = confined(root, entry.path);
          linesOf(io.readFileSync(real, 'utf8')).forEach((line, index) => { if (expression.test(line)) matches.push({ path: entry.path, line: index + 1, text: line }); });
        } catch (error) { errors.push({ path: entry.path, error: error.message }); }
      }
      return response({ matches, errors, complete: errors.length === 0 });
    }
    return { content: [{ type: 'text', text: `unknown tool: ${name}` }], isError: true };
  };
}
