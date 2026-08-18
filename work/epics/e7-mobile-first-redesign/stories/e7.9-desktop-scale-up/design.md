# Story e7.9: Escritorio como ampliación — Design

## Problem

En 1400×900 la aplicación no colapsa (nada se corta), pero tampoco escala: los
contenedores mobile-first simplemente se estiran a lo ancho, así que Explorar,
Fichas y las dos vistas de test se ven poco compuestas, con vacíos enormes
donde antes había un límite natural (el ancho de un teléfono).

## Value

El escritorio deja de ser "el mismo layout pero más ancho" y empieza a
aprovechar el espacio: el navegador de huesos vuelve a estar a la vista sin
tocar el ratón (mejora de acceso, no solo estética), y el resto de vistas
quedan legibles en vez de estiradas.

## Gemba walk

- Solo 2 breakpoints `md:` en todo el código, los dos en
  `BoneDetailView.tsx:44-45`: `grid-cols-[1fr_22rem]` para escena+identidad, y
  `border-y-0` para quitarle el borde horizontal que solo tiene sentido
  apilado. Confirmado con captura real que a 1400×900 se ve bien — es la única
  vista que ya resuelve esto, y el patrón a extender.
- `ExploreView.tsx` (leído completo): el navegador vive montado pero
  `sr-only` (ADR-010) — nunca desaparece del DOM, así que hacerlo visible en
  `md:` es un cambio de clases, no de arquitectura. La escena es
  `absolute inset-0` del contenedor `relative h-full`; la tarjeta de
  identidad es `absolute inset-x-4 bottom-4` sin ancho máximo — confirmado en
  captura que a 1400px ocupa ~1368px de los ~1400 disponibles.
- `App.tsx:117-125` (modo `fichas`): un `<div className="h-full overflow-y-auto py-2">`
  sin límite de ancho, montando `BoneNavigator` directo. Las filas de par
  (`BoneNavigator.tsx:108-139`) usan `<span className="min-w-20 flex-1">` para
  el nombre — a lo ancho de un teléfono eso no se nota, a 1400px estira el
  nombre y empuja las píldoras al borde derecho. **No se toca
  `BoneNavigator`**: el mismo componente en la barra lateral de Explorar (ver
  abajo) vive dentro de un contenedor ya acotado a 22rem, donde ese `flex-1`
  no genera el problema. El defecto es del contenedor de Fichas, no del
  componente.
- `TestQuestion.tsx` (leído completo): `flex h-full flex-col`, escena arriba
  (`flex-1`), barra de respuesta abajo (`border-t p-4`, `<form className="flex gap-2">`
  con el input en `flex-1`). A 1400px el input crece a ~1350px de ancho —
  mismo patrón que Fichas: nada acota el contenedor.
- Referencia de escritorio del brief (`~/refs/da33f0cf...jpg`): barra lateral
  fija + contenido acotado + panel derecho fijo. Confirma que "columna fija +
  resto acotado", el patrón que `BoneDetailView` ya usa, es la dirección
  correcta — no una tabla de 3 columnas nueva ni un rediseño de navegación
  (eso es e7.11/e7.12, aparcado).
- Probado en consola de Tailwind: `sr-only md:not-sr-only` compila y aplica —
  camino verificado para revertir `sr-only` justo en `md:`.
- **No se toca la cámara/encuadre** (`SkeletonScene.tsx`, `framing.ts`): la
  altura vertical del modelo depende de `TARGET_HEIGHT`/`FOV`, no del ancho
  del lienzo — ensanchar el contenedor no encoge al esqueleto, solo agranda
  el vacío alrededor. La sensación de "esqueleto perdido" se corrige achicando
  ese vacío (barra lateral en Explorar, ancho acotado en los tests), no
  tocando el dominio de encuadre, que tiene su propia razón documentada para
  no cambiarse a la ligera (b2.2).

## Legacy sweep

