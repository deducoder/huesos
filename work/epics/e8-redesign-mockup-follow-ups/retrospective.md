# Epic e8: Redesign mockup follow-ups — Retrospective

## Summary

E8 cerró las tres piezas del mockup que E7 se dejó a propósito: la navegación
en una fila agrupada, Fichas como acordeón categoría → subgrupo → grilla, y el
test respondido por opción múltiple con distractores plausibles de la misma
región. Se sumó, a mitad de camino y a pedido del usuario, una quinta historia
informal (e8.5) que no estaba en el plan: al comparar capturas reales contra el
mockup quedó claro que las cuatro historias habían reutilizado el sistema de
diseño de E7 sin medir sus valores contra la referencia, así que la fidelidad
visual era bastante menor de lo que los `scope.md` transmitían.

## Metrics

- Stories: 5 (4 planificadas + 1 informal) · Estimadas: XS + M + M + S · Reales:
  4 + 5 + 4 + 2 tareas, más 18 commits sin decomposición en e8.5.
- ADRs nuevos: 2 (ADR-011, ADR-012) · Guardrails nuevos: 1 (`must-data-010`).
- Suite: 272 unitarios + 21 de integración, todos en verde al cierre.
- Lo no planificado: e8.5 entera; dos specs e2e rotos que e8.4 encontró y
  arregló; un e2e roto que solo apareció en **esta** revisión de épica.

## Scope verification

Cada compromiso, releído contra el código:

- **MUST: las cuatro historias completas y verificadas a mano en dispositivo
  real** → **Cumplido**. Las cuatro `done` en la tabla de progreso de
  `plan.md`, cada una con `retrospective.md`, y cada una dejó al menos un
  hallazgo que solo el navegador real podía dar (e8.1: jsdom sobrecomputa el
  landmark `banner`; e8.4: dos specs e2e rotos).
- **MUST: ADR-011 y ADR-012 aceptados antes de implementar** → **Cumplido**.
  Ambos con `status: accepted` en `records/decisions/`.
- **MUST: `must-data-010` en `governance/guardrails.md` con su prueba** →
  **Cumplido**. Fila 18 de `guardrails.md`, con pruebas en
  `SkeletonTestView.test.tsx` y `BoneTestView.test.tsx`.
- **SHOULD: nota en `governance/prd.md` (RF-06)** → **Cumplido en esta
  revisión**, que es donde el scope lo asignó explícitamente ("hallazgo para
  epic-review, no tarea de una historia").
- **Done when: recorrido continuo sin regresión de `must-a11y-005` ni
  `should-perf-007`** → **Cumplido**. `./scripts/check-integration` en verde,
  21 tests; la latencia de selección con CPU limitada 4x da mediana 4.7 ms
  contra el techo del guardrail.
- **Done when: `TestQuestion.test.tsx` sigue en verde sin modificarse** →
  **Cumplido en la intención, no en la letra.** El archivo *sí* se modificó
  (`61a1302`, `d9f3b34`): a los casos del formato escrito hubo que pasarles
  `answerFormat="open"` porque el valor por defecto cambió, y se le sumaron 6
  casos nuevos para el formato de opción múltiple. Ningún caso existente se
  borró ni se debilitó — verificado línea a línea sobre el diff. El criterio
  estaba mal redactado: no se puede cambiar el formato por defecto y a la vez
  no tocar el archivo que lo ejercita. Lo que el criterio quería decir —«los
  casos del flujo escrito siguen verdes sin relajarse»— se cumple.
- **Done when: `epic-review` re-verifica el scope ítem por ítem** → esto.

Sin compromisos de eliminación en el scope de esta épica.

## What went well

- **La revisión de épica volvió a encontrar lo que ninguna historia podía.**
  Un e2e de e7 (`el lienzo de Explorar ocupa toda la pantalla disponible`)
  medía el espacio libre desde el borde inferior de las pestañas; e8.5 metió 12
  px de aire deliberado bajo la navbar y el test pasó a fallar. Ninguna
  historia lo vio porque `./scripts/check` no corre Playwright. Se midió la
  geometría real antes de tocarlo (cabecera 12→68, lienzo 80→874, hueco = 12 px
  exactos) y se corrigió el instrumento, no el diseño.
- **Los dos ADRs se escribieron antes de implementar, no después.** ADR-011
  evitó que e8.2 tocara `BoneNavigator`, y ADR-012 dejó documentado el camino
  de vuelta del formato escrito antes de ocultarlo.
- **La historia informal no bajó el listón de las comprobaciones.** e8.5 se
  saltó el RED-GREEN por cambio de CSS —decisión explícita— pero corrió
  `./scripts/check` antes de cada uno de sus 18 commits y escribió tests
  propios para lo único que no era CSS.

## What to improve

- **El sistema de color de e8.5 quedó fuera de `@theme`, y el gate que debía
  verlo no lo ve.** `REGION_ACCENT` (20 valores) y `ACENTO_PESTANIA` (3) son
  hex escritos en TypeScript y aplicados con `style={{}}`; ADR-007 declara que
  los tokens de `@theme` son la única fuente del aspecto, y
  `design-tokens.test.ts` solo vigila la paleta de fábrica de Tailwind. Es
  literalmente el mismo agujero que epic-review de E7 encontró con el color del
  3D: **el gate se escribió contra el error conocido, no contra la regla.**
  Además dos de los tres acentos de pestaña duplican valores de
  `REGION_ACCENT` y el tercero (`#e4c64f`) no corresponde a ninguna región.
  → Parking lot: decidir con un ADR si "color por región" es dato de vista
  legítimo (y ampliar el gate para que exija que *todo* color venga de una
  fuente declarada), o migrarlo a `@theme`.
- **Tres props opcionales se acumularon en la misma zona** (`onViewDetail?`,
  `answerFormat?`, `onCambiarModo?`): olvidarlas no rompe nada, solo hace
  desaparecer una función en silencio. Ninguna historia lo vio porque cada una
  agregó la suya. → Parking lot: hacer requeridas las que todos los llamadores
  ya pasan.
- **La fidelidad visual no era un criterio de aceptación de ninguna historia.**
  e8.1-e8.4 declararon "reutiliza los tokens de e7" y las cuatro lo cumplieron;
  el mockup no se abrió en ninguna. Que hiciera falta una quinta historia para
  descubrirlo dice que "se parece a la referencia" tiene que ser un criterio
  observable de la historia, no una impresión que alguien note después.

## Learned

1. **About the system:** el sistema de diseño de este proyecto tiene dos
   fuentes de verdad y solo una está vigilada. `@theme` está cubierto por un
   gate; los colores por región viven en un módulo TypeScript que ningún gate
   mira. Un contrato vigilado a medias se rompe justo por donde no se mira, y
   pasó dos épicas seguidas.
2. **About the process:** un criterio de "Done when" redactado como «el archivo
   X no se modifica» es frágil — describe el medio, no el fin. Al cambiar un
   valor por defecto, el archivo que lo ejercita *tiene* que cambiar. El
   criterio útil habría sido «ningún caso del flujo escrito se borra ni se
   debilita», que es verificable sobre el diff y sobrevive al cambio.
3. **Capability gained:** la aplicación ya no se parece a un prototipo. Las
   tres superficies comparten un lenguaje visual medido contra una referencia
   real (píldoras con borde y sombra dura, un color por región, tarjetas
   flotantes con las mismas medidas en Explorar, Test y la ficha completa), y
   la ficha completa ganó dos campos de contenido —`articulatesWith`,
   `clinicalNote`— que abren la puerta a que el catálogo deje de ser solo
   nomenclatura.
