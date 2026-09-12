# Guided project documentation model

**Status:** accepted

## Scope

This contract defines how the advisor represents normative documentation in a
target project: who owns each rule, which kinds of document exist, how scope
and prerequisites interact, where questions are enumerated, and how lifecycle
state is exposed.

The Product behavior built on this model is specified in the
[Product description](../product/overview.md). The terms used by the model are
defined in [`CONTEXT.md`](../../CONTEXT.md). How the model is delivered into a
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
- [File-resident deferred items and handoffs](../product/overview.md#what-it-knows)
  — future-work recovery and explicit conversation transfer must use project
  files without an external tracker or hidden session store.

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
belonging to the advisor's process. The glossary at `CONTEXT.md` and the
decision records under `docs/adr/` are written and formatted by the
`advisor-domain-modeling` skill the session invokes, and hold content the
project owns. Neither is an artifact: neither belongs to an authority, neither
carries a lifecycle this model reads, and neither is a prerequisite of
anything. Work rests on the artifact a decision shaped, never on the record of
its rationale, and on the language a project fixed, never on the document that
lists it.

Artifacts use the glossary's resolved language and link relevant ADRs. Keep the
decision's reasons and sources in the ADR rather than duplicating them in each
dependent artifact; a brief local explanation may clarify the dependency. The
skill-owned formats and their exemption from these kinds are recorded in
[ADR-0005](../adr/0005-the-glossary-and-the-records-belong-to-the-skill.md),
and their standing inside the advisor's process in
[ADR-0038](../adr/0038-the-glossary-and-the-records-are-advisor-positions.md).

A third thing falls outside the kinds, and unlike the two above it falls
outside the advisor's process entirely. A **source** is material the user puts
in a `sources/` folder for a session to read: know-how, an external
specification, a description of a system being replaced. It is not written for
this project and states none of its decisions, so it carries no authority, no
status, and no release marker, and it is a prerequisite of nothing.

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
records why durable future work and conversation transfer use different names,
skills, and directories.

Each deferred item is one Markdown file at
`docs/deferred/<descriptive-name>.md`, relative to the project root.
Initialization creates and reports the empty `docs/deferred/` directory as a
fixed structural destination. It delivers no file into it: the operational
protocol remains in `advisor-defer`, and the first real deferred item is the
first project-owned content there. A record keeps a stable name so links survive
closure or a change of destination.

Its opening fields identify state, scope (`project`, `feature:<slug>`, or
`undecided`), destination (one authority name or `undecided`), and the condition
for revisiting it. Its body states what should be revisited, why it can wait,
relevant context and links, and any established facts or remaining questions
needed to resume. Unknown routing or conditions are explicit, not guessed. A
deferral does not create a feature folder or give a proposed feature an accepted
identity.

An input that already identifies what should be revisited and gives either a
possible outcome or a meaningful revisit condition can be recorded directly.
When it does not, `advisor-defer` runs a short `advisor-grill-me` session only
until that minimum is clear. It does not preserve an unintelligible idea merely
to avoid asking. A Product non-goal creates no deferred item automatically; an
item about reconsidering it links to the Product rule instead of duplicating it.

Before recommending work or starting or resuming a session, the agent lists
deferred items and reads their opening fields. It reads relevant open records in
full, including shared project records and undecided routing that may affect the
work. Missing routing fields prompt classification rather than exclusion. On a
general next-work request it considers all open deferred items. Related records
are also followed by subject or reference, since destinations can be outdated.

The agent compares those items with current artifacts and accepted inputs,
reports what is ready, still waiting, or apparently answered or superseded, and
addresses relevant deferred items before decisions that depend on them. These
judgements are not saved as another set of status labels. A current necessary
input stays an open decision in its owning artifact; calling it a deferred item
does not make that artifact acceptable.

When an item is answered, the session writes and accepts its authoritative
answer first, then closes the deferred item with a link under `## Resolution`.
Already-answered items require checking that the linked answer still applies. A
deliberately dropped item closes with the user's agreed reason; any change to
accepted rules still follows normal propagation. Partial progress stays in the
open record. Closure alone never proves decision readiness.

The operational format and capture, classification, recovery, and closure
procedure have one home in the delivered `advisor-defer` skill.
`advisor-next-work` and session workflows invoke it before the action requiring
recovery. Existing external issues are not automatically imported, changed, or
closed.

## Session handoffs

A handoff is a project-owned Markdown file at
`docs/handoffs/<descriptive-focus>-handoff.md` that compacts the current
conversation for a fresh session continuing the same work. It is intended as a
temporary bridge, not project history or future-work tracking, but has no
managed state: the user removes it manually when it is no longer useful.

`advisor-handoff` creates a handoff only on explicit invocation. The skill does
not discover, prioritize, resume, archive, or delete handoffs. A fresh
conversation reads the file the user identifies as ordinary project context;
root instructions do not scan `docs/handoffs/` automatically. Multiple files
may coexist, and no recency is inferred from filenames or timestamps.

A handoff's layout adapts to its work but identifies the next conversation's
objective, current state, settled decisions and constraints, authoritative
file or history references, next action, and open questions. It links to
persisted information instead of duplicating it and redacts sensitive data. A
user argument sets its focus; otherwise the active work does. Creation never
overwrites an existing file: a collision receives another descriptive name.

Initialization creates and reports the empty `docs/handoffs/` directory as a
fixed structural destination but delivers no record or protocol file into it.
No compatibility or migration is provided for deferred-question records left
there by earlier releases.

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
The exact delivered format lives in `docs/advisor-docs.md`, the writing and
acceptance procedure in `advisor-grill-with-docs`, and the change-propagation
procedure in `advisor-propagate-change`.

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
`docs/features/advisor-features.md` and the empty `docs/deferred/` and
`docs/handoffs/` directories.
Only the feature folders inside `features/` are absent at the start, because a
feature is named by the project and its authority folders appear only with
their first artifacts.

```
advisor-agents.md
docs/
  advisor-docs.md
  deferred/       durable future-work records, initially empty
  handoffs/       temporary conversation bridges, initially empty
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
level of `docs/` is the authority table above, plus `features/`, `deferred/`,
`handoffs/`, `adr/`, and `sources/`. Anything an authority owns sits in that
authority's folder, whatever kind of document it is. The other positions have
deliberately different roles: `features/` groups feature-scoped artifacts;
`deferred/` holds durable future-work records; `handoffs/` holds temporary
conversation bridges; `adr/` holds skill-owned decision records; and `sources/`
holds informative material owned by no authority. None becomes an authority by
being inside `docs/`.

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

**Every advisor-owned file carries the `advisor-` prefix.** A folder's scaffold
is `advisor-<folder>.md`, and the file at the project root is
`advisor-agents.md`. The prefix says who owns the file
before it is opened, and keeps advisor-owned files sorted together in any
listing. It states ownership; fixed names distinguish advisor scaffolds and
catalogs, while an artifact's marker declares its status. A separate catalog is named
`advisor-<authority>-project.md` or `advisor-<authority>-feature.md`, so its
scope is visible before it is opened.

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

`docs/deferred/` and `docs/handoffs/` are also fixed and are created directly by
initialization, but contain no shipped file. Their contents are named by
sessions, project-owned, and governed by their delivered skills rather than by
scaffolds inside the directories.

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
`CONTEXT.md` sits at the project root and `docs/adr/` beside the authority
folders; each comes into existence when a session first needs it, neither
carries the `advisor-` prefix, and neither has a scaffold or a question list,
because nothing is delivered there and the skill that maintains them carries
their format. They take the shape of the empty `docs/deferred/` and
`docs/handoffs/` positions, which are delivered while their eventual records
remain the project's: the prefix marks delivered advisor content, so a position
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

Nothing here is delivered and no scaffold file exists. A `sources/` folder
holds material rather than answers, names nothing, and enumerates no questions,
so the pairing of a folder with its scaffold governs the delivered tree and not
this. A folder comes into existence when someone puts a file in one, which
keeps the tree honest: a `sources/` folder that exists is one with something in
it. `docs/advisor-docs.md` carries the convention and is where a reader learns
the position is available at all.

Shared reading guidance in the root file locates relevant sources and guides
selection by filename and opening lines. The skill owns when to perform that
reading; session preparation completes the relevant reads before its first
question. The source's informative role and placement remain documentation rules.

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
navigation, and selective reading. Its introduction explains the relationship
between the advisor files, catalogs, and skills. Its sections are:

- **Using project documentation:** the brief authority summary and the
  [Product relationship between code and documentation](../product/overview.md#rules).
- **Where things are:** the map to common rules, authority boundaries, catalogs,
  feature artifacts, vocabulary, decision records, deferred work, and handoffs.
- **Reading guidance:** selecting relevant material, following decision
  dependencies, finding sources, and citing supporting evidence.

An agent may open a known relevant artifact directly. When locating or placing
documentation, it uses the common rules to select the authority and reads its
boundary. It considers relevant project and feature scopes, selects artifacts
by their opening envelopes, and follows pertinent Dependencies, Review blocks,
and decision passages. It reads a catalog only when the action needs those
decisions or coverage questions. The root does not require a documentation-tree
inventory, a phase assessment, or a session merely to use project documentation
during ordinary code work.

The root's short interpretation summary is deliberately repeated at entry
depth: accepted means settled, not proven implemented; proposals and artifacts
needing review do not establish accepted inputs; sources inform decisions.
It also summarizes Product's decision-authority rule, including explicit
delegation, and states that advice adds no permission step or deviation record.
Full definitions remain in
`docs/advisor-docs.md`. This lets direct reads start informed without forcing a
read of the whole common contract or copying its detailed acceptance rules.

Root-level reporting cites documents and passages supporting conclusions and
discloses unread material that could affect them. It does not require a full
reading inventory or a report on coverage that the task did not assess. Skills
own detailed reports such as question-to-answer mappings and phase coverage.

The delivered files remain instructions for agents. Agents may explain the
project's conventions from those local files. Broader advisor design and
rationale belong in the advisor's repository, which the root points to rather
than shipping a second account into every target.

Skill descriptions declare when they apply, surfaced by the host under
[ADR-0028](../adr/0028-skills-declare-their-own-applicability.md). The root does
not repeat them and names no skill at all. Every workflow that must consider
deferred work invokes `advisor-defer` from its own procedure, as recorded in
[ADR-0035](../adr/0035-deferred-recovery-belongs-to-the-workflows.md); advice
given without entering such a workflow carries no documented obligation to
recover them. The project's own instruction file gains a host-specific
reference to the root; Codex is told to read and follow it, while Claude Code
uses its supported import syntax.

Every instruction has a home reached before the action needing it. The division
recorded in [ADR-0031](../adr/0031-shared-guidance-and-workflows-have-distinct-homes.md),
revised for deferred recovery by
[ADR-0035](../adr/0035-deferred-recovery-belongs-to-the-workflows.md), is:

- `advisor-agents.md` owns shared interpretation, navigation, and selective
  reading. It names no skill and carries no workflow trigger.
- `docs/advisor-docs.md` owns the common documentation contract: authority
  routing, placement, source authority, artifact envelopes and statuses,
  dependencies, provenance, acceptance conditions, and decision readiness.
  Its authority table summarizes enough to select a local boundary.
- Authority scaffolds own their precise inclusion, exclusion, and scope rules.
- Catalogs own subject-specific decisions, dependencies, and recommended order.
  The next-work skill uses them to assess candidate decisions; session skills
  use them to choose the next useful question within selected work. Catalog
  order is neither a global priority rule nor a session procedure.
- `docs/features/advisor-features.md` owns feature identity, folder structure,
  phase routes, and absence and completion conditions. The session workflow
  performs feature creation and the checks that establish those conditions.
- `advisor-next-work` owns read-only assessment of the current position and
  implemented state, selection of one recommended action and useful alternatives,
  and the evidence and uncertainty reported with that advice.
- `advisor-grill-with-docs` owns session preparation, feature creation, writing,
  acceptance, phase checks, and their detailed reports. It uses the shared
  reading guidance and completes relevant source reads before its first question.
- `advisor-propagate-change` owns changes to accepted rules and restores
  coherence across every affected dependant. It invokes the writing workflow
  for the artifacts it changes.
- `advisor-migrate-docs` owns full reads and transfer of selected inputs, invoking
  the writing and propagation workflows for the decisions it needs.
- `advisor-defer` owns deferred-item clarification, capture, classification,
  recovery, and closure. `advisor-next-work`, `advisor-grill-with-docs`, and
  `advisor-propagate-change` invoke its recovery from their own procedures, and
  `advisor-migrate-docs` reaches it through the workflows it invokes.
- Explicitly invoked `advisor-handoff` owns compact conversation-transfer files,
  without automatic discovery or lifecycle management. The root limits reads
  of handoffs to those the user identifies.

Documentation rules state what must hold. Skills define how to carry out and
check the work. Brief summaries support interpretation and routing, while a
repeatable procedure has one home in its owning skill.

The advisor repository's Product, Architecture, and ADR documents explain and
test these rules but do not instruct an agent in a target. A behavior described
only there is missing from the delivered product.

## Next-work advice

`advisor-next-work` applies when the user asks for the current position or what
product, decision, design, implementation, or other delivery work is worth doing
next. It does not replace ordinary routing when the user has already chosen a
concrete task. The assessment is advice only: it changes no project file, starts
no interview, and performs none of the work it recommends. The user's choice is
a new request routed to the applicable workflow.

Before assessing candidates, it invokes `advisor-defer` to recover relevant
future work. An unscoped request inventories all authority and feature artifact
envelopes before selecting bodies. A scoped request reads that scope, shared
prerequisites, evidence affecting readiness, and relevant or unclassified
deferred records. Both routes use the root's selective reading guidance and the
common documentation rules; neither infers coverage or readiness from folders
or markers.

The workflow considers both settled intent and implemented state. It inspects
relevant code and existing tests and runs safe, focused verification when
practical. It reports what remains unverified. A material contradiction between
code and documentation becomes a prerequisite to clarify under the common rule;
the advice workflow neither resolves the conflict nor changes either side.

Candidate work may be a decision, the smallest ready end-to-end implementation
slice, a repair, a ready deferred goal, or a later improvement. Readiness for an
implementation slice requires only the accepted decisions that could invalidate
it, not whole-phase completion. Ranking applies the Product rule that a working
primary journey precedes optional polish. The workflow recommends one action,
names materially useful ready alternatives, explains blockers through the
nearest actionable prerequisite, and uses usual phase order only to break
otherwise equivalent choices.

## Scope and prerequisites

Every artifact is either project-scoped or feature-scoped. Scope says how
broadly its decisions apply; it does not by itself make the artifact a
prerequisite.

The foundation is deliberately thin: the project-scoped Product description
and Architecture shape, over the language fixed in `CONTEXT.md`. Each feature
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
visible is that a skill reporting completeness names each question, the
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
boundary scaffold, and the skill that conducts sessions against it advance in
the same published payload release. This describes release authoring, not the
versions installed in an existing target: later initialization can leave mixed
releases, under the
[delivery compatibility limits](initialization.md#deliberate-exclusions).

## Provenance

Migrated from the former advisor repository, `docs/architecture/documentation-model.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. The specifications describe the advisor
product; installed `advisor-*.md` files govern its use in this repository.
