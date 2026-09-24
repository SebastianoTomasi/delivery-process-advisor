# Ticket production

**Status:** proposed

## Scope

This artifact governs what the Ticket production feature promises: turning a
feature's documentation into a set of implementation tickets that an
independent implementing system consumes. It leaves the ticket file contract and
its destination to the feature's Architecture, how the user requests and reviews
the breakdown to Frontend, and the procedure that realizes it to Implementation.

## Dependencies

- [Rules](../../../product/overview.md#rules) — "The system advises, it does not
  bind": the advisor refuses only when there is nothing concrete to derive
  tickets from, and records nothing about how the user proceeds. A change to
  that rule changes where refusal may occur.
- [The user](../../../product/overview.md#the-user) — the feature serves that one
  actor and introduces no other: the implementing system consumes tickets but is
  not an actor the product makes promises to. A second actor would reopen this.
- [What it knows](../../../product/overview.md#what-it-knows) — tickets are project
  files derived from the project's documentation and code, so they add no data
  class. The same passage says that what is not known "is asked rather than
  invented", which is the line between underspecified and well-specified input.
  A change there requires reviewing both answers.
- [Non-goals](../../../product/overview.md#non-goals) — "It does not integrate
  external task systems": this feature is compatible with that non-goal only
  because it writes tickets once, as project files, and never publishes to,
  reads from, or synchronizes with a tracker. Publishing to a hosted tracker
  would require changing that non-goal first. The same passage lets the user
  explicitly delegate choices to the agent, which is how an underspecified
  input can proceed without the user settling each gap.

## Purpose

Once this feature exists, a user can obtain from a feature's documentation a set
of tickets that an implementing system can build without the advisor. Tickets
are tracer-bullet vertical slices, each naming the tickets that block it.

The motivating consumer is sandcastle, the implementing system Antonio is
building, which reads tickets in the local-file form of Matt Pocock's
`to-tickets` skill, described in
[the observed ticket form](../sources/matt-pocock-to-tickets.md). The feature
promises output in the form that consumer reads; the exact contract belongs to
Architecture.

## What the feature promises

**Whether the advisor would have to invent decides what it does first.** How much
detail the input carries is the user's choice and is not enforced. What matters
is whether writing the tickets requires the advisor to make choices the input
leaves open. Every ticket states the behavior it makes work and the criteria
that check it, so:

- **Nothing concrete to work on** — the advisor cannot write even one ticket, an
  observable behavior with checkable criteria, without inventing it. It refuses
  and says what is missing.
- **Underspecified** — tickets can be written, but only by filling gaps: a
  behavior without its failure outcome, a slice resting on a decision that is not
  accepted, or a boundary between tickets the input does not fix. The advisor
  stops and lists those choices with what it would choose. The user settles them
  or tells the advisor to proceed, which delegates them. Either way the advisor
  then produces the tickets and records nothing about the choice.
- **Well specified** — every ticket can be written from settled content, and the
  advisor produces the tickets without stopping.

For a feature, open catalog questions and artifacts that are not accepted are
evidence of gaps, but phase completeness does not by itself decide which case
applies.

**Tickets are self-contained.** They carry no link to the artifacts, passages,
or statuses they were derived from, and no indication of whether that basis was
accepted. The implementing system needs no knowledge of the advisor process, and
the two systems stay independent.

**A feature's ticket set is produced once.** The advisor writes the set and never
changes it afterwards. If a set already exists for the feature, it stops and
says so. Updating, regenerating, archiving, or removing an existing set happens
outside the advisor. The reasons and rejected alternatives for this independence
are in [ADR-0039](../../../adr/0039-tickets-stay-independent-of-the-advisor.md).

**Written tickets belong to the implementing system.** Their status lines,
claims, and comments are that system's record of delivery, consistent with
delivery status living in the task system rather than in the documentation
tree. The advisor does not read or interpret them.

## Participants

The feature introduces no new actor. The person who develops and leads the
project requests the tickets and settles or delegates the choices an
underspecified input leaves open.

The implementing system, sandcastle at present, consumes the tickets but is not
an actor of the product. It is developed together with the advisor, so the
product makes it no compatibility promise: the ticket form is an Architecture
contract that changes by agreement between the two projects, not a Product
guarantee to a third party. The planned merge of the two systems is recorded as
[future work](../../../deferred/advisor-and-sandcastle-merge.md).

## Data

Tickets introduce no new class of data. They are project files whose content is
derived from the project's own documentation and code, and they hold nothing the
project does not already hold. A ticket carries the same obligations as the
material it was derived from and adds none; content copied from a document keeps
that document's sensitivity after the ticket passes to the implementing system.

## Security screening

`security-new-subject-or-data` is dismissed. The feature introduces no actor, as
stated under Participants, no subject, and no class of data, as stated under
Data, beyond those the accepted Product description already declares.

## Non-goals

- Publishing tickets to a hosted tracker such as GitHub or Linear.
- Recording in a ticket the documentation it derives from, or whether that
  documentation was accepted.
- Keeping a ticket set current as the documentation changes.
- Reading ticket status to assess a feature's progress.

## Open decisions

- `feature-purpose` and `feature-preconditions` — whether input other than a
  declared feature's documentation can be turned into tickets. The user expects
  it can. That would change Purpose, the rule that a feature's set is produced
  once, and where tickets are placed, which today relies on the feature's
  identity.
- `feature-outcomes` — the observable success result and the ordinary failure
  outcomes, including an existing ticket set.
