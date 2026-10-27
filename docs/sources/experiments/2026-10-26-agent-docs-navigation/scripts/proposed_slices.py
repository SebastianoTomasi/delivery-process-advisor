"""Sessions that read a doc whose current status is not accepted, only in middle slices.

Usage: proposed_slices.py rows.json REPO_ROOT since
"""
import json, sys, re, os, collections

sys.argv[0:0] = []
rows = [r for r in json.load(open(sys.argv[1], encoding="utf-8")) if r["start"] and r["start"] >= sys.argv[3]]
root = sys.argv[2]
STATUS = re.compile(r"^\*\*Status:?\*\*:?\s*([A-Za-z -]+)", re.M)


def status(p):
    fp = os.path.join(root, p)
    if not os.path.exists(fp):
        return None
    m = STATUS.search(open(fp, encoding="utf-8", errors="replace").read(3000))
    return m.group(1).strip().lower() if m else None


def kind_of_read(a, p):
    d = a[3]
    if a[2] == "Read":
        m = re.search(r"@offset=(\d+)", d)
        return "slice" if m and int(m.group(1)) > 1 else "top"
    if a[2] == "Grep":
        return "slice"
    seg =next((s for s in re.split(r"[;&|]", d) if p.split("/")[-1] in s), d)
    if re.search(r"\bsed\s+-n\s+['\"]?1,", seg) or re.search(r"\bhead\b", seg) or re.search(r"\b(cat|Get-Content)\b", seg):
        return "top"
    if re.search(r"\b(sed|awk|grep|tail)\b", seg):
        return "slice"
    return "other"


tot = collections.Counter()
examples = []
for r in rows:
    ks = collections.defaultdict(set)
    for a in r["acts"]:
        p = a[1]
        if a[0] == "read" and p and p.startswith("docs/") and not re.search(r"advisor-[^/]*\.md$", p) and not p.startswith("docs/sources"):
            ks[p].add(kind_of_read(a, p))
    for p, s in ks.items():
        st = status(p)
        if st is None:
            continue
        seen = "top" in s
        sliced = not seen and "slice" in s
        if not (seen or sliced):
            continue
        tot[(st, "seen" if seen else "slice-only")] += 1
        if sliced and st != "accepted":
            examples.append((r["start"][:10], r["sid"][:8], "SUB" if r["subagent"] else "MAIN", p))
for k, v in sorted(tot.items()):
    print(k, v)
print(len(examples), "slice-only reads of non-accepted docs in", len({e[1] for e in examples}), "sessions")
for e in examples[:15]:
    print(*e)
