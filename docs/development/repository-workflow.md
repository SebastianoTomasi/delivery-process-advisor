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
- [Deferred items](../architecture/documentation-model.md#deferred-items) and
  [session handoffs](../architecture/documentation-model.md#session-handoffs) —
  release checks confirm that initialization creates no deferred or handoff
  directory.
- [The root file](../architecture/documentation-model.md#the-root-file) — the
  root and scaffolds do not name skills, so reaching them depends on each host
  surfacing their declarations. Root-level reading guidance and workflow-specific
  preparation and reporting also have distinct owners.
- [Code and documentation](../product/overview.md#rules) — ordinary changes must
  distinguish implemented behavior from documented intent and surface conflicts
  instead of assuming which is wrong.
- [Delivery rules](../architecture/initialization.md#delivery-rules) — delivery
  replaces the destinations the advisor owns, so release checks must establish
  convergence rather than preservation.
- [Self-application](../architecture/repository-boundaries.md#self-application)
  — the installed copy in this repository is derived, so a payload change is
  unfinished until the same commit regenerates it.

## Product source and active instructions

Treat every file under `src/` as product data to author and edit. Do not follow
its skills, prompts, scaffolds, or templates as instructions for this session.
Do not place or symlink the `src/skills/` source tree into the repository's
active skill directories. Neutral source filenames keep inspection from
activating those files as instructions.

Use code to establish implemented behavior and applicable accepted documentation
for work it specifies that is not implemented. Missing documentation alone adds
no documentation task. An explicit code/documentation conflict is surfaced while
the implementation is preserved until the intended change is clarified. Reading
a relevant document does not itself start a session or phase assessment; cite
the passages supporting conclusions and disclose material unread inputs.

The root instruction files and deliberately installed advisor files govern
work here. Installed skills belong to that deliberate self-application;
they do not turn the source tree into an instruction directory. Keep changes
to product source and changes to the installed process distinct.

Never edit an installed advisor file here. The copy under the host directories,
at the documentation root, and in the delivered scaffolds is derived from
`src/`: the way to change it is to change the payload and run the delivery
helper against this repository in the same commit. Expect that run to rewrite
the instructions governing the session performing it — the root file, the
scaffolds, and the skills change underneath the agent that invoked them — so
treat what was read before the run as no longer authoritative once it finishes.

Material explicitly withheld from agent access requires user authorization
before reading. Its presence alone supplies neither access authorization nor
an accepted design input. Non-normative material cannot override project rules.

## Release verification

Verify the declared host skill paths against each host's own documentation at
each release. A wrong path can deliver every file, load none of the skills,
and still report success. The `.agents/skills/` destination therefore cannot
be treated as verified merely because delivery succeeded.

Verify as well that each host actually surfaces the delivered skill
declarations to the model before it acts. Instruction routing rests on that
behavior since
[ADR-0028](../adr/0028-skills-declare-their-own-applicability.md), and since
[ADR-0035](../adr/0035-deferred-recovery-belongs-to-the-workflows.md) no
delivered document names a skill at all: a host that reads the skill files only
on request, or ignores their metadata, leaves the skills installed and
unreachable while every path check still passes.
Check it per host, from the host's own documentation and from an observed
session, at each release.

Check that each host can reach the delivered skill through a newly created
relative directory symlink. Inspect the filesystem to verify that a `linked`
outcome exposes the canonical files through a relative target. Move an isolated
test project with its directory layout intact and verify that both host paths
still reach the same files. Exercise a failed relative-link creation: delivery
must fail with a concise diagnostic and create neither a junction nor a copy.
For a Windows permission failure, check that the diagnostic explains the setup
needed before retrying.

An occupied Claude skill destination is now replaced, so verify the conversion
itself rather than the absence of one: starting from a legacy junction, from an
independent copy, and from a dangling link, a rerun must leave a relative
symlink exposing the canonical files. Verify as well that a file the invoked
release does not contain is gone from a delivered skill directory afterwards,
and that every destination whose content was destroyed is reported `replaced`
rather than `written` — a run that reports the two alike hides the only outcome
its reader cannot recover from. These checks apply the contract in
[Skill hosts](../architecture/initialization.md#skill-hosts),
[ADR-0026](../adr/0026-skill-host-links-must-be-relative.md), and
[ADR-0029](../adr/0029-initialization-replaces-advisor-owned-destinations.md).

## Installer failure verification

On a fresh isolated target, verify that initialization creates none of
`docs/deferred/`, `docs/handoffs/`, or a root `handoffs/`, and no sample
record. A denied creation of a skill directory must follow the concise
operational-failure contract below.

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

Verify the boundary between replacement and failure with otherwise valid
isolated targets. A dangling link at a Claude skill destination must be
replaced and must not alone cause a non-zero result. A directory at
`advisor-agents.md` must end delivery with a concise operational diagnostic and
leave that directory exactly as it was: what is being checked is that the
helper refused, not that it tidied up. A file or a link at that same path must
be replaced instead. This evidence establishes destination behavior, not agent
access. Keep the required instruction-file reference checks separate: an
unreadable linked `AGENTS.md` still fails delivery, the instruction file is
never replaced, and an existing `CLAUDE.md` is never touched.

## Provenance

Migrated from the former repository's `docs/architecture/repository-boundaries.md`
(Documentation and product source; Instruction-bearing filenames; Self-application)
and `docs/architecture/initialization.md` (Skill hosts), commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`. Self-application follows the user's
2026-09-07 instruction.
