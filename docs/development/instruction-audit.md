# Auditing the advisor's instruction paths

**Status:** accepted

## Scope

This artifact defines a development method for an agent to inspect and improve
the advisor's Markdown instruction content under `src/` by simulating its use
in a target project. It owns the audit method and the evidence expected from
improvements. Product and Architecture continue to own the advisor's behavior
and contracts. The method is exercised through a repository-local maintenance
skill.

## Dependencies

- [Product source and active instructions](repository-workflow.md#product-source-and-active-instructions)
  — the audit examines release source while the installed process governs work
  on this repository.
- [Payload layout](../architecture/repository-boundaries.md#payload-layout)
  — simulated target paths must account for the mapping from source assets to
  delivered instruction files and skills.
- [Instruction ownership](../architecture/documentation-model.md#the-root-file)
  — placement and duplication findings must respect each file's operational
  role and the deliberately repeated summaries needed for interpretation and
  routing. Shared reading guidance belongs to the root; detailed workflow
  reporting belongs to the skill conducting that work.

## Objective

Help a maintenance agent improve the content and organization of the advisor's
instructions by examining what an agent using them in a target project would
read and understand while carrying out a user request.

The examination follows instruction paths from the user prompt and the target's
`AGENTS.md`, through `advisor-agents.md`, to the relevant scaffolds, catalogs,
and supporting Markdown files, and from the skill declarations the host loads
before the request into the skills themselves. Different user requests expose
different branches. The starting examples are a request for a new feature,
which routes to an `advisor-grill-with-docs` session, and a request to choose
next work, which routes to the read-only `advisor-next-work` skill. Under
[ADR-0028](../adr/0028-skills-declare-their-own-applicability.md), workflow
applicability belongs to skill descriptions. Neither the root nor the scaffolds
names a workflow or routes requests by workflow name; a declaration that fails
to claim its own case is therefore a navigation defect that following the file
path cannot reveal.

The full navigation trace is evidence required by this audit method. Ordinary
advisor work follows the root's narrower obligation to cite supporting passages
and disclose material reading gaps; it need not report every file opened.

The audit should expose instructions placed where they are not useful or not
reached when needed, unnecessary duplication, missing instructions, and unclear
or conflicting directions. Its intended outcome includes helping the agent
correct the source content under the correction boundary below.

## Correction boundary

The maintenance agent autonomously improves clarity, placement, links, and
unnecessary duplication when the intended behavior is clear and the correction
preserves it. This includes restoring a missing instruction or route when the
existing rules already determine what it must say or reach.

When a finding exposes contradictory rules, an unresolved decision, or a reason
to change the advisor's process, the agent presents the concrete case and a
reasoned proposal to the user. It does not silently choose the intended behavior
or remove an obligation as an editorial correction. Once the user settles that
choice, its determined consequences can be applied without approval for each
individual edit.

## Simulation and review

The simulator and reviewer are separate agent roles with separate contexts.
Each scenario starts a fresh simulator context containing the user prompt and
the information normally available to an agent in the target project, including
the host's skill descriptions. The simulator discovers the applicable
instructions through that environment and records its reading path, navigation
choices, and points of uncertainty.

The simulator does not inherit the reviewer's conversation, investigation of
the advisor repository, or knowledge of where the instructions ought to lead.
It does not carry discoveries from previous scenarios into a new scenario.
The target project's own documents remain available as scenario context;
the advisor repository's design documents are not substituted for them.

The reviewer can examine the advisor's design and source, evaluate the
simulator's trace, and correct `src/` within the correction boundary. Keeping
these roles separate prevents the maintainer's prior knowledge from concealing
a missing route or an unclear instruction.

## Navigation-only scope

The current method tests navigation and examines the instructions encountered
on that path. The simulator reads the files needed for the supplied request and
target state; it does not execute the prescribed document-writing workflow,
conduct a simulated interview, or invent the user's answers.

When further navigation depends on a missing user decision, the simulator
records that dependency and leaves the conditional continuation unexplored.
That stopping point is not itself an instruction defect. Reading a procedure
can expose unclear or conflicting directions without executing that procedure.

The reviewer still evaluates placement, duplication, missing content, and
clarity in the instructions encountered, and can make source corrections under
the agreed correction boundary. Read-only simulation does not remove the
reviewer's authoring role.

Evidence from this method supports claims about instruction discovery and
content. Testing the resulting dialogue, document writes, or end-to-end advisor
behavior is deferred until the user exercises it or their actions and answers
are defined precisely enough for a separate test.

## Scenario catalog

The reviewer derives and maintains the navigation scenarios autonomously from
the advisor's entry points. The initial catalog covers these request families:

- establish a new project's foundation;
- start a new feature;
- resume an existing document or phase;
- change an accepted decision;
- ask what work to do next in both an early product with no verified primary
  journey and an established product with working behavior;
- record, recover, or close a deferred item;
- migrate existing documentation;
- perform ordinary code work, checking for unnecessary instruction loading.

For each scenario, the reviewer defines an initial user prompt and the minimum
target-project state needed to distinguish the route. These are starting facts,
not a script of future user answers. The reviewer adds or revises scenarios
when a different entry point or initial state exposes a distinct navigation
branch. An unsettled expected behavior is brought to the user rather than
invented as a test expectation.

## Evidence and navigation verification

Use a navigation trace to connect each finding to an observed path: the initial
request and target state, the files and relevant passages read in order, the
reference or instruction supporting each hop, and any ambiguous choice or
stopping point. A skill selected from its exposed description has that
description as its entry evidence; a route need not consist only of Markdown
links. Keep expected routes and the reviewer's findings outside the simulator's
initial context.

The reviewer identifies the affected passages and explains the concrete defect:
what needed instruction is unreachable, what direction is unclear, what
unnecessary reading is imposed, or which copies risk diverging. Distinguish a
broken route from a branch awaiting user input or absent scenario data. Preserve
deliberate routing summaries under the existing instruction-ownership contract;
less text alone does not establish an improvement.

After a correction, repeat affected navigation scenarios with fresh simulator
contexts and the same starting facts against the revised payload. Include other
catalog scenarios that rely on the changed instruction or route. Compare traces
to establish that the defect is addressed and relevant instructions remain
reachable. Report the scenarios checked, unresolved findings, and branches not
explored; do not claim all advisor behavior works from navigation evidence.

## Existing material

[Interaction flows](interaction-flows.md) contains candidate behavioral
scenarios, including a new feature and instruction discovery. That document is
proposed and contains unresolved decisions and compatibility checks. Its
scenarios are inputs to evaluate, not an already accepted audit specification.

## Maintenance skill

The method is available through
[`audit-advisor-navigation`](../../.agents/skills/audit-advisor-navigation/SKILL.md),
a skill owned by this repository outside `src/`. It is not part of the payload
delivered to target projects. The main agent acts as reviewer and delegates
navigation-only work to fresh simulator contexts.

The skill owns the operational setup and delegation procedure, a maintained
catalog of concrete scenario seeds, and the simulator brief. This artifact owns
the agreed audit boundaries and evidence requirements. The reviewer maintains
scenario inputs and traces as audit evidence outside the simulator's target
view; these records are not guided-project artifacts or phase-coverage records.

Preparation can populate a disposable target with the payload and the scenario's
starting facts; the simulator performs no workflow writes. Fresh conversation
history alone is insufficient if the simulator inherits the maintainer's
advisor-specific instructions or skill contents. When the runtime cannot
provide the agreed separation, retain a prepared packet for a fresh target
session and report that simulation as not run. Static inspection remains
available but does not establish isolated navigation evidence.
