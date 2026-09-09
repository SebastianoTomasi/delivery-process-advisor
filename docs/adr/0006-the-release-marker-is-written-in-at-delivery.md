---
status: deprecated
---

# The release marker is written in at delivery

Retired on 2026-09-07 at the user's direction. The current
[payload contract](../architecture/initialization.md#the-payload) omits release
markers and content substitution. Repeated version lines consume agent context
without helping the ordinary reading task; version information remains in the
plugin manifest and delivery report. Per-file release identification is given
up deliberately. The former decision is preserved below for its rationale.

Payload assets contain `{{release}}` at their version marker, and the helper
replaces only that token with the delivered release. No other content or
destination depends on the target.

Central substitution avoids silent stale markers during a release bump while
keeping delivery deterministic. Delivered assets are verified after applying
the same substitution rather than by byte comparison with `src/`, and an
unreplaced token is deliberately a loud failure.
