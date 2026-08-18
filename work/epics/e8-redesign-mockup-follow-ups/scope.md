# Epic e8: Redesign mockup follow-ups — Scope

## Objective

Cerrar las tres piezas del mockup importado a mitad de E7 que se
diferenciaron a propósito: navegación en una sola fila flotante, un
catálogo de Fichas organizado por categoría y no por lista plana, y una
forma de responder el test sin escribir.

**Value:** menos fricción para estudiar desde el celular en las tres
superficies que más se usan — encontrar un hueso, entrar a su ficha, y
practicar reconocerlo.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e8.1 | Navbar flotante en Explorar | S | Logo, pestañas y menú se unen en una sola fila flotante sobre el lienzo; se retira la cabecera sólida separada que e7.1 dejó. |
| e8.2 | Acordeón de Fichas | S | La pestaña Fichas pasa de lista plana de 10 regiones a acordeón categoría → subgrupo → grilla de etiquetas (ADR-011). |
| e8.3 | Distractores plausibles | XS | Función de dominio pura que elige 2 opciones incorrectas por hueso, del mismo `region`, con sorteo inyectable — sin UI todavía. |
| e8.4 | Opción múltiple como formato primario del test | M | `TestQuestion` pasa a responder con 3 botones por defecto (usa e8.3); el formato escrito queda en el código, sin botón que lo active (ADR-012); guardrail nuevo que reemplaza, para este modo, el alcance de `must-data-003`. |

## In scope

- **MUST:** las cuatro historias completas y verificadas a mano en
  dispositivo real, igual que e7.9 exigió para su propio cierre.
- **MUST:** ADR-011 y ADR-012 aceptados antes de implementar las historias
  que gobiernan (e8.2 y e8.4 respectivamente).
- **MUST:** el guardrail nuevo del formato de opción múltiple
  (`must-data-010`, ver ADR-012) agregado a `governance/guardrails.md` por
  la propia historia e8.4, con su prueba.
- **SHOULD:** `governance/prd.md` (`RF-06`) gana una nota (no una reescritura)
  aclarando que la respuesta escrita sigue construida pero ya no es el
  formato por defecto — hallazgo para `epic-review`, no tarea de una
  historia.

## Out of scope

- El toggle Escribir/Opciones del mockup — **no ahora**: el usuario decidió
  que opción múltiple es el único formato alcanzable desde la interfaz;
  el escrito queda oculto, no ofrecido como alternativa. Si una épica
  futura lo retoma, ADR-012 ya deja el camino documentado.
- El pulido visual aparcado al cierre de E7 (cohesión del recorrido
  completo, marcador "▸" faltante en filas de par colapsado) — **no
  ahora**: es una entrada distinta del parking lot, sin relación con las
  cuatro historias de esta épica.
- Cualquier cambio a la persistencia de progreso o a la selección
  ponderada de preguntas (`RF-09`, ADR-005) — **no ahora**: e8.3/e8.4 usan
  `pickTestableBone` tal cual existe, no lo modifican.

## Done when

- Las cuatro historias completas, con retrospectiva cada una.
- Un recorrido continuo en celular real —Explorar con la navbar nueva,
  Fichas por acordeón, un test respondido por opción múltiple— sin
  regresión de accesibilidad (`Tab`, `must-a11y-005`) ni del guardrail de
  rendimiento (`should-perf-007`).
- `TestQuestion.test.tsx` (el test de `must-data-003`) sigue en verde sin
  modificarse — la prueba de que el flujo escrito no se rompió al
  ocultarse.
- `epic-review` re-verifica este scope ítem por ítem contra el código, como
  en E7.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| El criterio "mismo `region`" para distractores da opciones poco plausibles en regiones con pocos huesos preguntables (p. ej. `hyoid`, 1 hueso) | M | M | e8.3 decide y testea explícitamente el caso límite: menos de 2 huesos preguntables en la región del hueso preguntado — documentar la resolución (ampliar a categoría, o excluir el hueso del sorteo de opción múltiple) en el propio diseño de la historia, no descubrirla en implementación. |
| Ocultar el formato escrito sin borrarlo deja código sin dueño visible; alguien lo borra por "no usado" en una limpieza futura | B | M | El comentario del componente (igual que ADR-010 hizo con `sr-only`) cita ADR-012 explícitamente, y el test de `must-data-003` sigue corriendo — una limpieza que lo borre rompe el gate, no pasa desapercibida. |
| `governance/prd.md` (RF-06) queda describiendo un comportamiento que ya no es el por defecto, y una lectura futura del PRD asume que sigue siéndolo | B | B | Nota explícita en RF-06 (in scope, SHOULD) al cerrar e8.4 o en epic-review. |
