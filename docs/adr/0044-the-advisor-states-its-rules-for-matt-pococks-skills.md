---
status: accepted
---

# The advisor states its rules for Matt Pocock's skills

The advisor no longer delivers `advisor-grill-with-docs`, `advisor-to-tickets`,
or `advisor-defer`. Documentation sessions run through Matt Pocock's
`grill-with-docs`, tickets through his `to-tickets`, implementation through his
`implement`, and handoffs through his `handoff`. A guided project's rules for
them are stated where every session already reads them:

- `advisor-agents.md` names the cases whose behavior differs in a guided
  project: grill-with-docs sessions, ticket breakdowns and implementation,
  handoffs, and deferred work. It also states that accepted decisions are part
  of a change's spec when planning, building, or reviewing it, and that a
  ticket or request contradicting one is raised before acting, which is how
  `implement`, `tdd`, and `code-review` apply them. `grill-me` gets no note: it
  runs as plain grilling, reading only what its questions need, and writes no
  documentation.
- The grill-with-docs session procedure — preparation, writing, acceptance, and
  the check before claiming a phase complete — moves to
  `docs/advisor-docs.md`, and the step that writes `absent.md` to
  `docs/features/advisor-features.md`, each merged with the rules already
  there rather than copied beside them.
- Deferred work stays in the configured tracker under the label `deferred`,
  renamed from `advisor:deferred`. The agent opens such an issue directly, or
  publishes a whole deferred breakdown through `to-tickets` with `deferred` in
  place of `ready-for-agent`.
- Initialization removes from both skill hosts every `advisor-`-prefixed entry
  that the invoked release does not deliver, and refuses a payload skill named
  without the prefix.

The user chose this on 2026-10-09. Matt Pocock's skills are installed for both
hosts on every project, so after
[ADR-0043](0043-general-skills-come-from-matt-pocock.md) a guided project still
offered two skills for documentation sessions and two for tickets. The user
asked that the advisor's text hold only what an agent starting without context
in a guided project needs, without restating or describing the skills it works
with.

## Consequences

- **Instruction ownership.** This reverses
  [ADR-0028](0028-skills-declare-their-own-applicability.md)'s rule that no
  delivered instruction file names skills, and the parts of
  [ADR-0031](0031-shared-guidance-and-workflows-have-distinct-homes.md) and
  [ADR-0035](0035-deferred-recovery-belongs-to-the-workflows.md) that kept
  workflow procedures and triggers out of the root. A skill the advisor does
  not own cannot carry the advisor's rules, so the root names it where its
  behavior in a guided project differs. The skills the advisor still delivers
  — `advisor-next-work`, `advisor-propagate-change`, and the two migration
  skills — keep declaring their own applicability.
- **Deferred recovery.** The root triggers it before a grill-with-docs session,
  a ticket breakdown, a propagation, a migration, or next-work advice;
  `advisor-next-work` keeps its rule for which issues a general or scoped
  request considers. A deferred issue states what to revisit, why it can wait,
  and when to revisit it; the required `Scope`, `Destination`, and
  `Revisit when` fields and the `.scratch/advisor-deferred/` layout of
  [ADR-0040](0040-deferred-work-uses-the-configured-issue-tracker.md) are
  dropped. `advisor-migrate-deferred` keeps legacy fields in the issue body
  without requiring them.
- **Label.** A project whose tracker holds `advisor:deferred` issues renames
  the label to `deferred`, which moves its issues on GitHub, and updates the
  mentions in its `docs/agents/` files.
- **Tickets.** Self-contained tickets and implementing-system ownership in
  [ADR-0039](0039-tickets-stay-independent-of-the-advisor.md) stand. The root
  carries the one rule a breakdown needs from the advisor: each decision the
  tickets depend on that no accepted artifact settles is put to the user with
  a recommended answer before drafting.
- **Initialization.** The `advisor-` prefix identifies a whole skill entry as
  the advisor's own without an installation inventory, so a skill a release
  drops no longer survives in either host. This narrows the partial
  convergence of
  [ADR-0029](0029-initialization-replaces-advisor-owned-destinations.md);
  entries without the prefix are never touched. Re-running initialization
  removes the three skills dropped here and the four ADR-0043 left for removal
  by hand.

## Considered Options

- **Thin advisor wrappers** around each external skill, as
  `advisor-to-tickets` was, keep the rules inside skills, but leave two
  skills for every job, which is the duplication this decision removes.
- **A separate document read on demand** would keep the root shorter, but
  reaching it would depend on the agent's judgement, which
  [ADR-0042](0042-agents-md-is-the-only-instruction-file.md) avoided for the
  root itself.
- **`docs/agents/domain.md`**, which Matt Pocock's skills already read, belongs
  to `setup-matt-pocock-skills`, which rewrites it.
- **Leaving dropped skills for removal by hand**, as ADR-0043 did, keeps
  initialization from deleting anything it did not write in this run, but every
  project not cleaned by hand would keep stale advisor skills whose rules
  compete with the root's. The prefix confines removal to entries the advisor
  named as its own.
