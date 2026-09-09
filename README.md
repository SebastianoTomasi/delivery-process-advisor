# Delivery process advisor

A Claude Code / agent plugin that guides a software project's decisions and
normative documents through a known process: define the product, fix the
language, decide the architecture, design the realization — one feature at a
time, over a deliberately thin foundation.

It advises, it never blocks. The work runs in the target project's own
repository, and the project holds the process it follows.

## How it works

The plugin delivers a **payload** into a target project: a documentation
scaffold under `docs/`, skills, and seed instruction files. From then on the
skills read the project's own files to place each feature in the process,
explain what a piece of work is missing, prescribe the next action, and run the
advisor-grill-with-docs sessions that write the answers down.

The split is deliberate: the installer decides nothing and is small enough to
verify by reading; everything requiring judgement lives in the skills.

## Install

From a shell — registers this repository as a marketplace, then installs the
plugin from it:

```
claude plugin marketplace add SebastianoTomasi/delivery-process-advisor
claude plugin install delivery-process-advisor@delivery-process-advisor
```

From a local checkout, pass the path instead: `claude plugin marketplace add .`

The same two steps are available as `/plugin marketplace add ...` and
`/plugin install ...` inside a Claude Code **terminal** session; the IDE
extension has no `/plugin`, so use the shell form there.

Installing gets you the helper, not the process: the payload rides along in
the installed copy and reaches nothing until you run `init` against a target.

## Use it

From a Claude Code session, deliver the payload into a project root:

```
/delivery-process-advisor:init <target-project-root>
```

