---
status: accepted
---

# A skill is one role with an independent trigger and a complete outcome

A procedure becomes its own skill when the user can state its occasion without
first describing another procedure, and when what it produces stands on its own.
A procedure that has an occasion of its own but whose outcome depends entirely
on another skill stays with that skill, and its contract is written in the
artifact that owns the subject.

The user chose this test while `advisor-grill-with-docs` had grown to five
procedures: session preparation, feature declaration, writing and acceptance,
closing a phase with no decisions, and change propagation. A session writing a
product document therefore also carried the rules for propagating a change
through every dependant. The cost was not the tokens, which were modest against
the rest of a session's reading, but that a skill declaring four unrelated
occasions gives the host nothing precise to select on and gives a reader no way
to tell what the skill is for.

Applying the test extracts change propagation into its own skill and keeps
feature declaration where it was: declaring a feature produces nothing until its
first Product artifact is written, and writing it is the session.

## Considered Options

Extracting propagation into a reference file inside the same skill would have
reduced what each session loads at no routing cost. It was rejected because a
reference file divides loading and not roles: the skill would have gone on
declaring four occasions, which is the part that was actually unclear.

Applying "one skill, one thing" literally would have produced five skills from
one. Every declaration is injected into every session and near-duplicate
declarations compete during selection, so the cost of splitting grows with the
number of skills rather than their size. The trigger-and-outcome test stops the
division where the roles actually differ.

## Consequences

The test governs skills added later, not only this split. A procedure failing
the second condition has a place to go — the artifact owning its subject — so
failing the test never leaves a procedure unwritten.

Reachability and description cost are load-bearing for this decision, so the
release check that each host surfaces the declarations remains necessary.

The current rule is in
[Skill boundaries and composition](../architecture/skill-boundaries.md#what-makes-one-skill).
