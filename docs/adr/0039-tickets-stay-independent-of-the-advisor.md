---
status: accepted
---

# Tickets stay independent of the advisor

Tickets the advisor produces from a feature's documentation carry no link to the
artifacts, passages, or statuses they were derived from, and a feature's ticket
set is written once and never updated by the advisor. The user chose this on
2026-09-12, while declaring Ticket production, to keep the advisor and the
implementing system that consumes the tickets independent of each other.

## Considered Options

- **Tickets record their basis.** Each ticket would name the artifact passages it
  rests on and whether they were accepted. Tickets would become propagable like
  every other dependant of a decision, and a changed decision could locate the
  tickets it affects. Rejected because it makes the implementing system carry
  knowledge of the advisor process, and such links go stale in the same way the
  observed ticket form avoids file paths for.
- **The advisor updates an existing set.** In the observed local form, the
  implementing system writes its claims, resolutions, and comments into the same
  files the advisor produced. Updating a set would require the advisor to read
  and preserve that state, which is the coupling this decision avoids.

## Consequences

A decision that changes after tickets exist reaches them only by hand: the user
or the implementing system regenerates, amends, or discards the set outside the
advisor. The advisor stops when a set already exists rather than overwriting
work in progress. This is a deliberate exception to the propagation the advisor
otherwise performs; the boundary is that written tickets belong to the
implementing system, not to the documentation tree.

However the user resolves gaps in underspecified input, by settling them or by
delegating them to the advisor, nothing in the tickets records it.

The current rule is in
[Ticket production](../features/ticket-production/product/ticket-production.md#what-the-feature-promises).

## Sources

- [The observed ticket form](../features/ticket-production/sources/matt-pocock-to-tickets.md)
  — Matt Pocock's `to-tickets` skill at commit `3216582`: the local convention in
  which workers write status and comments into ticket files, and the guidance
  that tickets avoid file paths because they go stale.
