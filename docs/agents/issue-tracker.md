# Issue tracker: GitHub

Issues for this repository live in
[SebastianoTomasi/delivery-process-advisor](https://github.com/SebastianoTomasi/delivery-process-advisor/issues).
Use the `gh` CLI from this checkout for issue operations.

## Conventions

- Create an issue with `gh issue create`.
- Read an issue and its comments with `gh issue view <number> --comments`.
- List issues with `gh issue list`, filtering by state and label as needed.
- Add discussion with `gh issue comment <number>`.
- Apply or remove labels with `gh issue edit <number>`.
- Close an issue with `gh issue close <number>`, recording its resolution.

The `advisor:deferred` label selects deferred work for advisor recovery.
Open and closed are GitHub issue states. The advisor reads open issues with
that label; it does not treat other issue types or implementation tickets as
deferred work.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## When a skill says "publish to the issue tracker"

Create a GitHub issue in this repository.

## When a skill says "fetch the relevant ticket"

Read its GitHub issue, including comments and labels.
