# Epic e4: Motor de test — Retrospective

## Summary

Un estudiante responde por escrito a una pregunta sobre un hueso —señalado
en el esqueleto completo o aislado, sin etiqueta— y recibe corrección
explícita con ambas nomenclaturas si se equivoca. `RF-04` a `RF-07`
completos y alcanzables desde el arranque de la aplicación (pestaña
"Test"). `must-data-003` —declarado en `governance/guardrails.md` desde
antes de esta épica y nunca implementado— tiene ahora pruebas reales en el
gate rápido, que además atraparon dos fugas reales durante la propia
construcción.

## Metrics

- Stories: 5 · Estimated: S+M+S+S+S · Actual: S+M+S+XS+S — todas dentro de
  su tamaño estimado o por debajo, ninguna se disparó.
- 44 commits en el rango de la épica · 0 ADR (el diseño no encontró una
  decisión con múltiples opciones reales — ver `design.md`).
- 4 correcciones de calidad reales encontradas y arregladas en el camino:
  un bug de normalización (`ñ` tratada como tilde, e4.1), un texto de
  accesibilidad heredado y engañoso (e4.2), y **dos** en `IsolatedBoneScene`
  el mismo día (e4.4): una fuga real de `must-data-003` por `aria-label` y
  huesos diminutos invisibles por recorte de cámara.
- 1 componente descartado por gemba antes de construirse (e3.3,
  épica anterior — mencionado acá porque el mismo patrón se repitió: el
  diseño de e4 no propuso ningún componente que luego resultara
  innecesario, en parte porque `design.md` ya venía de haber aprendido esa
  lección en e3).

## Scope verification

- Las cinco historias completas → **Fulfilled** (`plan.md`, las cinco
  `done`).
- Validación tolerante completa de `RF-06` → **Fulfilled**
  (`src/domain/answer-check.ts`, e4.1) — con el hallazgo real de la "ñ"
  corregido antes de cerrar la historia, no después.
- Pregunta sobre esqueleto completo y sobre hueso aislado, sin etiqueta
  antes de responder → **Fulfilled** (`SkeletonTestView`/`BoneTestView`,
  e4.2/e4.4).
- Corrección explícita (`RF-07`) → **Fulfilled** (`TestQuestion`, e4.3).
- La prueba dedicada de `must-data-003` → **Fulfilled**, con una
  particularidad que vale la pena registrar: el "Done when" de la épica
  pedía verificarla "reintroduciendo el fallo a propósito". Eso no se hizo
  como ejercicio deliberado — ocurrió de verdad: `IsolatedBoneScene`
  filtraba el nombre por `aria-label` en e4.4, la prueba de
  `must-data-003` (con un doble que reproduce el cálculo real, no uno
  inventado) lo atrapó en RED antes del fix (commit `0327f42`). Evidencia
  más fuerte que un ejercicio sintético.
- Fuera de alcance (registro de resultados, priorización por fallos,
  `system-design.md`) → **Descoped**, sin tocar, tal como se declaró.

## What went well

- El patrón de las tres retrospectivas de historia con hallazgo real
  (e4.1, e4.2, e4.4) se sostuvo sin excepción: cada uno se investigó,
  arregló y documentó en la propia historia, ninguno se aplazó ni se
  acumuló para el cierre de la épica.
- `TestQuestion` (e4.2) se diseñó bien la primera vez: e4.4 lo reutilizó
  sin tocarlo, confirmando en la práctica el riesgo que `scope.md` había
  anotado ("la interfaz podría resultar forzada") como no materializado.

## What to improve

- Dos defectos reales en el mismo componente (`IsolatedBoneScene`) el mismo
  día (e4.4), ninguno relacionado con el otro. Confirma la lección de
  `manual-verification-keeps-finding-real-things`: verificar a mano no es
  una pregunta, son varias — y esta épica es la segunda vez que un
  componente WebGL construido en una épica anterior (e3.1) revela un
  defecto recién cuando una épica posterior lo somete a un caso de uso
  distinto. Vale la pena, la próxima vez que una épica reutilice un
  componente de una épica anterior sin modificarlo, no asumir que
  "reutilizar sin tocar" es sinónimo de "sin riesgo".

## Learned

1. **About the system, a esta escala:** los tres componentes de dominio
   puro construidos en épicas distintas (`mesh-lookup` en E2,
   `isolation` en E3, `answer-check`+`quiz` en E4) nunca se pisaron ni
   duplicaron lógica entre sí — la separación dominio/vista de ADR-002
   sostuvo cuatro épicas sin necesitar una revisión.
2. **About the process:** una épica que reutiliza componentes de dos
   épicas anteriores sin ADR propio (0 en e4) no es una épica "sin
   decisiones" — las decisiones ya se tomaron antes y siguen pagando. El
   costo de no necesitar un ADR nuevo es la prueba de que las anteriores
   fueron buenas.
3. **Capability gained:** el patrón `renderScene: (id) => ReactNode` +
   estado elevado con `origen` (de e3, reusado en e4 vía `TestQuestion`) es
   ahora un patrón probado dos épicas seguidas para "un flujo compartido
   sobre presentaciones intercambiables" — candidato natural si E5 necesita
   una tercera variante de presentación sobre el mismo flujo de pregunta.
