---
status: superseded
superseded_by: ADR-0019
---

# A feature begins with its first Product artifact

A feature is declared when the user begins to describe a new user-observable
capability and the session writes its first proposed Product artifact. That
write creates `docs/features/<feature-slug>/product/` atomically; no separate command
creates an empty feature, and later authority folders appear only when their
phases open. This keeps directory presence readable as process state and avoids
both untracked empty directories and phases that appear to have opened before
any project decision exists.

## Considered Options

An explicit `feature create` command was rejected because it would either leave
an empty directory that Git cannot preserve as state or would have to invent an
artifact name and shape before the session knows its subject. Creating every
authority folder at once was rejected because folder presence is the signal
that a phase has opened.
