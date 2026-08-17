---
name: session-start
description: "Open a working session: read the last handoff in full, orient in the repo, reconcile what was planned against what is actually there, and propose what to work on. Use at the start of a session, or whenever the user asks where they left off. The auto-loaded memory index is only a pointer — the handoff has to be read deliberately, and the repo may have moved since it was written. Do not use it mid-session."
---

# Session — Start

Pick the work back up. The point is **not** to read the handoff — it is to
**reconcile it against reality**. The handoff says what was planned; the repo
says what is actually there. Where they disagree, reality wins and you say so.

## When

- **Use:** starting a session, or the user asks "where were we?".
- **Skip:** mid-session — nothing to reconcile.

## 1 · Read the last handoff, in full

Open the most recent `work/sessions/*.md` (they sort by date) and read it
whole. The memory index only carries a pointer line; **that is not the
handoff**. Reading the file is deliberate work, which is the reason this skill
exists.

If there is no handoff at all, say so plainly and orient from the repo alone.

## 2 · Orient in the repo

Two commands tell you most of it, because the conventions make the branch carry
the identity:

```
git branch --show-current    # story/{scope}/{slug} → the work item in flight
git status --short           # residue from last time
```

Read the work item's log (`work/.../{scope}-{slug}/`) if one is in flight —
its `plan.md` says which task is next, `progress.md` what already landed.

## 3 · Reconcile — the step that earns this skill

Check the handoff's **Next** against what the repo shows. It may already be
done, partly done, or no longer make sense:

| Finding | Say |
|---|---|
| Next action already done | Say it — do not re-propose work that exists |
| Partly done | What landed, what is missing |
| No longer applies | Why the ground moved |
| Still valid | Confirm it, and move |

**Uncommitted residue:** if the tree is dirty, resolve it *before* starting
anything new. Ask whether it is half-finished work to continue or debris to
discard. Starting fresh work on top of unexplained changes is how they get
swept into an unrelated commit.

