---
name: bug-review
description: "Verify the fix addresses the root cause, capture what would prevent this class of bug, and write the retrospective before closing. Use it after the fix is done and all gates pass, on every bug — even trivial ones produce a learning. Skipping the retrospective is the most common way process improvement quietly dies; do not skip it."
---

# Bug — Review

Turn one fixed bug into a durable learning. Confirm the fix hit the root cause
(not a symptom), extract what would stop this *class* of bug, and record it.
This is the step that makes the next bug less likely, so it is never optional.

## When

- **Use:** the fix is complete, all gates pass, the bug no longer reproduces.
- **Skip:** never — even trivial fixes yield a prevention insight.

## 1 · Verify the fix is done, then run quality-review

`progress.md` must exist in the bug's work log, the gates must be green, and
the bug must no longer reproduce. If any of the three is not true, **stop** and
finish `bug-fix` — a retrospective on an unfinished fix records a guess at
what worked.

Then run the [`quality-review`](../quality-review/SKILL.md)
discipline over the fix — with particular weight on **test quality**, since a
regression test that passes for the wrong reason lets the same bug return
while reporting itself fixed. Skip only for a fix with no production-code
change. Run it **before** step 2, so what it finds can shape the reflection.

## 2 · Reflect

Answer concretely, with examples from this bug:

1. What did you learn about this system or codebase?
2. What in the fix *process* would you change?
3. What change in process or tooling would prevent this whole **class** of bug?
4. What pattern does this bug represent (type + origin → systemic insight)?

The prevention answer (3) is the valuable one — a fix closes one bug, a
prevention closes a category.

## 3 · Capture the learning to memory

Write the durable insight to your persistent memory (a fact per learning worth
keeping), not a project-local scoring store. Keep the causal pattern:
`{bug type} + {origin} → {systemic insight}` and the prevention. This is what
future sessions recall.

## 4 · Write the retrospective

Write `retrospective.md` in the bug's work log
(`work/.../{scope}-{slug}/retrospective.md`), following
[`assets/retrospective.md`](assets/retrospective.md).

Commit per the git convention (`chore` — process metadata):

```
chore({scope}): review fix
```

If a tracker is configured, move the issue to its "ready to merge" status
(best-effort, non-blocking).

## Output

- `retrospective.md` committed: root cause, prevention, learnings.
- The key learning saved to persistent memory.

## Checklist

- [ ] Fix verified against the root cause, not the symptom.
- [ ] A prevention for this *class* of bug is written, not just the fix.
- [ ] The learning is saved to memory so future sessions recall it.
- [ ] Never merge without the retrospective — learnings compound.
