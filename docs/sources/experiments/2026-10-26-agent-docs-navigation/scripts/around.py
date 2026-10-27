"""Print a compact timeline of one session around a user message matching a needle."""
import json, glob, os, re, sys

sid, needle, before, after = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
fp = [f for f in glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl")) if f.replace("\\", "/").split("/")[-1].startswith(sid)][0]
ev = []
for line in open(fp, encoding="utf-8", errors="replace"):
    d = json.loads(line)
    m = d.get("message")
    if not isinstance(m, dict):
        continue
    c = m.get("content")
    if d.get("type") == "assistant" and isinstance(c, list):
        for b in c:
            if b.get("type") == "text" and b.get("text", "").strip():
                ev.append("A: " + b["text"].strip().replace("\n", " ")[:300])
            elif b.get("type") == "tool_use":
                i = b.get("input") or {}
                s = i.get("command") or i.get("file_path") or i.get("pattern") or i.get("skill") or i.get("description") or json.dumps(i)[:120]
                s = re.sub(r"[A-Za-z]:[/\\]Users[/\\][^/\\]+[/\\](?:[^/\\\s]+[/\\])*?(?=docs[/\\]|backend[/\\]|frontend[/\\]|src[/\\])", "", str(s))
                ev.append(f"  {b['name']}: " + s.replace("\n", " ")[:200])
    elif d.get("type") == "user" and not d.get("isMeta"):
        if isinstance(c, str) and not c.lstrip().startswith("<"):
            ev.append("U: " + c.replace("\n", " ")[:400])
        elif isinstance(c, list):
            t = " ".join(x.get("text", "") for x in c if isinstance(x, dict) and x.get("type") == "text")
            if t.strip() and not t.lstrip().startswith("<"):
                ev.append("U: " + t.replace("\n", " ")[:400])
idx = next(i for i, e in enumerate(ev) if e.startswith("U:") and needle.lower() in e.lower())
for e in ev[max(0, idx - before): idx + after]:
    print(e)
