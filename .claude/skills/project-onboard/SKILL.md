---
name: project-onboard
description: "Set up governance for an existing (brownfield) project by first discovering what the code already tells you, then asking only what the code cannot, and writing the six governance docs. Use it once on a codebase that has source but no filled governance. For a greenfield project use project-create. It starts from what EXISTS (read the code and existing docs) and then asks WHY; never overwrite conventions you detected from the code."
---

# Project — Onboard (brownfield)

Bring an existing codebase under governance. The difference from
`project-create` is the starting point: here you begin from **what exists** —
read the code and its docs first — and only then ask the human the *why* that
code can't answer.

## When

- **Use:** an existing project with source code but no filled governance —
  once.
- **Skip:** greenfield → `project-create`; governance already filled.

## 1 · Discover what exists

Before asking anything:

- Read the code structure — modules, entry points, how it's organized — and
  infer the conventions it already follows (naming, layout, test style).
- Read the existing docs (README, ARCHITECTURE, CONTRIBUTING, etc.) to
  pre-populate the governance fields. Always read what's there before asking.

## 2 · Fill the gaps (ask only what the code can't tell)

Present what discovery already covered, then ask **only** for the unfilled:

- **Vision** — who uses it, why it exists (code rarely says this).
- **Capabilities** — 3-5 core things it does → 5-8 `RF-XX` requirements.
- **Architecture gaps** — external actors/systems, protocols.
- **Project declarations** — dev branch name, tracker (or none), integration
  mode, and working language — the same four questions `project-create` asks,
  defined in
  [`../../conventions/core-declarations.md`](../../conventions/core-declarations.md#the-four-tokens);
  code rarely states the last three explicitly enough to infer safely.

## 3 · Write the six governance docs

The same six docs and templates as `project-create` — see
[`../project-create/assets/`](../project-create/assets). Write them to
`governance/`. **Merge the conventions you detected from the code into
`guardrails.md` — never overwrite them**; they are the ground truth of how
this codebase already works.

## 4 · The gate entry point

Brownfield projects usually already have test and lint commands — they are just
not wired to anything. Find how this project actually runs them (its CI config,
its Makefile, its package scripts) and write **`scripts/check`** from
[`../project-create/assets/check`](../project-create/assets/check) using those
real commands. Make it executable and **verify it passes** before continuing.

If it does not pass on an untouched codebase, **stop and report it** — you have
found a pre-existing broken state, and declaring a gate every task is then
expected to run green would make the method start life in violation. That is a
finding for the developer to decide on,
not something to paper over by trimming the gate.

## 5 · Set up versioned memory

Claude Code's own memory feature writes to a per-path directory outside any
repo — left alone, it is never versioned, never travels with a clone, and is
silently orphaned if the directory moves. Bring it under this project's own
governance instead, per
[`../../conventions/memory/`](../../conventions/memory/convention.md):

- **The harness's per-path memory directory already has content** (the usual
  case if this project has been worked on before) → move that content, as is,
  into `.claude/memory/` in the repo, then replace the original with a
  symlink into it. Verify a read and a write still resolve correctly through
  the symlink before continuing — do not delete the original until that is
  confirmed.
- **It is empty or does not exist yet** → create `.claude/memory/` with an
  empty `MEMORY.md`, then symlink the harness's path into it. If the harness
  has never run a session from this project's directory, its whole per-path
  parent (`~/.claude/projects/{encoded-path}/`) may not exist yet either —
  create it first rather than assuming it is there.

Commit `.claude/memory/` like any other artifact.

## 6 · The README and CLAUDE.md: leave what exists, create what is missing

For each of `README.md` and `CLAUDE.md`:

- **It exists** (the usual brownfield case) → **do not overwrite it.** You
  already read it in step 1; it is the maintainers' voice and may hold context
  no governance doc captures. At most, offer to add what is missing — the gate
  command, the single-test command, a pointer to `governance/`, and the
  "Project declarations" section (step 2) are the ones worth having.
- **It does not exist** → write `README.md` from
  [`../project-create/assets/readme.md`](../project-create/assets/readme.md),
  filled from what discovery found rather than from questions — above all from
  what *surprised you* while reading this codebase, since that is exactly what
  will surprise the next agent. Write `CLAUDE.md` from the **gemba core**
  instead: substitute the four tokens into `../../core-template.md`
  per
  [`../../conventions/core-declarations.md`](../../conventions/core-declarations.md#fill-compare-write).
  The core carries method only; everything this project says about
  itself belongs to the README and to `governance/`.

Either way, when step 2 confirmed a tracker/docs connector is in use,
invoke [`tracker-bind`](../tracker-bind/SKILL.md) for the tracker line
instead of writing the name inline — same as `project-create`. Skip it when
the project runs trackerless.

Commit `chore(governance): onboard`.

## Output

- `scripts/check` wired to the project's existing commands, verified green.
- `.claude/memory/` versioned in the repo, symlinked from the harness's path
  (existing memory content migrated as is, if any existed).
- Six governance docs in `governance/`, reflecting discovery + conversation.
- Detected conventions preserved in guardrails.
- README and CLAUDE.md left intact, or created if missing — the README from its
  template, the CLAUDE.md from the gemba core.

## Checklist

- [ ] Code and existing docs read before asking the human anything.
- [ ] Only the code-can't-tell fields were asked.
- [ ] `scripts/check` wired to the project's real commands and passing — or a
      pre-existing failure reported, not hidden by trimming the gate.
- [ ] `.claude/memory/` created and committed; existing memory content
      migrated as is (never rewritten) before the symlink replaces it.
- [ ] Detected conventions merged into guardrails, not overwritten.
- [ ] Existing README and CLAUDE.md never overwritten; created only if absent.
- [ ] Same governance docs and templates as project-create.
- [ ] Project declarations (dev branch, tracker, integration mode, working
      language) asked and filled — same four as project-create, whether in a
      new CLAUDE.md or offered as an addition to an existing one.
