---
name: sr-only-behaves-differently-per-test-layer
description: Un elemento `sr-only` sigue siendo consultable por Testing Library en jsdom (que no computa layout), pero Playwright lo rechaza por sus chequeos de visibilidad reales — la misma técnica de ocultamiento se comporta distinto según qué capa de prueba lo mire.
metadata:
  type: process
---

En e7.6, `BoneNavigator` pasó a vivir dentro de `sr-only` en `ExploreView`
(ADR-010: sigue siendo la vía de teclado, oculta a la vista). Las pruebas
unitarias existentes (`ExploreView.test.tsx`, jsdom + Testing Library)
siguieron pasando **sin tocarlas** — jsdom no computa layout ni clipping
visual, así que `getByRole`/`.click()` encuentran y activan el elemento
igual que si fuera visible.

Las pruebas de navegador (Playwright, un browser real) fallaron de dos formas
distintas: `.toBeVisible()` rechaza el elemento (correcto: está clippeado a
1×1 px), y `.click({ force: true })` clickea la posición REAL del elemento
—que puede estar a miles de píxeles de alto, porque `overflow:hidden` en el
padre recorta visualmente pero no comprime el layout interno de los hijos—,
sin disparar el handler. `dispatchEvent('click')` sí lo activa, porque no
depende de una posición de pantalla.

**Por qué importa:** "ocultar visualmente sin quitar del DOM" es la técnica
correcta para accesibilidad, pero cada capa de prueba la interpreta distinto:
jsdom la ignora por completo (no ve CSS real), Playwright la respeta al pie
de la letra (posición y tamaño reales). Un cambio así puede dejar 7 de 8
pruebas unitarias verdes sin tocarlas y romper silenciosamente varias
pruebas de navegador con el mismo cambio.

**How to apply:** al mover un elemento interactivo a `sr-only` (o cualquier
técnica de recorte visual), revisar por separado el impacto en cada capa de
prueba. En jsdom, probablemente no cambie nada. En Playwright, reemplazar
`.click()` por `.dispatchEvent('click')` para activar el handler sin
depender de dónde quedó el elemento, y `.toBeVisible()` por una señal
alternativa que sí sea visible (el elemento que SÍ se ve, no el que se
ocultó a propósito).
