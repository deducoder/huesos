# Epic e9: Pulido de uso real — Retrospective

## Summary

E9 partió de nueve roces observados usando la aplicación en la mano —no de
un mockup, a diferencia de E7 y E8— y los siete historias los cerraron sin
inventar alcance nuevo: el «atrás» del sistema recorre la app en vez de
abandonarla (e9.6, ADR-013), el hueso aislado entra entero y gira con el
dedo (e9.3), el test de esqueleto acerca la cámara a lo que pregunta (e9.4),
los 206 nombres se acortan sin colisionar entre sí (e9.5, ADR-014/ADR-015),
el color de selección se ve igual en el navegador, la ficha y el resaltado
3D (e9.1), el resultado del test señala la respuesta correcta (e9.2), y la
cabecera de la ficha se redondea mientras el menú deja de ser decorativo y
cierra el incumplimiento de licencia que motivó parte de la épica: la
atribución de BodyParts3D y su licencia CC BY-SA 4.0 ahora se leen desde la
interfaz (e9.7, ADR-016).

`./scripts/check` verde (346 tests) y `./scripts/check-integration` verde
(32 de 32, `should-perf-007` mediana 4,0 ms) al cierre.

## Metrics

- Stories: 7 (todas planificadas) · Estimadas: M+M+L+S+M+M+M · Reales: la
  única que se movió de tamaño fue e9.7 (M → L, por dos hallazgos reales de
  su propia verificación manual).
- ADRs nuevos: 4 (ADR-013, ADR-014, ADR-015, ADR-016).
- 113 commits, 9 merges.
- Lo no planificado: un checkpoint E2E completo a mitad de épica (entre
  e9.4 y e9.7, milestone del propio `plan.md`) que encontró cero hallazgos
  nuevos —confirmó que las seis historias mergeadas juntas no rompían
  nada entre sí—; dos tareas nuevas en e9.7 (T6, T7) nacidas de su propia
  verificación manual; dos fixes de defectos ajenos encontrados al correr
  el gate de otra historia y arreglados directamente en `main` (e9.1
  arregló uno de e9.5; e9.7 arregló uno de e9.2) — el mismo patrón, dos
  veces, sin que ninguna historia tuviera que reabrirse para absorberlo.

## Scope verification

Cada compromiso del `scope.md` de la épica, releído contra el código real:

- **MUST: los nueve puntos observados, repartidos en las siete historias**
  → **Cumplido**. Las siete `done` en la tabla de progreso de `plan.md`,
  cada una con su propia reproducción documentada en `scope.md` antes de
  tocarla, y el checkpoint E2E de mitad de épica —más el recorrido manual
  final de e9.7 T5— confirmaron el recorrido completo sin ninguno.
- **MUST: la atribución del modelo alcanzable desde la interfaz, junto al
  aviso de privacidad** → **Cumplido**. `AboutPanel` (e9.7) muestra la
  fórmula literal exacta, el enlace a CC BY-SA 4.0, y el aviso de
  privacidad que `must-privacy-006`/RF-09 ya garantizaba técnicamente.
- **MUST: un gate que impida que el acortado de nombres colapse dos huesos
  de la misma región en la misma etiqueta** → **Cumplido**.
  `bone-name.test.ts` corre sobre el catálogo real de 206 huesos
  deduplicado por nombre completo, con un techo de longitud y una
  aserción específica de que las 28 falanges siguen teniendo 28 nombres
  cortos distintos entre sí.
- **SHOULD: `onViewDetail`/`onCambiarModo` requeridas, no opcionales** →
  **Cumplido**. Ningún llamador las declara con `?` en la firma; e9.2 lo
  hizo al entrar a `src/features/test/`, con disparador explícito desde
  el parking lot de E8.
- **SHOULD: la advertencia de exactitud en el mismo panel que los
  créditos** → **Cumplido**. Misma sección de `AboutPanel` que la
  atribución (e9.7).
- **Done when: recorrido completo en el teléfono sin ninguno de los nueve
  roces** → **Cumplido**. Checkpoint E2E completo a mitad de épica más
  verificación manual en cada historia.
- **Done when: el «atrás» del sistema vuelve de la ficha a su origen y de
  una variante de test a la elección de variante, sin abandonar el sitio**
  → **Cumplido**. e9.6 (ADR-013), verificado con `page.goBack()` en
  Playwright y a mano en el dispositivo.
- **Done when: ningún nombre visible pasa el techo, las 28 falanges siguen
  distintas — afirmado por un gate** → **Cumplido**, ver el MUST de
  unicidad arriba.
- **Done when: el hueso más ancho y el más chico entran enteros en el
  lienzo de la ficha** → **Cumplido**. e9.3; verificado en
  `check-integration` (`un hueso ancho entra entero en el lienzo de la
  ficha`, `el hueso más chico del modelo se sigue viendo`).
