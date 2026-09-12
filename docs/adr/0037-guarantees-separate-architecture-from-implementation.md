---
status: accepted
---

# Guarantees separate Architecture from Implementation

Architecture defines or changes the guarantees offered across a unit's
boundary, including guarantees still to be established. Implementation chooses
internal mechanics that satisfy those contracts, even when permitted
differences between alternatives can be measured from outside the unit.
The user agreed to this criterion during the documentation-rules review on
2026-09-11.

The previous test treated any externally detectable difference as architectural.
Taken literally, it would move an algorithm choice into Architecture merely
because one valid implementation runs faster. The chosen criterion keeps the
response-time guarantee in Architecture and the algorithm realizing it in
Implementation. Timeout and backoff values belong to Implementation when they
realize a contract; a value promised to a caller belongs to that contract.

This refines the observability test retained by
[ADR-0018](0018-implementation-design-spans-all-runtimes.md), preserving its
Implementation authority across runtimes. It also preserves the ownership of
Product behavior and Frontend interaction rules. Adopting the broader
detectability test later would require reviewing the placement and dependencies
of internal design decisions already recorded under this boundary.

The current rule is in
[Authority ownership](../architecture/documentation-model.md#authority-ownership).
