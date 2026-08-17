---
name: tracker-bind
description: "Discover and record the concrete binding between this project and its connected tracker/docs instance — project key, issue-type vocabulary, field mappings, parent-link shape, docs space. Use it from project-create/project-onboard when a tracker is declared, or standalone whenever the instance changes (new project, renamed key, a field added). Skip it when the project runs trackerless (no tracker/docs MCP connector to bind to). Never guess a binding — every value here comes from a live, verified discovery, not from memory or assumption."
---

# Tracker — Bind

Turn "there is a tracker" into a recorded, reusable binding: which
project/space this repo targets, and how gemba's own vocabulary
(Severity, Origin, the four work-item types, the parent link) maps onto
this instance's real fields. One discovery, written down, instead of every
tracker-first skill rediscovering the same thing via live calls.

This skill is **re-invocable**, unlike the once-per-project skills next to
it — run it again whenever the instance changes, not only at initial setup.

## When

- **Use:** called from `project-create`/`project-onboard` when the human
  confirms a tracker/docs connector is in use; or standalone, any time the
  instance changes (a new project, a renamed key, a custom field created).
- **Skip:** the project runs trackerless — nothing to bind.

## 1 · Identify the connector

"Verify access" (next step) presumes the connector to verify access *to* is
already known — settle that first, explicitly, every invocation:

- List every tracker/docs MCP connector actually visible this session — do
  not assume a fixed set; a different project may have Linear, GitHub
  Issues, Trello, or Jira/Confluence connected instead.
- **Zero found** → this project runs trackerless. Say so and stop — the
  same exit as `## When`'s "Skip," not a new failure mode.
- **One found** → confirm it explicitly with the human before continuing.
  A single detected connector is still a presumption, not a decision
  already made.
- **Two or more found** → present them as choices, naming each one's
  underlying system (e.g. "Atlassian Rovo (Jira + Confluence)"), not just
  its connector id — plus a free-text option for a connector this session
  doesn't already show. Do not proceed until the human confirms one.

## 2 · Verify access first

Same precondition as
[`../../conventions/tracker/rules.md`](../../conventions/tracker/rules.md)
R2: confirm the tracker/docs connector identified above is reachable and
authenticated before doing anything else. If it is not, **stop and report
the gap** — do not write a partial or guessed binding. This is a discovery
skill, not a declaration skill: every value it records must come from a
live call, never from what the human or a prior session merely stated.

## 3 · Discover the instance

Against the connector identified and access-verified above:

- **Project/space identity** — the concrete key(s) this repo targets.
- **Issue-type vocabulary** — which of gemba's four work-item types (epic,
  story, bug, spike) exist natively in this instance, by name, and which
  don't (record the gap, do not invent a workaround here).
- **Parent-link shape** — a native parent field, or a link/custom-field
  mechanism instead — whichever this instance actually uses.
- **Field bindings** — where gemba's Severity and Origin dimensions
  (`../../conventions/tracker/rules.md` R5) land on this instance's real
  fields. A dimension with no matching field yet is a recorded gap, not a
  blocker.
- **Docs space** — the space this project's documentation-producing skills
  should target, if a docs system is connected.

## 4 · Confirm before writing

Present what was discovered and get the human's confirmation before writing
anything — a wrong binding silently corrupts every tracker call downstream
it. Never auto-write without this step.

## 5 · Write the two artifacts

- **`CLAUDE.md`** — update the `Tracker` line in `Project declarations` to
  the confirmed project/space identity, plus a one-line pointer to the full
  binding. Stays terse — this is a declaration, not the detail.
- **The adopting project's own `conventions/tracker/instance.md`, at the
  repo root** — never `plugin/conventions/tracker/`, which stays generic
  and shipped with the plugin; this file is specific to one live instance
  and does not belong there. Follow
  [`assets/instance.md`](assets/instance.md). **Overwrite** on
  re-invocation — this file holds the current binding, not a history of
  every past one.

## Output

- `CLAUDE.md`'s `Tracker` line updated (project/space identity + pointer).
- `conventions/tracker/instance.md` written or overwritten with the full,
  live-verified binding.

## Checklist

- [ ] Connector identified and confirmed with the human before verifying
      access — even when only one was detected.
- [ ] Access verified live before any discovery call — no cached or assumed
      credentials.
- [ ] Every recorded value came from a live call this invocation, not from
      what a human stated or a prior session recorded.
- [ ] A dimension or field with no match is recorded as a gap, not
      papered over or invented.
- [ ] Human confirmed the binding before it was written.
- [ ] `CLAUDE.md`'s `Tracker` line stays terse; the detail lives only in
      `instance.md`.
- [ ] Re-invocation overwrites `instance.md`, it does not append.
