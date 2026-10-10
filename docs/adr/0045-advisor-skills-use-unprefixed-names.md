---
status: accepted
---

# Advisor skills use unprefixed names

On 2026-10-09 the user asked to remove `advisor-migrate-deferred` and remove
the `advisor-` prefix from every remaining advisor skill. The delivered skills
are now `next-work`, `propagate-change`, and `migrate-docs`. The repository's
maintenance skill `audit-advisor-navigation` already has no such prefix.

This replaces the skill-name ownership rule of
[ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md), and
removes its dedicated legacy deferred migration procedure. Legacy deferred
records remain an archive; the configured tracker and its `deferred` issues
continue to hold future work.

## Consequences

- The helper keeps an explicit registry of every unprefixed name ever
  delivered, including retired names. A payload name outside that registry
  fails before writing, so every delivered skill can later be retired.
- Registered names and legacy `advisor-` entries are advisor-owned in both
  hosts. Initialization removes owned entries absent from the current payload,
  replacing the old names with the three new skills and retiring
  `advisor-migrate-deferred`. Other names remain project-owned.
- The registry is part of the helper, with no target-side inventory. This
  preserves deterministic delivery and cleanup after a skill disappears from
  the payload. Future unprefixed skills must be registered when introduced;
  their names stay registered when retired.
- Skill declarations, cross-skill calls, and current documentation use the
  new names. Historical ADRs retain the names they decided, with this record
  identifying the replacement.

The current contracts are in
[Initialization](../architecture/initialization.md#delivery-rules) and the
[documentation model](../architecture/documentation-model.md#deferred-items).
