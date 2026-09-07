---
status: accepted
---

# Authority boundaries repeat at routing and local depth

Authority ownership is described twice by design. `docs/advisor-docs.md`
contains enough detail to route an agent to the right directory without opening
every scaffold; the authority's own scaffold gives the more precise inclusion,
exclusion, and scope rules used to place a document. This accepts controlled
repetition and its drift risk in exchange for navigability from the root of the
documentation.

The local boundary is semantic rather than a closed catalog of artifact types.
It states what the authority governs, what belongs elsewhere, representative
but non-exhaustive examples, and the distinction between project and feature
scope, so new document types remain placeable without amending the scaffold.
Every authority scaffold presents that detail first in a short `Boundary` block
with `Owns`, `Includes`, `Excludes`, and `Scope`, allowing a bounded read before
the agent decides whether it needs progression or questions.

## Consequences

The central description is a routing summary rather than an independent
boundary. Changes to an authority's ownership must update both levels, while
close cases are resolved by the local scaffold. An example illustrates the
boundary but never becomes the test for admission.
