# Interaction flows

**Status:** proposed

## Scope

These proposed scenarios define shared acceptance-test expectations for advisor
behavior inside a guided project. They guide Development verification;
Product owns the promises and Architecture owns their contracts. Open decisions
below remain proposals and do not change those current rules.

## Dependencies

- [Product capabilities](../product/overview.md#what-it-does) — the scenarios
  exercise the behavior the advisor promises to users.
- [Deferred items](../architecture/documentation-model.md#deferred-items) and
  [session handoffs](../architecture/documentation-model.md#session-handoffs) —
  future-work recovery uses the configured tracker, while explicit conversation
  transfer stays outside the project.
- [Artifact lifecycle and references](../architecture/documentation-model.md#visible-document-markers-and-decision-references)
  and [coverage](../architecture/documentation-model.md#question-catalogs-and-completeness),
  with [decision readiness](../architecture/documentation-model.md#scope-and-prerequisites)
  — acceptance, recovery, and readiness expectations must match these contracts.
- [Delivery rules](../architecture/initialization.md#delivery-rules) and
  [failure behavior](../architecture/initialization.md#failure-behavior) —
  initialization and adoption scenarios rely on the helper's file guarantees.
- [The root file](../architecture/documentation-model.md#the-root-file) — the
  root supplies shared interpretation, navigation, and reading guidance, and
  the advisor's rules for grill-with-docs sessions, ticket breakdowns and
  implementation,
  handoffs, and deferred work; an advisor skill is reached from its own
  declaration and owns its workflow-specific steps and reports. Flows D and E
  distinguish those responsibilities.
- [Code and documentation](../product/overview.md#rules) — ordinary code work
  distinguishes implemented behavior from documented intent, as in flow Y.
- [Payload content](../architecture/initialization.md#the-payload) — flow M
  cannot assume per-file release markers; evidence for its version comparison
  remains part of the unresolved template-import scenario.

## Purpose

The scenarios test the [Product description](../product/overview.md),
[documentation model](../architecture/documentation-model.md), and
[Initialization](../architecture/initialization.md).

Quoted requests are illustrative. In the scenarios below:

- **derive the position** means starting with folders and artifact envelopes,
  then reading relevant dependencies, review notes, decision passages, and
  catalog coverage as required by the documentation model;
- **run a session** means the file-backed exchange in rounds of numbered
  questions defined in [`GLOSSARY.md`](../../GLOSSARY.md);
- **initialized** means the helper has delivered the fixed scaffolding,
  instructions, and skills defined by Initialization. Scenarios relying on
  usable instructions assume those paths are actually readable; the helper's
  zero exit result alone does not establish that for the destinations it
  preserved.

## A. An idea meets an initialized project

**Given.** An initialized project has no artifacts, feature folders, or
`GLOSSARY.md`.

**When.** The user asks to develop a product idea.

**Expect.**

- The agent derives Product foundation as the next phase and cites its basis.
- It opens a proposed Product artifact and runs a Product session.
- Answers and resolved terms are written as they settle; unresolved answers
  remain explicit open decisions.
- Acceptance is refused while a catalog question is neither answered nor
  explicitly dismissed, or while an open decision remains.
- Once complete, the artifact becomes accepted and Architecture foundation is
  named as the next action.

**Leaves behind.** `GLOSSARY.md` and the Product artifact; no empty artifacts
for other authorities.

## B. Asking for a phase the project has not reached

**Given.** Feature `checkout` has an accepted Product artifact and no later
phase folders. Its payment interaction and resulting failure promises remain
undecided and can change the payment contract and retry mechanics.

**When.** The user asks for Implementation work.

**Expect.**

- The agent identifies the unresolved payment and failure decisions, explains
  why the requested mechanics depend on them, and recommends the relevant
  Frontend work. Folder absence alone is not the reason.
- It offers Frontend and the requested Implementation work, with a recommendation.
- If the user insists on Implementation, the resulting artifact names its unresolved
  prerequisites. No deviation register or reminder is created.
- The recommendation remains the missing decisions while they are unresolved;
  an independent Implementation decision is evaluated on its own inputs.

## C. An upstream change with downstream consequences

**Given.** Search and export artifacts depend on the accepted Product visibility
rule that only published products can be shown. Each has a Dependencies link to
that passage and explains how it controls results. The user now includes drafts
for editors, and an Implementation filter depends on the search contract.

**When.** The user agrees to change that rule during a session.

**Expect.**

- The agent identifies the rule, reason, and affected search, export, and filter
  decisions, including the transitive dependency. It checks related terms and
  passages so missing links do not hide relevant artifacts.
- It asks only new choices, such as which actors count as editors, and applies
  consequences already determined by the answers.
- Important reasons, alternatives, and sources enter the relevant ADR through
  `domain-modeling`; superseded records remain in the original numbering.
- The current rule, affected documents, dependencies, and screening answers are
  updated and checked together. The session ends with coherent accepted rules,
  not a list of documents left for the user to review.
- Compatible documents can be accepted unchanged. Unrelated feature decisions
  remain usable; no blanket phase restart occurs.
- A wording-only correction to the same passage changes no lifecycle state when
  its meaning and dependencies are unchanged.

**Leaves behind.** Coherent current rules and their ADR, with accurate dependency
links. Scenario U covers interruption before that result is reached.

## D. A new feature

**Given.** Product and Architecture foundations are accepted.

**When.** The user begins to describe a new feature.

**Expect.**

- The agent agrees the readable feature name, proposes a lowercase ASCII
  kebab-case slug, and waits for confirmation before writing. An exact existing
  slug resumes that feature; no suffix is invented silently.
- It creates the feature and its Product phase together by writing the first
  proposed Product artifact; it creates no empty feature directory or later
  authority folders.
- Before writing, it follows the feature scaffold to the Product authority
  boundary and the separate Product feature catalog. It does not load the
  Product project catalog.
- The session procedure in `docs/advisor-docs.md` owns the starting step; the
  feature scaffold supplies identity, placement, and phase rules. The root
  names the session's trigger and links that procedure without repeating it.
- Product is the usual first session; later work becomes a deferred item when it
  cannot yet be settled. An independently ready decision can be proposed with
  its accepted basis, without pretending the whole preceding phase is complete.
- Screening questions are answered or explicitly dismissed.
- Acceptance uses the same coverage check as scenario A.
- Frontend is the usual next recommendation; any alternative is justified by
  its own accepted inputs and independence from remaining choices.

## E. Finding the instructions without carrying them

**Given.** The agent is asked to produce a feature Architecture artifact.

**When.** It locates the applicable instructions.

**Expect.** The reading path is:

1. the target's instruction file;
2. `advisor-agents.md`;
3. `docs/advisor-docs.md`;
4. `docs/features/advisor-features.md`;
5. the current phase's authority scaffold, which supplies its precise boundary;
6. that authority's feature catalog, which supplies only the current phase's
   questions, dependencies, and recommended decision order;
7. accepted prerequisites, related artifacts, and sources.

No skill is a hop on that path. The root treats the request as a
grill-with-docs session and links its procedure in `docs/advisor-docs.md`,
read at step 3, under
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).
Each hop above is disclosed by the previous file. The routing page repeats only
enough ownership detail to choose an authority; the local scaffold supplies the
precise boundary and resolves close cases; its catalog links expose only the
selected scope.

The root provides shared reading guidance, while the session procedure specifies
the preparation and checks required for this action. The agent completes the
relevant source reads before the first question and uses the catalog with
settled answers to choose the next useful question. The procedure's detailed
coverage report is not a general requirement to list every file read during any
task.

When an artifact is already known and the action only needs to read it, the agent
may open it directly using the root's authority summary. Placement and session
work still read the common rules, boundary, and relevant catalog as required.
Questions about local documentation conventions can be answered from those files;
the root's upstream pointer concerns broader advisor design and rationale.

Successful initialization does not certify this full reading path, under
[Delivery outcomes](../architecture/initialization.md#inputs-and-outputs).
Release-time host verification is owned by
[Development](repository-workflow.md#release-verification). Any further check
of the chain inside an existing guided project remains part of the proposal.

**Open question.** [D11](#open-decisions).

## F. A postponed decision comes back

**Given.** The configured tracker contains open `deferred` issues for a
feature, shared project work, and a question that does not say which authority
owns its answer.

**When.** The user asks what to do next, or starts or resumes relevant work.

**Expect.**

- The agent queries open `deferred` issues and reads relevant issues in full,
  including applicable shared work. A general next-work request considers every
  open `deferred` issue. An issue that does not say where its answer belongs is
  not silently excluded from related work.
- It distinguishes ready work, questions still waiting on specific inputs, and
  apparently answered or superseded questions against current documents.
- Relevant deferred items are addressed before dependent decisions. A prerequisite
  needed now cannot be deferred merely to accept the current artifact.
- A resolved deferred issue closes with a link to its answer once that answer
  is written in its artifact. The closed issue remains consultable; there is no
  parallel readiness index or duplicate normative answer.
- Initialization creates no deferred-item directory or sample issue. New issues
  use the configured tracker and create no feature folder.

## G. A screening question has substance

**Given.** A feature answer introduces a shared rule owned by another authority,
whose project-scoped artifact does not yet exist. An accepted earlier feature
also relies on behavior that the new shared rule changes.

**When.** The screening answer becomes substantive.

**Expect.**

- The rule is written in the owning authority's project-scoped artifact, not
  copied into the feature artifact.
- The new artifact is accepted against the triggering question rather than the
  authority's entire catalog, as decided in
  [ADR-0019](../adr/0019-authority-and-scope-are-independent.md).
- The feature artifact points to the rule and the feature session resumes.
- The earlier feature is reviewed and updated in the same focused propagation
  session before completion is reported. Unused questions in the authority's
  catalog do not become mandatory.
- The artifact's absence is not used to dismiss a substantive need.

## H. Adopting a project that already has documents

**Given.** A repository already contains documentation and decision records.

**When.** The user initializes the advisor and asks it to reorganize the
existing documents.

**Expect.**

- Initialization brings its own destinations to the invoked release and leaves
  the project's documents and unrelated paths untouched, reporting what it
  replaced and what it skipped.
- The request selects `migrate-docs`. The agent reads the selected
  inputs in full, splits or merges their contents by authority and scope, and
  reuses suitable existing artifacts. Existing ADR locations, numbering, and
  decision history are preserved.
- Explicit decisions in specifications the user identifies as current are
  already settled. Other material is adopted only according to its intended
  role; an old marker or confident wording alone does not confer acceptance.
- Necessary ambiguities, contradictions, and substantive exclusions are settled
  through `grilling`, in rounds of numbered questions with recommended answers.
  A conflict with an accepted rule follows the full decision-change propagation
  procedure.
- The agent verifies fidelity, coherence, and necessary decision inputs before
  accepting artifacts. It reports unrelated catalog gaps as later work and
  does not reopen settled design choices or require a second approval round.
- After replacement content and references are verified, the in-scope originals
  in the target project are removed or rewritten in place. No source copies,
  archives, or redirect documents remain. Useful provenance uses existing
  stable version links or factual citations instead of dangling file links.
  External input originals are not deleted without that scope in the request.
- Unreadable input or an undecided exclusion prevents removal of that input;
  interrupted transfers retain unverified originals temporarily and are reported
  as incomplete. Work resumes from existing output and remaining inputs.
- Migration can finish with proposed artifacts and incomplete phases. Missing
  decisions are recorded as gaps, not invented answers or implicit dismissals.

**Examples.** A current specification covering Product behavior and Architecture
contracts becomes linked artifacts without reapproving its explicit decisions.
Conflicting 30-day and 90-day retention rules prompt a question before either
becomes current. A missing deployment procedure is reported as a gap without
preventing acceptance of Product decisions that do not depend on it.

## I. "What should I do now?"

**Given.** Several features are at different phases. The repository may have no
verified primary journey yet, or it may already contain a working product.

**When.** The user asks for the current position and next work.

**Expect.**

- The request selects the read-only `next-work` skill, which reads the
  relevant open `deferred` issues and changes no project file.
- For a general request it inventories every feature and project authority from
  routing envelopes. For a scoped request it limits the assessment to that scope,
  shared prerequisites, relevant evidence, and the deferred issues that apply to
  the scope or to shared work.
- It reports ready decisions separately from phase coverage, with supporting
  passages and anything not verified. It inspects relevant code and tests and
  runs a safe focused check when practical before claiming the primary journey
  works.
- If the primary journey is not verified, it recommends either the nearest
  decision blocking useful implementation or the smallest ready end-to-end slice
  that satisfies the established behavior and constraints. Whole-phase completion
  is not required when the slice's necessary inputs are accepted.
- Once the primary journey works, explicit user goals, broken or incomplete
  observable behavior, and ready deferred work outrank minor improvements.
  Material security, safety, or operational risk may take priority at either
  stage.
- It recommends one action, states its evidence and uncertainty, names materially
  useful ready alternatives, and stops. The user's selection is routed as a new
  request; no interview or implementation starts automatically.

## J. The user contradicts an accepted artifact

**Given.** A session answer conflicts with an accepted artifact loaded for that
session.

**When.** The contradiction appears.

**Expect.**

- The agent pauses, cites the conflicting artifact and passage, and asks whether
  this is a permitted exception, an upstream rule change, or a misstatement.
- A rule change suspends the feature session and follows scenario C.
- The agent never writes a silent contradiction.
- If the user knowingly departs from the rule, the artifact states the
  departure; accepted artifacts bind advisor reasoning, not user choice.

**Open question.** [D6](#open-decisions).

## K. A feature is renamed or split

**Given.** The user wants to split one documented feature into two.

**When.** The split is performed.

**Expect.**

- The user assigns each existing decision to its new scope.
- Links, deferred items, records, and prose references to the old feature are updated
  or reported unresolved.
- Status is not copied automatically: every scope-changed artifact is reviewed
  before it is accepted again.
- Advisor-owned payload files do not need to move because feature folders hold
  project artifacts only.

**Open question.** [D7](#open-decisions).

## L. Acceptance refused

**Given.** The proposed artifacts in a phase appear finished but miss catalog
coverage.

**When.** The user asks to accept it.

**Expect.**

- The agent reads the phase catalog and all artifacts in its folder, then maps
  every catalog question to an answer or named dismissal in those artifacts,
  following
  [ADR-0002](../adr/0002-completeness-is-a-reading.md).
- It reports each question with the artifact and passage that address it; the
  mapping is not persisted as an index.
- It reports missing questions by name and offers dismissals where appropriate.
- Silence never counts as coverage, and acceptance is refused while coverage or
  open decisions remain.

## M. A template is newer than its project

**Given.** An older project imports a template from a newer helper release.

**When.** Available evidence establishes that the imported template is newer
than the project's catalogs. Files carry no release markers; which evidence
future template import provides remains unresolved.

**Expect.**

- The session follows the question catalog delivered with the project.
- The agent reports a version mismatch only when supported by that evidence,
  and identifies sections the catalog cannot assess by reading their content.
  It does not infer a file's version from absent markers or from the release
  named in a later delivery report that preserved that file. A report does
  identify the release of a destination it wrote or replaced.
- It neither fills unowned sections nor performs a partial upgrade.

**Open question.** [D10](#open-decisions).

## N. An interrupted session

**Given.** A proposed artifact contains a partially completed session.

**When.** The user resumes later, without conversation history.

**Expect.**

- The agent reconstructs answered questions, open decisions, deferred items, and
  position from project files.
- It names and resumes at the first unaddressed question.
- No session state outside the repository is required.

## O. A feature has nothing for a phase to decide

**Given.** A feature's next phase appears to have no decisions to make.

**When.** The session checks the whole feature catalog against the relevant
accepted decisions, including every screening question.

**Expect.**

- The agent writes an accepted
  `docs/features/<feature-slug>/<phase>/absent.md` only when every question can
  be dismissed with a reason. It includes Scope and names every dismissed slug;
  dismissals relying on existing coverage link its accepted answer and record
  that dependency.
- A negative Frontend surface answer supports the other dismissals but does
  not bypass their verification. Architecture and Implementation use the same
  procedure without needing a new applicability question in their catalogs.
- If an otherwise simple Implementation change needs a new kind of test, the
  substantive Development screening answer prevents blanket absence. Its
  guidance belongs in Development, linked by the phase's normal artifact.
- An unresolved question or necessary input prevents accepting the absence.
- The agent reads existing evidence and asks only unresolved decision-critical
  questions; the full catalog check does not become a question-by-question
  interview when the repository already supplies the answers.
- Accepted absence records a closed phase, rather than an unopened one. It
  satisfies [the closure contract](../architecture/documentation-model.md#scope-and-prerequisites)
  without reopening unrelated phases.

## P. Internal design for a client-only feature

**Given.** A local editor has no server. Its accepted Frontend artifact describes
Undo, and Architecture fixes the document's consistency guarantees.

**When.** The session chooses between document snapshots and inverse operations.

**Expect.**

- The choice belongs in `docs/features/undo/implementation/`, with links to the
  behavior and contract it realizes. It is not dismissed because no server exists.
- The `feature-internal-state` question exposes this choice without requiring
  a complete inventory of the client's code.
- Frontend retains the visible Undo behavior; Implementation records only the
  significant internal trade-off, not every class, function, or signature.
- Shared client conventions use the Implementation project catalog. CLI and job
  mechanics have the same owner when their alternatives satisfy the same
  boundary contracts, even if permitted timing differences are measurable.

## Q. A procedure specific to one feature

**Given.** An interrupted CSV import needs a manual recovery procedure. A shared
Operations rule already defines responder access and backup handling.

**When.** `operations-new-runtime-need` has a substantive answer.

**Expect.**

- The procedure is written in `docs/features/csv-import/operations/recovery.md`.
  Scope names only this feature; Dependencies links the applicable shared rule
  and import consistency decision with an explanation of each reliance.
- The screening artifact links that authoritative answer. No shared rule is
  copied, and the feature-specific procedure is not promoted to project scope.
- The new Operations folder introduces no phase, unused catalog obligation, or
  pre-created Security or Deployment folders.
- A feature-specific Security control or Deployment procedure follows the same
  scope rule, and shared changes propagate to their actual dependants.

## R. A proposal after foundation acceptance

**Given.** Product and Architecture foundations have accepted catalog coverage.
Catalog search is accepted. A new Architecture draft proposes a separate
notification service and identifies the current passage it could replace.

**When.** The user asks what can be worked on.

**Expect.**

- The current architecture remains authoritative. The draft is reported as a
  proposal, not as withdrawal of the accepted foundation.
- Search does not return to Architecture foundation merely because the new
  draft has `proposed` status in that folder.
- Work relying on the notification proposal cannot count it as an accepted
  input. If the user accepts the architectural change later, the session traces
  and completes its actual propagation.
- With no accepted foundation answers at all, the same proposed marker would
  instead represent unfinished initial foundation work.

## S. A decision ready before the previous phase is complete

**Given.** Export content, visibility, and export rules are accepted. The choice
of launch screen is open but cannot affect file content, delivery, or failure
guarantees. Architecture's export-file contract is not yet written.

**When.** The user asks for useful next work.

**Expect.**

- `next-work` can recommend the file contract now, naming accepted
  passages and explaining why the open screen choice cannot invalidate it.
- The resulting artifact records those Dependencies. Frontend remains incomplete;
  one accepted contract does not complete all Architecture questions either.
- If the screen choice could instead change synchronous download to deferred
  delivery, the advisor identifies the unsettled guarantee and recommends
  resolving that input before declaring the full contract ready.
- Two mutually dependent drafts are a coupled decision to settle together, not
  evidence that both are ready.
- The same assessment can support starting a feature while the foundation is
  incomplete. If accepted artifacts settle its purpose, actors, data, and
  outcomes, an unrelated open notification-delivery contract does not prevent
  accepting its Product decisions. The agent establishes that independence and
  leaves foundation coverage incomplete. If notification delivery could affect
  those outcomes, that necessary input must be settled before acceptance.

## T. A source changes after a decision

**Given.** An accepted export rule links an ADR that preserves the reasoning and
the source passage that motivated the format.

**When.** That source is corrected or removed.

**Expect.**

- The link identifies what may deserve reconsideration. The agent compares the
  source, ADR, and current rule and raises any substantive conflict.
- Neither rule nor status changes automatically. If the user changes the rule,
  the focused propagation in C completes its consequences.
- The ADR remains rationale and provenance; it is not an advisor artifact,
  phase, or prerequisite, and no separate source or rationale registry appears.
- A smaller decision can preserve a direct informative link without inventing
  an ADR that fails the existing record threshold.

## U. Recovering interrupted propagation

**Given.** The visibility change in C is agreed, but the session is interrupted
before all dependants have been checked.

**When.** Another session resumes without conversation history.

**Expect.**

- Affected previously accepted artifacts have `needs-review` and Review blocks
  naming the cause, changed decision passage, relevant ADR, and concrete work
  left. Transitive dependants also link the intermediate input under review.
- If the current rule has not yet been replaced, the recovery notes say that
  applying the agreed replacement is pending and link its draft or ADR.
- Existing proposed dependants remain proposed and state the changed input and
  remaining work. A bare status label is insufficient recovery information.
- The resumed session finishes the update and compatibility checks, asks any
  unresolved choices, and restores acceptance only when justified. A compatible
  document can return to accepted without changing its body.
- Review blocks are removed after successful review. The session does not end
  normally while leaving known affected documents unverified.
- No unrelated feature is marked under review merely for sharing a phase or
  foundation folder with the changed decision.

## V. Phase coverage cannot be counted from markers

**Given.** Every artifact in a feature's Architecture folder is accepted, but
`feature-failure-behavior` has neither an answer nor a dismissal.

**When.** The advisor assesses phase completion.

**Expect.**

- It reads the catalog and relevant artifacts and reports missing coverage;
  accepted markers alone do not make the phase complete.
- Once compatible accepted answers cover all questions, a separate unrelated
  proposed extension does not withdraw that coverage.
- If a current answer instead becomes needs-review after an agreed change,
  dependent readiness and the coverage using it cannot be claimed until checked.
- Reports name questions and supporting passages without persisting a second
  coverage index.

## W. Accepted absence becomes applicable

**Given.** Frontend was closed by an accepted `absent.md`. A changed capability
now includes a client-visible surface.

**When.** The session propagates the agreed change.

**Expect.**

- It reviews the blanket dismissal, writes the newly needed decisions, and
  amends or removes the replaced absence artifact.
- It never leaves both accepted blanket absence and contradictory accepted
  surface behavior. It checks affected contracts and implementation decisions.

## X. An explicit conversation handoff

**Given.** The active conversation contains context needed to continue the work.

**When.** The user explicitly invokes Matt Pocock's separately installed
`handoff`, optionally naming the focus of the next conversation.

**Expect.**

- The handoff is written to the operating system's temporary directory, outside
  the project, as
  [ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md) records. No
  project file is created for it, and initialization created no handoff
  directory.
- It links to persisted information instead of copying it and redacts
  sensitive data.
- In a guided project it names the decisions settled in the conversation but
  not yet written to their artifacts, suggesting a grill-with-docs session to
  record them, and leaves work that can wait to `deferred` issues, as
  [ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
  records.
- No advisor skill or delivered document creates, discovers, or closes a
  handoff, and `advisor-agents.md` names no handoff location.
- No project file cites the handoff. A fresh conversation reads only the
  handoff the user identifies.

## Y. Documentation during ordinary code work

**Given.** An existing export implementation produces JSON. Documentation may
be absent, may specify a new CSV capability, or may contradict the implementation.

**When.** The user requests a code change.

**Expect.**

- Code establishes the implemented behavior. Missing documentation alone creates
  no requirement to change or document that behavior.
- For a documented capability that is not implemented, the agent uses the
  relevant accepted decisions to guide the requested implementation. Acceptance
  establishes settled intent, not evidence that the capability already exists.
- An explicit discrepancy whose intended resolution is not established is
  surfaced to the user. The agent preserves the implementation while clarifying
  the intended change and assumes neither a bug nor outdated documentation.
- Reading applicable documentation alone triggers neither a session nor a phase
  assessment. An already-settled request does not need a second approval.
- Documentation-derived conclusions cite supporting passages and disclose unread
  material that could affect them; ordinary work produces no full reading
  inventory or unrelated coverage report.

## Open decisions

Settled decisions belong in the contracts or ADRs, not in this list.

| ID | Flow | Unsettled question |
| --- | --- | --- |
| D6 | J | Does a permitted derogation need an explicit marker distinct from contradiction? |
| D7 | K | Must renamed or split features record lineage and rewrite every reference? |
| D10 | M | Should an artifact record the documentation standard against which it was written? |
| D11 | E | Beyond release verification, what checks the instruction chain in an existing project without treating init success as that evidence? |

## Unresolved compatibility checks

The original proposals in A and D describe artifact acceptance in terms of
whole-phase coverage. Before accepting those scenarios, distinguish individual
artifact acceptance from phase completion under the current documentation
model. This note preserves that unresolved difference without changing the
proposed examples. The existing D6, D7, D10, and D11 remain open.

## Provenance

Migrated from the former advisor repository, `docs/product/interaction-flows.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. The specifications describe the advisor
product; installed `advisor-*.md` files govern its use in this repository.
