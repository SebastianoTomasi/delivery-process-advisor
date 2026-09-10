---
status: superseded
superseded_by: ADR-0027
---

# Handoffs live in the repository

Keep each handoff in one project-owned Markdown file under root `handoffs/`.
The user chose repository files on 2026-09-07 after considering GitHub issues,
their `to-issue` skill, and Matt Pocock's triage and decision-ticket workflows.
Local records keep deferred questions and the accepted documents needed to
resume them available together, with no tracker access, label setup, or
synchronization. Recovery still evaluates relevance and prerequisites; storage
alone does not decide when a question is ready.

The current promises belong to [Product](../product/overview.md#what-it-knows);
the representation belongs to the
[documentation model](../architecture/documentation-model.md#deferred-items).

## Alternatives and consequences

GitHub issues provide a shared discussion and work queue, but require remote
access and routing conventions whose absence can hide pending work. Keeping
handoffs inside their originating artifacts avoids another directory, but
requires opening unrelated normative documents to discover the pending work.
One file per handoff supplies an independently readable unit without a separate
index, state machine for implementation, or duplicated dependency graph.

Handoffs preserve questions, context, and links. The accepted answer remains in
the owning artifact. An open handoff can have an undecided destination and is
then surfaced for classification rather than silently omitted. The existing
grill-with-docs skill owns capture and recovery; no issue-creation skill or
external tracker is required. Existing external issues are not migrated or
closed by this decision.

## Sources

- The user's 2026-09-07 discussion of C04 selected simple, functional recovery
  and then repository files as its storage.
- [Matt Pocock's triage](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/skills/engineering/triage/SKILL.md)
  informed reading prior context and surfacing work needing attention.
- [Matt Pocock's wayfinder](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/skills/engineering/wayfinder/SKILL.md)
  informed recording precise questions before they are answerable and selecting
  work by its prerequisites. Its maps, assignments, and issue-owned answers
  are not adopted.
