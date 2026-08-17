# Epic e3: Ficha del hueso — Brief

## Hypothesis

For estudiantes de medicina que memorizan los 206 huesos,
la ficha individual de un hueso es una vista de estudio enfocada
que aísla un hueso del resto del esqueleto y muestra su nombre en ambas
nomenclaturas, su región anatómica y si es par o impar.
Unlike la escena completa de E2 —donde un hueso compite visualmente con otros
205—, la ficha lo aísla para memorizar sin ruido.

## Success metrics

- **Leading:** desde la selección de un hueso en E2, un clic (o su equivalente
  accesible) lleva a su ficha — sin recorrer un flujo intermedio.
- **Lagging:** la ficha es alcanzable también sin pasar por el esqueleto
  completo (RF-03), condición de partida para el modo test aislado de E4.

## Appetite

S — 3-4 historias. RF-03 es una vista sobre datos que E1 y E2 ya producen
(catálogo, selección, nomenclatura bilingüe); no hay activo nuevo que
conseguir ni mecánica 3D nueva que resolver.

## Scope boundaries

Lo que el diseño no puede hacer. Lo que sí construirá no se decide acá — esa
lista es de `scope.md`, que escribe `epic-design` después de la
descomposición.

### No-gos
- **No repite la escena 3D completa dentro de la ficha** — **never**: RF-03
  pide un hueso aislado del resto del esqueleto, no el esqueleto completo con
  zoom. Si la ficha necesita una representación visual del hueso, es una
  pieza distinta a `SkeletonScene`, no una reutilización con cámara ajustada.
- **No implementa el modo test** — **never**: eso es RF-04 a RF-07 (E4). La
  ficha muestra datos, no pregunta ni valida respuestas.

### Rabbit holes
- **Aislar visualmente un hueso del modelo glTF compartido.** El modelo trae
  todos los huesos en una única jerarquía; mostrar "solo" uno (ocultando o
  extrayendo el resto) es la parte no trivial de RF-03 y puede consumir una
  historia entera si no se acota temprano en el diseño.
- **Diseñar una navegación nueva "sin pasar por el esqueleto completo"**
  (segunda mitad del observable de RF-03) antes de decidir si reutiliza el
  navegador accesible de E2 (`BoneNavigator`) o necesita una ruta/URL propia.
