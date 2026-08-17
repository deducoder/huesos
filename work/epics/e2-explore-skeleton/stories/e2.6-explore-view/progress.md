# Story e2.6: Explore view — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Contrato entre estado y escena | done | `a7c2f19` | 4 aserciones nuevas; el doble de la escena pasó a exponer lo que recibe |
| T2 · Prueba de integración manual | done | — | `./scripts/check` verde y build correcto con las tres piezas montadas |

## Desvíos respecto del plan

- **La composición estaba hecha antes de empezar la historia.** e2.3 creó
  `ExploreView`, e2.4 le metió la escena y e2.5 la selección, cada una porque sin
  montar no había nada que verificar. Esta historia entrega **lo que faltaba de
  verdad**: la prueba del contrato entre las tres piezas.
- **El doble de la escena se convirtió en instrumento de medida.** En vez de un
  `<div>` mudo, ahora expone en un atributo la malla que recibe y ofrece un botón
  que simula un clic en la escena. Eso permite probar la costura en ambas
  direcciones sin renderizar WebGL.
- **Al parking lot:** desplazar la lista hasta el hueso elegido desde la escena.
  Con 206 entradas, seleccionar en la escena deja la lista donde estaba y el
  hueso marcado puede quedar fuera de la vista.
