---
status: accepted
---

# Deferred recovery belongs to the workflows that need it

Every workflow that must consider deferred work invokes `advisor-defer` from its
own procedure, and no delivered document carries a trigger for it. The root file
`advisor-agents.md` therefore names no skill at all: it owns shared
interpretation, navigation, and selective reading, and nothing else.

The user chose this while reviewing the root file. `advisor-next-work`,
`advisor-grill-with-docs`, and `advisor-propagate-change` already open with their
own recovery step, so the root section repeated an obligation that every workflow
reaching it had already stated. Keeping a second place to maintain earns nothing
when the first place is complete, and the root file's own subject is reading and
navigation, not workflow procedure.

`advisor-migrate-docs` deliberately gets no recovery step of its own: it invokes
the writing and propagation workflows for the decisions it needs, and their
preparation performs the recovery. The user accepted that a record concerning
migrated content therefore surfaces after the reorganization has been shaped
rather than before it.

This revises the clause in
[ADR-0031](0031-shared-guidance-and-workflows-have-distinct-homes.md) that kept
one cross-cutting trigger in the root. The rest of that decision — the division
of homes between the root, the common rules, the scaffolds, the catalogs, and
the skills, and the separation of next-work advice from the documentation
session — stands unchanged.

## Alternatives and consequences

The rejected alternative is the one ADR-0031 originally chose: repeating the
trigger in the root so that the prerequisite is harder to omit. It was dropped
because the omission it guards against is no longer plausible. Under
[ADR-0028](0028-skills-declare-their-own-applicability.md) a skill declares its
own applicability, and `advisor-defer`'s description already claims advice and
advisor sessions that must consider deferred work, so the host can still select
it directly. What the root guaranteed beyond that was recovery during advice
given without entering any workflow at all.

The accepted consequence is that such informal advice carries no documented
obligation to recover deferred records. The user judged this acceptable: advice
that matters enough to depend on deferred work is advice that should route to
`advisor-next-work`.

Giving `advisor-migrate-docs` its own recovery step was considered and rejected
for the same reason — the workflows it invokes already recover, and an early
record that would have changed the reorganization is a cost the user accepted
over a fourth copy of the same step.

The current rules are in
[the root file contract](../architecture/documentation-model.md#the-root-file)
and [how a skill is reached](../architecture/skill-boundaries.md#how-a-skill-is-reached).
