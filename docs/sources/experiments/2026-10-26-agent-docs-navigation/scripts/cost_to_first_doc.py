"""Cost to reach the first artifact: map-first vs grep-first sessions (main sessions, no advisor skill).
Usage: cost_to_first_doc.py PROJECT_FOLDER_PREFIX SINCE  (e.g. c--Users-<user>-Documents-Code-Claror-Clari 2026-09-14)
"""
import sys
import json, re, glob, os, statistics, collections
ROOT = os.path.expanduser("~/.claude/projects")
MAPFILE = re.compile(r"(docs/advisor-docs\.md|docs/features/advisor-features\.md|advisor-[a-z]+(-project|-feature)?\.md)$")
DOC = re.compile(r"docs/[\w./\-]+?\.md")
ADV = {"grill-with-docs","next-work","propagate-change","migrate-docs","to-tickets","implement","handoff","defer","domain-modeling"}

def is_map(p): return bool(MAPFILE.search(p))
def is_art(p): return not is_map(p) and not p.startswith(("docs/sources","docs/ai_ignore","docs/deferred","docs/handoffs","docs/agents"))

def tlen(c):
    if isinstance(c, str): return len(c)
    n = 0
    for x in c or []:
        if isinstance(x, dict):
            if x.get("type") == "text": n += len(x.get("text",""))
            elif x.get("type") == "tool_result": n += tlen(x.get("content"))
    return n

def docs_in(name, inp):
    s = json.dumps(inp).replace("\\\\", "/")
    return [m.group(0) for m in DOC.finditer(s)] if name in ("Read","Bash","PowerShell","Grep") else []

rows = []
for fp in glob.glob(f"{ROOT}/{sys.argv[1]}*/*.jsonl"):
    calls = {}; start=None; seq=[]; skills=set(); first=None
    for line in open(fp, encoding="utf-8", errors="replace"):
        try: d = json.loads(line)
        except Exception: continue
        if start is None and d.get("timestamp"): start = d["timestamp"]
        m = d.get("message")
        if not isinstance(m, dict): continue
        c = m.get("content")
        if d.get("type") == "assistant" and isinstance(c, list):
            for b in c:
                if b.get("type") == "tool_use":
                    n, inp = b.get("name"), b.get("input") or {}
                    if n == "Skill": skills.add(inp.get("skill","").split(":")[-1])
                    ds = docs_in(n, inp)
                    kind = "art" if any(is_art(p) for p in ds) and n == "Read" or (n in ("Bash",) and any(is_art(p) for p in ds) and re.search(r"\b(cat|sed|head|awk)\b", inp.get("command",""))) else "map" if any(is_map(p) for p in ds) else "other"
                    calls[b["id"]] = kind
        elif d.get("type") == "user":
            if isinstance(c, list) and any(isinstance(x, dict) and x.get("type") == "tool_result" for x in c):
                for x in c:
                    if isinstance(x, dict) and x.get("type") == "tool_result":
                        seq.append((calls.get(x.get("tool_use_id"), "other"), tlen(x.get("content"))))
            elif first is None:
                t = c if isinstance(c, str) else "\n".join(x.get("text","") for x in c if isinstance(x, dict) and x.get("type")=="text")
                if t.strip() and not t.lstrip().startswith("<"): first = t.strip()[:200]
    if not start or start < sys.argv[2] or not first: continue
    if "subagents" in fp.replace("\\","/"): continue
    if skills & ADV: continue
    idx = next((i for i,(k,_) in enumerate(seq) if k == "art"), None)
    if idx is None: continue
    before = seq[:idx]
    map_first = any(k == "map" for k,_ in before)
    rows.append(dict(sid=os.path.basename(fp)[:8], first=first, map_first=map_first,
                     calls_before=len(before), bytes_before=sum(b for _,b in before),
                     map_bytes=sum(b for k,b in before if k=="map"),
                     total_bytes=sum(b for _,b in seq), total_calls=len(seq)))

# dedupe forks by first message
g = {}
for r in rows:
    k = r["first"]
    if k not in g or r["total_calls"] > g[k]["total_calls"]: g[k] = r
rows = list(g.values())
for mf in (True, False):
    rs = [r for r in rows if r["map_first"] == mf]
    if not rs: continue
    print(f"\n{'MAP-FIRST' if mf else 'GREP/DIRECT-FIRST'}: n={len(rs)}")
    for key in ("calls_before","bytes_before","total_bytes"):
        v = [r[key] for r in rs]
        print(f"  {key:13s} median={statistics.median(v):>8.0f}  mean={statistics.mean(v):>8.0f}")
    if mf:
        print(f"  map_bytes     median={statistics.median([r['map_bytes'] for r in rs]):.0f}")
        for r in rs: print("   ", r["sid"], r["calls_before"], r["bytes_before"], r["map_bytes"], "|", r["first"][:70].replace("\n"," "))
