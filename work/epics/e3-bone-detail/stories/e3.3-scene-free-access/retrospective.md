# Story e3.3: Acceso a la ficha sin el esqueleto completo — Retrospective

Estimated: XS (1-2 tareas) · Actual: 2 tareas, sin desviación de tamaño

## Summary

Una tercera vía a la ficha de un hueso, sin tocar la escena 3D: pestañas
"Explorar"/"Fichas" en `App.tsx`, y el modo "Fichas" reutiliza
`BoneNavigator` tal cual para navegar directo a `BoneDetailView`. "Volver"
recuerda el origen (`ExploreView` o la lista) para no romper lo que e3.2 ya
garantizaba.

## What went well

- El gemba de `story-start` (leer `BoneNavigator.tsx` antes de escribir el
  scope) evitó construir `BoneListEntry`, el componente que `epic-design`
  había propuesto sin haber leído el código real. Menos código que
  mantener, mismo resultado — la épica completa terminó con **un
  componente nuevo menos** de los que su propio diseño anticipaba.
- El test de regresión explícito sobre el camino de e3.2 (mismo assert, sin
  reescribirlo) confirmó en la propia tarea que el modo nuevo no rompía el
  viejo, en vez de descubrirlo en la prueba manual.

## What to improve

- Un `format:check` falló por una coma final que Biome quería y yo no había
  puesto — el primer gate rojo de las tres historias de esta épica. Costó
  un comando (`biome format --write`) resolverlo, pero confirma que vale la
  pena correr `./scripts/check` inmediatamente después de cada GREEN, no
  acumular cambios antes de la primera corrida.
- El script de verificación manual de T2 incluyó una aserción mal planteada
  (¿pidió el modelo "antes de tocar Fichas"? — por supuesto que sí, la app
  arranca en modo Explorar). No era un hallazgo real, pero revisarlo costó
  un momento de duda. Para la próxima prueba manual con Playwright: escribir
  primero qué comportamiento *específico del modo nuevo* se quiere probar,
  no una pregunta genérica sobre la app entera.

## Learned

1. **About the system:** el diseño de una épica (`design.md`) es una
   hipótesis, no una receta — `epic-design` propuso `BoneListEntry` sin
   haber confirmado que `BoneNavigator` no servía tal cual. El gemba de
   cada historia individual sigue siendo la autoridad, incluso sobre el
   propio diseño de la épica que la contiene.
2. **About the process:** de las tres historias de e3, esta fue la única
   que terminó **más simple** de lo planeado en `design.md` en vez de igual
   o con desviación hacia más código (e3.2 elevó estado, pero no agregó
   componentes de más). Vale la pena, al cerrar una épica, notar en qué
   dirección se desvió cada historia respecto a su diseño original — no
   solo si se desvió.
3. **Capability gained:** el patrón de unión discriminada con un campo
   `origen` para que "volver" sepa a dónde regresar es reusable para
   cualquier vista de detalle alcanzable desde más de un lugar, sin
   necesitar un router.
