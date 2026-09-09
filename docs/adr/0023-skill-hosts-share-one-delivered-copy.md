---
status: superseded
superseded_by: ADR-0026
---

# Skill hosts share one delivered copy

During migration on 2026-09-07, the helper changed from two independent skill
copies to canonical files under `.agents/skills/` and directory links from
`.claude/skills/`. The user selected that helper behavior as the current contract.
This supersedes [ADR-0007](0007-the-payload-serves-two-skill-hosts.md), retaining
two-host reachability and the host-specific root instructions while replacing
the independent-copy arrangement.

The current rule is owned by
[Initialization](../architecture/initialization.md#skill-hosts).

## Considered Options

Two independent copies worked without links but could diverge after a project
edited only one. Shared files remove that divergence when linking succeeds.
A relative directory symlink is the first attempt. On Windows, a junction is
the next attempt; if both fail, copying preserves access for the Claude host
and the report identifies the fallback. Non-Windows link failures end delivery.

## Consequences

A successful link lets both hosts see edits to the canonical delivered skill.
Relative symlinks remain relative when the project moves; an absolute Windows
junction can become invalid after relocation. A copy fallback again creates
independent files and supplies no later synchronization. These outcomes are
properties of the delivery representation, not changes to skill asset text.

Existing Claude skill destinations are skipped as a whole, including dangling
links, rather than replaced or repaired. Re-running initialization does not
upgrade a pre-existing independent copy into a link. Reports distinguish linked,
copied, written, appended, and skipped outcomes.

## Sources

The user's migration answer on 2026-09-07 selected the then-current local
`bin/init.mjs` mapping, `link` function, and reporting behavior. The earlier
independent-copy decision and rationale remain in ADR-0007.
