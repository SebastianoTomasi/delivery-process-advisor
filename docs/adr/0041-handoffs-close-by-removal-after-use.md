---
status: accepted
---

# Handoffs close by removal after use

A handoff remains a temporary bridge for one identified continuation session.
The session closes and removes it at the end, after recording decisions and
unfinished work in durable project locations. The user may also close an
identified handoff explicitly. No closed handoff file or separate status is
kept. A session that cannot preserve needed information leaves the handoff in
place and reports what prevents closure.

No project file, including another handoff, may cite a handoff. Handoffs may
link outward to durable information. Before removing one, the closing
procedure checks for references to its path or name, moves unique durable
information to an appropriate artifact, source, or issue, and repairs any
inbound references. The handoff is removed only after those checks pass.

The user chose end-of-session removal on 2026-09-27 so a handoff does not
accumulate after serving its purpose. Removal at first read was rejected: an
interrupted session could lose the bridge before it had preserved the work.
An observed case had accepted artifacts citing an untracked handoff as their
only evidence; this motivated the no-citation rule and the pre-removal check.

This changes the no-lifecycle and manual-removal part of
[ADR-0030](0030-deferred-items-and-session-handoffs-are-distinct.md). Its
separation of durable future work from conversation transfer remains current.
[ADR-0040](0040-deferred-work-uses-the-configured-issue-tracker.md) continues
to govern deferred issues, which close and remain in the tracker.

## Alternatives and consequences

Manual cleanup leaves temporary files behind and gives the next session no
closing obligation. Deleting at first read risks losing an interrupted
continuation. A persistent `closed` status would retain the bridge as project
history, although its durable information belongs elsewhere. The chosen
procedure adds a targeted reference and information check before deletion; if
that work cannot be completed, the file stays for recovery.
