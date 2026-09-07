---
name: advisor-grill-with-docs
description: Conduct an advisor-grill-with-docs session — one question at a time, writing what settles into the project's own documents as it settles. Use when writing, filling in, or accepting a normative document under docs/ (product, architecture, implementation, frontend, security, deployment, operations, development, stack), when declaring or advancing a feature, when asked what work comes next, or when pressure-testing a plan or design whose outcome the project should keep.
disable-model-invocation: false
---

Run an `advisor-grill-me` session, invoking the `advisor-domain-modeling`
skill as terms or qualifying decisions settle. Advice alone requires reading,
not an interrogation or a write.

When called by `advisor-migrate-docs`, apply the writing, acceptance, and
propagation procedures below within that skill's scope. Decisions in inputs
the user identifies as current specifications are already settled; ask only
unresolved choices needed for their migration. Report unrelated catalog gaps
as later work instead of starting a general design interview. The migration
skill owns input replacement and cleanup.

Follow the reading path in `advisor-agents.md`. Read the applicable authority
boundary and only the project or feature catalog for the current work. Where
those catalogs are separate files, never load both merely because they share an
authority. Use `docs/advisor-docs.md` for statuses, dependencies, and readiness;
do not infer readiness from a folder or a proposed artifact alone.

## Advice

For requested or recommended work, identify the specific decision, its owner,
and its necessary accepted inputs. Read those passages and their Dependencies,
and any relevant Review blocks. Separate phase coverage from ready decisions.
When several actions are ready, recommend one with a reason and name useful
alternatives; use the usual phase order when there is no stronger reason.
Explain why still-open choices cannot invalidate a decision proposed ahead of
that order. If the input is unknown, proposed, under review, or cyclic, explain
the missing or coupled choice rather than claiming readiness. Do not equate
absence of a recorded dependency with proof of independence.

## Writing and accepting

For a new feature, follow the "Starting a feature" procedure in
`docs/features/advisor-features.md` before the first write.

1. Place the content per the "Starting a document" rule in
   `docs/advisor-docs.md`: reuse an artifact whose `Scope` owns it, or create
   the minimum new one. This choice is autonomous and may be revised when later
   answers require it.
2. Ask one decision-critical question at a time and write each answer as it
   settles into the artifact where it naturally belongs. Questions measure
   coverage; they do not become the document layout.
3. Keep each artifact under one authority. Link decisions owned elsewhere and
   write new cross-authority decisions in their owning artifacts, at project
   scope when shared or feature scope when specific. Maintain Dependencies with
   passage links and explanations, not just navigation links. For a substantive
   screening answer, link its authoritative answer and settle any input needed
   now; use handoffs only for work that can wait.
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

## Propagating an accepted decision change

A wording-only correction can be applied directly after checking that it changes
no meaning, dependency, or scope. A change to a term, capability, contract,
prerequisite, or other accepted rule starts a focused session:

1. Identify the owning decision and passage, the reason for the change, and the
   proposed replacement. While the replacement is only a proposal, preserve the
   accepted rule; a separate draft names the passage it proposes to replace.
2. Trace direct and transitive dependants by reading Dependencies and searching
   artifact references to the changed path, headings, and terms. Inspect likely
   related routing envelopes as well: missing links are possible, so search
   results are candidates for semantic review, not a complete dependency graph.
   Include shared rules, affected features, screening answers, and dismissals.
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
