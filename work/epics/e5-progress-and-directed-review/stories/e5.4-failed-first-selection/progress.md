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
