# Story e5.4: Failed-first selection — Progress

## T1 · La regla de pesos, como función pura

`weightFor(progress, boneId)` = `max(1, 1 + 3×fallos − 1×aciertos)`, con
`POR_FALLO`, `POR_ACIERTO` y `PESO_MINIMO` como constantes nombradas y
comentadas. El suelo lleva escrito por qué existe: **no es defensivo, es la
invariante de ADR-005** — sin él un hueso muy acertado tendría peso negativo y
saldría del sorteo, que es exactamente la cola estricta que el ADR rechazó.

RED: los cinco tests fallaron por `weightFor` inexistente.
Gate: `./scripts/check` verde — 177 tests. Desviación: ninguna.

## T2 · La selección ponderada, y sus dos llamadas

`pickTestableBone(bones, opciones)` con `PickOptions { excluirId, progress,
sorteo }`, suma acumulada de pesos, y las dos llamadas de `TestQuestion`
pasando `store.read()`.

**El corte de tareas funcionó esta vez.** El plan ya juntaba la firma y sus
consumidores porque e5.2 y e5.3 habían enseñado que separarlos obliga a dejar
el gate en rojo. Cambiar la firma y las dos llamadas en la misma tarea salió
sin fricción.

RED: cuatro tests nuevos fallando — el sesgo hacia lo fallado, el sesgo
proporcional, la uniformidad con registro vacío y las invariantes previas bajo
la firma nueva.

**Un test huérfano encontrado y arreglado.** El test previo
`'nunca elige el id excluido'` llamaba con la firma posicional
(`pickTestableBone(catalog, 'femur-right')`); con el objeto de opciones, ese
string se recibía como `PickOptions` y `excluirId` quedaba en `undefined`, así
que el hueso "excluido" volvía a salir. **El test siguió compilando y falló en
ejecución**: un `string` donde se espera un objeto de propiedades todas
opcionales no es un error de tipos evidente. Migrado a
`{ excluirId: 'femur-right' }`, conservando su intención.

Gate: `./scripts/check` verde — 182 tests.

## T3 · Prueba de integración manual — el sesgo, en la aplicación real

En Chromium, con el `localStorage` sembrado antes de arrancar la aplicación
(`frontal` con 30 fallos, el resto sin historial) y 50 preguntas respondidas mal
seguidas:

```
preguntas respondidas : 50
huesos distintos      : 32
cuota uniforme        : 0.25 por hueso
veces que salió "frontal" (el sembrado): 10
los 5 más preguntados : frontal 10 · fibula-left 3 · foot-proximal-phalanx-3-right 3
                        · metatarsal-4-right 2 · hand-proximal-phalanx-2-right 2
```

**Las dos mitades de ADR-005, visibles a la vez:** el hueso sembrado se llevó
10 de 50 preguntas contra una cuota uniforme de 0,25 —unas 40 veces su parte— y
aun así salieron 32 huesos distintos. La ponderación insiste sin encerrar, que
es exactamente lo que distinguía la opción elegida de la cola estricta
rechazada.

**Desviación de método:** el primer intento de sonda leía el hueso preguntado
desde el DOM (`data-hueso`), y se colgó — ese atributo solo existe en los
**dobles** de las pruebas unitarias; en la aplicación real `must-data-003`
prohíbe que el hueso llegue al DOM antes de responder. Se rehízo observando el
propio registro: como cada respuesta fallada anota el hueso preguntado, el
registro **es** el histograma. Mejor instrumento, y además no inventa una vía de
observación que la aplicación no tiene.

## Finalize

- Full gate set: `./scripts/check` verde — **182 tests** (172 al empezar la
  historia, 10 nuevos entre `weightFor` y la selección ponderada).
- Orphaned-test check: **uno encontrado y arreglado** —
  `'nunca elige el id excluido'` usaba la firma posicional vieja y pasaba un
  `string` donde ahora va un objeto de opciones. Compilaba y fallaba en
  ejecución. Migrado conservando su intención.
- Acceptance criteria: los cinco escenarios del `scope.md` y el delta del
  `design.md` (el suelo del peso), cumplidos. Los cinco `Done when` cumplidos,
  incluido el que exigía prueba determinista.
