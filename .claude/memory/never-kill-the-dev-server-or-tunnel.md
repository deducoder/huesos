---
name: never-kill-the-dev-server-or-tunnel
description: El dev server de vite y su túnel de Cloudflare se dejan vivos siempre; volver a levantarlos cuesta y la URL del túnel cambia.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T05:26:00.417Z
---

No matar nunca el `vite` de desarrollo (5173) ni el `cloudflared` que lo
expone. El usuario prueba en su teléfono a través de ese túnel.

**Why:** relanzarlos es trabajo manual suyo, no mío, y cada reinicio del
túnel cambia la URL — por eso `vite.config.ts` pasó a aceptar
`.trycloudflare.com` entero en vez de un subdominio fijo.

**How to apply:** antes de cualquier comando que ocupe puertos, mirar qué
hay vivo con `ss -ltnp` / `ps`, y trabajar alrededor. Los `vite preview`
huérfanos de `check-integration` (4173-4180) **sí** hay que limpiarlos —
son otra cosa, ver [[reused-server-lies-even-with-fresh-build-command]] y
[[a-hand-started-server-poisons-the-suite]] — pero se avisa antes de
matarlos.
