---
name: advisor-grill-with-docs
description: Conduct an advisor-grill-with-docs session — one question at a time, writing what settles into the project's own documents as it settles. Use when writing, filling in, or accepting a normative document under docs/ (product, architecture, implementation, frontend, security, deployment, operations, development, stack), when declaring or advancing a feature, when propagating an agreed change through an accepted rule and its dependants, or when pressure-testing a plan or design whose outcome the project should keep.
disable-model-invocation: false
---

Use an `advisor-grill-me` session to resolve open decisions, invoking the
`advisor-domain-modeling` skill as terms or qualifying decisions settle.
Invoke `advisor-defer` to record agreed future work and to recover relevant
items before starting or resuming a session. That skill owns clarification,
capture, classification, recovery, partial progress, and closure under
`docs/deferred/`.

## Preparation

Before starting or resuming a session, recover relevant deferred items through
`advisor-defer`, including undecided destinations. Read `docs/advisor-docs.md`
for document rules and use the shared reading guidance in `advisor-agents.md`
to find the relevant artifacts and sources. Read the owning authority's boundary
and only the catalog for the current scope or triggered need. Use its decisions,
dependencies, and recommended order with the answers already settled to select
the next useful question. Complete those relevant reads before the first session
question. Migration owns full reads of its selected inputs and invokes this
workflow for decisions.

## Starting a feature

Read `docs/features/advisor-features.md` for feature identity, placement, and
phase routes. When the user describes a new capability, first agree its readable
name and propose a slug under those rules; obtain confirmation before the first
write unless already supplied. If that identity exists, resume the feature.
Then check the relevant accepted foundation inputs before writing the first
proposed Product artifact at the feature's Product path. That write creates the
feature; create other authority folders only with their first artifacts. Apply
the common readiness rules when necessary inputs remain unresolved: explain the
missing decision and offer to settle it first. If the user proceeds without it,
keep the resulting work proposed and name the unresolved assumption.

## Writing and accepting

For new features, use Starting a feature above before the first write.

1. Apply the placement and artifact-boundary rules in `docs/advisor-docs.md`.
   Inspect existing routing envelopes and reuse the artifact whose Scope owns
   the content; otherwise create the minimum new artifact with a descriptive
   name, proposed status, and Scope. Choose a structure suited to its subject.
   This choice is autonomous and may be revised as answers settle.
2. Ask one decision-critical question at a time and write each answer as it
   settles into the artifact where it naturally belongs. Questions measure
   coverage; they do not become the document layout.
3. Keep each artifact under one authority. Link decisions owned elsewhere and
   write new cross-authority decisions in their owning artifacts, at project
   scope when shared or feature scope when specific. Maintain Dependencies with
   passage links and explanations, not just navigation links. For a substantive
   screening answer, link its authoritative answer and settle any input needed
   now; use `advisor-defer` only for work that can wait.
4. Invoke `advisor-domain-modeling` to update resolved terms and qualifying ADRs
   as decisions settle. Important decisions keep their reasons, alternatives,
   and informative source links in the ADR; current artifacts state the rule
   and link to it. Preserve existing ADR folders and numbering.
5. Accept an individual artifact once its envelope and dependency references
   are sound, its own decisions and any triggering question are settled, and
   the necessary decision inputs are accepted and compatible. Do not require
   an authority's unused demand-driven catalog to be exhausted, or a catalog
   question for a document that belongs by its boundary. This applies at either
   scope. Individually accepted artifacts may leave a phase incomplete.
   For a coupled set, settle all choices, verify its internal consistency and
   accepted external inputs, then accept the set together; mutual draft links
   alone never justify acceptance. If writing that acceptance is interrupted,
   retain recovery notes until every member is checked and accepted.
