---
status: accepted
---

# Shared guidance and workflows have distinct homes

The session procedure this decision gave to `advisor-grill-with-docs` was moved
by [ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md)
into `docs/advisor-docs.md`, and the root now names the cases where separately
installed skills behave differently in a guided project, including when
deferred work is recovered; `advisor-defer` no longer exists. The rest of the
division of homes remains current.

Keep shared document interpretation, navigation, selective reading, and concise
evidence reporting in `advisor-agents.md`. Common documentation rules belong in
`docs/advisor-docs.md`, local boundaries in authority scaffolds, and decisions,
dependencies, and recommended order in catalogs. Skills own repeatable
procedures and their detailed reports, applying those rules and catalogs.
Next-work assessment is a read-only workflow distinct from the
`advisor-grill-with-docs` session that conducts user-chosen documentation work.
The root retained one cross-cutting trigger to recover deferred work before
advice or a session; that clause was later revised by
[ADR-0035](0035-deferred-recovery-belongs-to-the-workflows.md), which moved the
obligation into the workflows themselves. `advisor-defer` owns the recovery
procedure in either case.

The user chose this boundary while reviewing the root file because session
preparation, feature creation, reading instructions, and documentation rules had
become mixed across it and its destinations. Giving procedures one home lets
ordinary work use the documentation without inheriting a session or phase
assessment. The root retains a brief authority summary so direct artifact reads
are informed, while full definitions remain in the common rules.

The next-work split keeps choosing work separate from performing it. Its workflow
may recommend a decision, the smallest ready implementation slice, or a later
improvement, but it changes no files and starts no session. Once the user chooses,
the host routes that new request to the applicable workflow.

This supersedes the allocation in
[ADR-0015](0015-agent-behavior-must-have-an-operational-home.md), preserving its
requirement that every behavior has a reachable operational home. Skill
applicability remains in skill descriptions under
[ADR-0028](0028-skills-declare-their-own-applicability.md).

## Alternatives and consequences

Putting the whole reading procedure in every skill would duplicate shared
guidance. Keeping preparation and advice procedures in the root would load
them for work that does not need them. Requiring the common rules file before
every direct artifact read would avoid a summary but add an unnecessary read.
Keeping next-work advice inside `advisor-grill-with-docs` would make a read-only
request appear to enter the session used to establish and record decisions.
Leaving deferred recovery only to individual workflows was judged, at the time
of this decision, to make the same cross-cutting prerequisite easier to omit;
the root repeated the trigger but not the procedure. ADR-0035 later accepted
that alternative.
The chosen split permits brief interpretation and routing summaries, not
duplicate procedure definitions.

Root-level evidence reporting cites supporting passages and material unread
inputs; workflow-specific coverage mappings stay in their owning skills. Catalog
order expresses decision dependencies: the next-work skill recommends an action
from the actual state, while the grill-with-docs skill chooses the next useful
question within work the user selected. Local advisor files can explain a
project's conventions; the upstream repository remains the home of broader
rationale.

The current contract is in
[the documentation model](../architecture/documentation-model.md#the-root-file).
