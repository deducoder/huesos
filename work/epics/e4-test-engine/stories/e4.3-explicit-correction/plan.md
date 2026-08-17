# Story e4.3: Corrección explícita del error — Plan

> Size: S

## Tasks

### T1 · `TestQuestion` muestra ambas nomenclaturas al responder mal

- **Files:** modify `src/features/test/TestQuestion.tsx`; test
  `src/features/test/TestQuestion.test.tsx`
- **TDD:** RED —
  1. tras responder mal, `bone.es` y `bone.la` del hueso preguntado
     aparecen en el DOM;
  2. tras responder bien, ninguno de los dos aparece — solo "Correcto";
  3. tras responder mal, el `boneId` que recibe `renderScene` sigue siendo
     el mismo que antes de responder (el hueso no cambia ni desaparece)
  → GREEN: en la rama `resultado === 'incorrecto'` del render, agregar
  `<p>{bone.es} / {bone.la}</p>` → REFACTOR
- **Satisfies:** los tres escenarios Gherkin del scope
- **Verify:** `npx vitest run src/features/test/TestQuestion.test.tsx && ./scripts/check`
- **Commit:** `feat(test): show the correct name in both nomenclatures on a wrong answer`

### T2 · Prueba manual de integración

- Levantar `npm run dev`, montar `SkeletonTestView` temporalmente:
  responder mal a propósito, confirmar a ojo que aparecen español y latín
  juntos, que el hueso sigue resaltado en la escena (no cambia de posición
  ni desaparece), y que una respuesta correcta sigue mostrando solo
  "Correcto".
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 único cambio de código (la corrección vive
  enteramente en `TestQuestion`, ya construido en e4.2) → T2 confirma en
  navegador real.
- **Dependencies:** ninguna nueva — reutiliza `TestQuestion` de e4.2 sin
  tocar `SkeletonTestView` ni el dominio.
- **Risks:**
  - Ninguno nuevo: es una extensión acotada de un componente ya probado y
    ya verificado a mano una vez.
