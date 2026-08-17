# Story e3.1: Escena de hueso aislado — Progress

## T1 · Función pura: qué malla es visible al aislar un hueso

`src/domain/isolation.ts` — `visibleForIsolation(bones, meshName, half, targetId)`,
delega en `boneIdForMesh` ya existente. Cubre los cinco casos del plan: par en
lado correcto, par en lado contrario, impar en cualquier mitad, otro hueso,
malla sin catálogo (diente y manubrio del esternón, sin caso especial). Gate:
verde (94 tests, típecheck y lint limpios). Ninguna desviación del plan.

## T2 · `IsolatedBoneScene`: cargar el modelo y aplicar la visibilidad

`src/components/IsolatedBoneScene.tsx` — reutiliza el patrón de `SkeletonHalf`
de `SkeletonScene.tsx`, pero oculta mallas (`visibleForIsolation` de T1) en
vez de resaltarlas por material. El encuadre se calcula tras aplicar la
visibilidad, con un `Box3` acumulado a mano solo sobre las mallas visibles
(no se confía en que `Box3.setFromObject` excluya las ocultas — riesgo que el
plan ya anotaba). Cámara con `PerspectiveCamera` de drei en vez de la prop
`camera` de `Canvas`, porque el encuadre se conoce recién después de montar,
no en el momento inicial. Sin `lookAt`: con rotación por defecto la cámara ya
mira hacia -Z, así que alcanza con posicionarla en el mismo X/Y del centro.
Gate: verde (types + lint; sin test de componente, por ADR-002 — canvas WebGL
fuera de cobertura automática). Ninguna desviación del plan.

## T3 · Prueba manual de integración

Montaje temporal en `App.tsx` (con `?hueso=<id>` para elegir el caso),
`vite build` + `vite preview`, capturas con Playwright para los cinco casos
del plan: `femur-left`, `femur-right`, `sacrum`, `sternum`, `no-existe`.
Los cinco correctos a simple vista — el fémur izquierdo y el derecho se ven
aislados en su orientación propia, sin residuo del otro lado; el sacro (hueso
impar) se ve una vez, no duplicado visualmente pese a existir en ambas
mitades del modelo; el esternón muestra solo el cuerpo, sin el manubrio
(consistente con ADR-001); el `id` inexistente no muestra nada y no rompe.
Un 404 de consola apareció una sola vez en la primera carga y no se repitió
en corridas siguientes contra el mismo servidor — no reproducible, no
relacionado con la lógica de aislamiento, descartado como ruido de arranque.
Montaje temporal retirado de `App.tsx` antes de este commit; sin diferencia
contra el original (nada que comitear en ese archivo).

## Finalize

- Full gate set: verde (`./scripts/check`, 94 tests, lint, format, types).
- Orphaned-test check: ningún test existente importa `isolation.ts` ni
  `IsolatedBoneScene.tsx` fuera de los que esta historia agregó — nada que
  reconciliar.
- Acceptance criteria: cumplidos de punta a punta — los cuatro escenarios
  Gherkin del scope, verificados por test unitario (T1) y por inspección
  visual real (T3).
