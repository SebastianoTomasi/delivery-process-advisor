# Execution and evidence

Read this when preparing targets or running the local tools. The accepted audit
method owns what evidence means; these scripts automate its collection.

## Prepare a case

1. Preserve the current `src/` payload and initializer version, and record the
   existing working-tree changes. Create a fresh empty target directory outside
   this repository's instruction ancestry. Run `node bin/init.mjs --target <root>`.
   Inspect the delivered skill paths and relative host links.
2. Add the scenario's minimal synthetic project files. Preserve those fixture
   bytes outside the target. Do not overlay fixture files on delivered advisor
   instructions. Use a separate composed fixture directory per case when several
   fixture fragments are combined; it identifies the exact facts being tested.
3. Save the scenario input outside the target using the fields in
   [simulator.md](simulator.md). Save reviewer expectations separately. Never put
   expected routes, suspected defects or audit notes into the simulator input.
4. Run the local link check, then review the relevant semantic premises: do
   cited accepted passages actually say what the fixture claims, are proposed
   decisions kept distinct, and does the intended navigation distinction exist?

```text
node .agents/skills/audit-advisor-navigation/scripts/check-fixture.mjs --target <root> --output <check.json>
```

The check covers common inline/reference Markdown links, local paths and ATX
heading anchors, including duplicate heading suffixes. It ignores fenced code
examples and external URLs; it reports dynamic paths for review. It is not a
complete Markdown parser. Review unusual syntax, setext headings and semantic
consistency manually. Reference definitions are checked, including those used
by shortcut references. Do not delete an intentional
fixture defect merely to make this check pass; document that distinct scenario
and run it individually when the defect itself is the subject of the test.

The installer mapping is `src/target/**` to the identical target path;
`src/skills/*/skill-asset.md` to `.agents/skills/*/SKILL.md`, other skill assets
beside it, and instruction seeds to the host instruction files. Read the current
installer for remaining destinations and links; preserve that version with the
audit baseline. The launcher does not install or infer fixture composition.

## Run one case

```text
node .agents/skills/audit-advisor-navigation/scripts/run-simulator.mjs --target <root> --scenario <input.md> --output <new-trace.md> --payload <preserved-src-directory> --fixtures <composed-fixture-directory>
```

`--payload` and `--fixtures` preserve separately identifiable source and fixture
snapshots. They are optional for compatibility with already-prepared targets;
without them the result records null separate revisions and still preserves the
complete target snapshot. Do not claim separate payload/fixture provenance when
it was not supplied and independently checked against the delivered target.
These reviewer inputs are never sent to the simulator.

Each invocation saves `<new-trace.md>.evidence/` beside the trace:

- Exact scenario, simulator brief and combined prompt, plus executing tool sources.
- Target snapshots before and after, including regular-file bytes, empty
  directories and internal link destinations. `.git` is explicitly excluded;
  outside or dangling links fail snapshot preparation instead of being followed.
- Optional payload and fixture snapshots. SHA-256 revisions derive from sorted
  path/type/hash/link entries, independent of the absolute snapshot root. File
  bytes are stored as base64 inside the JSON snapshot; hashes alone would not
  preserve a reproducible baseline.
- JSONL runtime events, stderr, timestamps, executable/version, command arguments,
  usage when emitted, exit information and independently compared target hashes.
- `result.json`, with execution state and `navigationVerdict: not_reviewed`.
  The reviewer supplies the navigation judgement in the report, never by treating
  exit code zero as proof of a valid route.

Existing traces or evidence directories are refused, including destinations
reached through links. Scenario and evidence paths must resolve outside the
target. Invalid paths may prevent creating a result file; retain the command's
diagnostic as setup evidence. A missing or changed target is not a clean run.

The launcher starts a fresh ephemeral Codex process at the target, ignores user
configuration, disables `shell_tool`, fixes `sandbox_mode="read-only"`, and
exposes the confined MCP reader. `--approve-for-me` routes MCP approvals through
automatic review; it does not restore the disabled shell. Authentication still
uses the host's normal Codex state. No authentication files are archived.

`--codex <executable>` selects a local CLI path. `--timeout-ms <milliseconds>`
sets the per-simulation timeout (default ten minutes). Keep the same host/model
settings and tool versions for comparisons, or disclose changes. Confirm the
actual starting surface from the trace and runtime evidence; command arguments
alone do not prove what advisor context a host injected.

## Reader semantics

- `list_files` lists immediate entries with file/directory types, including empty
  directories. Set `recursive: true` only when a recursive inventory is justified.
- `read_file` reports `total_lines`, returned start/end, and `eof`. A read from
  line 20 to EOF does not prove lines 1–19 were read. Avoid rereading a complete
  file merely because it was requested as a bounded opening.
- `search` is recursive within its named scope. Listings and searches return
  `complete: false` with named errors when some entries cannot be inspected.
  They may still contain useful partial results. Carry that limitation into
  the trace; do not interpret it as evidence that no matching work exists.

All operations check lexical and real paths. Internal aliases retain their
requested target-relative names, while ancestor tracking stops directory cycles.
An explicit outside path is rejected. A forbidden child encountered during an
inventory is reported as an incomplete operation without reading its content.

## Batches and resumption

A reviewer-owned suite JSON contains `outputDir` and `cases`. Paths are relative
to the suite file unless absolute. Case IDs are unique lowercase kebab-case.

```json
{
  "outputDir": "results",
  "cases": [
    {
      "id": "capture-existing",
      "target": "C:/temporary-projects/capture-existing",
      "scenario": "inputs/capture-existing.md",
      "payload": "payload-after",
      "fixtures": "fixtures/capture-existing"
    }
  ]
}
```

```text
node .agents/skills/audit-advisor-navigation/scripts/run-batch.mjs --suite <suite.json>
node .agents/skills/audit-advisor-navigation/scripts/run-batch.mjs --suite <suite.json> --resume
```

The batch checks local links and fingerprints the starting inputs, then runs
cases sequentially. It saves an attempt path before spawning, never overwrites
an earlier attempt, and leaves navigation verdicts to the reviewer. Quota,
rate-limit, authentication and signal interruptions stop further launches and
retain queued cases as `not_run`. There is no automatic retry loop. Independent
fixture failures are recorded and do not prevent other cases from running.

Batch checkpoints are replaced atomically after writing a complete temporary
file, so an interrupted write preserves the previous checkpoint. Resume only
after the blocking condition changes. Completed cases are reused
only when their recorded inputs still match; interrupted cases receive new
attempt paths. A changed suite, fixture, payload or scenario requires a new run,
not a resume that silently changes the comparison. The batch also pins the CLI
executable/version, runtime arguments, Node/platform, tool sources and simulator
brief; changing these requires a new run. Default model changes not exposed by
the host still need reviewer scrutiny. A hard-killed process may
leave partial evidence; the saved attempt path prevents overwriting it.

Execution states are `completed`, `interrupted`, `setup_error`, and `not_run`.
Completion requires exit zero, a nonempty final trace and unchanged target bytes;
the reviewer must still check context isolation, route correctness and limitations.

## Verify tool changes locally

Before a real simulation after reader or launcher changes, run:

```text
node --test .agents/skills/audit-advisor-navigation/scripts/test-target-reader.mjs .agents/skills/audit-advisor-navigation/scripts/test-execution.mjs
```

Tests use synthetic temporary directories and a local fake CLI, including
confinement, incomplete searches, EOF, archival, quota pauses and resumption.
They make no model or network calls. Passing them verifies tool mechanics, not
advisor navigation. An unavailable real runtime leaves live integration untested;
do not weaken isolation to work around that limitation.
