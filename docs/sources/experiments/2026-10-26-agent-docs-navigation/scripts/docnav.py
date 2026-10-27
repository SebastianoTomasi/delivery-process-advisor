"""Classify how agents in one repo's sessions reached documentation under docs/.

Usage: docnav.py OUT.json PROJECT_FOLDER_PREFIX REPO_PATH_FRAGMENT
"""
import json, os, re, sys, glob, collections, hashlib

ROOT = os.path.expanduser("~/.claude/projects")
OUT, PROJ, REPO = sys.argv[1], sys.argv[2], sys.argv[3].lower()
THIS = ("695de8e2-526f-4262-91cc-0ea44b684f6e", "f4f31c5b-593c-4297-a479-6baf7632e593")

DOCPATH = re.compile(r"(?:^|[\s/\\\"'=(`])(docs[/\\][A-Za-z0-9_./\\\-<>*{},]*|advisor-agents\.md|GLOSSARY\.md)", re.I)
SEARCH_CMD = re.compile(r"\b(grep|rg|egrep|Select-String|findstr|git\s+grep)\b")
LIST_CMD = re.compile(r"\b(find|ls|tree|Get-ChildItem|dir|gci)\b")
READ_CMD = re.compile(r"\b(cat|head|tail|sed|less|Get-Content|type|awk|python)\b")


def norm(p):
    p = p.replace("\\", "/")
    if re.match(r"^([A-Za-z]:/|/|~)", p) and REPO not in p.lower():
        return None  # another repo's or a tool's own docs
    m = re.search(r"(?:^|/)(docs/.*)$", p)
    if m:
        return m.group(1)
    if p.lower().endswith("advisor-agents.md"):
        return "advisor-agents.md"
    if p.lower().endswith("glossary.md"):
        return "GLOSSARY.md"
    return None


def kind_of(path):
    b = path.split("/")[-1]
    if path == "advisor-agents.md":
        return "map-root"
    if path == "docs/advisor-docs.md":
        return "map-docs"
    if path == "docs/features/advisor-features.md":
        return "map-features"
    if re.fullmatch(r"advisor-[a-z]+-(project|feature)\.md", b):
        return "catalog"
    if re.fullmatch(r"advisor-[a-z]+\.md", b):
        return "boundary"
    if path.startswith("docs/ai_ignore"):
        return "ai_ignore"
    if path.startswith("docs/deferred") or path.startswith("docs/handoffs"):
        return "archive"
    return "artifact"


def text_of(content):
    if isinstance(content, str):
        return content
    out = []
    if isinstance(content, list):
        for c in content:
            if isinstance(c, dict):
                if c.get("type") == "text":
                    out.append(c.get("text", ""))
                elif c.get("type") == "tool_result":
                    out.append(text_of(c.get("content")))
    return "\n".join(out)


def classify_call(name, inp):
    """Return list of (action, docpath_or_scope)."""
    acts = []
    if name == "Read":
        p = norm(inp.get("file_path", ""))
        if p:
            acts.append(("read", p))
    elif name in ("Write", "Edit", "MultiEdit"):
        p = norm(inp.get("file_path", ""))
        if p:
            acts.append(("write", p))
    elif name == "Grep":
        path = (inp.get("path") or "").replace("\\", "/")
        g = inp.get("glob") or ""
        scope = norm(path) if path else None
        if scope and scope.endswith(".md"):
            acts.append(("read", scope))
        elif scope or "md" in g or "docs" in g:
            acts.append(("search", scope or ("repo:" + g)))
    elif name == "Glob":
        pat = (inp.get("pattern") or "") + " " + (inp.get("path") or "")
        pat = pat.replace("\\", "/")
        if "docs" in pat or ".md" in pat:
            acts.append(("list", pat.strip()))
    elif name in ("Bash", "PowerShell"):
        cmd = inp.get("command", "")
        # Judge each pipeline segment by its own command word, so `git add docs/x.md`
        # is not a read and `grep -rn x docs/features` is a search.
        for seg in re.split(r"&&|\|\||[;|\n]", cmd):
            paths = [p for p in (norm(m) for m in DOCPATH.findall(seg)) if p]
            if not paths:
                continue
            words = re.findall(r"[A-Za-z][\w.-]*", re.sub(r"^\s*(\w+=\S+\s+)*", "", seg))
            w = words[0] if words else ""
            if w in ("git", "gh", "cp", "mv", "rm", "mkdir", "echo", "printf", "python", "python3", "node", "npx", "pnpm", "uv", "docker", "cd", "for", "do", "diff", "wc", "touch"):
                if w == "git" and len(words) > 1 and words[1] == "grep":
                    acts.append(("search", paths[0]))
                continue
            if w in ("grep", "rg", "egrep", "Select-String", "findstr"):
                files = [p for p in paths if p.endswith(".md") and "*" not in p]
                if w == "rg" or re.search(r"(^|\s)-[a-zA-Z]*[rR]\b|--include|-Recurse", seg) or not files:
                    acts.append(("search", next((p for p in paths if not p.endswith(".md")), paths[0])))
                else:
                    acts += [("read", p) for p in files]
            elif w in ("find", "ls", "tree", "Get-ChildItem", "dir", "gci"):
                acts.append(("list", paths[0]))
            elif w in ("cat", "head", "tail", "sed", "awk", "less", "Get-Content", "type", "nl", "more"):
                acts += [("read", p) for p in paths if p.endswith(".md") and "*" not in p]
    return acts


