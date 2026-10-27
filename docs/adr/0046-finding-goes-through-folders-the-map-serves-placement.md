---
status: accepted
---

# Finding goes through folders; the map serves placement

Until 2026-10-27 the root file told agents to locate documentation by selecting
the owning authority in `docs/advisor-docs.md` and reading its boundary. An
[analysis of 296 sessions across seven guided projects](../sources/experiments/2026-10-26-agent-docs-navigation/report-navigazione-advisor.md)
found that agents did so before their first document in about one session in
ten, reached the right documents by searching inside area, feature, and ADR
folders in one to three commands, and opened the common rules mostly when a
skill or a writing task needed them. Entering through the common rules costs
several thousand tokens before any document is seen; a search inside a folder
costs a few hundred. The user chose to describe the route that works: finding
goes through the folders, whose names already carry subject and owner, and the
common rules serve placement and coverage. A search that finds nothing falls
back to the boundary file or the authority table, which covers the one risk of
searching, a subject documented in other words.

The same analysis found that two documents in five were read only in slices,
without their routing envelope, so a proposal could be used as if accepted.
Rather than asking agents to navigate differently, the root now states when the
envelope must have been read: before a passage becomes an input to planning,
building, reviewing, or an answer about what the project decided.

## Consequences

- `docs/advisor-docs.md` keeps its role as the common contract and its size;
  it is not reshaped into an index, since the folder layout already is one.
- The envelope rule lives with document interpretation, next to the rule that
  proposals establish no accepted inputs, not with navigation.
- Whether the written rule suffices, or a search tool that prints each hit's
  envelope is needed, is decided by measuring again; the deferred issue in the
  configured tracker holds that question.