Omit the root — either together with `--target` or by omitting the option — and
the helper selects the nearest directory containing `.git` at or above the
working directory. If none exists, it selects the working directory itself.
The installer names the default target in its report before writing anything;
an explicit `--target` value takes precedence. See the
[target-selection contract](docs/architecture/initialization.md#target-selection).

Or, from a shell:

```
node bin/init.mjs [--target [<target-project-root>]]
```

Nothing existing is ever overwritten: a file or link already present is
reported as skipped. `CLAUDE.md` / `AGENTS.md` only get their host-specific
advisor reference appended when they are regular files. A linked instruction
file is never modified through the link: it is skipped if the exact reference
is already readable, and otherwise delivery fails with a concise diagnostic.

Skill files go to `.agents/skills/<skill>/`. The helper creates a relative
directory symlink from `.claude/skills/<skill>`, so both hosts share those files.
If the relative link cannot be created, initialization fails with a concise
diagnostic; it creates no junction or independent copy. On Windows a permission
failure may require Developer Mode or an appropriately privileged invocation
before retrying. Existing Claude skill destinations are skipped, including old
junctions and copies. See the [skill-host contract](docs/architecture/initialization.md#skill-hosts).

A successful run confirms that delivery operations completed; it does not
certify that skipped files or links work or that an agent can load them.

## In a guided project

This README is the only account of the process written for a person. Everything
delivered into a target project is written for the agent working there, so a
project that received the payload holds the process and not the case for it —
read that here, and read `docs/` there.

**Why `docs/` has that shape.** Every rule has one owning authority and one
authoritative document, and the folders under `docs/` are those authorities:
shared Product decisions sit in `docs/product/`, shared Architecture decisions
in `docs/architecture/`, and so on. Any authority can also hold decisions for
one feature in `docs/features/<feature-slug>/<authority>/`. Documents link across
authorities instead of repeating each other, so a rule has exactly one place
where it can be wrong. A
file whose name begins with `advisor-` belongs to the process rather than to
the project: it asks questions and decides nothing.

**What is written, and when.** Nothing is written in advance. The folders exist
from the first day so the map of the work ahead is visible, but a document that
decides something is created only by the session that decides it. The work runs
vertically, on features, over a deliberately thin foundation — a project-scoped
Product description and Architecture shape. Once those are accepted a feature
can begin, and different features may sit at different points at the same time.
A feature holds its documents in `docs/features/<feature-slug>/`, one folder
per authority, created only when there is an artifact to put there. Folder
presence does not prove phase completion.
The slug is confirmed lowercase ASCII kebab-case; the readable name remains in
the documents.
Implementation covers significant internal design for clients, servers, local
applications, CLIs, and jobs. Shared implementation conventions, the default
frontend surface, the stack, a security policy — each is written when a feature
first needs it, and its absence is a
need that has not arisen rather than a decision against it.

**Reading a document's state.** The line directly below a document's title says
what kind of document it is and whether other work can rest on it; the markers
are listed in the project's own `docs/advisor-docs.md`. A question with no
substance in that project is answered with one explicit line saying so, naming
the question — silence is never read as inapplicability.

**How to obtain advice.** Ask the agent working in the repository what to do
next. It starts with document markers and scopes, then reads the decision
dependencies and passages needed to explain what is ready and why. Product →
Frontend → Architecture → Implementation is the usual feature route; a decision
can be ready before the preceding phase is complete when its accepted inputs
suffice and the remaining choices cannot invalidate it. The agent names its
evidence and distinguishes ready decisions from whole-phase completion. The
advice does not bind you: nothing is recorded when you proceed
otherwise, and nothing returns later to say the advice was given. It is offered
again only while the state of the project still implies it.

**When a question can wait.** Initialization creates the empty
`docs/handoffs/` directory, and a session records each agreed handoff there as
one Markdown file. It keeps the question, project or feature context,
destination, and when to revisit it. When you ask what to do next or resume
relevant work, the advisor reads these records and checks which questions are
ready, still waiting, or already answered. Unclassified handoffs are surfaced
too. A resolved record links to the accepted answer in `docs/`; no external
tracker or issue-creation skill is needed.

**When a decision changes.** A new proposal leaves existing accepted rules in
force. An agreed change starts a focused session that follows dependencies,
settles new choices, and updates the affected documents until they are coherent.
Important decisions keep reasons and informative source links in ADRs; current
rules link to those records. If the session is interrupted, `needs-review`
records the cause, changed decision, relevant ADR, and remaining work so another
session can finish it.

**When you already have documents.** Ask the agent to use `advisor-migrate-docs`
with the documents you want to migrate. It reorganizes their content into the
advisor structure, asks only questions needed for the transfer, and reports
missing design decisions as later work. Identify current specifications so
their explicit decisions can be carried forward. After checking the replacements
and repairing references, it removes or rewrites the in-scope originals in the
target project; it keeps no source copies or archives. Migration can finish
while some artifacts remain proposed and phases remain incomplete.

## Layout

| Path | What it is |
| --- | --- |
| `.claude-plugin/` | Plugin manifest and marketplace entry |
| `bin/init.mjs` | The installer — the only thing that touches a target |
| `commands/init.md` | The `/init` slash command wrapping it |
| `test/` | Installer regression tests and child-process fault injection |
| `src/target/` | Literal mirror of what a target project receives |
| `src/skills/` | Skills delivered as files to `.agents/skills/`, linked from `.claude/skills/` |
| `src/instructions/` | Seed `CLAUDE.md` / `AGENTS.md`, written only if absent |
| `CONTEXT.md` | The vocabulary of the guided process |
| `docs/` | Documentation of the advisor itself |
| `docs/adr/` | Decision records |

This repository uses the advisor to build itself. Installed advisor
instructions, scaffolds, catalogs, and skills govern work here; project
artifacts under `docs/` describe the advisor product. Those artifacts and
`CONTEXT.md` are not payload for other projects.

`src/` remains product data to author, distinct from the installed instructions.
The [repository boundary](docs/architecture/repository-boundaries.md#self-application)
and [contributor guidance](docs/development/repository-workflow.md) explain these
roles. Editing one copy does not automatically update the other.

## Contributing

**An installed plugin is a snapshot, not a live link.** It is copied into
`~/.claude/plugins/cache/` from the pushed GitHub repo and pinned to the commit
it was installed at, so editing this working tree changes nothing about the
`/delivery-process-advisor:init` you can run. To pick up a change: commit,
push, then update the marketplace and reinstall the plugin.

For a normal edit-and-try loop, skip the plugin and run the checkout, which
always reflects your working tree:

```
node bin/init.mjs --target <a-throwaway-repo>
```

Run the installer regression suite with Node's built-in test runner:

```
node --test test/init.test.mjs
```

Tests create and remove their own temporary plugin copies and target projects.
They exercise real relative symlinks, so Windows must permit symlink creation.
Permission failures and programming defects are also tested through controlled
fault injection in child processes; the suite changes no machine settings.

The scratch target used while developing this repo:

```
node bin/init.mjs --target "C:\Users\sebas\Documents\Code\Passion\delivery-process-target-test"
```

Delivery only ever writes what is absent, so a throwaway target can be
re-delivered into as often as you like — but check the report, since a
`skipped` line means your change to that asset was not applied. If a previous
run was interrupted while writing one file,
inspect and remove that partial destination before retrying; initialization
does not stage or identify incomplete writes.

Keep payload source, delivery code, installed advisor instructions, and project
artifacts distinct. Changes under `src/` change delivered content; `bin/` and
`commands/` change the helper; project artifacts under `docs/` change the design.
Use the [contributor guidance](docs/development/repository-workflow.md) when
working on those boundaries.

## Start reading

- [CONTEXT.md](CONTEXT.md) — the terms the whole process is written in
- [docs/product/overview.md](docs/product/overview.md) — the problem and what the system does
- [docs/architecture/documentation-model.md](docs/architecture/documentation-model.md) — the model inside a guided project
- [docs/architecture/initialization.md](docs/architecture/initialization.md) — the delivery contract
- [docs/development/interaction-flows.md](docs/development/interaction-flows.md) — proposed acceptance scenarios and their open decisions
- [docs/architecture/presets.md](docs/architecture/presets.md) — proposed shared preset mechanism
