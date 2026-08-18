---
name: session-pointer
description: "Last session handoff for huesos-mono — date, next action, and handoff path"
metadata:
  type: project
---

Last session: **2026-08-18** — **E9 abierta entera** (brief, scope de 7
historias, design, plan, ADR-013 y ADR-014) y **dos historias cerradas**:
`e9.6`, el «atrás» del sistema recorriendo la aplicación por History API sin
router; y `e9.3`, el hueso aislado entrando entero, con aire por los cuatro
lados y rotación. El usuario encontró en su teléfono un bug de e9.3 que la
suite no podía ver — el punto de órbita desplazado con la cámara—, corregido
con `setViewOffset`.

Full handoff: `work/sessions/2026-08-18-e9-open-back-and-framing.md` (read it
in full via `session-start`).

Next action: **arrancar `e9.5`** (`story-start`) — nombres cortos y
capitalización, con ADR-014 ya escrito y el hallazgo de concordancia de
género («clavícula derecho») incorporado a su alcance.

**Aviso de entorno:** la sesión se cerró para migrar a un entorno remoto. La
verificación manual en teléfono, que en E9 cerró las dos historias y
encontró un bug real, iba por un `vite` en 5173 con túnel de Cloudflare que
allá no existe — decidir cómo se hace antes de dar una historia por cerrada.

Overwritten on every `session-close`; this is a pointer, the handoff is the
source of truth.
