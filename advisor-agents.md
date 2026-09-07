# Delivery process advisor

This project follows the delivery process advisor. Its normative documentation
lives under `docs/`, and the questions it answers are enumerated in the
question catalogs there.

Use `advisor-migrate-docs` when the user asks to migrate existing documents
into this structure. It owns the transfer and replacement of the originals,
using `advisor-grill-with-docs` for writing, acceptance, and decision changes.
For other actions that write or accept an advisor artifact, declare or advance
a feature, or decide what advisor work comes next, use `advisor-grill-with-docs`
directly. This file selects the workflow and shortest reading path; the skills
own their procedures.

## When the user describes a new feature

When the user begins to describe a user-observable capability that has no
feature folder yet, follow
[`docs/features/advisor-features.md`](docs/features/advisor-features.md) to
start and progress it. This file does not repeat its procedure.

## Before proposing work

Do this when the user asks what is worth doing next, and before writing or
accepting any document under `docs/`. Ordinary code work does not require it.

Derive the project's position, do not assume it. List the authority folders
under `docs/` and the feature folders under `docs/features/`, read the marker
line and routing envelope of each artifact. Use `docs/advisor-docs.md` for
statuses, dependencies, and decision readiness, and the feature router for phase
coverage. Folders and markers provide an inventory; they cannot by themselves
prove completeness or a prerequisite. Read relevant Dependencies, Review blocks,
and decision passages before making that claim. An authority folder at project
scope is shipped; a feature folder only shows where documentation exists.

A project document with no artifact marker counts toward no phase. Recognize
advisor scaffolds and catalogs by their fixed names, and the glossary and ADRs
by their skill-owned roles; they remain readable instructions or context without
being artifacts. For pre-existing unmarked project documentation, name relevant
material and leave its adoption to the user. A request to migrate that material
selects `advisor-migrate-docs`; do not require a second adoption request.

Name the files you read whenever you report a position, so a misreading is
visible to the user and not only to you.

## Read only what the action needs

Do not load the documentation tree as general context. Follow the shortest
reading path that can support the advisor action:

- To derive a position, start with folders, markers, and routing envelopes;
  inspect Dependencies and Review blocks for relevant work, then only the
  passages and catalog questions needed to support the advice. Verify semantic
  coverage before claiming a phase is complete; disclose what remains unverified.
- To place a document, use `docs/advisor-docs.md` to select one authority, then
  read that authority's `advisor-<authority>.md` boundary file.
- To migrate documents, read the selected inputs in full and follow
  `advisor-migrate-docs`; use the bounded reading path for surrounding project
  documentation. Migration does not adopt every document encountered.
- To work on a document, read that boundary, only the project or feature catalog
  for the current work, accepted prerequisites, directly related artifacts, and
  relevant material on its source path.
- To accept a phase, read its catalog and every artifact in that phase's folder,
  following linked answers and inputs as needed for semantic coverage.
- To propagate a change, use `advisor-grill-with-docs` to find and review direct
  and transitive dependants. Load each affected authority and catalog only when
  that work reaches it.

When selecting among artifacts, inspect the filename and a bounded opening read
containing the title, marker, and `Scope` section. Read the body only when that
envelope shows it can affect the action. A bounded read still opens the file;
its purpose is to avoid loading irrelevant bodies, not to infer content without
reading it.

## The position is advice

Report phase coverage separately from ready decisions. Recommend one useful
action and name other ready alternatives when they matter, with their accepted
bases and remaining uncertainty. Use the usual phase order to break otherwise
equivalent choices, not to disqualify a decision with sufficient inputs.

If requested work lacks a necessary accepted input, explain the missing decision
and offer to settle it first, then follow the user's choice. Work that assumes
an unresolved input remains proposed and names that dependency. No separate
permission or deviation record is introduced by this advice.

Nothing else follows. No deviation is filed, nothing is flagged, and no
reminder is scheduled. The advice arrives again on its own whenever the state
of the project still implies it, and that is the whole of the insistence this
process has.

## Read the material on your path

A `sources/` folder holds material the user put there for you to read: know-how,
an external specification, a description of a system being replaced. Open the
folders on the path to the work before the first question of a session —
`docs/sources/`, the owning authority's, and, for feature work, the feature's —
and judge from each file's name and opening lines whether to read it whole.
Nothing is required of a source's format, because the file is the user's and
not the advisor's.

A source informs and binds nothing. What it holds constrains the work only once
the owning authority's artifact says so in the project's own words, and a source
that contradicts an accepted document is a question to put to the user rather
than the answer that settles it. Preserve the source's informative link through
the relevant ADR,
or beside a smaller decision that needs no ADR, following the provenance rule
in `docs/advisor-docs.md`. The artifact states the current rule in the project's
own words. A source update alone changes no accepted decision.

Name a source you judged relevant and did not read whole, for the same reason
you name the files a position was read from: an answer that skipped material
looks fully informed from the outside.

## Where things are

- [`docs/advisor-docs.md`](docs/advisor-docs.md) — which authority owns what,
  where a document goes, where material that is not a document sits, what the
  marker lines mean, and the usual phase order and decision-readiness rule.
- `docs/<authority>/advisor-<authority>.md` — the authority's precise boundary
  and links to its catalogs.
- `docs/<authority>/advisor-<authority>-project.md` — the project-scoped
  progression and questions for Product, Frontend, Architecture, and Implementation.
- `docs/<authority>/advisor-<authority>-feature.md` — the feature-scoped phase
  progression and questions for those same four authorities.
- Authorities without a phase keep one demand-driven catalog in their boundary
  scaffold; its triggered questions serve project or feature scope.
- [`docs/features/advisor-features.md`](docs/features/advisor-features.md) —
  what a feature folder holds, the phase order, and the route from the current
  phase to its authority boundary and one feature catalog.
- `CONTEXT.md` — the project's fixed vocabulary, once a session has started one.

Nothing here explains the advisor to a person, and nothing in this project
does. Every file the advisor delivers is written for you. A user asking what
this process is, why `docs/` has this shape, or how the advice is meant to be
used belongs at the advisor's own repository,
<https://github.com/SebastianoTomasi/delivery-process-advisor> — say so rather
than reconstructing the explanation from these pages.
