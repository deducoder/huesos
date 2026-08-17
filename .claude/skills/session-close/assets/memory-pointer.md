---
name: session-pointer
description: "Last session handoff for {project} — date, next action, and handoff path"
metadata:
  node_type: memory
  type: project
  modified: {YYYY-MM-DD}
---

[Template note, delete this line in every real instance — it documents the
template, it is not content: no H1 here, unlike this table's sibling
`assets/handoff.md`. This artifact loads straight into context as a memory
note, never opened and read as a document — a heading has no reader to
navigate for.]

Last session: **{YYYY-MM-DD}** — {one-line summary}.

Full handoff: `work/sessions/{YYYY-MM-DD}-{slug}.md` (read it in full via
`session-start`).

Next action: **{lead-in phrase}** — {detail}.

{Optional: one more paragraph, only if this session leaves something
specific worth flagging beyond the next action — a running experiment's
status, a caveat. Omit entirely when there is nothing to add; do not force
a fourth paragraph out of habit.}

Overwritten on every `session-close`; this is a pointer, the handoff is the
source of truth.
