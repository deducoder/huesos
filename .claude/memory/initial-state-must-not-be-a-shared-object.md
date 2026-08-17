---
name: initial-state-must-not-be-a-shared-object
description: Devolver una constante compartida como "estado inicial" para toda clave ausente convierte la mutación de un consumidor en corrupción global y permanente; construirlo en cada llamada cuesta nada.
metadata:
  type: pitfall
---

En e5.1, `boneProgress(record, id)` devolvía `NUNCA_PREGUNTADO`, una única
constante `{ correct: 0, incorrect: 0 }`, para cualquier hueso sin registro.
Leer `frontal`, escribirle `correct = 99`, y leer `occipital` devolvía
`{ correct: 99 }` — un hueso distinto, un registro distinto, el mismo objeto.
El test de regresión lo demostró en una línea.

El tipo tampoco ayudaba: `ProgressRecord = Readonly<Record<string,
BoneProgress>>` congela el primer nivel y deja los contadores de dentro
mutables, así que **prometía una inmutabilidad que no daba**. `Readonly<>`
sobre un `Record` es superficial.

**Por qué importa:** el fallo es silencioso, global y permanente durante toda
la vida del proceso, y no se parece en nada a su causa — el síntoma aparece
leyendo una clave que nadie tocó. Ningún test de las funciones "normales" lo
ve, porque todas ellas se portan bien.

**How to apply:** un valor por defecto devuelto desde una función se construye
en cada llamada, no se saca de una constante de módulo, salvo que sea
inmutable de verdad (primitivo, o congelado). Y `Readonly<Record<K,V>>` no
hace `V` inmutable: los `readonly` van también en los campos de `V`, o el tipo
miente. Ver [[self-consistent-checks-hide-systematic-bugs]] para el otro
patrón de esta familia: garantías que se creen dadas y nadie comprobó.
