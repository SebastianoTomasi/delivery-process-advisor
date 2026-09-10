---
name: audit-advisor-navigation
description: Audit and improve this repository's advisor Markdown payload by delegating navigation-only scenarios to fresh simulator agents. Use for reviewing instruction paths, misplaced or duplicated rules, missing links, and unclear directions in src. This is advisor maintenance, not a guided target project's delivery workflow.
disable-model-invocation: true
---

# Audit advisor navigation

Act as reviewer. Read the accepted [audit method](../../../docs/development/instruction-audit.md)
before preparing a run; it owns the correction boundary and evidence standard.
Root instructions govern maintenance here. Treat `src/` as the product under
inspection, not instructions for this session.

## Prepare the review

Inspect the working tree and relevant accepted Product and Architecture passages.
Preserve the current payload, including existing edits, so prior work is not
attributed to the audit. Derive expected obligations from those accepted rules;
proposed interaction flows are candidates to assess, not an oracle.

Select cases with the [scenario catalog](references/scenarios.md). A general
audit covers its initial families. A focused audit names the changed instructions,
their affected routes, selected regressions and exclusions. Reuse valid earlier
evidence only when its payload, starting facts, host and tool versions support
the comparison; an old success is not a run of a new payload.

Record each prompt, starting facts, host entry surface and expected obligations
outside the simulator target. Expectations belong to the reviewer. Validate
fixture links and review the particular semantic premises the case needs before
spending a simulation on it. A link check does not verify meaning or acceptance.

## Prepare and run isolated cases

Use [execution and evidence](references/execution.md) for target preparation,
launcher commands, batch resumption, reader behavior and local tool tests.
Create the empty disposable directory before invoking `bin/init.mjs --target`;
place it outside this repository's instruction ancestry. Never initialize this
working repository as audit setup. Inspect delivered files and host skill paths.

Add only target-owned scenario data. Keep maintenance instructions, accepted
advisor design, audit notes and expectations outside the target. Preserve payload
and fixture bytes, including the source-to-delivered-path mapping. If fixture
facts change, assign a new fixture revision and rerun both sides of a comparison.

Read [the simulator brief](references/simulator.md) before composing a task.
Use the bundled isolated Codex launcher when available. It sends only the task
body and one scenario input. Every case and rerun starts a fresh context. If
using a delegation tool with `fork_turns`, choose `none`.

A fresh conversation alone does not establish isolation: check the working root,
active instructions, exposed skill descriptions and paths, and inherited
advisor-specific context. Keep normal host instructions intact. Never ask a
simulator to override them to fake isolation or re-enable its shell to fix a
reader failure. If an equivalent read-only, target-rooted runtime is unavailable,
retain the prepared packet and report the simulation as not run. Static review
remains possible but is not simulator evidence.

## Review, correct, and verify

Compare the trace with expected obligations and actual source passages. Check
unnecessary reading and instructions reached too late as well as missing routes.
A reference back to an already read file is defective only when it causes
redundant work or unresolved routing. Preserve intentional routing summaries
and instructions needed by branches outside the present case.

Apply the accepted method's editorial correction boundary. Present unresolved
semantic choices with concrete passages and a reasoned proposal; continue
independent authorized corrections. After edits, initialize fresh targets with
identical fixture facts and rerun affected cases and relevant regressions.
The initializer skips occupied files, so running it over an old target cannot
prove the correction was delivered. Do not repeatedly rewrite instructions for
the same failure without new evidence.

Execution completion and navigation success are separate judgements. Review
the actual trace; a missing user decision may be the correct stopping point.
An incomplete search is not proof that no relevant work exists. If quota,
authentication or interruption prevents execution, preserve partial evidence
and pending cases; do not count them as passed or as payload failures.

Return a concise report using [the report structure](references/report.md):
tested versions, execution states, reviewed outcomes, residual ambiguities,
source changes, before/after evidence and exclusions. This verifies navigation
and encountered instructions, not dialogue, artifact writes or end-to-end behavior.