6. Before claiming a foundation or feature phase complete, read its catalog and
   every artifact in its folder, including proposals and `absent.md`. Map each
   question to an accepted answer or named dismissal; follow linked screening
   answers and decision inputs. Check for missing coverage, contradictions, or
   dependencies under review. Accept completed drafts through step 5 before
   counting them; never infer coverage merely because all markers are accepted.
   An unrelated proposed extension does not undo existing accepted coverage.
   Report the question-to-artifact-and-passage mapping and what remains open;
   do not persist a coverage registry.

If the user chooses work without its necessary inputs, keep the result proposed
and name the unresolved assumptions. A draft that does not change a current
decision leaves that decision and unrelated feature work usable.

## Closing a feature phase with no decisions

Before writing `absent.md`, read the entire feature catalog and check every
question, including screening questions, against the relevant accepted
decisions. Apply the absence contract in `docs/features/advisor-features.md`:
write Scope and a justified dismissal for every slug, linking accepted answers
and dependencies when they support dismissal. A substantive answer requires
a normal artifact rather than blanket absence. Read available evidence before
asking only unresolved decision-critical questions; no interview question is
required for each catalog entry. Accept through the writing and acceptance
procedure above only when all dismissals and necessary inputs are sound.

## Propagating an accepted decision change

A wording-only correction can be applied directly after checking that it changes
no meaning, dependency, or scope. A change to a term, capability, contract,
prerequisite, or other accepted rule starts a focused session:

1. Identify the owning decision and passage, the reason for the change, and the
   proposed replacement. While the replacement is only a proposal, preserve the
   accepted rule; a separate draft names the passage it proposes to replace.
   A missing reason does not delay independently knowable impact discovery in
   step 2; obtain it before accepting the replacement.
2. Trace direct and transitive dependants by reading Dependencies and searching
   artifact references to the changed path, headings, and terms. Inspect likely
   related routing envelopes as well: missing links are possible, so search
   results are candidates for semantic review, not a complete dependency graph.
   Include shared rules, affected features, screening answers, and dismissals.
   Read each affected authority boundary and relevant catalog as the work reaches
   it, using the root file's selective reading guidance.
   Do not reopen unrelated phases merely because the change is upstream.
3. Explain consequences and ask only new choices that the user has not settled,
   one at a time. Apply consequences already determined by the answers without
   seeking approval for each document edit. If more decisions are coupled,
   resolve their compatible replacement together; do not accept drafts using
   each other as their only evidence of readiness.
4. When the change is agreed, use `advisor-domain-modeling` for the qualifying
   ADR, including reasons and sources, and supersede an incompatible old ADR
   through its existing format. Before replacing a current rule, mark affected
   accepted artifacts whose compatibility is not yet checked `needs-review`
   and write the Review block required by `docs/advisor-docs.md`. Link the
   changed decision and ADR when present, with concrete remaining work. If an
   interruption occurs before the rule replacement, say that applying the
   agreed replacement is still pending and link its draft or ADR. Existing
   proposed dependants stay proposed and record the changed input and work left.
5. Update the owning rule and every affected artifact, dependency link, and
   dismissal. A checked-compatible artifact may return to accepted unchanged;
   an incompatible one is amended from settled answers and then accepted. When
   more effects emerge, trace them in turn. Update or remove a replaced proposal
   or blanket `absent.md` so there is still one authoritative current rule.
6. Review the affected documents together for contradictions and unresolved
   dependencies. Recheck affected catalog coverage when an answer or dismissal
   changed. Close the session only when propagation is complete and the affected
   documents are coherent; summarize the changed rule, updated or confirmed
   documents, ADR, and resulting advice.

`needs-review` supports recovery from interruption or a user pause, not the
normal outcome. If work must stop, update each Review block with cause, changed
passage, relevant ADR, and remaining checks or decisions; report the work as
incomplete. On resumption, read those blocks and the changed decisions, finish
the propagation, then remove the recovery blocks when acceptance is justified.
Do not create another change or rationale registry.

A changed source only identifies decisions that may deserve reconsideration.
Read their ADRs and current rules, raise any substantive conflict, and use this
procedure only when an accepted decision is actually changed. Neither a source
nor an ADR status overrides a normative artifact automatically.
