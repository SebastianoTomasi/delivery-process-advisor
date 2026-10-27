# Come gli agenti usano la rete di documenti dell'advisor

Analisi dei transcript di Claude Code su questo PC, 26 ottobre 2026.

## In breve

- **Per trovare un documento la mappa non serve.** Solo il 10% delle sessioni legge un file della mappa (`advisor-docs.md`, un file di confine o un catalogo) prima di aprire il primo documento. Il dato è uguale in Clari e nelle altre sei repo.
- **Gli agenti non cercano alla cieca.** Usano i nomi delle cartelle come mappa: l'80–87% delle ricerche resta dentro una sola cartella (un'area come `docs/deployment/`, una feature come `docs/features/edit-video/`, oppure `docs/adr/`). Nelle sessioni controllate a mano arrivano al documento giusto in 1–3 comandi.
- **La mappa serve per scrivere.** Quando viene letta, in circa 7 casi su 10 succede dentro una skill advisor (grill-with-docs, propagate-change, defer, migrate-docs). Quasi tutti gli altri casi sono sessioni che scrivono documenti. Sessioni che leggono la mappa solo per orientarsi: 3 su 146 in Clari, 3 su 44 nelle altre repo.
- **La rete di link funziona, ma è secondaria.** Il 14% dei documenti aperti viene raggiunto seguendo un link da un altro documento. Arrivano invece da una ricerca il 52% in Clari e il 27% nelle altre repo, dal compito (tuo messaggio, issue, commit) il 15–33%, dalla mappa il 6–8%.
- **Il punto debole è l'intestazione.** In Clari il 41% dei documenti aperti viene letto solo a pezzi centrali, cioè con `grep -n` o `sed -n 120,160p`. L'agente non vede lo stato (accepted o proposed), lo Scope e le Dependencies. Clari ha 36 documenti proposed: circa la metà delle letture di questi documenti non vede mai la riga di stato. Nelle repo piccole, con documenti brevi letti interi, la quota scende al 22% e tutti i documenti sono accepted.
- **Nessuna sessione mostra un documento mancato.** In nessuna delle 296 sessioni principali c'è una tua correzione del tipo "non hai letto il doc".

## Cosa ho analizzato

| Repo | Advisor dal | Sessioni principali | di cui aprono docs | Subagent | di cui aprono docs |
|---|---|---|---|---|---|
| Clari | 2026-09-14 | 227 | 146 | 437 | 235 |
| VideoEditing | 2026-10-10 | 35 | 19 | 9 | 4 |
| trascrittore | 2026-09-24 | 12 | 9 | 0 | 0 |
| shared-skills | 2026-10-09 | 10 | 6 | 3 | 1 |
| ArtificialLife | 2026-10-04 | 6 | 4 | 0 | 0 |
| Scrivano | 2026-10-26 | 5 | 5 | 0 | 0 |
| YIAN | 2026-09-24 | 2 | 1 | 0 | 0 |

