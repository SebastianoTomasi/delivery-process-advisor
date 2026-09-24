# Merging the advisor with sandcastle

**State:** open
**Scope:** project
**Destination:** product
**Revisit when:** the merge of the advisor and sandcastle is planned, or when
co-development makes the independence of the two systems a constraint rather
than a protection.

The user plans to merge the advisor with sandcastle, the implementing system
Antonio is building, which consumes tickets in the local-file form of Matt
Pocock's `to-tickets` skill. Until the merge the two systems are co-developed.
Decide what the merged product is and which current decisions the merge
overturns.

This can wait. The merge is not yet planned, and
[Ticket production](../features/ticket-production/product/ticket-production.md)
deliberately keeps the two systems independent for now, so no current decision
depends on how the merge happens.

## Decisions the merge should reconsider

- [ADR-0039](../adr/0039-tickets-stay-independent-of-the-advisor.md) — tickets
  carry no link to their basis in the advisor, and a feature's set is produced
  once and never updated. Both were chosen to avoid coupling the systems. Inside
  one product, ticket provenance and propagation into tickets may become cheap
  and worth having, and the advisor would no longer need to avoid reading the
  implementing system's claims, resolutions, and comments.
- [Product non-goals](../product/overview.md#non-goals) — "It does not integrate
  external task systems." Once merged, sandcastle is no longer external, so the
  non-goal needs restating rather than only an exception.
- [Product form](../product/overview.md#form) and
  [the user](../product/overview.md#the-user) — whether implementation becomes a
  capability of the product, which actors it serves, and whether the product
  still stops at documents precise enough to build from.

## Related

- [An executable CLI shipped in the payload](executable-cli-in-the-payload.md) —
  a merged product may carry executable code that guided projects must run,
  which is that item's open question about the payload's runtime demands.
