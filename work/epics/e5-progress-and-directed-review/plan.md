# Epic e5: Progreso y repaso dirigido — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e5.1 · Progress record | dependency | — | Todo lo demás: es la forma del dato que las otras cuatro leen o escriben |
| 2 | e5.2 · Browser persistence | risk-first | e5.1 | e5.3; y resuelve el riesgo de mayor impacto de la épica (`localStorage` que lanza) |
| 3 | e5.3 · Test engine records its verdict | skeleton | e5.1, e5.2 | Cierra el esqueleto andante: el observable literal de `RF-09` queda verificable |
| 4 | e5.4 · Failed-first selection | risk-first | e5.1 | El outcome de la épica — "el fallo dirige el estudio" |
| 5 | e5.5 · Privacy guardrail, actually gated | — | — | El gate de `must-privacy-006`; independiente, va al final por ser el más difícil de probar |

**Rationale:** el orden es dependiente hasta la 3 y de riesgo a partir de ahí,
con una excepción deliberada.

`e5.1` va primero porque es la forma del dato: no es la más riesgosa, pero
todas las demás la leen, y empezar por otra obligaría a inventar el registro
dos veces.

`e5.2` va segunda y no tercera aunque `e5.3` cargue el riesgo *de proceso* más
citable (dónde vive el estado). Es deliberado: **la pregunta de e5.3 la
responde la existencia del almacén**. Si el registro se lee y se escribe a
través del adaptador, puede que no haya que levantar ningún estado a `App`;
decidir esa plomería antes de que exista el almacén sería decidirla con la
mitad de la información, y `e5.2` la invalidaría. Además `e5.2` carga el riesgo
de mayor *impacto* (`localStorage` lanza en modo privado y se lleva puesto el
modo test), y eso se quiere resuelto temprano.

`e5.3` cierra el esqueleto andante: es la primera vez que el camino completo
—responder → registrar → persistir → recargar → seguir ahí— existe de punta a
punta, y por eso la verificación en navegador real se ancla aquí y no al final.

`e5.4` va después del esqueleto porque cambia *cómo se siente* estudiar, y
conviene poder observarlo sobre algo que ya funciona. Es la historia que cumple
el outcome, no solo el requisito.

`e5.5` va última siguiendo el patrón que E1 ya dejó aprendido: lo más difícil
de probar va al final, sobre algo que funciona, donde deja de ser un riesgo y
pasa a ser un extra. Es independiente de las otras cuatro, así que su posición
no bloquea nada.

## Milestones

- [x] **Walking skeleton** — e5.1, e5.2, e5.3 — responder una pregunta,
      recargar la página, y ver que el registro de ese hueso conserva el
      resultado. Verificado **en navegador real**, que es el único sitio donde
      "recargar" significa algo.
- [x] **Core MVP** — + e5.4 — con un registro donde un hueso acumula fallos y
      otro solo aciertos, la selección elige el fallado con mayor frecuencia.
      Afirmado con prueba determinista sobre dominio puro, sorteo inyectado.
- [ ] **Epic complete** — + e5.5 — `./scripts/check` falla ante cualquier
      petición de red en tiempo de ejecución, y los cuatro criterios de
      `Done when` se cumplen.
- [x] **E2E integration checkpoint** — anclado en el hito del esqueleto andante,
      no antes del final: la costura que importa (dominio ↔ almacenamiento ↔
      React ↔ recarga del navegador) solo existe una vez que e5.3 la cierra, y
      ninguna prueba unitaria puede recargar una página. Se apoya en la suite de
      s1, que ya arranca el build real en Chromium.

## Parallel streams

`e5.4` depende solo de `e5.1`, así que en cuanto esa cierre puede adelantarse a
`e5.2`/`e5.3` sin conflicto: toca `quiz.ts`, no el almacenamiento ni los
componentes. `e5.5` es independiente de las cuatro y podría ir en cualquier
momento.

Siendo trabajo en solitario, "paralelo" aquí significa **reordenable sin
romper nada**, no simultáneo. Se registra porque es la flexibilidad que queda
si `e5.2` se atasca: hay dos historias que no la esperan.

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e5.1 | done | S | S |
| e5.2 | done | M | M |
| e5.3 | done | M | S-M |
| e5.4 | done | M | M |
| e5.5 | todo | S | — |

## Sequencing risks

- **`e5.3` descubre que la plomería del estado es el trabajo real y desborda su
  talla.** → Su diseño decide la propiedad del estado *antes* de implementar, con
  el almacén de `e5.2` ya en la mano; si aun así desborda, se parte en "registrar"
  y "compartir entre vistas", que son separables.
- **`e5.1` se sobre-diseña por ser la primera.** Es la forma del dato de la que
  cuelga todo, y esa es exactamente la posición desde la que se inventan campos
  que nadie pidió (fechas, variante de test, niveles). → El `scope.md` ya declara
  fuera esas tres, y los contratos de `design.md` fijan el dato como plano y
  serializable. Si aparece un campo nuevo, tiene que venir con la historia que lo
  usa.
- **`e5.5` resulta imposible de escribir sin falsos positivos y bloquea el
  cierre.** → Va última justamente para que, si eso pasa, la épica ya haya
  entregado su valor; y su verificación es en tiempo de ejecución sobre la
  aplicación montada, no por grep sobre el bundle. La suite de navegador de s1
  es la segunda red si la unitaria no alcanza.
