---
status: accepted
---

# Code establishes implemented behavior

[ADR-0047](0047-code-is-read-before-documentation.md) later replaced the
neutral default below: for behavior that may already exist the agent now reads
the code before the documentation, and when the two contradict each other it
proposes bringing the documentation in line with the code unless the user
confirms the documentation as the intended direction. The rest stands.

Code is the source of truth for what is implemented. Accepted documentation
guides the work it specifies that is not yet implemented; acceptance establishes
settled intent, not implementation. Undocumented existing behavior creates no
automatic obligation to change it or document it.

The user clarified this distinction when considering how the root instructions
should guide ordinary code work. A blanket requirement to make code follow the
docs would treat incomplete documentation as a complete account of the system.
Automatically declaring the docs outdated would also discard valid intent.
When both cover the same behavior but contradict each other, the agent instead
surfaces the discrepancy and preserves the implementation while the intended
change is clarified. The mismatch alone proves neither a bug nor stale docs.

This applies the existing distinction between the user's authority and accepted
decisions to implemented systems. It introduces no implementation status,
automatic synchronization, or extra approval for a direction already settled.
The current behavior belongs to [Product rules](../product/overview.md#rules);
the documentation model defines how its root instructions expose that rule.
