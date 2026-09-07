---
status: accepted
---

# Agent behavior must have an operational home

Every behavior required of a target agent must appear once in delivered content
the agent reaches before performing that action. Root instructions select the
workflow and shortest reading path, the documentation router defines the common
artifact contract, authority scaffolds define local boundaries, selected
catalogs define progression and questions, and the grill-with-docs skill
defines writing and acceptance procedure. Design documents and ADRs in the
advisor repository explain the product but do not count as agent instructions.

## Consequences

Rules are assigned by when and where they are needed rather than collected in
one large prompt. Routing summaries may deliberately repeat enough detail to
choose the next document, but operational procedures have one authoritative
home so short instructions do not drift.
