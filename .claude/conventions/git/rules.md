# Git — Rules (restrictions and guards)

> Restrictions and guards that surround the commit but are not the shape of it
> — the shape lives in `convention.md`.

## R0 — Reach: every commit in the repository

The rules in this section apply to **all** commits, not only to those produced
by a lifecycle skill. They also apply to meta-work commits (authoring
conventions, tooling, process), which have **no work item** to hold the detail:
there, the detail goes **into the document being written** or into an ADR under
`records/decisions/`, never into the commit body. That is what makes the rule
worth having — it forces knowledge into a findable place instead of leaving it
buried in git archaeology.

## R1 — No body, no footer, no trailer

The commit is **a single line**. Forbidden:
- Extended body (the detail lives in the tracker, the scope or the plan).
- Footer referencing the parent (the scope encodes it).
- `Co-Authored-By:` trailers — dropped by the same simplification, and not
  wanted in the history of a repo that works this way.

## R2 — Language: the description is always in English

Never in Spanish, regardless of the language of the conversation, of the local
documentation or of the tracker. The commit is the only permanent artifact of
the history and is consumed out of context (tooling, changelogs, other teams).
(This contrasts with the tracker description, which follows the declared
working language — see `../tracker/`.)

## R3 — No custom types

`epic(...)`, `bug(...)` and any other type outside the Conventional Commits
vocabulary are forbidden. The container is signalled in the **scope**, not in
the type.

## R4 — Closing merges nothing but the branch

A close **never edits code**: no 'fix' or 'refactor' commits during the merge,
and nothing already in `{dev-branch}` is reverted or amended. What a close finds
wrong it **reports**; the moment it starts fixing, the review that was supposed
to catch the problem has been bypassed by the step that found it.

## R5 — Story defers to the epic, bug ships at once

A story that belongs to an epic merges locally and waits: the push and the
integration belong to `epic-close`, so the team sees one coherent change
instead of a drip of fragments. A bug does the opposite — it reaches
`{dev-branch}` on remote immediately, via its own request or a direct merge
pushed at once (per the declared integration mode) — because a fix that sits
unmerged is a bug still shipped. Deliberate asymmetry, and the reason the two
closes look different. The exact commands live in `story-close` and
`bug-close`, which are where they run.

A **standalone** story (no epic) has no later close to defer to, so it ships
like a bug: immediately, via `integrate`, from its own `story-close`.
The asymmetry above is about *epics batching their stories*, not
about stories deferring on principle — a story with nothing to batch under
follows the bug's rule instead.

## R6 — One integration per epic

The `integrate` technique is invoked from `epic-close` (the epic's single
integration), `bug-close` (a bug's immediate one, R5), and `story-close`
when the story is **standalone** (ships immediately, same reasoning as a
bug) — **never per story that belongs to an epic**. No squashing, and the
only rewriting anyone does is the rebase that a rejected push forces.

## R7 — Trackerless mode: local scope

With no published tracker, the scope uses the local id (`e{N}`, `s{N}.{M}`,
`b{N}.{M}`, `sp{N}.{M}` — `{N}` alone as a flat counter for a standalone
story/bug/spike, `{N}.{M}` only for an epic's child; see `../work/` R4).
With a tracker, the scope is the issue key. This is the same fork as in
`../tracker/` (tracker-first) and `../work/` (directory name).

Which of the two is active is a property of **the adopting project**, not of
this convention: it is declared once in that project's `CLAUDE.md`, next to the
tracker configuration, so a single place answers "does this repo have a
tracker?".

## R8 — What leaves no git trace

- **Sequencing milestones** produced by `epic-plan` are documentation only: no
  commit and no tag of their own. Not to be confused with the **epic
  completion tag** `epic/{scope}-complete`, which `epic-close` does create on
  the dev branch — the one tag the method defines.
- **Techniques** create no branch. **When a work item is in flight**, they
  also create no commit **of their own naming**: `research` and `debug` write
  local artifacts, and those artifacts ride in the commit stream of the
  **work item that invoked them** — never in a commit that names the
  technique as if it were a work item. Everything under `work/` is still
  committed (R6, and `../work/` R3): a technique's artifact is not exempt from
  versioning, only from having a work item's identity.
  **With no work item in flight**, a technique's artifact does get its own
  commit — scope role 3 (`../git/convention.md`), the area affected, not a
  work item id: `docs(research): {topic}`. That commit names the technique's
  domain as an area, the same way `chore(governance): initialize` names one —
  not as if the technique itself were a work item.
  `integrate` does merge and push, but always **on behalf of the work item that
  invokes it** — that trace belongs to the epic or bug, not to the technique.

A **spike is not in this list.** It is a work item: it branches
(`spike/{scope}/{slug}`), **commits its scope and findings to the dev branch,
and only then deletes its branch — never merged**. The order is load-bearing:
the branch carries throwaway code that must not survive, while the artifacts
must, and `git branch -D` discards whatever was committed on the branch it
removes. See `../work/` and R4/R5 for how that differs from story and bug.
