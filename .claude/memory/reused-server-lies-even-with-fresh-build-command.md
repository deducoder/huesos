---
name: reused-server-lies-even-with-fresh-build-command
description: "reuseExistingServer:true en Playwright reutiliza cualquier proceso vivo en el puerto, sin reconstruir — incluso si el webServer.command dice `vite build && vite preview`. Verificar con `ps aux | grep vite` antes de confiar en un resultado de check-integration."
metadata: 
  node_type: memory
  type: pitfall
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T02:04:18.135Z
---

`playwright.config.ts` (huesos-mono) declara
`webServer.command: 'npx vite build && npx vite preview --port 4173'` con
`reuseExistingServer: !process.env.CI`. En e8.4, un `vite preview` de
horas antes de la sesión seguía vivo en el puerto 4173 — Playwright lo
reutilizó tal cual, sin ejecutar el `build` nuevo, y la primera corrida de
`./scripts/check-integration` dio verde/rojo midiendo código viejo, no el
cambio real de la historia.

**Por qué importa:** el comando del `webServer` promete reconstruir, pero
esa promesa solo se cumple si el puerto está libre. Un proceso sobrante
—propio de una verificación manual anterior en la misma sesión, o de una
sesión distinta horas antes— hace que la suite mida un build fantasma sin
ningún error visible: el resultado simplemente no corresponde al código
actual. Mismo patrón que [[a-hand-started-server-poisons-the-suite]], pero
sin que nadie haya levantado el servidor "a mano" en esa tarea — basta con
no haber matado bien uno anterior (matar el PID del shell que lo lanzó, no
el del proceso real de `vite`, deja el servidor vivo).

**How to apply:** antes de confiar en un resultado de una suite con
`webServer`/`reuseExistingServer`, correr `ps aux | grep -i "vite preview"`
(o el equivalente del stack) y matar cualquier proceso sobrante en ese
puerto. Al levantar un servidor manual propio para una verificación,
guardar el PID real del proceso (no el del shell que lo lanzó con `&`) y
confirmar que el puerto queda libre después de matarlo.
