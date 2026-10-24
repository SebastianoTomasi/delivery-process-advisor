# Delivery Process Advisor

A project-local process for turning an idea into software that is clear enough
to build, for Claude Code and Codex.

The advisor reads the decisions already recorded in your repository, tells you
which decision is worth settling next, and asks about it in numbered rounds,
each question with a recommended answer. What you agree is written into the
document that owns it under `docs/`; what you leave open stays open. It
recommends a path and never blocks you from choosing another.

Ask it things like:

- What do I need to decide before I start coding?
- Is this feature ready for architecture or implementation work?
- If this decision changes, what else must change with it?
- Keep this idea for later without losing its context.

## Install

### 1. Install the plugin

```sh
claude plugin marketplace add SebastianoTomasi/delivery-process-advisor
claude plugin install delivery-process-advisor@delivery-process-advisor
```

From a local checkout, use `claude plugin marketplace add .` instead. Inside a
Claude Code terminal session the same steps are `/plugin marketplace add` and
`/plugin install`; the IDE extension has no `/plugin`, so use the shell there.

This only installs the initialization command. It changes no project yet.

### 2. Install Matt Pocock's skills

The advisor runs its sessions through skills from
[mattpocock/skills](https://github.com/mattpocock/skills): `grill-with-docs`,
`to-tickets`, `implement`, `handoff`, `grilling`, and `domain-modeling`. Install
them for the host you use:

```sh
# Claude Code
claude plugin install mattpocock-skills@claude-plugins-official
```

```sh
# Codex
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

Then, once per project, run `/setup-matt-pocock-skills`. Among other things it
writes `docs/agents/issue-tracker.md`, which the advisor uses for deferred
work. Without these skills, the steps that need them cannot run.

### 3. Initialize your project

In a Claude Code session opened in the project:

```text
/delivery-process-advisor:init
```

Pass a path to target another repository. Without one, the helper picks the
nearest directory containing `.git` at or above the working directory and
prints it before writing. From a checkout of this repository you can run the
same helper directly:

```sh
node bin/init.mjs --target <project-root>
```

Initialization adds:

| Destination | Purpose |
| --- | --- |
| `AGENTS.md` | Created, or appended with the advisor references, for both hosts |
| `advisor-agents.md` | Routes an agent through the advisor process |
| `docs/` | Scaffolds and question catalogs for each decision authority |
| `.agents/skills/` | The advisor's skills: `next-work`, `propagate-change`, `migrate-docs` |
| `.claude/skills/` | Relative links to those skills for Claude Code |

Re-running it is safe: advisor-owned files converge on the installed release,
project-owned files are left alone, and the report says what happened to each
destination. On Windows the skill links need Developer Mode or an elevated
shell; if link creation is denied, initialization stops with a diagnostic.

### 4. Start a conversation

Open Claude Code or Codex in the initialized repository and ask:

```text
What should we work out next?
```

Or start directly: `/grill-with-docs` on a project idea or feature, "Migrate
SPEC.md into the advisor documents", "Defer multi-user permissions until the
collaboration feature".

## How it works

**Decisions have owners.** `docs/` is divided by authority: Product, Frontend,
Architecture, Implementation, Security, Deployment, Operations, Development,
Stack. A rule lives in one document; others link to it. Files named
`advisor-*` belong to the process and hold no project decisions.

**It grows vertically.** Define the product, settle the shared vocabulary in
`GLOSSARY.md`, decide the architectural shape needed to start, then move
feature by feature through Product → Frontend → Architecture → Implementation
under `docs/features/<feature-slug>/<authority>/`. This is guidance, not a
gate: a decision is ready when its inputs are settled.

**Documents carry their state.** `proposed` holds unsettled work, `accepted`
may be relied on, `needs-review` marks an interrupted change. A catalog
question that does not apply is dismissed by name, so silence is never an
answer.

**Three kinds of later.** Deferred work is a `deferred` issue in the configured
tracker. A handoff moves a conversation to a fresh session through Matt
Pocock's `handoff`. A changed decision updates its owning rule, then
`propagate-change` follows the dependency links.

Further reading: [product overview](docs/product/overview.md),
[documentation model](docs/architecture/documentation-model.md),
[initialization contract](docs/architecture/initialization.md),
[repository boundaries](docs/architecture/repository-boundaries.md).

## Contributing

This repository is both the advisor's source and a project guided by it.

| Path | Role |
| --- | --- |
| `src/target/`, `src/skills/`, `src/instructions/` | The payload delivered into projects |
| `bin/init.mjs` | The delivery helper, the only code that changes a target |
| `commands/init.md` | The Claude Code `/init` command |
| `test/` | Installer tests, including fault injection |
| `docs/`, `GLOSSARY.md` | This product's own decisions |

Edit the payload under `src/`, then regenerate the installed copy in this
repository with `node bin/init.mjs` and commit both together. Try changes
against a throwaway repository:

```sh
node bin/init.mjs --target <a-throwaway-repo>
```

Run the tests (Windows must allow symlink creation):

```sh
node --test test/init.test.mjs
```

An installed plugin is a snapshot. To publish a change, raise `version` in
`.claude-plugin/plugin.json`, push, then update:

```sh
claude plugin marketplace update delivery-process-advisor
claude plugin update delivery-process-advisor@delivery-process-advisor
```

See [working on the advisor repository](docs/development/repository-workflow.md)
for the full contributor rules.

## License

[MIT](LICENSE)
