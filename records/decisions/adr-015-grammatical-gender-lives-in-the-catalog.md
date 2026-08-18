---
type: adr
id: ADR-015
title: "El género gramatical del nombre viaja en el catálogo; la vista solo concuerda el lado"
status: accepted
date: 2026-08-18
epic: e9
---

# ADR-015: El género gramatical del nombre viaja en el catálogo; la vista solo concuerda el lado

## Status

Accepted

Complementa ADR-014, que decidió el nombre corto y dejó explícitamente abierto
de dónde sale el género del lado.

## Context

`SIDE_LABEL` es `{ left: 'izquierdo', right: 'derecho' }`, masculino fijo, y
los tres componentes que muestran un hueso par lo concatenan sin mirar el
nombre. Medido sobre el catálogo real: de los 86 nombres únicos que llevan
lado, **47 son femeninos** — es decir **94 de los 172 huesos con lado** dicen
hoy «clavícula derecho», «escápula derecho», «tercera costilla derecho». No es
solo el texto visible: el nombre accesible es el mismo string, así que un
lector de pantalla lo pronuncia igual, y `must-a11y-005` exige que ese nombre
sea el que identifica al hueso.

El género no se puede derivar. La terminación no sirve: «falange» acaba en -e
y es femenino, «cornete» acaba en -e y es masculino; «hueso coxal» es
masculino con el núcleo al principio y «primera cuña» femenino con el ordinal
delante. El latín tampoco ayuda —`la` sigue la declinación latina, no el
género del término español— y los sinónimos no traen artículo.

Hay además una restricción que decide dónde **no** puede vivir el dato:
`should-i18n-009` exige que los nombres anatómicos vivan en el catálogo y
nunca incrustados en los componentes, y se verifica con un grep de literales
anatómicos sobre `src/components`.

Options:

- **(A) Campo `gender` en el catálogo.** El dato vive junto al nombre del que
  es propiedad. Cuesta 206 valores, que ningún compilador puede adivinar.
- **(B) Regla por terminación con lista de excepciones, en la vista.** Barata
  de escribir, pero la lista de excepciones **es** una lista de nombres
  anatómicos dentro de `src/components` —exactamente lo que
  `should-i18n-009` prohíbe— y ninguna comprobación la mantiene sincronizada
  con el catálogo: añadir un hueso femenino que la regla no acierte da un
  error silencioso.
- **(C) Reformular el lado para esquivar el género:** «clavícula lado
  derecho», donde «lado» es masculino siempre. No necesita dato nuevo ni
  lista. Pero alarga cada etiqueta en cinco caracteres justo en la historia
  cuyo objeto es acortarlas, y nadie estudia ni escribe así: `RF-06` acepta lo
  que un estudiante teclea, y lo que teclea es «clavícula derecha».

## Decision

**(A)**. `gender: 'm' | 'f'` es un campo **obligatorio** de `BoneCore`, junto
a `es`, `la` y `synonyms`, y describe el género gramatical del nombre en
español. Obligatorio y no opcional: un campo que se puede omitir se omite, y
la omisión reaparece como el mismo «clavícula derecho» que esta decisión viene
a arreglar. El compilador lo exige en las 206 entradas.

La vista no guarda ninguna tabla de géneros. `sideLabel(side, gender)` en
`src/components/bone-name.ts` es toda la lógica de concordancia, y su firma
—dos argumentos requeridos— hace que el compilador nombre a cada llamador
cuando `SIDE_LABEL` desaparezca.

El género se aplica **tanto al texto visible como al nombre accesible**. Es la
diferencia con el acortado de ADR-014, que solo toca el visible: acortar es
una concesión al ancho de una pantalla, y una pantalla estrecha no es motivo
para que un lector de pantalla pronuncie mal el nombre.

El género del **ordinal** queda fuera de esta decisión: sale de la propia
palabra («primera costilla» → «1.ª costilla», «primer metacarpiano» → «1.º
metacarpiano»), así que la tabla de derivación de ADR-014 lo resuelve sin
consultar el catálogo.

## Consequences

- El género deja de ser una suposición y pasa a ser un dato declarado, con la
  misma exigencia que la región o el lado: verificable en la prueba de
  integridad del catálogo (`must-data-002`), que puede además exigir que dos
  entradas con el mismo `es` declaren el mismo género.
- `should-i18n-009` se cumple sin excepción: ningún nombre anatómico entra en
  `src/components` para resolver la concordancia.
- **Cuesta 206 valores escritos una vez.** Es el mismo coste que ADR-014
  rechazó para el nombre corto, y la diferencia que lo justifica es qué se
  escribe: allí eran ~48 nombres transcritos, cada uno una errata capaz de
  desincronizarse en silencio de su original; aquí es un enum de dos valores
  que no puede divergir de nada y que se lee de un vistazo.
- **Un hueso nuevo no compila sin declarar su género.** Es fricción deliberada
  y, con el catálogo cerrado en 206 entradas (ADR-006), ocurre casi nunca.
- El tipo `Bone` gana un campo que 34 entradas —los huesos impares— nunca
  usan. Se aceptó la uniformidad en vez de un tipo condicionado al lado: la
  complejidad de tipos habría costado más que el campo de sobra.

## Alternatives considered

**(B) Regla por terminación con excepciones en la vista.** Rechazada por
`should-i18n-009` y por el fallo silencioso: una excepción que falta no rompe
nada visible, solo escribe mal un nombre — que es el defecto que ya estuvo
vivo desde e7.4 sin que ningún gate lo viera. Una regla que necesita una lista
de 47 nombres para funcionar no es una regla, es la tabla de la opción (A)
puesta en el sitio equivocado.

**(C) «lado derecho» para esquivar el género.** Rechazada por coste de espacio
y por naturalidad. Es la opción más simple de todas y merece quedar escrita:
si algún día el catálogo dejara de ser fiable en su género, esta vuelve a la
mesa sin necesitar dato nuevo.
