---
status: accepted
---

# The advisor's skills are authored in this repository

The general interview, domain-modeling, and handoff procedures were changed by
[ADR-0043](0043-general-skills-come-from-matt-pocock.md): they now come from
Matt Pocock's separately installed skills, and the `ADR-FORMAT.md` consequence
below no longer applies. The advisor's own skills remain authored here.

The skills the advisor delivers are written and maintained here. Where an
external skill supplied the idea, the idea is adapted to this repository and the
result is owned here: no copy is tracked upstream and no synchronization is owed.

The user chose this while separating the general interview and domain-modeling
procedures from the advisor-specific ones. Three skills had been vendored from
`shared-skills` at commit `0a4bcf1` and had since drifted, as
[ADR-0005](0005-the-glossary-and-the-records-belong-to-the-skill.md) records.
Keeping them synchronizable meant either refusing advisor-specific material
inside them or carrying that material as rules duplicated from the documentation;
both had already happened. Owning them removes the choice.

## Consequences

Advisor-specific rules no longer need to be copied into a general skill in order
to hold there. Declared prerequisites, in
[Skill boundaries and composition](../architecture/skill-boundaries.md#how-skills-compose),
replace that practice.

A format a skill delivers may be advisor-specific even when the procedure around
it is general. `ADR-FORMAT.md` keeps its `### Sources` section on that basis,
because a template cannot state a rule by reference the way a procedure can.

The vendoring note in the second paragraph of ADR-0005 describes the situation
at the time of that decision and no longer describes current practice. The
decision ADR-0005 records — that `CONTEXT.md` and `docs/adr/` are written by the
domain-modeling skill and are not advisor artifacts — is unaffected and stands.
