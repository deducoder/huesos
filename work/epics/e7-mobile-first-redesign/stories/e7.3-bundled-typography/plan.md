# Story e7.3: Tipografía empaquetada — Plan

> Size: S

Las dos frases que la retrospectiva de e7.2 dejó para este plan, aplicadas:

1. **La candidata se verifica en un teléfono, no en captura.** Ya se eligió
   sobre muestra renderizada; la confirmación ocurre en hardware antes de
   cerrar, por el túnel que e7.2 dejó probado.
2. **Reconstruir antes de medir.** Hay un `vite preview` levantado a mano
   ocupando el 4173, y Playwright lo reutiliza: toda medición de navegador de
   esta historia va precedida de `npx vite build`.

## Tasks

### T1 · La fuente empaquetada y su gate de repertorio

- **Files:** create `public/fonts/fredoka-latin-600.woff2`,
  `public/fonts/OFL.txt`, `tests/typography.test.ts`; modify `src/index.css`.
- **TDD:** RED `tests/typography.test.ts` falla mientras no exista el archivo
  servido ni el `@font-face` — comprueba las tres cosas que sí son verificables
  sin un navegador: que el `.woff2` existe, que pesa ≤ 25 KB, y que los 72
  caracteres del catálogo caen dentro del `unicode-range` declarado. Trae su
  aserción de control: el recorrido ve los 206 huesos y el filtro reconoce un
  carácter fuera de rango cuando se le da uno → GREEN el archivo, la licencia y
  el `@font-face` con el token → REFACTOR ninguno.
- **Satisfies:** Must 1, 4, 5; los criterios 1, 4, 5 y 6 del scope.
- **Verify:** `./scripts/check`.
- **Commit:** `feat(typography): bundle the display family from our own origin`

### T2 · Los títulos consumen el token

- **Files:** modify `src/App.tsx`, `e2e/mobile-shell.spec.ts`.
- **TDD:** RED una prueba de navegador que lee la familia computada del `h1` y
  exige que contenga `Fredoka` — falla hoy con la pila del sistema → GREEN el
  `h1` consume `font-display` → REFACTOR ninguno.
- **Satisfies:** Must 2, Must NOT 2; el segundo y tercer criterio del scope.
- **Verify:** `npx vite build` **y luego** `npx playwright test` entera — la
  suite de privacidad tiene que seguir verde con la fuente ya cargada, que es
  la prueba de que empaquetarla funcionó (Must 3).
- **Commit:** `feat(shell): use the display family for the title`

### T3 · El ADR de la decisión

- **Files:** create `records/decisions/adr-008-display-typeface.md`.
- **TDD:** no aplica — es un documento.
- **Satisfies:** el criterio «existe el ADR con la elegida y las descartadas».
- **Verify:** que las cuatro descartadas aparezcan con su razón, no solo la
  elegida.
- **Commit:** `docs(adr): record the display typeface decision`

### T4 · Manual integration test

- Con la aplicación servida por el túnel, en el teléfono: mirar la cabecera y
  confirmar que el título se dibuja con la display y no con la del sistema;
  comprobar que el cuerpo no cambió; recargar con la caché limpia y ver que no
  hay salto de fuente molesto.
- **Verify:** `./scripts/check-integration` antes de cerrar.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primera porque sin el archivo no
  hay nada que consumir; T3 después de T2 porque un ADR se escribe cuando la
  decisión ya se sostuvo en código, no antes.
- **Dependencies:** secuencial. T3 es independiente y podría ir en paralelo.
- **Risks:**
  - *El `unicode-range` copiado del CSS de Google no coincide con lo que el
    archivo trae* → el gate de T1 compara el catálogo contra el rango
    declarado, no contra el archivo; si el archivo tuviera menos glifos de los
    que el rango promete, el navegador mostraría tofu y **ninguna prueba lo
    vería**. Lo cubre T4 mirando la aplicación real, y queda dicho acá.
  - *La fuente añade peso al arranque en el móvil que la épica quiere servir* →
    16,4 KB con `swap`; el presupuesto está declarado y e7.10 lo medirá.
  - *Medir contra el servidor levantado a mano* → `npx vite build` antes de
    cada medición de navegador, escrito en la verificación de T2.
