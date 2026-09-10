---
status: accepted
---

# Initialization replaces advisor-owned destinations

Initialization brings every advisor-owned destination to the invoked release
instead of preserving what occupies it: the mirrored scaffolds and catalogs,
the root file, and the skill directories receive the release's bytes, and a
delivered skill directory also loses the files that release no longer contains.
Project-owned destinations keep the preserving behavior unchanged — the two
instruction files are still only ensured, and `docs/handoffs/` is still skipped
once it exists. The user chose this so that a delivery converges instead of
accumulating an undetectable mixture of releases, accepting that local edits to
an advisor-owned file are destroyed rather than protected. This narrows
[ADR-0024](0024-initialization-never-writes-through-an-occupied-link.md) rather
than replacing it: nothing is ever written through a link, and an occupied link
at an advisor-owned destination is now replaced as a directory entry instead of
being skipped. The current rule belongs to
[Initialization](../architecture/initialization.md#delivery-rules).

## Considered Options

Deleting the occupied destinations by hand and rerunning the existing helper
needs no product change and keeps delivery honest, but it makes convergence a
manual procedure that each project has to know and repeat, and it leaves the
mixture undetected for everyone who does not perform it. A repository-local
synchronization script would have fixed the advisor's own repository quickly,
at the cost of proving a path no delivered project has: self-application would
stop being evidence about the product. Gating the replacement behind a flag
would preserve today's promise by default, but the projects harmed by a mixed
installation are exactly those that would never learn the flag exists, and it
doubles the contract and its release verification. A full installation
inventory recording which files the advisor wrote would allow safe removal of
everything a later release drops; it was rejected again here for the reason
already recorded against it, and the narrower directory-scoped cleanup obtains
most of its value without a parallel registry.

## Consequences

The report gains `replaced`, distinct from `written`, because a delivery that
destroys content and reports it as an ordinary write is worse than the mixture
it removes. The invariant that the advisor never modifies a file it did not
write narrows to destinations it does not own. Editing a delivered scaffold in
place stops being merely unsanctioned and becomes lossy at the next delivery.

Occupancy still decides nothing by itself, but the kind of the occupying entry
now does. A link at an advisor-owned file destination is replaced as an entry,
which destroys nothing because the referent survives. A directory occupying a
file destination ends delivery with a concise operational diagnostic instead of
being skipped, because the advisor removes no directory it does not own whole.
This reverses the documented success boundary that treated such a destination
as skipped without failing.

Convergence stays partial. A file that a later release no longer contains
survives anywhere outside a delivered skill directory, since `docs/` holds the
project's own artifacts beside the advisor's and they cannot be told apart
without the rejected inventory. Delivery therefore promises that it brings what
it delivers to the invoked release, not that the installation contains nothing
else. That remainder, and release-mixture detection, keep
[#3](https://github.com/SebastianoTomasi/delivery-process-advisor/issues/3)
open; the upgrade of occupied advisor-owned destinations no longer belongs to it.

Delivery remains idempotent in effect, but for a different reason: a second run
against the same release rewrites the same bytes rather than skipping the
destination. Release verification changes sign accordingly, and the advisor's
own repository must regenerate its installed copy in the same commit as a
payload change, since nothing else now keeps the two from drifting.

## Sources

The drift that prompted the decision is in this repository's own history:
commit `cfa7259` delivered the payload, commit `52e9094` then advanced the
payload alone, and the installed copy stayed behind across seven files and one
skill missing its `handoffs.md` reference — undetected until the user asked.
The user settled the mechanism, the absence of a flag, the ownership boundary,
the directory-scoped cleanup, the same-commit regeneration rule, and the
wrong-entry-kind behavior in a session on 2026-09-10.
