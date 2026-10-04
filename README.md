# Delivery Process Advisor

> Turn “what should we do next?” into grounded advice—and keep settled answers
> beside the code.

Delivery Process Advisor gives Claude Code and Codex a project-local process for
turning an idea into software that is clear enough to build. It reads the
decisions already recorded in the repository, finds the next useful piece of work,
and helps you work from product intent through architecture and implementation.

It asks one decision-critical question at a time. What you agree becomes the
project's documentation; what you do not agree remains open. The advisor
recommends a path, but never blocks you from choosing another one.

## The short version

Use it when your project has questions like these:

- What do I need to decide before I start coding?
- Is this feature ready for architecture or implementation work?
- Which document owns this rule?
- If this decision changes, what else must change with it?
- How do I keep a useful idea for later without losing its context?

A typical conversation looks like this:

```text
You: I want to add CSV export. What should we decide next?

Advisor: The intended users and exported data are settled. The file contract is
the next useful decision because it unlocks the smallest working export path.
I recommend defining it next; choosing the launch screen is also ready but does
not unblock delivery.

You: Let's define the file contract.

Advisor: Who must be able to consume the exported file?

You: People using Excel, plus our own import tool.

Advisor: That gives us two compatibility requirements...
```

The recommendation is read-only. Once you choose the work, the real exchange
happens with the evidence in your repository. As answers settle, the advisor
writes them into the document that owns them and links dependent decisions
instead of copying the same rule into several places.

Until the product's primary journey works, recommendations favor the smallest
end-to-end implementation that satisfies the settled behavior and constraints.
Once it works, explicit goals, defects, and ready deferred work come before
optional polish.

### What you can ask it to do

```text
Help me define this project before we choose a stack.
```

```text
Let's design offline sync. Ask me what still needs deciding and record the answers.
```

```text
What advisor work makes sense next, and what is blocking the alternatives?
```

```text
Defer multi-user permissions until we begin the collaboration feature.
```

```text
Migrate SPEC.md into the advisor documents.
```

The advisor is designed for a person who is both leading and building a
software project, without a separate analyst or project manager preparing the
decisions first. It structures the design conversation; it does not choose the
product for you or replace the coding agent that implements it.

## Quick start

The advisor runs in both Claude Code and Codex after initialization. The current
installation entry point is a Claude Code plugin.

### 1. Install the plugin

From a shell, register this repository as a marketplace and install the plugin:

```sh
claude plugin marketplace add SebastianoTomasi/delivery-process-advisor
claude plugin install delivery-process-advisor@delivery-process-advisor
```

From a local checkout, pass the path instead:

```sh
claude plugin marketplace add .
```

The same two steps are available as `/plugin marketplace add ...` and
`/plugin install ...` inside a Claude Code terminal session. The IDE extension
has no `/plugin`, so use the shell form there.

Installing the plugin only makes the initialization helper available. It does
not change a project yet.

### 2. Initialize a project

From a Claude Code session, deliver the advisor into a project root:

```text
/delivery-process-advisor:init <target-project-root>
```

You can omit the root. The helper then selects the nearest directory containing
`.git` at or above the working directory. If it finds none, it uses the working
directory. It prints the selected target before writing anything.

From a shell in this checkout, run the same helper directly:

```sh
node bin/init.mjs [--target [<target-project-root>]]
```

