# Story e6.3: The PRD says what the project decided — Progress

## T1 · `RF-08` dice el observable que se ejecuta

`governance/prd.md` reescrito según ADR-006. Tres cambios:

1. **La exigencia**: cada entrada tiene región gráfica **o bien** una razón
   documentada de por qué el modelo no la incluye, en vez de exigir región
   gráfica a todas —que siete no pueden cumplir—.
2. **El matiz, dentro del requisito**: *completo* se refiere a la cobertura del
   catálogo, no a la del modelo. Estaba solo en el ADR; ADR-006 dice que tiene
   que estar también donde se lee el requisito, porque quien lo lee no siempre
   llega al ADR.
3. **El observable cita la prueba por su nombre**:
   `src/data/catalog.coverage.test.ts`, *"cumple la condición de lanzamiento:
   geometría o razón, nunca ninguna"*. El qué y el dónde se comprueba, juntos.

`RF-08` sigue siendo la condición de lanzamiento y sigue bloqueando. Cambia lo
que exige, no su rango.

**Un desajuste extra encontrado al comparar lado a lado.** `RF-08` decía "no
hay **nombres** ni identificadores duplicados", pero los huesos pares comparten
nombre por diseño (los dos fémures son "fémur") y lo que las pruebas verifican
es que no haya dos entradas del mismo hueso **y lado**. Corregido: el observable
ahora describe lo que `no repite identificadores` y `no repite el mismo hueso
del mismo lado` hacen de verdad.

## T2 · El backlog describe la épica que se hizo

La fila de E6 pasa de "Completar las 206 entradas región por región" —trabajo
terminado en E1— a describir el cierre de `RF-08`. Y la nota de secuencia, que
decía que el lanzamiento esperaría a que el catálogo llegara a 206, ahora
explica que llegó en E1 y que lo que quedaba no era contenido sino una decisión.

## T3 · Un hallazgo que cruzaba archivos

Al verificar el observable contra las pruebas apareció **una tercera** copia de
la misma afirmación: `exige una razón a toda entrada sin geometría`, en
`src/data/catalog.test.ts` — otro archivo, que el `SHOULD` de e6.2 no miró
porque se limitó a `catalog.coverage.test.ts`. Además era **más débil**
(`toBeTruthy` contra ">20 caracteres que expliquen"), así que quedaba subsumida
por completo.

Eliminada, con un comentario que dice dónde vive ahora la afirmación. Su
conversa —`no deja razón de ausencia a una entrada que sí tiene geometría`— se
queda: dice algo que ninguna otra prueba dice.

**Reverificado tras quitarla**, para que "la invariante sigue protegida" sea un
hecho: con el hioides sin razón, falla exactamente una prueba en los dos
archivos.

```
× cumple la condición de lanzamiento: geometría o razón, nunca ninguna
AssertionError: entradas sin geometría y sin una razón que explique:
  expected [ 'hyoid' ] to deeply equal []
      Tests  1 failed | 18 passed (19)
```

**Nota de alcance:** esto pertenecía al `SHOULD` de e6.2, ya cerrada. Se
arregló aquí en su propio commit en vez de aparcarlo, porque dejarlo habría
hecho falso un `Done when` de la épica ("no queda la misma afirmación repartida
en dos sitios"). Queda escrito para que la ampliación sea visible y no
silenciosa.

## Finalize

- Full gate set: `./scripts/check` verde — **190 tests** (191 al empezar, menos
  la aserción duplicada que se eliminó).
- Orphaned-test check: limpio.
- Acceptance criteria: los tres escenarios del `scope.md`, cumplidos. El
  primero —"leídos uno al lado del otro dicen lo mismo"— se comprobó
  literalmente, imprimiendo el observable y la lista de pruebas juntos.