Nada queda huérfano: los tres archivos se modifican in-place, ningún
componente ni función se reemplaza. `BoneNavigator` no cambia — solo su
visibilidad y el contenedor que lo envuelve.

## Approach

Un solo patrón, tres aplicaciones — acotar el ancho de contenido en `md:`,
igual que `BoneDetailView` ya hace, sin duplicar layout nuevo por vista:

1. **`ExploreView.tsx`** — a partir de `md:`, el contenedor pasa a
   `md:grid md:grid-cols-[22rem_1fr]`: el navegador (ya montado, solo deja de
   ser `sr-only`) ocupa la primera columna como barra lateral fija de 22rem
   (mismo ancho que la columna de `BoneDetailView`, por consistencia); la
   escena y la tarjeta de identidad se mueven a un `div` propio
   (`relative h-full min-h-0`) que ocupa la segunda columna, para que sus
   hijos `absolute` se posicionen respecto a esa celda y no a las dos
   columnas. La tarjeta gana `md:max-w-sm` y deja de estirarse de punta a
   punta (`md:inset-x-auto md:left-4 md:right-auto`).
2. **`App.tsx`, modo `fichas`** — el `div` que envuelve `BoneNavigator` suma
   `md:mx-auto md:max-w-2xl`: mismo componente, contenedor acotado.
3. **`TestQuestion.tsx`** — el `div` raíz (`flex h-full flex-col`) suma
   `md:mx-auto md:max-w-3xl`: acota escena y barra de respuesta juntas, sin
   separar su layout vertical existente.

Ningún componente nuevo, ninguna dependencia nueva.

## Components affected

| Archivo | Cambio |
|---|---|
| `src/features/explore/ExploreView.tsx` | modify — grid `md:`, navegador visible, tarjeta acotada |
| `src/App.tsx` | modify — contenedor de Fichas acotado en `md:` |
| `src/features/test/TestQuestion.tsx` | modify — contenedor raíz acotado en `md:` |

## Examples

**ExploreView a 1400×900, con un hueso elegido:**
```
Antes: tarjeta de identidad ~1368px de ancho; navegador invisible (sr-only)
Después: navegador visible como barra lateral de 22rem (357px) a la izquierda;
         tarjeta de identidad con max-width ~24rem (384px), pegada a la
         izquierda de la escena
```

**Fichas a 1400×900, fila de un par (p.ej. "hueso parietal"):**
```
Antes: nombre a la izquierda, píldoras "Derecho"/"Izquierdo" en el borde
       derecho, ~1200px de vacío entre ambos
Después: contenido acotado a max-width 42rem (672px), centrado — el vacío
         entre nombre y píldoras se reduce al tamaño real de la fila
```

**Test (pregunta activa) a 1400×900:**
```
Antes: input de respuesta ~1350px de ancho, botón "Responder" pegado a su
       borde derecho pero visualmente perdido en la barra estirada
Después: barra de respuesta acotada a max-width 48rem (768px), centrada
```

## Acceptance criteria (delta sobre `scope.md`)

- **MUST** a 1400×900, el navegador de huesos en Explorar mide un ancho
  visible fijo (no `sr-only`) y su `aria-pressed` sigue reflejando la
  selección — el mismo mecanismo de siempre, ahora también visible.
- **MUST** a 1400×900, la tarjeta de identidad de Explorar mide menos que el
  ancho del lienzo (no se estira de punta a punta).
- **MUST** a 1400×900, en Fichas, la distancia horizontal entre el nombre de
  un par y sus píldoras de lado es menor que hoy — no ancho de viewport
  completo.
- **MUST** a 1400×900, en cualquiera de las dos vistas de test, el ancho de
  la barra de respuesta está acotado, no ancho de viewport completo.
- **MUST NOT** los tests de 390×844 (`mobile-shell.spec.ts`) cambian de
  resultado — todo lo nuevo va detrás de `md:`.
- **SHOULD** el navegador sigue siendo teclado-navegable y con los mismos
  nombres accesibles en ambos anchos (no se duplica el componente).
