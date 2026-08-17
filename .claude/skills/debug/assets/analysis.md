# Debug: {name}

## Tier

{XS | S | M/L} · time-box {5 min | 15 min | 30-60 min} · method: {skip to
fix | 5 Whys | Ishikawa}

## Reproduction

WHAT: {behavior observed} · WHEN: {trigger} · WHERE: {file:line} ·
EXPECTED: {correct behavior}

## Root cause

{the technical cause. **Distinct from** a problem brief's `Root cause`,
which is why a problem worth solving persists — same distinction
`bug-analyse` draws, and it applies identically here.}

## Evidence

{the 5 Whys chain, or the Ishikawa hypothesis table with its verdicts:
{hypothesis} → {how tested} → {found} → confirmed / eliminated}

## Fix and prevention

{what was fixed, the RED→GREEN regression test, and the prevention added —
input validation at the boundary, a doc/ADR note, or a memory entry for a
recurring systemic issue}

## Tasks fed to the plan

{the tasks named into `story-plan` / `bug-plan` — debug diagnoses, the
plan carries the work}
