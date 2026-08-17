# Story e4.1: Dominio del modo test — Scope

## User story

As el motor de test (sin vista todavía, esta historia es su cimiento),
I want validar tolerantemente lo que un estudiante escribe y elegir qué
hueso preguntar,
so that las historias siguientes (e4.2-e4.5) tengan una base de dominio
probada sobre la que construir la vista, sin lógica de negocio en
componentes.

## Acceptance criteria

```gherkin
Given el hueso "fémur" (es: fémur, la: os femoris, synonyms: [hueso del muslo])
When se valida la respuesta "FEMUR", "femur", "el fémur" u "os femoris"
Then todas se aceptan como correctas

Given el mismo hueso
When se valida la respuesta "tibia"
Then se rechaza

Given un hueso con sinónimos en mayúsculas reales del catálogo (p. ej.
  "primera vértebra cervical", synonyms: ['C1', 'vértebra C1'])
When se valida la respuesta "c1" (minúscula, el estudiante no tiene por qué
  saber que el catálogo usa mayúscula)
Then se acepta

Given cualquier hueso
When se valida una respuesta vacía o solo espacios
Then se rechaza, nunca revienta

Given el catálogo completo
When se elige un hueso para preguntar
Then el hueso elegido tiene `meshName !== null` — nunca uno de los 7
  ausentes del modelo
```

## Example

| Input | Hueso | Resultado |
|-------|-------|-----------|
| `FEMUR` | fémur | correcta |
| `  el fémur  ` | fémur | correcta (espacios y artículo) |
| `os femoris` | fémur | correcta (latín) |
| `hueso del muslo` | fémur | correcta (sinónimo) |
| `tibia` | fémur | incorrecta |
| `c1` | primera vértebra cervical | correcta (sinónimo `C1`, sin distinguir mayúsculas) |
| `` (vacío) | cualquiera | incorrecta, sin excepción |

## In scope

- `domain/answer-check.ts`: `normalizeAnswer(texto: string): string` —
  minúsculas, sin tildes, recorta espacios, colapsa espacios múltiples,
  quita un artículo inicial (`el`/`la`/`los`/`las`) si lo hay.
- `isCorrectAnswer(respuesta: string, hueso: Bone): boolean` — compara la
  respuesta normalizada contra `es`, `la` y cada `synonyms[]`, todos
  normalizados igual.
- `domain/quiz.ts`: `pickTestableBone(bones, excluirId?: string): Bone` —
  hueso al azar entre los que tienen `meshName !== null`; `excluirId`
  opcional para no repetir la pregunta anterior (uso previsto en e4.2, no
  se construye la lógica de repetición todavía, solo el parámetro).

## Out of scope

- Cualquier componente de vista — es e4.2 en adelante.
- Registrar el resultado de una respuesta — es `RF-09`/E5.
- Priorizar qué hueso preguntar según fallos previos — es `RF-09`/E5;
  `excluirId` solo evita repetir la pregunta inmediatamente anterior.

## Done when

- `isCorrectAnswer` cubre los siete casos de la tabla de ejemplo, más al
  menos un caso por cada regla de `RF-06` (mayúsculas, tildes, espacios,
  artículo, sinónimo, ambas nomenclaturas) con datos reales del catálogo,
  no inventados.
- `pickTestableBone` nunca devuelve un hueso sin `meshName`, verificado
  contra el catálogo completo (206 entradas), no una muestra.
- `must-test-001` (`governance/guardrails.md`) queda satisfecho: casos
  correctos, incorrectos y límite, todos con test.

## Notes

Diseño completo en `work/epics/e4-test-engine/design.md`. Sin artículos
embebidos en ningún `es` del catálogo (confirmado por grep antes de
escribir este scope) — la regla de "quitar artículo inicial" solo debe
tocar lo que el estudiante escribe, nunca lo que ya vive en el catálogo.
