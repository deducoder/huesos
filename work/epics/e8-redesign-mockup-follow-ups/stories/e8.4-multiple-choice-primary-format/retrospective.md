# Story e8.4: Multiple choice as primary test format — Retrospective

Estimated: M (3-5 tareas) · Actual: 5 tareas (T1, T2, T3, T4 + el fix de
`quality-review`)

## Summary

`TestQuestion` responde por defecto con 3 opciones (`answerFormat`
default `'choice'`), usando `pickDistractors` (e8.3). El formato escrito
sigue en el componente, alcanzable solo con `answerFormat="open"`
explícito — nunca desde un botón. `must-data-010` documentado en
`governance/guardrails.md`; `must-data-003` intacto. 255 tests en el gate
rápido, 21/21 en la suite de integración completa.

## What went well

- ADR-012 (escrito en `epic-design`, antes de tocar código) predijo con
  precisión la tensión real con `must-data-003` y la resolvió por
  adelantado — implementar la historia fue seguir una decisión ya tomada,
  no descubrirla a mitad de camino.
- La técnica de mutación forzada, ya rutina desde e8.3, se aplicó cuatro
  veces (T1, T2, y las dos correcciones de texto de T3) sin fricción —
  dejó de ser un paso extra y pasó a ser cómo se verifica cualquier test
  que pasa sin RED real.

## What to improve

- **Corrí `./scripts/check-integration` fuera de su fase declarada** (el
  método la reserva para `gemba:integrate`, no por tarea) porque un grep
  manual sobre `e2e/` encontró que dos specs de Playwright dependían del
  `<form>` del formato escrito. Fue la decisión correcta —dejar un gate
  que ya sabía roto para que otra fase lo descubra sin este contexto
  hubiera sido peor—, pero expone un hueco real: **nada en el plan de la
  historia miraba `e2e/` a propósito**, ni siquiera como paso de
  verificación manual. Un cambio que toca el DOM por defecto de un
  componente ampliamente usado (`TestQuestion` lo monta la app entera en
  modo test) necesita ese grep como parte del diseño o del plan, no como
  ocurrencia a mitad de T4.
- **Until construido, la primera corrida de `check-integration` dio un
  falso positivo** por servidores `vite preview` obsoletos (uno de horas
  antes de esta sesión) que `reuseExistingServer` reutilizó en vez de
  reconstruir. Mismo patrón que la memoria "un servidor levantado a mano
  envenena la suite" — la diferencia es que esta vez ni siquiera lo había
  levantado yo a mano en esta tarea: era residuo de un momento anterior
  de la sesión (el manual-check de T4) que no maté correctamente la
  primera vez (maté el PID del shell, no el del proceso real de vite).
- **`aria-pressed` en tres botones mutuamente excluyentes** replica el
  patrón que `BoneNavigator` ya usa, pero técnicamente `radiogroup`/`radio`
  sería más preciso para "elegir una de tres". No lo cambié — es
  consistencia con lo que el codebase ya hace en la única otra
  superficie comparable —, pero si aparece una tercera superficie de
  selección única, vale la pena decidir el patrón canónico en un ADR en
  vez de seguir replicando `aria-pressed` por inercia.

## Learned

1. **Sobre el sistema:** `reuseExistingServer: !process.env.CI` en
   `playwright.config.ts` significa que **cualquier** proceso vivo en el
   puerto de la suite de integración —levantado por mí, por otra sesión,
   o sobrante de horas antes— se sirve tal cual, sin reconstruir. Antes
   de confiar en un resultado de `check-integration`, verificar que no
   hay un `vite preview` colgado (`ps aux | grep vite`), no solo correr
   el comando.
2. **Sobre el proceso:** cambiar el *formato por defecto* de un
   componente compartido tiene radio de impacto en capas que
   `./scripts/check` no cubre (aquí, Playwright/e2e). Un plan que cambia
   un contrato de UI muy reutilizado debería nombrar explícitamente "grep
   `e2e/` por el DOM viejo" como tarea, no confiar en que aparezca solo.
3. **Capacidad ganada:** levantar un `vite preview` propio + Playwright
   ad hoc para una verificación manual de una historia de UI (sin
   depender de que exista ya un spec `.spec.ts` committeado) es un
   patrón reutilizable para cualquier historia futura que no amerite un
   e2e permanente pero sí necesite verse en un navegador real.
