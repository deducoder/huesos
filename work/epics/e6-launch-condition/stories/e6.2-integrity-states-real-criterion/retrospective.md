# Story e6.2: Integrity test states the real criterion — Retrospective

Estimated: S (2 tareas) · Actual: S — sin desviaciones

## Summary

La condición de lanzamiento es ahora una prueba con nombre propio que cita
ADR-006, en vez de algo que había que deducir de dos pruebas que hablaban de
199 y de 7. Y las tres afirmaciones de cobertura dicen cada una algo distinto,
comprobado rompiendo el dato y viendo cuál falla.

## What went well

- **El RED por rotura deliberada resolvió un problema real de TDD.** Una prueba
  que afirma un estado válido pasa en cuanto se escribe, así que no hay rojo
  natural. Romper el dato a propósito y ver el nombre de la entrada en el
  mensaje es lo que convierte la aserción en un gate. Es el mismo patrón que
  e5.5, y ya va siendo la forma normal de este proyecto para las pruebas de
  invariante.
- **La redundancia se detectó sola.** Al romper el dato fallaron dos pruebas, no
  una. Ese solape era justo lo que el `SHOULD` del alcance prohibía, y no hubo
  que buscarlo: apareció en la salida del RED.
- **El reparto se reverificó después del refactor.** Con una razón simbólica
  (`'n/a'`) falla solo la prueba nueva. Sin esa segunda comprobación, "cada
  aserción dice algo distinto" habría sido una intención escrita en un
  comentario.
- **La exigencia de razón sustantiva se movió, no se perdió.** Al estrechar la
  prueba vieja era fácil dejar caer el `>20 caracteres`; se trasladó a la nueva,
  donde pertenece.

## What to improve

- **El plan dio por probable que las pruebas viejas "probablemente no sobren"**,
  y en parte sobraban: una repetía la afirmación de la nueva. Escribir una
  previsión en el plan y acertarla a medias no cuesta nada aquí, pero muestra
  que la parte de "decidir con las tres delante" era la que importaba, y la
  previsión era ruido.

## Learned

1. **About the system:** el tipo `Bone` y la prueba de la condición de
   lanzamiento afirman la misma invariante en dos planos distintos, y **las dos
   hacen falta**: el tipo impide escribir una entrada incoherente, la prueba
   permite que quien lea `RF-08` encuentre dónde se cumple. Una invariante que
   solo vive en el sistema de tipos es invisible para quien lee el requisito.

2. **About the process:** cuando una prueba afirma un estado ya válido, el
   ciclo TDD se invierte: el RED no viene de escribir la prueba sino de romper
   lo que afirma. Y esa rotura es además el detector de redundancia — si
   fallan dos pruebas, hay una afirmación repetida.

3. **Capability gained:** la condición de lanzamiento del producto es
   comprobable en segundos, con un nombre que se puede citar desde el PRD. `e6.3`
   ya puede escribir `RF-08` mirando la aserción.
