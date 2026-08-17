---
name: story-start
description: "Start a story: branch from the development branch and write its scope (in scope, out of scope, done when) plus the user story. Use it to begin new story work from the backlog or an epic. Skip it for a quick bug fix (use the bug flow) or to continue a story already in progress. Always branch from the development branch — never from another story or from the epic."
---

# Story — Start

Open the story with a branch and a scope that draws the boundaries: what is in,
what is out, and what "done" looks like as an observable outcome. Clear
boundaries here are what keep the story from sprawling later.

## When

- **Use:** beginning a new story from the backlog or an epic.
- **Skip:** a quick bug fix (use the bug flow); continuing a started story.

## 1 · Verify the epic context

If the story belongs to an epic, confirm the epic's scope exists and lists
this story (see [`../../conventions/work/`](../../conventions/work/convention.md)). If it does
not, start the epic first. A standalone story skips this.

## 2 · Create the tracker issue

If a tracker is configured, create the issue **first** — the key it returns is
what names the branch, the directory, and every commit scope (see
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)):

- Type `Story`, **`--parent {EPIC-KEY}`** when it belongs to an epic (omit it
  for a standalone story). The parent link is what makes the hierarchy true in
  the tracker — nothing else records it.
- Summary: a title, not a sentence — clean, in English, **no type prefix**
  (`Products endpoint`, not `Story: …`); kebab-case the summary and you
  have the `{slug}`. Description: the declared working language, 1-2 lines,
  **without listing sibling items**.
- Verify credentials before creating — creating without them leaves a local
  entry that later syncs as a duplicate.

If the issue already exists, move it to its "in progress" status instead. No
tracker → skip; the story runs on its local id (`s{N}.{M}`).

## 3 · Branch from the development branch

Always from the up-to-date dev branch, per
[`../../conventions/git/`](../../conventions/git/convention.md):

```
git switch {dev-branch} && git pull
git switch -c story/{scope}/{slug}
```

`{scope}` = the tracker key, or the local id (`s3.2`) with no tracker.
`{slug}` = the summary, kebab-cased (see [`../../conventions/work/`](../../conventions/work/convention.md)).
Never branch from another story or from the epic.

## 4 · Write the scope, then commit

Write **one** artifact in the story's work log — under its epic when it has one,
in the root by type when standalone (per
[`../../conventions/work/`](../../conventions/work/convention.md)):

```
work/epics/{EPIC-KEY}-{slug}/stories/{scope}-{slug}/scope.md   # under an epic
work/stories/{scope}-{slug}/scope.md                            # standalone
```

Follow [`assets/scope.md`](assets/scope.md). It holds both what the story *is*
and where it *stops*:

- **User story** — "As a {role}, I want {capability}, so that {benefit}".
- **Acceptance criteria** in Gherkin, plus one concrete example.
- **In scope / Out of scope.**
- **Done when** — observable outcomes, not tasks.

Commit per the git convention (`chore` — process metadata):

```
chore({scope}): initialize story scope
```

Then move the issue to its "in progress" status if a tracker is configured —
best-effort, non-blocking. Tracker sync never blocks story work.

## Output

- Tracker issue created (or found), linked to its epic via `--parent`.
- Branch `story/{scope}/{slug}` from dev.
- `scope.md` committed: user story, acceptance criteria, boundaries, done when.

## Checklist

- [ ] Tracker issue created before branching, with `--parent` when it has an
      epic — the key drives branch, directory, and commit scope.
- [ ] Branch from the dev branch only.
- [ ] Directory under the epic when it has one; root by type when standalone.
- [ ] Scope has In / Out / Done when, and Done when is observable.
- [ ] The user story states role, capability, and benefit.
- [ ] One artifact — `scope.md`; the user story lives inside it.
