---
name: guardrail-text-can-carry-a-rejected-option
description: "Un guardrail puede describir la opción DESCARTADA de un ADR en vez de la aceptada, sin que nada lo marque como error — vale la pena releer la redacción contra las opciones reales del ADR, no solo contra su decisión final."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 341330ec-28f7-4560-b20e-7f103b32b38a
  modified: 2026-08-18T00:52:22.161Z
---

Un guardrail (o cualquier documento de gobernanza) puede quedar redactado
sobre una opción que un ADR **evaluó y descartó**, en vez de la que aceptó
— sin que ningún proceso lo marque como contradicción, porque nada compara
automáticamente el texto del guardrail contra las opciones del ADR, solo
contra su decisión final.

**Por qué:** en huesos-mono, `should-perf-007` exigía "el SVG se sirve por
debajo de 500 KB". ADR-001 (aceptado, nunca superseded) había comparado un
SVG de 304 KB contra un modelo glTF de mayor peso, y **adoptó el glTF** por
cobertura (206 huesos vs. 43 regiones agrupadas del SVG). El guardrail
seguía describiendo la opción rechazada — probablemente escrito antes de
que la comparación de ADR-001 se resolviera, y nunca actualizado después.

**Cómo aplicar:** al auditar un guardrail o una regla de gobernanza que
mencione una cifra o una tecnología concreta, no alcanza con comprobar que
tiene ADR o que el ADR sigue `accepted` — hay que leer las **opciones**
que ese ADR comparó, no solo su título, porque el guardrail puede estar
describiendo la que perdió.
