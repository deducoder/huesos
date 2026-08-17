---
name: project-create
description: "Set up governance for a new (greenfield) project through conversation: collect its identity, capabilities, quality bars, and architecture, then write the six governance docs (vision, PRD, guardrails, backlog, system context, system design). Use it once, at the start of a project that has no code yet. For an existing codebase use project-onboard instead. Never overwrite existing non-placeholder governance without asking first."
---

# Project — Create (greenfield)

Turn an idea for a new project into its governance: the docs that say what it's
for, what it must do, and the bars it holds itself to. This is the
conversation-first path — you start from **what you want to build**, not from
existing code.

## When

- **Use:** a brand-new project with no source code yet — once.
- **Skip:** existing code → `project-onboard` (discovery-first); governance
  already filled.

## 1 · Collect the project info (conversational)

Ask in sequence, confirming as you go:

1. **Identity** — name + a one-paragraph description (who, what, why).
2. **Capabilities** — 3-5 core things it must do → decompose into 5-8 `RF-XX`
   requirements.
3. **Quality** — testing, code quality, security, performance constraints →
   at least 5 guardrails.
4. **Architecture** — external actors/systems, internal components, protocols.
5. **Project declarations** — the four values the core's own
   `## Project declarations` section carries, defined in
   [`../../conventions/core-declarations.md`](../../conventions/core-declarations.md#the-four-tokens):
   the dev branch, whether an issue tracker is in use (or none, local ids),
   whether a change ships via merge/pull request or a direct merge (solo
   work), and the **working language** that filled-in prose goes in
   (`English` unless the project has a reason to use another).

## 2 · Set up the gate entry point

Write **`scripts/check`** from [`assets/check`](assets/check) and make it
executable, replacing the placeholders with this project's real commands (ask
the developer for the exact incantations — `uv run`, `npm run`, `go`, whatever
this stack uses). Add `scripts/check-integration` with the same shape **only
if** the project has tests that need services running.

**Do not skip this.** Every skill step that says "run the gates" means this
entry point; without it those steps have nothing to run and **the project has
no gates at all, with nothing announcing that fact**. Nothing enforces it
automatically — see `../../conventions/gates.md`. Then verify it runs and is
green before continuing — a gate that fails from birth teaches everyone to
ignore it.

## 3 · Set up versioned memory

Claude Code's own memory feature writes to a per-path directory outside any
repo — left alone, it is never versioned, never travels with a clone, and is
silently orphaned if the directory moves. Bring it under this project's own
governance instead, per
[`../../conventions/memory/`](../../conventions/memory/convention.md):

1. Create `.claude/memory/` in the repo, with an empty `MEMORY.md`.
2. Replace the harness's per-path memory directory
   (`~/.claude/projects/{encoded-path}/memory`) with a symlink into it —
   creating its parent first if this is the project's first-ever session
   (the parent directory may not exist yet).
3. Commit `.claude/memory/` like any other artifact.

## 4 · Write the README and the project CLAUDE.md

Two front doors, for two different readers:

- **`README.md`** — for a human arriving at the repo. What this is, quick
  start, structure, and pointers. Follow
  [`assets/readme.md`](assets/readme.md).
- **`CLAUDE.md`** — for an agent working here: **the gemba core itself**, not a
  file of this skill's own design. Substitute the four tokens into
  `../../core-template.md` and write the result, following the
  fill/compare/write procedure in
  [`../../conventions/core-declarations.md`](../../conventions/core-declarations.md#fill-compare-write).
  The core carries **method only**: what this project says about
  *itself* — how to run it, what surprises a newcomer, its quality bars, its
  layout — belongs to the README above, to `governance/`, and to `scripts/`.

**The README points; the core carries.** The vision belongs in
`governance/vision.md`, and the README points at it — restating it there
guarantees two sources of truth that drift apart, and the reader stops
trusting both. The method is the opposite case: the core *is* the method, in
full, which is exactly why no other file in the repo restates it either.

## 5 · Write the six governance docs

Write them to `governance/`, each following its template in
[`assets/`](assets):

| Doc | Path | Template |
|-----|------|----------|
| Vision | `governance/vision.md` | [`assets/vision.md`](assets/vision.md) |
| PRD | `governance/prd.md` | [`assets/prd.md`](assets/prd.md) |
| Guardrails | `governance/guardrails.md` | [`assets/guardrails.md`](assets/guardrails.md) |
| Backlog | `governance/backlog.md` | [`assets/backlog.md`](assets/backlog.md) |
| System context | `governance/architecture/system-context.md` | [`assets/system-context.md`](assets/system-context.md) |
| System design | `governance/architecture/system-design.md` | [`assets/system-design.md`](assets/system-design.md) |

**Do not overwrite an existing non-placeholder governance doc without asking.**
The project's `CLAUDE.md` is not one of these — step 4 already wrote it from
the core, all four declarations included; re-filling them here would be a
second instruction for one act.

When step 1 confirmed a tracker/docs connector is in use, invoke
[`tracker-bind`](../tracker-bind/SKILL.md) for the tracker line instead of
writing the name inline — it discovers and records the real instance
binding, not just a label. Skip it when the project runs trackerless.

Commit per the git convention. This is the project's zero commit
([`../../conventions/git/`](../../conventions/git/convention.md) — `initial commit`) if it's the
very first, otherwise `chore(governance): initialize`.

## Output

- `scripts/check` — executable, with this project's real commands, verified green.
- `.claude/memory/` versioned in the repo, symlinked from the harness's path.
- `README.md` (for humans) and `CLAUDE.md` — the filled gemba core, for agents
  — at the repo root.
- Six governance docs in `governance/`.

## Checklist

- [ ] `scripts/check` exists, is executable, runs, and passes.
- [ ] `.claude/memory/` created and committed; harness path symlinked into it.
- [ ] README written: what it is, quick start, gates, structure, pointers.
- [ ] CLAUDE.md written from the core, with the four tokens substituted
      (`{dev-branch}`, `{tracker mode}`, `{request|direct}`,
      `{working language}`) and nothing above `## Project declarations`
      altered. The core's other braces — `{scope}`, `{slug}`, `{KEY}` — are the
      method's own notation and are **not** placeholders: they stay.
- [ ] The README restates neither governance nor the method — it points.
- [ ] All six governance fields covered from the conversation.
- [ ] Requirements as `RF-XX`; guardrails with a level and a verification.
- [ ] No non-placeholder **governance doc** overwritten without asking — the
      `CLAUDE.md` is not one of them, and is written from the core regardless.
