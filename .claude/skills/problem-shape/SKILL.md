---
name: problem-shape
description: "Shape a vague idea into a problem brief before it becomes an epic: anchor the domain, name the stakeholder, describe the gap (not a solution), find the root cause with three whys, pick a 4-week leading signal, and frame a testable hypothesis. Use it when an initiative is still fuzzy, before epic design. Skip it when the problem is already well-defined or it's story-level. Challenge solution-shaped language once, never twice — trust matters more than precision."
---

# Problem — Shape

Take a stakeholder from "I have an idea" to a well-formed problem in ~10
minutes. The output is a problem brief that feeds `epic-start`. The whole
point is to nail the *problem* before anyone reaches for a *solution*.

Facilitate in the stakeholder's language; the framework below is the same in
any language. Offer multiple-choice options to keep it fast.

## When

- **Use:** a fuzzy initiative that hasn't entered epic design yet.
- **Skip:** the problem is already well-defined (go to epic design), or it's
  story-level.

## 1 · Domain (~30s)

What kind of problem is this? (delivery speed / quality & rework / visibility
& control / other). If "other", take free text and summarize back in one
sentence to confirm.

## 2 · Stakeholder (~60s)

Who feels this directly? (dev team / business / leadership / end customer). If
several, ask who suffers most and pick one.

## 3 · Current state

Complete the sentence: *"{who} can't {do what} because {reason}"*.

**Anti-solution gate:** if the answer is solution-shaped ("we want to build…",
"we need to implement…"), challenge it **once**: "That sounds like a solution —
what's happening today without it?" If the second answer is still
solution-shaped, accept it, flag it in the brief, and move on. Never challenge
twice.

## 4 · Root cause — 3 whys

Ask exactly three sequential "why?" questions, then name the root cause and
confirm it with the stakeholder.

## 5 · Early signal (~30s)

What would change first in **4 weeks**? (a metric improves / a behavior
changes / a process disappears / a complaint stops). The 4-week horizon forces
a leading indicator, not a lagging KPI.

## 6 · Hypothesis

Frame it: *"If {current state}, then {early signal} for {stakeholder},
measured by {metric}."* Present for corrections. Each step above fills one
section of the problem brief: Domain, For whom, Current state, Root cause,
Early signal, Hypothesis.

## Output

Write the problem brief to `work/problem-briefs/{slug}.md`, following
[`assets/problem-brief.md`](assets/problem-brief.md).

It feeds **`epic-start`**, which reads it when writing the epic's `brief.md`:
Stakeholder and Current state supply the bet's audience and gap; Early signal
and Hypothesis supply its leading metric and how that metric is measured.
What it does **not** supply — the solution, the category, the differentiator
and the appetite — are decisions taken there.
`epic-design` reads the epic's `brief.md` (it creates `scope.md` itself), never
this file directly.

## Checklist

- [ ] Anti-solution gate applied in step 3 — challenged once, at most.
- [ ] Exactly three whys — not two, not five.
- [ ] Root cause confirmed by the stakeholder before continuing.
- [ ] Early signal is a 4-week leading indicator, not a lagging KPI.
- [ ] Hypothesis in the If/then/for/measured-by form.
