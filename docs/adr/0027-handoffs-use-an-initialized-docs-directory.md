---
status: accepted
---

# Handoffs use an initialized docs directory

Keep each handoff in one project-owned Markdown file under `docs/handoffs/`,
and have initialization create and report that directory even while it is
empty. The user chose the location and initialization behavior on 2026-09-08:
the fixed path makes deferred work discoverable beside the project's other
written knowledge, while keeping the directory empty avoids a second copy of
the operational protocol already owned by the delivered
`advisor-grill-with-docs` skill.

This decision supersedes [ADR-0025](0025-handoffs-live-in-the-repository.md).

## Alternatives and consequences

Keeping root `handoffs/` avoids placing work records inside `docs/`, but makes
them a separate top-level concern. Shipping an `advisor-handoffs.md` file would
make the directory persist through Git before it holds a record, but would add
another scaffold or protocol pointer. The chosen empty directory is instead an
explicit helper destination: it is created or skipped under the same occupancy
rules and appears in the delivery report. Git begins tracking the directory
only when the first handoff file is added.

Initialization does not migrate records from the former root path; its existing
no-upgrade guarantee remains in force. The skill remains the single operational
home for handoff format, recovery, classification, and closure.
