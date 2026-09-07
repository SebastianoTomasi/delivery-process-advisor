---
status: accepted
---

# The release marker is written in at delivery

Payload assets contain `{{release}}` at their version marker, and the helper
replaces only that token with the delivered release. No other content or
destination depends on the target.

Central substitution avoids silent stale markers during a release bump while
keeping delivery deterministic. Delivered assets are verified after applying
the same substitution rather than by byte comparison with `src/`, and an
unreplaced token is deliberately a loud failure.
