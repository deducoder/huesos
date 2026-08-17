---
name: session-close
description: "Close a working session by writing a handoff: what got done, what was decided and why, what is still open, and the one concrete next action. Use it when the user is stopping for the day, wrapping up, or says to leave it there — nothing else captures where the work stood, and by the next session the reasoning is gone. Do not use it to close a story, an epic or a bug; those have their own close skills and their own retrospectives."
---

# Session — Close

Write down where the work stood, while you still remember why. Nothing in the
tooling captures this on its own: the conversation is gone next session, and
what survives is only what someone wrote deliberately.

Keep it short. A handoff that takes ten minutes to write does not get written.

## When

- **Use:** the user is stopping — "lo dejamos aquí", "hasta mañana", "wrap up".
- **Skip:** closing a *work item* (story/epic/bug have their own close skills).
  A session can end mid-story; that is normal and this is what records it.

## 1 · Leave the tree in a known state

Check `git status`. Uncommitted work is the thing that hurts tomorrow —
either commit it (per [`../../conventions/git/`](../../conventions/git/convention.md)) or say
explicitly in the handoff that it is there and why. **Never leave it silent:**
the next session will find unexplained changes and will not know whether they
are half-finished work or debris.

## 2 · Write the handoff

Write `work/sessions/{YYYY-MM-DD}-{slug}.md`, following
[`assets/handoff.md`](assets/handoff.md) — `{slug}` being the session's focus in
two or three words, so the log stays greppable by topic.

Five fields, and the two that carry the weight are **Decided** and **Next**:

- **Decided** — with the *why*. This is what evaporates. A decision without its
  reasoning reads as an arbitrary constraint next week and gets re-litigated.
- **Next** — **one** concrete action, not a list. A list of five defers exactly
  the decision this field exists to force.

Commit it (`chore(session): close {YYYY-MM-DD}` — the scope is the area,
`session`, since a session is not a work item).

## 3 · Refresh the pointer in memory

Overwrite `.claude/memory/session-pointer.md`, following
[`assets/memory-pointer.md`](assets/memory-pointer.md) — date, the one next
action, and the path of the handoff file. It is a **safety net**: if the next
session starts without `session-start` being invoked, that line still surfaces
automatically and points at the full log.

The log in `work/sessions/` is the source of truth; the memory is a pointer, and
it is regenerated on every close so the two cannot meaningfully drift.

## 4 · Save what outlives the session

If something learned today is durable — a pattern, a pitfall, a preference — it
belongs in **memory as its own fact**, not buried in a dated log nobody greps.
The handoff is for *this* session's state; memory is for what stays true after
it.

## Output

- `work/sessions/{YYYY-MM-DD}-{slug}.md`, committed.
- The memory pointer refreshed.
- Working tree clean, or its state stated explicitly in the handoff.

## Checklist

- [ ] Every decision carries its *why*.
- [ ] **Next** is a single concrete action, not a list.
- [ ] Uncommitted work is either committed or explicitly named.
- [ ] Durable learnings went to memory as facts, not into the dated log.
- [ ] Short enough that writing it was not a chore.
