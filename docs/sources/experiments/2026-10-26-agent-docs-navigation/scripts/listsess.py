"""List sessions of one repo with their docs activity. Usage: listsess.py rows.json since"""
import json, sys, re

rows = [r for r in json.load(open(sys.argv[1], encoding="utf-8")) if r["start"] and r["start"] >= sys.argv[2]]


def nav(p):
    return (p or "").startswith(("docs", "GLOSS"))


for r in sorted(rows, key=lambda r: r["start"]):
    reads = [p for p, k, _ in r["reads"] if nav(p)]
    if not reads and not any(a[0] in ("search", "list") and nav(a[1]) for a in r["acts"]):
        continue
    mp = sorted({p.split("/")[-1] for p in reads if re.search(r"advisor-[^/]*\.md$", p)})
    art = len({p for p in reads if not re.search(r"advisor-[^/]*\.md$", p)})
    srch = sum(1 for a in r["acts"] if a[0] in ("search", "list") and nav(a[1]))
    wr = len({a[1] for a in r["acts"] if a[0] == "write" and nav(a[1])})
    sk = sorted({a[1].split(":")[-1] for a in r["acts"] if a[0] == "skill"})
    tag = "SUB " if r["subagent"] else "MAIN"
    print(f"{r['start'][:10]} {r['sid'][:8]} {tag} docs={art:3d} srch={srch:3d} wrote={wr:2d} map={','.join(m.replace('advisor-','').replace('.md','') for m in mp) or '-'} skills={','.join(sk)[:60]} :: {(r['first_user'] or '')[:90]}")
