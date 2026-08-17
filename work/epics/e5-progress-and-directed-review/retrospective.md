# Epic e5: Progreso y repaso dirigido — Retrospective

## Summary

El error del estudiante dirige su estudio. La aplicación recuerda por hueso
cuántas veces se acertó y cuántas se falló, conserva ese registro entre
sesiones en el navegador sin cuenta de usuario, y lo usa para decidir qué
preguntar: lo fallado sale mucho más seguido, y el catálogo entero sigue
alcanzable. `RF-09` queda cumplido, y con él el último requisito funcional del
backlog antes del catálogo completo (E6).

De paso, `must-privacy-006` deja de ser una promesa escrita y pasa a ser un
gate que se ha visto ponerse rojo.

## Metrics

- Stories: 5 · Estimado: S, M, M, M, S · Actual: S, M, **S-M**, M, S
- La única desviación de talla fue e5.3 a la baja: el riesgo que el plan de la
  épica le había asignado —la plomería del estado— se disolvió al leer el
  código.
- Tests: 151 → **187** (+36). Cinco módulos nuevos o modificados en producción.
- Defectos encontrados en review, no en gate: **1** (el objeto compartido de
  `boneProgress`, e5.1).
- Tests huérfanos encontrados: **1** (la firma vieja de `pickTestableBone`,
  e5.4).
- ADRs: 2 (ADR-004 almacenamiento, ADR-005 selección). Ninguno superseded — la
  medición de e5.1 confirmó la premisa de tamaño de ADR-004.
- Entradas al parking lot: 2 al diseñar, 1 al revisar.

## Scope verification

Cada compromiso del `scope.md`, releído contra el código:

**In scope · MUST**

- *El registro por hueso, como dato puro y probable sin navegador* →
  **Fulfilled**. `src/domain/progress.ts`, 11 tests, sin importar nada de React
  ni del DOM ni del almacenamiento.
- *Su persistencia entre sesiones, con el observable literal de `RF-09`* →
  **Fulfilled**. `src/storage/progress-store.ts` (ADR-004) y la verificación en
  Chromium de e5.3 T4: responder, recargar, el registro sigue ahí.
- *El registro alimentado por ambas variantes de test* → **Fulfilled**, y sin
  código que las coordine: las dos montan el mismo `TestQuestion`. Comprobado
  en navegador — el registro final tenía un hueso respondido en cada variante.
- *La selección ponderada por ese registro* → **Fulfilled**. `pickTestableBone`
  con pesos y sorteo inyectado (ADR-005); medido en la aplicación real: el
  hueso sembrado se llevó 10 de 50 preguntas contra una cuota uniforme de 0,25,
  y aun así salieron 32 huesos distintos.
- *La comprobación automática de `must-privacy-006`* → **Fulfilled**, en dos
  ángulos (`tests/privacy.test.ts`, `tests/privacy-runtime.test.tsx`), y
  demostrada rompiéndose con un defecto real en cada uno.

**In scope · SHOULD**

- *Degradación silenciosa pero no engañosa cuando el almacenamiento no está
  disponible* → **Fulfilled**. La caché en memoria de `createProgressStore`
  mantiene la sesión coherente, se antepone a la lectura tras un fallo de
  escritura, y nada en la interfaz afirma haber guardado nada — porque nada
  muestra el progreso.

**Done when**

- *Registro que sobrevive a la recarga, verificado en navegador real* →
  **Fulfilled** (e5.3 T4, salida copiada en su `progress.md`).
- *El fallado sale con más frecuencia, con prueba determinista y sorteo
  inyectado* → **Fulfilled** (e5.4, `src/domain/quiz.test.ts`).
- *Ambas variantes al mismo registro* → **Fulfilled**.
- *`./scripts/check` falla ante una petición de red en tiempo de ejecución* →
  **Fulfilled**, demostrado.
- *All stories complete · docs updated · retrospective done* → historias
  completas y reportadas `done` en el `plan.md`; la documentación de
  desarrollador la genera `epic-close`; esta retrospectiva es la parte que
  falta.

**Compromisos de eliminación:** ninguno. El `scope.md` no prometía quitar,
reemplazar ni consolidar nada — la épica es aditiva sobre dos puntos de
extensión que E4 dejó preparados a propósito.

## Quality review at epic scope

Lo que solo se ve mirando el rango entero, no historia por historia:

- **Dos aserciones de tipo (`as`) que ninguna historia vio como problema.**
  `progress-store.ts` estrechaba con `as Record<string, unknown>` dentro de su
  guarda de tipo. Cada historia lo habría dado por normal; a escala de épica se
  ve contra `must-type-004`, que prohíbe usar `as` para callar al compilador.
  Reescrito con narrowing por `in`, que además lee mejor. `refactor(storage):
  narrow with 'in' instead of a type assertion`.
