# Working on the advisor repository

**Status:** accepted

## Scope

This artifact governs the distinction between authoring advisor product source
and following installed instructions, plus the inherited release-verification
obligation. Architecture owns payload paths, delivery behavior, and the
self-application contract. This is not a complete branching or test strategy.

## Dependencies

- [Repository boundaries](../architecture/repository-boundaries.md#documentation-and-product-source)
  and [self-application](../architecture/repository-boundaries.md#self-application)
  — contributor practice must keep released source distinct from the installed
  process that guides this repository.
- [Skill hosts](../architecture/initialization.md#skill-hosts) — release
  verification must establish that the declared destinations are actually found.
- [Failure behavior](../architecture/initialization.md#failure-behavior) —
  installer checks distinguish concise operational diagnostics from program
  defects while preserving the same stop-on-error and recovery guarantees.
- [Delivery outcomes](../architecture/initialization.md#inputs-and-outputs) —
  successful delivery and actual host reachability require separate evidence;
  skipped destinations are not certified by a zero exit result.
- [Handoffs](../architecture/documentation-model.md#handoffs) — release checks
  must cover the fixed empty directory without treating it as an artifact or
  duplicating the skill-owned protocol.

## Product source and active instructions

Treat every file under `src/` as product data to author and edit. Do not follow
its skills, prompts, scaffolds, or templates as instructions for this session.
Do not place or symlink the `src/skills/` source tree into the repository's
active skill directories. Neutral source filenames keep inspection from
activating those files as instructions.

The root instruction files and deliberately installed advisor files govern
work here. Installed skills belong to that deliberate self-application;
they do not turn the source tree into an instruction directory. Keep changes
to product source and changes to the installed process distinct.

Material explicitly withheld from agent access requires user authorization
before reading. Its presence alone supplies neither access authorization nor
an accepted design input. Non-normative material cannot override project rules.

## Release verification

Verify the declared host skill paths against each host's own documentation at
each release. A wrong path can deliver every file, load none of the skills,
and still report success. The `.agents/skills/` destination therefore cannot
be treated as verified merely because delivery succeeded.

Check that each host can reach the delivered skill through a newly created
relative directory symlink. Inspect the filesystem to verify that a `linked`
outcome exposes the canonical files through a relative target. Move an isolated
test project with its directory layout intact and verify that both host paths
still reach the same files. Exercise a failed relative-link creation: delivery
must fail with a concise diagnostic and create neither a junction nor a copy.
For a Windows permission failure, check that the diagnostic explains the setup
needed before retrying.

An occupied Claude skill destination is skipped, including legacy junctions,
copies, and broken links; a rerun alone is not evidence that it was converted
to a relative symlink or repaired. These checks apply the contract in
[Skill hosts](../architecture/initialization.md#skill-hosts) and
[ADR-0026](../adr/0026-skill-host-links-must-be-relative.md).

## Installer failure verification

On a fresh isolated target, verify that initialization creates and reports
`docs/handoffs/` as a directory, creates no root `handoffs/` and no sample
record, and reports the directory as skipped on an idempotent rerun. Exercise
an occupied file or link at `docs/handoffs/`: it must be preserved and skipped
under the ordinary occupancy rule rather than replaced. A denied directory
creation must follow the concise operational-failure contract below.

Use isolated targets to exercise a file occupying a required parent directory
(such as `docs`), an unreadable asset, and a denied filesystem operation. Check
that each failure produces a non-zero result and a concise message naming the
operation, affected path, and cause, without a stack trace. Check that later
destinations are not processed and earlier writes remain under the documented
recovery limits. Controlled fault injection may supply failures that the test
environment cannot reproduce reliably through permissions alone.

Separately exercise an unexpected program error and verify that its technical
stack trace is retained and delivery stops with a non-zero result. Do not
treat a passing filesystem-error check as evidence that programming defects
remain diagnosable.

Verify the success boundary with otherwise valid isolated targets containing
either a directory at `advisor-agents.md` or a dangling link at a Claude skill
destination. Those destinations must be skipped unchanged and must not alone
cause a non-zero result. This evidence establishes occupancy behavior, not
agent access. Keep the required instruction-file reference checks separate:
an unreadable linked `AGENTS.md` or `CLAUDE.md` still fails delivery.

## Provenance

Migrated from the former repository's `docs/architecture/repository-boundaries.md`
(Documentation and product source; Instruction-bearing filenames; Self-application)
and `docs/architecture/initialization.md` (Skill hosts), commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. Self-application follows the user's
2026-09-07 instruction.
