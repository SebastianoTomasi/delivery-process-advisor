---
status: accepted
---

# Artifacts open with a routing envelope

Every artifact has a descriptive filename and title, its lifecycle marker, and
then a short `## Scope` section stating what it governs and which nearby concern
it leaves elsewhere. This small common envelope lets an agent use a bounded
opening read to judge relevance without loading every artifact body, while the
rest of each document keeps the structure natural to its subject.

## Consequences

An agent still opens a file to inspect its first lines; the optimization is the
amount brought into context, not a promise to infer content from a filename.
Artifacts missing the envelope remain identifiable by their marker but do not
satisfy the advisor's document shape until it is added.
