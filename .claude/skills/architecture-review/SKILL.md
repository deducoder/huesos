---
name: architecture-review
description: "Judge whether code is necessary and proportional using Beck's four rules of simple design — the core question is 'could we get the same outcome with less?'. Use it after implementing a story (story scope) or after the last story of an epic (epic scope), or any time accumulated complexity feels disproportionate. It reviews design proportionality, not correctness — pair it with a correctness/quality review. 'No issues found' is a valid outcome; do not invent findings."
---

# Architecture Review

Evaluate whether the code is **necessary and proportional**. Not "is it
correct" (that's the quality review) — "could we achieve the same outcome with
less?". Read the changed files and the design intent first: you cannot judge
proportionality without knowing what was intended.

## When

- After implementing a story → **story scope** (files changed vs the parent).
- After the last story of an epic → **epic scope** (adds the systemic
  checks; the range is bounded by `git merge-base {dev-branch}
  {epic-start's commit}` on the low end and the epic's current HEAD on the
  high end).
- Complexity feels disproportionate → on demand.

## Prepare

Detect the language (project manifest, else the dominant changed extension),
list the changed files (`git diff` against the parent/dev branch), and **read
every one** plus the design doc. Note the established patterns the codebase
already uses — deviations from them need justification.

## The ladder

For each candidate, climb and **stop at the first rung that holds** — the
rung is the finding's tag:

| Rung | Question | Tag |
|---|---|---|
| 1 | Does this need to exist at all? | `yagni:` |
| 2 | Already in this codebase? | `reuse:` |
| 3 | Stdlib does it? | `stdlib:` |
| 4 | Native platform feature covers it? | `native:` |
| 5 | An installed dependency covers it? | name it in the replacement |
| 6-7 | Same logic, fewer lines? | `shrink:` |
| any | Dead on arrival — nothing replaces it | `delete:` |

The tables below are **detection** — how to spot a candidate. The ladder is
**remediation** — which simplification to propose, named by its tag.

## Necessity (YAGNI)

| Heuristic | Red flag |
|---|---|
| Single implementation | Interface/ABC with exactly one impl, no documented consumer |
| Wrapper without logic | Delegates everything, adds no behavior |
| Unused parameters | Accepted but never used |
| Test-only consumers | Public symbol used only by tests |
| Dead exports | Public name no consumer imports |

If a red flag is justified by the design doc, log it as an observation, not a
finding.

## Proportionality (KISS)

| Heuristic | Red flag |
|---|---|
| Indirection depth | >2 layers of delegation for a simple operation |
| Abstraction-to-logic ratio | More scaffolding than logic |
| Config over convention | Configurable with only one valid value in practice |

## Duplication & responsibility

| Heuristic | Red flag |
|---|---|
| Semantic duplication | Same concept expressed differently in several places |
| Pattern duplication | Same structural problem solved differently across modules |
| Change-reason count | Module changes for >1 unrelated reason |
| Import fan-in | One function pulls from 5+ distinct packages |

## Lean compliance

| Check | Red flag |
|---|---|
| MVP delivered | Implementation exceeds the design — gold-plating |
| Design followed | Diverges from design with no documented decision |
| Pattern compliance | A known pattern fit but wasn't used |
| No speculative code | Built for a hypothetical future requirement |
| Simplest approach | A simpler implementation gets the same outcome |

## Systemic (epic scope only)

Orphaned abstractions (protocol with ≤1 implementor at epic end), coupling
direction (stable core importing from volatile/new module), cyclic
dependencies, shotgun surgery (one logical change across 5+ files, 3+ dirs).

Run the `parked:` **harvest** (the grep in
[`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)): list every
deferral marker, flag the trigger-less ones as `no-trigger`, and close with
the footer `{N} markers, {M} with no trigger`. The harvest reports; promoting
or fixing a marker is a decision, not a side effect.

## Present findings

```markdown
## Architecture Review: {id} (scope: {story|epic})
### Critical (fix before merge)
### Recommended (simplify next cycle)
### Questions (need human judgment)
### Observations
### Verdict: {PASS | PASS WITH QUESTIONS | SIMPLIFY}
```

**Distinct from** `quality-review`'s verdict, which ends in `FAIL`. This one
ends in `SIMPLIFY` because disproportionate code is not broken code — it works,
and the verdict says what to *do* with it. A shared scale would flatten that
difference, so the two are deliberately not aligned.

Every finding is **one line** — location, rung tag, what to cut, what
replaces it:

```
{file}:L{line}: {tag} {what}. {replacement}.
```

```
api/users.py:L88: yagni: UserRepositoryInterface with one impl. Inline it until a second exists.
web/DatePicker.tsx:L1-40: native: flatpickr wrapper component. <input type="date">, 0 deps.
core/slug.py:L12-31: stdlib: hand-rolled slugify. unicodedata.normalize + re.sub, 2 lines.
```

Anti-example (banned): *"This repository abstraction might be more complex
than necessary — have you considered whether it's needed at this stage?"* —
a finding that needs hedged prose has not decided its rung. Questions for the
human go in the Questions section, as questions, not as soft findings.

A finding not fixed on the spot needs its destination now, per the core's
**a named finding gets a destination**. This review does not write
`retrospective.md` — that belongs to `story-review` / `bug-review` /
`epic-review`. Append the finding to `records/parking-lot.md` (R4, append-only,
your entry is yours) and let the caller pick it up from there. That is this
review's only destination, and the reason is who calls it: the *close* skills
and `story-design`, none of which writes a retrospective a finding could be
handed to.

## Output

A **presented output**: rendered to the human as this review's
result, never written to a file. Shape: the fenced block under `## Present
findings` above, plus — for any finding not fixed on the spot — an entry
appended to `records/parking-lot.md`.

## Checklist

- [ ] Changed files and design intent read before judging.
- [ ] Every finding is one line: location, rung tag, cut, replacement.
- [ ] Lean compliance checked — MVP, patterns, no gold-plating.
- [ ] Plenty of questions (humility) — you're judging, not dictating.
- [ ] "No issues found" is valid — never invent findings.
