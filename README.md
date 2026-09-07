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

Omit the root and the payload goes to the repository you are working in — the
nearest `.git` at or above the working directory — which the installer names in
its report before writing anything.

Or, from a shell:

```
node bin/init.mjs [--target <target-project-root>]
```

Nothing existing is ever overwritten: a file already present is reported
as skipped, and `CLAUDE.md` / `AGENTS.md` only get their host-specific advisor
reference appended.

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
| `src/target/` | Literal mirror of what a target project receives |
| `src/skills/` | Skills delivered to both skill hosts |
| `src/instructions/` | Seed `CLAUDE.md` / `AGENTS.md`, written only if absent |
| `CONTEXT.md` | The vocabulary of the guided process |
| `docs/` | Documentation of the advisor itself |
| `docs/adr/` | Decision records |

`src/` is product data, never instructions for working on this repository —
which is why no payload asset sits where a tool would auto-load it. `docs/` and
`CONTEXT.md` describe the advisor and are never shipped. The boundary is
specified in
[repository-boundaries.md](docs/architecture/repository-boundaries.md).

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

The scratch target used while developing this repo:

```
node bin/init.mjs --target "C:\Users\sebas\Documents\Code\Passion\delivery-process-target-test"
```

Delivery only ever writes what is absent, so a throwaway target can be
re-delivered into as often as you like — but check the report, since a
`skipped` line means your change to that asset was not applied.

When editing, keep the two halves apart: `src/` is payload authored as data,
everything else is the helper that delivers it. Changing an asset under `src/`
changes the product release; changing `bin/`, `commands/` or `docs/` does not.

## Start reading

- [CONTEXT.md](CONTEXT.md) — the terms the whole process is written in
- [docs/product/overview.md](docs/product/overview.md) — the problem and what the system does
- [docs/architecture/documentation-model.md](docs/architecture/documentation-model.md) — the model inside a guided project
- [docs/architecture/initialization.md](docs/architecture/initialization.md) — the delivery contract
