# Consolidate shared skills into the advisor

**State:** open
**Scope:** project
**Destination:** architecture
**Revisit when:** an overlapping skill in either repository next needs a change,
or when `shared-skills` is being retired as the main skill workspace.

Decide whether the advisor should become the single source of truth for the
skills it shares with the `shared-skills` repository. The likely outcome is to
merge each overlapping pair into one advisor-owned skill, remove the duplicate
from `shared-skills`, and update installation and references so only one source
is maintained.

Keep generic procedures distinct from advisor-specific workflows inside the
advisor. Advisor workflows may compose the generic procedures while adding the
documentation, dependency, and acceptance rules they own. Skills unrelated to
the advisor can remain in `shared-skills`; the migration should be based on an
inventory rather than moving the whole repository indiscriminately.

This can wait because no current change depends on completing the consolidation.
Resume it before the next edit to an overlapping skill so the two versions do
not drift further.

## Existing decisions to revisit

- [Skill boundaries and composition](../architecture/skill-boundaries.md#skills-are-authored-here)
  already makes this repository authoritative for skills delivered by the
  advisor and defines composition between generic and advisor-specific roles.
  Reconsider whether that ownership should also cover the generic skill itself
  when the advisor is expected to become the primary working environment.
- [ADR-0034](../adr/0034-skills-are-authored-here.md) deliberately stopped
  synchronizing advisor adaptations back to `shared-skills`. Preserve its goal
  of one authoritative copy, while deciding whether the remaining shared copy
  should now be absorbed and retired instead of continuing independently.

## Work to resume

1. Inventory every overlap between `shared-skills` and `src/skills/`, including
   callers, references, helper files, and installed links.
2. For each overlap, choose the final role and name, then merge useful behavior
   without copying advisor-owned rules into a generic procedure.
3. Update the advisor's delivery and composition references.
4. Remove the retired duplicates and update the `shared-skills` installer and
   catalog so they no longer install or advertise them.
5. Verify that Codex and Claude resolve each remaining skill from one canonical
   source.
