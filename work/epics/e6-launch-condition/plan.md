# Epic e6: Condición de lanzamiento — Plan

Versión corta a propósito. `epic-plan` permite saltarse este artefacto en una
épica de 2-3 historias con orden obvio, y ésta lo es: tres historias sin
dependencias entre ellas. Se escribe igual porque `epic-review` y `epic-close`
consultan la tabla de progreso de aquí, y sin ella ese control no tiene dónde
aterrizar.

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e6.1 · Absences shown honestly | risk-first | — | Confirma (o desmiente) que la épica es de gobernanza y no de defectos |
| 2 | e6.2 · Integrity test states the real criterion | — | — | El gate que hace verdadera la condición de lanzamiento |
| 3 | e6.3 · The PRD says what the project decided | — | — | Cierra el desajuste entre lo escrito y lo ejecutado |

**Rationale:** las tres son independientes, así que el orden lo decide el
riesgo y no la dependencia. `e6.1` va primera porque es la única que puede
**cambiar lo que la épica es**: si un hueso sin geometría rompe algo en alguna
vista, esto deja de ser una épica de gobernanza y pasa a tener un defecto
dentro. Barato de descartar, caro de descubrir tarde.

`e6.2` antes que `e6.3` porque la prueba es la versión ejecutable del criterio,
y tener el criterio corriendo hace más fácil escribir el `RF-08` que lo
describe: se redacta mirando la aserción, no al revés.

## Milestones

- [x] **Condición comprobable** — e6.1 + e6.2 — existe una prueba que falla si
      una entrada queda sin geometría y sin razón, y ninguna vista presenta mal
      a los siete ausentes.
- [ ] **Epic complete** — + e6.3 — `RF-08` y su prueba dicen lo mismo, leídos
      uno al lado del otro, y el backlog no describe trabajo ya hecho.

## Parallel streams

Las tres. Ninguna depende de otra y tocan zonas distintas (interfaz, pruebas,
gobernanza). El orden es de riesgo, no de bloqueo.

## Progress

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e6.1 | done | S | S |
| e6.2 | done | S | S |
| e6.3 | todo | S | — |

## Sequencing risks

- **e6.1 encuentra un defecto y la épica cambia de naturaleza.** → Es
  precisamente por lo que va primera; si aparece, se arregla ahí con su test de
  regresión y las otras dos siguen valiendo igual.
- **e6.3 se convierte en una reescritura del PRD entero.** → El brief lo nombra
  como rabbit hole y el alcance lo declara fuera: aquí se toca `RF-08` y la fila
  de E6 del backlog, nada más.
