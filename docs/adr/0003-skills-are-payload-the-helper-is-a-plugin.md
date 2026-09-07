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
