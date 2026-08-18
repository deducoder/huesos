---
name: loosely-typed-external-state-needs-its-own-store
description: Guardar datos propios en un campo `any` de una librería externa (userData, similares) tienta al `as`; un Map/WeakMap propio evita heredar esa laxitud.
metadata:
  type: feedback
---

Escribir contra un campo de tipo laxo de una librería externa —`userData` de
three.js es `{[key: string]: any}`— tienta a leerlo de vuelta con un `as` que
apaga la verificación justo donde algo podría faltar en silencio. En e9.1
(2026-08-18) el mismo error se cometió dos veces en la misma historia: un
`as number` en un test (destructuring bajo `noUncheckedIndexedAccess`) y un
`as Color` sobre `malla.userData.baseColor` en producción. El segundo lo
encontró `quality-review`, no el propio autor.

**Why:** `must-type-004` prohíbe `as` para silenciar el compilador, pero la
tentación reaparece cada vez que el dato vive en un contenedor ajeno de tipo
laxo — el cast parece la única salida porque el contenedor mismo no ofrece
tipo.

**How to apply:** antes de castear la lectura de un campo de tipo laxo
(`userData`, un `any` de terceros, un objeto JSON sin schema), preguntar si
hay una estructura propia —un `Map`, un `WeakMap` keyed por la instancia—
que guarde el mismo dato sin heredar esa laxitud. El compilador sigue
sabiendo el tipo real, y un `?? valorSeguro` cubre el caso ausente sin cast.
Relacionado: [[optional-options-objects-dont-protect-callers]].
