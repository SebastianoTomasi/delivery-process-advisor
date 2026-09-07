---
status: accepted
---

# Authority and scope are independent

Every authority may own project- or feature-scoped artifacts. Shared rules have
one home under `docs/<authority>/`; decisions for only one feature live under
`docs/features/<feature-slug>/<authority>/` and link to shared rules. Security,
Deployment, Operations, Development, and Stack gain no phase from owning a
feature artifact. A manual recovery procedure for one CSV import can therefore
live in that feature's Operations folder without becoming project-wide policy.

This supersedes
[ADR-0004](0004-demand-driven-artifacts-are-accepted-against-their-trigger.md),
[ADR-0013](0013-a-feature-begins-with-its-first-product-artifact.md), and
[ADR-0016](0016-context-boundaries-follow-file-boundaries.md), retaining their
useful distinctions while removing the coupling between authority scope and
phase presence.

## Consequences

- A feature still begins with its first Product artifact and a confirmed slug.
  Every subsequent authority folder appears with its first artifact, never in
  advance. Folder presence shows documentation, not phase completion.
- Product, Frontend, Architecture, and Implementation retain separate boundary,
  project-catalog, and feature-catalog files. Authorities without a phase keep
  one demand-driven catalog in their boundary scaffold, used at either scope
  only for the triggered questions. No new copies or catalogs are needed.
- Individual artifact acceptance settles its own decisions, necessary inputs,
  and triggering question. It does not imply complete phase coverage. The latter
  still requires semantic review of every question and relevant artifact.
- A screening answer links to its owning artifact at the actual scope. A shared
  change requires propagation through its affected dependants; a handoff is for
  later work, never a substitute for an unresolved input needed now.

The rejected project-only rule avoided copied policies by forbidding legitimate
feature documents. Single ownership and references provide that protection
without promoting every local procedure into a shared rule.
