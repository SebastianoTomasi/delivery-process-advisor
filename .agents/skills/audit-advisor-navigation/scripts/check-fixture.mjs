#!/usr/bin/env node
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { confined, json, outside, snapshot } from './audit-files.mjs';

function prose(text) {
  let fence;
  return text.split(/\r?\n/).map(line => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (match) {
      if (!fence) fence = { character: match[1][0], length: match[1].length };
      else if (match[1][0] === fence.character && match[1].length >= fence.length && !match[2].trim()) fence = undefined;
      return '';
    }
    return fence ? '' : line;
  });
}
function inlineLinks(line) {
  const result = [];
  for (const match of line.matchAll(/!?\[([^\]]*)\]\(/g)) {
    let cursor = match.index + match[0].length;
    while (/\s/.test(line[cursor] ?? '') && cursor < line.length) cursor++;
    const start = cursor;
    if (line[cursor] === '<') {
      cursor = line.indexOf('>', cursor + 1);
      if (cursor < 0) continue;
      cursor++;
    } else {
      let depth = 0;
      while (cursor < line.length) {
        const char = line[cursor];
        if (char === '\\' && cursor + 1 < line.length) { cursor += 2; continue; }
        if (char === '(') depth++;
        else if (char === ')') { if (!depth) break; depth--; }
        else if (/\s/.test(char) && !depth) break;
        cursor++;
      }
    }
    const end = line.indexOf(')', cursor);
    if (end < 0) continue;
    result.push({ start: match.index, end: end + 1, label: match[1], destination: line.slice(start, cursor) });
  }
  return result;
}
function anchors(text) {
  const result = new Set(), counts = new Map();
  for (const line of prose(text)) {
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*$/);
    if (heading) {
      let label = heading[1];
      for (const link of inlineLinks(label).reverse()) label = label.slice(0, link.start) + link.label + label.slice(link.end);
      const base = label.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
      const count = counts.get(base) ?? 0;
      result.add(count ? `${base}-${count}` : base); counts.set(base, count + 1);
    }
    for (const match of line.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) result.add(match[1]);
  }
  return result;
}
// Checks the common inline/reference Markdown links used by advisor fixtures.
// Dynamic placeholders and unsupported Markdown remain reviewer work.
export function checkFixture(target) {
  target = realpathSync.native(target);
  const tree = snapshot(target), problems = [], deferred = [];
  let checked = 0;
  for (const entry of tree.entries.filter(e => e.type === 'file' && extname(e.path) === '.md')) {
    const lines = prose(Buffer.from(entry.bytes, 'base64').toString('utf8'));
    const definitions = new Map();
    for (const [index, line] of lines.entries()) {
      const match = line.match(/^\s{0,3}\[([^\]]+)\]:\s*(<[^>]+>|\S+)/);
      if (match) definitions.set(match[1].toLowerCase(), { destination: match[2], line: index + 1 });
    }
    const inspect = (raw, line) => {
      const value = raw.replace(/^<|>$/g, '').replace(/\\([()\[\] ])/g, '$1');
      if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) return;
      if (/[<>*{}]/.test(value)) { deferred.push({ path: entry.path, line, link: value, reason: 'dynamic link' }); return; }
      try {
        const [filePart, ...fragmentParts] = value.split('#');
        const destination = resolve(target, dirname(entry.path), decodeURIComponent(filePart || ''));
        const file = filePart ? confined(target, destination).real : confined(target, entry.path).real;
        checked++;
        if (fragmentParts.length && extname(file) === '.md') {
          const fragment = decodeURIComponent(fragmentParts.join('#'));
          if (fragment && !anchors(readFileSync(file, 'utf8')).has(fragment)) throw new Error(`missing Markdown anchor: ${fragment}`);
        }
      } catch (error) { problems.push({ path: entry.path, line, link: value, error: error.message }); }
    };
    lines.forEach((sourceLine, index) => {
      const line = sourceLine.replace(/`[^`]*`/g, '');
      if (/^\s{0,3}\[[^\]]+\]:/.test(line)) return;
      for (const link of inlineLinks(line)) inspect(link.destination, index + 1);
      for (const match of line.matchAll(/\[([^\]]+)\]\[([^\]]*)\]/g)) {
        const key = (match[2] || match[1]).toLowerCase();
        if (!definitions.has(key)) problems.push({ path: entry.path, line: index + 1, error: `missing reference definition: ${key}` });
      }
    });
    // Checking destinations at their definitions also covers shortcut references.
    for (const definition of definitions.values()) inspect(definition.destination, definition.line);
  }
  return { targetRevision: tree.sha256, checked, problems, deferred, valid: problems.length === 0, semanticReview: 'required', limits: 'Common inline/reference links and ATX headings only; external links, dynamic paths and semantic correctness are not verified.' };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4 || args[0] !== '--target' || args[2] !== '--output') throw new Error('usage: node check-fixture.mjs --target <root> --output <check.json>');
    const output = outside(realpathSync.native(args[1]), args[3]);
    const result = checkFixture(args[1]); json(output, result);
    console.log(`${result.checked} local links checked; ${result.problems.length} problems; semantic review required`);
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
