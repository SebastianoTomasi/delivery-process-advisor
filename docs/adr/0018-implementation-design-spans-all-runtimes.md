---
status: accepted
---

# Implementation design spans all runtimes

Implementation replaces the Backend authority and uses `docs/implementation/`.
It owns significant, non-obvious internal design in clients, servers, local
applications, CLIs, and jobs. Frontend retains visible behavior; Architecture
retains contracts observable across unit boundaries. This supersedes
[ADR-0001](0001-observability-separates-architecture-from-backend.md) while
preserving its observability test.

The former server-only boundary left client implementation decisions without
a clear owner. For Undo, Frontend specifies the visible behavior and
Implementation records the choice between snapshots and inverse operations.
Expanding Frontend to own both would mix the promise with the private mechanics.
Implementation is not an inventory of code: exact signatures, migrations, and
obvious details remain in code and generated interfaces.

## Consequences

Fresh payloads deliver the renamed boundary and project/feature catalogs.
Existing target files are not migrated by initialization; upgrade remains
separate work. The server-specific `backend-shared-conventions` and
`backend-persistence-defaults` question names are retired in favor of broader
`implementation-*` questions, with the mapping retained in the project catalog.
The new `feature-internal-state` question covers significant client or local
state choices without changing the identity of existing feature questions.
