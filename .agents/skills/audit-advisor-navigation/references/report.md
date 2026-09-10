# Reviewer report structure

Use this compact structure for a run. Keep the general audit's historical report
unchanged when a later focused audit verifies different versions.

## Result and scope

State what was changed and what was actually verified. Name the starting
working-tree baseline, accepted design passages used, selected instruction
routes, and exclusions. State live execution limitations early.

## Scenario evidence

| Case / fixture revision | Payload / tools / host | Execution state | Reviewed navigation outcome | Stop and residual ambiguities | Evidence |
| --- | --- | --- | --- | --- | --- |
| Case ID and starting-data revision | Exact versions or explicitly unknown | completed / interrupted / setup_error / not_run | supported / defect / inconclusive / not reviewed | Expected missing input, uncertain premise, incomplete search, or open branch | Input, result, trace and logs |

Execution state comes from the launcher. Navigation outcome is the reviewer's
comparison with expected obligations, not a process status or simulator's own
claim of success. Missing user input may be the correct stopping point. A
completed trace can expose a defect; an interrupted process does not prove one.

For each residual ambiguity, say whether it concerns fixture semantics, a
resolved interpretation of instructions, an unresolved payload choice, or a
tool limitation. Do not drop it from the report merely because the route reached
an acceptable stopping point.

## Findings, corrections and comparisons

For each source correction, link the concrete before evidence, owning passage,
change and after evidence. Name actual differences in reading or interpretation.
Keep static findings distinct from observations. If the earlier version already
worked, say so; a clearer instruction is not demonstrated behavioral improvement.

Hold prompt, fixture facts and host/tool setup constant in a before/after claim.
If a fixture was corrected, record the new revision and compare that revision
on both payloads. Earlier invalid fixtures remain provenance, not final evidence.
If only some regressions ran on the final payload, name those cases explicitly.

## Verification and remaining work

Separate tool tests, initializer tests and actual navigation simulations. Link
preserved payload/fixture bytes, path mapping and the commands or suite needed
to reproduce the case. Name prepared but unexecuted cases and the reason.
List branches not explored and any semantic choices requiring the user. Do not
certify interviews, artifact writes, phase acceptance or full advisor behavior
from navigation-only evidence.
