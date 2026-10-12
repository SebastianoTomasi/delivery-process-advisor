# Product description

**Status:** accepted

## Scope

This artifact governs the advisor product's goals, actors, capabilities,
success criteria, and non-goals across guided projects, including this
repository when it deliberately uses the advisor. The vocabulary is defined
in [`GLOSSARY.md`](../../GLOSSARY.md). Architecture owns the persisted document
model and delivery contracts; Development owns the acceptance scenarios.

## The problem

Taking a software project from an idea to documents precise enough to make
implementation unambiguous requires a known sequence: define the product, fix
the language, decide the architecture, and design the realization. The general
process exists, but it is neither explicit nor available to an AI during
development.

The consequences are ordinary:

-   one does not know which work makes sense right now, and picks it by  
    intuition;
-   one does not follow the best practices of software design;
-   one designs on top of decisions that were never made, and finds out late;
-   one corrects a document and the documents that rested on it stay behind, with  
    nothing signalling it.

The cost is not slowness: it is that the work looks complete while resting on  
foundations that changed or were never established.

## The user

A single person holding both roles: they develop and they lead the project.  
They have no analyst preparing documents for them and no project manager  
telling them what comes next. They need an interlocutor who knows the process,  
not a tool that imposes it on them.

## What it does

1.  **Places every feature in the process.** It reconstructs from the project’s  
    files which phase questions are covered and which decisions are ready.
    Different features, and decisions within one feature, may progress at
    different rates.
2.  **Prescribes the next action.** A dedicated read-only workflow states the
    work that makes sense now and why. It can recommend the nearest decision
    that unblocks useful work, the smallest end-to-end implementation slice once
    its necessary constraints are settled, a repair for demonstrated failure,
    verification when uncertainty changes the choice, or a focused improvement
    once the primary product journey is verified. If several actions are ready it
    recommends one and explains useful alternatives.
3.  **Explains blockers.** It says what a piece of work lacks in order to make  
    sense, walking up the prerequisites to the first one that can be resolved  
    immediately.
4.  **Defers and recovers future work.** Deferred work is kept as
    `deferred` issues in the configured tracker and considered when
    recommending work, starting or resuming a session, or breaking work into
    tickets. A question, idea, or other future concern is recorded directly,
    stating what to revisit, why it can wait, and when. Relevant
    issues resurface before decisions that depend on them. Recovery
    distinguishes work ready now, work still waiting, and work already answered
    or superseded. Items retain an open/closed lifecycle and link to
    authoritative answers. A Product non-goal creates no deferred item unless
    there is also something to reconsider later.
5.  **Transfers an active conversation.** On explicit request, Matt Pocock's
    separately installed `handoff` compacts the context needed to continue the
    current work into a temporary file outside the project, which the user
    identifies to a fresh conversation. In a guided project it also names the
    decisions settled in the conversation but not yet written to their
    artifacts, and leaves work that can wait to deferred issues. No project
    file cites it, and the advisor does not discover, prioritize, or close
    handoffs. [ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md)
    records why handoffs left the repository.
6.  **Propagates corrections.** When an artifact changes, it identifies those
    that rested on the changed decision and updates them. Wording-only edits
    can be applied directly; substantive changes run a focused session that
    settles new choices and completes propagation. Important decisions preserve
    their reasons and sources in ADRs. `needs-review` with cause, changed passage,
    relevant ADR, and remaining work supports interruption, not normal closure.
7.  **Migrates existing documents.** On request, `migrate-docs` transfers
    selected documents into the advisor structure, resolving only choices
    needed for the migration. It verifies fidelity, coherence, and dependencies,
    reports missing decisions as later work, and replaces the in-scope originals
    without redundant copies. Existing informative references retain their role
    and may be relocated as the sole source copy; replaced specifications are
    not archived as sources. Specifications identified as current carry settled
    decisions, while artifact acceptance still requires verification.

