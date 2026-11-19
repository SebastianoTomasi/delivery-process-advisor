---
status: accepted
---

# Each project names its deferred label

The label that marks deferred work is the one the project's
`docs/agents/triage-labels.md` assigns to deferred work, and `deferred` where
that file assigns none. A deferred ticket breakdown carries that label in place
of `ready-for-agent`, as before.

The user chose this on 2026-11-19.
[ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md) fixed
the label as `deferred`. Some guided projects start from a template whose label
set is closed and ranked by priority, where `priority:3` already means "not
now: do not start, revisit later". A fixed `deferred` made those projects carry
two labels with one meaning, and their template forbids adding labels without
agreement.

Three choices shape the rule:

- **The project names the label in `docs/agents/triage-labels.md`.** That file
  already maps the canonical triage roles of Matt Pocock's skills to the
  project's label strings, so it is where an agent looks up a label's name, and
  the advisor needs no file of its own. Replacing `deferred` with `priority:3`
  everywhere was rejected: projects without a priority set, this repository
  among them, would lose the label they use.
- **`deferred` stays the default**, so a project that names nothing keeps
  working unchanged.
- **The breakdown keeps the label in place of `ready-for-agent`.** A runner that
  takes every `ready-for-agent` issue would otherwise start deferred tickets,
  and the advisor cannot know whether a project's runner also filters on
  priority.

## Consequences

- This replaces the fixed label name in ADR-0044; its other rules stand.
- A project that switches labels relabels its open deferred issues and records
  the label in `docs/agents/triage-labels.md`. Initialization touches no
  tracker, so it changes neither.
- Recovery reads every open issue carrying the project's deferred label. Where
  that is a priority label, this includes issues filed outside the advisor,
  which are also work waiting to be revisited.
