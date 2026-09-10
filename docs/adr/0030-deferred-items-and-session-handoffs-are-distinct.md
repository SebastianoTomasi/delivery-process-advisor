---
status: accepted
---

# Deferred items and session handoffs are distinct

Keep durable future work as deferred items under `docs/deferred/`, owned by an
implicitly invocable `advisor-defer` skill, and keep explicitly requested
conversation summaries as handoffs under `docs/handoffs/`, owned by
`advisor-handoff`. Initialization creates and reports both empty project-owned
directories. A handoff has no managed lifecycle or automatic discovery; the
user identifies it to a fresh conversation and removes it manually.

The user chose this separation on 2026-09-10 because the former Handoff term
conflated two different needs: recovering a question or idea at a meaningful
future point, and escaping a full context window without losing active work.
Deferred items retain the existing routing, recovery, and open/closed lifecycle;
vague input is clarified before it is stored. Handoffs remain compact temporary
bridges and link to persisted facts rather than duplicating them.

This decision supersedes
[ADR-0027](0027-handoffs-use-an-initialized-docs-directory.md). It deliberately
provides no compatibility or migration behavior for deferred-question records
left by older releases under `docs/handoffs/`.

## Alternatives and consequences

Keeping both meanings under Handoff was rejected because a request to create or
recover one could select the wrong behavior. Keeping conversation handoffs at
the project root was rejected because `docs/handoffs/` is discoverable when the
user points to it without adding transient files beside the project's primary
entrypoints. Automatic handoff discovery or deletion was rejected because
manually retained files may be stale or belong to another line of work.
