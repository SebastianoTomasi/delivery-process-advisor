# Navigation scenarios

Reviewer material. Maintain this catalog when a new entry point or project
state exposes a distinct route. Keep findings and run results in the run's
report, not in this reusable catalog. The initial families come from the
[audit method](../../../../docs/development/instruction-audit.md#scenario-catalog).

The examples below seed concrete scenarios. Adapt the wording and prepare real
fixture contents before delegating. A description such as "accepted foundation"
is a setup obligation, not a substitute for the documents that support it.
Do not tell the simulator which skills or files it is expected to find.

| Family | Example initial request | Target state to prepare |
| --- | --- | --- |
| Project foundation | "Vorrei definire un prodotto per gestire una biblioteca." | Initialized advisor, no project artifacts or features. |
| New feature | "Vorrei aggiungere l'esportazione CSV dei libri." | Coherent project Product and Architecture foundations; no export feature yet. |
| Resume work | "Riprendiamo il documento di architettura dell'esportazione CSV." | An existing export feature, the named draft, and its actual accepted inputs and open decisions. |
| Change an accepted decision | "L'esportazione deve includere anche i libri archiviati." | An accepted rule excluding archived books and related artifacts with real decision references. |
| Next work | "Quale lavoro ha senso affrontare adesso?" | A small mixed state with accepted and proposed artifacts and a relevant open handoff. |
| Handoff capture | "Rimandiamo la scelta della politica di retry; annotala per riprenderla quando definiamo il provider." | A current topic and enough established context to locate the deferred question. |
| Handoff resumption | "Riprendiamo la questione della politica di retry." | A matching repository handoff and the documents containing its known inputs. |
| Migration | "Migra docs-legacy/requisiti.md nella struttura dell'advisor." | Initialized advisor and the actual selected legacy document at that path. |
| Ordinary code | "Correggi questo refuso nel messaggio di errore." | A specified code location with a spelling-only change and no unresolved product or contract decision. |

Keep fixtures small and internally coherent. Mark synthetic examples as fixture
data in the review record; they are not decisions about the advisor product.
Include the documents required by a scenario's starting facts without filling
unrelated catalogs merely to make a large demonstration project. Verify that
the intended distinction exists in the files before running the simulator.

For a selected family, add a variant only when it changes navigation. Useful
distinctions include project versus feature scope, a specific later authority,
present versus missing prerequisites, an existing versus new feature, sources
on the reading path, and resumption after an interrupted review. Identify the
actual branch instruction first; do not generate a Cartesian product of states.

For each runnable case, keep the following in the review record outside the
target:

- A stable identifier and the family or new branch it exercises.
- The precise initial prompt, fixture files and contents, and intended host.
- Payload baseline and delivered-path mapping; runtime and initial instruction
  surface sufficient to reproduce the run.
- Required instruction topics and relevant accepted design passages, visible
  only to the reviewer. These are obligations to check, not a forced exact order
  for otherwise valid reading paths.
- Observed trace, stopping point, findings, and comparison with a rerun when
  source changes affect the case.

For a general audit, exercise at least one concrete case per initial family,
including both handoff entry points. Report branch coverage as the scenarios
and routing distinctions actually exercised, with exclusions. This is not a
claim to cover every Markdown file, every possible prompt, or every advisor
phase question. A focused audit reports its narrower selection explicitly.
