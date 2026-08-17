# Story e7.1: Tokens y shell — Progress

## T1 · Los tokens en `@theme` y el shell táctil

- **RED:** `e2e/mobile-shell.spec.ts` en 390×844 falló con
  `alto de "Explorar" — Expected: >= 44, Received: 32`. El design estimaba
  ~30 px; el valor real es 32.
- **GREEN:** `src/index.css` pasa de una línea a `@import` más el bloque
  `@theme` con nueve colores, dos radios, la sombra dura, `--spacing-tactil` y
  `--text-titulo`. En `App.tsx`, `main`, cabecera y pestañas consumen tokens;
  las pestañas toman su alto de `min-h-tactil`, no de un padding elegido a ojo.
- **Gates:** `./scripts/check` verde (202 tests) y
  `npx playwright test e2e/mobile-shell.spec.ts` verde.

**Lo que el plan no anticipó:**

- **Biome no parseaba `@theme`.** `npm run lint` cortó con
  `Tailwind-specific syntax is disabled` sobre `src/index.css:16`. Es
  configuración, no código: `biome.json` gana
  `"css": { "parser": { "tailwindDirectives": true } }`, una línea. El
  `@import "tailwindcss"` que ya existía no lo activaba porque `@import` es CSS
  estándar; `@theme` no lo es. Ninguna historia posterior de la épica lo
  encontrará ya.
- **Reescribir `biome.json` con un volcado JSON generó 30 líneas de diff de
  formato.** Biome conserva el estilo de objeto del original, igual que
  Prettier. Revertido y reeditado a mano: el diff real es de una línea.
- **El conteo de tests del handoff estaba desactualizado.** Decía 201 unitarios;
  `main` sin tocar da **202**. Medido con `git stash` antes de seguir, para no
  arrastrar la cifra a los criterios de aceptación.

**Estado intermedio conocido:** entre T1 y T3 la aplicación tiene el shell claro
y las vistas interiores con texto claro heredado, o sea ilegibles. Es el estado
que T3 cierra; no llega a `main` porque la historia se cierra entera.

## T2 · El alto con la unidad dinámica

- **RED:** `tests/shell.test.ts` — `expect(fuente).not.toMatch(/h-screen/)` falló
  sobre `src/App.tsx`. El it de control («se lee de verdad») pasó en el mismo
  arranque, que es lo que separa un rojo real de un rojo por archivo vacío.
- **GREEN:** `h-screen` → `h-dvh`, una clase.
- **Gates:** `./scripts/check` verde, 204 tests (202 + los 2 nuevos).

**Nada que el plan no anticipara.** La razón de que esto sea un test de fuente y
no de navegador quedó escrita en el propio archivo: el viewport de Playwright no
simula la barra de URL que aparece y desaparece al desplazar, así que la suite
de navegador **no puede observar** este defecto.
