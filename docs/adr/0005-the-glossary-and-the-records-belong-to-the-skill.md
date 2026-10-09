---
status: accepted
---

# The glossary and the decision records belong to the skill

The glossary file and its skill below were changed by
[ADR-0043](0043-general-skills-come-from-matt-pocock.md): the glossary is now
`GLOSSARY.md`, and Matt Pocock's separately installed `domain-modeling`
carries both formats. The exemption from the advisor's document kinds remains
current.

`CONTEXT.md` and `docs/adr/` are written by the
`advisor-domain-modeling` skill and are not advisor artifacts: they have no
owning authority, artifact lifecycle, scaffold, or prerequisite role. This
exemption preserves the skill's glossary and ADR formats instead of forcing
them into the documentation model.

An adopted repository keeps its existing ADR folder and numbering. The three
vendored advisor skills came from `shared-skills` at commit `0a4bcf1`; their
copies now drift unless synchronized manually. That vendoring arrangement was
later superseded by [ADR-0034](0034-skills-are-authored-here.md).
