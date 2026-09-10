---
status: accepted
---

# Initialization never writes through an occupied link

Initialization treats every symbolic link or junction as occupying its name,
including a dangling link, and never writes or appends through it. Ordinary
asset destinations are skipped; an instruction-file link is skipped only when
its referent already exposes the exact required advisor reference, and
otherwise fails with a concise diagnostic. This preserves user-owned directory
entries and prevents an apparently local delivery from modifying a different
path, accepting the tradeoff that some linked instruction files require the
user to add the reference outside initialization.

The current rule is owned by
[Initialization](../architecture/initialization.md#delivery-rules).

## Considered Options

Following links would let the helper append the missing instruction reference,
but it could modify a referent outside the selected target and would violate
the promise that an occupied destination is preserved. Treating every linked
instruction file as an unconditional error would be safer but would reject a
project whose existing linked instructions already make the advisor reachable.

## Consequences

Occupancy checks must inspect directory entries rather than infer absence from
the existence of a referent. A dangling link can never be used as a write
destination. Delivery success through a linked `AGENTS.md` or `CLAUDE.md`
requires the exact host-specific reference to be readable already.

[ADR-0029](0029-initialization-replaces-advisor-owned-destinations.md) later
narrowed the preservation half of this decision: an occupied advisor-owned
destination is replaced rather than skipped, and a link occupying one is
replaced as a directory entry. The prohibition recorded here is unchanged —
nothing is written or appended through a link, and occupancy is still read from
the directory entry itself.

## Sources

The local audit on 2026-09-07 reproduced the defect in an isolated temporary
target: `advisor-agents.md` was a symbolic link to a missing file outside that
target, and initialization created the referent while reporting success. This
evidence prompted the decision; the original temporary audit note was replaced
after the session.