- Fonti: i file `.jsonl` in `%USERPROFILE%\.claude\projects\<cartella della repo>\`, worktree e subagent compresi. Conto solo le sessioni iniziate dopo l'installazione dell'advisor, cioè dal primo commit di `advisor-agents.md`.
- Ho tolto 144 copie di sessioni con un primo messaggio identico (fork o prompt rimandati), tenendo la copia più lunga: 127 in Clari, 17 nelle altre repo.
- Esclusi: la repo `delivery-process-advisor` (lì leggere l'advisor è il lavoro stesso), i materiali in `docs/sources/experiments/` (analisi di dati, non ricerca di documenti), questa sessione e quella precedente.
- Le 8 sessioni Codex in VideoEditing (`%USERPROFILE%\.codex\sessions\2026\10\24-26`) girano dentro `videos/` per montare video: nessun comando nomina `docs/` o l'advisor.

### Come ho classificato le azioni

Per ogni chiamata a uno strumento ho guardato il comando che agisce davvero sul percorso, segmento per segmento della riga di shell:

- **lettura:** `Read`, `cat`, `head`, `sed`, `awk`, `Get-Content`, oppure `grep` su un singolo file `.md`;
- **ricerca:** `grep -r`, `rg`, `git grep`, `Grep` su una cartella;
- **elenco:** `ls`, `find`, `Glob`;
- **scrittura:** `Write`, `Edit`.

Un `git add docs/x.md` non conta come lettura.

**Da dove arriva un documento:** per ogni documento aperto cerco la prima volta che il suo nome compare prima, nel transcript. Può comparire nell'output di una ricerca, in un altro documento, nella mappa, nel tuo messaggio, in un'issue o un commit, nel codice. Se non compare da nessuna parte, l'agente ha indovinato il percorso.

**Intestazione vista:** almeno una lettura del documento parte dalla riga 1 (`cat`, `head`, `Read` senza offset, `sed -n 1,…`).

## Risultati

### 1. La mappa si legge prima di cercare solo nel 10% dei casi

| | Clari principali | Clari subagent | Altre 6 repo principali |
|---|---|---|---|
| Leggono un file della mappa | 53% (78 di 146) | 15% (35 di 235) | 45% (20 di 44) |
| … prima del primo documento | **10%** (15) | **3%** (8) | **11%** (5) |
| … dentro una skill advisor | 56 | 8 | 14 |
| … senza skill, scrivendo documenti | 19 | 0 | 3 |
| … senza skill, solo per leggere | 3 | 27 | 3 |

I subagent che leggono la mappa senza scrivere (27) sono soprattutto revisori a cui il brief chiedeva di controllare le regole dei documenti.

Calcolato da: `metrics.py`, campi `map_any`, `map_first`, `map_with_skill`, `map_writing`, `map_reading_only`.

### 2. Le ricerche restano in una cartella

| Dove cerca | Clari principali (406 ricerche) | Clari subagent (360) | Altre 6 repo (87) |
|---|---|---|---|
| Una sola cartella (area, feature, `adr/`, `sources/`…) | 87% | 84% | 80% |
| Tutta `docs/` o tutte le feature | 13% | 16% | 20% |

In Clari le ricerche più comuni sono in una cartella di area (33%), in una cartella di feature (26%) e in `docs/adr/` (19%). Nelle repo piccole la ricerca su tutta `docs/` pesa di più perché l'albero è piccolo: VideoEditing ha 17 documenti veri.

Mediana: 2 ricerche per sessione in Clari, 1–2 nelle altre repo.

### 3. Da dove arrivano i documenti aperti

| Prima comparsa del nome | Clari principali (1.070) | Clari subagent (1.387) | Altre 6 repo (264) |
|---|---|---|---|
| Ricerca o elenco | 52% | 28% | 27% |
| Compito: tuo messaggio, issue, commit, skill, brief | 15% | 29% | 33% |
| Link da un altro documento | 14% | 7% | 14% |
| Codice o README | 5% | 32% | 3% |
| Mappa | 6% | 1% | 8% |
| Percorso indovinato | 5% | 1% | 4% |

Nelle repo piccole conta di più il compito: issue e messaggi citano il documento per nome, e le issue scritte con to-tickets contengono i link. I subagent si orientano con il brief e con i README e il codice che leggono, quasi mai con la mappa.

### 4. Intestazione non vista

| | Documenti aperti con intestazione vista | Solo pezzi centrali |
|---|---|---|
| Clari principali | 610 | **419 (41%)** |
| Clari subagent | 842 | **514 (38%)** |
| Altre 6 repo | 190 | 54 (22%) |

In Clari, guardando lo stato attuale dei documenti, 225 letture di documenti proposed in 63 sessioni non vedono mai la riga `**Status:** proposed`. Questo calcolo usa lo stato di oggi, non quello del giorno della sessione. Non ho verificato che abbia causato errori. Ho cercato nel testo degli agenti se dicono "proposed": succede in circa la metà delle sessioni che leggono un documento proposed. Il dato è troppo rumoroso per concludere qualcosa.

Calcolato da: `metrics.py` (`header_seen`, `header_missed`) e `proposed_slices.py`.

### 5. Nessuna correzione per documenti mancati

`corrections.py` cerca nei tuoi messaggi frasi come "c'è già scritto", "hai letto", "leggi il doc", "nella documentazione" e "mappa".

- **Clari:** 9 messaggi trovati. Nessuno corregge un documento mancato. Per esempio "Leggi il documento per avere accesso alla VM" (sessione `94f14de4`) è il primo messaggio della sessione, non una correzione.
- **Altre repo:** 13 messaggi trovati. Sono domande ("non so se nella documentazione sta scritto…", trascrittore `ca3341a0`) oppure riguardano il `MAPPA.md` di Scrivano, che è un'altra cosa.

## Esempi dalle sessioni

Tutti i percorsi sono relativi a `%USERPROFILE%\.claude\projects\`.

1. **Domanda sull'indice vettoriale (Clari, 2026-10-23)**
   - Transcript: `c--Users-<user>-Documents-Code-Claror-Clari\37a26f3c-f1cb-432b-8d6c-4a6db9c80b55.jsonl`
   - L'agente fa `grep -n -i "hnsw\|exact\| ms"` su `docs/features/knowledge-base/implementation/active-evidence-search.md`, poi `sed -n 28,50p` e `sed -n 158,176p`. Infine legge con `awk` la sezione "Vector index choice" di `execution-and-persistence.md`.
   - Sono i due documenti giusti, trovati in tre comandi, senza mappa.
   - Il primo documento quel giorno era **proposed** e l'agente non ha mai letto la riga 2. Per una spiegazione non conta, per un'implementazione conterebbe.

2. **Testo del widget (Clari, 2026-10-24)**
   - Transcript: `c--Users-<user>-Documents-Code-Claror-Clari\87883dae-5f15-499b-b27a-4919a52d3407.jsonl`
   - Un `grep -rln` della frase "informazioni pubbliche" trova `docs/features/beta-tester-access/frontend/tester-page.md` e `docs/frontend/widget.md`.
   - L'agente aggiorna entrambi insieme al codice: la ricerca per testo trova il documento che possiede il comportamento.

3. **Come funziona la beta (Clari, 2026-10-24)**
   - Transcript: `c--Users-<user>-Documents-Code-Claror-Clari\06d8385d-5dc5-486e-bd2d-3f0db273ca5e.jsonl`
   - Per rispondere usa `Glob docs/deployment/*.md` e un `Grep` in `docs/operations`: si orienta con il nome della cartella.
   - Apre `advisor-docs.md` e i confini deployment, operations e security solo dopo, quando passa a `to-tickets` e deve decidere dove scrivere.

4. **Arricchire i chunk (Clari, 2026-10-09)**
   - Transcript: `c--Users-<user>-Documents-Code-Claror-Clari\0c60bf04-11c1-435e-828d-5daa848b441a.jsonl`
   - Legge `advisor-agents.md`, fa `ls docs/adr/` e apre le ADR 0027 e 0029, che sono proprio le decisioni sul tema. Poi apre le feature collegate.
   - È il caso in cui la cartella delle ADR fa da indice delle decisioni.

5. **Risolvere l'issue 3 (VideoEditing, 2026-10-24)**
   - Transcript: `C--Users-<user>-Documents-Code-Passion-VideoEditing\dbd3b96d-7150-4d68-8a03-9a06dd803ecc.jsonl`
   - Parte da `gh issue view 3` e legge interi (`cat -n`) `edit-a-video.md` ed `edit-pipeline.md`. Segue i link verso `architecture-foundation.md` e `GLOSSARY.md`.
   - Prima di propagate-change fa `grep` di "accepted|needs-review|propos" in `advisor-docs.md`, cioè consulta la mappa per le regole, non per trovare.
   - È l'uso della rete più vicino a quello previsto.

6. **Montare un video (VideoEditing, 2026-10-24)**
   - Transcript: `C--Users-<user>-Documents-Code-Passion-VideoEditing\8cfd8f20-c216-4456-a5e5-137402affd87.jsonl`
   - Il lavoro parte dalla skill edit-video. Quando emerge un problema della pipeline, fa `ls -R docs/features/edit-video` e un `grep` su tutti i docs.
   - Legge le prime righe di `advisor-features.md` solo per collocare la modifica, poi apre un'issue deferred.

7. **Sessione grill sulla riscrittura di improve-prompt (shared-skills, 2026-10-09)**
   - Transcript: `C--Users-<user>-Documents-Code-shared-skills\4d65b118-bd96-4bc4-aa65-edcb51832ed8.jsonl`
   - Primo comando: `cat docs/advisor-docs.md`, poi i cataloghi feature di product, frontend, architecture e implementation.
   - Qui i cataloghi servono a ciò per cui sono fatti: elencare le decisioni da coprire prima di costruire, come chiede la procedura grill-with-docs.

8. **Sessione grill-with-docs (ArtificialLife, 2026-10-04)**
   - Transcript: `C--Users-<user>-Documents-Code-Passion-ArtificialLife\d08d7648-d7df-4ab0-88ad-76cf28e47066.jsonl`
   - Legge tutti i 17 file della mappa e scrive 19 documenti: la mappa lavora a pieno dove si scrive.

## Cosa cambierei, dal più importante

1. **Riscrivere la "Reading guidance" di `advisor-agents.md`.**
   - Oggi chiede di scegliere l'area da `advisor-docs.md` e poi leggere il file di confine. Nei dati questo succede nel 10% dei casi, senza danni visibili negli altri.
   - Il file è caricato in ogni sessione (1.298 token nella versione attuale, 896 nella vecchia di trascrittore, YIAN e ArtificialLife).
   - Proposta: descrivere quello che funziona. Per trovare, cercare dentro `docs/<area>/`, `docs/features/<feature>/` o `docs/adr/`. Per collocare o scrivere un documento, aprire `advisor-docs.md` e il file di confine.
   - La modifica va fatta nel repo `delivery-process-advisor`, da cui arriva il file.

2. **Far vedere sempre stato e Dependencies.**
   - Una regola scritta ("leggi le prime righe") servirebbe poco: chi fa `sed -n 120,160p` ha già deciso di saltarle.
   - Meglio uno script di ricerca nei docs che, per ogni file trovato, stampi percorso, stato e prima riga dello Scope accanto alle righe trovate. L'agente lo userebbe al posto di `grep -rn`.
   - In alternativa, o in aggiunta, mettere lo stato nel nome che il grep restituisce già. Questo però cambierebbe le convenzioni dell'advisor.

3. **Lasciare la mappa com'è per la scrittura.** Nelle skill e nelle sessioni grill fa il suo lavoro: collocare, applicare le regole di stato, elencare le decisioni da coprire.

4. **Brief dei subagent.** I subagent trovano i documenti dal brief (29%) e dal codice o dai README (32%). Conviene che chi delega scriva nel brief i percorsi dei documenti che possiedono il tema, come già succede spesso.

## Verifica indipendente (2026-10-27)

Una seconda sessione ha rimisurato le conclusioni principali con uno script
scritto da zero (`scripts/check_independent.py`), con criteri più semplici per
classificare letture e ricerche e una deduplica dei fork per primo messaggio.

| Misura (Clari, sessioni principali) | Report | Verifica |
|---|---|---|
| Sessioni che aprono un documento | 146 | 140 |
| Leggono la mappa prima del primo documento | 10% | 11% |
| Mappa letta dentro una skill advisor | 56 | 56 |
| Documenti letti solo a pezzi | 41% | 43% |
| Idem, subagent | 38% | 35% |
| Ricerche in una sola cartella | 87% | 63% |
| Correzioni per documenti mancati | 0 | 0 |

Le altre repo confermano il quadro. La quota di ricerche "in una sola cartella"
dipende da come si classifica un `grep` con glob e non è confermata nel suo
valore, solo nella direzione.

`scripts/cost_to_first_doc.py` confronta il costo per arrivare al primo
documento (byte di output degli strumenti) nelle sessioni Clari senza skill
advisor: mediana 34 KB nelle 7 sessioni che partono dalla mappa, di cui 21 KB
di mappa, contro 25 KB nelle 102 che cercano o aprono direttamente. Il campione
"mappa" è piccolo; il segno è coerente con il costo fisso di `advisor-docs.md`
(17 KB) più un file di confine (1,5–3 KB).

L'esempio 1 è più grave di quanto scritto sopra: la stessa sessione è passata
a un piano e a `/implement` senza mai aver letto la riga di stato del documento
proposed.

## Limiti

- Solo le sessioni di questo PC: niente sessioni di altre persone, niente Codex fuori da VideoEditing.
- L'origine di un documento è una stima: un nome comparso prima può non essere il motivo per cui l'agente l'ha aperto.
- I comandi composti (`for f in docs/…; do head …`) non contano come letture, quindi alcune letture mancano.
- Lo stato proposed/accepted è quello di oggi, non quello del giorno della sessione.
- Le repo diverse da Clari hanno poche sessioni (69 in tutto): servono a vedere se il quadro regge, non a misurare con precisione.
- Claude Code cancella i transcript vecchi, ma per tutte le repo i dati coprono già il periodo dall'installazione dell'advisor.

## Come riprodurre

Gli script sono in [`scripts/`](scripts/), accanto a questo report.

I file JSON prodotti dagli script contengono pezzi dei transcript: comandi, percorsi, inizio dei tuoi messaggi. Vanno scritti fuori da questo repo, che è pubblico. Gli script leggono `%USERPROFILE%\.claude\projects` e hanno scritti dentro gli ID delle due sessioni di questa analisi, per escluderle.

| Script | Cosa fa |
|---|---|
| `docnav.py` | Estrae da ogni transcript letture, ricerche, scritture e skill sui docs, con l'origine di ogni documento. |
| `metrics.py` | Deduplica i fork e calcola le metriche per repo: tabelle 1–4. |
| `proposed_slices.py` | Conta le letture solo centrali di documenti non accepted. |
| `status_mentions.py` | Controlla se gli agenti dicono "proposed" nelle sessioni che leggono documenti proposed (Clari; va lanciato dalla cartella che contiene `rows-clari.json`). |
| `corrections.py` | Cerca nei tuoi messaggi le correzioni sui docs. |
| `seq.py`, `around.py`, `listsess.py` | Stampano la sequenza di una sessione, il contesto di un messaggio e l'elenco delle sessioni di una repo. |

Esempio per VideoEditing, con gli output in una cartella temporanea:

```bash
S=docs/sources/experiments/2026-10-26-agent-docs-navigation/scripts
OUT="$TEMP/advisor-nav" && mkdir -p "$OUT"
python -I "$S/docnav.py" "$OUT/rows-videoediting.json" C--Users-<user>-Documents-Code-Passion-VideoEditing passion/videoediting
python -I "$S/metrics.py" "$OUT/metrics.json" "videoediting:$OUT/rows-videoediting.json:2026-10-10"
```
