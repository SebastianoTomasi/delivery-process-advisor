# Implementation

## Boundary

**Owns:** Significant, non-obvious implementation design inside clients,
servers, local applications, CLIs, and jobs.

**Includes:** Internal state and history representations, serializers, local
and remote persistence, algorithms, adapters, transaction mechanics, and
background execution. These are representative, not exhaustive. Document only
decisions whose reasoning, correctness, or failure mechanics cannot be recovered
readily from code; do not inventory classes, functions, or every endpoint.
Code, migrations, and generated interfaces own exact signatures.

For example, what Undo does for the actor belongs to Frontend; choosing document
snapshots or inverse operations to implement its history belongs here. A
guarantee exposed across a component boundary remains Architecture's.

**Excludes:** Client-visible behavior, owned by Frontend; the selected
technology inventory and versions, owned by Stack; and contracts whose
alternatives are observable outside one unit, owned by Architecture.

**Scope:** Project-scoped artifacts here hold shared conventions and defaults
that later features inherit; they are demand-driven and not part of the
foundation. A feature's concrete realization belongs in
`docs/features/<feature-slug>/implementation/`; its progression and questions are in
[the feature catalog](advisor-implementation-feature.md). A direct project-wide
Implementation decision may start an artifact here without a screening question.

## Catalogs

Open the boundary above for placement, then only the catalog required by the
current action:

- [Project-scoped Implementation catalog](advisor-implementation-project.md)
- [Feature-scoped Implementation catalog](advisor-implementation-feature.md)

The two catalogs are separate context boundaries. Do not load both merely
because they belong to the same authority.
