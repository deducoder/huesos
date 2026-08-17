# Story e2.5: Scene selection — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Resolver malla y mitad al hueso | done | `7e1d5c8` | 6 aserciones; la última recorre las 199 entradas ancladas |
| T2 · Clic y resaltado en la escena | done | `dfc035e` | Dos copias con material propio cada una |
| T3 · Prueba de integración manual | **parcial** | — | Compila y construye; **no se comprobó visualmente el resaltado** |

## Desvíos respecto del plan

- **Cada copia del esqueleto necesita su propio material.** Al clonar la escena,
  three comparte los materiales entre copias, así que resaltar el fémur derecho
  encendía también el izquierdo. Se clona el material la primera vez que se toca
  cada malla. No estaba previsto y es el detalle técnico más fino de la historia.
- **El linter rechazó `onClick` sobre `<primitive>`** por
  `noStaticElementInteractions`. Es un falso positivo: `primitive` es un nodo de
  three.js, no un elemento del DOM, y no admite rol ni `tabindex`. Se suprimió la
  regla **con el motivo escrito**, como pide `should-style-008`, y apuntando a la
  vía accesible equivalente. De paso: un `biome-ignore` no admite el motivo
  repartido en varias líneas, cosa que costó dos ciclos de gate descubrir.
- **Las pruebas de e2.4 se actualizaron** porque el diseño cambió: el espejo pasó
  de literal a parámetro `half`. Se añadieron dos aserciones nuevas —que el lado
  se resuelve por la mitad y que cada copia tiene material propio— en vez de solo
  relajar la vieja.
