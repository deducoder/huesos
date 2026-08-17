---
name: bug-analyse
description: "Find the root cause of a reproduced bug and decide the fix approach, choosing the analysis method from the available signal (stack trace, recent change, single suspected cause, multiple hypotheses). Use it when a bug is already reproduced and has no confirmed root cause, before planning or writing the fix. An open bug is not enough: if it does not reproduce yet, reproduce it first. Never implement the fix from here — this skill only diagnoses, or the symptom comes back."
---

# Bug — Analyse

Find the root cause and decide the fix approach. **Pick the method from the
signal you have, not from an arbitrary "complexity tier"** — the signal is what
tells you which technique will actually work.

## When

- **Use:** the bug is already reproduced and classified; root cause is not yet
  confirmed. Runs after reproducing/classifying and before planning the fix.
- **Skip (partially):** trivial bugs where the cause is self-evident — but
  still write `analysis.md` with the obvious cause. The record matters more
  than the ceremony.

## 1 · Verify the triage exists

`triage.md` must exist in the bug's work log. If it does not, **stop** and run
`bug-triage` — severity and origin are recorded before the cause is known
precisely so the cause cannot bias them.

## 2 · Pick the method from the signal

Read the bug's work log and check which signal you have:

| Signal available | Method |
|---|---|
| Stack trace / error with a location | **Trace analysis** — follow the error to its origin |
| Appeared after a known change | **git bisect** — binary-search the introducing commit |
| Single suspected cause | **5 Whys** — one causal chain, each answer evidenced in code |
| Several possible causes, unclear | **Hypothesis-driven** — list, test, and eliminate |
| Cause is obvious on reproduction | **Document directly** — write the cause and move on |

If unsure, use **hypothesis-driven**: it is the most general and what an LLM
does naturally well.

## 3 · Analyse

Run the chosen method:

- **Trace:** follow the error from the surface (exception/log) down the call
  chain to the originating defect. Document the path.
- **git bisect:** `git bisect start` → `git bisect bad HEAD` →
  `git bisect good {known-good-commit}`. Test at each step until the guilty
  commit is found.
- **5 Whys:** one factual causal chain — ask "why?" up to five times, each
  answer evidenced in code. Stop at the actionable root cause.
- **Hypothesis-driven:** list 2-5 hypotheses; for each define a test (grep,
  read code, run a command), execute it, and record:

  | Hypothesis | Test | Result | Conclusion |
  |---|---|---|---|
  | {what might cause it} | {how to verify} | {what you found} | confirmed / eliminated |

  Narrow to **one** confirmed root cause.

**Rule for every method:** *"human error" is never a root cause.* Ask why the
error was possible — the answer to that is the real cause (and the only one
you can act on).

**If blocked:** if the cause is still unclear after analysis, or two remain
equally likely, **stop and escalate to a human** with the two strongest
hypotheses documented. Do not guess: a fix on the wrong cause reintroduces the
bug.

## 4 · Write the analysis

Write `analysis.md` in the bug's work log (the bug's directory per
[`../../conventions/work/`](../../conventions/work/convention.md):
`work/.../{KEY}-{slug}/analysis.md`), following
[`assets/analysis.md`](assets/analysis.md).

If a tracker is configured, update the tracker description with the root
cause and fix approach (replacing the 1-line set at creation) —
best-effort, non-blocking (see
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)).

Commit per [`../../conventions/git/`](../../conventions/git/convention.md): a single line, in
English, no trailer, type `chore` (this is process metadata, it does not change
product). `{scope}` = the work item id (e.g. `b3.1` in local mode):

```
chore({scope}): identify root cause
```

## Output

- `analysis.md` in the work log: method, root cause, evidence, fix approach.
- Commit `chore({scope}): identify root cause`.
- **The fix approach is decided, not implemented.** Implementing is the next
  step (plan → fix), not this one.

## Checklist

- [ ] Method chosen from the available signal, not from an arbitrary tier.
- [ ] Root cause confirmed with evidence, not guessed.
- [ ] Fix approach decided but not implemented.
- [ ] "Human error" never accepted as a root cause.
- [ ] Never fix before analysing — the symptom recurs without a root cause.
