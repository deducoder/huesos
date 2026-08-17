---
type: adr
id: ADR-003
title: "Selector de modo en vez de router para llegar a la ficha del hueso"
status: accepted
date: 2026-08-17
epic: e3
---

# ADR-003: Selector de modo en vez de router para llegar a la ficha del hueso

## Status

Accepted

## Context

`RF-03` exige dos cosas de la ficha individual de un hueso: que aísle el
hueso del resto del esqueleto, y que sea "alcanzable también sin pasar por el
esqueleto completo" — es decir, sin necesitar la escena 3D ni el navegador de
`ExploreView` como paso previo.

Hoy la aplicación no tiene router: `App.tsx` renderiza un único
`<ExploreView />` fijo. `RF-03` no exige URLs propias por hueso, ni
compartibles, ni marcadores de página — el observable es solo "alcanzable sin
pasar por el esqueleto completo". Añadir un router es la lectura más literal
de "otra vía de acceso", pero introduce una dependencia nueva, una superficie
de configuración (rutas, historial, 404) y una capa que ningún otro requisito
del PRD pide todavía.

Options:

- **(A) Router de cliente** (`react-router`, `wouter`) con una ruta por hueso
  (`/hueso/:id`) — deep-linkable y compartible, pero una dependencia nueva y
  una capa de configuración que ningún `RF-XX` pide explícitamente.
- **(B) Selector de modo en `App.tsx`** — un estado de nivel superior
  (`'explorar' | 'fichas'`) que alterna entre `ExploreView` y una nueva vista
  de fichas, con su propia lista de acceso independiente del esqueleto 3D.
  Sin dependencia nueva, coherente con cómo `ExploreView` ya resuelve su
  propio estado de selección en dominio puro.
- **(C) Fichas solo alcanzables desde la selección de E2** — no satisface el
  observable de `RF-03`: seguiría pasando por el esqueleto completo primero.

## Decision

**Opción (B):** un selector de modo simple en el nivel de `App.tsx`, sin
router. La vista de fichas tiene su propia lista de huesos como punto de
entrada —reutilizando `groupByRegion` y el mismo patrón de
`BoneNavigator`—, alcanzable sin haber tocado la escena 3D ni el navegador de
`ExploreView`.

Diferido, no rechazado: si un requisito futuro pide compartir el enlace a un
hueso puntual (por ejemplo, un modo de repaso dirigido que enlace a huesos
fallados — `RF-09`, E5), la opción (A) se reconsidera entonces. El catálogo y
el dominio no cambian si eso ocurre — solo se agrega una capa de URL sobre el
estado que ya existe.

## Consequences

**Positive:**

- Cero dependencias nuevas; consistente con el resto de la aplicación
  ("sin cuenta, sin instalación, sin servidor").
- El estado de qué vista está activa es tan simple como el de selección de
  E2: un `useState` en el nivel más alto que ya conoce ambas vistas.
- Satisface el observable de `RF-03` sin sobre-construir para un requisito
  que no lo pidió.

**Negative / costs:**

- No hay URL para una ficha puntual: no se puede compartir un enlace directo
  ni usar el botón "atrás" del navegador para volver de una ficha a otra.
  Aceptado porque ningún `RF-XX` actual lo exige.
- Si E5 termina necesitando enlaces profundos, esta decisión se revierte y
  el trabajo de esta épica en aislar la vista del hueso se reutiliza tal
  cual — el costo de cambiar de opinión es bajo.

## Alternatives considered

- **(A) Router de cliente:** diferida, no rechazada — ver Decision. Se
  reconsidera si un requisito futuro pide compartir o marcar una página.
- **(C) Solo desde la selección de E2:** rechazada — incumple el observable
  explícito de `RF-03`.
