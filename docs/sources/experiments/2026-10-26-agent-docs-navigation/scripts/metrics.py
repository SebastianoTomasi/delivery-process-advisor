"""Aggregate docs-navigation metrics per repo from docnav.py outputs.

Usage: metrics.py OUT.json name:rows.json:since-date ...
"""
import json, sys, re, collections, statistics

SETS = {"grill-with-docs", "next-work", "propagate-change", "migrate-docs", "to-tickets", "implement", "handoff", "defer", "domain-modeling"}
MAPK = {"map-docs", "map-features", "boundary", "catalog"}
BUCKET = {
    "read:map-docs": "map", "read:boundary": "map", "read:catalog": "map", "read:map-features": "map", "read:map-root": "map", "system": "map",
    "read:artifact": "link", "read:archive": "link",
    "search": "search", "list": "search", "other:grep-other": "search", "other:ls-other": "search",
    "user": "task", "skill-text": "task", "other:gh": "task", "other:git": "task", "other:read-skill": "task",
    "other:subagent-result": "task", "agent": "task",
    "other:read-code": "code", "other:read-md-nondocs": "code", "other:cat-other": "code",
    "never-seen": "guessed",
}


def advisor_skill(s):
    s = s.split(":")[-1]
    return "advisor" in s or s in SETS


def nav(p):
    return (p or "").startswith(("docs", "GLOSS")) and not (p or "").startswith(("docs/sources/experiments", "docs/ai_ignore"))


def kind(path):
    b = path.split("/")[-1]
    if path == "docs/advisor-docs.md": return "map-docs"
    if path == "docs/features/advisor-features.md": return "map-features"
    if re.fullmatch(r"advisor-[a-z]+-(project|feature)\.md", b): return "catalog"
    if re.fullmatch(r"advisor-[a-z]+\.md", b): return "boundary"
    if path.startswith(("docs/deferred", "docs/handoffs")): return "archive"
    return "artifact"


def scope(p):
    parts = [x for x in p.rstrip("/*").split("/") if x and "*" not in x and "{" not in x]
    if len(parts) <= 1: return "all-docs"
    if parts[1] == "features": return "feature" if len(parts) >= 3 else "all-features"
    if parts[1] in ("sources", "adr", "agents", "deferred", "handoffs"): return parts[1]
    return "authority"


def header_seen(r):
    ks = collections.defaultdict(set)
    for a in r["acts"]:
        p = a[1]
        if a[0] != "read" or not nav(p) or kind(p) != "artifact" or p.startswith("docs/sources"):
            continue
        d = a[3]
        if a[2] == "Read":
            m = re.search(r"@offset=(\d+)", d)
            k = "slice" if m and int(m.group(1)) > 1 else "top"
        elif a[2] == "Grep":
            k = "slice"
        else:
            seg = next((s for s in re.split(r"[;&|]", d) if p.split("/")[-1] in s), d)
            if re.search(r"\bsed\s+-n\s+['\"]?1,", seg) or re.search(r"\bhead\b", seg): k = "top"
            elif re.search(r"\b(sed|awk|grep|tail)\b", seg): k = "slice"
            elif re.search(r"\b(cat|Get-Content)\b", seg): k = "top"
            else: k = "other"
        ks[p].add(k)
    seen = sum(1 for s in ks.values() if s & {"top"})
    sliced = sum(1 for s in ks.values() if not s & {"top"} and "slice" in s)
    return seen, sliced


