import { lstatSync, readdirSync, readFileSync, readlinkSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const slash = path => path.split(sep).join('/');
export function contained(root, path) {
  const rel = relative(root, path);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
}
export function confined(root, input = '.') {
  if (typeof input !== 'string') throw new Error('path must be a string');
  const path = resolve(root, input);
  if (!contained(root, path)) throw new Error(`path is outside the declared target: ${input}`);
  const real = realpathSync.native(path);
  if (!contained(realpathSync.native(root), real)) throw new Error(`path resolves outside the declared target: ${input}`);
  return { path, real };
}
// Resolve existing ancestors, including nonexistent outputs behind a junction.
export function realDestination(input) {
  const path = resolve(input);
  try { return realpathSync.native(path); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    try { lstatSync(path); throw new Error(`dangling destination: ${path}`); }
    catch (entryError) { if (entryError.code !== 'ENOENT') throw entryError; }
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(realDestination(parent), relative(parent, path));
  }
}
export function outside(root, input) {
  const path = resolve(input), real = realDestination(path);
  if (contained(root, path) || contained(realpathSync.native(root), real)) throw new Error(`reviewer file must be outside the target: ${path}`);
  return real;
}
export function unoccupied(path) {
  try { lstatSync(path); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  throw new Error(`refusing occupied destination: ${path}`);
}
export function snapshot(root) {
  root = realpathSync.native(root);
  if (!statSync(root).isDirectory()) throw new Error(`not a directory: ${root}`);
  const entries = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (entry.name === '.git') continue;
      const path = join(dir, entry.name), name = slash(relative(root, path));
      if (entry.isSymbolicLink()) { confined(root, name); entries.push({ path: name, type: 'link', target: readlinkSync(path) }); }
      else if (entry.isDirectory()) { entries.push({ path: name, type: 'directory' }); walk(path); }
      else if (entry.isFile()) { const bytes = readFileSync(path); entries.push({ path: name, type: 'file', sha256: hash(bytes), bytes: bytes.toString('base64') }); }
      else throw new Error(`unsupported filesystem entry: ${path}`);
    }
  }
  walk(root);
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return { format: 1, sha256: hash(JSON.stringify(entries.map(({ bytes, ...entry }) => entry))), excludes: ['.git'], entries };
}
export function json(path, value, { replace = renameSync } = {}) {
  const pending = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(pending, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', flush: true });
    replace(pending, path);
  } finally {
    try { unlinkSync(pending); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
export function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }
