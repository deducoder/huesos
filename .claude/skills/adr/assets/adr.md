---
type: adr
id: ADR-{NNN}
title: "{short title — the decision, not the problem}"
status: accepted
date: {YYYY-MM-DD}
epic: {E{N} or —}
---

# ADR-{NNN}: {title}

## Status

Accepted

## Context

{The forces at play, and the tension between them. What made this a decision
rather than an obvious step.}

{Traceability: cite the requirements and guardrails that constrain it —
`RF-XX`, `MUST-...` — so the reader sees what was non-negotiable.}

Options:

- **(A) {option}** — {what it buys, and why it fails or falls short}
- **(B) {option}** — {…}
- **(C) {option}** — {…}

## Decision

**Option ({X}):**

1. {concrete specific — a file, a boundary, a shape}
2. {…}

{If part of it is deliberately deferred, say so and say until when: "extracted
when the second model arrives, not before". A deferral recorded here is a
decision; a deferral left unsaid is an omission.}

## Consequences

**Positive:**
- {what this buys, tied back to the requirement or guardrail it satisfies}

**Negative / costs:**
- {what it costs — and why that cost is acceptable}

An ADR with no negative consequences is selling, not deciding.

## Alternatives considered

- **({X}) {rejected option}:** {why it lost — the specific constraint it
  violated, not a vague preference}
