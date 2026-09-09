---
status: accepted
---

# Skills are payload, the helper is a plugin

Advisor skills are delivered into the target and versioned with its scaffolds
and question catalogs.
The deterministic delivery helper remains a plugin callable from outside the
target.

Keeping skills with the project makes its process self-contained and prevents a
newer skill from interrogating an older catalog. Keeping the helper external
avoids shipping executable installer code into every project and allows a
session to import an artifact template when needed. A later template may still
be newer than the project; its marker makes that mismatch visible.

The marker-based visibility described above was retired on 2026-09-07 with
[ADR-0006](0006-the-release-marker-is-written-in-at-delivery.md). The current
[payload contract](../architecture/initialization.md#the-payload) keeps release
metadata out of delivered content. The skill/helper boundary remains unchanged;
a mismatch can no longer be inferred from a per-file release marker.

Also clarified on 2026-09-07: local delivery alone does not prevent a newer
skill from coexisting with an older catalog. The accepted
[delivery compatibility limits](../architecture/initialization.md#deliberate-exclusions)
permit mixed releases because initialization preserves occupied destinations
and fills absent ones without an inventory or upgrade mechanism. Skills remain
project-resident; the former automatic-alignment claim no longer applies.
