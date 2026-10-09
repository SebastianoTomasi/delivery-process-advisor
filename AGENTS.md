# Project instructions

@advisor-agents.md

Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).

## Regenerating the installed advisor

When committing or pushing a change that touches `src/`, run
`node bin/init.mjs` from the repository root first, and include every resulting
change to the installed advisor in that same commit. Regenerating is not needed
while iterating on `src/`; do not update the installed copy by hand.

## Reinstalling the plugin after a push

Claude Code detects a plugin update only through the `version` in
`.claude-plugin/plugin.json`: after a push that leaves it unchanged, the update
reports the plugin as already up to date and the installed copy stays as it
was. Before each push, raise the patch version there (for example `0.2.0` →
`0.2.1`), unless the pushed commits already raise the version, as a release
does.

After pushing, update the Claude Code plugin installed on this machine, so that
`/delivery-process-advisor:init` delivers what was pushed:

```sh
claude plugin marketplace update delivery-process-advisor
claude plugin update delivery-process-advisor@delivery-process-advisor
```

Running sessions keep the version they loaded until `/reload-plugins` or the
next launch.

<!--
This file is the project's own, not the advisor's. It was created because the
project had no agent instruction file when the advisor was installed, and it
first held nothing but the references that make the advisor reachable.
Everything else in it is yours to write, and no later delivery will touch what
you add.
-->
