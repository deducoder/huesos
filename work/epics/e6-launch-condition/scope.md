# Epic e6: Condición de lanzamiento — Scope

## Objective

Que la condición de lanzamiento del producto sea verdadera y comprobable: que
`RF-08` diga lo que el proyecto decidió, que una prueba lo afirme, y que los
siete huesos sin geometría estén honestamente presentados a quien estudia.

**Value:** desbloquea el lanzamiento. Hoy `RF-08` exige geometría para siete
huesos que el proyecto decidió no cubrir el 2026-08-16, así que la condición no
se puede cumplir por construcción — y nadie lo había notado porque el PRD y las
pruebas afirman cosas distintas.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e6.1 | Absences shown honestly | S | Verificar —y arreglar si hace falta— que los siete sin geometría se presentan bien en toda la aplicación, no solo donde ya se miró |
| e6.2 | Integrity test states the real criterion | S | Una prueba con nombre propio que afirme el criterio de ADR-006, en vez de deducirlo de dos que hablan de 199 y de 7 |
| e6.3 | The PRD says what the project decided | S | `RF-08` y la fila de E6 en el backlog dicen lo decidido; el observable escrito coincide con el que corre |

Dependencias: ninguna entre ellas — las tres tocan zonas distintas (interfaz,
pruebas, gobernanza). Sin ciclos.

## In scope

- **MUST:**
  - Una prueba de integridad que afirme, explícita y en una sola aserción, que
    las 206 entradas tienen **o** geometría **o** razón de ausencia, y ninguna
    ninguna de las dos.
  - `RF-08` reescrito en `governance/prd.md` con el observable que ADR-006
    decide, incluido el matiz de qué significa "completo".
  - La fila de E6 en `governance/backlog.md`, que hoy describe un trabajo de
    contenido ya hecho.
  - La verificación de que un hueso sin geometría se comporta y se explica bien
    en las tres vistas donde puede aparecer.
- **SHOULD:**
  - Que la prueba nueva **sustituya** a las que afirman 199 y 7 por separado si
    quedan redundantes, en vez de sumarse a ellas.

## Out of scope

- **Conseguir geometría para los siete** — no-go del brief, y alternativa (A)
  diferida en ADR-006. **Not now**: es una épica propia el día que aparezca un
  requisito sobre el oído medio.
- **Auditar el resto del PRD y de los guardrails** buscando el mismo desajuste
  — rabbit hole del brief. **Not now**: `should-perf-007` ya está aparcado con
  el mismo síntoma y espera turno.
- **Auditar la calidad del contenido del catálogo** (términos latinos,
  sinónimos contra uso real) — **not now**: deuda reconocida desde la primera
  sesión, descartada explícitamente al elegir el alcance de esta épica.
- **Los 6 huesos sin sinónimos** (`húmero`, `radio`, `tibia`, ambos lados) — se
  midió y no son un hueco: son palabras sin sinónimo real en español. Si alguna
  vez se quiere una lista de sinónimos exhaustiva, va con la auditoría de
  contenido.

## Done when

- `./scripts/check` contiene una prueba que afirma el criterio de ADR-006 y
  falla si una entrada queda sin geometría y sin razón.
- El observable escrito en `RF-08` y el que la prueba ejecuta **dicen lo
  mismo** — comprobable leyéndolos uno al lado del otro.
- Un hueso sin geometría se puede encontrar, leer y entender en la aplicación,
  y en ningún sitio parece un error.
- El backlog no describe E6 como trabajo de contenido pendiente.
- All stories complete · docs updated · retrospective done

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| e6.1 encuentra que un hueso sin geometría **sí** rompe algo en alguna vista, y la épica deja de ser de gobernanza | M | M | Va primera justamente por eso; si aparece un defecto, se arregla ahí con su test de regresión antes de tocar nada más |
| Reescribir `RF-08` se lea como aflojar un requisito para poder lanzar | M | M | ADR-006 escribe las cuatro opciones y por qué se rechazan las otras tres, incluida "no hacer nada"; la decisión queda auditable, no escondida en un diff del PRD |
| La prueba nueva se solape con las existentes y quede una afirmación repetida en dos sitios | M | L | El `SHOULD` del alcance dice sustituir, no sumar; `epic-review` lo verifica |
