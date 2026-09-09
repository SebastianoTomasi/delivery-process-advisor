---
name: audit-advisor-navigation
description: Audit and improve this repository's advisor Markdown payload by delegating navigation-only scenarios to fresh simulator agents. Use for reviewing instruction paths, misplaced or duplicated rules, missing links, and unclear directions in src. This is advisor maintenance, not a guided target project's delivery workflow.
---

# Audit advisor navigation

Act as the reviewer. Read the agreed [audit method](../../../docs/development/instruction-audit.md)
before preparing a run; it owns the correction boundary, scenario families,
and evidence requirements. Root instructions govern maintenance here. The
payload in `src/` is the product being inspected.

## Prepare the review

Inspect the working tree and the relevant source and accepted design passages.
Use the current working-tree payload, including existing edits; record the
baseline so findings and your changes can be distinguished from prior work.
Derive expected instructions from settled Product and Architecture rules, not
solely from the implementation being tested. Proposed interaction flows are
candidates to assess, not an oracle.

Use the [scenario catalog](references/scenarios.md) to select and maintain
concrete navigation scenarios. A general audit covers its initial families;
a focused request covers its affected routes and the other scenarios sharing
changed instructions. Name exclusions. For each selected scenario, retain the
prompt, initial project facts, host entry surface, payload baseline, and the
reviewer's expected obligations. Do not give those expectations to simulators.

## Prepare a target view

Stage a disposable target outside this repository's instruction ancestry. Use
the existing `bin/init.mjs` with an explicit `--target` pointing to that fresh
directory; never initialize the working repository as audit setup. Inspect the
delivered files and skill paths before using them. Setup failure is a fixture
problem, not a navigation result.

Add only the scenario's target-owned starting documents and code. Fixture
preparation is the reviewer's work; the simulator remains read-only. Do not
copy this repository's design documents, installed advisor, maintenance skill,
or audit notes into the target. Save a source-to-target mapping outside it:
`src/target/` mirrors target paths, skill entry assets become `SKILL.md`, and
instruction seeds become host instruction files. Read the current installer
mapping when resolving the other destinations.

Preserve a reproducible baseline of both payload bytes and fixture data. A
before/after comparison must hold starting facts and host setup constant.
Keep reports and expected routes outside the simulator's target view.

## Delegate navigation

Read [the simulator brief](references/simulator.md) when composing the task.
Send its task body plus one completed scenario input, not this reviewer skill
or the catalog. Launch a fresh simulator for each scenario and each rerun,
without conversation history or findings from earlier runs. With a delegation
tool exposing `fork_turns`, choose `none`.

### Use the isolated Codex launcher

When the local Codex CLI is available, use the bundled launcher instead of
assembling its MCP configuration by hand:

```text
node .agents/skills/audit-advisor-navigation/scripts/run-simulator.mjs --target <absolute-target-root> --scenario <scenario-input.md> --output <trace.md>
```

Keep the scenario input and trace outside the target. The launcher extracts the
task body from `references/simulator.md`, appends exactly that one scenario,
starts a fresh ephemeral session rooted at the target, ignores user
configuration, and disables the simulator's shell. It fixes the Codex sandbox
to read-only and exposes only the bundled MCP reader's `list_files`,
`read_file`, and `search` tools. `--approve-for-me` is used only so Codex can
call those MCP tools; it does not restore the disabled shell.

The reader canonicalizes the target and every requested filesystem path after
resolving symlinks and junctions. It rejects lexical and real destinations
outside the target, traverses internal links without losing their requested
target-relative names, and breaks directory-link cycles. Before the first run
after changing the reader or launcher, execute:

```text
node .agents/skills/audit-advisor-navigation/scripts/test-target-reader.mjs
```

Treat a launcher, MCP startup, or reader-test failure as a fixture problem, not
simulator evidence. Do not re-enable the shell to work around it. If the CLI is
unavailable, fall back to the context-separation requirements below and report
a simulation as not run when no equivalent read-only target-rooted runtime is
available.

A fresh conversation alone does not establish the intended starting context.
Check the actual working root, active repository instructions, exposed skill
descriptions and paths, and any inherited advisor-specific context. Prefer a
new session rooted at the staged target when a child inherits the maintainer's
instruction surface. Keep ordinary host instructions intact; never instruct a
simulator to override higher-priority rules to fake isolation.

Use an available read-only execution mode and restrict navigation to the
staged target. If the host only provides instruction-level read-only controls,
record that limitation and compare fixture contents before and after. Do not
equate a prompt constraint with a filesystem sandbox.

If the available runtime cannot provide the agreed context separation, prepare
the target and simulator packet for a fresh target-rooted session, and report
the simulation as not run. Static reviewer findings can still be reported as
such; they do not count as simulator evidence. Independent simulator reads may
run in parallel against a stable payload. Only the reviewer edits source.

## Review, correct, and verify

Compare observed traces with the expected obligations and source passages.
Check unnecessary reading as well as missing reading. A file can be reachable
but too late to inform the decision requiring it. A reference to an already
read file may be useful context; report a cycle as defective when it creates
unresolved routing or redundant work, not merely because an edge points back.

Apply the audit method's correction boundary. Present unresolved semantic
choices with their concrete passages and a reasoned proposal; continue
independent corrections. Preserve intentional routing summaries. Treat an
instruction needed only on another branch according to that branch's use,
rather than deleting it because the current scenario did not need it.

After source edits, stage the revised payload in a fresh target with identical
fixture facts. The initializer skips occupied destinations, so rerunning it
over the old target does not prove that a simulator saw the correction. Rerun
the affected scenarios with new contexts and compare evidence. If a failure
repeats without new evidence or needs a user decision, report what remains
instead of repeatedly rewriting the same instructions.

Return the scenarios checked and their stopping points, concrete findings,
source changes, before/after evidence, and unresolved choices or untested
branches. Retain reproducible scenario inputs and traces outside the target
view and link them in the report. This run verifies navigation and instruction
content; it does not certify dialogue, artifact writes, or full advisor behavior.
