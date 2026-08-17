# Story e1.2: Catalog schema — Retrospective

Estimated: S (2 tareas) · Actual: S, 2 tareas y 3 commits

## Summary

`src/data/bone.ts` define la forma de una entrada como unión discriminada, y
`src/data/catalog.test.ts` la hace cumplir con siete aserciones. El catálogo
arranca con cuatro entradas semilla que cubren los cuatro casos que importan:
hueso par, hueso impar, hueso craneal y ausencia declarada.

## What went well

- **La prueba de integración manual encontró algo real.** No fue un trámite:
  descubrió que el tipo permitía escribir una razón de ausencia en un hueso que
  sí tiene geometría. Un test lo habría atrapado en ejecución; el tipo lo hace
  imposible de escribir.
- **Las entradas semilla se eligieron por cobertura de casos, no por comodidad.**
  Fémur (par), esfenoides (impar craneal), hioides (ausencia declarada): cada
  una ejercita una rama distinta de la validación desde el primer commit.
- **La ausencia del hioides quedó dentro del dato, no en un comentario.** El
  catálogo explica por qué falta, y el test exige esa explicación.

## What to improve

- **El scope no anticipó la lateralidad de la columna.** `isUnpaired` tuvo que
  decidir que toda vértebra es impar, y eso se descubrió modelando, no
  planificando. Es información anatómica que el diseño del epic podría haber
  fijado.
- **La unión discriminada debió ser el diseño de partida.** El escalón de
  «campo opcional + test que lo vigila» a «estado imposible de representar» se
  subió por accidente, no por decisión.

## Learned

1. **About the system:** el modelo solo trae el hemicuerpo derecho, así que la
   lateralidad es propiedad del catálogo y no de la geometría: dos entradas
   pueden compartir `meshName` y diferir en `side`. Cualquier verificación de
   unicidad tiene que usar la clave compuesta, y el render tendrá que espejar.
2. **About the process:** una prueba de integración manual que solo confirma lo
   que el test ya dijo está mal diseñada. La de esta historia valió porque
   atacaba una capa distinta —el compilador— en vez de repetir la del test.
3. **Capability gained:** el proyecto tiene un esquema que hace ilegal el dato
   incoherente, así que poblar 199 entradas en e1.5 y e1.6 es tecleo verificado,
   no tecleo confiado.
