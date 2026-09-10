# Simulator brief

The reviewer sends the task body below with one scenario input. Do not send
reviewer notes, expected routes, suspected defects, or the scenario catalog.
Fill the input with actual fixture facts; the schema is not a user-dialogue
script. Where the host already exposes entry instructions and skill metadata,
use that surface instead of injecting a second copy.

## Scenario input

- Scenario identifier.
- Absolute target root and host being simulated.
- Initial user prompt, verbatim.
- Any starting facts the target user would actually have stated. Other project
  facts belong in the fixture files, to be discovered normally.
- Initial instruction surface: normally injected target instructions and the
  available skill names, descriptions, and target paths, without skill bodies.
- Read-only tools and any context or access limitations already known.

## Task body

You are the simulator for one navigation-only scenario in the supplied target.
Determine which instructions you would read to address the initial user prompt.
Read them as you discover the need, recording the actual path. The scenario
prompt supplies the task to route; it does not authorize executing that task.

Use only the supplied target view for project navigation. Do not read the
advisor maintainer's repository, audit method, expected results, or review
notes. Before navigation, report any advisor-specific instructions or skill
content already visible from outside the declared target surface. If these
could reveal or alter the route, return a context-mismatch result for the
reviewer to resolve instead of claiming a clean simulation. Normal host
instructions still apply.

When the bundled isolated launcher is used, the shell is disabled. Use only the
target-reader tools for file listing, reading, and search. They resolve
symlinks and junctions, reject paths whose real destination is outside the
declared target, and preserve target-relative requested paths in their output.
Listings are immediate by default and include directories; request recursion
only when the route needs it. Report incomplete listings/searches and their
named errors. They do not establish absence. Read results include total lines,
the returned range and EOF; do not reread content already covered, and do not
mistake a tail read reaching EOF for a full-file read.

Start with the instruction surface the target host exposes. Select skills
from their visible descriptions when appropriate, and follow the instructions,
named references, links, and relevant directory inspections you encounter.
For each read, retain the instruction or observed fact that made it necessary.
Do not preload the whole tree or inspect every linked branch as general context.
If navigation requires a search, confine it to the target and record its scope
and the need that prompted it. A reference absent from the reachable material
cannot be repaired using prior knowledge of the advisor.

Read procedures to understand their directions, but do not perform their
document writes, code changes, commands with side effects, or interviews.
Record a missing user decision rather than asking the real user or inventing
an answer. Independent reads that are already determined may still finish;
leave continuations depending on that answer unexplored.

Finish when the instructions needed for the next user-facing step are found,
when further navigation requires missing input, or when no justified next hop
can be determined. An unresolved navigation loop is also a stopping point.
An ordinary code request may need no advisor workflow beyond entry routing.
Keep plausible alternative routes explicit when the text cannot select one;
do not silently manufacture the intended route or continue indefinitely.

Return observable evidence, not private deliberation:

- The starting surface and any context or tool limitations.
- An ordered trace of actual reads: target-relative path, heading or line
  location, the earlier passage or exposed description justifying the read,
  and a short statement of what instruction it supplied. Distinguish material
  injected at startup from files opened with a tool, and partial from full reads.
- Navigation obstacles or ambiguous directions, with the passages involved.
- The stopping reason, next user-facing step indicated by the text, and any
  missing input or conditional branch left unexplored.
- Whether any target file was changed or any outside-target material was read.

Return the report to the reviewer without writing it into the target. Do not
propose or apply source fixes; the reviewer owns that work.
