# Repository and payload boundaries

**Status:** accepted

## Scope

This contract separates documentation about the advisor, the payload delivered
to target projects, and the repository-owned mechanism that performs delivery.
It prevents product source from being mistaken for instructions governing work
on this repository.

The contents and publication behavior of the payload are specified by
[Initialization](initialization.md). The documentation model used inside a
target project is specified separately in
[Guided project documentation model](documentation-model.md).

## Dependencies

- [Product form](../product/overview.md#form) — repository boundaries preserve
  the distinction between deterministic delivery and project-resident judgement.
- [Document kinds](documentation-model.md#document-kinds) — installed advisor
  instructions and project-owned artifacts have different roles and lifecycles.
- [Handoffs](documentation-model.md#handoffs) — the initialized work-record
  directory has a fixed destination but no source asset or delivered file.
- [Target selection](initialization.md#target-selection) — the helper's target
  is selected by that contract; self-application does not establish a second rule.
- [Skill hosts](initialization.md#skill-hosts) — payload layout must keep
  canonical skill files and the second host's link outside the literal mirror.
- [Delivery rules](initialization.md#delivery-rules) — the installed copy here
  is regenerable because delivery replaces the destinations the advisor owns;
  self-application depends on that and adds no separate mechanism.

## Documentation and product source

Project artifacts under `docs/` and the glossary `CONTEXT.md` describe the
advisor: what it is for, how it is built, and why its design was chosen. They
are never used as payload for other target projects. This self-applied
repository also holds installed advisor scaffolds and catalogs under `docs/`;
those govern work here, while `src/` contains their separately authored release
sources.

`src/` is the fixed payload delivered into target projects. It contains the
scaffold and question-catalog sources, template sources, skills, instruction
files, and any other target-resident assets. A change under `src/` changes the
product release; it does not document this repository.

The corresponding contributor rule is owned by
[Development](../development/repository-workflow.md#product-source-and-active-instructions).
Product source and installed instructions occupy distinct roles even when
they contain similar text.

The installer is product code owned by this repository, but it is not part of
the payload and does not live under `src/`. It remains versioned beside the
assets it copies, is distributed as a plugin rather than delivered into a
target, and runs against the root selected by the initialization contract.

This repository is that plugin. The manifest sits in `.claude-plugin/`, the
helper in `bin/`, its command in `commands/`, and the payload is the `src/`
tree beside them, so the thing installed and the thing shipped are one artifact
and cannot disagree about a release. The arrangement holds only
because no payload asset sits where the host looks: the payload's skills are at
`src/skills/`, not the plugin's own `skills/`, and its instruction files are at
`src/instructions/`, not the root. That is the same rule as the
instruction-bearing filename rule below, applied to directories instead of
filenames — installing the helper must not make a target project's process
active in the sessions that maintain the advisor.

## Payload layout

`src/` separates the assets whose destination is fixed from those whose is not,
and says so through its own shape.

```
src/
  target/         literal mirror of the target project
    advisor-agents.md
    docs/
      advisor-docs.md
      product/
        advisor-product.md
        advisor-product-project.md
        advisor-product-feature.md
      frontend/
        advisor-frontend.md
        advisor-frontend-project.md
        advisor-frontend-feature.md
      architecture/
        advisor-architecture.md
        advisor-architecture-project.md
        advisor-architecture-feature.md
      implementation/
        advisor-implementation.md
        advisor-implementation-project.md
        advisor-implementation-feature.md
      ...
      features/advisor-features.md
  templates/
  skills/
  instructions/
```

`src/target/` is a literal file mirror: an asset's path under it is its path in
the target, so the mapping from each mirrored asset to its destination is the
identity. Delivering those fixed files is a recursive copy that skips occupied
destinations.

The initialized structure has one fixed destination with no source asset:
`docs/handoffs/`. Empty directories cannot be expressed as files in the mirror,
so the helper declares, creates, and reports that directory directly. It adds
no placeholder or protocol file; handoff records remain project-owned, and the
delivered skill owns their operational rules.

The other three directories are not mirrors and do not pretend to be, and each
is excluded for its own reason.

A template's destination is not fixed. Its folder is its owning authority's,
but its filename is chosen at import, so no path under a mirror could name it.

A skill's host paths are fixed — canonical files for Codex and a relative
directory symlink for Claude Code, with the failure behavior in
[Initialization](initialization.md#skill-hosts). Fixed paths alone could be
mirrored. Skills are excluded by the instruction-bearing
filename rule below: `SKILL.md` is read as instructions by the tools working on
this repository, so the asset cannot be stored at the path it is delivered to.
The weaker reason is worth not recording, because a contributor who reads it
will eventually observe that skill paths are fixed, conclude that skills can be
mirrored, and reintroduce exactly the hazard that rule exists to prevent. A
skill also has two different destination roles: delivered files and a host
link. A literal mirror cannot express both roles as one recursive copy.

`src/instructions/` holds the seed instruction files written into a project
that has none, one per host. Their destinations are fixed, but they are
instruction-bearing at those destinations and so fall under the same rule as a
skill. They differ from every other asset in one way worth stating: once
written each is the project's file, not the advisor's, which is why neither
carries an `advisor-` prefix or a standard marker and why no later delivery
touches their content.

All three therefore take their destinations from the installer's mapping, and
keeping them outside `src/target/` stops the mirror from being half true.

Delivery still resolves every file, directory, and link destination through
one mapping. The mirror makes most file mappings the identity, while the
handoff directory remains the single asset-free structural destination.

## Target and project identity

[Initialization](initialization.md#target-selection) owns explicit and automatic
target selection. This repository is itself a guided target by the user's
express request. Its artifacts, features when declared, and phase coverage use
the installed advisor model; the former local-status-only convention no longer
applies. The same domain vocabulary can describe this guided project and other
guided targets without making their project decisions interchangeable.

## Instruction-bearing filenames

No payload asset is stored under a filename that a tool automatically treats
as instructions. Neutral source names are mapped to their conventional names
only at delivery. This is a standing property rather than a closed filename
list; current examples include `CLAUDE.md`, `AGENTS.md`, and `SKILL.md`.

The rule keeps source inspection from automatically activating payload policy.
The contributor practice is specified in
[Development](../development/repository-workflow.md#product-source-and-active-instructions).

## Self-application

The user deliberately applied the advisor to this repository on 2026-09-07 to
use the system to build itself. Installed scaffolds, catalogs, skills, and root
instructions govern this project. Its migrated artifacts describe the advisor
product and are evaluated under the installed process, including real artifact
acceptance and semantic phase coverage.

Source versions under `src/` remain product payload, and a change to the
advisor's own design artifacts does not itself change that payload. The other
direction is now fixed: the installed copy here is derived from the payload and
is never edited by hand. A commit that changes payload source regenerates it in
the same commit, by running the delivery helper against this repository, so the
two cannot drift apart unnoticed.

They did once. The payload advanced alone while the installed copy stayed a
release behind across seven files and one skill missing a reference file it
linked to, and nothing detected it. That is the evidence
[ADR-0029](../adr/0029-initialization-replaces-advisor-owned-destinations.md)
was decided from, and the reason an edit made directly to an installed file is
a defect to correct by regenerating rather than a second copy to keep in step.
Installed skills in the host
directories are deliberate self-application; their links target canonical
delivered files under `.agents/skills/`, not `src/skills/`.

## Provenance

Migrated from the former advisor repository, `docs/architecture/repository-boundaries.md`, commit
`a44529ff21d8999619f81dc934f1d20078aea0a5`.
