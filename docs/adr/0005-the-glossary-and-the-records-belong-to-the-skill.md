---
status: accepted
---

# The glossary and the decision records belong to the skill

`CONTEXT.md` and `docs/adr/` are written by the
`advisor-domain-modeling` skill and are not advisor artifacts: they have no
owning authority, artifact lifecycle, scaffold, or prerequisite role. This
exemption preserves the skill's glossary and ADR formats instead of forcing
them into the documentation model.

An adopted repository keeps its existing ADR folder and numbering. The three
vendored advisor skills came from `shared-skills` at commit `0a4bcf1`; their
copies now drift unless synchronized manually. Replacing the shared format
remains tracked in
[#5](https://github.com/SebastianoTomasi/delivery-process-advisor/issues/5).
