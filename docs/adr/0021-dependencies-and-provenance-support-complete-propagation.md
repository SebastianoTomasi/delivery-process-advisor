---
status: accepted
---

# Dependencies and provenance support complete propagation

Artifacts that rely on other artifacts' decisions declare `## Dependencies`
after Scope. Each bullet links to the relevant decision passage and explains
what relies on it and why. Important decisions keep reasons, alternatives, and
informative sources in ADRs managed by `advisor-domain-modeling` during
`advisor-grill-with-docs`; current artifacts state the rules and link to those
records. Smaller decisions may link their informative sources directly.

This extends the non-binding source rule in
[ADR-0008](0008-sources-inform-and-never-bind.md). Updating or deleting a source
changes no accepted rule or status automatically. Provenance identifies what
may deserve reconsideration; a rule changes only through a deliberate decision.
ADRs remain neither phases nor prerequisites.

## Consequences

A substantive accepted change is a focused session that identifies the changed
decision, traces direct and transitive dependants, resolves new choices with
the user, and applies the determined consequences until affected documents are
coherent. Dependency links aid discovery; semantic review and searches for
related terms and passages still catch missing links. Neither a dependency
database nor a separate rationale or change registry is introduced.

Before replacing an agreed rule, affected accepted artifacts whose compatibility
is unverified receive `**Status:** needs-review` with `## Review` after
Dependencies, or Scope when no Dependencies exist. Review names the cause,
changed decision passage, relevant ADR when present, and concrete remaining
work, including intermediate dependencies under review. If the replacement
itself is pending at interruption, the note says so. Proposed dependants stay
proposed and record their changed inputs and remaining work.

This state supports interruption, not normal session closure. A resumed session
finishes the update and verification, clears Review, and restores acceptance;
a compatible document may be accepted unchanged. The rejected alternative of
ending after marking dependants stale would leave the propagation to the user,
which is precisely the work the advisor is meant to carry through.
