---
name: bug-triage
description: "Classify a reproduced bug on two dimensions — Severity (how urgent) and Origin (where in the process it entered) — and record them on the scope, before any analysis. Use it right after the bug's scope is written and before root-cause analysis. Classify what you observe, not what you think caused it: the cause comes later and would bias the classification."
---

# Bug — Triage

Put two labels on the bug before you investigate: **Severity** and **Origin**.
Classify what you *see*, not what you *think* caused it — doing this before
analysis keeps the classification honest and independent of the root cause.

## When

- **Use:** the scope exists, the bug reproduces, and you have not analysed yet.
- **Skip:** never — it is cheap, and even trivial bugs benefit from being
  queryable and from feeding prevention later.

## Why these two

- **Severity → priority.** How much it costs to leave unfixed decides what you
  do first.
- **Origin → prevention.** Where the defect entered the process is what the
  retrospective turns into a "prevent this whole class" action. A bug from
  *Requirements* is prevented very differently from one from *Integration*.

Bug Type and Qualifier (the other ODC dimensions) are dropped on purpose —
they add taxonomy without changing what you do next.

## 1 · Verify the scope exists

`scope.md` must exist in the bug's work log. If it does not, **stop** and run
`bug-start` — classifying a bug nobody has scoped or reproduced yet
classifies a guess.

## 2 · Classify (before analysis)

| Dimension | Values |
|---|---|
| **Severity** | S0-Critical · S1-High · S2-Medium · S3-Low |
| **Origin** | Requirements · Design · Code · Integration · Environment |

If Origin is uncertain, use your best hypothesis — it can be revised during
analysis. Do **not** analyse first to decide it: classify from the symptom.

## 3 · Record it

Write **`triage.md`** in the bug's work log
(`work/.../{scope}-{slug}/triage.md`), following
[`assets/triage.md`](assets/triage.md) — its own artifact, not an edit to the
scope (see [`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)). Include
the **why** of each label: the rationale is what makes this a document rather
than two fields, and it is what the retrospective's prevention analysis reads
later.

If a tracker is configured, set the matching Severity and Origin fields on the
issue. The mapping to the instance's field names and values — including any
quirks (abbreviated values, misspelled field names) — lives in the tracker
binding ([`../../conventions/tracker/`](../../conventions/tracker/convention.md)), not here.
Best-effort and non-blocking.

Commit per the git convention (`chore` — process metadata):

```
chore({scope}): triage bug
```

## 4 · Confirm with the human

Show the two labels and get a quick human confirmation before moving to
analysis — this is what steers priority and, later, prevention, so it is worth
one look.

## Output

- `triage.md` committed: Severity + Origin, each with its rationale.
- Fields set on the tracker issue, if one is configured.

## Checklist

- [ ] Classified before any analysis — no investigation bias.
- [ ] Severity and Origin both set, from the symptom, not the guessed cause.
- [ ] Each label carries its why, not just the value.
- [ ] Written as `triage.md`; mirrored to the tracker if configured.
- [ ] Never analyse before classifying.
