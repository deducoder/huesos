# Story e7.3: Tipografía empaquetada — Progress

## T1 · La fuente empaquetada y su gate de repertorio

- **RED:** `tests/typography.test.ts` — 3 de 5 en rojo: falta el `.woff2`,
  falta medir el presupuesto, falta el `@font-face`. Las otras dos pasaron ya:
  la cobertura del catálogo (que depende del rango, no del archivo) y su
  aserción de control.
- **GREEN:** `public/fonts/fredoka-latin-600.woff2` (16.468 bytes) y `OFL.txt`
  (la licencia SIL OFL 1.1, cuya distribución la propia licencia exige), más el
  `@font-face` y el token `--font-display` en `src/index.css`.
- **Gates:** `./scripts/check` verde.

## T2 · Los títulos consumen el token

- **RED:** `e2e/mobile-shell.spec.ts` — `familia del título: Expected substring
  "Fredoka"`, con la pila del sistema.
- **GREEN:** el `h1` de `App.tsx` consume `font-display`.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde (9/9),
  **incluida la prueba de privacidad**: cero peticiones a terceros con la fuente
  ya cargada, que es exactamente la prueba de que empaquetarla funcionó.

**Decisiones que el plan no anticipó:**

- **La prueba no se conforma con la familia declarada.** `getComputedStyle`
  devolvería `Fredoka` aunque el `@font-face` apuntara a un archivo inexistente
  —el navegador dibujaría con la de reserva y la familia declarada no cambiaría—.
  Se añadió `document.fonts.check('600 28px Fredoka')` tras `document.fonts.ready`:
  eso pregunta si la fuente **llegó a cargarse**, no si alguien la pidió.
- **La misma prueba vigila que la display no invada el cuerpo**, comprobando que
  un botón del navegador de huesos **no** la usa. Sin eso, aplicar la display a
  todo pasaría el criterio sin romper nada.

## T3 · El ADR de la decisión

`records/decisions/adr-008-display-typeface.md` — Fredoka 600, con las cuatro
candidatas descartadas y su razón cada una. Sin cambios respecto al plan.

## T4 · Verificación manual

Hecha por el usuario en un teléfono real, por el túnel que e7.2 dejó probado
(build de producción, no el servidor de desarrollo). Veredicto: **Fredoka
convence en pantalla real** — la comprobación que la retrospectiva de e7.2
pedía explícitamente, y no en captura de monitor.

## Cierre

**Chequeo de tests huérfanos:** los archivos que importan `App.tsx` o
`src/index.css` fuera de esta historia —`src/App.test.tsx`— no fueron tocados y
siguen verdes: consultan roles y nombres accesibles, ninguno de los cuales
cambió al aplicar la display.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · `public/fonts/` con el `.woff2` y licencia | cumplido |
| Must 2 · el `h1` se dibuja con Fredoka, verificado en navegador | cumplido — `document.fonts.check` |
| Must 3 · privacidad sigue verde con la fuente cargada | cumplido — 9/9 |
| Must 4 · gate de repertorio con aserción de control | cumplido |
| Must 5 · archivo ≤ 25 KB | cumplido — 16.468 bytes |
| Should 1 · `font-display: swap` | cumplido |
| Must NOT 1 · sin CDN | respetado |
| Must NOT 2 · display solo en títulos | cumplido — verificado en el cuerpo |
| Must NOT 3 · sin `fontTools` ni paso de build nuevo | respetado |

**Gates finales:** `./scripts/check` verde (211 tests) ·
`npx playwright test` verde (9/9, con `npx vite build` corrido antes, contra el
riesgo que la retrospectiva de e7.2 dejó anotado).
