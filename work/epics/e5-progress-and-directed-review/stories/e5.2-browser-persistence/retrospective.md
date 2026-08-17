# Story e5.2: Browser persistence — Retrospective

Estimated: M (4 tareas) · Actual: M — 4 tareas, 6 commits, un corte del plan
que resultó artificial y un commit hecho con el gate en rojo

## Summary

`src/storage/progress-store.ts`: el registro de progreso persistido en
`localStorage` bajo una sola clave, tras una interfaz mínima que se inyecta,
con validación de forma al leer y degradación explícita a memoria cuando el
almacén falla. 15 tests, todos contra dobles; el `localStorage` real se ejerció
en Chromium en T4.

## What went well

- **El camino de fallo se construyó primero y eso ordenó el diseño.** Empezar
  por "qué pasa cuando `localStorage` lanza" obligó a decidir la degradación
  antes que el camino feliz, y de ahí salió el matiz que el `scope.md` no tenía:
  la caché en memoria tiene que **anteponerse** a la lectura, o el estudiante ve
  retroceder su progreso tras un fallo de escritura.
- **T4 descartó un riesgo real con evidencia.** Las cuatro asunciones del
  adaptador sobre una API que nunca se había tocado —`null` para clave ausente,
  supervivencia a la recarga, `SyntaxError` ante valor corrupto, ida y vuelta de
  206 entradas— se comprobaron en un navegador de verdad. Ninguna falló, y eso
  es un resultado, no una formalidad: la alternativa era confiar.
- **Descartar el registro entero ante una entrada mala** en vez de repararlo a
  medias. Reparar parcialmente produce un dato inventado con aspecto de dato
  real, y no había forma de distinguirlo después.

## What to improve

- **Committeé con el gate en rojo.** Encadené `./scripts/check` y `git commit`
  en la misma tanda y no leí el resultado antes de commitear; el fallo era solo
  de formato, pero la disciplina dice que la tarea no está hecha hasta que el
  gate pasa. Se corrigió con un commit propio en vez de enmendar la historia.
  **La causa no fue descuido de criterio sino de mecánica**: gate y commit no
  deben ir en la misma tanda de comandos, porque entonces el commit no depende
  de haber leído nada.
- **El corte T1/T2 del plan era artificial.** Ordenar por riesgo puso primero la
  degradación a memoria, que no puede probarse sin que `read`/`write` existan —
  así que T1 arrastró el camino normal y T2 se quedó sin RED: sus cuatro tests
  pasaron sin escribir código. Los tests valen y se quedaron, pero se
  commitearon como `test(...)`, no como `feat(...)`.
- **Escribí un test que no probaba nada** y lo detecté al releerlo, no al
  escribirlo: el doble copiaba el objeto inicial con `{...inicial}`, así que la
  aserción se cumplía por construcción. Un doble que copia cuando debería
  compartir convierte cualquier aserción sobre persistencia en tautología.

## Learned

1. **About the system:** `localStorage.getItem` devuelve `null` —no
   `undefined`— para una clave ausente, y `JSON.parse` de un valor corrupto
   lanza `SyntaxError` en vez de devolver algo falsy. Las dos cosas están ahora
   comprobadas en Chromium, no supuestas. El registro completo de 206 huesos
   ocupa ~8 KB en el navegador real.

2. **About the process:** ordenar las tareas por riesgo puede producir una
   primera tarea que **no puede existir sin la segunda**. Cuando la tarea
   riesgosa es un caso de borde de una operación, el caso de borde no se puede
   probar sin la operación, y el plan acaba mintiendo sobre dónde está el
   trabajo. El orden por riesgo aplica entre tareas independientes; entre una
   operación y su caso de borde, la dependencia manda.

3. **Capability gained:** el proyecto tiene su primera capa de persistencia, con
   la dirección de la dependencia verificada (dominio no importa
   almacenamiento) y el camino de fallo probado. Marca el precedente para el
   próximo dato que deba sobrevivir a una recarga.

## Handoff to e5.3

**El almacén debe crearse una sola vez y vivir mientras viva la aplicación.**
La degradación a memoria es estado interno de la instancia devuelta por
`createProgressStore()`: si `e5.3` lo llama en cada render, cada render estrena
una caché vacía y la degradación deja de funcionar justo cuando hace falta.
No es un defecto de este módulo —una instancia por almacén es lo correcto— pero
sí un contrato que `e5.3` tiene que respetar, y que ningún tipo obliga.
