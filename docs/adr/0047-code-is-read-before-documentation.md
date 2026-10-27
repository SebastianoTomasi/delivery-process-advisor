---
status: accepted
---

# Code is read before documentation, and documentation follows code by default

[ADR-0032](0032-code-establishes-implemented-behavior.md) made code the source
of truth for what is implemented and told the agent, when code and
documentation contradict each other, to surface the discrepancy and assume
neither a bug nor stale documentation. In practice the rule rarely fired. It
applied only once a contradiction had been noticed, and nothing told the agent
to look at the code before answering from the documents: the root file's
reading guidance covered `docs/` alone. An agent asked about existing behavior
therefore read the artifacts, never opened the code, and on 2026-10-27 the user
reported being told things the code had since replaced.

Two things change. For behavior the project may already have, the agent reads
the code first, then the documentation, and answers from both, so a
contradiction is found where it exists. And when the two contradict each other
and the user has said nothing about which is intended, the default is that the
code is the current state: the agent proposes bringing the documentation in
line with the code. It still changes no document on its own and still treats
the contradiction alone as no bug; the user may instead confirm the
documentation as the intended direction, and the accepted decision then guides
the change to the code.

ADR-0032 chose the neutral default so that incomplete documentation would not
be read as a complete account of the system and valid intent would not be
discarded. Both concerns remain covered: the user still decides, and an
accepted decision still guides unimplemented work. What the neutral default
cost was an agent that, told to prefer neither side, presented the documented
version as current.

## Consequences

- The rule lives in [Product rules](../product/overview.md#rules); the root
  file and `docs/advisor-docs.md` restate it at routing depth.
- Grill-with-docs preparation reads the code of a capability the project
  already has, so the session asks only what the code leaves open.
- Reading the code first is a reading order for behavior that may already
  exist, not an inventory: for work not yet implemented the accepted decisions
  remain the spec.
