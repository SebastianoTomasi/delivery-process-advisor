---
status: superseded
superseded_by: ADR-0016
---

# Feature question catalogs live with their phase authorities

`docs/features/advisor-features.md` is a lightweight router for feature shape,
phase order, and lifecycle. The Product, Frontend, Architecture, and Backend
authority scaffolds each hold their own feature phase's progression and question
catalog beside their project-scoped catalog. Screening questions remain beside
the phase where they first become answerable and name their cross-cutting owner.
This preserves one shared catalog for every feature while letting a session
load only the current phase and its precise authority boundary.

## Considered Options

Keeping every feature question in one central scaffold preserved a single
reading surface but required a session to load all four phases before working
on one. Relying on partial reads of that large file made the intended context
boundary dependent on tool behavior. Copying catalogs into feature directories
was rejected because copies could drift between features and releases.

## Consequences

The feature router and four authority scaffolds form one disclosure chain.
Changing a phase catalog changes its authority scaffold, while changing phase
order or routing changes the feature router. Cross-cutting authority scaffolds
link to the phase catalog containing each screening question rather than
duplicating it.