A phase is complete when accepted, compatible artifacts address every question
it owns and no unresolved input needed by that coverage remains. Accepted
markers alone cannot establish coverage, and an unrelated proposal does not
withdraw existing accepted decisions. The scaffolds that separate the parts of
the design, and the scope-specific
catalogs that enumerate those questions and state how to work through them, are
the product.

## The shape of the process

The process runs vertically, on features, over a foundation kept deliberately
thin. Its concrete representation, ownership rules, and decision readiness are
specified in the
[guided project documentation model](../architecture/documentation-model.md).

**The foundation is Product and Architecture, project-scoped, over the language
of `GLOSSARY.md`.** Feature work may begin and its decisions may be accepted before
the foundation is complete when their necessary inputs are accepted and
compatible, and the remaining open foundation choices cannot invalidate them.
The foundation still needs accepted coverage of all its catalog questions to
be complete. Shared implementation conventions, the default frontend surface,
the stack, a security policy — each is
project-scoped, and each is written when a feature first needs it, governing
the work that follows rather than blocking what came before. Being
project-scoped is therefore not the same as being a prerequisite of every
feature.

**A feature holds its artifacts together**, one folder per owning authority,
created only with its first artifact. The usual route is Product, Frontend,
Architecture, Implementation. Frontend sharpens the visible behavior; Architecture
fixes contracts; Implementation captures significant internal design across
clients, servers, local applications, CLIs, and jobs. The visible behavior of
Undo belongs to Frontend; its internal history representation to Implementation.

**Readiness belongs to decisions.** The usual order guides discovery, but does
not forbid an advisor recommendation ahead of a whole unfinished phase. Accepted
export content and rules may suffice to design its file contract while the
launch screen is undecided, if that screen cannot change the contract. The
advisor explains the accepted basis and checks the remaining choices. It never
treats a proposed or needs-review input as settled.

**Each question catalog expands its scope into a decision sequence.** The macro
order suggests the usual route; the detailed progression says which
questions become answerable first inside that work — for example, a feature's
Frontend phase moves from surface applicability to entry points, user flow,
states, and input rules. These are not smaller phases and create no additional
state. They make the interrogation order visible while completion still means
that every question owned by the phase has been answered or dismissed.

**Authority and scope are independent.** Security, Deployment, Operations,
Development, and Stack have no phase of their own. Screening questions expose
their needs at the point their inputs normally become known. Shared rules live
at project scope; a rule or procedure for only one feature lives under that
feature's owning authority. For example, a manual recovery procedure for an
interrupted CSV import belongs in the feature's Operations folder. The feature
links to shared rules without copying them. Acceptance addresses the triggered
need, not every possible question in the authority's catalog.

Security illustrates the distinction: Product owns actors and data obligations,
Architecture owns trust boundaries and enforcement placement, and Security owns
control requirements at their actual scope. It introduces no additional phase,
although an unresolved control can be a necessary input to a particular decision.

## Form

