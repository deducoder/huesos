# Story e2.1: Region grouping — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Agrupar y ordenar | done | `f0a7c21` | RED con 5 aserciones, GREEN con 26 líneas |
| T2 · Prueba de integración manual | done | — | El recorrido se revisó imprimiendo los grupos desde un test temporal |

## Desvíos respecto del plan

- **Imprimir por consola exigió un test temporal.** El dominio está en
  TypeScript y Node no lo ejecuta directamente, así que la inspección manual se
  hizo desde un archivo de prueba en `tests/tmp/`, borrado después. Es un rodeo
  que conviene recordar: en este proyecto, «ejecutar un módulo a mano» significa
  escribir un test efímero.
- **El orden anatómico quedó como constante explícita** con un comentario que
  dice que es convención de estudio y no hecho anatómico. Cambiarlo será una
  decisión visible en el diff, no un efecto colateral.
