---
type: adr
id: ADR-011
title: "Fichas se reestructura en acordeón de dos niveles; el navegador oculto de Explorar (ADR-010) no se toca"
status: accepted
date: 2026-08-17
epic: e8
---

# ADR-011: Fichas se reestructura en acordeón de dos niveles; el navegador oculto de Explorar (ADR-010) no se toca

## Status

Accepted

## Context

El mockup importado a mitad de E7 ("Rediseño aplicación anatomía ósea",
`claude.ai/design`, `refs/huesos-mono-ui.html`) propone, para la pestaña
Fichas, un acordeón de dos niveles — categoría (p. ej. "Cráneo") → subgrupo
(p. ej. "neurocráneo", "cara") → grilla de etiquetas — en vez de la lista
plana de 10 regiones con filas de pares que e7.4 construyó
(`BoneNavigator`, `toNavigatorRows`, `groupByRegion`).

El parking lot de E7 (entrada del 2026-08-17, "Acordeón de Fichas del
mockup de Claude Design") anotó que esta historia necesitaría "su propio
ADR que supersede la arquitectura de pares/pills de e7.4 (ADR-010 y
`toNavigatorRows`)". Releer ADR-010 en el gemba de esta épica corrige esa
suposición: **ADR-010 no gobierna la lista visible de Fichas**. Decide algo
distinto — que `BoneNavigator` siga montado pero oculto (`sr-only`) dentro
de `ExploreView`, como vía de teclado/lector de pantalla y como selector
determinista para las pruebas de `explore.spec.ts` (b2.1/b2.2/b2.3). La
instancia de `BoneNavigator` que Fichas muestra hoy (`App.tsx`, modo
`'fichas'`) es un montaje **separado**, visible, sin relación con la
decisión de ADR-010.

`toNavigatorRows`/`groupByRegion` (dominio, sin JSX) siguen siendo
reutilizables: el acordeón necesita agrupar por región igual que hoy, solo
que agrega un nivel superior. `REGION_LABEL` ya codifica ese nivel superior
sin saberlo — las dos únicas regiones con "—" en su etiqueta
(`cranium: 'Cráneo — neurocráneo'`, `face: 'Cráneo — cara'`) son
exactamente las dos que el mockup junta bajo la categoría "Cráneo"; las
ocho restantes no tienen "—" y son, cada una, su propia categoría de un
solo subgrupo.

Options:

- **(A) Superseder ADR-010** — incorrecto: ADR-010 no decide nada sobre
  Fichas. Superseder una decisión que el cambio no toca sería una edición
  fantasma, y dejaría sin resolver la pregunta real (qué reemplaza al
  render visible de Fichas).
- **(B) Reescribir `BoneNavigator` para que soporte accordion y lista plana
  con una prop de modo** — un componente con dos formas de render
  incompatibles (uno con `aria-pressed` de selección para Explorar oculto,
  otro con `aria-expanded` de acordeón para Fichas) es más difícil de leer
  que dos componentes separados que comparten el mismo dominio.
- **(C) Un componente nuevo (`FichasAccordion` o similar) que consume
  `groupByRegion`/`toNavigatorRows`, agrupado por un nivel de categoría
  nuevo; `BoneNavigator` sigue existiendo sin cambios, exclusivo de
  Explorar.**

## Decision

**Opción (C):**

1. Un componente nuevo monta el modo `'fichas'` de `App.tsx`, reemplazando
   el `<BoneNavigator>` visible que hay ahí hoy.
2. Una función de dominio nueva agrupa las `RegionGroup` de `groupByRegion`
   en categorías, derivando el nombre de categoría del prefijo de
   `REGION_LABEL` antes de "—" (o la etiqueta completa cuando no hay "—") —
   sin inventar una tabla de categorías paralela al catálogo.
3. Dentro de cada categoría expandida, cada subgrupo (una `RegionGroup`)
   sigue usando `toNavigatorRows` para la grilla de etiquetas — se
   reutiliza tal cual, no se reimplementa el criterio de pares.
4. `BoneNavigator` (el componente) y su montaje oculto en `ExploreView`
   **no cambian una línea**: ADR-010 sigue vigente exactamente como está.

## Consequences

**Positive:**
- El aprendizaje de e7.4/e7.5 sobre pares indistinguibles
  (`isSideIrrelevant`) se hereda gratis: el subgrupo del acordeón reutiliza
  `toNavigatorRows`, que ya lo aplica.
- Cero riesgo sobre `explore.spec.ts` (b2.1/b2.2/b2.3): ninguna prueba que
  protege esos defectos toca Fichas.

**Negative / costs:**
- Dos componentes de navegación de huesos en el árbol (`BoneNavigator` para
  Explorar oculto, el acordeón para Fichas visible) en vez de uno solo con
  dos modos — más archivos, pero cada uno legible sin condicionales de
  modo cruzando accesibilidad con estructura visual.
- La categoría "Cráneo" queda derivada de una convención de texto
  (`split('—')`) en vez de un campo explícito del catálogo — aceptable
  porque son solo 2 de 10 regiones las que la usan, y un test de la nueva
  función de agrupación fija ese comportamiento en vez de dejarlo implícito.

## Alternatives considered

- **(A) Superseder ADR-010:** rechazada — no hay decisión de ADR-010 que
  este cambio contradiga.
- **(B) `BoneNavigator` con prop de modo:** rechazada por mezclar dos
  contratos de accesibilidad distintos (selección oculta vs. acordeón
  visible) en un solo componente.
