---
type: adr
id: ADR-009
title: "El camino accesible completo se traslada a Fichas → ficha; Explorar deja de convivir con la lista"
status: accepted
date: 2026-08-17
epic: e7
supersedes: ADR-002 (parcial)
---

# ADR-009: El camino accesible completo se traslada a Fichas → ficha; Explorar deja de convivir con la lista

## Status

Accepted. Supersede parcialmente a **ADR-002**: su punto 2 decía que el
navegador en DOM es «una vía de acceso equivalente [a la escena], no un
añadido» **dentro de la misma vista**. Esta decisión mantiene la vía
equivalente a nivel de aplicación, pero dentro de Explorar deja de convivir
con el lienzo.

## Context

E7 pide que la vista Explorar en móvil se sienta como mirar el esqueleto, no
como un panel de control: el lienzo 3D a pantalla completa, la identidad del
hueso elegido en una tarjeta flotante, sin el navegador de 206 huesos ocupando
una columna fija.

ADR-002 (E2) decidió que el navegador «se construye antes que la escena» y
que el hueso seleccionado se comunica por tres canales simultáneos —escena,
lista, panel de identidad— **dentro de la misma vista**, precisamente porque
un `<canvas>` WebGL no tiene roles, foco ni nombres accesibles: es «un
rectángulo opaco» para un lector de pantalla. El brief de E7 declara además,
como no-go absoluto: «no se degrada la accesibilidad para conseguir la
estética — nunca».

Quitar el navegador de Explorar sin más rompería ese no-go: un usuario de
teclado o lector de pantalla que abra esa vista no tendría nada que enfocar
para hacer la primera selección.

**Verificado antes de decidir, no asumido:** `App.tsx` ya monta, desde antes
de esta épica, un camino completo que no pasa por Explorar. La pestaña
«Fichas» monta `BoneNavigator` a lista completa (sin filtrar, los 206 huesos),
y elegir cualquiera —representable o no— navega a `BoneDetailView`, que monta
su propia escena aislada (dimensionada correctamente desde e7.2) y su propio
`BoneIdentity` (con mínimo táctil y tipografía display desde e7.5). Ese camino
es alcanzable por teclado de punta a punta y no depende de Explorar en
absoluto.

## Decision

**El navegador de huesos deja de vivir dentro de `ExploreView`. La vía de
acceso completa por teclado se traslada a Fichas → ficha, y ahí sigue siendo
de primera clase, no un añadido.**

1. `BoneNavigator` no se toca ni se degrada — sigue siendo el mismo componente
   accesible de e7.4, montado a pantalla completa en la pestaña «Fichas».
2. `Explorar` se vuelve una vista de exploración visual: el lienzo a pantalla
   completa, con la identidad como tarjeta flotante al elegir. No ofrece una
   vía de selección por teclado propia.
3. `must-a11y-005` («toda región de hueso es alcanzable y activable por
   teclado») se sigue cumpliendo, medido a nivel de **aplicación**: cualquier
   hueso es alcanzable por teclado en dos toques de pestaña. Antes se cumplía
   dentro de cada vista; ahora se cumple en el conjunto.
4. El navbar (Explorar / Fichas / Test) permanece visible en todo momento,
   así que el costo de cambiar de vía es un tab, no una búsqueda.

## Consequences

- **El no-go del brief se sostiene, pero cambia su forma de cumplirse**: de
  «cada vista es accesible por sí sola» a «la aplicación completa lo es, y el
  costo de acceder desde una vista visual a la vía accesible es mínimo».
  Queda escrito para que la próxima historia que toque Explorar no asuma que
  la vieja garantía (por vista) sigue en pie.
- Dos textos que asumían la lista dentro de Explorar dejan de ser ciertos y se
  corrigen en esta misma historia: el estado vacío de `BoneIdentity` y el
  `sr-only` por defecto del lienzo.
- Un estudiante que empieza en Explorar sin saber de la pestaña Fichas podría
  no descubrir el camino accesible por sí solo. Se acepta: el navbar está
  siempre visible y con las tres pestañas nombradas, no escondido.
- Si una futura historia reintrodujera la necesidad de seleccionar por
  teclado *dentro* de Explorar, esta decisión es la que habría que superseder
  — no un ajuste silencioso.

## Alternatives considered

- **(A) Bandeja deslizable con el navegador, alcanzable por teclado desde
  Explorar.** Conserva la vía dentro de la vista, más fiel a la letra de
  ADR-002. Rechazada por decisión explícita del usuario tras planteársela: no
  es la experiencia visual que busca la épica, y la vía por Fichas ya es
  completa.
- **(B) Reservar una franja fija para el navegador, como hasta ahora.**
  Rechazada: no logra el lienzo a pantalla completa que es el objetivo de
  esta historia.
- **(C) No tocar Explorar y dejar la decisión para más adelante.** Rechazada:
  es exactamente el pedido de esta historia, y el hueco de accesibilidad ya
  está resuelto por el camino existente — posponer no evita el trabajo, solo
  lo demora.
