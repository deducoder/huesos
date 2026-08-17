# Story e2.5: Scene selection — Retrospective

Estimated: M · Actual: M, 2 commits

## Summary

Un clic sobre el esqueleto selecciona el hueso, y el hueso seleccionado se
resalta en la escena. El lado se resuelve por la mitad de la escena que se pulsó,
no por el nombre de la malla — que es lo único que podía funcionar, porque el
modelo trae un solo hemicuerpo y cada malla aparece dos veces.

## What went well

- **El mapeo se probó de verdad, y era lo que importaba.** Seis aserciones,
  incluida una que recorre las 199 entradas ancladas y comprueba que todas
  resuelven en su mitad. El raycasting no es verificable aquí, pero la lógica
  que decide **qué hueso es** sí lo es, y ahí estaba el error probable.
- **La ambigüedad se resolvió en dominio, no en la vista.** `boneIdForMesh` no
  sabe nada de three.js: recibe un nombre de malla y una mitad. La escena solo
  aporta el dato que únicamente ella conoce.
- **Devolver `null` para las mallas no catalogadas evitó un fallo silencioso.**
  Dientes, cartílagos y el manubrio son mallas legítimas del modelo: pulsarlas no
  selecciona nada, en vez de seleccionar algo equivocado.

## What to improve

- **El material compartido entre copias fue una trampa que el test no vio.**
  Clonar la escena comparte materiales, así que resaltar un lado encendía los
  dos. Se detectó razonando sobre three, no por una prueba — y ninguna prueba
  automática de este proyecto lo habría detectado. Está anotado como aserción
  sobre el fuente, que es una red muy floja.
- **El resaltado no se ha visto.** Como en e2.4, falta la comprobación visual.
  Dos historias seguidas cerrando con la misma laguna es un patrón, no un
  accidente.
- **Dos ciclos de gate perdidos por la sintaxis de `biome-ignore`.** El motivo
  tenía que caber en una línea; repartirlo anulaba la supresión.

## Learned

1. **About the system:** clonar una escena de three **comparte los materiales**.
   Cualquier efecto visual por instancia —resaltado, transparencia, color de
   estado— exige clonar el material antes de tocarlo. Es la clase de detalle que
   no se ve leyendo el código y aparece como un fallo visual desconcertante.
2. **About the process:** cuando una capa no es verificable, conviene bajar la
   decisión difícil a una que sí lo sea. Aquí «qué hueso se pulsó» se sacó del
   canvas y se metió en dominio puro, y eso convirtió lo intestable en probado.
3. **Capability gained:** la escena y la lista son dos proyecciones del mismo
   estado y se mantienen sincronizadas en ambas direcciones.
