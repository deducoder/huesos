# Tracker — Instance binding

> What this concrete instance answers to the open questions in the gemba
> plugin's tracker rules (`conventions/tracker/rules.md`), section
> "Instance bindings to settle when a tracker is connected". Facts about
> one real instance, not a generic rule — that is why this file lives in
> the project instead of shipping with the plugin.

## Connector

- **Service:** {tracker/docs service name}, site {site identifier}
- **Reached via:** {how it's connected — an MCP config file versioned in
  this repo, or an account-level connector not declared here}

## {Tracker system, e.g. Jira}

- **Project key:** {key} ({display name})
- **Issue types confirmed:** {which of epic/story/bug/spike exist, by
  name — and which don't}
- **Parent link:** {native field name | link-type/custom-field name}
- **Severity → real field:** {field name and its values | "pending — no
  matching field yet"}
- **Origin → real field:** {field name and its values | "pending — no
  matching field yet"}
- **Components:** {defined values | "field exists, no values defined yet"}

## {Docs system, e.g. Confluence}

- **Space key:** {key} ({display name})

## Last verified

{YYYY-MM-DD}, live against the real instance — never assumed or carried
over from a prior session without re-checking.
