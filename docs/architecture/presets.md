# Presets

**Status:** proposed

## Scope

This proposal describes a shared preset distribution and adoption mechanism
across guided projects. It does not declare an individual preset feature or
replace the accepted source and initialization contracts. It exists because
the advisor ships only questions today, and a project that wants the standard answer to a recurring piece of work — a login
feature, a backoffice frontend — has to derive it from scratch every time.

Vocabulary is [`GLOSSARY.md`](../../GLOSSARY.md). The rules a preset obeys once
it is in a project are the ones already fixed in the
[documentation model](documentation-model.md) and
[Initialization](initialization.md); nothing here weakens them. What this
document does not settle is collected in [Open decisions](#open-decisions).

## Dependencies

- [Source contract](documentation-model.md#document-kinds) and
  [source placement](documentation-model.md#sources) — the proposal requires
  presets to remain informative; D1, D6, and D7 leave extensions unresolved.
- [Authority and scope](documentation-model.md#scope-and-prerequisites) —
  shared conventions and individual feature applications require distinct homes.
- [Delivery boundary](initialization.md#division-of-labour) and
  [initialization exclusions](initialization.md#deliberate-exclusions) —
  helper discovery and later import assume the existing delivery/judgement split.
- [Payload content](initialization.md#the-payload) — delivered files carry no
  release metadata. D6 and mismatch reporting must respect that rule; the
  evidence available to a future preset import remains unresolved.
- [Decision readiness](documentation-model.md#scope-and-prerequisites) —
  the proposal's phase-based selection restriction needs the compatibility
  check recorded below; it cannot override accepted readiness rules.

## A preset is a shipped source

A preset is a named bundle of know-how and blank forms for a recurring piece
of work, shipped by the advisor and imported into a project that wants it as a
starting base. It is a [source](../../GLOSSARY.md): a session reads it, and the
artifact the session writes is still the project's own words.

It is the one source a project does not write itself. Every other property of
a source holds unchanged — no authority, no lifecycle status, prerequisite of
nothing — and so does the test that keeps sources honest
([ADR-0008](../adr/0008-sources-inform-and-never-bind.md)): deleting every
preset in a project changes no rule the project holds. If an artifact ever
reads *"session policy per the login preset"* rather than stating the policy,
the preset has become an authority no folder under `docs/` owns, and the
mechanism has failed.

Three other readings were considered and rejected.

A preset is **not a template**. A template holds no decision about the
project; the value of a preset is precisely the decisions it carries.

A preset is **not a pre-filled artifact**. An artifact arriving already
written would reach `accepted` carrying decisions nobody in the project made,
and every feature after it would rest on them as prerequisites. It would also
be able to contradict an artifact the project has already accepted — a login
preset assuming email and password, imported into a project whose accepted
architecture names a corporate identity provider — which is
[flow J](../development/interaction-flows.md#j-the-user-contradicts-an-accepted-artifact), triggered by the advisor against
itself.

A preset is **not a bigger template**. The form and the know-how are different
things wearing one word: a preset contains blank forms, and those forms are
templates, but what makes the bundle worth having is the material around them.

## What importing one does

Importing a preset writes source folders and nothing else. No artifact is
created, no status is set, and no phase opens. The sessions that follow read
what was imported and write the project's artifacts as they always did — the
difference is that each question opens with a standard answer to accept,
adapt, or reject, instead of a blank page.

Departing from a preset is an ordinary answer. Nothing records the departure,
nothing flags it later, and the project is what its artifacts say.

Two consequences follow from the preset filling no artifact.

**A preset cannot answer a screening question.** A screening question with
substance amends its owning authority's project-scoped artifact rather than
producing anything local to the feature. A shipped bundle has never seen that
artifact and cannot amend it. Security, Deployment, Operations, Development
and Stack therefore reach a preset-informed feature exactly as they reach any
other, and that is what catches the case a preset's assumptions do not fit.

**There is no wholesale acceptance.** A user who wants a preset unchanged
still runs the session; it is a fast session, not a skipped one. Nothing
reaches `accepted` without passing through the session that writes it.

## Scope and shape

A preset follows the feature-vertical layout the advisor already uses, not the
authority-horizontal one that generic frontend documentation blueprints tend
to assume. A preset that carries both shared conventions and per-feature work
is therefore split: its project-scoped part serves the authority that owns
those conventions, and its feature-scoped part serves one feature. The two
halves arrive at the two moments the phase order already defines, so a preset
is a shipping unit rather than an import unit.

## Where the catalog lives

The skill knows how to choose a preset. The helper knows which presets exist.

The skill holds the judgement — when a preset is worth proposing, how to match
one to a stated need, that none is proposed before the phase that would use
it — and it holds no preset names at all. The helper answers what can be
imported, with a description, an owning authority, a scope, and a release, and
the agent asks it every time rather than remembering.

The split is forced by
[ADR-0003](../adr/0003-skills-are-payload-the-helper-is-a-plugin.md). The
skill is payload and stays at its installed revision until changed; the helper
is a plugin whose invoked release can differ. The project's files need not
share one release. A catalog written into skill text would describe the
presets known when that skill was shipped and could not see ones added since.
A description shipped beside the
preset it describes cannot drift from it.

## The accepted mismatch

A preset is delivered by the helper, after initialization, and can therefore
be newer than the project receiving it — the same asymmetry as
[flow M](../development/interaction-flows.md#m-a-template-is-newer-than-its-project), and with content rather than empty
sections at stake. A preset written against a later release may assume
questions the project's catalogs do not ask.

This is accepted rather than solved. The alternative was shipping presets as
payload at initialization, which would write content that decides something
before any of it is chosen, and that invariant is worth more than the
mismatch. The session reports the mismatch as a fact when it sees one and runs
against the question list the project actually holds.

## Open decisions

- **D1 — Import destination and bundle identity.** Whether an imported preset
  keeps its identity as one folder per scope, named for the preset, or its
  files scatter into the `sources/` folders that will read them. The first
  makes the release readable and the deletion test one command; the second
  narrows what each session reads. Unresolved.
- **D2 — The name.** *Preset* is provisional. It has to survive being read
  next to *template* and *source* without inviting either confusion.
- **D3 — How a preset's blank forms become artifacts.** A preset contains
  templates, and a template is normally imported by the helper under a name
  the session agrees. Whether the session imports from the preset or copies
  out of it is two paths to one result, and only one should exist.
- **D4 — Whether asking for a preset competes with the derived next action.**
  The advisor's advice comes from the phase a project stands in. Asking to
  browse presets is a second way of deciding what to do next, and the two can
  disagree.
- **D5 — Shipped content inside project-named folders.**
  [documentation-model.md](documentation-model.md) says nothing shipped is
  written inside `docs/features/<feature-slug>/`, but the feature Product template
  already lands there on import. The rule holds of delivery, not of import,
  and is currently written as though it governed both. Presets widen the gap
  rather than creating it.
- **D6 — Release evidence for a shipped source.** The accepted payload contract
  omits release markers to avoid unnecessary agent context. The former proposal
  to require a marker in each preset is withdrawn. Whether future import needs
  release evidence, and what existing information could supply it without
  adding metadata to the files agents read, remains unresolved.
- **D7 — Delivering `sources/`.** [Initialization](initialization.md) says
  `sources/` folders are never delivered, because a source is the user's own
  material. Importing a preset creates one. That sentence needs rewriting
  whichever way D1 goes.

## Unresolved compatibility checks

Following the 2026-09-07 removal of the release-marker guarantee, the mismatch
scenario must specify what evidence supports a version comparison. A delivery
report names the invoked release, and since
[ADR-0029](../adr/0029-initialization-replaces-advisor-owned-destinations.md)
that release is also what every destination the report wrote or replaced now
holds; what it still says nothing about is a file it preserved or one an
earlier release left behind. The proposed mismatch reporting is not an
automatic detection guarantee.

The proposed screening paragraph assumes every substantive answer is
project-scoped. The accepted model permits feature-specific answers as well.
The proposed restriction on offering presets before their phase also needs
checking against decision readiness. These are unresolved proposal assumptions,
not replacements for the accepted model. D1–D7 remain open. “Preset” stays
provisional here until D2 settles; it is not added as resolved glossary language.
The original glossary's proposed import usage included templates and presets;
the preset extension remains part of this proposal.

## Provenance

Migrated from the former advisor repository, `docs/architecture/presets.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. The specifications describe the advisor
product; installed `advisor-*.md` files govern its use in this repository.
