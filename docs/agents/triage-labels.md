# Triage labels

The engineering skills' canonical triage roles map to these GitHub label
strings:

| Label in mattpocock/skills | Label in our tracker | Meaning |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | Maintainer needs to evaluate this issue |
| `needs-info` | `needs-info` | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent` | Fully specified, ready for an agent |
| `ready-for-human` | `ready-for-human` | Requires human implementation |
| `wontfix` | `wontfix` | Will not be actioned |

`advisor:deferred` identifies issues holding deferred advisor work. It is a
separate routing label, not an issue type or readiness state. Existing type
labels such as `bug` and `enhancement` may be used alongside it.
