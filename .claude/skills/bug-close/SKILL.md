---
name: bug-close
description: "Close a fixed bug: verify every artifact exists, run the architecture-review check and the full gate suite, then ship the fix to the development branch immediately — a merge/pull request in request mode, a local --no-ff merge pushed at once in direct mode — and delete the local branch. Use it after the retrospective is written. Close only touches version control — never edit source, config, or docs from here; if something looks wrong, report it as a finding instead of acting."
---

# Bug — Close

Ship the fix **immediately** — a bug that sits unmerged is a bug still
shipped. How it ships follows the project's integration mode: a merge/pull
request, or a direct merge pushed at once. Close only touches version control:
it verifies the work is complete and ships it. **It does not edit code.**

## When

- **Use:** the retrospective exists and all gates passed in the fix phase.
- **Skip:** never — closing is how the work becomes visible.

## 1 · Verify completeness and a clean tree

Every artifact must exist in the bug's work log, and the tree must be clean:

```
scope.md · triage.md · analysis.md · plan.md · retrospective.md
```

If any is missing, **stop** and run the phase that produces it. If there are
uncommitted changes, commit them before pushing.

## 2 · Architecture-review check

Before pushing, run the review checklist (the
[`architecture-review`](../architecture-review/SKILL.md) discipline
— Beck's rules, applied to the fix). Skip only for XS/docs/tooling fixes with
no production-code change:

1. **Structural drift** — any orphaned symbols or dead public APIs left behind?
2. **Necessary complexity only** (Beck-R2) — no speculative abstractions, no
   unused parameters, no dead branches.
3. **Convention** — naming, module placement, and public surface consistent
   with the codebase.

If all three hold, continue; otherwise fix first.

## 3 · Integrate

Ship the fix with the [`integrate`](../integrate/SKILL.md)
technique — source `bug/{scope}/{slug}`, target `{dev-branch}`, title
`fix({scope}): {summary}`, body `Root cause: {one line}`. Title and body are
the **request's**, used only in `request` mode; `direct` mode merges with git's
default message and ignores both. They are never a commit body — R1 forbids
those. It runs the full suite (the fix phase ran only scoped gates — this
is the moment the whole thing must be green), syncs with the target, and ships
per the project's declared integration mode.

Then, if a tracker is configured, move the issue to its done status
(best-effort — the fix already shipped).

## 4 · Clean up

```
git switch {dev-branch}
git branch -D bug/{scope}/{slug}
```

## Scope constraints (critical)

Close touches version control and nothing else:

- **Never** edit source code, config, or docs from here.
- **Never** create "fix" or "refactor" commits, or revert commits already on
  the dev branch.
- If something looks wrong, return it as a **finding** — do not act on it.
  It belongs in `records/parking-lot.md` (R4, append-only) — landing it there is
  a separate step from this close, not a write this skill makes itself.

## Output

- The fix shipped to the dev branch: request open, or direct merge pushed.
- Local branch deleted; issue moved to done in the tracker (if any).

## Checklist

- [ ] Every artifact verified before closing (scope, triage, analysis, plan, retro).
- [ ] Architecture-review check passed (or escape hatch justified).
- [ ] Full gate green, then shipped per the declared mode — asked if undeclared.
- [ ] Local branch deleted after shipping.
- [ ] Nothing edited outside the scope constraints.
