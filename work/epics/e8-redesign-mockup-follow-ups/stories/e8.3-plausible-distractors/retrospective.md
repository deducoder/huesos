# Story e8.3: Plausible distractors — Retrospective

Estimated: XS (1-2 tareas) · Actual: 4 tareas (T1, T2, T2b, T3)

## Summary

`pickDistractors(bone, catalog, opciones?)`: 2 opciones incorrectas
plausibles por hueso preguntado, priorizando la misma región y
completando desde el resto del catálogo cuando la región no alcanza
(`pelvic-girdle`), sin repetir nunca al hueso preguntado ni a su hermano
anatómico, ni dejar que dos distractores sean hermanos entre sí. 11 tests,
gate en verde (246 tests totales).

## What went well

- El caso límite de `pelvic-girdle` (riesgo nombrado explícitamente desde
  `scope.md` de la épica) se cerró exactamente donde el plan decía que se
  cerraría — T2, no descubierto tarde.
- La técnica de mutación forzada (memoria existente: "una comprobación
  necesita comprobar que miró") atrapó dos veces que un test era
  decorativo: el `toThrow()` sin argumento del catálogo insuficiente no
  distinguía el guard explícito del `throw` genérico interno de
  `extraerAlAzar` — sin la mutación habría quedado un test verde que no
  protegía nada.
- El hallazgo real (etiquetas duplicadas por hermanos anatómicos) se
  resolvió dentro de la misma historia, con su propio ciclo TDD, en vez de
  aparcarse — la corrección quedó testeada, no solo anotada.

## What to improve

- **El GREEN de T1 se adelantó al plan:** implementé el relleno
  cross-región y el guard de catálogo insuficiente (alcance de T2) en el
  mismo commit que el caso típico, en vez de la versión mínima. T2 quedó
  sin un RED real — sus tests pasaron en verde apenas se escribieron, y
  tuve que sustituir la ausencia de RED por mutación forzada retroactiva.
  Funcionó, pero es un parche sobre una disciplina rota, no lo mismo que
  seguirla.
- **Los fixtures de T1/T2 eligieron la región más cómoda, no la que más
  estresaba la regla.** `femur-right` (lower-limb, 60 huesos) y
  `hip-bone-right` (pelvic-girdle, el caso límite de conteo *que ya estaba
  identificado*) no tocaban el problema real: una región pequeña y
  **pareada** (`shoulder-girdle`, 4 huesos = 2 pares). El bug de hermanos
  duplicados no se vio hasta la verificación manual (T3) porque ningún
  test unitario había elegido un hueso de una región chica y pareada. Si
  T1/T2 hubieran incluido `clavicle-right` desde el principio, las mismas
  200 iteraciones que ya corrían por test lo habrían atrapado sin
  necesitar T3 para descubrirlo — T3 lo confirmó, pero no tendría que
  haber sido quien lo *encontrara*.
- **Hallazgo de quality-review, dejado pendiente a propósito:** el guard
  `preguntables.length < count` no contempla que la exclusión de hermanos
  *dentro* del bucle puede consumir el pool más rápido que `count`. Con
  `count=2` (el único valor que cualquier llamador usa hoy) es
  inalcanzable; con un `count` mayor dejaría de lanzar el error explícito
  y lanzaría el genérico interno de `extraerAlAzar`. No lo arreglé —
  agregar una validación para un caso que ningún llamador real produce
  hoy sería la sobre-ingeniería que el propio método pide evitar— pero
  queda escrito para que e8.4 (o quien parametrice `count` después) no lo
  redescubra desde cero.

## Learned

1. **Sobre el sistema:** el nombre en español (`es`) del catálogo nunca
   lleva el lado — es una decisión de datos de e1, no un bug de esta
   historia — así que cualquier función o vista nueva que muestre `es` a
   solas (sin pasar por `accessibleName`-style helpers que agregan el
   lado) puede volver a chocar con dos huesos indistinguibles por texto.
   Vale para e8.4 y para cualquier historia futura que renderice nombres
   de huesos sueltos.
2. **Sobre el proceso:** al elegir el hueso de ejemplo para un test de
   dominio, elegir el que más estresa la regla (la región más chica y más
   pareada) en vez del más cómodo de escribir habría ahorrado la vuelta
   completa por T3. Es el mismo patrón que "verificar tamaños extremos, no
   solo típicos" ya en memoria, aplicado ahora a la elección de *fixtures*
   de dominio, no solo a tamaños de UI.
3. **Capacidad ganada:** reutilizar `siblingId` (e7.4) fuera del contexto
   original (navegación/accesibilidad) para un problema de dominio
   distinto (plausibilidad de distractores) sin duplicar el criterio —
   la misma función sirvió para "¿es indistinguible?" en dos historias que
   no se planearon juntas.
