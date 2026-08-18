# Story e7.9: Escritorio como ampliación — Scope

## User story

As a estudiante que abre la aplicación en un monitor,
I want que el esqueleto se vea a un tamaño legible y que el contenido no se
estire de punta a punta de la pantalla,
so that el escritorio gane con el rediseño en vez de heredar sin querer los
defectos de no tener un límite de ancho.

## Acceptance criteria

```gherkin
Given la vista Explorar en 1400×900
When se mide la tarjeta de identidad flotante
Then no se estira a casi todo el ancho del viewport — tiene un ancho máximo,
     como ya lo tiene la columna de identidad de la ficha completa

Given la vista Explorar en 1400×900
When se elige un hueso
Then el esqueleto se ve a un tamaño legible, no una silueta pequeña perdida
     en un lienzo oscuro enorme

Given la pestaña Fichas en 1400×900
When se mira cualquier fila de un par
Then el nombre y sus píldoras no quedan separados por un vacío grande de
     punta a punta de la fila

Given cualquiera de las dos vistas de test en 1400×900, con una pregunta
      activa
When se mide la escena y el campo de respuesta
Then el mismo criterio que Explorar: escena a tamaño legible, campo y botón
     sin estirarse sin límite

Given la ficha completa de un hueso en 1400×900
When se mira la vista
Then sigue viéndose como hoy — ya tiene el patrón de columna fija
     (`md:grid-cols-[1fr_22rem]`) que esta historia extiende a las demás,
     no reemplaza

Given la elección de variante de test en 1400×900
When se mira la vista
Then sigue viéndose como hoy — ya está centrada y no necesita cambios
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Explorar, hueso elegido, 1400×900 | medir la tarjeta | ancho máximo ~22rem, no ~1368 px de hoy |
| Fichas, fila de «hueso parietal», 1400×900 | mirar | nombre y píldoras sin un vacío de cientos de píxeles entre ambos |
| Ficha completa de «fémur», 1400×900 | mirar | sin cambios — ya funciona |

## In scope

- **Un límite de ancho de contenido** para Explorar, Fichas y las dos vistas
  de test en `md:` — reutilizando el patrón que `BoneDetailView` ya
  resuelve, no uno nuevo.
- **El navegador de huesos vuelve a ser visible en Explorar a partir de
  `md:`** — sigue siendo el mismo componente de e7.4 (pills por par, lista
  plana de 10 regiones), sin rediseñar su arquitectura de información; solo
  deja de estar `sr-only` en pantallas anchas. Verificado: Tailwind 4.3.3
  tiene `not-sr-only` para deshacer `sr-only` en un breakpoint.

## Out of scope

- **Rediseñar la arquitectura de información del navegador** (acordeón,
  categorías) — es e7.12, aparcada a propósito.
- **Rediseñar el navbar** — es e7.11, aparcada a propósito.
- **Tocar `BoneDetailView.tsx`** — ya resuelto; esta historia reutiliza su
  patrón, no lo cambia.
- **La elección de variante de test** — medida en 1400×900, ya se ve bien
  centrada; no hay nada que corregir ahí.
- **`should-perf-007`** — es e7.10.

## Done when

- En 1400×900: la tarjeta de Explorar, las filas de Fichas y las escenas de
  test tienen un ancho de contenido acotado, con el mismo patrón que
  `BoneDetailView` ya usa.
- El navegador de huesos es visible en Explorar desde `md:`, sin cambiar su
  componente.
- Los tests de navegador en 390×844 siguen verdes sin tocarse — esta
  historia solo agrega comportamiento en `md:`, nunca lo quita por debajo.
- `./scripts/check` en verde.

## Notes

- Gemba del 2026-08-17 al arrancar, con capturas reales en 1400×900:
  - **Explorar**: la tarjeta flotante se estira a ~1368 px de ancho (sin
    límite) y el esqueleto se ve diminuto en un lienzo oscuro enorme.
  - **Fichas**: las filas de pares dejan un vacío de cientos de píxeles
    entre el nombre del hueso y sus píldoras, que quedan pegadas al borde
    derecho.
  - **Test (pregunta activa)**: mismo problema que Explorar —esqueleto
    chico en lienzo enorme— más el campo de respuesta y «Responder»
    estirados con un vacío entre ambos.
  - **Ficha completa**: ya funciona bien — `md:grid-cols-[1fr_22rem]`
    reparte una columna fija de 22rem para la identidad y dale el resto a
    la escena. Es el patrón a extender, no a inventar.
  - **Elección de variante de test**: ya se ve bien, centrada; sin cambios.
- Revisada la referencia de escritorio del brief
  (`~/refs/da33f0cf29181fe205f40a1bbfb57a46.jpg`): barra lateral de
  navegación, grilla de tarjetas de ancho acotado, panel derecho fijo con
  una lista — confirma el patrón de "columna fija + contenido acotado" en
  vez de estirar todo a lo ancho, que es exactamente lo que
  `BoneDetailView` ya hace.
- Referencias: brief de E7 (dirección visual, tres referencias), ADR-010
  (el navegador sigue siendo el mismo componente, solo cambia su
  visibilidad por breakpoint — no reabre esa decisión), retrospectiva de
  e7.6 y e7.8 (el layout de escritorio quedó deliberadamente simple hasta
  esta historia).
