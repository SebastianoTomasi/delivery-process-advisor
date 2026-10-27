"""Do agents mention that a doc is proposed, in sessions that read proposed docs?"""
import json, sys, re, os, glob, collections

rows = [r for r in json.load(open("rows-clari.json", encoding="utf-8")) if r["start"] and r["start"] >= "2026-09-14" and not r["subagent"]]
root = "<path to the repository>"
STATUS = re.compile(r"^\*\*Status:?\*\*:?\s*([A-Za-z -]+)", re.M)
MENTION = re.compile(r"\b(proposed|propost[oaie]|non (ancora )?accettat|not (yet )?accepted|status)\b", re.I)


def status(p):
    fp = os.path.join(root, p)
    if not os.path.exists(fp):
        return None
    m = STATUS.search(open(fp, encoding="utf-8", errors="replace").read(3000))
    return m.group(1).strip().lower() if m else None


def assistant_text(fp):
    out = []
    for line in open(fp, encoding="utf-8", errors="replace"):
        d = json.loads(line)
        m = d.get("message")
        if d.get("type") == "assistant" and isinstance(m, dict) and isinstance(m.get("content"), list):
            out += [b.get("text", "") for b in m["content"] if b.get("type") in ("text", "thinking")]
            out += [b.get("thinking", "") for b in m["content"] if b.get("type") == "thinking"]
    return "\n".join(out)


c = collections.Counter()
for r in rows:
    props = {p for p, k, _ in r["reads"] if p.startswith("docs/") and k == "artifact" and status(p) == "proposed"}
    if not props:
        continue
    t = assistant_text(r["file"])
    names = [p.split("/")[-1] for p in props]
    near = any(re.search(re.escape(n) + r".{0,300}" + MENTION.pattern + "|" + MENTION.pattern + r".{0,300}" + re.escape(n), t, re.I | re.S) for n in names)
    c["sessions reading a proposed doc"] += 1
    c["agent mentions proposed/status at all"] += bool(re.search(r"\b(proposed|propost[oa]\b.{0,40}(doc|artefatt|stato)|status: proposed)", t, re.I))
    c["mention near the doc name"] += near
for k, v in c.items():
    print(k, v)
