---
name: symmetric-functions-need-symmetric-tests
description: Una función que maneja una relación simétrica (A↔B) necesita probarse en las dos direcciones — un test que solo la ejercita desde un lado es una promesa a medias, aunque el código funcione bien en la otra dirección.
metadata:
  type: process
---

En e7.5, `siblingId(bone)` resuelve el id del lado opuesto en las dos
direcciones (derecha→izquierda e izquierda→derecha) y se probó en las dos.
`isSideIrrelevant(bone, catalog)`, que usa `siblingId` internamente y es
igual de simétrica en su contrato, se probó seis veces y las seis llamándola
con un hueso `right` como primer argumento. Confirmado manualmente que la
función SÍ funciona igual con `left` (`isSideIrrelevant(malleus-left,
catalog)` → `true`), pero ningún test lo protegía hasta que la revisión de
calidad lo encontró.

**Por qué importa:** hoy ningún camino de la interfaz llama la función con un
`left` como primario —el navegador siempre selecciona el lado derecho por
convención—, así que el hueco no rompe nada *todavía*. Pero es exactamente el
tipo de hueco que un refactor futuro puede pisar sin aviso: nada se pone rojo
porque nada ejercita esa mitad del contrato.

**How to apply:** al revisar (o escribir) tests para una función cuyo
contrato es simétrico por diseño, comparar su cobertura contra la de otra
función relacionada del mismo módulo que sí se probó en las dos direcciones
—fue así como se encontró acá, comparando `siblingId` (bidireccional,
probada así) contra `isSideIrrelevant` (bidireccional, probada solo de un
lado)—. Un mismo commit con dos funciones relacionadas y dos rigores
distintos es la señal a buscar.
