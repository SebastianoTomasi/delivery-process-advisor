// Test-only local stand-in. Never calls a model, network service or shell.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const args = process.argv.slice(3), controlPath = process.argv[2];
if (args.includes('--version')) { console.log(`fake-codex ${JSON.parse(readFileSync(controlPath, 'utf8')).version ?? 1}`); process.exit(0); }
let input = '';
for await (const chunk of process.stdin) input += chunk;
const control = JSON.parse(readFileSync(controlPath, 'utf8'));
const flag = name => args[args.indexOf(name) + 1];
if (!args.includes('--json') || flag('--disable') !== 'shell_tool' || !args.includes('sandbox_mode="read-only"') || !args.includes('--ephemeral') || !args.includes('--ignore-user-config')) {
  console.error('ERROR: isolation arguments missing'); process.exit(9);
}
console.log(JSON.stringify({ type: 'thread.started', thread_id: 'synthetic-test-session' }));
if (input.includes('FAKE_QUOTA') && control.quota) { console.error("ERROR: You've hit your usage limit."); process.exit(1); }
if (input.includes('FAKE_AUTH')) { console.error('authentication failed'); process.exit(1); }
if (input.includes('FAKE_RATE')) { console.error('429 Too Many Requests'); process.exit(1); }
if (input.includes('FAKE_TIMEOUT')) await new Promise(resolve => setTimeout(resolve, 10000));
if (input.includes('FAKE_MUTATE')) writeFileSync(join(flag('-C'), 'mutation.txt'), 'unexpected');
if (!input.includes('FAKE_EMPTY')) writeFileSync(flag('--output-last-message'), 'Synthetic trace. This verifies orchestration only.\n');
console.log(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 1, output_tokens: 1 } }));
if (input.includes('FAKE_FAIL_WITH_TRACE')) { console.error('ERROR: runtime failed'); process.exit(1); }
