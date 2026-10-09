---
status: accepted
---

# Deferred work uses the configured issue tracker

The `advisor:deferred` label below was renamed `deferred` by
[ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md), and a
deferred ticket breakdown carries it in place of `ready-for-agent`. That
decision also dropped the required routing fields, the
`.scratch/advisor-deferred/` layout, and the stop on an unreachable tracker
below, and removed `advisor-defer`; the root file now states the rules for
deferred work. The shared configured tracker
remains current.

On 2026-09-27 the user chose one tracker for advisor deferrals and
`to-tickets`, configured through `docs/agents/issue-tracker.md` and
`docs/agents/triage-labels.md`. Open `advisor:deferred` issues are the
advisor's recovery set. The label is an extra routing axis beside type and
triage labels; open/closed is the work lifecycle, and readiness is derived
from the issue's revisit condition and current accepted decisions. Closed
issues remain in the tracker with their resolution.

This replaces the `docs/deferred/` storage decision in
[ADR-0030](0030-deferred-items-and-session-handoffs-are-distinct.md) while
retaining its separation of durable future work from temporary handoffs.
Legacy files remain an invisible archive unless explicitly migrated.
Initialization stops creating the deferred directory and preserves any
existing one.

`to-tickets` remains a separately installed skill. The advisor passes it
relevant documentation and constraints; it owns ticket slicing, user review,
and publication. A later plan or change may produce more tickets for the
same feature. This replaces ADR-0039's one-set-per-feature restriction while
retaining its self-contained ticket and ownership boundary.

The local tracker uses `.scratch/advisor-deferred/issues/` for advisor
issues, separate from numbered feature ticket sets. This separation avoids
mistaking a deferred decision for an implementation ticket. A missing
configuration or unreachable tracker blocks a session that requires issue
recovery; incomplete recovery cannot support sound advice.
