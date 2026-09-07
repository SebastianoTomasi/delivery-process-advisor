---
status: superseded
superseded_by: ADR-0019
---

# Context boundaries follow file boundaries

Product, Frontend, Architecture, and Backend each have three advisor-owned
files: `advisor-<authority>.md` for the semantic boundary,
`advisor-<authority>-project.md` for project-scoped progression and questions,
and `advisor-<authority>-feature.md` for feature-scoped progression and
questions. A feature route points directly to the boundary and feature catalog;
a project route points directly to the boundary and project catalog. The agent
loads the boundary and exactly one catalog for the current work.

This refines the distribution chosen in ADR-0014. Keeping the two catalogs as
sections of one authority scaffold made a Markdown fragment look like a context
boundary, but a fragment is only a navigation hint. File-reading tools do not
portably interpret it as a selective-read contract, and a model may therefore
receive the other scope's progression and questions. Separate files make the
intended context boundary visible and enforceable without depending on a host's
range-reading behavior.

## Considered Options

Keeping both catalogs in one file and relying on heading anchors or explicit
line ranges was rejected because it depends on the tool and on the agent using
it correctly. Adding a parser or CLI command that extracts a section was
rejected because every session would gain a runtime dependency for a boundary
the repository can express directly. Repeating the authority boundary in both
catalog files was rejected because the copies could drift.

Project-only authorities retain their sole demand-driven catalog in their
boundary scaffold. They have no competing feature catalog to exclude, so
splitting them would not solve the scope-mixing problem addressed here.

## Consequences

The feature router and instruction path must link to catalog files rather than
heading fragments. Boundary changes touch one file; question or progression
changes touch the corresponding catalog. Initialization delivers all three
files together and release versioning keeps them aligned. The layout adds eight
files, but a session no longer loads project questions during feature work,
feature questions during project work, or unrelated feature phases merely to
reach the selected catalog.
