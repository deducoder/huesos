---
name: epic-close
description: "Close an epic: verify epic-review already ran, reconcile child-story status in the tracker, run architecture-review, generate and publish the developer documentation, tag the epic complete, and ship the single epic-level integration (request or direct merge, per the project's mode). Use it after epic-review's retrospective exists. Never write source, scope, or the retrospective here — those are epic-review's and the stories'. One integration per epic, never per story."
---

# Epic — Close

Ship the epic: verify the reflection already happened, reconcile the
tracker, run the last systemic check, leave behind developer documentation,
tag it, and open the one merge/pull request that ships it. Stories are
already merged into the dev branch, so there is no branch to merge here.

## When

- **Use:** `epic-review`'s `retrospective.md` exists, ready to ship.
- **Abandon:** if dropped, document why and mark the epic abandoned.

## 1 · Verify epic-review already ran

`retrospective.md` **must exist** in the epic's work log (run
[`epic-review`](../epic-review/SKILL.md) first if not) — it carries the
scope re-verification and the reflection this skill depends on. **Do not
re-verify the scope here**: that already happened, item by item, in
`epic-review` step 3; re-doing it would be a second, competing source of
truth for the same claim.

## 2 · Reconcile the tracker

If a tracker is configured, find child stories not in Done
(`parent = {EPIC-KEY} AND status != Done`). If any drifted, present them and
let the human choose: batch-transition to Done, descope with a documented
reason, or abort and fix. **Do not proceed until resolved** — silent tracker
drift is a real failure mode. No tracker → note it and continue.

## 3 · Run architecture-review at epic scope

Run the [`architecture-review`](../architecture-review/SKILL.md)
discipline at **epic scope** — the systemic checks it adds after the last
story, over the merge range rather than one story's diff. A finding fixed on
the spot gets fixed; one that is not, append it to `records/parking-lot.md`
(R4), full stop — this review does not hand findings to anything else. Skip
only for an epic with no production-code change.

## 4 · Generate and publish the developer documentation

Leave behind documentation that answers not just "what was built" but "how
it works, how to extend it, what must stay true, and how to diagnose it when
it breaks." Never skip — even a small epic gets a minimal version.

Load context: the epic scope, the story designs and retrospectives (now
including `epic-review`'s own retrospective — cite its `Learned` and `What
to improve` where relevant, since it reflects at a scale no single story
could), and the source modules the epic touched (`git log` the merge
range).

Five sections, each with real values — never placeholders:

1. **Worked example.** Trace the most representative operation end-to-end
   with real values at every step, plus a sequence diagram.
2. **Extension guide.** The extension point(s) this epic created: what can
   be extended, step by step with file paths and snippets, what to test
   after, common mistakes to avoid.
3. **Data flow.** Every pipeline the epic implemented, the module
   responsible for each transformation, types at each boundary, a diagram
   — every module/type named must actually exist.
4. **Invariants & contracts.** What MUST stay true, derived from
   validators, pre/postconditions, and test assertions. For each: the
   violation symptom and how to check it.
5. **Failure-mode catalog.** For each known failure: symptom (in the
   developer's words), root cause, how to diagnose it, the fix — source
   them from the story retrospectives **and** `epic-review`'s own
   retrospective, now that it exists before this step runs. At least one
   per major module; every entry has a concrete diagnosis step.

Assemble into `docs.md`, following [`assets/docs.md`](assets/docs.md). If
the project has a documentation system configured, publish there too —
title `{scope}: {epic name} — Developer Documentation`, under the epic's
root page — and present the URL
([`../../conventions/docs-publishing/`](../../conventions/docs-publishing/convention.md)).
Then ask the human what a developer new to the code would still find
missing — added failure modes are the most valuable. Human-reviewed before
continuing to step 5.

## 5 · Publish the retrospective (if a docs system is connected)

`retrospective.md` was written by `epic-review`, already committed. Follow
[`../../conventions/docs-publishing/`](../../conventions/docs-publishing/convention.md):

1. Find or create the epic's root page (`{EPIC-KEY} — {epic name}`),
   searched space-wide by title — step 4 above typically already created
   it.
2. Publish `retrospective.md` as a **direct child** of that root — a
   sibling of the Developer Documentation page, never nested inside
   `Decisions`/`Spikes`.
3. Present the URL.

No docs system connected → skip both this step and step 4's publish
half, same as every other best-effort tracker/docs touchpoint.

## 6 · Tag and commit

Tag the dev branch HEAD to mark the epic, and commit `docs.md` (per the
git convention — one line, no trailer):

```
git tag -a "epic/{scope}-complete" -m "Epic {scope}: {epic name} complete"
chore({scope}): close with developer documentation
```

## 7 · Ship the epic

Ship the **single epic-level** integration via the
[`integrate`](../integrate/SKILL.md) technique (where the full
gate suite runs before the push). Source = `{dev-branch}`, target =
`{dev-branch}` (there is no local branch to merge — stories are already in;
this ships it to remote), title `{scope}: {epic name}`; the project's
integration mode decides whether that is a request or a direct merge. Never
per story. If no release is planned yet, stop here without pushing — the
epic's work stays merged into `{dev-branch}` locally.

Then, if a tracker is configured, move the epic to done (best-effort). There is
no branch to clean up — an epic is a container.

## Scope constraints

This skill writes exactly one artifact, `docs.md` — never `scope.md`,
never `retrospective.md` (both belong to earlier phases; read-only here).
If something in the scope or the retrospective looks wrong while closing,
**report it as a finding** — do not edit them here.

## Output

- Tracker reconciled; architecture-review run.
- `docs.md` committed and published (skipped cleanly if no docs system).
- `retrospective.md` published as the epic root's direct child (skipped
  cleanly if no docs system).
- Epic completion tagged.
- One epic-level integration shipped (or dev pushed); epic marked done.

## Checklist

- [ ] `retrospective.md` verified to exist before anything else — never
      re-verify the scope here, that was `epic-review`'s job.
- [ ] Tracker child stories reconciled (all Done or explicitly descoped).
- [ ] Architecture-review run at epic scope (or skip justified).
- [ ] `docs.md`'s five sections present, worked example uses real values,
      failure modes cite `epic-review`'s retrospective where relevant.
- [ ] Human reviewed `docs.md` before shipping.
- [ ] Epic completion tagged on the dev branch.
- [ ] One epic-level integration — never per story.
