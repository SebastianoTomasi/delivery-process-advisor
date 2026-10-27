import json, sys, re

rows = json.load(open(sys.argv.pop(1), encoding="utf-8"))
limit = int(sys.argv[1])
for sid in sys.argv[2:]:
    r = next(r for r in rows if r["sid"].startswith(sid))
    print("=====", sid, "subagent" if r["subagent"] else "main", (r["first_user"] or "")[:200])
    n = 0
    for a in r["acts"]:
        if a[0] == "skill":
            print("skill ", a[1])
        if a[0] in ("read", "search", "list") and (a[1] or "").startswith(("docs", "GLOSS", "advisor")):
            d = re.sub(r"[A-Za-z]:[/\\]Users[/\\][^/\\]+[/\\](?:[^/\\\s]+[/\\])*?(?=docs[/\\]|backend[/\\]|frontend[/\\]|src[/\\])", "", a[3].replace("\n", " "))
            print(f"{a[0]:6s} {a[2]:5s} {d[:170]}")
            n += 1
            if n > limit:
                break
    print("discovery:", [(p.split("/")[-1], o) for p, k, o in r["reads"] if k == "artifact"][:30])
    print()
