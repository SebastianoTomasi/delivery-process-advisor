# Ticket production

**Status:** accepted

## Scope

This artifact governs what the Ticket production feature promises: using the
external `to-tickets` skill to turn a plan, specification, conversation, or
feature documentation into implementation tickets. It leaves tracker and label
contracts, and how the advisor's rules reach the external skill, to
Architecture, and how the user requests the work to Frontend.

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
- [Non-goals](../../../product/overview.md#non-goals) — implementation tickets
  remain owned by the configured tracker and `to-tickets`; the advisor reads
  and writes only `deferred` issues for future-work recovery. The same
  passage permits explicit delegation of choices left open by an input.
- [Deferred items](../../../architecture/documentation-model.md#deferred-items)
  — deferred work and `to-tickets` use one configured tracker, and recovery
  reads only the issues labelled `deferred`.

## Purpose

Once this feature exists, a user can obtain from a plan, specification,
conversation, or feature documentation a set of tickets that an implementing
system can build without the advisor. In a guided project the relevant
accepted decisions and constraints are part of the specification `to-tickets`
works from; it breaks the work into tracer-bullet vertical slices, asks the
user to review the breakdown, and publishes the approved tickets to the
configured tracker. How the advisor's rules reach `to-tickets` without a skill
of its own is recorded in
[ADR-0044](../../../adr/0044-the-advisor-states-its-rules-for-matt-pococks-skills.md).

The motivating consumer is sandcastle, the implementing system Antonio is
building. The observed local and hosted forms of Matt Pocock's skill are
described in [the source note](../sources/matt-pocock-to-tickets.md). The
configured tracker determines which form is published; the exact contract
belongs to Architecture.

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

**More tickets may be produced later.** A later plan or change in the same
feature can be passed through `to-tickets` again and reviewed before
publication. The advisor does not impose the former one-set-per-feature
limit in [ADR-0039](../../../adr/0039-tickets-stay-independent-of-the-advisor.md),
as revised by [ADR-0040](../../../adr/0040-deferred-work-uses-the-configured-issue-tracker.md). Published
tickets remain owned by their implementing system rather than by the advisor's
documentation process.

**Written tickets belong to the implementing system.** Their status, claims,
and comments are that system's record of delivery, consistent with delivery
status living in the task system rather than in the documentation tree. The
advisor's deferred-work recovery selects only `deferred` issues; it
does not infer feature progress from implementation-ticket status.

## Participants

The feature introduces no new actor. The person who develops and leads the
project requests the tickets and settles or delegates the choices an
underspecified input leaves open.

The implementing system, sandcastle at present, consumes the tickets but is not
an actor of the product. It is developed together with the advisor, so the
product makes it no compatibility promise: the ticket form is an Architecture
contract that changes by agreement between the two projects, not a Product
guarantee to a third party.

## Data

Tickets introduce no new class of data. They are tracker issues or local
project files whose content is derived from the project's own documentation
and code, and they hold nothing the project does not already hold. A ticket
carries the same obligations as the
material it was derived from and adds none; content copied from a document keeps
that document's sensitivity after the ticket passes to the implementing system.

## Security screening

`security-new-subject-or-data` is dismissed. The feature introduces no actor, as
stated under Participants, no subject, and no class of data, as stated under
Data, beyond those the accepted Product description already declares.

## Non-goals

- Recording in a ticket the documentation it derives from, or whether that
  documentation was accepted.
- Keeping a ticket set current as the documentation changes.
- Reading ticket status to assess a feature's progress.
- Maintaining a duplicate advisor-owned ticket breakdown and publication
  procedure alongside `to-tickets`.

If tracker configuration or the external `to-tickets` skill is unavailable,
ticket production stops at that missing prerequisite: `to-tickets` asks for
the tracker setup, and the advisor keeps no ticket procedure to fall back on.
