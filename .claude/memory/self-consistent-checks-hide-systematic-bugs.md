---
name: self-consistent-checks-hide-systematic-bugs
description: Una verificación "contra datos reales" que compara datos ya normalizados contra sí mismos con la misma normalización no prueba que la normalización sea correcta — solo que es consistente. Hace falta un criterio externo a los propios datos.
metadata:
  type: pitfall
---

En e4.1, `normalizeAnswer` usaba `normalize('NFD')` + strip de diacríticos
para quitar tildes — y eso también convertía la "ñ" en "n" ("cuña" →
"cuna"), una palabra española distinta, no una variante ortográfica. La
verificación de la propia historia corrió `isCorrectAnswer(bone.es, bone)`
contra las 206 entradas reales del catálogo y dio **0 fallos**: el
catálogo se validaba a sí mismo perfectamente, aunque la regla de
normalización tuviera un error sistemático, porque ambos lados de cada
comparación pasaban por la misma transformación rota.

**Por qué importa:** "verificado contra datos reales, no una muestra" suena
a prueba rigurosa, y lo es para atrapar casos límite que un ejemplo
pequeño no cubre — pero no basta cuando el propio criterio de verificación
usa la función bajo prueba para juzgarse a sí misma. Un bug sistemático en
una transformación es invisible a una prueba que aplica esa misma
transformación a ambos lados de la comparación.

**How to apply:** al verificar una función de normalización/transformación
contra un conjunto de datos real, sumar al menos un criterio de corrección
que **no dependa de la función bajo prueba** — un hecho externo (acá:
"cuña" y "cuna" son palabras distintas del idioma, no datos del catálogo).
Preguntar explícitamente: "¿esta verificación compara contra algo que no
pasó por la misma transformación que estoy probando?" Si la respuesta es
no, la verificación prueba consistencia, no corrección.
