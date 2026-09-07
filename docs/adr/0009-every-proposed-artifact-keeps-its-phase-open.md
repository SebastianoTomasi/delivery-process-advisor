---
status: superseded
superseded_by: ADR-0020
---

# Every proposed artifact keeps its phase open

A phase remains open while any artifact in its directory is `proposed`, even
when its catalog questions are covered elsewhere. This keeps phase state
derivable from files and marker lines alone; creating a proposed artifact in a
completed phase therefore reopens that phase until the artifact is accepted.
