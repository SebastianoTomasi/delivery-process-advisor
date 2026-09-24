# Matt Pocock's `to-tickets` skill: observed ticket form

Observed from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT) at
commit `321658273cb1d20b76026717d027d505790106d4` (2026-08-19):

- [`skills/engineering/to-tickets/SKILL.md`](https://github.com/mattpocock/skills/blob/321658273cb1d20b76026717d027d505790106d4/skills/engineering/to-tickets/SKILL.md)
- [`skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md`](https://github.com/mattpocock/skills/blob/321658273cb1d20b76026717d027d505790106d4/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md)

The skill was formerly named `to-issues`. Sandcastle, the implementing system
Antonio is building, consumes tickets in this form. Antonio has modified some
details; those modifications are not yet known and are not recorded here.

## What the skill does

It breaks a plan, spec, or conversation into **tracer-bullet** tickets:

- each slice cuts a narrow but complete path through every layer (schema, API,
  UI, tests), not a horizontal slice of one layer;
- a completed slice is demoable or verifiable on its own;
- each slice is sized to fit a single fresh context window;
- prefactoring comes first.

Each ticket declares its **blocking edges**: the tickets that must complete
before it can start. A ticket with no blockers can start immediately. Wide
mechanical refactors are sequenced as expand, migrate in batches, contract,
instead of being forced into vertical slices.

The skill presents the breakdown as a numbered list (title, blocked by, what it
delivers), asks the user about granularity, edges, and merges or splits, and
iterates until the user approves. It then publishes.

## Local-file form

- One feature per directory: `.scratch/<feature-slug>/`; the spec, when there is
  one, is `.scratch/<feature-slug>/spec.md`.
- One file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`,
  numbered from `01` in dependency order (blockers first); never a single
  combined file.
- Triage state is a `Status:` line near the top of each file.
- Comments and conversation history append to the bottom under `## Comments`.

Per-ticket template, as published:

```md
# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

Tickets avoid specific file paths and code snippets because they go stale,
except a prototype snippet that encodes a decision more precisely than prose
(state machine, reducer, schema, type shape), trimmed to its decision-rich part.

The skill's work loop takes the **frontier**: tickets whose blockers are all
done. In the local convention a worker sets `Status: claimed` before working and
`Status: resolved` when done, so the ticket files change after they are written.

## Hosted-tracker form

The same tickets can instead be published one issue per ticket to GitHub,
Linear, or similar, using native blocking relationships where available and the
`ready-for-agent` triage label.
