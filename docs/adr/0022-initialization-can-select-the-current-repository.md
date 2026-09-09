---
status: accepted
---

# Initialization can select the current repository

The former initialization and repository-boundary contracts required an
explicit target root, while the copied helper and README permitted an implicit
one. During migration on 2026-09-07, the user chose the helper's behavior as the
contract so the documentation reflects the implementation they brought forward.

An explicit target wins. Otherwise the helper chooses the nearest ancestor
containing `.git`, falling back to the current working directory, and announces
that selection before writing. The current rule is owned by
[Initialization](../architecture/initialization.md#target-selection).

## Considered Options

Retaining explicit-root-only selection and recording the helper as discrepant
was offered; the user selected automatic target selection instead.

## Consequences

The helper can write to a target without a target argument. Invocation context
therefore affects the destination, and the pre-write announcement is part of
the contract. Existing write-if-absent, instruction-reference, failure, and
idempotence guarantees continue to apply. No default feature is introduced.

## Sources

The user's migration answer on 2026-09-07 selects the behavior in
`bin/init.mjs` (`currentRepositoryRoot`, `parseArguments`, and the pre-write
report). The former explicit-root rule was recorded in
`docs/architecture/initialization.md` (Inputs and outputs) and
`docs/architecture/repository-boundaries.md` (No ambient target), commit
`a44529ff21d8999619f81dc934f1d20078aea0a5` of the former repository.