- **Done when: la atribución literal y la licencia se pueden leer desde la
  interfaz sin abrir el repositorio** → **Cumplido**. e9.7.
- **Done when: todas las historias cerradas · `docs.md` publicado ·
  retrospectiva hecha** → **Cumplido en dos tercios, el resto es el
  siguiente paso.** Las siete cerradas; esta retrospectiva es este
  documento; `docs.md` es responsabilidad de `epic-close`, que sigue a
  esta revisión — no un compromiso incumplido, uno todavía no alcanzado
  en el orden del propio método.

Sin compromisos de eliminación en el scope de esta épica.

## What went well

- **El checkpoint E2E de mitad de épica hizo exactamente lo que el `plan.md`
  predijo.** Su razón declarada era que e9.6 y e9.3 producen comportamiento
  que ninguna prueba unitaria observa, y que e9.5 cruza cuatro componentes
  que ninguna historia toca a la vez — y dio 32 de 32 sin hallazgos nuevos,
  confirmando que seis historias mergeadas juntas por primera vez no
  rompían nada entre sí. Ese resultado negativo tiene valor: la costura
  entre historias no fue donde aparecieron los defectos reales de esta
  épica.
- **Los defectos ajenos encontrados a mitad de otra historia se apartaron a
  `main` en vez de contaminar la rama en curso**, dos veces (e9.1 sobre un
  bug de e9.5; e9.7 sobre un bug de e9.2), con el mismo mecanismo
  git las dos veces: stash/switch/commit directo/merge de vuelta. Un
  patrón que ya no hace falta redescubrir historia por historia.
- **Cada hallazgo de verificación manual —seis en total repartidos entre
  e9.3, e9.4 y e9.7— se investigó con el mismo rigor que un hallazgo de
  código**: reproducción antes de teorizar, instrumentación cuando hizo
  falta, mutación forzada después del fix. Ninguno se aceptó como
  "intermitente" sin una causa nombrada.

## What to improve

- **El design de e9.7 ya nombraba una decisión ADR-worthy (overlay propio
  vs. `<dialog>` nativo, con alternativas rechazadas y una razón
  verificada empíricamente) y el ADR no se escribió hasta el
  `quality-review` de cierre de esa historia.** Cumplía el criterio del
  método sin ambigüedad desde el diseño. Mejora de proceso, ya registrada
  en memoria: escribir el ADR en la fase de diseño cuando `design.md` ya
  declara la decisión, no esperar a la revisión.
- **La interacción entre una capa deliberadamente ajena al historial (el
  panel de e9.7) y una navegación real del sistema no se pensó en el
  diseño.** El panel no es un `Modo` a propósito —correcto—, pero eso lo
  dejó sin dueño ante un «atrás» real hasta que la verificación manual lo
  encontró. Ninguna historia anterior de la épica había introducido una
  capa de UI fuera del par `Modo`/`navegar`, así que no había precedente
  que preguntara "¿qué le pasa a esto ante una navegación que no
  controla?" — la pregunta vale para cualquier futura capa similar.
- **`git checkout`/`restore` sobre trabajo sin commitear no es un
  "deshacer la última mutación", es "volver al último commit".** Un
  intento de mutación forzada en e9.7 T3 borró una tarea entera todavía
  sin commitear. Sin pérdida real —detectado y rehecho de inmediato—,
  pero evitable: commitear el GREEN antes de mutar para verificar una
  propiedad, siempre que la mutación se vaya a revertir con git.

## Learned

1. **About the system:** las capas de UI que viven deliberadamente fuera
   del selector de modo (ADR-013) —el panel de e9.7 es la primera— no
   heredan gratis la sincronía con la navegación real del sistema; alguien
   tiene que declararla a propósito. Es la misma clase de costura que
   `updateMatrixWorld` en e9.4: un mecanismo correcto en su propio término
   que necesita que alguien nombre explícitamente su relación con el
   mecanismo vecino.
2. **About the process:** un checkpoint E2E a mitad de épica, colocado en
   el punto donde el riesgo de regresión cruzada es más alto (después de
   las historias que tocan mecanismos nuevos —History API, cámara
   controlada—, antes de la que vuelve sobre el mismo archivo que todas
   comparten), vale su costo incluso cuando no encuentra nada: confirma
   que la ausencia de hallazgos es real, no una suite que no estaba
   mirando.
3. **Capability gained:** un patrón reutilizable de overlay modal
   (`role="dialog"` propio, foco por `useEffect`/`useRef`, `Escape` por
   `keydown`, backdrop por `onClick`), documentado en ADR-016, disponible
   para el próximo panel sin reabrir la pregunta de `<dialog>` nativo bajo
   la versión de jsdom que el proyecto fija. Y la aplicación cierra, con
   e9.7, el único incumplimiento de licencia que la épica traía: la
   atribución de BodyParts3D deja de vivir solo en el repositorio.
