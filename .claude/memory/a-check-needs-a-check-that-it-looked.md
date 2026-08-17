---
name: a-check-needs-a-check-that-it-looked
description: Una aserción sobre una lista vacía es indistinguible de una que nunca recorrió nada — las dos dan verde. Toda comprobación automática necesita una segunda que afirme que miró algo.
metadata:
  type: process
---

En e5.5, la comprobación de `must-privacy-006` recorre `src/` y afirma que no
hay infracciones. Si el recorrido se rompiera —una ruta mal resuelta, un filtro
de extensión de más— devolvería una lista vacía y la aserción pasaría. Verde
por no haber buscado.

Por eso cada comprobación lleva su par:

- el recorrido de archivos afirma además que encontró **más de 15 archivos** y
  que `App.tsx` está entre ellos;
- los espías de red afirman además que **registran una llamada real** cuando se
  les hace una.

Tres líneas cada uno.

**Por qué importa:** es el mismo modo de fallo que dejó la suite de s1 verde
por accidente durante dos sesiones ([[measure-the-element-after-layout]]) — una
comprobación que se porta bien mientras no está mirando lo que cree. Y es
especialmente traicionero en los gates de tipo "no debe haber X": su estado
normal es la lista vacía, así que el fallo del andamiaje se disfraza de éxito.

**En e7.1 el control cobró la apuesta, y contra el instrumento mismo.** El gate
de colores literales llevaba su par —«el instrumento mira de verdad»— y falló en
la primera ejecución: el patrón tenía la bandera `g`, y `RegExp.test` avanza
`lastIndex` entre llamadas, así que la segunda comprobación daba `false` sobre
un texto que sí contenía un color. No era el recorrido lo que estaba roto, era
**el patrón**. Sin esa aserción el gate habría quedado verde dejando pasar
literales, y el fallo se habría descubierto al encontrar un `bg-slate-800` vivo
varias historias después. El par no solo verifica que se recorrió: verifica que
se reconoce.

**How to apply:** en toda aserción cuyo caso feliz sea "vacío", "cero" o
"ninguno", añadir una segunda que demuestre que el instrumento funciona: que el
recorrido encontró archivos, que el espía detecta, que el filtro deja pasar un
caso conocido — y que **reconoce** un positivo, no solo que recorre. Y ver el
gate **ponerse rojo** con un defecto real antes de confiar en él
([[a-reintroduced-defect-must-actually-break]]): en e7.1 eso fue inyectar
`bg-[#ff0000]` en un componente de verdad y comprobar que lo reportaba.
