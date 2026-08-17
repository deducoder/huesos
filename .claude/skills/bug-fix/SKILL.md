---
name: bug-fix
description: "Execute the planned fix tasks in strict TDD order (RED failing test, GREEN minimal fix, REFACTOR), running every quality gate after each task and committing each independently. Use it after the plan exists, to actually write the fix. Follow the plan even if the fix looks trivial; never skip the regression test, and never mark done while the bug still reproduces."
---

# Bug — Fix

Execute the plan, one task at a time, in RED-GREEN-REFACTOR order. Each task is
verified by the full gate set and committed on its own. The point of the
discipline is that at every commit the tree is green and the bug is provably
closer to fixed.

## When

- **Use:** the plan exists with atomic tasks.
- **Skip:** never. Even a trivial-looking fix follows its plan.

## 1 · Verify the plan exists

`plan.md` must exist in the bug's work log. If it does not, **stop** and run
`bug-plan` — fixing straight from an analysis is how the regression test
gets skipped.

The one exception: the human explicitly approves fixing without a plan. Record
that approval as the first line of `progress.md`, so the skip is a decision on
the record rather than a gap.

## 2 · Run each task RED → GREEN → REFACTOR

Per task from `plan.md`:

1. **RED** — write the failing test that defines the expected behavior.
2. **GREEN** — write the minimal code to make it pass.
3. **REFACTOR** — clean up while keeping every test green.

Address the **root cause**, not the symptom. Keep the regression test — it is
what stops the bug from coming back.

## 3 · Gate after every task

After each task, run the project's gate entry point — **`./scripts/check`** (lint,
format, types, unit tests; see the gate contract). A task is not done until it
passes. If a gate fails, fix and re-run; after ~3 failed attempts, stop and
escalate to a human with the partial state documented.

## 4 · Commit each task, pause for review

Commit each completed task with its planned message (code-area scope, per the
git convention). Append the task to **`progress.md`** in the bug's work log,
following [`assets/progress.md`](assets/progress.md) — what was done, the
gate results, and anything the plan didn't anticipate; `bug-review`
requires this file to exist. This write is independent of the pause below —
an instruction to skip pauses between tasks does not waive it; only the
pause itself is what such an instruction can skip. Then pause and show the
human what changed and the gate results before moving to the next task —
small, reviewable steps beat one big drop.

If something worth keeping surfaces that is not the root cause — an unfiled
upstream report, a reproduction someone else will need — record it in
`findings.md` (optional; see
[`assets/findings.md`](assets/findings.md) and
[`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)). The
cause itself belongs in `analysis.md`, not here.

When all tasks are done: run the full gate set once more, confirm **the bug no
longer reproduces**, and (if a tracker is configured) move the issue to its
review status — best-effort, non-blocking.

## Output

- Code committed task by task on the bug branch, every gate green.
- `progress.md` in the bug's work log: what each task landed, and any
  unplanned deviation. It is what `bug-review` reads.
- The bug no longer reproduces.

## Checklist

- [ ] RED-GREEN-REFACTOR per task; regression test never skipped.
- [ ] Root cause fixed, not the symptom.
- [ ] All gates pass after each task.
- [ ] Each task committed independently; human saw each before the next.
- [ ] Bug no longer reproduces after the fix.