- **Auditoría de la tabla de guardrails**, disparada por el hallazgo de e5.5.
  `must-test-001` y `must-data-002` **sí** están verificados sustantivamente
  (15 tests de validación con tildes, ñ, mayúsculas y cadena vacía; integridad
  del catálogo con las 206 entradas). `must-data-003` y `must-a11y-005`
  también. El único hueco real era `must-privacy-006`, y era de esta épica.
  Queda uno menor, aparcado.
- **La costura dominio ↔ almacenamiento ↔ React se sostiene.** Ningún módulo de
  `src/domain/` importa `src/storage/`; la única aparición de la palabra es un
  comentario que explica la dirección. La suite de navegador pasa entera sobre
  la aplicación con E5 dentro.

## What went well

- **La épica se apoyó en puntos de extensión que E4 había dejado a propósito**,
  no en refactors. El comentario de `pickTestableBone` decía literalmente dónde
  encajaba `RF-09`, y el único `responder()` de `TestQuestion` hizo que
  instrumentar un punto cubriera `RF-04` y `RF-05` a la vez. Un diseño anterior
  se cobró aquí, sin que nadie tuviera que recordarlo.
- **Los ADRs decidieron antes de que hubiera código que defender**, y las dos
  decisiones aguantaron sin superseder. La de almacenamiento se confirmó con
  una medición (9,6 KB para los 206 huesos, 0,19 % del límite) en vez de con
  una intuición.
- **Cada historia midió lo que afirmaba.** El tamaño del registro, el sesgo de
  la selección, la supervivencia a la recarga, el gate poniéndose rojo: todo
  con su número o su salida copiada. Ninguna afirmación de la épica descansa en
  "debería funcionar".
- **Los aprendizajes viajaron entre historias dentro de la misma épica.** El
  corte de tareas inseparable se aprendió en e5.2, se repitió en e5.3, y en
  e5.4 el plan ya lo traía resuelto por escrito. Es la primera vez en este
  proyecto que una retrospectiva cambia el plan siguiente en el mismo ciclo.

## What to improve

- **Committeé una vez con el gate en rojo** (e5.2), por encadenar la
  comprobación y el commit en la misma tanda de comandos. Escribí la corrección
  en la retrospectiva de e5.2 y **volví a hacerlo en e5.3**, donde salió bien
  por suerte. Una corrección que no cambia la mecánica no es una corrección: la
  regla operativa es que el gate y el commit nunca van juntos.
- **El plan de la épica dio por riesgoso lo que no lo era.** El riesgo número
  uno era la plomería del estado de e5.3, y se evaporó al leer el código: como
  el progreso no se renderiza, no hay estado que levantar. Los riesgos de un
  plan de épica se escriben antes de leer el código de cada historia, así que
  merecen revisarse en el diseño de la historia y no arrastrarse hasta la
  implementación.
- **Dos de mis sondas manuales midieron mal antes de medir bien**: una con un
  regex que casaba "Incorrect" dentro de "Incorrecto", otra buscando en el DOM
  un atributo que solo existe en los dobles de test. Las dos se resolvieron
  imprimiendo el estado crudo en vez de confiar en un booleano. Una comprobación
  que solo dice sí/no no permite distinguir un hallazgo de un error de la
  comprobación.

## Learned

1. **About the system:** la arquitectura de un dato la decide quién lo dibuja,
   no quién lo comparte. El progreso tiene que sobrevivir a desmontajes y
   recargas, lo que sugería estado elevado y plomería; pero como **nada lo
   renderiza**, no es estado de interfaz sino una dependencia, y fluye como
   fluye `catalog`. Toda la complejidad anticipada desapareció con esa
   pregunta. A escala de épica también quedó claro que las capas puras de
   `src/domain/` siguen pagando: `progress.ts` se escribió sin conocer el
   almacenamiento y por eso `quiz.ts` pudo consumirlo sin arrastrar nada.

2. **About the process:** el compilador protege al hacer una firma **más
   estricta** y no al aflojarla. Añadir una prop requerida a `TestQuestion`
   (e5.3) convirtió el trabajo pendiente en dos errores de compilación
   inmediatos; cambiar `pickTestableBone` a un objeto de opciones todo-opcional
   (e5.4) dejó a un test viejo compilando y fallando en ejecución. Cuando la
   firma nueva es permisiva, el chequeo de tests huérfanos deja de ser trámite
   y pasa a ser la única red.

3. **Capability gained:** el proyecto tiene su primera capa de persistencia,
   con la dirección de la dependencia verificada y el camino de fallo probado;
   tiene una regla de selección pura, determinista de probar y ajustable sin
   romper la suite; y tiene `must-privacy-006` exigible en cada commit, con la
   demostración de que atrapa el defecto guardada. Quien añada telemetría en el
   futuro verá el gate rojo con el nombre del archivo en segundos.

## Finding for the parking lot

`should-perf-007` declara "medición manual con throttling en DevTools antes de
cerrar el epic de visualización". E2 está cerrada y **no hay rastro de esa
medición** en sus artefactos. Es un `should`, no bloquea nada, y no es trabajo
de E5 — pero es el mismo patrón que e5.5 encontró en `must-privacy-006`: una
columna de verificación rellena parece verificada.
