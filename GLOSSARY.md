# Guided delivery process

This context names the process by which a guided project’s decisions and
normative documents mature. Its language applies to guided targets, including
the advisor repository when it uses its own process.

## Language

**Project**  
The unit of work whose decisions and normative documents the advisor guides. Artifacts, decisions, and sessions belong to a project.

**Target project**  
A project receiving and using the advisor process. The advisor repository can itself be a target when the user deliberately applies the process to it.

**Payload**  
The versioned advisor content delivered into a target project: scaffolds, question catalogs, optional templates, skills, and instruction assets. It is distinct from the helper that delivers it.

**Delivery helper**  
The advisor component that resolves destinations, writes delivered assets, and reports the result. It is distinct from the skills that exercise judgement.

**Destination**  
A path in a target project that the delivery helper takes one decision about. Every destination comes from the fixed payload mapping, which identifies owned skill entries in both hosts through registered names and the legacy `advisor-` prefix; a path the mapping does not name is never inspected.

**Advisor-owned destination**  
A destination whose content the advisor defines and brings to the invoked release at every delivery: the mirrored scaffolds and catalogs, the root file, and the skill entries identified by registered names or the legacy `advisor-` prefix in both hosts, which the release either delivers or removes. A project’s local edits to one are not preserved.

**Project-owned destination**  
A destination the advisor may create but whose content belongs to the project: the instruction file. Delivery ensures it and never replaces what it holds. Legacy deferred and handoff directories are preserved without being mapped.

**Artifact**  
A normative document recording a guided project’s decisions, with one owning authority, a scope, and a lifecycle status. It is the kind of document on whose accepted decisions other work can rely.
_Avoid_: file, note, deliverable

**Template**  
A shipped starting structure for a recurring kind of artifact, containing no project decision. It is optional and distinct from the artifact a session writes using it.
_Avoid_: form, blueprint, boilerplate

**Scaffold**  
Fixed advisor content that establishes the documentation structure, states ownership boundaries, or routes work. It carries no project decision or artifact lifecycle status.
_Avoid_: index, structure, skeleton

**Question catalog**  
A fixed advisor enumeration of questions and a recommended decision sequence for one scope or feature phase. It records no project decisions and is distinct from the artifacts answering its questions.
_Avoid_: checklist, questionnaire, question register

**Source**  
Material that informs a session but is not owned by the project as a rule. It has no authority, artifact status, or prerequisite role; the owning artifact states any decision adopted from it.
_Avoid_: background, attachment, context file

**Reading path**  
The smallest set of documents and relevant passages needed for an advisor action. It includes the semantic evidence needed for the action, rather than merely a folder or marker inventory; it is distinct from the citations and material reading gaps reported to the user.

**Instruction path**  
The delivered chain through which an agent reaches the rules and procedures needed for an action. Design descriptions of the advisor product are distinct from this operational instruction chain.

**Simulator**  
The agent role in an instruction audit that approaches a user request with the information available in the target project and exposes the instruction path it follows. It is distinct from the role evaluating and correcting the advisor's instructions.

**Reviewer**  
The agent role in an instruction audit that uses the simulator's observations and the advisor's design to identify defects and improve the payload. It is distinct from the agent experiencing the target project's instructions.

**Initialization**  
Delivery of the fixed advisor scaffolding, skills, and instructions into a target. It establishes the process without creating the project’s decisions or importing optional templates.
_Avoid_: bootstrap, setup, project creation

**Import**  
Bringing an optional template into a project when a session needs it. Import is distinct from initialization and from accepting the resulting artifact.
_Avoid_: install, add, copy

**Authority**  
The area owning a class of project rules, such as Product or Architecture. Ownership depends on the decision’s subject and is independent of project or feature scope.
_Avoid_: area, section, domain

**Scope**  
The breadth of an artifact’s rule: shared across a project or specific to a feature. Scope alone does not establish a decision prerequisite.
_Avoid_: level, granularity, applicability

**Foundation**  
The project-scoped Product and Architecture decisions that features rest on, expressed in the project’s resolved language. Other shared artifacts are distinct from this deliberately thin foundation.
_Avoid_: baseline, core documents, common layer

