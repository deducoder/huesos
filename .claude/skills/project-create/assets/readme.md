# {project}

{One paragraph: what this is, who it's for, and why it exists. Take it from the
vision — do not restate the whole vision here; this is the front door, not the
strategy doc.}

## Quick start

The shortest path from clone to something running. Commands, not prose.

```bash
{setup — deps, env, services}
{run}
```

{Anything required before the above works: an `.env` to copy, a service to start,
a credential to obtain. Say it plainly — this is where a newcomer gets stuck.}

## Development

Quality gates. **Run `./scripts/check` before every commit.** Nothing enforces
it — a red check will not stop a commit — so run it yourself while working:

```bash
./scripts/check              # lint · format · types · unit tests (seconds)
```

{Slower suites run at push time via `./scripts/check-integration` — keep this
sentence if this project has one, delete it if it does not.}

The gates above do not run a single test. A task's RED step does, so this project's
way to run one lives here too — not a gate, just the command the loop needs:

```bash
{run one test — e.g. pytest path::name · vitest -t "name" · go test -run Name}
```

Everything else about how work is organized (branches, commit format, where
artifacts land) is in **Conventions** below.

## Structure

| Path | What lives here |
|------|-----------------|
| `{src}/` | {the product code} |
| `{tests}/` | {unit tests · integration tests} |
| `scripts/` | Gate entry points (see Development) |
| `governance/` | Vision, requirements, guardrails, architecture (see below) |
| `work/` | Work in progress — one directory per epic / story / bug / spike |
| `records/decisions/` | ADRs — the decisions and their rationale |

## Governance

The durable answers live here, one question per document:

| Document | Answers |
|----------|---------|
| `governance/vision.md` | Why this exists, and the outcomes it aims for |
| `governance/prd.md` | What it must do (`RF-XX` requirements) |
| `governance/guardrails.md` | The quality bars, and how each is verified |
| `governance/backlog.md` | The epics that deliver the vision |
| `governance/architecture/system-context.md` | External actors and interfaces |
| `governance/architecture/system-design.md` | Internal layers and modules |

## Conventions

{Link to the conventions this project follows — commit format, branch model,
work-item layout, artifacts. Do not restate them here; a single pointer keeps
them from drifting out of sync.}
