---
name: inline-styles-need-a-watchdog-not-a-css-rule
description: Cuando una librería de terceros reafirma un estilo en línea después del montaje (en un momento que no se controla ni se puede predecir), una regla CSS estática nunca gana — hace falta vigilar el atributo y corregirlo cada vez que cambie.
metadata:
  type: process
---

En e7.2, `canvas{touch-action:none}` en `@layer base` parecía arreglar el
conflicto entre arrastrar el dedo y hacer scroll de la página. Nunca funcionó
de forma confiable: `OrbitControls` de three-stdlib **ya pone**
`touch-action:none` al conectar (inline, gana contra cualquier CSS por
definición), pero se desconecta y reconecta una vez después del montaje
—el momento varía, coincide con la carga del modelo— y esa reconexión no
vuelve a fijar el valor. La regla CSS de e7.2 nunca tuvo nada que ganarle:
compitió contra un estilo en línea que se reasigna en un momento
impredecible, y las mediciones anteriores solo "pasaban" porque ninguna
esperó lo suficiente para atrapar la reconexión.

El diagnóstico se hizo con un `MutationObserver` inyectado en vivo en la
consola del navegador (vía Playwright), registrando cada cambio del atributo
`style` con su timestamp — no adivinando con más timeouts.

**Por qué importa:** una regla CSS estática asume que el estilo se fija una
vez. Cuando una librería de terceros lo reafirma en su propio ciclo de vida
—sin previo aviso de cuándo—, la única defensa robusta es simétrica: vigilar
el mismo atributo con el mismo mecanismo (un `MutationObserver` propio) y
corregirlo cada vez, con un guard para no autoactivarse en bucle
(`if (valor !== esperado) fijar()`).

**How to apply:** ante un estilo en línea que una dependencia toca y que
"a veces" no aplica, no seguir subiendo timeouts ni polls — instrumentar con
un `MutationObserver` para ver CUÁNDO y CUÁNTAS VECES cambia de verdad antes
de proponer un arreglo. Si el patrón es "se reafirma en un momento variable",
el arreglo es un observador que corrige, no una asignación única ni una
regla CSS.
