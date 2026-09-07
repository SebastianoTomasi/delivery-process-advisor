---
status: accepted
---

# Sources inform and never bind

Non-process material may live at `docs/sources/`,
`docs/<authority>/sources/`, or
`docs/features/<feature-slug>/<authority>/sources/`. A session reads source
folders on the path to its work, but a source binds nothing; only an accepted
artifact can turn its content into a project rule.

Giving sources authority or status would bypass ownership and acceptance.
Deleting all source folders must therefore change no rule the project holds.
The trade-off is deliberate: correcting a source does not propagate to
artifacts, relevance is judged at read time, and broadly placed sources can add
noise to every session. Pre-existing documentation may be used this way
without being mistaken for accepted advisor content.
