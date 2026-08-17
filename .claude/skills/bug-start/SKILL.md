---
name: bug-start
description: "Start a bug fix: branch from the development branch, reproduce the bug, and write its scope (what / when / where / expected / done when). Use it when a bug needs formal resolution with a branch and traceable artifacts. Skip it for a trivial typo or obvious one-liner — commit that directly. Never investigate before you have reproduced the bug; an unreproduced bug is not ready for this."
---

# Bug — Start

Open the bug: a branch, a confirmed reproduction, and a scope that says what
the bug is and when it is fixed. **Reproduce before anything else** — you
cannot fix, or even trust, a bug you have not seen happen.

## When

- **Use:** a real bug needs a branch, artifacts, and traceability.
- **Skip:** a trivial typo or obvious one-liner — fix and commit directly.
  Or the scope already exists (already started).

## 1 · Create the tracker issue

If a tracker is configured and the bug isn't filed yet, create it **first** —
its key names the branch, the directory, and every commit scope (see
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)):

- Type `Bug`, **`--parent {EPIC-KEY}`** when the bug belongs to an epic (omit it
  for a standalone bug). Nothing else records that hierarchy.
- Summary: a title, not the symptom sentence — clean, in English, **no type
  prefix** (`JSON-RPC timeout on read`, not `[Bug] …`). Kebab-case the
  summary: if the result is not the `{slug}` you would branch with, keep
  titling. The symptom sentence itself is the description's first line
  (declared working language, 1-2 lines).
- Verify credentials before creating.

If it already exists, move it to its "in progress" status. No tracker → skip;
the bug runs on its local id (`b{N}.{M}`).

## 2 · Branch from the development branch

Per [`../../conventions/git/`](../../conventions/git/convention.md), from the up-to-date dev
branch:

```
git switch {dev-branch} && git pull
git switch -c bug/{scope}/{slug}
```

`{scope}` = the tracker key, or the local id (`b3.1`) with no tracker.
`{slug}` = the summary, kebab-cased (see [`../../conventions/work/`](../../conventions/work/convention.md)).

## 3 · Reproduce, then write the scope

**Reproduce first** — confirm the bug is observable. Only then write `scope.md`
in the bug's work log — under its epic when it has one, in the root by type when
standalone (per [`../../conventions/work/`](../../conventions/work/convention.md)):

```
work/epics/{EPIC-KEY}-{slug}/bugs/{scope}-{slug}/scope.md   # under an epic
work/bugs/{scope}-{slug}/scope.md                            # standalone
```

Following [`assets/scope.md`](assets/scope.md), with this exact shape:
`WHAT:` / `WHEN:` / `WHERE:` / `EXPECTED:` / `DONE WHEN:`.

No `##` headings, unlike the epic's, story's, or spike's `scope.md`: this is
five one-line facts filled in immediately after reproducing, not narrative
content that benefits from being sectioned. `techniques/debug`'s
`analysis.md` independently converges on the same flat WHAT/WHEN/WHERE/
EXPECTED style for its own reproduction block — the pattern for a terse,
single-pass fact sheet, not a one-off.

Commit per the git convention (one line, English, no trailer, `chore` — this
is process metadata):

```
chore({scope}): initialize scope
```

Then move the issue to its "in progress" status if a tracker is configured —
best-effort and non-blocking: if there is no tracker, or the move fails, log it
and continue. Tracker sync never blocks the work.

## Output

- Tracker issue created (or found), linked to its epic via `--parent`.
- Branch `bug/{scope}/{slug}` from the dev branch.
- `scope.md` committed with WHAT/WHEN/WHERE/EXPECTED/DONE WHEN.

## Checklist

- [ ] Tracker issue created before branching, with `--parent` when it has an
      epic — the key drives branch, directory, and commit scope.
- [ ] Branch created from the dev branch, never from another branch.
- [ ] Directory under the epic when it has one; root by type when standalone.
- [ ] Bug reproduces before any investigation.
- [ ] Scope has all five fields and a concrete, observable "Done when".
- [ ] Never investigate before reproducing.
