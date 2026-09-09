# Initialization

**Status:** accepted

## Scope

This contract governs how the advisor's payload enters a target project: what
is delivered, what decides that it is delivered, and what the act guarantees
about files already there.

It does not own which questions a catalog enumerates, the order of the phases,
how project state is later derived, or what advice is produced from it. Those
structural rules are specified in the
[documentation model](documentation-model.md), and the vocabulary is fixed in
[`CONTEXT.md`](../../CONTEXT.md).

## Dependencies

- [Product form](../product/overview.md#form) and [rules](../product/overview.md#rules)
  — delivery must establish the process without creating project decisions.
- [Delivery compatibility](../product/overview.md#delivery-compatibility) —
  initialization preserves occupied destinations without promising release
  uniformity, compatibility, or operability of skipped destinations.
- [Document kinds](documentation-model.md#document-kinds) and
  [directory layout](documentation-model.md#directory-layout) — the mapping
  delivers the fixed advisor content while leaving project-named work to sessions.
- [Handoffs](documentation-model.md#handoffs) — their empty directory is a fixed
  structural destination, their protocol is delivered inside the skill, and
  their records are created only by sessions.
- [Payload layout](repository-boundaries.md#payload-layout) — fixed mirrors,
  canonical skill files, host links, and neutral instruction assets define the
  destination mapping.

## The payload

The payload is the set of assets shipped into a target project: the scaffolds,
question catalogs, templates, skills, and instruction files that make the rest
reachable. It is stored in `src/`, carries one version, and advances as one
unit. That version is named `delivery-process-advisor@<release>`.

Every asset is fixed content, delivered without content substitution. Assets
carry no release marker: files an agent opens should contain the information
needed for its work, without repeated release metadata consuming its context.
The release is recorded in the plugin manifest and the delivery report, not
in each delivered file. A file alone therefore does not identify its release
of origin, and the report does not certify the version of skipped destinations.

There is no templating language, conditional content, or value derived from
the target. Newly delivered asset bytes match their source in `src/` directly;
any two projects receiving the same asset from the same release receive
identical bytes. This retires the substitution decision recorded in
[ADR-0006](../adr/0006-the-release-marker-is-written-in-at-delivery.md).

Every scaffold and question catalog has a fixed destination, including the
feature scaffold, which is held once for the project at
`docs/features/advisor-features.md`. No shipped asset is written inside a
folder the project names.

The fixed `docs/handoffs/` directory is also part of the destination mapping.
It has no source asset and receives no placeholder or scaffold file; the helper
creates the directory itself so the agreed location exists immediately while
the skill remains the single home of the handoff protocol.

Templates are the assets whose destination is not fully fixed. A template's
folder is its owning authority's, but its filename is chosen when it is
imported, because an artifact is named for what it says and that is not known
at release time. The filename is the only thing parameterized in the
asset-to-destination mapping; asset content has no parameters.

The skill mapping has a file destination and a link destination. Skill files
are delivered under `.agents/skills/<name>/`; `.claude/skills/<name>` exposes
that directory through a relative symlink, with failure behavior described in
[Skill hosts](#skill-hosts). Asset text is fixed; the filesystem representation
of the second host is variable.

A skill is a directory, not a file. Every source file under
`src/skills/<name>/` is delivered independently to the canonical directory,
with `skill-asset.md` renamed to `SKILL.md`. A project holding only that entry
file receives the remaining absent files around it. The Claude host is handled
as one directory destination after the canonical files are processed.

No asset is stored under a name that a tool treats as instructions. Assets are
held under neutral names and renamed at their destination. The rule is standing
rather than enumerated; it currently covers `CLAUDE.md`, `AGENTS.md`, and
`SKILL.md`.

The neutral name keeps the real extension, so the source file still opens and
renders as what it is: a skill ships as `skill-asset.md` and lands as
`SKILL.md`. Suffixing the conventional name instead would make the asset
unreadable in the editors it is authored in, for no gain.

The `advisor-` prefix satisfies the rule by construction. `advisor-agents.md`
is the project's advisor instruction file, and no tool reads that name as
instructions, so it ships and lands under one name and needs no rename.

The seed instruction files are the exceptions that need the rename. There are
two, one per host — delivered as `CLAUDE.md` and `AGENTS.md`, both
instruction-bearing — so both are held under neutral names in
`src/instructions/` and renamed at their destinations. They are also the only
assets that are not the advisor's once written: each becomes the project's own
file, and therefore carries neither the `advisor-` prefix nor a standard
marker.

## Skill hosts

The helper installs into one agent tool; the payload serves two. The
asymmetry is deliberate. The original two-copy arrangement is preserved in
[ADR-0007](../adr/0007-the-payload-serves-two-skill-hosts.md), and the shared-file
arrangement with platform fallbacks in
[ADR-0023](../adr/0023-skill-hosts-share-one-delivered-copy.md). The current
relative-link-only rule supersedes the latter through
[ADR-0026](../adr/0026-skill-host-links-must-be-relative.md).

The two hosts are Claude Code and Codex, and they differ in where they look:

| Host | Skill destination | Instruction file |
| --- | --- | --- |
| Codex | Canonical files in `.agents/skills/<name>/` | `AGENTS.md` |
| Claude Code | Relative directory symlink at `.claude/skills/<name>` | `CLAUDE.md` |

Neither host reads the other's instruction file, so both are ensured to exist
and to carry their host-specific reference to `advisor-agents.md`: Claude Code
uses `@advisor-agents.md`, while Codex receives the explicit directive
`Before doing any work, read and follow [advisor-agents.md](advisor-agents.md).`
A successful link exposes the canonical delivered skill files to both hosts.

The helper creates a relative directory symlink from the Claude host to the
canonical directory. If that fails, delivery ends at that destination with a
non-zero result and a concise diagnostic on every platform. A missing canonical
directory is also an error. No absolute junction or independent-copy fallback
is permitted.

Relative links preserve their target relationship when the whole project moves
with its directory layout intact. On Windows, a permission failure explains
that Developer Mode or an appropriately privileged invocation may be needed
before retrying. The helper neither changes system settings nor elevates itself.
Previously delivered files remain in place under [Failure behavior](#failure-behavior).

If anything already occupies the Claude skill destination, including a
dangling link, that destination is skipped as a whole. Existing copies are not
converted to links, and broken links are not repaired by initialization.

Host-path verification at each release belongs to
[Development](../development/repository-workflow.md#release-verification).
A wrong host path can deliver files and report success while loading no skills;
the destination contract therefore needs that independent verification.

## Division of labour

Initialization asks for no judgement. The scaffolding decides nothing, so it is
written whole, and nothing else is written. A later session may import an
optional template under the name it agrees on or create an artifact directly.
Initialization is therefore the helper and nothing more — resolving each asset to its
destination, copying its content unchanged, and
reporting what happened. It is the one
part of the system that establishes a fact, and byte-exactness is not asked of
a fallible reader.

Judgement enters afterwards, in the sessions: whether a template is useful,
what artifact boundary and name fit the subject, and what the artifact says.

The helper is distributed as a plugin, reachable by name rather than by a path
a release cannot know, and versioned with the assets it copies. It is never
shipped into a target and imposes no runtime or installer dependency on one:
being reachable by name is what lets a session import a template into the
project it is working in, instead of naming the import as the user's next
action.

This repository is the plugin. It carries the plugin manifest at its root and
serves as its own marketplace, so the payload the helper copies is the `src/`
tree beside it and no build step stands between the two. The helper locates
both the payload and the manifest relative to its own file, so it holds no
absolute path and no configured root; the host supplies only the path used to
invoke it. Nothing under `src/` sits at a path the host loads — the payload's
skills are at `src/skills/`, not the plugin's own `skills/` — so installing the
helper does not make a target project's skills active in the sessions that
maintain the advisor.

The helper is one script with no dependencies beyond its runtime, in `bin/`,
invoked through a plugin command. It is small enough to be read in full, which
is what the claim that it can be verified directly rests on.

The release named in the delivery report is the plugin manifest's version.
There is one version source, already required by the plugin format. It names
the release being delivered, without adding metadata to the asset content.

Only `init` exists. `import` waits for the first template, because there is
nothing yet to import and nothing to test it against. Until it exists a session
names the import as the user's next action rather than performing it — an
interim state, not the contract.

The skills are the other half, and they go the other way: they are payload,
released with the catalogs they interrogate and delivered into the project.
Sessions use the catalogs present there. Later delivery can leave skills and
catalogs from different releases together, as described in
[Deliberate exclusions](#deliberate-exclusions). The rationale for keeping
skills in the project is recorded in
[ADR-0003](../adr/0003-skills-are-payload-the-helper-is-a-plugin.md).

## Target selection

An explicit `--target <target-project-root>` selects that root, resolved to an
absolute path. When no root value is supplied — whether `--target` is omitted
or is present without a following value — the helper walks from the current
working directory toward its ancestors and selects the nearest directory
containing a `.git` entry. If none exists, it selects the current working
directory itself. The selected root must exist and be a directory.

Before any delivery write, an automatically selected target is announced in the
report. The message says that the default target is being used without claiming
that `--target` itself was absent. This is the helper's selection behavior, not
a separate advisor approval step. The same rule applies when the plugin command
is invoked without a root.

This replaces the former explicit-root-only contract at the user's direction
during self-application. [ADR-0022](../adr/0022-initialization-can-select-the-current-repository.md)
records the change. The contracts governing occupied files, failure, and
idempotence apply identically to explicit and implicit targets.

## Inputs and outputs

Initialization operates on one selected target project root. Selection follows
[Target selection](#target-selection). Importing a template later takes two
additional inputs: the template and the filename it is written under. There
is no default feature.

The output is the root file, the scaffolding including the empty
`docs/handoffs/` directory, the skills in both host directories, a host-specific
reference in each of the project's two instruction files — or those files
themselves, where the project had none — and a report.

The report is one line per file, handoff-directory, or skill-directory
destination, saying `written`, `appended`, `skipped`, or `linked`, followed by
outcome counts.
`linked` means a relative directory symlink was created. Skill-directory lines
include the canonical path they expose; a skipped destination's representation
is not certified. It is plain text rather than a structured result, because the
reader needs to know which destinations were written, linked, or left alone. The
operation ends with a zero result on success and a non-zero one on any error.

Success means all delivery operations completed according to their rules,
including reporting occupied destinations as skipped. It does not certify
the contents, completeness, or reachability of skipped destinations, or that
either host can load the installed process. The instruction-file reference
check remains the specific exception required by [Delivery rules](#delivery-rules).

**Initialization writes the whole scaffolding and only that** — the root file,
every authority folder with its scaffold and fixed catalogs, `docs/features/`
with its own scaffold, and the empty `docs/handoffs/` work-record directory.
The scaffolding decides nothing, so writing all of it costs the project nothing
and gives it the map of the work ahead before any of that work is chosen. No
template or handoff record is written: each needs a project-chosen subject and
name that initialization cannot know.

Feature folders are not part of it. When a user begins to describe a new
feature, the session agrees its readable name and lowercase ASCII kebab-case
slug, then writes its first proposed Product artifact and thereby creates
`docs/features/<feature-slug>/product/`; there is no separate empty feature.
Each later `docs/features/<feature-slug>/<authority>/` comes into existence with
its first artifact, either directly or through an optional template. Every
authority permits feature scope; Security, Operations, Deployment, Development,
and Stack do not gain phases from those folders. Folder presence shows where
project documentation exists, not completion or decision readiness.

The implementation authority is delivered at `docs/implementation/`, with its
boundary and separate project and feature catalogs. It covers all runtimes.
This is the layout for a fresh delivery; initialization does not rename a
target's existing `docs/backend/` artifacts or upgrade its occupied routers.
Migration and upgrade remain outside this contract.

`sources/` folders are not part of it either, and no later release can add
them. There is nothing to deliver: a source is the user's own material, so a
folder comes into existence when someone puts a file in one, and
`docs/advisor-docs.md` — written at initialization like every other scaffold —
is what tells a reader the position exists. Delivering them empty would write
nine folders into every project, most of which would never hold anything. That
cost differs from the single fixed handoff directory whose immediate presence
the product deliberately promises. The positions sources may occupy are fixed by the
[documentation model](documentation-model.md).

`CONTEXT.md` is not part of the payload and neither are the decision
records. Both belong to the `advisor-domain-modeling` skill, which carries
their format and writes them during a session — the glossary when the
project's first term is resolved, a record when a decision earns one. A new
project has taken no decisions and fixed no language, so neither file exists
at initialization.

Initialization creates the empty `docs/handoffs/` directory and reports it as
one fixed destination. It delivers the recovery instructions inside the skill,
but no handoff record or second protocol file. Records are written there only
by later sessions. Their representation is owned by the
[documentation model](documentation-model.md#handoffs).

## Delivery rules

One delivery decision is taken per file or directory destination, and none
about the repository as a whole. Occupancy is determined from the directory
entry itself, without following links: a symbolic link or junction occupies
its name even when its referent is missing. Ordinary files and the explicit
handoff directory use the rules below; [Skill hosts](#skill-hosts) defines
directory-link occupancy and failure behavior. The reasons for treating links
as occupied are recorded in
[ADR-0024](../adr/0024-initialization-never-writes-through-an-occupied-link.md).

1. The destination does not exist — write the asset, or create the empty
   `docs/handoffs/` directory for that structural destination.
2. The destination exists — leave it untouched and record it as skipped.
3. The destination is one of the project's own instruction files — ensure it
   carries that host's reference to `advisor-agents.md`. If the file is absent
   it is created holding nothing but the reference; if it is present the
   reference is appended, leaving existing content unchanged; if that exact
   reference is already there the file is left alone and recorded as skipped.
   If the destination is a link, the helper may read through it only to check
   for the exact reference. It never appends through the link: a reference
   already present is reported as skipped, while a missing reference or an
   unreadable or dangling link ends delivery with a concise diagnostic.

Rule 3 is an ensure rather than a write, and it is the only rule that is.
The instruction chain starts at that reference, so both host instruction files
must contain it even when they already exist. This establishes the entry
directive, not the integrity of the rest of the chain. A directory occupying
`advisor-agents.md`, an unusable existing scaffold, or a broken link occupying
a Claude skill destination is still skipped under the ordinary occupancy
rules. Such a skipped destination does not itself make delivery fail; a later
required operation that encounters an error still does.

The rule applies once per host, to `CLAUDE.md` and to `AGENTS.md`. Both are
ensured in every project, because neither host reads the other's file. Each is
the project's own from the moment it is written: it carries no `advisor-`
prefix and no standard marker, and the advisor never touches its content again
beyond the check above.

The check is a substring match for the exact host-specific reference anywhere
in the file: `@advisor-agents.md` for Claude Code and the full explicit
read-and-follow directive for Codex. That is a small amount of target content
read by a helper otherwise defined as judgement-free, and it is accepted
because it is what makes the idempotence invariant true rather than
aspirational.

Matching anywhere rather than requiring a dedicated line is deliberate. It
allows the exact reference to be embedded in surrounding project instructions
without duplicating it on every delivery. Rewording the Codex directive is not
treated as equivalent, because a mere mention of `advisor-agents.md` does not
reliably instruct the agent to open and follow it.

`advisor-agents.md` is itself an ordinary fixed destination and follows rule 2.
If it is occupied it is left untouched and reported, never delivered under
another name. Renaming on collision would make a second delivery write a new
file and append a second reference, which the idempotence invariant forbids;
it would also be the one place where the payload mirror's identity mapping does
not hold. Making it idempotent instead would require recording which files the
advisor wrote, which is deferred in
[#3](https://github.com/SebastianoTomasi/delivery-process-advisor/issues/3).

A partial delivery is a normal outcome and not a failure. Whether the target
was empty is never asked.

## Invariants

- A file the advisor did not write is never modified, with the single exception
  of appending the host-specific reference to the project's own instruction
  files.
- Newly delivered asset text is byte-identical to the asset in `src/`, and
  identical between projects receiving the same
  release. The second host's relative symlink representation is governed
  by Skill hosts; this does not add transformations to asset text. Verification
  compares delivered bytes directly with `src/` and separately checks the host
  representation. This comparison concerns newly written assets, not skipped
  destinations or existing project instruction files receiving a reference.
- Nothing beyond the scaffolding is written. The empty `docs/handoffs/`
  directory is part of that scaffolding; no handoff record, document that
  decides something, or template is created before a session names it.
- A published payload contains its scaffolds, catalogs, and skills as one
  release. This does not imply that an existing target holds a single release:
  occupied destinations are skipped and absent ones receive the invoked
  release. The helper remains a plugin outside the delivered payload.
- No state the advisor reasons from is kept outside the project's files. A
  phase's coverage, decision readiness, dependencies, review recovery notes, and
  artifact status are read from project files and stored in no parallel registry.
  Deriving coverage and readiness requires semantic reading beyond the markers.
  Handoffs also live in project files, under `docs/handoffs/`, as specified by
  the [documentation model](documentation-model.md#handoffs). They record
  pending questions and links to their answers, not a second coverage or
  readiness registry. Delivery status remains the task system's concern.
- Delivery is idempotent in effect. A second run against the same version
  changes nothing. For every asset that is written, that follows from the
  destination being occupied and skipped. A Claude skill-directory destination
  is also skipped once occupied, whether it is a link, junction, or copy. For
  the instruction files, which are
  appended to rather than written, it does not: it holds because the exact
  host-specific reference is looked for before it is added.
- Successful delivery establishes each host's exact entry directive and
  completes the per-destination rules. It makes no whole-installation
  reachability guarantee for pre-existing files and links that were skipped.

## Failure behavior

An unreadable asset, an unresolvable destination, a failed write or relative
skill-link creation, or an instruction-file link that cannot safely satisfy
its required reference ends the operation at that point with a non-zero
result. Expected operational errors, including filesystem failures involving
files, paths, or permissions, produce a concise diagnostic identifying the
operation, affected path, and cause, without a stack trace. A file occupying a
required parent directory, for example `docs`, is reported this way rather
than exposing a runtime stack trace.

Unexpected program errors also stop delivery with a non-zero result, but keep
their technical stack trace so the defect can be diagnosed. They are not
reclassified as ordinary filesystem problems or reduced to a generic failure
message. This distinction changes presentation, not recovery or continuation:
neither class permits delivery to continue after the failed operation.

There is no fallback to merging, migration, partial reuse, overwriting, or
writing through a link. Failed skill-link creation also has no junction or
copy fallback, as specified in [Skill hosts](#skill-hosts).

Delivery is not atomic. Assets are written one at a time and what was written
before the failure stays written, so an interrupted delivery leaves the target
part-initialized. That is tolerable because of what the delivery rules already
guarantee: nothing pre-existing is overwritten, and the only file whose content
is altered gains one appended line.

Re-running the helper recovers only when the interruption happened between
destinations: every destination already completed is skipped, and the rest is
delivered. There is deliberately no staging or completeness marker for one
file. An interruption inside a file write can
leave an occupied partial destination that a later run skips; the report can
therefore say that the delivery rules completed without certifying that such a
destination is complete. Recovery then requires the user to inspect and remove
that partial destination before running initialization again.

Staging destinations or the whole delivery would make interruption recovery
stronger, at the cost of temporary state, publication rules, and cleanup paths.
The helper deliberately keeps direct writes and explicit manual recovery
instead. Atomicity can be reconsidered later without changing the ordinary
write-if-absent behavior.

## Deliberate exclusions

Reading a project's existing documentation and placing it into the ontology
is not performed by initialization. After delivery, the user can request
`advisor-migrate-docs` to migrate selected documents. That skill makes placement
decisions, resolves necessary choices, verifies the new documents, and replaces
the in-scope originals. It is separate from the helper's write-if-absent
contract. See [the adoption flow](../development/interaction-flows.md#h-adopting-a-project-that-already-has-documents).

Material supplied only as background may still be used through `sources/` and
ordinary advisor-grill-with-docs sessions. Neither initialization nor the mere
presence of old documentation implies adoption or accepted advisor decisions.

Upgrading a project to a later payload version is not performed. A later
delivery leaves occupied destinations untouched and adds any absent assets
from the invoked release. It may therefore produce an installation containing
files from different releases, including skills and catalogs that are not
compatible. Initialization neither detects nor rejects that mixture and makes
no compatibility guarantee for it. A successful report describes the delivery
outcomes, not release uniformity.

The same exclusion applies to handoff storage: initialization does not move
records from the superseded root `handoffs/` path into `docs/handoffs/`.

This is deliberate: initialization keeps its per-destination rules without
introducing an installation inventory, release comparison, or upgrade
mechanism. Preserving existing content and filling absent destinations takes
precedence over uniformity. Upgrade work remains deferred in
[#3](https://github.com/SebastianoTomasi/delivery-process-advisor/issues/3).

Holding each feature phase's questions once in its authority's feature catalog
gives all features the same current file to consult, rather than a separate
copy per feature. It does not establish compatibility between that catalog and
other installed assets. Separating each feature catalog from the same
authority's project catalog lets a session load its current scope without
loading either the other three phases or the other scope.

## Provenance

Migrated from the former advisor repository, `docs/architecture/initialization.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`.
