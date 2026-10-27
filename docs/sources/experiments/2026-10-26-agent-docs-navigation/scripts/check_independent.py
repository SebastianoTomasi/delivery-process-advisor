"""Independent re-measurement of the report's key claims, with a simpler method.
Usage: check.py PROJECT_PREFIX SINCE  (e.g. c--Users-<user>-Documents-Code-Claror-Clari 2026-09-14)
"""
import json, re, sys, glob, os, collections, hashlib
ROOT = os.path.expanduser("~/.claude/projects")
PREFIX, SINCE = sys.argv[1], sys.argv[2]
EXCL = ("695de8e2", "f4f31c5b", "b253dca1")
MAPFILE = re.compile(r"(docs/advisor-docs\.md|docs/features/advisor-features\.md|advisor-[a-z]+(-project|-feature)?\.md)$")
DOC = re.compile(r"docs/[\w./\-]+?\.md")

def is_map(p): return bool(MAPFILE.search(p))
def is_artifact(p):
    return not is_map(p) and not p.startswith(("docs/sources", "docs/ai_ignore", "docs/deferred", "docs/handoffs", "docs/agents"))

def reads_from_call(name, inp):
    """Return list of (path, sees_top). Read -> offset absent or <=1;
    Bash -> the shell segment naming the file starts with cat/head, or 'sed -n 1,'."""
    out = []
    if name == "Read":
        p = inp.get("file_path", "").replace("\\", "/")
        m = DOC.search(p)
        if m: out.append((m.group(0), (inp.get("offset") or 1) <= 1))
    elif name in ("Bash", "PowerShell"):
        for seg in re.split(r"&&|\|\||;|\n|\|", inp.get("command", "")):
            w = re.findall(r"[A-Za-z][\w.-]*", seg)
            if not w: continue
            verb = w[0]
            for m in DOC.finditer(seg.replace("\\", "/")):
                p = m.group(0)
                if verb in ("cat", "head", "Get-Content", "nl", "more", "less"):
                    out.append((p, True))
                elif verb == "sed":
                    out.append((p, bool(re.search(r"-n\s*['\"]?1[,p]", seg))))
                elif verb in ("awk", "tail", "python"):
                    out.append((p, False))
                elif verb in ("grep", "rg", "egrep", "Select-String"):
                    if not re.search(r"\s-[a-zA-Z]*r", seg):
                        out.append((p, False))
    elif name == "Grep":
        p = (inp.get("path") or "").replace("\\", "/")
        m = DOC.search(p)
        if m: out.append((m.group(0), False))
    return out

def searches_from_call(name, inp):
    out = []
    if name == "Grep":
        p = (inp.get("path") or "").replace("\\", "/")
        if "docs" in p and not p.endswith(".md"): out.append(p[p.find("docs"):])
    elif name == "Glob":
        p = ((inp.get("path") or "") + "/" + (inp.get("pattern") or "")).replace("\\", "/")
        if "docs" in p: out.append(p[p.find("docs"):])
    elif name in ("Bash", "PowerShell"):
        for seg in re.split(r"&&|\|\||;|\n|\|", inp.get("command", "")):
            if re.match(r"\s*(grep|rg|find|ls|git\s+grep|Get-ChildItem)\b", seg):
                m = re.search(r"docs(/[\w.\-]+)*/?", seg.replace("\\", "/"))
                if m and not m.group(0).endswith(".md"): out.append(m.group(0))
    return out

def scope(s):
    parts = [x for x in s.rstrip("/").split("/") if x and "*" not in x]
    if len(parts) <= 1: return "all"
    if parts[1] == "features" and len(parts) == 2: return "all"
    return "scoped"

