# An executable CLI shipped in the payload

**State:** open
**Scope:** project
**Destination:** architecture
**Revisit when:** the payload's contents are reconsidered, when the cost of the
instruction prose becomes a constraint worth paying a runtime dependency to
remove, when propagation completeness is being worked on and a deterministic
check over the artifact tree would settle it, or when
[#4](https://github.com/SebastianoTomasi/delivery-process-advisor/issues/4)
revisits replacing agent readings with commands.

Decide whether the payload should carry executable code alongside its Markdown
instructions, exposing a CLI the agent invokes during a session. The originating
proposal was a command that creates a new artifact from a template — correct
filename, title, status marker, and `## Scope` heading already in place — which
the agent then fills in.

The payoff sought was that mechanical prose could leave the delivered
instructions. The candidate is the artifact-shape material in
[`src/target/docs/advisor-docs.md`](../../src/target/docs/advisor-docs.md)
under "What a document says about itself": the marker line's exact position,
the three status spellings, and the mandatory opening `## Scope`.

This can wait. Nothing currently blocked depends on it, and the present prose
works; the idea competes for the same payload surface that
[Initialization](../architecture/initialization.md) specifies, so it is better
decided when that contract is next open rather than alongside unrelated work.

## Context and constraints already established

- [Repository and payload boundaries](../architecture/repository-boundaries.md)
  separates the payload from the repository-owned delivery mechanism. Executable
  payload content would be a new kind of delivered file and must land on the
  payload side of that line.
- [Initialization](../architecture/initialization.md) specifies what is
  delivered and what the act guarantees about files already there. A shipped
  executable inherits those replacement and ownership rules.
- [Product form](../product/overview.md#form) states that the system consists of
  scaffolds, catalogs, templates, skills, and instruction files, plus the helper
  that delivers them. The helper is a plugin; the skills are payload. A CLI the
  agent calls mid-session is neither, so it is a new kind of thing in the
  division between deterministic delivery and project-resident judgement. This
  idea moves work from judgement to delivery, which is the argument for it and
  the place to check that it does not quietly move judgement too.
- The same passage records that there is deliberately **no** command returning
  the phase, the first unaccepted prerequisite, or the owning authority, because
  placing a feature in the process is a reading and should fail the way a
  reading fails. Scaffolding an empty artifact is deterministic rather than a
  reading, so it does not contradict that rule — but it sits directly against
  it, and the boundary between the two needs stating.
- Form already allows a session to "import a useful template under the name it
  agrees on or create an artifact directly", and the helper "can import an
  optional template". Check what that existing template path already covers
  before adding a second mechanism.

## Options to weigh

Assessed in conversation, not yet decided. Recorded so the session that takes
this up starts from the comparison rather than from the first idea alone.

1. **Ship a template asset, no executable.** A well-formed example artifact in
   the payload that the agent copies. Shows the shape instead of restating it,
   costs no runtime dependency, and delivers no executable file. Cheapest way to
   get most of the originating idea's benefit.
2. **A CLI for scaffolding**, as originally proposed. The prose it can remove is
   smaller than it appears: most of the candidate section is semantics — what
   each status means, that status applies to the whole artifact, that a
   `needs-review` artifact supplies no accepted input, that unmarked documents
   count toward no phase — and a generator absorbs none of it. Writing a
   well-formed file is also something the agent already does reliably, so the
   determinism gained is small.
3. **A CLI for checking and querying.** Where determinism is worth most:
   validating that every artifact carries a marker and `## Scope`, surfacing
   `needs-review` artifacts never reviewed, listing artifacts by authority,
   status, and phase without loading the tree into context, and above all
   answering which artifacts depend on a changed decision. Propagation
   completeness is a graph query over the Dependencies blocks and rests today on
   the agent's diligence in following them.

Options 1 and 3 are independent and could both be taken; option 2 is the one
whose case is weakest.

## Open questions for the session that takes this up

- What runtime the target project would then be required to have, and whether
  the advisor is willing to demand one. The payload is Markdown today and lands
  in any repository without asking anything of it.
- Version skew between delivered code and delivered instructions: a binary from
  an earlier release beside newer prose is a failure mode the Markdown-only
  payload does not have. It compounds the open question of how same-commit
  regeneration is enforced.
- Whether format rules can be removed at all or only shortened. Generation
  happens once; reading happens constantly. Every rule the reading path needs
  must stay, and in a marker system most writing rules have a reading twin —
  the marker sits where it sits so that a reader finds it on opening the file.
- Where the rules then live — encoded in a template or generator, or still
  stated for the reading path — and which authority owns them.
- Whether generation stays limited to scaffolding or grows to cover other
  mechanical steps, which would enlarge the decision considerably.