**Executing cache vs repo:** en este repositorio **no aplica** — las skills se
ejecutan desde `.claude/skills/`, versionadas junto al código, así que no hay
caché que pueda quedarse atrás. La sección se conserva por fidelidad al método
original, donde las skills vienen de un snapshot bajo
`~/.claude/plugins/cache/gemba/gemba/` en vez del repositorio —
a stale snapshot once made a closed bug recur in the very session that
closed it. **Precondition — is this repo the plugin's source?** The
comparison only means something in the repo that builds gemba: the repo
root's `.claude-plugin/marketplace.json` must carry a `gemba` entry
pointing into this repo. If it does not — the normal case in every
project that merely consumes gemba — skip this whole comparison and say
so in the orientation ("Executing cache: comparison skipped — this repo
is not the plugin's source"); a consumer repo has no plugin source tree
to compare, and attempting it yields a false alarm, not a verdict. In
the source repo, reconcile:

1. Resolve the **active** cache dir. The root holds many versioned dirs;
   never pick one arbitrarily — comparing against the wrong snapshot is
   worse than not comparing (it has reported live skills as missing).
   Prefer the dir whose `.in_use` marker is non-empty (every dir carries
   the marker; only a live session leaves an entry inside it). If more
   than one dir is marked, resolve by pid lineage: each entry inside
   `.in_use` is a pid — discard entries whose pid is dead (`ps -p`), and
   prefer the dir holding a live pid that belongs to this session's own
   process tree; note dead leftovers as noise. If the same live pid of
   this session's tree marks more than one dir — `/reload-plugins`
   leaves the old snapshot's marker behind — break the tie by the base
   path the currently executing skill loads from: it names the live
   snapshot by construction; treat the older same-pid marker as
   superseded residue and note it as noise. If none is
   marked — after some reloads none is — fall back to the most recently
   modified dir and say the choice is uncertain. If neither signal is
   decisive, report "cannot resolve the active cache" and skip the
   comparison; a loud gap beats a wrong verdict.
2. Compare once: `diff -rq <repo>/plugin <active-cache-dir>`. Expect
   noise — the `.in_use` entry itself shows as cache-only; discount it.
3. Divergence is not an error: it means skill fixes in the repo are
   inert in this session. On files of work still in flight that is the
   steady state; the signal is divergence on files whose work items are
   **closed**. Report which fixes are inert and suggest the human run
   `/plugin update` and `/reload-plugins`.

**Wired core vs shipped core:** a `CLAUDE.md` wired by `/gemba:install` is a
**copy, not a live pointer**. The shipped core moves ahead of it on a
`/plugin update`, and until someone runs `/gemba:update` the session is
governed by the older rules — silently, because nothing compares the two.
Measured on 2026-08-16: both of this repo's wired copies sat two lines
behind the shipped core for hours while sessions ran under them. **Unlike
the cache comparison above, this one runs in every repo** — it needs no
plugin source tree, so a project that merely consumes gemba gets it too.

1. Locate the shipped core from **this skill's own base path**, announced
   at invocation and naming the live snapshot by construction:
   `<base>/../../../CLAUDE.md`. Resolve nothing else — not `.in_use`, not
   mtime, not `installed_plugins.json`, and not `${CLAUDE_PLUGIN_ROOT}`,
   which is notation in the conventions and not a variable a shell can
   expand (verified: it is unset).
2. For each candidate — `~/.claude/CLAUDE.md`, the project's own
   `CLAUDE.md`, `.claude/CLAUDE.md` — treat it as **wired** only if it has
   a `## Non-negotiables` section, the same guard `/gemba:update` §1 uses
   and for the reason stated there. A file that is not wired is not
   reported: it is someone else's file, not a stale copy.
3. Compare only what is **above** `## Project declarations`. The four
   values below it are supposed to differ per target — a copy declaring a
   different working language is correct, not drifted — so including them
   would flag every correctly-wired copy.

Report the `## ` sections that differ, never just "something changed" — and
name the text above the first heading as its own section rather than letting
it report as a blank, since the H1 and the paragraph defining the method live
there. Then
say what to do: `/gemba:update {global | project}`, then a **new** session,
because the refresh cannot reach the session that runs it. **Report the
in-sync case too**, one line: silence cannot be told apart from not having
looked, and a verdict nobody can distinguish from an omission is not
observability. This reports; it blocks nothing.

## 4 · Propose the focus

Do not just report and wait. **Propose actively**, based on what you found:
name the one thing worth doing now and why, given the handoff's Next, the open
questions, and the state of the work item in flight. Then confirm with the
human — proposing is not deciding.

If the handoff left an **open question**, surface it first: it may change what
is worth doing at all, and it is the cheapest thing to resolve while context is
still being loaded.

## Output

A structured orientation — three fixed sections, so every session opens the
same way and the reader scans instead of re-reading:

```
## State
Branch `{branch}` · tree {clean | dirty: what} · work item in flight: {scope | none}

## Reconciliation
- {handoff claim}: {✓ matches | what actually changed}
- Executing cache: {matches repo | diverges — which closed fixes are inert | cannot resolve the active cache | comparison skipped — this repo is not the plugin's source}
- Wired core: {in sync | {target} is behind the shipped core — which sections | nothing wired here}
- Next from the handoff: {still valid | already done | partly done | no longer applies} — {why}

## Proposed focus
{The one thing worth doing now, and why.}

**{The question that unblocks it, if any.}**
```

Each reconciliation bullet is a verdict against reality, not a status dump —
the table in step 3 supplies the verdicts.

## Checklist

- [ ] The handoff file was read whole, not just the memory pointer.
- [ ] Branch and tree state checked before proposing anything.
- [ ] The handoff's Next was reconciled against the repo, not repeated blindly.
- [ ] Uncommitted residue resolved before new work starts.
- [ ] The executing cache was reconciled against `plugin/` — or the skip
      (not the plugin's source) or its irresolution reported loudly.
- [ ] Every wired `CLAUDE.md` was compared against the shipped core above
      `## Project declarations`, and the verdict stated either way.
- [ ] A focus was **proposed**, not merely a status reported.