An explicit `--target` value always wins. The exact behavior is documented in
the [target-selection contract](docs/architecture/initialization.md#target-selection).

### 3. Start a conversation

Open Claude Code or Codex in the initialized repository and ask:

```text
What should we work out next?
```

The agent will follow the repository's advisor instructions, inspect only the
relevant project documents, explain its evidence, and suggest a focused next
step. You can also start directly with a project idea, a feature, an existing
document to migrate, or a proposal you want pressure-tested.

## What initialization adds

Initialization puts the process where the work happens: inside the target
repository.

| Destination | Purpose |
| --- | --- |
| `advisor-agents.md` | Routes an agent through the advisor process |
| `docs/` | Scaffolds and question catalogs for each decision authority |
| `docs/handoffs/` | Project-owned temporary conversation handoffs |
| `.agents/skills/` | The canonical project-local advisor skills |
| `.claude/skills/` | Relative links to those same skills for Claude Code |
| `AGENTS.md` / `CLAUDE.md` | Seed files or appended references that activate the advisor |

Deferred work uses `advisor:deferred` issues in the project's configured tracker.
Configure it through `docs/agents/issue-tracker.md` and
`docs/agents/triage-labels.md`; these project-owned files are not delivered by
initialization. Existing `docs/deferred/` files remain an archive until an
explicit migration is requested.

The report names every destination and says whether it was written, replaced,
linked, appended, skipped, or removed. Advisor-owned scaffolds and skills are
brought to the invoked release. Project-owned deferred items, handoffs, and
instruction content are preserved according to the
[initialization contract](docs/architecture/initialization.md).

On Windows, creating the relative skill links may require Developer Mode or an
appropriately privileged invocation. If link creation is denied,
initialization stops with a diagnostic instead of silently creating a different
kind of copy.

A successful run means the delivery operations completed. It does not certify
that pre-existing skipped files or links work, or that every host can load the
installed skills.

---

## The deeper model

The rest of this README explains why the repository has this shape and what the
advisor is doing beneath the simple conversation.

### Decisions have owners

The `docs/` tree is divided by **authority**: the kind of decision a document
is allowed to own.

| Authority | Examples of what it owns |
| --- | --- |
| Product | Users, problems, outcomes, capabilities, and scope |
| Frontend | User-visible behavior, flows, states, and input rules |
| Architecture | System boundaries, components, contracts, and data movement |
| Implementation | Significant internal design across clients, servers, CLIs, jobs, and local apps |
| Security | Control requirements and security-specific rules |
| Deployment | Release and environment decisions |
| Operations | Runtime procedures, recovery, and operational responsibilities |
| Development | Contributor and engineering workflow |
| Stack | Shared technology choices and constraints |

A rule has one authoritative home. Other documents link to it and explain why
they depend on it. This makes a changed decision traceable and avoids several
copies drifting apart.

Files whose names begin with `advisor-` belong to the process: they route the
agent and enumerate questions. They do not contain your project's decisions.
Those are written only as you settle them.

### The process grows vertically

The advisor starts with a deliberately thin project foundation:

1. define the product;
2. establish the shared language in `CONTEXT.md`;
3. decide the architectural shape needed to begin feature work.

It then moves feature by feature through the usual route:

```text
Product → Frontend → Architecture → Implementation
```

This is guidance, not a gate. A particular decision can be ready early when its
accepted inputs are sufficient and the remaining open choices cannot invalidate
it, including a feature decision before the initial foundation is complete.
Conversely, a folder or an `accepted` marker does not prove that an entire phase
is complete. The advisor checks the relevant question catalog and the meaning
of the documents before making that claim.

Feature decisions live together under:

```text
docs/features/<feature-slug>/<authority>/
```

Shared rules stay at project scope. For example, a shared authentication policy
does not get copied into every feature, while a recovery procedure needed only
by one import feature can remain with that feature.

### Documents are working project state

The line below an advisor document's title identifies its state. The complete
marker rules live in the initialized project's `docs/advisor-docs.md`.

- `proposed` means the document contains unsettled work.
- `accepted` means other decisions may rely on its settled content.
- `needs-review` means a known change or interruption left specified work to
  reconcile.

An inapplicable catalog question is dismissed explicitly by name. Silence is
not treated as an answer. This lets the advisor distinguish “we decided this
does not apply” from “we forgot to discuss it.”

### The skills divide the work

The installed skills provide a small set of deliberate interaction modes:

- `advisor-next-work` assesses the current documentation and implementation and
  recommends one next action without starting it.
- `advisor-grill-with-docs` asks one question at a time and writes each settled
  answer into the project documents.
- `advisor-grill-me` pressure-tests a proposal without changing project files.
- `advisor-domain-modeling` keeps shared terminology and important architectural
  decisions coherent.
- `advisor-defer` records and later recovers work that can safely wait.
- `advisor-handoff` creates an explicit temporary bridge to a fresh conversation.
- `advisor-migrate-docs` moves selected existing documents into the advisor
  structure without keeping duplicate source copies.

You do not need to memorize these names for ordinary use. Describe the outcome
you want and the agent can select the applicable skill. The handoff skill is the
exception: it runs only when explicitly requested, because handoffs are
temporary. The continuation session closes an identified handoff after use,
and you can also request closure explicitly.

### Deferred work, handoffs, and changed decisions

These solve three different problems:

- **Deferred work** is a durable idea, question, or concern for later. It keeps
  its context and revisit condition in an `advisor:deferred` issue in the
  configured tracker, and resurfaces when it becomes relevant.
- **A handoff** moves an active conversation into a fresh session. It records
  the next objective and current state under `docs/handoffs/`; you identify it
  to the next session, which preserves durable information and removes the
  handoff when the session ends. You can also request closure explicitly.
- **A changed decision** updates its one owning rule and then follows dependency
  links through every affected document. An interrupted propagation uses
  `needs-review` to say what remains inconsistent.

Important decisions can keep their reasons and source links in ADRs. Sources
inform the work, but they become binding only when the project records the rule
in its own authoritative document.

### Delivery and ownership

The helper is intentionally mechanical; all judgment lives in the skills.

- `src/target/` is the literal advisor scaffold delivered into a project.
- `src/skills/` contains the delivered skills.
- `bin/init.mjs` maps those assets to their destinations and reports each
  operation.

Advisor-owned destinations are updated to the invoked release. Project-owned
destinations are created when absent and otherwise left alone. Existing
`AGENTS.md` and `CLAUDE.md` files receive only the host-specific advisor
reference when needed. Initialization never writes through an occupied
instruction-file link.

Skill files are written once under `.agents/skills/`. Relative directory links
under `.claude/skills/` let both hosts use the same copy and continue to work if
the project directory moves. Old independent Claude skill copies, junctions,
and links at advisor-owned destinations are replaced by the release's relative
links. Files no longer shipped inside a canonical advisor skill directory are
pruned. See the [skill-host contract](docs/architecture/initialization.md#skill-hosts)
for the exact rules.

### This repository uses itself

This repository is both the source of the advisor and a project guided by it.
The roles remain separate:

| Path | Role |
| --- | --- |
| `.claude-plugin/` | Plugin manifest and marketplace entry |
| `bin/init.mjs` | Delivery helper—the only code that changes a target |
| `commands/init.md` | Claude Code `/init` command wrapper |
| `src/target/` | Literal mirror of the target-project scaffold |
| `src/skills/` | Source skills delivered to target projects |
| `src/instructions/` | Seed `CLAUDE.md` and `AGENTS.md` files |
| `test/` | Installer regression tests and fault injection |
| `docs/` | This product's own accepted and proposed design decisions |
| `docs/deferred/` | Legacy archive, consulted only for an explicit migration |
| `docs/handoffs/` | Temporary conversation transfers for this repository |
| `CONTEXT.md` | Vocabulary of the advisor product |

Files under `src/` are product data to author. The installed instructions and
scaffolds at the repository root are derived copies. Editing one does not
automatically update the other. The
[repository boundary](docs/architecture/repository-boundaries.md#self-application)
defines the distinction.

## Contributing

An installed plugin is a snapshot, not a live link. Claude Code copies it into
its plugin cache from the pushed repository and keeps that copy until the
`version` in `.claude-plugin/plugin.json` changes. Editing this checkout
therefore does not change the installed `/delivery-process-advisor:init`
command, and neither does a push that leaves the version as it was. To publish
a change, raise the patch version, commit and push it, then update the
marketplace and the plugin:

```sh
claude plugin marketplace update delivery-process-advisor
claude plugin update delivery-process-advisor@delivery-process-advisor
```

For a normal edit-and-try loop, run the checkout directly against a throwaway
repository:

```sh
node bin/init.mjs --target <a-throwaway-repo>
```

Run the installer regression suite with Node's built-in test runner:

```sh
node --test test/init.test.mjs
```

The tests create and remove temporary plugin copies and target projects. They
exercise real relative symlinks, so Windows must permit symlink creation. They
also test permission failures and programming defects through controlled fault
injection without changing machine settings.

The current development scratch target is:

```powershell
node bin/init.mjs --target "C:\Users\sebas\Documents\Code\Passion\delivery-process-target-test"
```

Delivery is safe to rerun against a throwaway target because advisor-owned
destinations converge on the invoked release and project-owned destinations are
preserved. Still inspect the report: `skipped` means only that a project-owned
destination was left as found. Delivery is not transactional, so inspect a
target after an interrupted run before retrying.

See [Working on the advisor repository](docs/development/repository-workflow.md)
for the complete contributor rules.

## Continue reading

- [Product description](docs/product/overview.md) — the problem, users,
  capabilities, and boundaries.
- [Guided-project documentation model](docs/architecture/documentation-model.md)
  — authorities, scopes, artifacts, and decision readiness.
- [Initialization](docs/architecture/initialization.md) — the complete delivery
  contract.
- [Repository boundaries](docs/architecture/repository-boundaries.md) — product
  source, installed instructions, and self-application.
- [Interaction flows](docs/development/interaction-flows.md) — acceptance
  scenarios and open product decisions.
- [Presets](docs/architecture/presets.md) — the proposed shared-preset design.
