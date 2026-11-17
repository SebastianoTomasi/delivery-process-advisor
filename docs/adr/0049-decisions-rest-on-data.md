---
status: accepted
---

# Decisions rest on data

Before recommending an answer to a decision that turns on a fact, such as a
number, a limit, a cost, or how an external system or library behaves, the
agent looks for that fact in the code, the documents, and the sources. A fact
that is missing, or stated without a source, is researched thoroughly in
primary sources first. The findings are kept as a source, and a fact the
research does not find is written as an estimate or an assumption, with what
would verify it.

The user chose this on 2026-11-17. Until then the advisor said where a research
result is kept and that a source informs without binding, but nothing said when
to look for one. [Product](../product/overview.md#what-it-knows) required only
that what is unknown be asked rather than invented, which fits a preference and
not a fact: the user often does not hold the number either, so an agent asked
for a recommended answer could supply a plausible value from memory, and an
accepted artifact would then carry it as settled.

Three choices shape the rule:

- **Research comes before the recommendation, even for a fact that seems too
  specific to the project to be found.** Writing the assumption down without
  searching was the cheaper alternative. It was rejected because whether such a
  fact can be found is known only after looking.
- **The cost is bounded by scope, not by skipping the search.** Research costs
  time and tokens, so it is limited to the facts that could change the choice,
  a choice that depends only on what the user wants needs none, and it stops
  when further searching is unlikely to change the answer. Running it in a
  subagent, where the host offers one, keeps the session's context for the
  decision.
- **It is advice, not a gate.** The user may decide before or without the
  research, as [Product rules](../product/overview.md#rules) already promise
  for every other advice.

## Consequences

- The rule lives in [Product rules](../product/overview.md#rules). The root
  file states it in full, because a recommendation can be made in any session,
  including the ones separately installed skills run, and the root is the one
  file every session reads.
- Research findings are sources under
  [ADR-0008](0008-sources-inform-and-never-bind.md): they bind nothing by
  themselves, and the artifact that records the decision states it and cites
  them.
- No acceptance rule changes. A decision the user settles on an assumed fact is
  settled, and its artifact says which fact is assumed.
- The rule names no model and no host, because the payload serves two skill
  hosts ([ADR-0007](0007-the-payload-serves-two-skill-hosts.md)).
