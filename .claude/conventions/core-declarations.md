# Core — Project declarations

> Shared by every caller that writes a `CLAUDE.md` from the core: the four
> tokens `## Project declarations` fills, and the procedure that fills the
> core template with them and writes the target file. Referenced, not
> repeated — callers supply the values differently (asked fresh, or
> extracted from an existing target), but the fill/compare/write mechanics
> are the same either way. `## Determine the target` below is the one part
> that is the commands' alone; a skill already knows its target.

## Determine the target

Both commands take `$1` — `global` or `project` (a stray leading `-`, e.g.
`-project`, is tolerated: strip it and match).

- **`$1` resolves to `global` or `project`** → use it directly. No
  detection, no question.
- **`$1` is empty or unrecognized** → auto-detect, file evidence first:
  1. **Check for a wired core.** Does the project's own `CLAUDE.md` (or
     `.claude/CLAUDE.md`) have a `## Non-negotiables` section? Does
     `~/.claude/CLAUDE.md`?
     - **Exactly one** has it → target that one — a wired core is
       stronger evidence than plugin enablement. Say so explicitly,
       naming the file found.
     - **Both** have it → no reliable signal from file content alone. Ask
       the human directly (global or project) — never guess.
     - **Neither** has it (the genuine first-time-anywhere case) → fall
       through to the enablement check below.
  2. **`enabledPlugins["gemba@gemba"]`** (only reached when neither
     candidate file is a wired core):
     - **Project-local:** `.claude/settings.json` in the current project root.
     - **Global:** `~/.claude/settings.json`.
     - **Exactly one** of the two has it `true` → target that one, and **say
       so explicitly** — name the file and key that decided it, not just
       "detected project."
     - **Both true, or neither present/true** → no reliable signal. Ask the
       human directly (global or project) — never guess.

## The four tokens

`../core-template.md` (the core) ends in its own
`## Project declarations` section with four tokens — `{dev-branch}`,
`{tracker mode}`, `{request|direct}`, `{working language}`:

- **`{dev-branch}`** — the integration branch every story, bug and spike
  branches from and merges back into (`develop`, `dev`, `main`…).
- **Tracker mode** — is a tracker connected (scope and directories use the
  issue key), or is the repo local-only (`e{N}` / `s{N}.{M}` ids)?
- **Integration mode** — `request` (push branches, open merge/pull requests
  on the VCS host — the team default) or `direct` (merge locally `--no-ff`
  and push — the solo default, needs no host tooling).
- **Working language** — the language filled-in prose and free-form content
  go in (ADRs, governance, work logs, a template's filled placeholders);
  `English` if the project has no reason to use another. Never affects a
  template's own fixed scaffolding — headings, boilerplate, frontmatter,
  controlled vocabulary — which always stays English (the core's
  `## Language` section).

## Fill, compare, write

Given the four values (however the caller obtained them) and the target
file path:

1. **Fill the placeholder.** Read `../core-template.md` and
   substitute the four tokens with the values.
2. **Compare.** Diff the filled result against what currently exists at the
   target.
   - **Identical** → leave the target alone; report "already up to date,
     nothing written."
   - **Different** → overwrite the target with the filled result —
     everything above `## Project declarations` stays byte-identical to
     the core; only the declarations section (and whatever changed above
     it) differs from what was there before. Report what changed (which
     section(s) differ), not just that something did.
3. **This is a copy, not a live pointer** — the target only reflects the
   core as of the last time this procedure ran. After `/plugin update`,
   the shipped core can have moved ahead of every previously-written
   target; re-running the owning command (`install` or `update`) is the
   only thing that syncs them again.
