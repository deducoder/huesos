# Story s2: Micro-animation opportunities — Retrospective

Estimated: L (6 tareas de código + integración manual) · Actual: 6 tareas de
código + integración manual, más 1 tarea de reparación (`fix(e2e)`) y 1 de
cobertura (`test`) descubiertas durante la propia integración — 9 commits de
trabajo en total sobre el plan de 7.

## Summary

Seis micro-animaciones CSS puras en toda la app (acordeón de fichas, panel de
menú, tarjeta de identidad, retroalimentación del test, píldora de pestaña
activa), sobre un vocabulario nuevo de tokens de motion en `@theme`
(`--duration-*`, `--ease-salida`) y una regla global de
`prefers-reduced-motion`. Sin librería nueva, sin tocar la escena 3D. La
suite E2E completa encontró y se corrigió una regresión real introducida por
el cambio estructural del acordeón; `quality-review` encontró y se corrigió
una brecha de cobertura antes del cierre.

## What went well

- El gate de `find-animation-opportunities` (frecuencia → propósito →
  velocidad → función) filtró bien: de un barrido de toda la app, solo 6
  oportunidades sobrevivieron, y las descartadas (navegación por teclado del
  esqueleto, cross-fade entre vistas completas, la escena 3D) fueron
  descartes correctos que ahorraron alcance real.
- El gemba walk en `story-design` encontró la trampa de accesibilidad
  (`inert` necesario en el acordeón) *antes* de escribir código, no después
  — evitó implementar el truco `grid-template-rows` sin la pieza que evita
  la fuga de foco.
- El orden por riesgo del plan acertó en qué tarea vigilar más de cerca
  (T2, el acordeón) — aunque la manifestación real del riesgo fue distinta
  de lo previsto (ver "What to improve").

## What to improve

- El plan (T7) verificó lo nuevo con un checklist manual, pero no pedía
  explícitamente correr la suite E2E **completa** existente. Fue
  `./scripts/check-integration` corrida entera —no el checklist— lo que
  encontró la colisión de nombre accesible en "Hioides" (categoría de un
  solo hueso, `e2e/mobile-shell.spec.ts`), un archivo que la historia ni
  mencionaba. Si el plan hubiera sido más estricto en pedir la suite
  completa desde el principio, la habría corrido antes y no como un paso
  añadido sobre la marcha.
- `quality-review` encontró una brecha real: agregué la misma clase de
  transición en dos lugares (`TestQuestion.tsx`, formatos `open` y
  `choice`) pero solo escribí un test para uno de los dos — un lapso de
  TDD real (código sin RED que lo exigiera), no un problema de diseño.

## Learned

1. **About the system:** convertir un subárbol de montaje condicional en
   siempre-montado (necesario para animar apertura/cierre con CSS puro)
   puede romper un locator de test que dependía, sin que nadie lo supiera,
   de la ausencia del contenido en el DOM — y el punto de ruptura puede
   estar en un archivo que la historia no toca a propósito. Guardado en
   memoria: `always-mount-for-animation-needs-full-e2e-rerun`.
2. **About the process:** un checklist de integración manual acotado a "lo
   que esta historia agregó" no es sustituto de correr la suite E2E
   completa cuando el cambio altera qué queda montado — el riesgo vive en
   el código viejo que asumía el comportamiento anterior, no en el nuevo.
3. **Capability gained:** confirmado que Tailwind 4.3 trae soporte nativo
   para el variante `starting:` (mapea a `@starting-style`) sin necesitar
   la sintaxis arbitraria `[@starting-style]:` — más corto, mismo
   resultado, verificado contra el `lib.js` compilado del paquete.
