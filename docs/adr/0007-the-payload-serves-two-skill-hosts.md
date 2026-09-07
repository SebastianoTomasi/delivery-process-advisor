---
status: accepted
---

# The payload serves two skill hosts

Although the helper installs as a Claude Code plugin, it delivers each skill to
both `.claude/skills/` and `.agents/skills/` and ensures a host-specific
reference to `advisor-agents.md` in both instruction files. `CLAUDE.md` uses
`@advisor-agents.md`; `AGENTS.md` explicitly tells Codex to read and follow the
linked file rather than relying on that import syntax being portable.

Initialization is a maintainer action, but the resulting project must expose
its process regardless of the host a later contributor uses. The fixed fan-out
preserves deterministic delivery; its accepted cost is two skill copies that
can drift if a target edits only one.
