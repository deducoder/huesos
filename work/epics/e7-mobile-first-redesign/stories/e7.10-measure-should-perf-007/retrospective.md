# Story e7.10: Medir `should-perf-007` — Retrospective

## Quality review

Archivos cambiados: `e2e/perf-selection.spec.ts` (nuevo),
`governance/guardrails.md`. Los dos leídos completos antes de esta revisión.

**Critical:** ninguno.

**Recommended:** ninguno.

**Observations:** el test no assert-ea `<100ms` como condición de
aprobar/reprobar — es deliberado (`should`, optimizar fuera de alcance) y
está documentado en el propio plan antes de escribir el código, no
justificado después. La reducción del CPU throttling a 1x al final del test
ocurre antes de las aserciones, así que ninguna falla deja el navegador con
throttling activo para el resto de la suite.

**Verdict: PASS**

## Reflexión

1. **Qué aprendí:** medir la latencia por la vía "obvia" (clic directo en
   el `<canvas>`) habría medido el costo de renderizado por software de
   este entorno (~2s por clic, ya documentado en un comentario de
   `explore.spec.ts`), no la respuesta real de la aplicación. La vía
   accesible (el navegador de huesos) comparte el mismo commit de React
   que resalta la malla, así que mide lo mismo sin ese ruido — y dio
   4,8ms de mediana, ~400x más rápido que lo que el clic directo habría
   reportado.
2. **Qué cambiaría del proceso:** nada — plantear "¿hay una vía alternativa
   que comparta el mismo código sin el costo del mecanismo de entrada?"
   antes de medir fue justo lo que evitó reportar un guardrail roto por
   una razón ajena a la aplicación.
3. **Estimado vs. actual:** S estimado, S real — dos tareas, sin sorpresas.
   La única incertidumbre real (¿el resultado va a cumplir 100ms?) se
   resolvió con margen amplio (mediana 4,8ms, ~20x por debajo del umbral).
4. **Mejora a una skill/convención:** ninguna — el patrón de auditar un
   guardrail contra las *opciones* de su ADR, no solo contra si el ADR
   sigue vigente, queda como aprendizaje de memoria, no como cambio de
   proceso del proyecto (es una única corrección puntual, no un patrón que
   se vaya a repetir dentro de este repo).

## Aprendizajes guardados en memoria

- Medir por la vía accesible en vez de la obvia cuando ambas comparten
  código de aplicación, para evitar medir el entorno en vez de la app.
- Un guardrail puede describir la opción descartada de un ADR en vez de la
  aceptada, sin que nada lo marque como contradicción automáticamente.

## Criterios de aceptación — confirmados

Los cuatro criterios de `design.md` (3 MUST + 1 MUST NOT) quedaron
cumplidos, según el detalle de `progress.md`. `should-perf-007` deja de
ser un guardrail sin medición: mediana 4,8ms, máximo 15,2ms, cumple con
margen amplio. La cláusula del SVG, residuo de una opción que ADR-001
rechazó, quedó corregida.
