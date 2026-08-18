---
type: adr
id: ADR-014
title: "El nombre corto es una derivación de vista con gate de unicidad; el nombre accesible conserva el completo"
status: accepted
date: 2026-08-17
epic: e9
---

# ADR-014: El nombre corto es una derivación de vista con gate de unicidad; el nombre accesible conserva el completo

## Status

Accepted

## Context

Medido contra el catálogo real, 28 de los 120 nombres únicos pasan de 36
caracteres y todos pertenecen a tres familias regulares: falanges
(`falange proximal del segundo dedo de la mano`, 44), vértebras
(`duodécima vértebra torácica`, 30) y metacarpianos/metatarsianos
(`segundo metatarsiano`, 20). En un botón de 390 px —la grilla de Fichas,
las tres opciones del test— un nombre de 44 caracteres envuelve a tres
líneas o se recorta.

El acortado obvio destruye información. «Falange distal del primer dedo de
la mano» → «falange distal de la mano» colapsa **las 28 falanges de la mano
en 3 etiquetas**, y como `pickDistractors` elige distractores de la misma
región, el test de opción múltiple podría mostrar tres botones con el mismo
texto. El discriminante —qué dedo— es justamente lo que hay que conservar.

Hay además dos consumidores del nombre que no son visuales y que hoy leen
el mismo dato: el nombre accesible de cada botón (`accessibleName` en
`BoneNavigator.tsx` y `FichasAccordion.tsx`, que es el `textContent` que
oye un lector de pantalla) y la suite de Playwright, que localiza por
`getByRole('button', { name: 'fémur derecho', exact: true })`.

Options:

- **(A) Campo `esCorto` en el catálogo**, escrito a mano donde haga falta.
  Honesto con la irregularidad del catálogo, pero son ~48 nombres nuevos
  transcritos a mano y cada uno es una errata posible que nada compara
  contra su original.
- **(B) Derivación pura de vista**: una función que reescribe el nombre
  completo con una tabla explícita de ordinales, más un gate que exige que
  los 206 nombres cortos sigan siendo únicos y que ninguno pase del techo
  de longitud.
- **(C) Acortar el propio `es` del catálogo.** El más simple de todos y el
  que pierde el dato: la ficha completa ya no tendría el nombre entero que
  mostrar, y `isCorrectAnswer` validaría contra un nombre mutilado.

## Decision

**(B)**, con dos invariantes que la hacen segura.

**El nombre corto es presentación, no dato.** Vive en la capa de vista
—depende de etiquetas en español, igual que `labels.ts` y `categories.ts`,
así que no entra en `src/domain/`— y se deriva del `es` del catálogo, que no
se toca. Se aplica al **texto visible** de la grilla de Fichas, de las
opciones del test y del título de la ficha.

**El nombre accesible conserva el completo.** El `aria-label` de cada botón
lleva el nombre íntegro del catálogo, en su forma actual. Un lector de
pantalla no tiene el problema de espacio que motiva esta decisión, y la
suite de Playwright que localiza por nombre accesible sigue encontrando lo
mismo. Es la separación que permite acortar sin negociar con la
accesibilidad.

**Un gate, no un inventario.** Una comprobación sobre los 206 huesos reales
exige: que ningún nombre corto pase del techo declarado, que dos huesos
distintos de la misma región nunca produzcan el mismo corto, y que la
función que lo deriva se haya aplicado —que el instrumento miró. El techo y
la forma tipográfica exacta del ordinal se fijan en la historia viendo la
muestra renderizada, no eligiéndolos en abstracto.

La capitalización inicial es parte de la misma derivación: el catálogo
guarda `es` en minúscula porque es correcto dentro de una frase, y la vista
lo capitaliza donde encabeza un botón o un título.

## Consequences

- Cambiar un nombre del catálogo cambia su corto sin trabajo adicional, y
  ninguna transcripción a mano puede desincronizarse del original.
- `isCorrectAnswer`, los sinónimos y la validación del formato escrito
  siguen operando sobre el nombre completo, intactos.
- La suite de Playwright no cambia por el acortado. **Sí cambia por la
  capitalización** si esta llegara al nombre accesible — por eso no llega:
  el `aria-label` conserva la forma del catálogo. Aun así, la historia
  incluye un grep de `e2e/` como tarea nombrada, no como tropiezo.
- El riesgo de colapso deja de depender de la disciplina y pasa a estar
  vigilado: si una regla futura borra un discriminante, el gate de unicidad
  da rojo antes de que un estudiante vea dos botones iguales.
- Hay dos nombres por hueso en la interfaz, uno visible y otro accesible. Es
  divergencia deliberada y acotada; cualquier tercera forma del nombre
  necesita volver a este ADR.

## Alternatives considered

**(A) Campo en el catálogo.** Rechazada por el coste de mantenimiento y por
lo que no protege: un campo escrito a mano no impide el colapso —nada
compara dos entradas entre sí— mientras que el gate de la opción elegida sí
lo hace. La irregularidad del catálogo, que es el argumento fuerte a su
favor (b2.1), aquí no aplica: las tres familias largas son perfectamente
regulares, y lo demostró la lectura de los 120 nombres únicos.

**(C) Acortar el `es` del catálogo.** Rechazada: destruye el dato. El
usuario pidió explícitamente que lo que se resta viva en la ficha completa,
y la validación tolerante del formato escrito (`RF-06`) necesita el nombre
entero para seguir aceptando lo que un estudiante escribe.
