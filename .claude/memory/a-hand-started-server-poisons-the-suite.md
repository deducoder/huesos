---
name: a-hand-started-server-poisons-the-suite
description: Un servidor levantado a mano para una demo se queda ocupando el puerto, y la suite de navegador lo reutiliza en vez de construir — mide un artefacto viejo y contradice al código sin avisar.
metadata:
  type: process
---

En e7.2 se levantó `vite preview` a mano para exponer la aplicación por un túnel
y probarla en un teléfono. `playwright.config.ts` trae
`reuseExistingServer: !process.env.CI`, así que las tres sondas siguientes
**reutilizaron ese proceso** en vez de ejecutar su `npx vite build && vite
preview`. Midieron el `dist` de antes del arreglo.

La conclusión equivocada duró tres intentos: «la regla CSS no se aplica». Se
deshizo mirando el artefacto en vez del navegador — `grep touch-action
dist/assets/*.css` la encontró perfectamente emitida. **El navegador y el
artefacto se contradecían, y el artefacto tenía razón.**

**Por qué importa:** el fallo no se anuncia. La suite corre, pasa o falla, y
nada dice «esto no es tu código». Es especialmente traicionero cuando la sesión
mezcla demo y verificación, que es justo lo que pide una historia de interfaz:
levantar la aplicación para mirarla y luego medirla.

**How to apply:** mientras haya un servidor levantado a mano, ninguna medición
de navegador vale sin reconstruir antes (`npx vite build`) — o sin matar el
proceso y dejar que la suite levante el suyo. Y ante un resultado que contradice
lo que el código dice, **comprobar el artefacto construido antes que la
hipótesis**: el bundle es el que sabe qué se está sirviendo. Emparejar con
[[verify-before-naming-a-suspected-bug]].
