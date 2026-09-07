---
description: Deliver the advisor payload into a target project
argument-hint: <target-project-root>
allowed-tools: Bash(node:*)
---

Run the advisor installer against the target root given in `$ARGUMENTS`.

If no root was given, pass none: the installer delivers to the repository the
session is working in and names it in its report. Do not ask for a root, and do
not substitute one you derived yourself.

Run exactly this, and nothing else — with `--target "<root>"` when a root was
given, and with no arguments at all when none was:

```
node "${CLAUDE_PLUGIN_ROOT}/bin/init.mjs" --target "<root>"
```

Then relay the report as the script printed it — which files were written,
which were appended to, which were skipped. Do not summarize it away.

Write, rename, or repair nothing yourself. The script is the only thing that
touches the target, and a file it reports as skipped is a file the advisor has
deliberately left alone.
