---
status: accepted
---

# Feature path identity is a confirmed slug

Each feature directory is identified by a user-confirmed lowercase ASCII
kebab-case slug matching `[a-z0-9]+(?:-[a-z0-9]+)*`. The agent proposes the
slug from the agreed readable feature name and waits for confirmation before
the first write; readable names remain in artifact titles and prose.

Path identity must stay stable because artifacts, handoffs, records, and prose
may link to it. An exact existing slug therefore resumes that feature. The
agent never invents a numeric suffix to avoid a collision: a genuinely
different capability receives a different explicitly agreed slug.

## Considered Options

Using the readable feature name directly was rejected because casing, spaces,
diacritics, and filesystem rules would make paths host-dependent. Generating a
unique suffix automatically was rejected because it can silently turn a
request about an existing feature into a second feature. Assigning opaque IDs
was rejected because paths are part of navigation and should remain meaningful
to a reader.

## Consequences

Renaming or splitting a feature is an explicit path migration rather than an
ordinary wording edit. A session proposing a new feature must inspect exact
slug collisions and obtain confirmation before creating its Product artifact.
