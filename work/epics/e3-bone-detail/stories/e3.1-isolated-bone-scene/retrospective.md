# Story e3.1: Escena de hueso aislado — Retrospective

Estimated: M (3-5 tareas) · Actual: 3 tareas + 1 corrección de calidad

## Summary

`IsolatedBoneScene` aísla cualquiera de los 206 huesos del modelo compartido,
sin activo nuevo: reutiliza `skeleton.glb`, `boneIdForMesh` y `distanceToFit`
ya existentes. Verificado con test unitario sobre la lógica de visibilidad
(`visibleForIsolation`, 5 casos) y con inspección visual real en navegador
para cinco huesos (par en ambos lados, impar, un caso con malla huérfana —
esternón/manubrio—, e id inexistente).

## What went well

- El gemba walk de `epic-design` pagó directo: `boneIdForMesh` ya resolvía
  "a qué hueso pertenece esta malla" con la ambigüedad de lados resuelta, así
  que `visibleForIsolation` fue una capa de una línea sobre lo existente, no
  una reimplementación. Cero lógica de resolución nueva que testear a fondo.
- El riesgo anotado en el plan (mallas sin catálogo — dientes, cartílagos,
  sesamoideos) se descartó **antes** de escribir código, corriendo
  `node scripts/inventory-model.mjs` y viendo que `boneIdForMesh` ya las
  trata igual que "otro hueso" (`null`, nunca igual al `id` buscado). Gemba
  evitó una rama de código especial que no hacía falta.
- La verificación visual (T3) encontró exactamente lo que debía: los cinco
  casos correctos a la primera, sin iterar.

## What to improve

- El aria-label del canvas salió genérico en la primera pasada ("Hueso
  aislado en 3D", sin decir cuál) — lo atrapó `quality-review`, no el
  diseño ni el plan. Para la próxima historia con un componente nuevo que
  expone un `aria-label`, escribirlo con el dato real disponible desde el
  principio (acá `bones`+`boneId` ya estaban en las props) en vez de dejarlo
  genérico "por ahora".
- El 404 de consola aislado en la primera carga de T3 no se investigó a
  fondo — no se repitió, y el tiempo se priorizó en confirmar las cinco
  capturas. Si reaparece de forma reproducible en una historia futura,
  merece diagnóstico propio.

## Learned

1. **About the system:** la separación dominio/vista de ADR-002 (E2) se
   paga en la segunda historia que la usa, no solo en la primera. E3.1
   reutilizó `mesh-lookup.ts` y `framing.ts` sin tocarlos — la escena nueva
   fue una recombinación, no una reescritura.
2. **About the process:** correr el inventario real del modelo (`node
   scripts/inventory-model.mjs`) antes de escribir la prueba de T1 convirtió
   un riesgo anotado en el plan ("¿y las mallas sin catálogo?") en un caso
   de prueba concreto con datos reales, en vez de una suposición.
3. **Capability gained:** framing de cámara dinámico con `PerspectiveCamera`
   de drei (en vez de la prop `camera` de `Canvas`, que solo se lee al
   montar) es el patrón a reusar en e3.2/e3.3 para cualquier escena cuyo
   encuadre dependa de datos que no se conocen hasta después del primer
   render.
