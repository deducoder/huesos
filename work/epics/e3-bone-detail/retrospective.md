# Epic e3: Ficha del hueso — Retrospective

## Summary

Cualquier hueso, de los 206, se aísla del resto del esqueleto y muestra su
ficha completa (nombre bilingüe, región, par/impar explícito) — alcanzable
tanto desde una selección ya hecha en `ExploreView` (e3.2) como desde una
lista propia que nunca toca la escena 3D (e3.3). `RF-03` cumplido de punta a
punta, sin router (ADR-003) y con un componente nuevo menos de los que el
diseño original de la épica anticipaba.

## Metrics

- Stories: 3 · Estimated: M + S + S · Actual: M + S(3 tareas) + XS(2 tareas)
- 1 ADR (ADR-003) · 1 componente descartado por gemba antes de escribirse
  (`BoneListEntry`, ver e3.3) · 1 estado elevado entre historias
  (selección de `ExploreView`, e3.2) · 0 componentes nuevos en e3.3 (contra
  1 previsto en `design.md`).
- 3 hallazgos aparcados durante la épica (`records/parking-lot.md`):
  `system-design.md` desactualizado, la prueba de la rejilla de s1 pausada
  (previa a e3, no generada por esta épica), y ninguno nuevo generado por
  e3 en sí — las tres historias cerraron sin dejar nada sin resolver.

## Scope verification

- Aislar visualmente un hueso del modelo compartido → **Fulfilled**
  (`src/components/IsolatedBoneScene.tsx`, `src/domain/isolation.ts`, e3.1).
- Nombre bilingüe, región y par/impar en la ficha → **Fulfilled**
  (`src/components/BoneIdentity.tsx`, fila "Lateralidad: impar", e3.2).
- Un camino a la ficha que no pase por la escena completa → **Fulfilled**,
  con una simplificación respecto al diseño original: el `scope.md` de la
  épica nombra `BoneListEntry` como componente nuevo; e3.3 encontró por
  gemba que `BoneNavigator` ya servía tal cual (`selected={null}`,
  `onSelect` navega en vez de alternar) y lo reutilizó sin crear el
  componente. La cita textual de `scope.md` queda desactualizada a
  propósito — es una declaración estable que no se reedita a mitad de
  época (mismo criterio que un ADR superado) — y esta retrospectiva es su
  registro de qué se entregó de verdad.
- Navegación por teclado en la lista nueva (`SHOULD`) → **Fulfilled**,
  heredado: al reutilizar `BoneNavigator` sin modificarlo, hereda la misma
  accesibilidad por teclado que ADR-002 ya le dio en E2 — no exigió trabajo
  propio en e3.3.
- Router con URL por hueso (out of scope) → **Descoped**, tal como decidió
  ADR-003; sigue diferido, no rechazado.
- Modo test sobre la ficha (out of scope) → **Descoped**, correctamente sin
  tocar — es `RF-06`/E4.
- Actualizar `governance/architecture/system-design.md` (out of scope) →
  **Descoped**, sigue aparcado en `records/parking-lot.md`, sin regresión.
- "Docs actualizadas (`docs.md` de la épica)" → **Pendiente**, por diseño:
  `docs.md` es artefacto de `epic-close`, no de esta revisión.

## What went well

- Las tres historias cerraron con sus criterios de aceptación verificados
  dos veces: por test automatizado y por inspección visual real en
  navegador (Playwright contra `vite preview`, no contra el servidor de
  desarrollo) — ninguna historia se dio por terminada solo porque los tests
  pasaban.
- El riesgo más alto anotado al diseñar la épica (mallas del modelo sin
  entrada en el catálogo, dientes/cartílagos/sesamoideos) se descartó con
  una lectura de datos reales (`node scripts/inventory-model.mjs`) antes de
  escribir una sola línea de e3.1, en vez de descubrirse a mitad de
  implementación.
- La épica terminó **más simple** que su propio diseño en un punto (e3.3
  sin `BoneListEntry`) y **más correcta** en otro (e3.2 elevó el estado de
  selección, algo que el diseño no había anticipado) — dos desviaciones en
  direcciones opuestas, ninguna descubierta tarde: la primera en
  `story-start`, la segunda al escribir el test de integración de la propia
  historia.

## What to improve

- `epic-plan` se saltó por ser una épica S/lineal, decisión correcta, pero
  eso dejó sin un lugar único donde ver de un vistazo "qué falta" mientras
  las tres historias estaban en curso — se reconstruyó leyendo `git log
  --merges` al llegar acá. Para una épica de este tamaño sigue sin hacer
  falta `plan.md`, pero vale la pena, si crece a M o más, no saltarlo solo
  por inercia de cómo salió esta vez.
- El diseño de la épica (`design.md`) nombró `App.tsx` como parte del
  "target component" de una sola historia (e3.3) cuando en la práctica su
  primer cambio real llegó en e3.2 (el selector de modo nació ahí, por
  necesidad, no en e3.3 como el diseño sugería). La secuencia de historias
  puede desviarse de qué historia toca qué archivo primero sin que eso sea
  un problema — pero vale la pena decirlo en el `scope.md` de la historia
  que lo hizo primero, como e3.2 ya hizo, para que quien lea después no
  compare contra el diseño original y se confunda.

## Learned

1. **About the system:** la separación dominio/vista de ADR-002 (E2) y la
   capa de dominio pura de e3.1 (`domain/isolation.ts`,
   `domain/mesh-lookup.ts`) demostraron ser reutilizables, no solo
   testeables — la misma resolución "¿qué hueso es esta malla?" sirvió para
   resaltar (E2) y para ocultar (e3.1) sin cambiar una línea. Una capa de
   dominio bien cortada paga en historias que nadie planeó cuando se cortó.
2. **About the process:** el patrón que emergió en las tres retrospectivas
   de historia — escribir el test de integración *antes* de decidir dónde
   vive un estado o si hace falta un componente nuevo — se sostuvo en las
   tres, no fue casualidad de una. Vale la pena nombrarlo como práctica
   deliberada para la próxima épica, no solo como hallazgo retrospectivo.
3. **Capability gained:** el equipo (esta sesión) ahora tiene un patrón
   probado para "vista de detalle alcanzable desde más de un lugar sin
   router" (unión discriminada con `origen`, estado elevado al padre común)
   — reusable directamente en E4 cuando el modo test necesite volver al
   lugar correcto tras preguntar sobre un hueso.
