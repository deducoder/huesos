# Story e3.2: Ficha completa desde la selección de E2 — Progress

## T1 · `BoneIdentity`: "impar" explícito + botón "Ver ficha completa"

Nueva fila "Lateralidad: impar" cuando `isUnpaired(bone)`, y botón
condicional "Ver ficha completa" (`onViewDetail` opcional, sin cambiar el
contrato para quien no lo pasa). 5 tests nuevos, 11/11 en el archivo. Gate:
verde. Ninguna desviación del plan.

## T2 · `BoneDetailView`: compone escena aislada + identidad + "Volver"

`src/features/bone-detail/BoneDetailView.tsx` — `IsolatedBoneScene` (e3.1)
+ `BoneIdentity` de solo lectura (sin `onViewDetail`, para no ofrecer un
segundo botón hacia sí misma) + botón "Volver". `IsolatedBoneScene`
sustituida por un doble en el test, mismo criterio que `ExploreView.test.tsx`
ya usa para `SkeletonScene`. Gate: verde. Ninguna desviación del plan.

## T3 · `App.tsx`: selector de modo, extremo a extremo

Desviación real del plan, documentada: el estado de selección **se elevó de
`ExploreView` a `App`**, no se quedó dentro de `ExploreView` como el plan
daba por hecho implícitamente. Motivo: si `ExploreView` se desmonta al pasar
a modo `'ficha'` y su `useState` de selección vive adentro, esa selección se
pierde al montar de nuevo — justo lo que el escenario 4 del scope prohíbe
("Volver" con la selección anterior intacta). `ExploreView` pasó a ser
controlada (`selected`/`onSelect` como props), y su test ganó un arnés
(`ExploreViewConSuEstado`) que reproduce exactamente lo que `App` hace de
verdad. Gate: verde (104 tests). Ninguna otra desviación.

## T4 · Prueba manual de integración

`vite build` + `vite preview`, Playwright real: seleccionar fémur derecho →
"Ver ficha completa" → fémur aislado y encuadrado, identidad completa →
"Volver" → selección conservada (`aria-pressed="true"` en fémur derecho) →
seleccionar sacro → ficha muestra "Lateralidad: impar" explícito. Los cuatro
casos correctos a simple vista, con capturas. Un 404 de consola aislado en
la primera carga, no reproducible — mismo hallazgo no concluyente que e3.1,
no relacionado con esta historia.

## Finalize

- Full gate set: verde (`./scripts/check`, 104 tests, lint, format, types).
- Orphaned-test check: `BoneIdentity.test.tsx`, `ExploreView.test.tsx` y el
  nuevo `App.test.tsx` son los tres únicos que importan los módulos que
  cambiaron esta historia — los tres se actualizaron dentro de sus propias
  tareas, no quedó ninguno huérfano.
- Acceptance criteria: cumplidos de punta a punta — los cuatro escenarios
  Gherkin del scope, verificados por test (T1-T3) e inspección visual real
  (T4).
