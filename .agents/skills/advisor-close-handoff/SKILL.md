---
name: advisor-close-handoff
description: Close an identified session handoff when the user asks or when a session that used it ends. Preserve durable information and repair references before removing its file; do not handle deferred issues or discover unrelated handoffs.
---

Close only the handoff the user identified for this session, or the exact
handoff named in a closure request. Read `advisor-agents.md` and
`docs/advisor-docs.md` when not already read; the latter owns the shared
handoff and citation rules.
If the target is ambiguous, ask which handoff to close. Do not inventory the
directory to select a likely one.

At the end of a session that used the handoff, or on an explicit request to
close it:

1. Check what decisions, evidence, and unfinished work the handoff alone still
   carries. Put each durable part in its owning artifact, issue, or source
   through the applicable workflow. A new handoff is created only on explicit
   request, not as an automatic replacement.
2. Search project files for inbound references to the identified path,
   filename, and title. This targeted search is a deletion check, not general
   handoff discovery. Repoint each reference to durable information, moving that
   information first when it exists only in the handoff. Check links and
   decision references after the edits.
3. If durable information or an inbound reference cannot yet be handled,
   leave the handoff in place and report the concrete remaining work. Otherwise
   remove only the identified file. No closed status file or archive is kept.

Do not delete a handoff at first read or in the middle of an unfinished
session. Do not delete other handoffs while closing the identified one.
