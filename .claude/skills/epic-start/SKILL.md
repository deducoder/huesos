---
name: epic-start
description: "Start an epic: create its directory, write the brief (hypothesis, appetite, scope boundaries), then register it in the tracker. The brief is the only artifact it writes — the scope belongs to epic-design, which cannot be written before the epic is decomposed. Use it to begin a body of work spanning roughly 3-10 stories. Skip it for a single story (use the story flow) or a bug. An epic is a logical container — a directory plus a tracker entry — not a branch; its stories branch from the development branch, never from the epic."
---

# Epic — Start

Open the epic as a container: a directory that will hold its stories' work, a
brief that states the bet, and an entry in the tracker. **An epic has no branch
of its own** — it is a logical grouping; stories branch from the dev branch.

## When

- **Use:** a new body of work spanning ~3-10 stories.
- **Skip:** a single story (story flow), a bug (bug flow), or continuing an
  epic already started.

## 1 · Check for a directory collision

Before creating anything, confirm no epic directory already uses this id — a
collision corrupts identity downstream:

```
ls work/epics/ | grep -i "^{EPIC-KEY}-"
```

A match → stop and pick a different epic id.

## 2 · Write the brief

**First, check `work/problem-briefs/`** for a brief covering this initiative.
Most epics never pass through [`problem-shape`](../problem-shape/SKILL.md)
— finding nothing is the normal case, and this is a lookup, never a
prerequisite. When one does exist, derive from it instead of re-deriving the
same thinking from memory:

| Problem brief | feeds |
|---|---|
| §2 For whom · §3 Current state | the hypothesis's audience and gap |
| §5 Early signal · §6 Hypothesis | the leading metric and how it is measured |

The solution, the category, the differentiator and the **appetite** are not in
there — they are decisions taken here. **Cite the file, do not copy its
sections**: the reasoning stays where it was written, and `brief.md` carries
`Shaped from: work/problem-briefs/{slug}.md` so the trail is walkable.

On the dev branch, in the epic's directory (`work/epics/{EPIC-KEY}-{slug}/`,
see [`../../conventions/work/`](../../conventions/work/convention.md)), write **one** artifact:

**`brief.md`** — the bet: hypothesis, success metrics, appetite, and scope
boundaries (no-gos and rabbit holes — **not** an in-scope list, which is the
decomposition's output). Follow
[`assets/brief.md`](assets/brief.md).

**Do not write `scope.md` here.** The epic's scope — objective, story
breakdown, done when — is owned by `epic-design`, because you cannot list an
epic's stories before decomposing it (see
[`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)). The brief states the
bet; the scope states what was decided.

Commit per the git convention (`chore` — process metadata):

```
chore({scope}): initialize {epic-name}
```

## 3 · Register in the tracker

If a tracker is configured (see [`../../conventions/tracker/`](../../conventions/tracker/convention.md)):

- **New epic** → create it: clean English summary (no type prefix) — a
  title, not a sentence; kebab-case the summary and you have the directory
  `{slug}` — plus a 1-line description in the declared working language,
  no parent (an epic is top-level). **Credentials must be verified before creating** — creating
  without them leaves a local entry that later syncs as a duplicate.
- **Existing epic** → move it to its "in progress" status.

Best-effort and non-blocking.

## Output

- Epic directory with `brief.md`, committed.
- Epic registered in the tracker (if any).
- No branch — the epic is a container.

## Checklist

- [ ] No directory collision on the epic id.
- [ ] Brief has hypothesis, success metrics, appetite, and its exclusions
      (no-gos, rabbit holes) — and **no** in-scope list.
- [ ] Only `brief.md` written — `scope.md` belongs to `epic-design`.
- [ ] Committed on the dev branch — no epic branch created.
- [ ] Tracker entry created with credentials verified (or skipped, no tracker).
