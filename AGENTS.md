# Project instructions

Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).

## Regenerating the installed advisor

When committing or pushing a change that touches `src/`, run
`node bin/init.mjs` from the repository root first, and include every resulting
change to the installed advisor in that same commit. Regenerating is not needed
while iterating on `src/`; do not update the installed copy by hand.

<!--
This file is the project's own, not the advisor's. It was created because the
project had no agent instruction file when the advisor was installed, and it
holds nothing but the directive that makes the advisor reachable. Everything
else in it is yours to write, and no later delivery will touch what you add.
-->
