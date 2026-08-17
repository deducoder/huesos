# Story e4.3: Corrección explícita del error — Retrospective

Estimated: S (2-3 tareas) · Actual: 2 tareas, sin desviación de tamaño

## Summary

`TestQuestion` muestra el nombre correcto en ambas nomenclaturas cuando la
respuesta es incorrecta, sin tocarlo cuando es correcta. `RF-07` completo.
El hueso preguntado permanece resaltado en su posición — heredado de e4.2,
verificado explícitamente acá, no solo asumido.

## What went well

- La verificación manual (T2) esta vez planteó una sospecha de bug real
  —el resaltado parecía no coincidir con el hueso nombrado— y en vez de
  reportarlo como hallazgo sin confirmar, se armó un experimento controlado
  (`Math.random = () => 0` para fijar la pregunta en un hueso grande y
  visible) que lo descartó en un paso. La honestidad metódica va en ambas
  direcciones: nombrar hallazgos reales (como el de e4.2) y también
  descartar sospechas falsas antes de escribirlas como si fueran ciertas.

## What to improve

- La sospecha inicial (costillas resaltadas en vez del hueso real) vino de
  mirar una captura sin comparar contra un caso de control. Para la
  próxima verificación visual con huesos elegidos al azar, vale la pena
  fijar de entrada un caso conocido y grande (como se hizo acá, pero
  después de la sospecha, no antes) — habría ahorrado el paso de
  investigación.

## Learned

1. **About the system:** el resaltado de `SkeletonScene` funciona
   correctamente para cualquier hueso — confirmado con un caso de control
   explícito, no solo inferido de que los tests unitarios pasan (los tests
   unitarios no pueden verificar color en jsdom, ADR-002).
2. **About the process:** no todo lo que parece un defecto en la
   verificación manual lo es — cuatro historias con hallazgos reales
   (`manual-verification-keeps-finding-real-things`) no significa que la
   quinta sospecha también lo sea. El método pide investigar antes de
   nombrar el hallazgo, en cualquier dirección.
3. **Capability gained:** la técnica de fijar `Math.random` en el `page`
   de Playwright antes de navegar (`addInitScript`) para hacer determinista
   una elección aleatoria del lado del cliente es reusable para cualquier
   verificación manual futura sobre `pickTestableBone` — evita depender de
   qué hueso cayó al azar para reproducir un caso concreto.
