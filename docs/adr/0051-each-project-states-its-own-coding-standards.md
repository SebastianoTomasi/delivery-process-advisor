---
status: accepted
---

# Each project states its own coding standards in one named document

The advisor asks a guided project for `docs/development/CODING_STANDARDS.md`,
a project-scoped Development artifact that answers a third demand-driven
question, `development-coding-standards`. It holds only what is particular to
the repository: the stage of the project and whether backward compatibility is
kept, the repository's own conventions, and a one-line reminder of each rule
another accepted document owns that shows in a diff, linked to the passage
that owns it.

The user chose this on 2026-11-19. Until then the advisor said nothing about
how code is written: the Product success criterion left signatures, names,
and style to the code, and a review in a guided project had the accepted
decisions to check a change against and nothing stated about the code itself.
A guided project wrote such a document outside the process. Deciding how to
generalize it showed two kinds of content: aims that hold for every repository
a team has, and the particulars of one repository. The first kind belongs
wherever the team keeps the standards of all its repositories. Only the second
belongs to the project, and so to the process the advisor guides.

Six choices shape the rule:

- **Development owns it, through a catalog question.** Development already
  owns review and what a change must pass, so the request adds no authority,
  folder, or phase.
- **The name and place are fixed.** Review skills used in guided projects look
  for a file named `CODING_STANDARDS.md`; under a name the project chose, its
  reviews would run without it. This is the second exception to free artifact
  names, after `absent.md`. The document stays project-owned: it carries no
  `advisor-` prefix, and initialization never delivers or replaces it.
- **Project scope only.** A coding standard holds for every change, so no
  feature has its own.
- **Only the repository's particulars.** Standards a team keeps for all its
  repositories are not repeated, because two copies drift and the copy would
  bury the lines that belong to this repository alone. The advisor is public
  and names no such place or tool. The document also leaves out what tooling
  already checks, and what the product must do, which belongs to the ticket
  and the feature's documents. A rule another accepted document owns is
  recalled in one line and stays owned there: the owning passage is a
  dependency and wins where the two differ.
- **Written on demand.** The triggers are a convention settled in a session
  and a review raising a point an earlier review already raised. A convention
  written at project start is a guess that every later review must read.
- **The root states the triggers.** A session writing or reviewing code reads
  `advisor-agents.md` and not the Development scaffold, so the root says that
  a change is written and reviewed against the document and when a convention
  is proposed for it, as
  [ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
  did for the other work separately installed skills perform.

## Consequences

- **Product scope.** The success criterion stays functional equivalence
  between two implementers. The coding standards narrow the residual
  differences in names and style only where a project chose to state a
  convention. A new non-goal says the advisor does not say how code should be
  written and delivers no standards of its own.
- **Implementation conventions.** Shared execution conventions, with their
  reasoning, remain answers to `implementation-shared-conventions`. The coding
  standards recall the ones a reviewer meets in a diff and decide none of
  them.
- **Initialization.** Nothing is delivered at the fixed path; a project
  without settled conventions has no such file.
- **Existing projects.** A document with this content under another name or
  place is not found by reviews that search by name. Moving it, and returning
  its general aims to wherever the team keeps them, is the project's choice.

## Considered Options

- **Delivering general coding standards in the payload** would give every
  guided project the same text, but it would copy what a team already keeps
  for all its repositories and make the advisor an opinion on how code is
  written, which its product scope excludes.
- **A screening question in the feature Implementation catalog**, as
  `development-new-test-need` is for tests, would ask every feature whether it
  settled a convention. Neither trigger is a moment of a feature phase: a
  convention can be settled in any session, and a review runs after the phase.
  The question would add a dismissal to every feature's Implementation phase
  for a document that is not about features, and the project-scoped
  Implementation questions are already reached without screening.
- **A free name with a pointer from the root** would keep artifact naming
  without a second exception, but tools that search by file name read no
  pointer.
- **Implementation or a new authority as owner.** Implementation records
  non-obvious internal design with its reasoning, not what a reviewer holds
  every change to; a new authority would add a folder for one document.
