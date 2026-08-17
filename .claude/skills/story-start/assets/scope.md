# Story {scope}: {title} — Scope

## User story

As a {role},
I want {capability},
so that {benefit}.

## Acceptance criteria

The **base** criteria, and the story's authority on what "done" means.
**Distinct from** the design's `Acceptance criteria`, which is a *delta* over
this one — Must / Should / Must NOT refinements the gemba walk added. When the
two disagree, this one is right and the design should say why it changed.

```gherkin
Given {initial context}     # happy path
When {action}
Then {expected outcome}

Given {context}             # edge case
When {action}
Then {outcome}
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| {concrete value} | {concrete action} | {concrete result} |

## In scope

- {what this story delivers}

## Out of scope

- {excluded, and where it goes instead}

## Done when

- {observable outcome — not a task}

## Notes

{context, constraints, links to the epic design}
