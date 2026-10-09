# Skill boundaries and composition

**Status:** accepted

## Scope

This contract governs how the advisor divides the work it performs among skills:
what a skill owns, what makes one skill one skill, what an invoked skill may
assume, how a skill is reached, and when material stays in a reference file
instead of becoming a skill.

It does not own where skills are installed or how they are linked, specified by
[Initialization](initialization.md#skill-hosts); what skills write into a target
project, specified by the [documentation model](documentation-model.md); or how
product source is authored and released, owned by
[Working on the advisor repository](../development/repository-workflow.md).

## Dependencies

- [Payload layout](repository-boundaries.md#payload-layout) — skills are payload
  under `src/skills/`, so a decomposition decision changes what every guided
  project receives, not only this repository.
- [Skill hosts](initialization.md#skill-hosts) — the delivered skill directory is
  read as it is found, so adding or removing a skill updates no manifest, and
  reachability is a release check rather than a delivery guarantee.
- [The root file](documentation-model.md#the-root-file) — shared interpretation,
  navigation, and selective reading stay at entry depth, which is what a skill
  applies instead of restating, and the root states the advisor's rules for the
  skills it does not deliver, which is how those skills are reached in a guided
  project.
- [Self-application](repository-boundaries.md#self-application) — a change to a
  skill is regenerated into this repository's installed copy in the same commit.

## What a skill owns

The advisor's skills own their repeatable procedures and detailed reports.
Shared document interpretation, navigation, and selective reading stay in
`advisor-agents.md`, with the advisor's rules for the work separately installed
skills perform; common documentation rules and the grill-with-docs session
procedure in `docs/advisor-docs.md`; local boundaries in the authority
scaffolds; decisions, dependencies, and recommended order in the catalogs. A
skill applies those rules and does not restate them, as decided in
[ADR-0031](../adr/0031-shared-guidance-and-workflows-have-distinct-homes.md)
and revised by
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).

A rule stated in two normative places can diverge, and the copy is authoritative
nowhere. When a skill needs a rule that a document already owns, it names that
document and applies it.

## What makes one skill

A procedure becomes its own skill when both conditions hold:

1. **Independent trigger** — the user can state the occasion for it without
   first describing another procedure.
2. **Complete outcome** — what it produces stands on its own.

A procedure that has an occasion of its own but whose outcome depends entirely
on another skill stays with that skill, and its contract is written in the
artifact that already owns the subject. When that skill is one the advisor does
not deliver, no advisor skill wraps it: the procedure is written in the
delivered document that owns its subject, as the grill-with-docs session
procedure is in `docs/advisor-docs.md`, and the root names the occasion. A
wrapper would leave two skills for one job, as
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
records.

A skill's purpose is stated as one sentence with one verb. A purpose needing
several coordinated verbs describes more than one role.

Splitting is not free. Every skill's declaration is injected into every session,
including sessions that will never use it, and similar declarations compete when
the host selects one. The cost of decomposition grows with the number of skills
rather than their size. Decompose to make roles legible, never to make files
small. The reasoning is in
[ADR-0033](../adr/0033-a-skill-is-one-role.md).

## How skills compose

A skill may invoke another. An invoked skill assumes nothing about what its
caller has already read.

Each skill instead names the documents it requires and reads them when they are
not already read. On the ordinary path the caller has read them and the cost is
nothing; on a direct invocation the skill reads them itself. This holds at every
depth of a composition chain without deciding, skill by skill, which callers are
possible.

A prerequisite is declared as a whole document rather than a section anchor, so
that reorganizing a document cannot silently break the skills depending on it.
Declaring prerequisites replaces copying a rule into a skill so that it would
hold on every path.

A skill may also invoke a skill the advisor does not deliver. The advisor's
skills and the grill-with-docs session procedure use `grilling` and
`domain-modeling` from Matt Pocock's set as separately installed prerequisites;
a machine without them leaves the procedures that use them unable to run that
step. Documentation sessions, tickets, implementation, and handoffs run through
his `grill-with-docs`, `to-tickets`, `implement`, and `handoff`, which no
advisor skill invokes; the root states the advisor's rules for them, as
[How a skill is reached](#how-a-skill-is-reached) describes. The choices are
recorded in [ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md) and
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).

## How a skill is reached

Each skill the advisor delivers declares when it applies in its own
description, as decided in
[ADR-0028](../adr/0028-skills-declare-their-own-applicability.md). A description
therefore states the occasions that select the skill rather than summarizing its
procedure, and it names another skill only to redirect an occasion it does not
own. Delivered documents name none of the advisor's own skills.

A skill the advisor does not deliver cannot carry the advisor's rules, so the
[root file](documentation-model.md#the-root-file) names it where its behavior in
a guided project differs and states the rule there, where every session reads
it. That includes recovering deferred work before the occasions that must
consider it. Skills name each other, because a skill that invokes another owns
that step of its own procedure. The reasoning is in
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md),
which supersedes
[ADR-0035](../adr/0035-deferred-recovery-belongs-to-the-workflows.md).

## Reference files inside a skill

A skill splits into `SKILL.md` and further files when material is needed on some
runs and not others, or when it is a format rather than a procedure. The entry
file states when each further file is read.

A reference file divides loading; it does not divide roles. Material belonging to
a different role belongs in a different skill, and material belonging to a
different owner belongs in that owner's document.

## Skills are authored here

The skills the advisor delivers are written and maintained in this repository.
Where an external skill supplied the idea, the idea is adapted and the result is
owned here: no copy is tracked upstream and no synchronization is owed, as
decided in [ADR-0034](../adr/0034-skills-are-authored-here.md).

General procedures are not among them. Interviewing, documentation sessions,
domain modeling, ticket slicing, implementation, and conversation handoff come
from the separately installed skills in
[How skills compose](#how-skills-compose), and advisor-specific rules stay in
the advisor's own skills and delivered documents rather than in a copy of a
general skill or a wrapper around one, as decided in
[ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md) and
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).

A format a skill delivers may be advisor-specific even when the procedure around
it is general.
