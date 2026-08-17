# Story e6.3: The PRD says what the project decided — Retrospective

Estimated: S (2 tareas) · Actual: S + una tercera tarea que apareció al
verificar

## Summary

`RF-08` dice ahora lo que la prueba ejecuta, explica dentro del propio
requisito qué significa "completo", y cita por nombre la aserción que lo
verifica. El backlog describe la épica que se hizo en vez de un trabajo
terminado hace tres épicas. Y apareció una duplicación que cruzaba archivos.

## What went well

- **Comparar el requisito y las pruebas literalmente, imprimiéndolos juntos**,
  en vez de leer cada uno por su lado. Eso encontró dos cosas que la lectura
  suelta no habría visto: que `RF-08` hablaba de "nombres duplicados" cuando los
  huesos pares comparten nombre por diseño, y la tercera copia de la afirmación
  de ausencia en otro archivo.
- **El matiz quedó en el requisito, no solo en el ADR.** ADR-006 lo exigía
  explícitamente porque quien lee `RF-08` para decidir un lanzamiento no siempre
  llega al ADR. Un requisito que necesita una nota al pie externa para
  entenderse no está terminado.
- **`RF-08` cita la prueba por su nombre.** El qué y el dónde-se-comprueba viajan
  juntos, así que la próxima vez que se desalineen será visible al leer
  cualquiera de los dos.

## What to improve

- **El `SHOULD` de e6.2 se limitó a un archivo sin decirlo.** "Que la prueba
  nueva sustituya a las que afirman lo mismo" se ejecutó dentro de
  `catalog.coverage.test.ts`, y la tercera copia estaba en `catalog.test.ts`.
  El alcance de una búsqueda de duplicación es el repositorio, no el archivo que
  se está editando — y si se acota, hay que escribir que se acotó.
- **Arreglarlo aquí fue una ampliación de alcance de e6.3.** Se hizo porque
  dejarlo habría hecho falso un `Done when` de la épica, y quedó escrito en el
  `progress.md` con esa razón. Pero la alternativa correcta habría sido no
  necesitarlo: que e6.2 buscara en todo el repositorio.

## Learned

1. **About the system:** la misma invariante estaba afirmada en tres sitios con
   tres exigencias distintas —el tipo `Bone` (imposible de violar), la prueba de
   cobertura (razón que explica) y `catalog.test.ts` (razón no vacía)—. Ninguno
   citaba a los otros, así que la redundancia era invisible desde cualquiera de
   ellos. **Una invariante repetida sin referencias cruzadas se descubre
   rompiendo el dato, no leyendo el código.**

2. **About the process:** verificar que dos documentos "dicen lo mismo" es una
   comparación, no una lectura. Imprimir el observable del PRD y la lista de
   pruebas uno al lado del otro costó un comando y encontró dos desajustes que
   habían sobrevivido a seis épicas.

3. **Capability gained:** la condición de lanzamiento del producto está escrita,
   decidida con sus alternativas registradas, y verificada por una prueba que se
   cita desde el requisito. Se puede responder "¿podemos publicar?" leyendo un
   párrafo y corriendo un comando.
