---
status: accepted
---

# Skill host links must be relative

Initialization creates only relative directory symlinks from the Claude skill
host to the canonical files under `.agents/skills/`. Failure to create a link
ends delivery with a non-zero result and a concise diagnostic on every
platform. No absolute junction or independent-copy fallback is permitted.
This supersedes [ADR-0023](0023-skill-hosts-share-one-delivered-copy.md), retaining
shared skill files and host paths while replacing its platform fallbacks.
The current rule belongs to
[Initialization](../architecture/initialization.md#skill-hosts).

## Reasons and consequences

The user chose relative links so moving the whole project preserves the
relationship between its skill directories. Merely distinguishing junctions
in the report would disclose the relocation problem without removing it.
Independent copies would survive relocation but could diverge after edits.
The accepted cost is that a machine unable to create symbolic links cannot
complete initialization until that limitation is resolved.

On Windows a permission failure should explain that Developer Mode or an
appropriately privileged invocation may be needed. The helper does not change
system settings or elevate itself. Files already delivered remain in place,
under the existing non-atomic recovery contract. Existing destinations,
including old junctions, copies, and broken links, were still skipped when this
was decided; it governed newly created links and introduced no migration.
[ADR-0029](0029-initialization-replaces-advisor-owned-destinations.md) later
made delivery replace them, which is what converts an old junction or copy into
the relative link required here.

## Sources

The user selected relative paths on 2026-09-07 and accepted failure without
fallback on 2026-09-08 after discussing the Windows permission requirement.
[Microsoft's CreateSymbolicLinkW documentation](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createsymboliclinkw)
describes relative targets and the Developer Mode prerequisite for unprivileged
creation; it informed that platform consequence.
