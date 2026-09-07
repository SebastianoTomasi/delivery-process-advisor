---
status: superseded
superseded_by: ADR-0018
---

# Observability separates Architecture from Backend

A question belongs to Architecture when plausible answers change behavior
observable by a client, integrator, another unit, or persisted state crossing a
boundary. It belongs to Backend when the difference remains internal to one
unit and no contract exposes it.

This replaced the conceptual/concrete distinction because that wording could
classify the same question either way. The observable boundary ensures behavior
is settled before implementation: Architecture owns transaction contracts,
Backend their enforcement, Product the compatibility promise, and Backend the
migration mechanics.
