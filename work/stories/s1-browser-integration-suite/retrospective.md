# Story s1: Browser integration suite — Retrospective

Estimated: M (4 tareas, una sesión) · Actual: 3 sesiones, 12 commits, cuatro
causas de fallo — ninguna en la aplicación

## Summary

Una suite de Playwright que abre el build de producción en Chromium y hace las
cuatro comprobaciones que ninguna prueba unitaria podía hacer: que el esqueleto
carga sin errores, que se puede seleccionar pulsando sobre la escena, que un
hueso par se resalta del lado anatómicamente correcto, y que no se pide nada a
ningún tercero. Más `./scripts/check-integration`, el segundo punto de entrada
que la convención de gates contemplaba y que este proyecto no tenía.

Y, por fin, la demostración que le da sentido a todo lo anterior: reintroducir
b2.1 o b2.2 pone el gate en rojo.

## What went well

- **La suite atrapa lo que se construyó para atrapar, y ahora está probado.**
  b2.1 reintroducido deja la cifra en 1 hueso; b2.2 reintroducido, en ninguno.
  Contra 6 en verde.
- **Cada causa se encontró corriendo y observando, nunca razonando desde el
  sillón.** El favicon, el trace, el umbral inventado y la caja del lienzo
  salieron los cuatro de mirar la ejecución real: la consola del navegador, el
  tiempo por acción, la medición contra el build, la caja medida cada 50 ms.
- **Una optimización se revirtió porque los datos la contradijeron.** Despachar
  los 121 clics como eventos sintéticos parecía obviamente más rápido; medido,
  alcanzaba menos huesos. Se volvió a los clics reales.
- **La aplicación nunca fue el problema.** Cuatro sesiones de gate rojo y cero
  defectos de producto: E2 estaba bien.

## What to improve

- **Un gate que nunca se ha ejecutado no es un gate, es una intención.** La
  suite se escribió, se reescribió y se optimizó entera antes de correrla una
  sola vez. Las tres primeras causas eran de las que aparecen en la primera
  ejecución; se pagaron una sesión más tarde de lo necesario.
- **"Intermitente" se aceptó como diagnóstico durante dos sesiones.** Se
  atribuyó al entorno —renderizado por software, contención de CPU— y se
  registró así en un handoff. Era un bug determinista con cara de ruido: una
  carrera entre el pintado de la lista y el dimensionado del lienzo. Etiquetar
  algo de intermitente **cierra** la investigación; debería abrirla.
- **Un umbral que nadie midió se puso, y luego se bajó, y luego se volvió a
  subir mal.** El `>= 8` original era inventado. El `>= 6` posterior se midió,
  pero con el andamiaje roto. Y en esta sesión se subió otra vez a 8 apoyándose
  en una sonda aislada que daba 10 de forma reproducible — y la suite real lo
  desmintió en la primera corrida. Tres iteraciones sobre un número que
  siempre estuvo a una medición de distancia.
- **T4 estaba en el "Done when" y se dio por hecho sin registro.** Peor: lo que
  se creía verificado se había "verificado" con el andamiaje roto, donde la
  suite estaba roja pasara lo que pasara. Un rojo no prueba nada si el gate
  está roto por su cuenta.

## Learned

1. **About the system:** un `<canvas>` mide `300x150` —su tamaño intrínseco
   según HTML— hasta que quien lo gobierna lo dimensiona, y en esta aplicación
   eso ocurre 0,14 s después de que la lista de huesos ya esté pintada, porque
   la lista sale del catálogo y el lienzo de react-three-fiber. Cualquier
   medición del lienzo hecha "cuando la página ya se ve" mide el tamaño
   equivocado. Además: `TARGET_HEIGHT` (1.7) coincide con la altura nativa del
   modelo, así que la normalización de escala es hoy una identidad — protege
   contra un cambio de activo, no contra nada observable ahora.

2. **About the process:** la intermitencia es una hipótesis, no un hallazgo. En
   las tres corridas que motivaron el `test.fixme` —20 s, 1,1 min, más de 2
   min— había un patrón determinista que nadie buscó porque "el sandbox es
   ruidoso" ya explicaba lo suficiente. Una explicación ambiental es la más
   cómoda de aceptar y la más difícil de refutar, y por eso merece más
   escepticismo que cualquier otra, no menos.

3. **Capability gained:** el proyecto tiene su segundo punto de entrada de
   gates, con una suite que se ha demostrado capaz de atrapar la clase de
   defecto que la motivó. De aquí en adelante, b2.1 y b2.2 no vuelven a llegar
   a quien abra la aplicación sin que el gate se ponga rojo primero.

## Outstanding

- **El criterio de aceptación 2 decía "decenas de huesos distintos" y la
  rejilla alcanza 6.** Resuelto en la review corrigiendo el criterio para que
  diga lo que el gate prueba de verdad: al menos 6 huesos, muy por encima de
  los 2 que deja la regresión. "Decenas" era lenguaje aspiracional escrito
  antes de medir nada — el mismo defecto que el umbral inventado de 8, y la
  tercera vez en esta historia que un número sin medición cuesta trabajo.
  Se descartó densificar la rejilla: con 121 puntos la sonda aislada alcanzó
  10, así que el techo parece estar en la resolución del esqueleto y no en la
  de la rejilla, y la prueba pasaría de ~45s a ~2min sin garantía de llegar.
- **La suite corre sobre renderizado por software aun en una máquina con GPU.**
  Chromium headless usa SwiftShader por defecto; `/dev/dxg` y las librerías
  NVIDIA de WSL están disponibles pero Playwright no las toma. No bloquea nada
  —el gate está verde y es estable— pero la premisa "en GPU esto va distinto"
  no se sostiene sin pasar banderas explícitas.
