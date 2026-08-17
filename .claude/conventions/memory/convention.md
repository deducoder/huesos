# Memory — Convention

> How a project's assistant memory is versioned. No restrictions have been
> needed yet — unlike its four siblings, this convention has no `rules.md`;
> one gets added the day a real restriction emerges.

## The problem this solves

Claude Code's own memory feature creates a per-path directory outside any
repo (`~/.claude/projects/{encoded-path}/memory/`), with no awareness of git.
Left alone, that content is never versioned, never travels with a clone, and
is silently orphaned the moment its directory moves — found during gemba's
own development, evidenced by hundreds of orphaned memory namespaces for
long-deleted `/tmp` directories.

## Where memory lives

Inside the project's own repo, at **`.claude/memory/`** — versioned exactly
like any other artifact, alongside `records/parking-lot.md` and
`records/decisions/`. `MEMORY.md` and every individual memory file sit flat in
that directory, matching the structure the harness's own memory feature
documents and expects.

The name mirrors the global `~/.claude/` directory on purpose: the
relationship between `~/.claude/projects/{path}/memory/` (global, per-path)
and `.claude/memory/` (local, per-repo) stays symmetric.

## How the harness reads it: a symlink, not a copy

`~/.claude/projects/{encoded-path}/memory` is replaced with a symlink
pointing at `{repo}/.claude/memory` — never a copy that could drift.
Read/Write/Edit tools resolve through the symlink transparently (proven
empirically during gemba's own development: a write through the harness's
path landed, byte for byte, in the repo's own file, confirmed by reading it
back through a second, independent path).

## Isolation between projects

Each project's `.claude/memory/` lives inside its own repo — there is no
shared or cross-project memory store. A project never reads or references
another project's memory directory.

## Setup

Established once per project, at `project-create` or `project-onboard` time
(see [`../skills/`](../skills/)):

1. Create `.claude/memory/` in the repo, with an empty `MEMORY.md` (or the
   project's existing memory content, in the onboarding case).
2. Replace the harness's per-path memory directory with a symlink into it.
3. Commit `.claude/memory/` like any other artifact.

## Open question, not yet decided

Whether leaf memory files can move into a `.claude/memory/memories/`
subdirectory for tidiness is an open, unproven question — Claude Code's
automatic recall mechanism is documented to scan file descriptions, but
whether that scan includes subdirectories is not publicly documented. A
canary experiment in gemba's own repository is testing this empirically
before this convention recommends it. Until that resolves, memory files
stay flat.
