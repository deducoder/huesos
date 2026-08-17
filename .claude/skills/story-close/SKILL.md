---
name: story-close
description: "Close a story: verify the retrospective and gates, run the architecture-review check, then merge the story branch locally into the development branch with --no-ff and delete it. Use it after the review. For a story under an epic, remote push and the epic-level integration happen at epic close, not here. For a standalone story (no epic), this skill invokes integrate itself and ships immediately, same as a bug. Close is a merge-only operation — never edit source, config, or docs; if something looks wrong, report it as a finding."
---

# Story — Close

Fold the finished story into the development branch with a local `--no-ff`
merge that preserves its history — and nothing else. For a story under an
epic, remote push and the epic-level integration are deferred to epic close.
A **standalone** story has no epic close to defer to, so this skill ships it
immediately instead, invoking `integrate` directly — the same asymmetry
R5 already states for a bug. **Close does not edit code**; it only
merges (and, for a standalone story, ships) verified work, then tidies up.

## When

- **Use:** the retrospective exists, the story is verified, gates pass.
- **Skip / abandon:** if the story is dropped, delete the branch without
  merging and mark it `dropped` in the epic `plan.md` progress table, with the
  reason in its row — the same bounded write this skill already makes, never
  the epic's `scope.md`.

## 1 · Verify retrospective and gates

The retrospective must exist (run review first if not). Confirm the story's
gates are green — fix anything failing now, the same errors will block later.
If the story changed the module structure and the module docs no longer match,
**report it as a finding** — do not edit them here (see the scope constraints
below). Close is a merge-only operation; stale docs are real work for a
follow-up, not a side edit smuggled into a merge.

## 2 · Architecture-review check

Run the review checklist (the [`architecture-review`](../architecture-review/SKILL.md)
discipline — Beck's rules). Skip only for XS/docs/tooling stories with no
production-code change:

1. **Structural drift** — orphaned symbols or dead public APIs left behind?
2. **Necessary complexity only** — no speculative abstractions, unused
   parameters, or dead branches.
3. **Convention** — naming, placement, and public surface consistent.

## 3 · Clean working tree

`git status` must be clean. Commit any uncommitted story artifacts first —
**never merge with story files uncommitted**, they get orphaned on the target.

## 4 · Merge locally into the development branch

Merge with `--no-ff` to keep the story's history. The message is the git
default, **no added tracker line** (per
[`../../conventions/git/`](../../conventions/git/convention.md)):

```
git switch {dev-branch}
git merge story/{scope}/{slug} --no-ff
```

Resolve conflicts only in the conflicting hunks — do not audit surrounding
code. Remote push + request are handled at epic close — **unless the story is
standalone**, see step 5.

## 5 · Report progress (or ship), and clean up

**If the story belongs to an epic:**

- Mark the story done in the **progress table of the epic's `plan.md`** (status,
  actual vs estimate) — not in its `scope.md`. Progress belongs to the plan,
  which is a hypothesis that tracks reality; the scope is a stable declaration
  (see [`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)).
- **If `plan.md` does not exist because `epic-plan` was skipped** (its own
  documented path for a small, linear-order epic): skip this write — an
  epic small enough to need no plan is small enough that the git history of
  its merged stories is progress tracking enough on its own. Do not treat
  the missing file as an error.

**If the story is standalone (no epic):** there is no `plan.md` progress table
to write — skip it. Invoke [`integrate`](../integrate/SKILL.md)
directly instead of deferring: it has no later epic close to ride, so this is
where it ships, the same reasoning R5 already states for a bug.

Then, either way:

- Delete the merged branch: `git branch -d story/{scope}/{slug}`.
- If a tracker is configured, move the issue to done (best-effort).

## Scope constraints (critical)

Close is merge-only. The only writes allowed outside this story's own
directory are the epic `plan.md` progress table (story under an epic) and
the merge commit message; a standalone story's `integrate` invocation is the
one substitution for that write, not an addition to it.

- **Never** edit source, config, skill, or docs files from here.
- **Never** create "fix"/"refactor" commits or revert commits on the dev
  branch.
- If something looks wrong, return it as a **finding** — do not act on it.
  It belongs in `records/parking-lot.md` (R4, append-only) — landing it there is
  a separate step from this merge, not a write this skill makes itself.

## Output

- Story merged into the dev branch locally via `--no-ff`.
- Story under an epic: epic `plan.md` progress updated. Standalone story:
  shipped via `integrate` instead (its presented output, shown as part of
  this close).
- Branch deleted; issue done (if any).

## Checklist

- [ ] Retrospective exists and gates are green before merging.
- [ ] Architecture-review check passed (or escape hatch justified).
- [ ] Clean tree — no uncommitted story artifacts.
- [ ] Local `--no-ff` merge, default message, no tracker line.
- [ ] Standalone story: `integrate` invoked, not deferred. Story under an
      epic: progress reported to its `plan.md` instead.
- [ ] Nothing edited outside the scope constraints.
