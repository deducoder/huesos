# Story e9.1: Selection colour that actually stands out — Plan

> Size: S

## Tasks

### T1 · El resaltado tiñe el material en vez de emitir luz

- **Files:** modify `src/components/SkeletonScene.tsx`,
  `src/components/SkeletonScene.test.tsx`.
- **TDD:** RED — dos afirmaciones de código fuente, en el mismo estilo que ya
  usa este archivo de test (jsdom no renderiza WebGL, así que lo observable es
  el código, no el píxel): (a) `propio.color =` aparece condicionado a
  `resaltado`; (b) `emissiveIntensity` **ya no** aparece en el archivo — es el
  rastro de que el mecanismo viejo se fue entero, no que uno nuevo conviva con
  él. → GREEN — guardar `material.color.clone()` como `userData.baseColor` en
  la misma rama que ya clona el material, y alternar `propio.color` entre el
  acento y el color base. → REFACTOR.
- **Satisfies:** «tiñe el material con el acento… y `--color-acento` no
  cambia»; «recupera el color exacto que traía el activo» (design).
- **Verify:** la propiedad es que el mecanismo de resaltado cambió de verdad,
  no que el archivo mencione ambas palabras — mutación forzada: dejar
  `emissiveIntensity` junto al `color` nuevo (una migración a medias, los dos
  mecanismos activos a la vez) viola (b); revertir `propio.color =` a un
  valor fijo viola (a). Luego `./scripts/check`.
- **Commit:** `feat(skeleton-scene): tint the selected bone's material instead of emitting light`

### T2 · Los tokens de acierto y error, con su contraste afirmado

- **Files:** modify `src/index.css`; create `tests/token-contrast.test.ts`.
- **TDD:** RED — un test que lee `src/index.css`, extrae `--color-acierto` y
  `--color-error` por regex (mismo patrón que `tests/typography.test.ts` ya
  usa para leer el CSS) y calcula su ratio WCAG contra `--color-panel`
  (blanco): falla porque los tokens no existen. → GREEN — declarar los dos
  valores calculados en el design (`#15803d` 5.02:1, `#b91c1c` 6.47:1), con el
  ratio en comentario como los demás tokens de `@theme`. → REFACTOR.
- **Satisfies:** «`@theme` declara `--color-acierto` y `--color-error` con su
  ratio» (design).
- **Verify:** la propiedad es que el ratio se **calcula**, no se copia del
  comentario — mutación forzada: cambiar `--color-error` a un rojo más claro
  (p. ej. `#ef4444`, ratio ~3.8) tiene que poner el test en rojo aunque el
  comentario siga diciendo 6.47; es lo que distingue afirmar un contraste de
  citarlo. Luego `./scripts/check`.
- **Commit:** `feat(theme): add the correct and incorrect answer colour tokens`

### T3 · Verificación manual de integración

- Con la aplicación corriendo: seleccionar huesos de distinto tamaño y
  posición en Explorar —el fémur, una costilla, una falange— y confirmar que
  cada uno se distingue a simple vista, no solo en la medición. Deseleccionar
  y confirmar que el color vuelve a ser el del activo, sin quedar más claro ni
  más oscuro que sus vecinos. Repetir en el modo test de esqueleto completo,
  que reutiliza el mismo componente.
- **Verify:** el hueso seleccionado se ve inconfundible a simple vista en el
  teléfono real, y ningún hueso deseleccionado queda con un tinte residual.

## Order & risks

- **Execution order:** T1 → T2 → T3. T1 primero: es el hallazgo del design —el
  mecanismo, no el color— y si algo del enfoque no sostiene (por ejemplo, que
  `userData.baseColor` interfiera con algo que T2 no puede anticipar), es
  mejor saberlo antes de tocar `@theme`.
- **Dependencies:** T2 es independiente de T1 —archivos distintos, sin
  import compartido— pero va segunda porque la historia es pequeña y no gana
  nada paralelizando dos tareas de minutos.
- **Risks:**
  - **Los tests de este archivo son de código fuente, no de render** — jsdom
    no ejecuta WebGL, así que ninguna prueba ve el color realmente aplicado.
    La verificación de que el tinte se **ve** bien vive en T3, con el humano
    mirando la aplicación real, y en las mediciones ya hechas en el design
    (suma 282 contra 68 hoy).
  - **`userData.baseColor` es estado mutable sobre un objeto de three.js
    reutilizado entre renders** — si `useLayoutEffect` se disparara con la
    copia del material ya reemplazada por una versión sin `ownMaterial`
    (un remount completo de la escena), `baseColor` se recalcularía desde el
    material nuevo, que es exactamente lo que se quiere: nunca debe
    persistir a través de un remount real.
