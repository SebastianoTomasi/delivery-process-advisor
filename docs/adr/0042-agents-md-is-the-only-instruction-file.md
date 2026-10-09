---
status: accepted
---

# AGENTS.md is the only instruction file

Initialization ensures one instruction file, `AGENTS.md`, and no longer seeds
or appends to `CLAUDE.md`. `AGENTS.md` carries both host-specific references:
the `@advisor-agents.md` import, which Claude Code expands, and the explicit
read-and-follow directive, which Codex follows. Each reference is checked
separately, and only the missing ones are appended.

Claude Code now reads `AGENTS.md` directly and expands the imports it
contains. On 2026-10-09 a Claude Code 2.1.289 session in a directory holding
only an `AGENTS.md` loaded both its text and a file it imported. The premise
of the two-file arrangement, that neither host reads the other's instruction
file, no longer holds, and the user asked to retire `CLAUDE.md` files as
deprecated. The import is kept rather than relying on the sentence alone,
because a sentence leaves opening the file to the agent's judgement, while
the import loads it.

This changes the instruction-file part of
[ADR-0007](0007-the-payload-serves-two-skill-hosts.md), which skill-host
decisions had otherwise already superseded. Skill delivery to both hosts is
unchanged.

## Alternatives and consequences

Keeping a `CLAUDE.md` that only imports `AGENTS.md` would load the same
instructions twice. Using the sentence alone would make Claude Code's access
to the advisor depend on the agent opening the file. An existing `CLAUDE.md`
is the project's own and is left untouched: projects delivered by earlier
releases keep theirs until a maintainer moves its import into `AGENTS.md`.
Codex sees the import line as plain text, which is harmless.
