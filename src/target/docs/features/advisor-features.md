# Features

This page is the routing scaffold for feature work. It is held once for the
whole project and defines how a feature begins, how its phase is derived, and
which authority boundary and phase catalog to open. It contains no phase
question catalog: each feature phase has its own file in that authority's
directory, so working on one phase does not load the other phases or the
project-scoped catalog of the same authority.

## Starting a feature

A feature is a user-observable capability of the product, declared by writing
its first feature-scoped Product artifact. It rests on the accepted foundation
— the project-scoped Product description and Architecture shape — and nothing
else.

When the user begins to describe a capability that has no feature folder,
agree a project-meaningful feature name. Propose a lowercase ASCII kebab-case
slug matching `[a-z0-9]+(?:-[a-z0-9]+)*` and wait for the user to confirm it
before the first write. Keep the readable name in artifact titles and prose;
the slug is the feature's stable path identity.

If `docs/features/<feature-slug>/` already exists, resume that feature. Never
invent a numeric suffix to avoid a collision: a genuinely different capability
needs a different explicitly agreed slug. Write the first proposed Product
artifact under `docs/features/<feature-slug>/product/`. That single write
creates the feature and opens its Product phase. Do not create an empty feature
folder or any later authority folder in advance.

## What a feature folder holds

```
docs/features/<feature-slug>/
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

Nothing delivered by the advisor is ever written inside a feature's folder, so
what is there is this project's own work. Each authority folder appears with
its first artifact. Its presence shows documentation in that authority, not
completion of a phase or of any previous phase. Authorities outside the four
feature phases may also hold feature artifacts; they introduce no new phases.

### Closing a phase with no decisions

Before closing a phase with `<authority>/absent.md`, read its entire feature
catalog and check every question against the relevant accepted decisions,
including screening questions owned by other authorities. Write Scope and an
explicit dismissal for each question's slug, explaining why no decision is
needed. If existing coverage supports a dismissal, link its accepted answer
and record the dependency. Accept the absence only when every dismissal is
supported and no necessary input remains unresolved.

A negative applicability answer may support these dismissals but never replaces
the full check. A phase needs no dedicated applicability question to use this
procedure. If any question has substance, use a normal artifact and link answers
owned elsewhere; do not declare the whole phase absent. Read available evidence
before asking the user and ask only unresolved decision-critical questions,
not one interview question for each catalog entry.

## Phase order and reading route

For the phase being worked on, open the small authority boundary and only its
feature catalog. The boundary decides what belongs there and is read, never
inferred from the folder name; the catalog supplies that phase's progression
and complete question list.

1. **feature Product** — `docs/features/<feature-slug>/product/` —
   [Product boundary](../product/advisor-product.md) +
   [Product feature catalog](../product/advisor-product-feature.md)
2. **feature Frontend** — `docs/features/<feature-slug>/frontend/` —
   [Frontend boundary](../frontend/advisor-frontend.md) +
   [Frontend feature catalog](../frontend/advisor-frontend-feature.md)
3. **feature Architecture** — `docs/features/<feature-slug>/architecture/` —
   [Architecture boundary](../architecture/advisor-architecture.md) +
   [Architecture feature catalog](../architecture/advisor-architecture-feature.md)
4. **feature Implementation** — `docs/features/<feature-slug>/implementation/` —
   [Implementation boundary](../implementation/advisor-implementation.md) +
   [Implementation feature catalog](../implementation/advisor-implementation-feature.md)

Use this order as the usual route. Derive coverage and ready decisions using
`docs/advisor-docs.md`, then read the chosen authority boundary and its feature
catalog with the relevant accepted inputs and sources. Several phases can have
work underway, and several decisions can be ready. Recommend one action with
its basis, while naming useful ready alternatives. Read another catalog only
when assessing or working on that other scope; do not load them all by default.

An absent phase folder means no artifact for that phase has been written, not
that every later decision is premature. Accepted coverage remains valid when a
new, unrelated proposal is added, including at foundation scope.

## Completing a phase

The linked feature catalog groups its questions by decision dependency. Those
groups guide one session and are not subphases: they create no folders, markers,
or state of their own.

A phase is complete when accepted, compatible artifacts together address every
question in its catalog and no unresolved input needed by that coverage remains.
Read all artifacts in the folder to distinguish unrelated proposals from missing
coverage or affected rules; statuses alone do not establish completion.
A question with no substance in the feature is answered by one explicit
dismissal naming its slug. Silence is not an answer.

Some catalogs include **screening questions** owned by Security, Deployment,
Operations, Development, or Stack. They stay beside the phase where they first
become answerable and are marked with their owning authority. Their normal
answer is a dismissal only when existing coverage actually applies. For a
substantive answer, use the owning authority's boundary and demand-driven
questions. Shared rules belong at project scope and feature-only decisions in
that feature's authority folder. Link the authoritative answer and explain the
dependency in the screening artifact. A missing shared document is not evidence
of coverage. A deferred item is for later work, not an unresolved current
prerequisite.

When accepted applicability changes, review `absent.md` as part of propagation:
amend its dismissals or remove it when replaced, so an accepted blanket absence
cannot contradict new accepted decisions.
