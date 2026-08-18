---
name: deducoder-com-deploy-pattern
description: "cómo se despliegan los sitios de deducoder.com — Cloudflare Worker con activos estáticos + Workers Custom Domain, sin Pages"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T22:40:17.851Z
---

Todos los sitios bajo `deducoder.com` (zona activa en la cuenta de
Cloudflare del usuario, cuenta "Daniel Efraín Domínguez Urbina") se
despliegan como **Cloudflare Workers con activos estáticos**
(`has_assets: true`), nunca Cloudflare Pages. Cada uno lleva un
**Workers Custom Domain** (no una entrada DNS manual) — Cloudflare crea
el registro y el certificado solo al declarar `routes` con
`custom_domain: true` en `wrangler.jsonc`/`wrangler.toml`.

Sitios existentes (`workers/domains` en la API): `wla-landing` →
`elarbol.deducoder.com`, `wla-menu` → `lamilpa.deducoder.com`,
`wla-event` → `boda.deducoder.com`, `wla-demos-hub` →
`demos.deducoder.com`. `huesos-mono` se sumó como `bones-learning` →
`bones.deducoder.com` (2026-08-18).

**Cómo desplegar uno nuevo:**
1. `wrangler.jsonc` con `name`, `compatibility_date`, `assets.directory`
   (el build estático, ej. `./dist`), y `routes: [{ pattern:
   "{subdominio}.deducoder.com", custom_domain: true }]`.
2. Para una SPA: `assets.not_found_handling: "single-page-application"`.
3. `npx wrangler deploy` — autenticado por OAuth ya guardado en
   `~/.config/.wrangler/config/default.toml`, mismo email que el usuario.
4. El herramental MCP `mcp__plugin_cloudflare_cloudflare-api__execute`
   permite inspeccionar zonas/workers/dominios directamente contra la API
   sin pasar por `wrangler` (útil para gemba antes de tocar algo nuevo,
   como se hizo acá para descubrir el patrón antes de replicarlo).
