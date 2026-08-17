# Epic e2: Explore skeleton — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e2.1 | dependency | — | Todo lo que presente huesos agrupados |
| 2 | e2.2 | skeleton | e2.1 | La vía accesible: ya se puede recorrer el esqueleto sin 3D |
| 3 | e2.3 | skeleton | e2.2 | Cierra el camino: seleccionar muestra el nombre |
| 4 | e2.4 | risk-first | — | La escena; el riesgo técnico del epic |
| 5 | e2.5 | risk-first | e2.4 | Selección y resaltado en la escena |
| 6 | e2.6 | dependency | e2.3, e2.5 | La vista completa sobre un estado |

**Rationale:** el orden invierte la intuición. Lo llamativo es la escena 3D, pero
el **walking skeleton es la vía accesible**: con e2.1, e2.2 y e2.3 la aplicación
ya sirve para estudiar —se recorre el catálogo, se elige un hueso, se lee su
nombre— sin una línea de WebGL. Eso convierte el riesgo de e2.4 en enriquecimiento
en vez de en todo o nada: si Draco no decodificara, el epic seguiría entregando
valor.

Es además lo que `must-a11y-005` pide de verdad. Construir la escena primero y
la accesibilidad después produce siempre un apaño; construirla al revés hace que
la vía de teclado sea la nativa.

## Milestones

- [ ] **Walking skeleton** — e2.1, e2.2, e2.3 — se recorre el catálogo por
      teclado y seleccionar un hueso muestra su nombre en ambas nomenclaturas.
- [ ] **Core MVP** — + e2.4 — el esqueleto se ve en pantalla.
- [ ] **Feature complete** — + e2.5, e2.6 — clic sobre un hueso lo selecciona y
      lo resalta, sincronizado con la lista.
- [ ] **Epic complete** — criterios de `scope.md` cumplidos, documentación y
      retrospectiva.

No procede punto de control E2E: no hay cliente y servidor entre los que
verificar costuras. La costura real —escena contra lista— es e2.6, y va última
por definición.

## Parallel streams

e2.4 no depende de e2.1-e2.3 y podría ir en paralelo: la escena solo necesita el
activo, que E1 dejó cerrado. Se secuencia después por gestión de riesgo, no por
dependencia.

## Progress

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e2.1 | todo | S | — |
| e2.2 | todo | M | — |
| e2.3 | todo | S | — |
| e2.4 | todo | M | — |
| e2.5 | todo | M | — |
| e2.6 | todo | S | — |

## Sequencing risks

- **El canvas no se puede probar en jsdom** → la cobertura automática cubre
  dominio y DOM; cada historia con canvas lleva su prueba manual declarada, y se
  dice en la retrospectiva qué quedó sin cubrir.
- **e2.5 es la historia con más incógnitas** —raycasting, espejado, mapeo malla a
  entrada uno a muchos— y va la penúltima. Si desborda, e2.6 puede componer solo
  con la vía accesible y la escena sin selección.
