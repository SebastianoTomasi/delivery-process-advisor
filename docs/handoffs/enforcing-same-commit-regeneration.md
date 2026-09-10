# Enforcing same-commit regeneration mechanically

**State:** open
**Scope:** project
**Destination:** development
**Revisit when:** ready now; it waits only on the user choosing between the CI
gate alone and adding a pre-commit hook beside it.

Decide what mechanically enforces the rule that this repository's installed
copy is regenerated in the same commit as a payload change, and write that
outcome into
[repository-workflow.md](../development/repository-workflow.md), beside
Release verification, rather than leaving it only in a workflow file.

## Why it can wait

The rule itself is accepted and already holds: it is stated in
[repository-boundaries.md](../architecture/repository-boundaries.md#self-application)
and reasoned in
[ADR-0029](../adr/0029-initialization-replaces-advisor-owned-destinations.md).
Nothing is currently out of sync. What is missing is only what catches the
next lapse, and the last one went unnoticed for two commits.

## What was already established

The user asked for a GitHub Action that regenerates and commits automatically.
That was argued against and not chosen: a bot commit arriving after the
developer's is by definition a different commit, so it delivers "eventually
consistent" rather than the accepted "never inconsistent", and it additionally
needs branch write permission, races the developer's next push, and re-triggers
itself without a guard.

Three options remain on the table:

- **CI gate (recommended).** Run the tests, run `node bin/init.mjs`, then
  `git diff --exit-code`. It writes nothing, cannot fight the developer for the
  branch, and makes an unregenerated tree impossible to merge. As a side
  effect every push re-proves that delivery is idempotent in bytes, which is
  the property the whole replace-instead-of-skip contract now rests on.
- **A versioned `pre-commit` hook** in `.githooks/`, enabled once per clone
  with `git config core.hooksPath .githooks`, that regenerates and stages the
  result. This alone realizes "same commit" literally rather than blocking the
  merge afterwards. Its cost is that staging files the author did not stage is
  surprising, and that selecting the right paths means encoding the delivery
  mapping a second time — the same duplication this decision exists to remove.
  Reading the destinations back from the helper's own report would avoid that
  duplication but makes the hook depend on the report's line format.
- **Both**, with the hook as convenience and the gate as the guarantee.

## Facts a later session should not re-derive

- Re-running `node bin/init.mjs` on commit `121006f` produces no diff at all.
  The gate depends on this and it currently holds.
- The test command is `node --test test/init.test.mjs`, and the suite passes
  30 of 30 at that commit. The directory form `node --test test/` fails,
  because it treats the helper `test/fixtures/filesystem-fault.mjs` as a test
  file; a workflow written with that form would be red for the wrong reason.
- There is no `package.json`, so there is no `npm run` entry point; the local
  command is `node bin/init.mjs` as written.
- There is no `.github/` directory yet, so the workflow would be the first.
- There is no `.gitattributes`. The author works on Windows with
  `core.autocrlf=true`, so the working tree mixes LF and CRLF while the
  committed blobs are LF. A Linux runner therefore compares cleanly today by
  luck rather than by construction: one payload file committed with CRLF would
  make the gate fail with nobody at fault. Adding `* text=auto` should be
  settled together with whichever option is chosen.
- The work this record came out of is committed on the branch
  `feat/replace-advisor-owned-destinations` at `121006f`, not yet merged into
  `main`.
