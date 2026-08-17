---
name: bug-plan
description: "Decompose a bug fix into atomic, independently committable tasks in TDD order, with the regression test as task one. Use it after the root cause is confirmed and before writing any fix — even a one-line fix earns a plan (regression test + fix = two tasks). The regression test comes first: it must fail before the fix and pass after, proving the bug was real."
---

# Bug — Plan

Break the fix into small, independently committable tasks in TDD order. **The
regression test is always task one** — a failing test that proves the bug
exists is the only thing that lets you know the fix actually fixed it.

## When

- **Use:** the root cause is confirmed and the fix approach is decided.
- **Skip:** never. Even a trivial fix gets the two-task minimum (regression
  test + fix). If the fix approach is still unclear, go back to analysis.

## 1 · Verify the analysis exists

`analysis.md` must exist in the bug's work log, with a confirmed root cause. If
it does not, **stop** and run `bug-analyse` — a plan written against a
symptom plans the wrong fix.

## 2 · Decompose into tasks

Write `plan.md` in the bug's work log (`work/.../{scope}-{slug}/plan.md`),
following [`assets/plan.md`](assets/plan.md). Each task has: a description, a
verification (the project's gate entry point, `./scripts/check`), and a
commit message. Regression test first.

Leaner than a story's or epic's `plan.md` on purpose: this shape is always
exactly RED (T1) → GREEN (T2) → REFACTOR (T3), so a per-task `TDD` field would
restate what the task titles already say, `Satisfies` would restate what the
regression test already proves against the scope's `WHAT`/`EXPECTED`, and
there is no `Order & risks` to record because a bug fix has exactly one valid
order and no cross-task sequencing choice.

**Task commit scope is the code area, not the bug id** (see
[`../../conventions/git/`](../../conventions/git/convention.md)): the branch already names the
work item, so `fix(payment): …`, not `fix(b3.1): …`.

## 3 · Commit the plan

Per the git convention (`chore` — process metadata):

```
chore({scope}): plan fix
```

## Output

- `plan.md` with atomic tasks in TDD order, regression test first.
- Commit `chore({scope}): plan fix`.

## Checklist

- [ ] Regression test is task one, and it fails before the fix.
- [ ] Each task is independently committable, with its own verification.
- [ ] Each task has a commit message with a code-area scope, not the bug id.
- [ ] Never start fixing without a plan.
