---
status: accepted
---

# The glossary and the decision records are positions of the advisor's process

`CONTEXT.md` and `docs/adr/` belong to the advisor's process and hold content
the project owns. They keep the names they have and take no `advisor-` prefix,
no scaffold and no question list, and they stay outside the document kinds: no
owning authority, no lifecycle status, no prerequisite or phase role. An adopted
repository keeps the ADR folder and numbering it already has. The current rules
are in [Where a document goes](../advisor-docs.md#where-a-document-goes), the
[document kinds](../architecture/documentation-model.md#document-kinds), and the
[directory layout](../architecture/documentation-model.md#directory-layout).

The user settled this on 2026-09-12 after observing that the documentation
described these two positions as not the advisor's while nothing in the product
treated them that way. The denial was the only statement placing them outside
the system, and no mechanism stood behind it. Ownership decides delivery
behavior, and every destination comes from the fixed payload mapping, which
[Initialization](../architecture/initialization.md#delivery-rules) restricts to
the mirrored assets, the root file, the skill directories, the two instruction
files, `docs/deferred/`, and `docs/handoffs/`. Neither position is a
destination, so `Advisor-owned destination` and the replacement rule in
[ADR-0029](0029-initialization-replaces-advisor-owned-destinations.md) never
reached them.

This corrects the framing of
[ADR-0005](0005-the-glossary-and-the-records-belong-to-the-skill.md) without
replacing it: the formats remain the domain-modeling skill's and the exemption
that decision records stands, as
[ADR-0034](0034-skills-are-authored-here.md) already corrected another of its
paragraphs in place of a rewrite. The shape the decision adopts is not new.
`docs/deferred/` and `docs/handoffs/`, separated in
[ADR-0030](0030-deferred-items-and-session-handoffs-are-distinct.md), are
already positions the advisor's process defines whose records are the project's,
carrying no prefix and described as no less part of the system.

## Considered Options

Renaming the two positions to `advisor-context.md` and `docs/advisor-adr/` was
the first proposal and was rejected once its cost was visible. The prefix marks
delivered advisor content, so a prefix on a file holding the project's own
glossary and decision records would assert the one thing that must never be
true of them: that a delivery brings them to the invoked release and destroys
local edits. Renaming `docs/adr/` would additionally contradict the rule that an
adopted repository keeps its existing ADR folder and numbering, and `CONTEXT.md`
would lose a name recognized outside this project.

Introducing a third ownership category for advisor-governed, project-authored
files was rejected because the model already separates a destination's owner
from a document's kind, and the deferred-item and handoff positions occupy that
shape without needing a name for it. The category would have paid a concept for
what plain description supplies.

## Consequences

The prefix rule is unchanged and becomes reconcilable on its face: it marks
delivered advisor content, which is why a position holding the project's own
records does not take it. Reading the prefix as a claim about the advisor's
process rather than about delivered content is what made these two positions
look external.

The contrast with a source sharpens. A `sources/` folder becomes the only
material genuinely outside the advisor's process, rather than one of two cases
the model described alike, which is the distinction a session needs when it
decides whether a file it is reading can establish a rule.
