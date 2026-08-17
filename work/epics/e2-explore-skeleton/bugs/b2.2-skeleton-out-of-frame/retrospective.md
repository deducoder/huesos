# Bug b2.2: Skeleton out of frame — Retrospective

## Qué se arregló

El modelo es un humano de 1,696 **apoyado en el origen**, con su centro en
`Y = 0.857`. La cámara miraba al origen, es decir a los pies, así que el cráneo
quedaba fuera y media pantalla sobraba. Ahora el esqueleto se mide con `Box3`,
se normaliza a una altura canónica y se centra; la cámara es constante y
derivada de esa altura.

## Lo que este bug enseña

- **Dos bugs seguidos con el mismo origen: verificación.** b2.1 y b2.2 no fueron
  errores de diseño ni de análisis. Los dos existían porque nadie había abierto
  la aplicación. Con un navegador disponible, los dos se habrían visto en el
  primer minuto — como de hecho pasó.
- **Mi propio arreglo tenía código muerto, y solo el navegador lo delató.** La
  primera versión aparentaba medir y ajustar la cámara; en realidad el valor se
  calculaba una vez y el resto era decorado. Pasaba los gates, tenía buena pinta
  y era falso. Lo destapó un sondeo: **romper el valor a propósito y comprobar
  que el sistema se corrige**. Si al estropear una entrada nada cambia, esa
  entrada no se está usando.
- **Una prueba mal formulada acusa al código.** El primer veredicto sobre el
  resaltado dio «NO» porque yo había asumido que el lado izquierdo del cuerpo
  sale a la izquierda de la imagen. En vista frontal es al revés. El código
  estaba bien; la comprobación estaba mal escrita, y por poco lo trato como
  defecto.
- **Medir es mejor que mirar.** «Se ve bien» no distingue 2 huesos alcanzables de
  10. La rejilla de clics y el conteo de píxeles que cambian dan un número que
  se puede comparar entre versiones.

## Qué evitaría esta clase de bug

Exactamente lo que se acaba de usar: **ejecutar la aplicación en un navegador**.
Ahora que hay Playwright, esto deja de ser una carencia estructural y pasa a ser
una suite que el proyecto puede tener. Es el siguiente trabajo, y hace tiempo que
está en el parking lot.
