---
status: accepted
---

# Settled decisions need no session

A decision already settled in conversation can be written into its artifact
right away, propagating the change when it replaces an accepted rule. The
advisor recommends a grill-with-docs session only for work whose decisions are
still open, such as a new feature or phase. This replaces the clause that a
session is "the ordinary way to establish decisions and the one the advisor
recommends", added to [Non-goals](../product/overview.md#non-goals) with the
[ADR-0028](0028-skills-declare-their-own-applicability.md) work, and the
instruction that a handoff suggest `/grill-with-docs` to record settled
decisions.

The user chose this on 2026-11-16. Read literally, the old clause made the
agent answer a decision taken outside a session by telling the user to open
one before any file could change. A session's value lies in the questions it
asks; for a decision already made it added only a step, which contradicted the
product's promise of no unavoidable steps. ADR-0028 had already ruled that a
document written outside a session meets a status, not a refusal; this removes
the recommendation that still behaved like a gate.

## Consequences

- Acceptance rules are unchanged: whatever route writes a document, settled
  decisions are accepted and unsettled choices stay proposed.
- A request to write or accept a document still follows the session
  procedure's placement and acceptance steps; it asks only what remains open.