**Status**  
An artifact’s lifecycle position: proposed for a draft, accepted for settled compatible decisions, or needs-review for previously accepted work whose compatibility with a change remains unchecked. A later proposal does not itself withdraw existing acceptance.
_Avoid_: artifact phase, state

**Decision dependency**  
A link to a decision in another artifact together with the reason a local rule relies on it. Navigation and provenance links alone are not decision dependencies.

**Readiness**  
The condition in which accepted decision inputs suffice for a particular action and remaining open choices cannot invalidate it. It is distinct from whole-phase completion.

**Open decision**  
A recognized but unresolved choice owned by one authority. An artifact cannot be accepted while its own necessary decisions remain open.
_Avoid_: TODO, question, loose end

**Grill-with-docs session**  
A structured exchange, in rounds of numbered questions each with a recommended answer, that extracts missing decisions and writes answers, resolved terms, and qualifying records as they settle. It is started by Matt Pocock's `grill-with-docs` or by a request to write, fill in, or accept a document, and follows the session procedure in `docs/advisor-docs.md`. A session changing an accepted rule includes its propagation.
_Avoid_: interview, analysis session, review, grill session

**Decision record**  
A document preserving a consequential decision, its reasons, and relevant alternatives. It is distinct from the normative artifact owning the current rule and is not itself an artifact prerequisite.
_Avoid_: rationale, history

**Handoff**  
A temporary document that preserves the conversation context needed for a fresh agent session to continue the same work. It is kept outside the project, so no project file cites it; it does not keep project history or queue work for an unspecified future.
_Avoid_: deferred item, checkpoint

**Deferred item**
A project-owned issue labelled `deferred` for a question, idea, or other future work that can wait beyond the next session, stating what to revisit, why it can wait, and when to revisit it. It is distinct from an unresolved current input and from a Product non-goal; a non-goal creates no deferred item unless there is also something to reconsider later.
_Avoid_: handoff, backlog, deferred idea

**Ticket**  
A self-contained unit of implementation work produced through `to-tickets` from a plan, specification, conversation, or feature documentation for a system outside the advisor to build, naming the tickets that must complete before it. Once written it belongs to that system; it is distinct from an artifact and a handoff, and one published in a deferred breakdown, labelled `deferred`, is also a deferred item.
_Avoid_: deferred issue, task

**Feature**  
A user-observable product capability represented by its feature-scoped artifacts. It begins with the first Product artifact and has an agreed identity rather than being merely an empty directory.
_Avoid_: epic, module, vertical slice

**Feature slug**  
The stable, user-confirmed path identity of a feature, in lowercase ASCII kebab-case. It is distinct from the readable feature name used in titles and prose.
_Avoid_: folder name, feature ID, display name

**Prerequisite**  
An accepted decision input needed for a particular action to be ready. An earlier phase position, proposed input, or input needing review does not by itself satisfy it.
_Avoid_: gate

**Question**  
A named completeness probe owned by an authority and enumerated in a catalog. Its name identifies its stable meaning; its number gives presentation order.
_Avoid_: check, criterion, requirement

**Phase**  
A grouping of related questions in the Product or Architecture foundation, or a feature’s Product, Frontend, Architecture, or Implementation work. Completion means compatible accepted answers or dismissals cover those questions without unresolved necessary inputs.
_Avoid_: stage, step, milestone

**Next action**  
The recommended bounded piece of decision or implementation work whose necessary accepted inputs suffice. Several actions can be ready at once, and readiness is distinct from the usual phase order; early implementation favors the smallest end-to-end slice that makes the product work.
_Avoid_: task, next step

**Screening question**  
A question exposing a need owned by Security, Deployment, Operations, Development, or Stack during feature work. Its substantive answer belongs to that authority at the actual project or feature scope.
_Avoid_: checklist, gate, review question

**Dismissal**  
An explicit answer naming a question and explaining why it has no substance for the work. It counts as an answer, while silence does not.
_Avoid_: N/A, skip, not applicable

**Propagation**  
The focused work that restores consistency after an accepted decision changes, including affected transitive dependants. Needs-review notes support interruption and recovery rather than replacing that work.
_Avoid_: documentation refactoring, alignment, cascade

**Advice**  
The advisor’s indication of which work is worth doing now and why. It informs the user’s choice without imposing permission or recording a departure merely because the user chooses differently.
_Avoid_: rule, constraint, block, approval
