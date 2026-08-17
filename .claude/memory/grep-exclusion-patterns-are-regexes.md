---
name: grep-exclusion-patterns-are-regexes
description: Un `grep -v ".test."` borra también el directorio `/test/`, porque el punto es comodín — y un filtro de exclusión que se pasa de largo no avisa: devuelve menos, que es justo lo que uno espera de un filtro.
metadata:
  type: process
---

Al inventariar los colores literales de e7.1 usé
`grep -rn "slate-\|sky-" src | grep -v ".test."` para descartar los archivos de
prueba. El punto de `.test.` es un comodín, así que el patrón también encaja con
`/test/` en una ruta, y desapareció el directorio entero
`src/features/test/` — con cinco líneas infractoras dentro. El conteo salió
23 en vez de 28, y quedó escrito en el `scope.md` de la historia.

**Por qué importa:** el modo de fallo es silencioso por partida doble. Un filtro
de exclusión que borra de más devuelve **menos** resultados, que es exactamente
lo que se le pidió; y un inventario más corto de lo esperado se lee como buena
noticia, no como sospecha. Es la misma familia que
[[a-check-needs-a-check-that-it-looked]]: la herramienta se porta bien mientras
mira menos de lo que cree.

**How to apply:** en un filtro de exclusión, escapar el separador
(`grep -v '\.test\.'`) o usar los propios excluidores de la herramienta
(`--include`/`--exclude`, `-path`), que no interpretan la ruta como expresión.
Y cuando el resultado de un grep va a quedar escrito como cifra en un
documento, comprobarlo contra un conteo por otra vía antes de anotarlo — o
mejor, dejar que lo cuente un gate ([[contracts-belong-in-gates-not-inventories]]).
