// Child-process fault injection; never loaded by the installer in ordinary use.
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';

const { method, path, code, programmingError } = JSON.parse(process.env.ADVISOR_TEST_FAULT);
const original = fs[method];
fs[method] = (...args) => {
  const affectedPath = method === 'symlinkSync' ? args[1] : args[0];
  if (String(affectedPath) === path) {
    if (programmingError) throw new TypeError('injected programming defect');
    throw Object.assign(new Error(`${code}: injected failure, ${method} '${path}'`), {
      code, errno: -1, syscall: method, path,
    });
  }
  return original(...args);
};
syncBuiltinESMExports();
