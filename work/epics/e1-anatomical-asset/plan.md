# Epic e1: Anatomical asset — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e1.1 | dependency | — | Todo lo demás: sin activo en el repositorio no hay nada contra qué probar |
| 2 | e1.2 | skeleton | — | El esquema y el primer test del proyecto; quita `--passWithNoTests` |
| 3 | e1.4 | risk-first | e1.1, e1.2 | Cierra el camino extremo a extremo: dato → geometría real verificada |
| 4 | e1.3 | risk-first | e1.1 | El inventario que hace mecánico poblar el catálogo |
| 5 | e1.5 | quick-win | e1.3, e1.4 | La región piloto que prueba el esquema con datos reales |
| 6 | e1.6 | dependency | e1.5 | El resto de regiones hasta 199 |

**Rationale:** el orden no es por tamaño. Las tres primeras existen para cerrar
cuanto antes el **camino completo más pequeño posible**: un activo en el
repositorio, un tipo que lo describe y una prueba que casa una entrada contra la
malla real del archivo. Con una sola entrada en el catálogo —el fémur derecho,
por ejemplo— ese camino ya demuestra que el anclaje de ADR-001 funciona.

Ese es el riesgo de verdad del epic, y por eso va primero: si el nombre de malla
no sirviera como clave estable, toda la decisión del activo se cae, y conviene
descubrirlo con una entrada, no con 199. e1.3 va después porque solo tiene
sentido automatizar el inventario cuando ya se sabe qué forma tiene una entrada
válida. e1.5 y e1.6 son volumen: mecánicas y de riesgo bajo una vez que el
camino está probado.

## Milestones

- [ ] **Walking skeleton** — e1.1, e1.2, e1.4 — una entrada del catálogo pasa la
      prueba de integridad contra el `.glb` real, y `./scripts/check` corre en
      verde ya sin `--passWithNoTests`.
- [ ] **Core MVP** — + e1.3, e1.5 — la columna vertebral completa, 26 entradas
      con nomenclatura bilingüe, verificadas contra la geometría.
- [ ] **Feature complete** — + e1.6 — las 199 entradas y las 7 excepciones
      declaradas.
- [ ] **Epic complete** — criterios de `scope.md` cumplidos, documentación
      actualizada, retrospectiva hecha.

No procede punto de control E2E: el epic entrega una sola capa —datos— sin
cliente ni servidor entre los que verificar costuras. La costura que sí importa,
catálogo contra geometría, **es** e1.4 y está en el walking skeleton.

## Parallel streams

e1.1 y e1.2 no dependen una de otra y tocan áreas distintas —activo binario
frente a tipos—, así que pueden ir en paralelo. A partir de e1.4 el camino es
secuencial: cada historia consume lo que produce la anterior.

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e1.1 | done | S | S · 4 commits |
| e1.2 | todo | S | — |
| e1.3 | todo | M | — |
| e1.4 | todo | S | — |
| e1.5 | todo | M | — |
| e1.6 | todo | L | — |

## Sequencing risks

- **El anclaje por nombre de malla podría no ser estable** → es exactamente lo
  que e1.4 prueba, y va en el walking skeleton para que falle pronto y barato.
- **e1.6 es la historia grande y va última** → si el apetito se agota antes,
  el epic queda con menos regiones pero utilizable: el catálogo es válido con
  cobertura parcial mientras las excepciones estén declaradas. Es degradación
  ordenada, no fracaso.
- **Poblar nombres en español es trabajo manual y monótono** → e1.5 lo hace
  primero sobre una sola región para fijar el criterio de terminología, en vez
  de descubrirlo a mitad de las 199.
