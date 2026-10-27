# Guided project documentation model

**Status:** accepted

## Scope

This contract defines how the advisor represents normative documentation in a
target project: who owns each rule, which kinds of document exist, how scope
and prerequisites interact, where questions are enumerated, and how lifecycle
state is exposed.

The Product behavior built on this model is specified in the
[Product description](../product/overview.md). The terms used by the model are
defined in [`GLOSSARY.md`](../../GLOSSARY.md). How the model is delivered into a
target project is specified by [Initialization](initialization.md).

## Dependencies

- [Delivery compatibility](../product/overview.md#delivery-compatibility) —
  coordinated catalog releases do not imply uniformity of installed files.
- [Product process requirements](../product/overview.md#the-shape-of-the-process)
  — authority, scope, and phase representation must support the promised thin
  foundation and independent decision readiness.
- [Product rules](../product/overview.md#rules) — artifact lifecycle, sources,
  and propagation must preserve advisory choice and one accepted current rule;
  document acceptance establishes settled intent, not implemented behavior.
- [User decision authority](../product/overview.md#non-goals) — artifact
  acceptance and the root interpretation summary must recognize choices made
  within explicit user delegation as settled decisions.
- [Product capabilities](../product/overview.md#what-it-does) — catalogs and
  decision references must support advice, deferred work, session continuity,
  and complete propagation.
- [Deferred issues and conversation handoffs](../product/overview.md#what-it-knows)
  — future-work recovery uses the configured tracker while explicit
  conversation transfer stays outside the project.

## Authority ownership

Every rule has one owning authority and one authoritative document. Documents
link across authority boundaries instead of copying rules.

| Authority | Owns |
| --- | --- |
| Product | Cross-system requirements, actors, behavior, privacy and legal requirements, and the compatibility baseline the product promises not to break |
| Frontend | Approved client-visible behavior and interaction contracts |
| Architecture | Implementation-independent system and module contracts |
| Implementation | Significant, non-obvious internal design for clients, servers, local applications, CLIs, and jobs |
| Security | Security policy and control requirements |
| Deployment | Procedures for delivering and deploying the system |
| Operations | Procedures for operating the system in production |
| Development | Development and test guidance |
| Stack | The selected technology inventory, versions, and shared defaults |

Architecture defines components and meaningful submodules, responsibilities,
dependencies, semantic interfaces, conceptual data ownership, invariants,
failures, trust boundaries, and cross-system flows. It may name a technology
when that choice establishes an architectural constraint or runtime topology,
but Stack remains authoritative for the inventory and versions. Implementation
owns significant internal decisions in clients, servers, local applications,
CLIs, and jobs: state and history representations, persistence, algorithms,
adapters, and execution mechanics. It records only non-obvious design reasoning,
not a complete description of the code. Code, migrations, and generated
interfaces remain authoritative for exact signatures. For example, Undo's
visible behavior belongs to Frontend; snapshots versus inverse operations for
its history belong to Implementation.

The line between the two follows the guarantees offered across a unit's
boundary. Architecture defines or changes what a client, integrator, another
unit, or a reader of persisted state may rely on, including guarantees still
to be established. Implementation chooses the internal mechanics that satisfy
those contracts. Measurable differences between internal alternatives remain
Implementation's concern when the contracts permit them.

Transaction and consistency boundaries, retry and duplicate-effect semantics,
permitted degradation, interface compatibility, and guarantees when a migration
fails partway belong to Architecture. Locking strategies, timeout and backoff
values, adapters, schema and index choices, and migration mechanics belong to
Implementation when they realize those guarantees. A timeout value that itself
defines a guarantee to a caller is part of the Architecture contract.

For example, promising a response within two seconds across a component boundary
is Architecture; choosing an algorithm that meets that limit is Implementation,
even if callers can measure timing differences between valid algorithms.
[ADR-0018](../adr/0018-implementation-design-spans-all-runtimes.md) records the
scope across runtimes; [ADR-0037](../adr/0037-guarantees-separate-architecture-from-implementation.md)
records the refined ownership criterion.

Architecture records which component enforces a Product or Security rule and
the resulting invariant, boundary, or failure behavior. It does not restate
the externally owned behavior or policy.

There are no neutral top-level API, contracts, data, quality, privacy, or
planning authorities. Test guidance belongs to Development or code. Delivery
status belongs to the task system. Deployment procedures and production
Operations remain distinct.

## Document kinds

Origin determines what a document can mean:

- An **artifact** is written for the target project and records its decisions.
  It alone declares a lifecycle status and can be a prerequisite.
- A **scaffold** is fixed content imported from an advisor release. It states
  documentation rules and ownership boundaries, and routes the reader to further
  advisor content. It carries no lifecycle status and never blocks work.
- A **question catalog** is fixed content imported from the same advisor
  release. It enumerates the questions and recommended decision sequence for
  one scope or feature phase. Product, Frontend, Architecture, and
  Implementation keep separate project and feature catalogs so the unused scope
  need not be loaded. Authorities without a phase keep one demand-driven
  catalog in their scaffold, whose triggered questions serve either scope.
  A catalog carries no lifecycle status and never blocks work by itself.
- A **template** is a shipped starting structure for a recurring kind of
  artifact. A session may use one, adapt it, or create an artifact without one;
  the artifact's subject determines its final structure. A template contains
  no project decision, declares no lifecycle status, and never blocks work.

Two documents in a guided project fall outside these kinds while still
belonging to the advisor's process. The glossary at `GLOSSARY.md` (with a
`GLOSSARY-MAP.md` when the project has several contexts) and the decision
records under `docs/adr/` are written and formatted by the separately installed
`domain-modeling` skill the session invokes, and hold content the project owns.
Neither is an artifact: neither belongs to an authority, neither carries a
lifecycle this model reads, and neither is a prerequisite of anything. Work
rests on the artifact a decision shaped, never on the record of its rationale,
and on the language a project fixed, never on the document that lists it.

Artifacts use the glossary's resolved language and link relevant ADRs. Keep the
decision's reasons and sources in the ADR rather than duplicating them in each
dependent artifact; a brief local explanation may clarify the dependency. The
skill-owned formats and their exemption from these kinds are recorded in
[ADR-0005](../adr/0005-the-glossary-and-the-records-belong-to-the-skill.md),
their standing inside the advisor's process in
[ADR-0038](../adr/0038-the-glossary-and-the-records-are-advisor-positions.md),
and the move to `domain-modeling` and `GLOSSARY.md` in
[ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md).

A third thing falls outside the kinds, and unlike the two above it falls
outside the advisor's process entirely. A **source** is informative material
retained in a `sources/` folder for a session to read: know-how, an external
specification, a description of a system being replaced, or an experiment's
report and results. It establishes none of the project's decisions, so it
carries no authority, status, or release marker and is a prerequisite of nothing.

A source informs a session and binds nothing. Anything in it that ought to
constrain later work is written into the owning authority's artifact first, in
the project's own words, and a source contradicting an accepted artifact is
raised as a question rather than allowed to settle it. Preserve provenance:
important decisions keep their reasons and informative source links in ADRs,
and current artifacts link to the relevant ADR. A smaller decision needing no
ADR can link its informative source directly. Such a citation never makes a
source authoritative. A source update can identify decisions for assessment,
but changes neither accepted rules nor artifact statuses automatically.

The property that keeps this honest is that deleting every `sources/` folder in
a project changes no rule the project holds. When that stops being true, a
source has become an authority nobody owns. The rationale is recorded in
[ADR-0008](../adr/0008-sources-inform-and-never-bind.md).

## Deferred items

A deferred item is a project-owned work record, distinct from artifacts,
sources, decision records, and handoffs. It carries a question, idea, or other
future work, not an accepted answer, and counts toward no phase. Its state is
`open` or `closed`, separate from the artifact lifecycle.
[ADR-0030](../adr/0030-deferred-items-and-session-handoffs-are-distinct.md)
records why durable future work and conversation transfer are kept apart.
[ADR-0040](../adr/0040-deferred-work-uses-the-configured-issue-tracker.md)
records the move to the shared issue tracker, and
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
the `deferred` label and the rules the root file states for it.

Each deferred item is an issue labelled `deferred` in the tracker
configured by `docs/agents/issue-tracker.md`, the tracker the separately
installed `to-tickets` skill also publishes to. The agent opens one directly,
or publishes a whole deferred ticket breakdown through `to-tickets` with
`deferred` in place of `ready-for-agent`. Missing configuration prompts tracker
setup. A local tracker follows the convention its configuration describes.

The issue states what should be revisited, why it can wait, and when to
revisit it; no routing field is required. A deferral does not create a feature
folder or give a proposed feature an accepted identity. A Product non-goal
creates no deferred item automatically; an item about reconsidering it links
to the Product rule instead of duplicating it.

Before a grill-with-docs session, a ticket breakdown, a propagation, a
migration, or next-work advice, the agent reads the open `deferred` issues
relevant to it; [next-work advice](#next-work-advice) says which issues a
general or scoped request considers. Issues without the label are outside this
recovery.

Whether a relevant item is ready, still waiting, or already answered is judged
from current artifacts and accepted inputs and is not saved as another set of
status labels. A current necessary input stays an open decision in its owning
artifact; calling it a deferred item does not make that artifact acceptable.

An answered issue closes with a link to its answer once that answer is written
in its owning artifact; any change to accepted rules still follows normal
propagation. Closed issues remain consultable in the tracker. Closure alone
never proves decision readiness.

The capture, recovery, and closure rules are delivered in one place, the
[root file](#the-root-file)'s section on sessions, tickets, and handoffs, which
every session reads.
Legacy `docs/deferred/` records are an archive, even when marked `open`; they
are not recovered or imported automatically. The advisor no longer ships a
dedicated migration skill for them, as recorded in
[ADR-0045](../adr/0045-advisor-skills-use-unprefixed-names.md).

## Session handoffs

A handoff compacts the current conversation for a fresh session continuing the
same work. It is not a project record: the user invokes Matt Pocock's
separately installed `handoff`, which writes a temporary file to the operating
system's temporary directory, outside the project. No project file can cite
it, and initialization creates no handoff directory. The advisor's payload
carries no handoff procedure; the root file states only what a handoff in a
guided project names and what it leaves to deferred issues, as
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
records. A `docs/handoffs/` left by an earlier release is project content that
initialization leaves untouched.
[ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md) records the
move out of the repository; the separation from deferred work in
[ADR-0030](../adr/0030-deferred-items-and-session-handoffs-are-distinct.md)
stands.

## Visible document markers and decision references

An artifact puts its lifecycle on the line below its title, never in
frontmatter: `**Status:** proposed`, `**Status:** accepted`, or
`**Status:** needs-review`. Advisor-owned scaffolds and catalogs have no artifact
status; their fixed names and opening content distinguish their roles.

Every artifact opens with `## Scope`, stating its rule boundary and nearby
exclusions. Filename, title, marker, and Scope form the routing envelope.
Immediately after Scope, `## Dependencies` is required when the artifact relies
on decisions in other artifacts. Each bullet links to the relevant heading or
anchor and explains which local decision relies on it and why. With no such
dependency, omit the section. Navigation or provenance links alone do not
establish prerequisites, and no second dependency register is maintained.

`proposed` is a draft, not a current rule. `accepted` means the artifact's own
decisions are settled and its necessary decision inputs accepted and compatible.
Whether a decision is settled follows
[Product's decision-authority rule](../product/overview.md#non-goals), including
choices made within explicit user delegation. Delegation does not bypass
compatibility or prerequisite checks.
Acceptance does not establish that a decision is implemented. Ordinary code work
uses the [Product rule for code and documentation](../product/overview.md#rules);
implementation gaps and conflicts do not silently change artifact status.
`needs-review` means compatibility with a changed decision has yet to be checked;
it is not a reliable input in the meantime. Status applies to the whole artifact,
so none of its passages supplies an accepted decision input until review is
complete, even when only part of its content prompted the review. Unrelated
accepted artifacts remain usable. A previously accepted dependant may return to
accepted unchanged after checking the new rule.

Every needs-review artifact carries `## Review` after Dependencies, or after
Scope when no Dependencies exist. It names Cause, Changed decision (a passage
link), Decision record (the pertinent ADR when present), and Remaining work.
It also links any intermediate dependency under review. This is recovery data
for an interrupted propagation, not another rationale register. A bare marker
does not suffice; successful review removes the block and restores acceptance.
Proposed dependants remain proposed and record their unresolved changed inputs.

The root agent instructions start with envelopes and markers, then read relevant
dependency and review sections and decision passages. Marker lines expose
artifact status; they cannot prove phase coverage or decision readiness.
The exact delivered format and the writing and acceptance procedure of
grill-with-docs sessions live in `docs/advisor-docs.md`, and the
change-propagation procedure in `propagate-change`.

The glossary and ADRs keep the domain-modeling skill's format. They are read for
language, rationale, provenance, and recovery, never counted as phases or
prerequisite artifacts. The decision and its consequences are recorded in
[ADR-0021](../adr/0021-dependencies-and-provenance-support-complete-propagation.md).

## Directory layout

The documentation is a directory tree, and the tree is part of the scaffold
rather than a convention layered on top of it. An authority folder without its
scaffold file places nothing; a scaffold file outside its folder describes
nothing. Fixed non-authority positions are named explicitly below.

Initialization writes this tree whole, down to and including
`docs/features/advisor-features.md`. Only the feature folders inside
`features/` are absent at the start, because a feature is named by the project
and its authority folders appear only with their first artifacts.

```
advisor-agents.md
docs/
  advisor-docs.md
  product/
    advisor-product.md
    advisor-product-project.md
    advisor-product-feature.md
    + artifacts
  frontend/
    advisor-frontend.md
    advisor-frontend-project.md
    advisor-frontend-feature.md
    + artifacts
  architecture/
    advisor-architecture.md
    advisor-architecture-project.md
    advisor-architecture-feature.md
    + artifacts
  implementation/
    advisor-implementation.md
    advisor-implementation-project.md
    advisor-implementation-feature.md
    + artifacts
  security/       advisor-security.md     + artifacts
  deployment/     advisor-deployment.md   + artifacts
  operations/     advisor-operations.md   + artifacts
  development/    advisor-development.md  + artifacts
  stack/          advisor-stack.md        + artifacts
  features/
    advisor-features.md
    <feature-slug>/
      product/       artifacts
      frontend/      artifacts
      architecture/  artifacts
      implementation/ artifacts
      security/       artifacts, when needed
      deployment/     artifacts, when needed
      operations/     artifacts, when needed
      development/    artifacts, when needed
      stack/          artifacts, when needed
```

Four rules govern it.

**One folder per authority, plus explicit non-authority positions.** The top
level of `docs/` is the authority table above, plus `features/`, `adr/`, and
`sources/`. Anything an authority owns sits in that authority's folder,
whatever kind of document it is. The other positions have deliberately
different roles: `features/` groups feature-scoped artifacts; `adr/` holds
skill-owned decision records; and `sources/` holds informative material owned
by no authority. None becomes an authority by being inside `docs/`.

An authority scaffold defines its directory by a semantic ownership boundary,
not a closed catalog of document types. It states what the authority governs,
what nearby concerns belong elsewhere, representative but non-exhaustive
examples, and how project-scoped rules differ from feature-scoped applications.
This lets an unanticipated artifact be placed without changing the scaffold
merely to admit its type.

That description is the first content after the scaffold title and has one
predictable shape: `## Boundary` with short `Owns`, `Includes`, `Excludes`, and
`Scope` paragraphs. For Product, Frontend, Architecture, and Implementation, the
boundary file ends with links to the physically separate project and feature
catalogs. An agent can load the boundary file alone to place a document, then
exactly one catalog for work in a known scope. The boundary is a routing
envelope, not a closed artifact taxonomy.

A natural document may touch several concerns, but it has one owning authority
and makes only that authority's decisions normative. It links to decisions owned
elsewhere and may mention them for context without restating their rule. If the
document discovers a new decision owned by another authority, that decision is
written in that authority's artifact instead.

**Advisor-owned documentation carries the `advisor-` prefix.** A folder's scaffold
is `advisor-<folder>.md`, and the file at the project root is
`advisor-agents.md`. The prefix says who owns the file
before it is opened, and keeps advisor-owned files sorted together in any
listing. It states ownership; fixed names distinguish advisor scaffolds and
catalogs, while an artifact's marker declares its status. A separate catalog is named
`advisor-<authority>-project.md` or `advisor-<authority>-feature.md`, so its
scope is visible before it is opened.

Skills live outside this documentation tree and use unprefixed names. Their
ownership and legacy cleanup follow
[Initialization](initialization.md#delivery-rules).

Inside this tree, a template is the one shipped asset without the prefix. It
is imported under a name the project chooses, because it is on its way to
becoming that project's artifact and takes a project name from the start.

**Shipped content never sits at a path the release cannot name.** Every
`advisor-*.md` occupies a fixed, known path. `docs/features/<feature-slug>/` is
named by the project, so nothing shipped is written inside it, and the feature
folder has no scaffold file of its own.
`docs/features/advisor-features.md` describes what a feature folder contains
and routes each phase to one authority boundary and one feature catalog. Each
feature question lives once in the feature catalog of Product, Frontend,
Architecture, or Implementation whose phase asks it; screening questions are
co-located with the phase where they first become answerable and retain their
cross-cutting authority owner.

A pre-existing `docs/deferred/` directory is preserved as an archive, and a
pre-existing `docs/handoffs/` is left as found; neither is an output of a fresh
initialization.

**Artifacts are not named by this model,** with one exception. A file's
authority is the folder it sits in and its status is its marker line, so its name
is free and is chosen when it is written, and an authority folder holds as many
artifacts as its work needs. Free means project-chosen, not opaque: the filename
and title identify the artifact's subject well enough to support relevance
judgement before its body is read, and its opening `Scope` section resolves
what the name alone cannot. The exception is `absent.md`, the artifact that
closes a phase a feature has no substance for: its name is fixed so that the
dismissal is visible in a listing, at the same cost as the folder's existence.

Two positions of the advisor's process are not delivered with the scaffold.
`GLOSSARY.md` sits at the project root and `docs/adr/` beside the authority
folders; each comes into existence when a session first needs it, neither
carries the `advisor-` prefix, and neither has a scaffold or a question list,
because nothing is delivered there and the skill that maintains them carries
their format. The prefix marks delivered advisor content, so a position
holding the project's own records does not take it.

### Sources

A `sources/` folder may sit at four positions and nowhere else:

```
docs/sources/
docs/<authority>/sources/
docs/features/<feature-slug>/sources/
docs/features/<feature-slug>/<authority>/sources/
```

Its position states which work the material is relevant to. When writing a
feature's Implementation artifact, a session considers `docs/sources/`,
`docs/implementation/sources/`, `docs/features/<feature-slug>/sources/`, and
`docs/features/<feature-slug>/implementation/sources/`. It selects relevant
full reads from filenames and opening lines. Position states relevance, never
ownership: a source belongs to no authority at any of these positions.

`docs/sources/` is considered across the project. A description of the system
being replaced may belong there, while material shared across authorities of
only one feature belongs in that feature's `sources/` folder. A specification
used by Product, Architecture, and Implementation of one import feature can
therefore remain one file discoverable from all three. Material relevant to
one authority belongs under that authority at the applicable project or feature
scope. Broad placement increases how often a source is considered; it does not
require a full read when the material is irrelevant to the current work.
This extends the source positions recorded in
[ADR-0008](../adr/0008-sources-inform-and-never-bind.md).

Store experiment material in an `experiments/` subfolder of the relevant
`sources/` location. Use `docs/sources/experiments/` for experiments relevant
across the project. Look in these subfolders when selecting sources relevant
to the current work. Experiment material remains informative; storing it does
not adopt its findings as decisions. The agent carrying out the experiments
manages their conduct and lifecycle.

Nothing here is delivered and no scaffold file exists. A `sources/` folder
holds material rather than answers, names nothing, and enumerates no questions,
so the pairing of a folder with its scaffold governs the delivered tree and not
this. A folder comes into existence when someone puts a file in one, which
keeps the tree honest: a `sources/` folder that exists is one with something in
it. `docs/advisor-docs.md` carries the convention and is where a reader learns
the position is available at all.

Shared reading guidance in the root file locates relevant sources and guides
selection by filename and opening lines. The procedure that needs the reading
owns when to perform it; a grill-with-docs session completes the relevant reads
before its first question. The source's informative role and placement remain
documentation rules.

A session judges what to open from each file's name and its opening lines,
whatever those hold — a title, a description, a summary — and reads whole only
what applies. Nothing is required of a source's format, because a source is the
user's file and not the advisor's; a file that opens by saying what it covers
is simply judged better. A session that leaves unread a source it judged
relevant says so by name. That is the one failure this design admits and cannot
prevent: material put there to be used, and an answer that looks fully informed
without it.

### The root file

`advisor-agents.md` sits beside the project's own `README.md` and instruction
files rather than replacing them.

`advisor-agents.md` is the entry point for shared document interpretation,
navigation, and selective reading, and for the advisor's rules on the work
separately installed skills perform. Its introduction explains the relationship
between the advisor files and catalogs and what the file itself covers. Its
sections are:

- **Using project documentation:** the brief authority summary; the
  [Product relationship between code and documentation](../product/overview.md#rules),
  which also covers a ticket or request contradicting an accepted decision; and
  that the accepted decisions are part of the spec of the work they specify
  when planning, building, or reviewing it; and that a passage becomes an
  input only once its routing envelope has been read.
- **Where things are:** the map to common rules, authority boundaries, catalogs,
  feature artifacts, vocabulary, and decision records.
- **Sessions, tickets, and handoffs:** the advisor's rules for grill-with-docs
  sessions, ticket breakdowns and implementation, delegation briefs, handoffs,
  and deferred work, the cases where a
  separately installed skill behaves differently in a guided project.
- **Reading guidance:** finding documents by subject through the folders,
  placing them through the common rules, following decision dependencies,
  finding sources, and citing supporting evidence.

An agent may open a known relevant artifact directly. To find what the project
decided on a subject, it searches inside the folder that holds it, an authority
folder, a feature folder, or `docs/adr/`, and follows the links the documents
found carry; when a search finds nothing, it opens the authority's boundary or
the authority table in the common rules, since the subject may be documented in
other words. To place a document, or to learn which decisions an action must
cover, it uses the common rules to select the authority, reads its boundary,
and reads a catalog only when the action needs those decisions or coverage
questions. It follows pertinent Dependencies, Review blocks, and decision
passages. The root does not require a documentation-tree inventory, a phase
assessment, or a session merely to use project documentation during ordinary
code work.
[ADR-0046](../adr/0046-finding-goes-through-folders-the-map-serves-placement.md)
records why finding goes through the folders while the common rules serve
placement.

A passage read without its routing envelope is not yet an input: before an
agent plans, builds, or reviews on it, or tells the user what the project
decided, it has read the document's title, status line, and Scope, and its
Dependencies when the passage is a decision that relies on others. A brief
that delegates work names the documents owning its subject, with their status,
since a delegate finds documents through its brief first.

The root's short interpretation summary is deliberately repeated at entry
depth: accepted means settled, not proven implemented; proposals and artifacts
needing review do not establish accepted inputs; sources inform decisions.
It also summarizes Product's decision-authority rule, including explicit
delegation, and states that advice adds no permission step or deviation record.
Full definitions remain in
`docs/advisor-docs.md`. This lets direct reads start informed without forcing a
read of the whole common contract or copying its detailed acceptance rules.
Stating that accepted decisions are part of a change's spec is how separately
installed skills that plan, build, or review the change apply them without a
note of their own, as
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
records.

Root-level reporting cites documents and passages supporting conclusions and
discloses unread material that could affect them. It does not require a full
reading inventory or a report on coverage that the task did not assess.
Detailed reports such as question-to-answer mappings and phase coverage belong
to the procedures that assess them: the advisor's skills and the grill-with-docs
session procedure in `docs/advisor-docs.md`.

The delivered files remain instructions for agents. Agents may explain the
project's conventions from those local files. Broader advisor design and
rationale belong in the advisor's repository, which the root points to rather
than shipping a second account into every target.

The advisor's own skills declare when they apply in their descriptions,
surfaced by the host under
[ADR-0028](../adr/0028-skills-declare-their-own-applicability.md); the root does
not repeat them and names none of them. A skill the advisor does not deliver
cannot carry the advisor's rules, so the root names it where its behavior in a
guided project differs and states the rule there, including when deferred work
is recovered, as recorded in
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).
The project's own instruction file gains a reference to the root for each host;
Codex is told to read and follow it, while Claude Code uses its supported
import syntax.

Every instruction has a home reached before the action needing it. The division
recorded in [ADR-0031](../adr/0031-shared-guidance-and-workflows-have-distinct-homes.md),
revised by
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
for the work separately installed skills perform, is:

- `advisor-agents.md` owns shared interpretation, navigation, and selective
  reading, and the advisor's rules for grill-with-docs sessions, ticket
  breakdowns and implementation, handoffs, and deferred work, including when
  deferred work is
  recovered. It names a separately installed skill where its behavior in a
  guided project differs, and none of the advisor's own skills.
- `docs/advisor-docs.md` owns the common documentation contract: authority
  routing, placement, source authority, artifact envelopes and statuses,
  dependencies, provenance, acceptance conditions, and decision readiness.
  Its authority table summarizes enough to select a local boundary. It also
  owns the grill-with-docs session procedure: preparation, including the
  relevant source reads and the code of behavior the project already has,
  before the first question; writing; acceptance; and
  the check and report before a phase is claimed complete.
- Authority scaffolds own their precise inclusion, exclusion, and scope rules.
- Catalogs own subject-specific decisions, dependencies, and recommended order.
  The next-work skill uses them to assess candidate decisions; a grill-with-docs
  session uses them to choose what to ask next within selected work. Catalog
  order is neither a global priority rule nor a session procedure.
- `docs/features/advisor-features.md` owns feature identity, folder structure,
  phase routes, and absence and completion conditions, with the step that
  writes `absent.md`. The session procedure applies them when it declares a
  feature or checks a phase.
- `next-work` owns read-only assessment of the current position and
  implemented state, selection of one recommended action and useful alternatives,
  and the evidence and uncertainty reported with that advice.
- `propagate-change` owns changes to accepted rules and restores
  coherence across every affected dependant. It applies the session
  procedure's writing and acceptance steps to the artifacts it changes.
- `migrate-docs` owns full reads and transfer of selected inputs,
  applying the same writing and acceptance steps and invoking
  `propagate-change` for the decisions it needs.
- Separately installed skills from Matt Pocock's set own the general
  procedures: `grilling` the rounds of questions, `domain-modeling` the
  glossary and decision records, `to-tickets` ticket slicing, `implement`
  implementation, and `handoff` conversation transfer, while `grill-with-docs`
  starts the sessions whose procedure `docs/advisor-docs.md` owns.
  Advisor-specific rules stay in the advisor's own skills and delivered
  documents rather than in a copy of a general skill or a wrapper around one,
  as recorded in [ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md)
  and [ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).

Documentation rules state what must hold. The advisor's skills and the
grill-with-docs session procedure define how to carry out and check the work.
Brief summaries support interpretation and routing, while a repeatable
procedure has one home: the advisor skill that owns it, or the delivered
document that states it for work a separately installed skill performs.

The advisor repository's Product, Architecture, and ADR documents explain and
test these rules but do not instruct an agent in a target. A behavior described
only there is missing from the delivered product.

## Next-work advice

`next-work` applies when the user asks for the current position or what
product, decision, design, implementation, or other delivery work is worth doing
next. It does not replace ordinary routing when the user has already chosen a
concrete task. The assessment is advice only: it changes no project file, starts
no interview, and performs none of the work it recommends. The user's choice is
a new request routed to the applicable workflow.

The assessment starts from the user's current goal, active issues, pull requests,
and work in progress, using the configured tracker guidance. It reads open
`deferred` issues: all of them for an unscoped request, and for a scoped request
those relevant to the scope or shared prerequisites. Advice leaves tracker
state unchanged. It checks whether candidate work is already delivered or
underway before recommending it.

Both routes use the root's selective reading guidance and common documentation
rules. Reads of artifacts, dependencies, code, tests, and delivery evidence deepen
where they can change the choice, including shared prerequisites for scoped work.
Discovery expands when candidates are unclear; a general recommendation does not
require an inventory of every artifact envelope. This keeps assessment focused
on choosing useful work. Full phase coverage is assessed only when requested;
folders or markers alone establish neither coverage nor readiness.

Exploration stops when evidence supports a choice over plausible alternatives
and remaining uncertainty would not change it. Safe, focused verification is
used when it can resolve a deciding uncertainty. If that uncertainty cannot be
resolved, the report identifies it and verification may itself be the next
action. A material contradiction between code and documentation becomes a
prerequisite to clarify under the common rule; the advice workflow neither
resolves the conflict nor changes either side.

Candidate work may be a decision, the smallest ready end-to-end implementation
slice, a repair, verification, a ready deferred goal, or a later improvement.
Absent, broken, and unverified behavior are distinct: missing documentation or
verification alone does not establish missing implementation. Readiness for an
implementation slice requires only the accepted decisions that could invalidate
it, not whole-phase completion. Ranking applies the Product rule that a working
primary journey precedes optional polish. The workflow recommends one action,
states why now, its first concrete step and smallest observable completion
condition, and cites its evidence and applicable accepted decisions. It names
uncertainty or unread material that could change the choice, includes alternatives
when they clarify the ranking, explains blockers through the nearest actionable
prerequisite, and uses usual phase order only to break otherwise equivalent
choices.

## Scope and prerequisites

Every artifact is either project-scoped or feature-scoped. Scope says how
broadly its decisions apply; it does not by itself make the artifact a
prerequisite.

The foundation is deliberately thin: the project-scoped Product description
and Architecture shape, over the language fixed in `GLOSSARY.md`. Each feature
decision uses the accepted foundation inputs it needs; the entire foundation
is not a prerequisite for declaring a feature or accepting one of its decisions.
Other project-scoped artifacts, including shared
Implementation conventions, the default Frontend surface, the Stack, and Security
policy, are created when a feature first needs them. They govern subsequent
work rather than retroactively blocking work that preceded the need.

A feature is represented under `docs/features/<feature-slug>/`, which holds one
folder per authority that writes a feature-scoped artifact and may hold shared
informative material in `sources/` under the [source rules](#sources). Its slug is
lowercase ASCII kebab-case matching `[a-z0-9]+(?:-[a-z0-9]+)*`; its readable
name remains in artifact titles and prose. Project-scoped content remains under
`docs/<authority>/`. Keeping the feature's artifacts together makes the unit
of work the unit of navigation, while the folder an artifact sits in states
which authority owns it.

A feature is declared when the user begins to describe a new user-observable
capability, confirms the session's proposed slug, and the session writes its
first proposed Product artifact under
`docs/features/<feature-slug>/product/`. An exact existing slug resumes that
feature; the session never adds a numeric suffix silently, and a different
capability receives a different explicitly agreed slug. The feature directory
and its Product phase are created by that write as one operation: there is no
separate empty feature and no command that pre-creates its later authority
folders. Each later authority folder appears only with its first artifact,
including `absent.md` when a usual feature phase has no substance. Any authority
can own feature-specific decisions without gaining a phase; shared rules remain
at project scope. The scope and catalog policy is recorded in
[ADR-0019](../adr/0019-authority-and-scope-are-independent.md).

The usual route is:

1. Product foundation;
2. Architecture foundation;
3. feature Product;
4. feature Frontend;
5. feature Architecture;
6. feature Implementation.

The macro order alone does not tell a session how to move through one phase.
Each authority in the order therefore has separate project and feature catalogs
that expand those scopes into recommended decision sequences. Each sequence
groups question slugs by dependency and says what accepted output the next
phase receives. It is the normal interrogation route: a session may return to
an earlier decision when a later answer changes it.

Before writing within a phase, the session follows the feature scaffold to the
one authority that owns the phase. It reads that authority's boundary file and
only its feature catalog; a different catalog is read when the session actually
reaches work in that other scope.
The feature scaffold owns the feature sequence and routing; the authority
scaffold owns what belongs to the authority; the selected catalog owns the
progression and questions. None is reconstructed from memory or copied into the
others.

An internal progression is not a second prerequisite chain. Its steps are not
subphases, create no folders or markers, and carry no completion state. Question
numbers remain presentation order rather than identity or state, and the phase
is complete only when every question it owns has been answered or explicitly
dismissed. The progression may be represented in one artifact or several;
artifact names and boundaries remain decisions of the session.

The demand-driven authorities outside the phase order also state how they
develop after a screening trigger. Those descriptions order dependent answers
when several have substance, but do not require the authority's whole catalog
to be filled and do not turn the authority into a phase.

Frontend usually precedes Architecture because approved client-visible behavior
sharpens what the system does. The route is guidance, however: readiness belongs
to a particular decision. It requires the necessary accepted inputs and evidence
that remaining open choices cannot invalidate it. An export file contract may
be ready from accepted content and export rules while its launch screen is
unresolved; the advice must explain that independence. A phase can therefore
have accepted decisions before it is complete, and more than one action may be
ready. Recommend one, justify it, and name useful alternatives; use the usual
order when no stronger reason distinguishes them.

Unknown, proposed, or needs-review inputs cannot establish readiness. Cyclic
dependencies require settling the coupled decisions together, not treating one
draft as the other's accepted basis. Once choices are settled, internal
consistency and accepted external inputs permit joint acceptance of that set;
interrupted acceptance retains recovery notes until all members are checked.
The user may still choose speculative
work; its artifact stays proposed and records unresolved assumptions. No
deviation register or reminder follows that choice.

Initial Product and Architecture foundations need accepted coverage of their
catalogs before the foundation is complete. Decision readiness applies while
that initial coverage is unfinished too: Architecture can use sufficient
accepted Product inputs before all Product questions are covered, and a feature
can begin and have accepted decisions before either foundation phase is complete.
The session must establish that remaining open foundation choices cannot
invalidate the particular decision; proposed passages cannot substitute for
accepted inputs. This application is recorded in
[ADR-0020](../adr/0020-readiness-follows-decisions-not-phase-order.md#foundation-readiness).
A new proposal does not withdraw coverage already supplied by accepted
artifacts, including during an incomplete foundation. A draft replacement
identifies the accepted passage it proposes to change, while the current rule
stays in force. When the change is agreed,
the session updates that one owning rule and propagates through affected
dependencies, including across features. It does not reopen all features merely
because a proposal appears under Product or Architecture.

Folder presence shows only that documentation exists in an authority. Phase
completion requires accepted, compatible artifacts to cover every catalog
question with no unresolved input needed by that coverage. Inspect all artifacts
in the phase, including proposals, to distinguish extra drafts from missing
coverage and changed rules. Even all-accepted markers can leave a question
unanswered; conversely an unrelated proposed extension does not remove valid
coverage. Report the semantic basis rather than guessing from directory state.
This replaces
[ADR-0009](../adr/0009-every-proposed-artifact-keeps-its-phase-open.md) through
[ADR-0020](../adr/0020-readiness-follows-decisions-not-phase-order.md).

A phase with no substance is closed with `<authority>/absent.md` only after
reading its entire feature catalog and checking every question, including
screening questions, against the relevant accepted decisions. The artifact
has Scope and an explicit dismissal for each question's slug explaining why
no decision is needed; when existing coverage is the reason, link that accepted
coverage and record the dependency. A negative applicability answer may support
these dismissals but never replaces the full check. No dedicated applicability
question is required for a phase to use this procedure.

Any substantive answer belongs in the appropriate normal artifact, with the
phase linking answers owned elsewhere; it rules out a blanket absence for that
phase. An unresolved question prevents accepting `absent.md`. Use repository
evidence before asking the user, and ask only unresolved decision-critical
questions. This check does not require an interview question for every catalog
entry. If applicability changes, review
that artifact and amend or remove its replaced dismissals during propagation;
accepted absence cannot contradict new accepted decisions. Only the usual four
feature phases have this closure convention. A demand-driven authority needs
neither an absent folder nor an absence artifact to prove it is not a phase.

Completeness is a semantic reading, per
[ADR-0002](../adr/0002-completeness-is-a-reading.md), rather than a stored phase
property. It can be wrong; naming the question, artifact, and passage makes the
conclusion reviewable without introducing a coverage registry.

## Question catalogs and completeness

Each question is a named, numbered item in one question catalog, and that
enumeration is its only home. There is no parallel question directory or
register. Product, Frontend, Architecture, and Implementation each have a project
catalog and a feature catalog in separate files. Feature questions are grouped
under the phase that asks them. Every feature follows those same shared
catalogs, while a session loads only the one for its current phase.
`docs/features/advisor-features.md` routes to those feature catalogs and does
not repeat them. Authorities without a phase keep one demand-driven catalog
in their scaffold and apply only the triggered questions to the actual scope.

The name is the question's identity and the number is only presentation order.
A name never changes meaning and is never reused for a different question: a
question that no longer applies is retired rather than recycled, so two
enumerations from different releases can be compared by name. A dismissal
cites the name, never the number.

A concern whose answer is a rule for the project and an application inside a
feature is two questions, not one asked twice. The project-scoped question
fixes the rule; the feature-scoped one asks this feature's application or
derogation and never restates the rule. Authorities without a phase reach
feature work through screening questions, which link substantive answers in the
owning authority at the scope they actually govern.

The artifacts of a phase provide complete question coverage only when, taken
together, they address every question the phase owns. An inapplicable question
is dismissed explicitly by name; silence is not an answer. An artifact that
answers no particular question may still belong by the authority boundary; it
is accepted when its own decisions and necessary inputs are settled. Its draft
does not remove coverage already supplied by compatible accepted rules.

Phase coverage and artifact acceptance are distinct. An individual artifact
can be accepted once its own decisions, necessary inputs, and triggering
question are settled, even while the phase's catalog coverage remains incomplete.
Demand-driven artifacts at either scope are accepted against that actual need,
without requiring unused questions to be exhausted or a catalog question for
every rule admitted by the boundary. This extends
[ADR-0004](../adr/0004-demand-driven-artifacts-are-accepted-against-their-trigger.md)
through [ADR-0019](../adr/0019-authority-and-scope-are-independent.md).

Completeness is established by reading the selected catalog and all artifacts
in the phase together, not by counting or by maintaining an index. A question's
name
is cited so that a person can follow the answer back to what was asked, and
nothing requires it to appear where a program could find it. The check is
therefore judgement and can be wrong without saying so; what keeps the mistake
visible is that a session reporting completeness names each question, the
artifact, and the passage it takes to address it. That mapping is reported for
review and not persisted. The rationale is recorded in
[ADR-0002](../adr/0002-completeness-is-a-reading.md).

Security, Deployment, Operations, Development, and Stack have no phase. Their
screening questions sit in the feature catalog where the inputs normally become
available, but their authoritative answers may be project- or feature-scoped.
The phase answer links to the rule and explains its dependency. A shared rule
is never copied into each feature, and a feature-only procedure need not become
a project-wide policy. If an accepted shared rule changes, propagation completes
in the same focused session, including other affected features.

Screening compares the new need with documented coverage. A dismissal is valid
when that coverage applies or the concern has no substance, not merely because
the relevant shared artifact is absent. The owning authority's demand-driven
catalog guides the triggered decisions at either scope and introduces no phase.
A deferred item records later work, never substitutes for a necessary current
input.

Changing an enumeration is a versioned product change. The catalog, its
boundary scaffold, and the session procedure in `docs/advisor-docs.md` that
works through it advance in the same published payload release. This describes
release authoring, not the versions installed in an existing target: later
initialization can leave mixed
releases, under the
[delivery compatibility limits](initialization.md#deliberate-exclusions).

## Provenance

Migrated from the former advisor repository, `docs/architecture/documentation-model.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. The specifications describe the advisor
product; installed `advisor-*.md` files govern its use in this repository.
