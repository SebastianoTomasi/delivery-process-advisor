"""Find user messages that point the agent at documentation it missed or misread."""
import os, json, glob, re, sys

ROOT = os.path.expanduser("~/.claude/projects")
THIS = "695de8e2-526f-4262-91cc-0ea44b684f6e"
PAT = re.compile(
    r"(c'è già|c'e' già|c'è scritto|è già scritto|e' già scritto|già deciso|abbiamo già deciso|già documentat|"
    r"hai letto|non hai letto|leggi (il|la|l'|i|gli) (doc|adr|artifact|artefatt|scaffold|catalog|file)|"
    r"guarda (il|la|l'|i|gli) (doc|adr)|nei docs|nella documentazione|nel doc |nell'adr|advisor-docs|mappa|"
    r"non hai (guardato|controllato|considerato)|dove (sta|è) scritto|contraddice|in contrasto con)", re.I)

seen = set()
for fp in [f for pr in sys.argv[1:] for f in glob.glob(ROOT + "/" + pr + "*/**/*.jsonl", recursive=True)]:
    if "f4f31c5b" in fp or THIS in fp or "subagents" in fp.replace("\\", "/"):
        continue
    sid = fp.replace("\\", "/").split("/")[-1][:8]
    for line in open(fp, encoding="utf-8", errors="replace"):
        try:
            d = json.loads(line)
        except Exception:
            continue
        if d.get("type") != "user" or d.get("isMeta"):
            continue
        ts = d.get("timestamp") or ""
        if ts < "2026-09-14":
            continue
        c = d.get("message", {}).get("content")
        if isinstance(c, list):
            if any(isinstance(x, dict) and x.get("type") == "tool_result" for x in c):
                continue
            c = "\n".join(x.get("text", "") for x in c if isinstance(x, dict) and x.get("type") == "text")
        if not isinstance(c, str) or c.lstrip().startswith("<") or "Base directory for this skill" in c:
            continue
        if "continued from a previous conversation" in c:
            continue
        m = PAT.search(c)
        if not m:
            continue
        key = c[:200]
        if key in seen:
            continue
        seen.add(key)
        i = max(0, m.start() - 160)
        print(f"{sid} {ts[:10]} [{m.group(0)}] ...{c[i:m.end()+200].replace(chr(10), ' ')}...")
