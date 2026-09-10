import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import assert from 'node:assert/strict';
export function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'advisor-audit-tools-'));
  t.after(() => {
    const target = resolve(root);
    assert.equal(dirname(target), resolve(tmpdir()));
    assert.ok(basename(target).startsWith('advisor-audit-tools-'));
    rmSync(target, { recursive: true, force: true });
  });
  const target = join(root, 'target'); mkdirSync(target);
  return { root, target };
}