The system consists of **versioned scaffolds, question catalogs, templates,
skills, and instruction files**, together with the helper that delivers them
into a project. It works through the project's own repository. Documentation
sessions, tickets, implementation, and handoffs run through Matt Pocock's
`grill-with-docs`, `to-tickets`, `implement`, and `handoff`, and the advisor's
own procedures use his `grilling` and `domain-modeling`. These are installed
separately rather than delivered; the delivered instructions state the
advisor's rules for them, as
[ADR-0044](../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
records.

The division is between delivery and judgement:

-   **The delivery helper establishes what it delivers.** It writes the
    scaffolding and can import an optional template, resolving each asset to its
    destination and reporting what it wrote, what it replaced, and what it  
    left alone. This has to be  
    exactly right, and it is small enough to be verified directly.
-   **The agent decides everything else**, following the delivered
    instructions and skills. It reads the project’s artifacts and
    implementation evidence, assesses and recommends next work, places each
    feature in the process, conducts grill-with-docs sessions, and completes
    propagations. This needs reading and judgement.

The agent reads documented state through relevant artifact envelopes,
dependency links, recovery blocks, and decision passages. Next-work advice
starts from current goals and delivery evidence, deepening discovery where it
can change the recommendation. It does not require a complete documentation
inventory. The agent checks catalog coverage semantically before claiming a
phase is complete.
There is deliberately no command that returns the phase, the first unaccepted
prerequisite, or the authority that
owns it: placing a feature in the process is a reading like any other, and it  
fails the way a reading fails rather than the way a program does. Correctness
therefore depends on the agent's reading and judgement.

Initialization is the helper alone. It writes the scaffolding whole and
nothing else, so there is no selection to make and no judgement to exercise;
a later session may import a useful template under the name it agrees on or
create an artifact directly. The helper is a plugin, reachable by name from
any project; the advisor's own skills are payload and travel with the project
they guide.
Sessions use the catalogs actually present in that project. Delivering the
skills locally does not guarantee that a later initialization leaves every
installed file compatible. The delivery contract is specified in
[Initialization](../architecture/initialization.md).

## Delivery compatibility

Initialization brings everything it delivers to the invoked release, replacing
what occupies one of its own destinations, removes from both skill hosts every
registered advisor-owned skill or legacy `advisor-` entry the release no
longer delivers, and preserves what the project
owns. Elsewhere it may still leave files from an older release beside them,
wherever a later payload no longer delivers to that path, and it promises no
compatibility with what it did not touch. It neither verifies release
uniformity nor removes that remainder. The per-destination behavior and its
limits are owned by
[Initialization](../architecture/initialization.md#deliberate-exclusions).

A project that edits a delivered scaffold in place loses that edit at the next
delivery. The delivered files are the advisor's, and a project shapes the
process through its own documents rather than by rewriting the scaffolding it
was given.

Successful initialization means the delivery operations completed under their
rules, replacing occupied advisor-owned destinations and reporting the
project's own as skipped. It does not certify
that pre-existing files or links work or that an agent can follow the entire
instruction chain. The exact reference check in project instruction files
remains required by [Delivery rules](../architecture/initialization.md#delivery-rules).

## What it knows

The system knows the **project files and configured issue tracker**.
Documentation establishes settled intent; code and focused verification
establish what is implemented. Open `deferred` issues preserve future
work, its context, and when to revisit it. A session records an agreed deferral
in the tracker shared with `to-tickets`. Deferred issues inform the work;
accepted answers remain in the owning normative artifacts. What is not known
from the conversation or project evidence is asked rather than invented.

The representation and recovery contracts for
[deferred items](../architecture/documentation-model.md#deferred-items) and the
place of
[session handoffs](../architecture/documentation-model.md#session-handoffs)
belong to Architecture. Their separation is recorded in
[ADR-0030](../adr/0030-deferred-items-and-session-handoffs-are-distinct.md), and
the move of handoffs outside the project in
[ADR-0043](../adr/0043-general-skills-come-from-matt-pocock.md).

Among the project files are the **sources**: informative material retained in a
`sources/` folder for a session to read — know-how, an external
specification, a description of a system being replaced, or an experiment's
report and results. Where the folder sits is what states which work the
material is relevant to, and a session
reads the folders on the path to what it is doing, judging from each file's
name and opening lines whether to read it whole. A source carries no accepted
project decision and cannot settle a rule by itself.

The advisor defines where experiment material is stored and found. The agent
carrying out the experiments manages their conduct and lifecycle. The placement
contract is in
[Sources](../architecture/documentation-model.md#sources).

## Rules

-   The system **advises, it does not bind**. The user may proceed otherwise at  
    any moment, and nothing is recorded when they do. The advice comes back  
    only because the state of the project still implies it, which is the only  
    form of insistence the system has.
-   An `accepted` status binds the system’s reasoning, not the user.
-   **Code establishes what is implemented.** Existing behavior absent from the
    documentation creates no obligation to change or document it. Accepted
    documentation guides the work it specifies that is not yet implemented;
    acceptance records settled decisions, not evidence of implementation.
    When code and documentation explicitly contradict one another, or a ticket
    or request contradicts an accepted decision, surface the discrepancy before
    acting on it and preserve the implementation while clarifying the intended
    change with the user. The mismatch alone establishes neither a bug nor
    outdated documentation. Apply the consequences once the direction is
    settled. [ADR-0032](../adr/0032-code-establishes-implemented-behavior.md)
    records this distinction.
-   **A working product comes before optional polish.** Until the primary user
    journey is supported by concrete implementation evidence, advice favors the
    smallest end-to-end slice that satisfies the established Product behavior
    and applicable constraints. It requires only accepted inputs capable of
    invalidating that slice, not completion of every earlier phase. Once the
    primary journey works, explicit user goals, broken or incomplete observable
    behavior, and ready deferred work outrank minor improvements. A material
    security, safety, or operational risk may take priority at either stage.
-   How critical a change is follows from **what** changes — a term, a  
    capability, a prerequisite, an artifact with open decisions downstream — not  
    from a judgement made in the moment.
-   **Initialization writes the scaffolding and nothing else.** The  
    scaffolding is the exception that proves the rule — it decides nothing, so  
    writing all of it costs nothing and gives the project its map. A document  
    that decides something is not created in advance, and a template is not  
    written before the session that names it.
-   **A question that does not apply is dismissed in writing.** A phase's
    artifacts, taken together, address every question it owns; those without
    substance
    in this project are answered with a line saying so. A whole phase a feature  
    has nothing to decide in is closed the same way, by an artifact that says  
    so. Silence is never read as inapplicability.
-   **Material informs, it does not decide.** A source binds nothing. What it  
    holds constrains later work only once an authority's artifact says so in  
    the project's own words, and a source contradicting an accepted artifact  
    becomes a question rather than an override — so every rule the project  
    follows is one an authority owns and a session accepted. Deleting every  
    source changes no rule the project holds. ADRs preserve the reasons and
    informative source links for important decisions; current artifacts link to
    them. A source correction can prompt reconsideration without automatically
    changing an accepted rule.
-   **A proposal leaves current decisions in force.** Initial foundation work
    needs accepted catalog coverage. Later drafts do not reopen that foundation
    globally. An agreed change reviews and updates affected decisions and their
    transitive dependants while unrelated work remains usable.

## Success criteria

-   **Accuracy, checkable by reading.** Phase coverage and recommended actions
    match the current accepted rules, actual dependencies, and available
    implementation evidence. The advisor names the passages and checks supporting
    readiness, explains any anticipation of the usual phase order, and discloses
    what it could not verify, so the user can check the conclusion instead of
    trusting it. Nothing mechanical enforces this.
-   **Outcome, observable downstream.** Two independent implementers reading
    the final accepted documents for the same not-yet-implemented scope produce
    functionally equivalent systems:
    the same entities, boundaries, and observable behavior. Residual
    differences in signatures, names, and style remain the concern of the code.

## Non-goals

-   **It does not impose the process.** There are no blocks, mandatory approvals,  
    or unavoidable steps.
-   **It is not a project status dashboard.** It produces advice, not reporting.
-   **It does not synchronize every task.** It reads and writes only
    `deferred` issues for future-work recovery; implementation tickets
    remain owned by the configured tracker and `to-tickets`. Mail and meeting
    integrations are outside the product.
-   **It does not model customers, engagements, or deliveries.** The domain is  
    the process by which the project matures, not the commercial relationship  
    surrounding it.
-   **It does not invent artifacts in the user’s place.** It writes only to
    propagate confirmed corrections or to record the decisions, requirements,
    and intent established with the user, including choices the user explicitly
    delegates to the agent. A choice within that delegation is settled and can
    be accepted without subsequent user ratification once the usual acceptance
    conditions hold. A choice made without the user's agreement or outside
    their delegation remains proposed. A session is the ordinary way to
    establish decisions and the one the advisor recommends; the same acceptance
    rules apply to a document written another way.
    [ADR-0036](../adr/0036-explicit-delegation-can-settle-decisions.md) records
    the delegation decision.

## Provenance

Migrated from the former advisor repository, `docs/product/overview.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. The specifications describe the advisor
product; installed `advisor-*.md` files govern its use in this repository.
