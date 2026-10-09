---
status: accepted
---

# Skills declare their own applicability

The rule below that no delivered instruction file names the skills was reversed
by [ADR-0044](0044-the-advisor-states-its-rules-for-matt-pococks-skills.md) for
skills the advisor does not own, which the root now names where their behavior
in a guided project differs. The advisor's own skills still declare their
applicability, and the rest of this decision stands for them.

No delivered instruction file names the skills. Each skill states in its own
delivered description when it applies, and both hosts load those declarations
before the agent acts, so repeating that routing in `advisor-agents.md` would
put a duplicate in every session's context and create a second place to drift.
The user chose this on 2026-09-10, after confirming that Codex surfaces skill
declarations the way Claude Code does.

This refines [ADR-0015](0015-agent-behavior-must-have-an-operational-home.md)
rather than replacing it. Every behavior still has one operational home reached
before the action that needs it; the home for which skill owns an action is now
the skill's own declaration instead of the root instruction file.

## Alternatives and consequences

Keeping the routing sentences was rejected as a duplicate of content the host
already supplies. Moving them to a file read later was rejected because the
choice of skill has to be available before the work starts, which is the
condition ADR-0015 imposes.

A declaration says when a skill applies; it cannot say that an action may not
be taken without it. That rule therefore stays in `advisor-agents.md`, stated
without naming any skill: a document records the decisions the user
established, and whatever an agent settled in their place is proposed rather
than accepted. What acceptance requires stays in `docs/advisor-docs.md`. No
gate is introduced — the product still
[imposes no unavoidable steps](../product/overview.md#non-goals) — and a
document written outside a session is answered with a status, not a refusal.

That account of agent-made decisions was later refined by
[ADR-0036](0036-explicit-delegation-can-settle-decisions.md): a choice within
explicit user delegation can be accepted without later ratification. This
changes the authority summary, while leaving this ADR's routing decision intact.

Instruction routing now rests on host behavior the payload cannot verify when
it is delivered. A host that ignores skill metadata leaves the skills installed
and unreachable while every destination check still passes, so
[release verification](../development/repository-workflow.md#release-verification)
gains a per-host check that the declarations are actually surfaced. The cost of
this decision is that dependency; its benefit is one authoritative statement of
when each skill applies, carried by the skill itself.
