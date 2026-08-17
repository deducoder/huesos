# Story e4.1: Dominio del modo test — Retrospective

Estimated: S (2-3 tareas) · Actual: 3 tareas + 1 corrección de calidad

## Summary

`domain/answer-check.ts` valida respuestas escritas con la tolerancia
exacta de `RF-06` (mayúsculas, tildes, espacios, artículo inicial,
sinónimos, ambas nomenclaturas) sin confundir la "ñ" con una vocal
acentuada. `domain/quiz.ts` elige un hueso preguntable al azar. Ambos, sin
UI, verificados contra las 206 entradas reales del catálogo, no una
muestra.

## What went well

- La verificación contra el catálogo completo (T3) se diseñó *antes* de
  saber que iba a hacer falta — estaba en el plan por disciplina ("no
  confiar en el ejemplo, correr contra los datos reales"), no como
  reacción a un bug ya encontrado. Cuando `quality-review` encontró el bug
  de la "ñ", el mismo script de T3 sirvió para confirmar el arreglo contra
  las 206 entradas, no solo contra el caso que lo destapó.
- El caso límite real ("cuña"/"cuna") se encontró leyendo el catálogo con
  un grep dirigido (`grep "ñ"`) antes de escribir el código, no
  adivinando qué casos límite podrían existir — mismo método que e3.1 usó
  con `inventory-model.mjs`.

## What to improve

- **El bug de la "ñ" pasó los tests de T1 y el script de T3 sin que nadie
  lo notara hasta `quality-review`.** Motivo concreto: T3 comparaba cada
  entrada del catálogo *contra sí misma* (`isCorrectAnswer(bone.es,
  bone)`), y como ambos lados de la comparación pasan por la misma
  normalización, un error sistemático en la normalización (convertir "ñ"
  en "n") es invisible a esa prueba — el catálogo se valida a sí mismo
  aunque la regla esté mal. La lección: una verificación "contra los datos
  reales" que compara datos ya normalizados contra sí mismos no prueba que
  la normalización sea *correcta*, solo que es *consistente*. Hacía falta
  un segundo criterio independiente (que "cuña" y "cuna" son palabras
  distintas) que no se derivaba de los datos, sino de conocer el idioma.
- Consecuencia práctica para el resto de la épica: cualquier historia que
  use `normalizeAnswer`/`isCorrectAnswer` puede confiar en el resultado
  del catálogo, no hace falta revalidar la "ñ" en cada consumidor — pero
  si aparece otra regla de normalización nueva más adelante (poco
  probable, `RF-06` ya está completo), aplicar el mismo principio: un
  criterio de corrección externo a los propios datos, no solo
  autoconsistencia.

## Learned

1. **About the system:** el catálogo tiene casos reales que una intuición
   genérica sobre "normalización de texto en español" no anticipa sin
   mirarlo — "cuña"/"cuña medial" son las únicas tres entradas con "ñ" de
   206, y sin embargo habrían producido falsos positivos sistemáticos
   (cualquier respuesta "cuna" se habría aceptado como correcta para un
   hueso llamado "cuña").
2. **About the process:** una verificación "contra datos reales" no
   reemplaza un criterio de corrección independiente de esos datos. Vale
   la pena, en la próxima historia con normalización o transformación de
   texto, preguntar explícitamente: "¿esta prueba compara contra algo que
   no pasó por la misma transformación que estoy probando?"
3. **Capability gained:** el patrón "reemplazos explícitos de caracteres
   conocidos" en vez de "descomponer Unicode y despojar genéricamente" es
   más seguro cuando el alfabeto tiene letras con diacríticos que no son
   variantes acentuadas (como la "ñ" en español) — reusable si el catálogo
   alguna vez suma términos en otro idioma con la misma trampa (p. ej.
   alemán "ß", portugués "ã").