def key_of(path):
    parts = path.split("/")
    b = parts[-1]
    if b.lower() in ("readme.md", "index.md") and len(parts) > 1:
        return "/".join(parts[-2:])
    return b


def describe(name, inp):
    if name in ("Bash", "PowerShell"):
        return inp.get("command", "")[:300]
    if name == "Read":
        return inp.get("file_path", "") + (f" @offset={inp['offset']}" if inp.get("offset") else "")
    if name in ("Grep", "Glob"):
        return json.dumps(inp)[:300]
    if name in ("Agent", "Task"):
        return inp.get("description", "")
    if name == "Skill":
        return inp.get("skill", "")
    return ""


def coarse(name, d):
    if name in ("Bash", "PowerShell"):
        dl = d.lower()
        if re.search(r"\bgh\s", dl): return "gh"
        if re.search(r"\bgit\s+(log|show|diff|status|grep)", dl): return "git"
        if SEARCH_CMD.search(d): return "grep-other"
        if LIST_CMD.search(d): return "ls-other"
        if READ_CMD.search(d): return "cat-other"
        return "bash-other"
    if name == "Read":
        dl = d.replace("\\", "/").lower()
        if "/skills/" in dl: return "read-skill"
        if dl.endswith(".md"): return "read-md-nondocs"
        return "read-code"
    if name in ("Agent", "Task"): return "subagent-result"
    if name in ("Grep", "Glob"): return "grep-other"
    return name


def analyse(fp):
    calls = {}
    desc = {}
    events = []  # ordered: ("result", origin_kind, text) | ("act", ...) | ("text", src, text)
    first_user = None
    first_hash = None
    start = None
    sid = os.path.basename(fp)[:-6]
    for line in open(fp, encoding="utf-8", errors="replace"):
        try:
            d = json.loads(line)
        except Exception:
            continue
        if start is None and d.get("timestamp"):
            start = d["timestamp"]
        m = d.get("message")
        if not isinstance(m, dict):
            continue
        c = m.get("content")
        if d.get("type") == "assistant" and isinstance(c, list):
            for b in c:
                if b.get("type") == "tool_use":
                    name, inp = b.get("name"), b.get("input") or {}
                    acts = classify_call(name, inp)
                    if name == "Skill":
                        acts = [("skill", inp.get("skill", ""))]
                    if name in ("Agent", "Task"):
                        acts = acts + [("agent", (inp.get("subagent_type") or "") + ":" + (inp.get("description") or ""))]
                    calls[b.get("id")] = acts
                    desc[b.get("id")] = (name, describe(name, inp))
                    for a in acts:
                        events.append(("act", a[0], a[1], name, describe(name, inp)))
        elif d.get("type") == "user":
            if isinstance(c, list) and any(isinstance(x, dict) and x.get("type") == "tool_result" for x in c):
                for x in c:
                    if isinstance(x, dict) and x.get("type") == "tool_result":
                        acts = calls.get(x.get("tool_use_id"), [])
                        if acts and acts[0][0] == "read":
                            origin = "read:" + kind_of(acts[0][1])
                        elif acts:
                            origin = acts[0][0]
                        else:
                            origin = "other:" + coarse(*desc.get(x.get("tool_use_id"), ("?", "")))
                        events.append(("result", origin, text_of(x.get("content"))))
            else:
                t = text_of(c)
                if "Base directory for this skill" in t:
                    src = "skill-text"
                elif d.get("isMeta") or t.lstrip().startswith("<"):
                    src = "system"
                else:
                    src = "user"
                    if first_user is None and t.strip():
                        first_user = t.strip()[:160].replace("\n", " ")
                        first_hash = hashlib.sha1(t.strip().encode("utf-8", "replace")).hexdigest()
                events.append(("text", src, t))
    # discovery attribution for each artifact read
    seen_text = []  # (origin, text)
    reads = []
    for e in events:
        if e[0] == "act" and e[1] == "read":
            p = e[2]
            k = key_of(p)
            origin = "never-seen"
            for o, t in seen_text:
                if k in t:
                    origin = o
                    break
            reads.append((p, kind_of(p), origin))
        elif e[0] == "result":
            seen_text.append((e[1], e[2]))
        elif e[0] == "text":
            seen_text.append((e[1], e[2]))
    acts = [e for e in events if e[0] == "act"]
    return dict(sid=sid, start=start, first_user=first_user, first_hash=first_hash, acts=[(a[1], a[2], a[3], a[4]) for a in acts], reads=reads)


rows = []
for proj in glob.glob(ROOT + "/" + PROJ + "*"):
    for fp in glob.glob(proj + "/**/*.jsonl", recursive=True):
        if any(t in fp for t in THIS):
            continue
        r = analyse(fp)
        r["file"] = fp
        r["subagent"] = "subagents" in fp.replace("\\", "/")
        r["worktree"] = "worktrees" in proj
        r["repo"] = PROJ
        rows.append(r)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(rows, f)
print(len(rows))