def analyse(fp):
    first_user = None; start = None
    seq = []
    users = []
    for line in open(fp, encoding="utf-8", errors="replace"):
        try: d = json.loads(line)
        except Exception: continue
        if start is None and d.get("timestamp"): start = d["timestamp"]
        m = d.get("message")
        if not isinstance(m, dict): continue
        c = m.get("content")
        if d.get("type") == "assistant" and isinstance(c, list):
            for b in c:
                if b.get("type") != "tool_use": continue
                n, inp = b.get("name"), b.get("input") or {}
                for p, top in reads_from_call(n, inp): seq.append(("read", p, top))
                for s in searches_from_call(n, inp): seq.append(("search", s))
                if n == "Skill": seq.append(("skill", inp.get("skill", "")))
                if n in ("Write", "Edit", "MultiEdit"):
                    p = inp.get("file_path", "").replace("\\", "/"); mm = DOC.search(p)
                    if mm: seq.append(("write", mm.group(0)))
        elif d.get("type") == "user" and not d.get("isMeta"):
            t = c if isinstance(c, str) else "\n".join(x.get("text", "") for x in c if isinstance(x, dict) and x.get("type") == "text")
            if t.strip() and not t.lstrip().startswith("<"):
                users.append(t)
                if first_user is None: first_user = t.strip()
    return dict(sid=os.path.basename(fp)[:-6], start=start, first=first_user, seq=seq, users=users, sub="subagents" in fp.replace("\\", "/"))

rows = []
for proj in glob.glob(f"{ROOT}/{PREFIX}*"):
    for fp in glob.glob(proj + "/**/*.jsonl", recursive=True):
        if any(e in fp for e in EXCL): continue
        rows.append(analyse(fp))
rows = [r for r in rows if r["start"] and r["start"] >= SINCE]
g = {}
for r in rows:
    f = r["first"] or ""
    if len(f) > 20 and not f.startswith("This session is being continued"):
        k = (r["sub"], hashlib.sha1(f.encode("utf-8", "replace")).hexdigest())
    else:
        k = (r["sub"], r["sid"])
    if k not in g or len(r["seq"]) > len(g[k]["seq"]): g[k] = r
print(f"sessions after dedupe: {len(g)} (dropped {len(rows)-len(g)})")
rows = list(g.values())

ADV = {"grill-with-docs","next-work","propagate-change","migrate-docs","to-tickets","implement","handoff","defer","domain-modeling"}
for sub in (False, True):
    rs = [r for r in rows if r["sub"] == sub]
    art = [r for r in rs if any(e[0]=="read" and is_artifact(e[1]) for e in r["seq"])]
    map_first = map_any = map_skill = 0
    docs_top = docs_slice = 0
    sc = collections.Counter()
    for r in art:
        reads = [e for e in r["seq"] if e[0]=="read"]
        fa = next(i for i,e in enumerate(reads) if is_artifact(e[1]))
        has_map = any(is_map(e[1]) for e in reads)
        if has_map: map_any += 1
        if any(is_map(e[1]) for e in reads[:fa]): map_first += 1
        if has_map and any(e[0]=="skill" and (e[1].split(":")[-1] in ADV or "advisor" in e[1]) for e in r["seq"]): map_skill += 1
        per = collections.defaultdict(bool)
        for e in reads:
            if is_artifact(e[1]): per[e[1]] = per[e[1]] or e[2]
        docs_top += sum(per.values()); docs_slice += sum(1 for v in per.values() if not v)
        for e in r["seq"]:
            if e[0]=="search": sc[scope(e[1])] += 1
    tot = docs_top + docs_slice
    print(f"\n[{'subagents' if sub else 'main'}] sessions={len(rs)} open_artifact={len(art)}")
    print(f"  map read at all: {map_any} ({100*map_any/max(1,len(art)):.0f}%)  before first artifact: {map_first} ({100*map_first/max(1,len(art)):.0f}%)  map+advisor skill: {map_skill}")
    print(f"  artifact-docs opened: {tot}  top seen: {docs_top}  only slices: {docs_slice} ({100*docs_slice/max(1,tot):.0f}%)")
    print(f"  searches: scoped={sc['scoped']} all-docs={sc['all']} ({100*sc['scoped']/max(1,sum(sc.values())):.0f}% scoped)")

pat = re.compile(r"(hai letto|non hai letto|leggi il doc|già scritto|nella documentazione|read the doc|didn.t read|non l.hai letto)", re.I)
hits = []
for r in rows:
    if r["sub"]: continue
    for i, u in enumerate(r["users"]):
        if i > 0 and pat.search(u): hits.append((r["sid"][:8], u[:140].replace("\n"," ")))
print(f"\ncandidate corrections (non-first user msgs): {len(hits)}")
for h in hits[:25]: print("  ", h)
