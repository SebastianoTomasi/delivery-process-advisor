---
status: accepted
---

# General skills come from Matt Pocock's set

Three of the skills kept below — `advisor-grill-with-docs`, `advisor-defer`,
and `advisor-to-tickets` — were removed by
[ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md), which
also made initialization remove the advisor skills a release no longer
delivers: re-running it removes the four skills that the Existing projects
consequence below leaves to a maintainer. The rest remains current.

The advisor no longer delivers its own interview, domain-modeling, and handoff
skills. `advisor-grill-me`, `advisor-domain-modeling`, `advisor-handoff`, and
`advisor-close-handoff` are removed from the payload. The advisor's workflows
use `grilling` and `domain-modeling` from Matt Pocock's skills
(`mattpocock/skills`), installed separately on the user's machine, as they
already used his `to-tickets`. Conversation handoffs use his `handoff`, which
writes to the operating system's temporary directory.

The user chose this on 2026-10-09. Matt Pocock's skills are installed for both
hosts on every project, so a guided project offered two skills for the same job,
such as `grill-me` and `advisor-grill-me`, which differed in style and in file
conventions. The advisor keeps only the skills that carry its own process:
`advisor-grill-with-docs`, `advisor-defer`, `advisor-propagate-change`,
`advisor-next-work`, `advisor-to-tickets`, and the two migration skills.

## Consequences

- **Glossary.** The project's vocabulary moves from `CONTEXT.md` to
  `GLOSSARY.md`, and a multi-context map from `CONTEXT-MAP.md` to
  `GLOSSARY-MAP.md`, the conventions of the current `domain-modeling` skill.
  The glossary and `docs/adr/` remain positions of the advisor's process whose
  format the skill carries, as
  [ADR-0038](0038-the-glossary-and-the-records-are-advisor-positions.md) and
  [ADR-0005](0005-the-glossary-and-the-records-belong-to-the-skill.md) record;
  only the file name changes.
- **Interview style.** Sessions follow `grilling`: rounds of numbered questions
  over the decisions whose prerequisites are settled, each with a recommended
  answer, instead of one question at a time.
- **Handoffs.** Initialization no longer creates `docs/handoffs/`, and the
  closure lifecycle of
  [ADR-0041](0041-handoffs-close-by-removal-after-use.md) and the in-repository
  location it builds on no longer apply. A handoff is a temporary file outside
  the project; no project file can cite it. The distinction between deferred
  work and a conversation transfer in
  [ADR-0030](0030-deferred-items-and-session-handoffs-are-distinct.md) stands.
- **Prerequisites.** The advisor declares `grilling` and `domain-modeling` as
  separately installed prerequisites, like `to-tickets`. A machine without them
  leaves the workflows that invoke them unable to run that step.
- **Ownership.** This changes [ADR-0034](0034-skills-are-authored-here.md) for
  the general procedures: they are no longer owned here, and advisor-specific
  rules stay in the advisor's own skills and documents rather than in a copy of
  a general skill. The advisor's own skills remain authored here.
- **Existing projects.** Initialization does not remove skill directories an
  earlier release delivered and this one no longer maps. A maintainer removes
  the four skills from `.agents/skills/` and `.claude/skills/`, renames
  `CONTEXT.md`, and removes an empty `docs/handoffs/` by hand.

## Considered Options

Keeping the advisor's copies would preserve one-question-at-a-time interviews,
the `CONTEXT.md` name, and handoffs kept in the repository, at the cost of two
competing skills for each of these jobs in every guided project. Keeping the
copies under the same names as Matt Pocock's would hide the duplication rather
than remove it.
