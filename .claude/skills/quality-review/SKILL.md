---
name: quality-review
description: "Audit code that already passed the automated gates for what machines miss — semantic bugs, dishonest types, and worthless tests. Semantic bugs are ~half of all bugs missed in review, so this looks past style (linters caught that) at meaning. Use it after implementing a story, before the retrospective, or when code feels suspiciously clean. It complements a broad code review with a sharper focus on type honesty and test value. 'No issues found' is valid; do not invent findings."
---

# Quality Review

Review as an external auditor of code that passed every gate. Linters and type
checkers already caught the mechanical issues; your job is what they cannot see
— wrong *meaning*, types that *lie*, and tests that prove *nothing*. Read every
changed file first; you cannot review what you haven't read.

## When

- **Invoked by** `story-review`, `bug-review` and `epic-review` — every
  moment the method writes a retrospective, and always *before* it, so what
  this finds shapes what gets recorded. Epic scope reviews the merge range,
  not one story's diff — bounded by `git merge-base {dev-branch}
  {epic-start's commit}` on the low end and the epic's current HEAD on the
  high end.
- On demand when code feels "too clean" — hidden assumptions often are.
- Skip only when the work item changed no production code.

Overlaps with a general code review — use this when you want the sharper lens
on type honesty and test quality specifically.

## Prepare

Detect the language and toolchain (project manifest first, else the changed
extensions). List changed files (`git diff` vs the parent branch) and read
them all, alongside the design doc and the patterns the codebase established
after past bugs — deviating from those is a signal.

## Semantic correctness

Language-agnostic: inverted conditionals (the #1 semantic bug), off-by-one,
wrong variable from copy-paste, unhandled edges (empty, null, zero-length),
and unresolved/hallucinated symbol references.

**Type honesty** — every escape hatch is a potential lie:

- Python: `type: ignore`, dishonest `cast()`, annotations more specific than
  runtime; broad `except Exception`, swallowed exceptions; mutable defaults.
- TS/JS: `as` assertions, `any`, `@ts-ignore`; unhandled promise rejections;
  `==` vs `===`, falsy traps.
- C#: null-forgiving `!`, `dynamic`, empty `catch`, `async void`.
- Go: unchecked type assertions, ignored `error` returns, `%w`-less wrapping.

(Apply the section that matches the language; skip the rest.)

## Test quality

| Heuristic | Red flag |
|---|---|
| Mutation survival | Test passes even when behavior changes |
| Refactoring resilience | Asserts on internals, not behavior |
| Behavior naming | Name mirrors code structure, not behavior |
| Magic literal | Asserts a hardcoded value copied from the implementation |
| Mock depth | Mock returning a mock returning a mock |
| Deletion test | Delete it — does any unique coverage disappear? |

Classify each test: **muda** (waste → delete), **fragile** (breaks on
refactor → fix), or **valuable** (keep).

## API surface & security

Public API leaking internals (unexported helpers made public, `export *`
re-exporting internals). Input validated at boundaries; entry-point trust
model sound; no secrets in logs or errors.

## Present findings

```markdown
## Quality Review: {story}
### Critical (fix before merge)
### Recommended
### Observations
### Verdict: {PASS | PASS WITH RECOMMENDATIONS | FAIL}
```

**Distinct from** `architecture-review`'s verdict, which ends in `SIMPLIFY`.
This one ends in `FAIL` because a semantic bug, a dishonest type or a worthless
test is **wrong**, not merely oversized — the code does not do what it claims.
A shared scale would flatten that difference, so the two are deliberately not
aligned.

Every finding cites `file:line`, **why it matters** (not just what), and a
concrete fix.

A finding not fixed on the spot needs its destination now, per the core's
**a named finding gets a destination**. Two destinations here, and this
review writes only the first: append it to `records/parking-lot.md` (R4,
append-only, your entry is yours), or **hand it to the phase that writes the
retrospective** — `story-review`, `bug-review` or `epic-review`, each of
which invokes this review before writing. Do not open `retrospective.md`
yourself; give them the finding and let them record it.

## Output

A **presented output**: rendered to the human as this review's
result, never written to a file. Shape: the fenced block under `## Present
findings` above, plus — for any finding not fixed on the spot — either an
entry appended to `records/parking-lot.md`, or the finding handed to whichever
phase invoked this review, to record in the retrospective it writes.

## Checklist

- [ ] All changed files read before reviewing.
- [ ] Every finding says WHY, with file:line and a fix.
- [ ] Style already caught by linters is excluded — focus on meaning.
- [ ] Type-honesty and test-value checks applied.
- [ ] "No issues found" is valid — never invent findings.
