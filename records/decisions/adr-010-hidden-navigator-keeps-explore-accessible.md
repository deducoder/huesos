---
type: adr
id: ADR-010
title: "El navegador sigue montado en Explorar, oculto visualmente: la vía accesible no se traslada"
status: accepted
date: 2026-08-17
epic: e7
supersedes: ADR-009
---

# ADR-010: El navegador sigue montado en Explorar, oculto visualmente: la vía accesible no se traslada

## Status

Accepted. Supersede a **ADR-009** por completo: esa decisión trasladaba la
vía accesible completa a Fichas porque asumía que el navegador desaparecía
del árbol de Explorar. Esta la corrige antes de haberse implementado —el
hallazgo llegó durante la implementación de e7.6, no después.

## Context

Implementando e7.6 sobre ADR-009 apareció un costo que esa decisión no había
pesado: **dos pruebas de navegador que protegen b2.1/b2.2 y b2.3** —los
defectos más caros de la historia del proyecto— seleccionan un hueso
*específico por nombre* (`fémur derecho`, `fémur izquierdo`, `hueso parietal
derecho`, `hueso parietal izquierdo`) para medir en qué mitad de la pantalla
se enciende el resaltado. Sin el navegador, no hay ninguna forma determinista
de elegir ese hueso concreto en la escena combinada —la pestaña «Fichas»
lleva a una escena **aislada** de un solo hueso, que no ejecuta la lógica de
espejado (`stripMidline`) que b2.3 protege.

Se planteó al usuario, con tres salidas: perder esa precisión de prueba,
calcular coordenadas de pantalla desde la cámara real, o mantener el
navegador montado pero oculto a la vista. Eligió la tercera.

## Decision

**`BoneNavigator` sigue montado dentro de `ExploreView`, con `className="sr-only"`
en vez de quitarse.** Sigue siendo la misma vía de teclado y lector de
pantalla que ADR-002 estableció —mismo componente, mismos `aria-pressed`,
mismos nombres accesibles—, y sigue siendo el selector determinista que las
pruebas de b2.1/b2.2/b2.3 necesitan.

1. **Para quien ve la pantalla:** el lienzo ocupa el 100% y no hay columna de
   lista — la dirección visual de e7.6 se sostiene sin cambios.
2. **Para quien navega por teclado o lector de pantalla:** el navegador está
   ahí, alcanzable con Tab, exactamente como en cualquier otra vista.
3. **Para las pruebas de navegador:** los botones existen en el DOM y se
   pueden pulsar con `{ force: true }` —Playwright los rechaza por
   `toBeVisible()`/`.click()` normal, porque `sr-only` los recorta
   visualmente a 1×1 px—, así que `esperarEscena` y `seleccionar` en
   `explore.spec.ts` se ajustan a eso, no a esperar su visibilidad.
4. **ADR-009 queda registrada como superseded, no borrada**: documenta un
   costo real que se pesó y se corrigió, y la razón por la que se corrigió.

## Consequences

- `must-a11y-005` se sostiene **dentro de cada vista**, como ADR-002 siempre
  quiso — no hace falta el traslado a nivel de aplicación que ADR-009
  proponía.
- Un usuario de teclado que tabula por Explorar pasa por 206 objetivos
  invisibles antes de llegar a lo que sigue en la pantalla. Es el mismo costo
  que el navegador visible ya tenía —tabular 206 elementos no es nuevo—,
  solo que ahora nadie lo ve mientras ocurre. Aceptado: no es peor que antes,
  es el mismo contrato de accesibilidad de siempre.
- Las pruebas de b2.1/b2.2/b2.3 no pierden precisión: siguen seleccionando
  por nombre, con `{ force: true }` documentado y con la razón escrita en el
  propio archivo.
- El `sr-only` no afecta el layout: es `position: absolute`, así que el
  lienzo sigue midiendo el 100% del contenedor sin que la lista invisible le
  reste espacio.

## Alternatives considered

Las mismas que ADR-009 ya había registrado, más una nueva:

- **(mantener ADR-009: trasladar todo a Fichas).** Rechazada al descubrir el
  costo sobre las pruebas de regresión — un costo que ADR-009 no había
  medido porque se escribió antes de tocar `explore.spec.ts`.
- **(clic por coordenadas calculadas desde la cámara real).** Rechazada por
  el usuario: es una técnica de prueba nueva y más compleja para un proyecto
  que trata el canvas como caja negra a propósito.
- **(aceptar menos precisión en las pruebas).** Rechazada por el usuario:
  perder la protección específica de b2.3 —la regresión más reciente— no
  vale el ahorro de siete líneas de CSS.