def summarise(rs):
    art = [r for r in rs if any(k == "artifact" and nav(p) for p, k, _ in r["reads"])]
    m = dict(sessions=len(rs), opened_doc=len(art))
    c = collections.Counter(); sc = collections.Counter(); ob = collections.Counter(); ws = []
    hs = hl = 0; seen = set()
    for r in art:
        ks = [k for p, k, _ in r["reads"] if nav(p)]
        fa = ks.index("artifact")
        sk = {a[1] for a in r["acts"] if a[0] == "skill"}
        adv = any(advisor_skill(s) for s in sk)
        wrote = any(a[0] == "write" and nav(a[1]) for a in r["acts"])
        has_map = bool(set(ks) & MAPK)
        c["map_any"] += has_map
        c["map_first"] += bool(set(ks[:fa]) & MAPK)
        c["map_docs_any"] += "map-docs" in ks
        c["map_with_skill"] += has_map and adv
        c["map_writing"] += has_map and not adv and wrote
        c["map_reading_only"] += has_map and not adv and not wrote
        c["advisor_skill"] += adv
        c["wrote_docs"] += wrote
        n = 0
        for a in r["acts"]:
            if a[0] in ("search", "list") and nav(a[1]):
                sc[scope(a[1])] += 1; n += 1
        ws.append(n)
        for p, k, origin in r["reads"]:
            if k != "artifact" or not nav(p) or (r["sid"], p) in seen or origin == "other:Write":
                continue
            seen.add((r["sid"], p))
            ob[BUCKET.get(origin, "other")] += 1
        a, b = header_seen(r); hs += a; hl += b
    m.update(c)
    m["searches"] = dict(sc)
    m["searches_median"] = statistics.median(ws) if ws else 0
    m["first_sighting"] = dict(ob)
    m["header_seen"], m["header_missed"] = hs, hl
    return m


out = {}
for spec in sys.argv[2:]:
    name, rest = spec.split(":", 1)
    path, since = rest.rsplit(":", 1)  # the path may hold a drive letter
    rows = [r for r in json.load(open(path, encoding="utf-8")) if r["start"] and r["start"] >= since]
    by = {}
    for r in rows:
        k = (r["sid"], r["subagent"])
        if k not in by or len(r["acts"]) > len(by[k]["acts"]):
            by[k] = r
    rows = list(by.values())
    # Forked or re-sent sessions repeat the same opening prompt and history: keep the longest copy.
    groups = {}
    for r in rows:
        fu = r["first_user"] or ""
        k = (r["subagent"], r.get("first_hash")) if len(fu) > 20 and not fu.startswith("This session is being continued") else (r["subagent"], r["sid"])
        if k not in groups or len(r["acts"]) > len(groups[k]["acts"]):
            groups[k] = r
    dropped = len(rows) - len(groups)
    rows = list(groups.values())
    print(f"{name}: dropped {dropped} forked/re-sent copies")
    out[name] = {"since": since,
                 "main": summarise([r for r in rows if not r["subagent"]]),
                 "sub": summarise([r for r in rows if r["subagent"]])}
json.dump(out, open(sys.argv[1], "w", encoding="utf-8"), indent=1)


def pct(a, b):
    return f"{100*a/b:.0f}%" if b else "-"


print(f"{'repo':15s} {'kind':4s} {'sess':>5s} {'docs':>5s} {'mapAny':>6s} {'map1st':>6s} {'skill':>6s} {'srchScoped':>10s} {'allDocs':>7s} {'viaSrch':>7s} {'viaMap':>6s} {'viaLink':>7s} {'viaTask':>7s} {'noHdr':>6s}")
for name, v in out.items():
    for kk in ("main", "sub"):
        m = v[kk]; o = m["opened_doc"]
        s = m["searches"]; st = sum(s.values())
        f = m["first_sighting"]; ft = sum(f.values())
        print(f"{name:15s} {kk:4s} {m['sessions']:5d} {o:5d} {pct(m.get('map_any',0),o):>6s} {pct(m.get('map_first',0),o):>6s} {pct(m.get('map_with_skill',0),m.get('map_any',0)):>6s} "
              f"{pct(st-s.get('all-docs',0)-s.get('all-features',0),st):>10s} {pct(s.get('all-docs',0)+s.get('all-features',0),st):>7s} {pct(f.get('search',0),ft):>7s} {pct(f.get('map',0),ft):>6s} {pct(f.get('link',0),ft):>7s} {pct(f.get('task',0),ft):>7s} {pct(m['header_missed'],m['header_seen']+m['header_missed']):>6s}")
