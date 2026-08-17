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
