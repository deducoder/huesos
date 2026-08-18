# Story e9.3: The isolated bone fits and turns — Retrospective

Estimated: M, 5 tareas · Actual: M, pero con un **rediseño a mitad de T4**
que el plan no contemplaba, provocado por un defecto que encontró el usuario
y que ninguna prueba de esta historia podía ver.

## Summary

El hueso aislado entra entero en el lienzo —encuadrado por su ancho real y
el aspecto de la pantalla, no por su dimensión mayor tratada como altura—,
queda por encima de la tarjeta, deja aire por los cuatro costados y se puede
girar con el dedo. `frameObject` se añadió apoyada en `distanceToFit` en vez
de sustituirla, así que `SkeletonScene` no se tocó más que para ceder
`FixTouchAction`, que ahora comparten las dos escenas.

## What went well

- **Medir el activo antes de escribir el scope.** Leer los `min`/`max` de los
  144 accessors del glTF dio los ratios reales y cambió la historia: el
  hueso crítico no era el coxal que había supuesto al diseñar la épica, sino
  la **clavícula** (4,26) y el **atlas** (4,34). Los criterios se pudieron
  escribir con nombres y números concretos en vez de «un hueso ancho».
- **Cortar las tareas por escenario del scope**, que era el aprendizaje que
  e9.6 dejó. Esta vez no quedó ningún criterio sin prueba al llegar a la
  revisión — el que faltaba (la barra del modo test) es alcance de otra
  historia, no un olvido.
- **La técnica de observación ya existía.** Contar píxeles del lienzo con
  `pngjs` lo introdujo b2.3 para la lateralidad; reutilizarla evitó inventar
  una forma nueva de mirar dentro de WebGL. Y el umbral no se eligió a ojo:
  se midió el histograma primero, resultó bimodal (fondo en 32, hueso en
  224) y 90 los separa sin zona gris.
- **Una mutación sobrevivió y eso fue el hallazgo.** Sustituir el alto medido
  de la tarjeta por el 45 % declarado **pasaba** la prueba de T3: no
  distinguía medir de suponer, que era justo lo prometido. Se cubrió
  comparando fémur (ficha larga) con tibia (ficha corta), dos huesos de la
  pierna de proporciones parecidas.

## What to improve

- **Escribí una prueba que no observaba lo que decía observar.** «Al
  arrastrar cambian más de 2 000 píxeles» daba ~90 para tres arrastres
  distintos —el mismo número, o sea ruido— y, aunque hubiera funcionado,
  jamás habría detectado el defecto real: un hueso puede salirse del
  encuadre y seguir cambiando píxeles. La descarté y la reemplacé por lo que
  el usuario hizo con el dedo.
- **El rediseño de T4 debió salir del diseño, no de la prueba manual.** Al
  decidir subir el hueso bajando la cámara, no me pregunté qué le pasaba al
  punto de órbita. La pregunta «¿qué otra cosa depende de esto que estoy
  moviendo?» no formó parte del diseño, y `OrbitControls` ya estaba en el
  scope de la misma historia.
- **Puse un umbral antes de conocer el resultado.** «El fémur sigue siendo
  grande, más de 15 000 píxeles» era un número inventado; tras el arreglo
  daba 10 265, porque el área baja con el cuadrado de la proporción al
  encuadrar en el 55 % del alto. El área era además mala medida —cambia con
  lo macizo que sea el hueso—, y se reemplazó por cuánto de la franja libre
  recorre el hueso.

## Learned

1. **About the system:** descentrar la proyección no es lo mismo que mover
   la cámara. `setViewOffset` corre la ventana del frustum dejando intacto
   el punto al que la cámara mira, que es lo que `OrbitControls` usa como
   centro de giro; desplazar la cámara y su `target` juntos coloca bien el
   objeto y arruina la órbita, con un síntoma asimétrico —invisible en
   horizontal, evidente en vertical— que hace difícil atribuirlo.
2. **About the process:** un fixture crítico **por defecto**, no por
   historia. Los dos defectos de esta historia compartían síntoma y tenían
   casos extremos opuestos: el ancho lo expone la clavícula (el fémur da 0),
   y el tapado lo expone el fémur (la clavícula da 100 % visible). Un solo
   fixture habría dejado uno sin cubrir en cualquiera de las dos
   direcciones.
3. **Capability gained:** observar el interior de un lienzo WebGL con
   criterios geométricos —aire por banda, recorrido vertical, reparto sobre
   y bajo un elemento flotante— en vez de comparaciones de imagen que solo
   dicen «cambió». Las tres métricas están en `e2e/mobile-shell.spec.ts` y
   son reutilizables para e9.4, que mueve la cámara del esqueleto completo.
