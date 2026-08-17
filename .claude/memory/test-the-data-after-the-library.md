---
name: test-the-data-after-the-library
description: Cuando un dato del repositorio atraviesa una librería de terceros, la prueba tiene que observarlo al otro lado, no antes de entrar.
metadata:
  type: feedback
---

En b2.1, el catálogo anclaba cada hueso por su nombre de nodo del glTF. El test
de anclaje comparaba el catálogo contra **el archivo** y pasaba en verde. Pero
`GLTFLoader` no conserva ese nombre: lo pasa por
`PropertyBinding.sanitizeNodeName`, que cambia espacios por `_` y elimina puntos
y otros reservados. De 144 nombres solo sobrevivían tres, así que **solo tres
huesos eran seleccionables** — y 80 pruebas en verde no lo vieron.

**Why:** el test verificaba el dato **antes** de entrar en la librería, y el
error nacía **dentro** de ella. Un identificador que atraviesa una
transformación deja de ser el mismo identificador, y ninguna cantidad de
pruebas del lado de acá lo detecta.

**How to apply:** al anclar datos propios contra un artefacto que consume una
librería de terceros (nombres de nodo, ids de recurso, claves de esquema),
escribir la prueba sobre lo que **el consumidor recibe**. Si ejecutar la
librería completa no es posible, al menos aplicar su función de transformación a
ambos lados de la comparación — que es lo que hace hoy
`tests/catalog-geometry.test.ts` — y dejar dicho que la prueba de verdad falta.

Corolario: en huesos-mono, esa prueba de verdad exige `GLTFLoader` con Draco en
un navegador, es decir un `./scripts/check-integration` que no existe. Está en
el parking lot como la carencia estructural más seria del proyecto.

Relacionado: [[untestable-layers-go-last]], [[model-mesh-names-are-irregular]].
