---
name: spike
description: "Answer 'can we build this, how, and at what cost?' with a time-boxed experiment in throwaway code, then record the finding and delete the branch. Use it when uncertainty blocks a decision or an estimate and reading won't settle it — before committing an epic or story to an approach. To learn what the world already knows, use research instead; to diagnose something broken, use debug. The code is always discarded, never merged, and the time-box expiring is a valid answer."
---

# Spike

A time-boxed experiment that buys information. You write the cheapest possible
code to answer **one** question, write down what you learned, and **throw the
code away**. The output is a decision or an estimate — never shippable code.

Two siblings, different questions:
[**research**](../research/SKILL.md) asks *what does the world
know?* (it reads); [**debug**](../debug/SKILL.md) asks *why is this
broken?*. A spike asks *can **we** do this, how, and at what cost?*

## When

- **Use:** uncertainty blocks a decision or an estimate — an unproven approach,
  an unfamiliar library in *our* stack, a performance unknown, an integration
  nobody has tried here — and reading about it won't settle it.
- **Skip:** the answer exists in the literature (→ research), the thing is
  already broken (→ debug), or you're confident enough to just build it.

## 1 · Frame one question and set the box

A spike with two questions is two spikes. Write `scope.md` in the spike's work
log, following [`assets/scope.md`](assets/scope.md) — placement per
[`../../conventions/work/`](../../conventions/work/convention.md): exploratory or
pre-epic → `work/spikes/{scope}-{slug}/`; internal validation of an existing
container → under that container's `spikes/`.

Create the tracker issue like any other work item (per
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)) — summary a title, not the
question sentence: kebab-case the summary and you have the `{slug}`. The
point of tracking a spike is that the time it consumes is **visible in the
plan** instead of hidden. Set
the **parent to `{EPIC-KEY}`** when the spike validates something inside an
existing container; omit it when the spike precedes any epic. Then
branch per [`../../conventions/git/`](../../conventions/git/convention.md):
`spike/{scope}/{slug}`.

## 2 · Experiment — cheapest code that answers it

Write the least code that could possibly answer the question. Hardcode, stub,
skip error handling, ignore everything not on the critical path to the answer.

> **Explicit TDD exception.** This is the one place in the methodology where
> RED-GREEN-REFACTOR does **not** apply: writing tests for code you will delete
> is waste, and building it carefully is what destroys a spike's value. Every
> other flow keeps TDD; the spike is the declared exception, and it earns it by
> *always* discarding the code.

## 3 · Answer at the box — or earlier

Stop when you have the answer **or when the box expires, whichever comes
first.** An expired box produces a finding, not an extension: *"four hours in,
we still can't tell"* is genuine, useful information — it says the risk is
larger than assumed. If you want more time, that's a **new** spike with a new
box, decided deliberately.

Write `findings.md`, following [`assets/findings.md`](assets/findings.md).

**Partition every claim by evidence source before you write it down.** A spike
earns its credibility by *running* things — that is its whole advantage over
reading. So mark each claim `ran:` (with the command) or `read:` (with what was
read), and treat the two differently:

- A `ran:` claim is evidenced. Record what would overturn it, so the next
  reader can retest it instead of trusting it.
- A `read:` claim is not. **Run it now or label it unverified** — never leave
  it unmarked, because an unmarked claim inherits the confidence of the ones
  beside it.

Running it is the default, and the reason is the timing: the throwaway rig is
**still standing** at this step. Checking a claim about the code costs one
command here; after step 6 deletes the branch it costs a rebuild. This is the
cheapest this verification will ever be, and the last moment before step 4
puts the findings on the dev branch, where a wrong claim starts travelling into
scopes and plans that cite it.

A claim of the form "A **and** B both do X" is the one to distrust most: a
search matching *either* pattern returns lines that read like proof of both.
A conjunctive claim needs a conjunctive query — one that returns the files,
not the lines.

## 4 · Save the artifacts on the dev branch — before deleting anything

`scope.md` and `findings.md` are the only things that survive a spike, so they
are committed **first**, and **on the dev branch, not on the spike's**:

```
git switch {dev-branch}
git add work/.../{scope}-{slug}/
git commit -m "chore({scope}): close spike"
```

Order matters, and this is the one step where getting it backwards loses the
work: `git branch -D` in step 5 discards every commit made on the branch it
removes. The method tells you to commit after each completed task — follow that
on the spike branch and the deletion takes your findings with it. Commit here,
on the dev branch, and nothing in step 5 can destroy them.

## 5 · Publish (if a docs system is connected)

`findings.md` is already committed on the dev branch (step 4) — publish
reads that committed content, never a draft. Follow
[`../../conventions/docs-publishing/`](../../conventions/docs-publishing/convention.md):

1. Resolve the Spikes index: this spike's own directory placement already
   says which — `work/epics/{EPIC-KEY}-.../spikes/` routes to that
   epic's root, `work/spikes/` (standalone/exploratory) routes to
   `Standalone`. No new field to check.
2. Find or create that Spikes index by its fully-qualified title
   (`{EPIC-KEY} — Spikes`, or bare `Spikes` under `Standalone`) —
   `convention.md`'s "Find or create a parent".
3. Publish `findings.md` as a child page of the Spikes index.
4. Append one row to the index; present the URL.

No docs system connected → skip this step entirely, same as every other
best-effort tracker/docs touchpoint.

## 6 · Discard the branch

With the artifacts safe on the dev branch, delete the spike branch —
**never merge it**:

```
git branch -D spike/{scope}/{slug}
```

If something in the experiment is genuinely worth keeping, it was **copied into
`findings.md`** in step 3. The real implementation gets written properly, in its
own story, informed by what you learned. A spike branch that survives is a spike
that failed its own discipline.

## 7 · Feed the decision forward

Land the finding where the decision lives: an
[**ADR**](../adr/SKILL.md) if architectural, a **story estimate** or
scope change, or a parking-lot entry if deferred. Then move the issue to done.

A **killed approach stays in this spike's own `findings.md`** — that is what
the artifact is for, and it is already the spike's retrospective. Do not write
it into the epic's `design.md`: `epic-design` owns that file and reads what
exists, so it cites the spike when the design is next written. The finding
travels by being findable, not by being copied.

## Output

- `scope.md` (question + box) and `findings.md` (answer + decision), committed.
- Published to the connected docs system, if any (skipped cleanly if not).
- **Branch deleted, nothing merged.**
- The decision, estimate, or ADR the spike existed to unblock.

## Checklist

- [ ] Exactly one falsifiable question, and a time-box agreed before starting.
- [ ] Time-box respected — expiry produced a finding, not an extension.
- [ ] `findings.md` states the answer, the confidence, and the decision.
- [ ] Artifacts committed **on the dev branch before** the spike branch was
      deleted — never on the spike branch, which `-D` would discard.
- [ ] Branch deleted; anything worth keeping copied into findings, not merged.
- [ ] The finding landed somewhere: ADR, estimate, scope, or parking lot.
- [ ] No tests written — and that is the declared, intentional exception.
