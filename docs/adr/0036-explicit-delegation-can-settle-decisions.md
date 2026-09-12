---
status: accepted
---

# Explicit delegation can settle decisions

The user may explicitly delegate a decision to the agent. A choice made within
that delegation counts as settled and can be accepted without a later user
ratification, subject to the usual compatibility and decision-input checks.
The user confirmed this while reviewing `docs/advisor-docs.md` on 2026-09-11.

Requiring the user to ratify every delegated choice would preserve direct
review but make delegation insufficient to settle a decision. The chosen rule
lets the user assign that responsibility to the agent. Choices made without
the user's agreement or outside the delegation remain proposed. Asking for a
recommendation alone does not delegate the decision.

This refines the account of agent-made decisions in
[ADR-0028](0028-skills-declare-their-own-applicability.md); its skill-routing
decision remains in force. Accepted delegated choices can support downstream
work, so withdrawing this acceptance basis later would require reviewing those
dependencies rather than merely changing interview wording.

The current Product rule is in
[Non-goals](../product/overview.md#non-goals); its artifact interpretation is in
[the documentation model](../architecture/documentation-model.md#visible-document-markers-and-decision-references).
