# Story e9.2: The test result points at the right answer — Retrospective

Estimated: M · Actual: M — 4 tareas planeadas, 8 commits de código y prueba
(uno de ellos, T4, sin cambio de producción propio).

## Summary

Tras responder una pregunta de opción múltiple, la grilla de tres opciones se
queda montada y se recalifica: la correcta en verde con `✓`, la elegida en
rojo con `✗` si erró, la tercera sin marca. El mismo botón muta de
«Responder» a «Siguiente pregunta» en vez de que aparezca uno nuevo junto a
un panel de texto. `onViewDetail` y `onCambiarModo` pasan a requeridas en
sus cinco componentes. `BoneTestView` reserva el alto real de su barra de
respuesta, con `useFraccionCubierta` extraído a un módulo compartido.
`metacarpiano`/`metatarsiano` dejan de desbordar su botón.

`./scripts/check` verde (321 tests), `./scripts/check-integration` 32 de 32,
verificado a mano por el humano en el teléfono.

## What went well

- **Dos falsos verdes propios, encontrados antes de commitear.** El primer
  RED de T1 capturaba una referencia DOM antes de que se desmontara y volvía
  a consultarla después — con el código viejo, seguía leyendo hijos de un
  nodo huérfano y daba verde sin haber probado nada. El primer RED de T3
  afirmaba `dataset.reservedBottom !== ''`, verdad hasta con el `0` literal
  que se quería eliminar. Los dos se detectaron corriendo el test contra el
  código *sin tocar* y viendo que pasaba cuando debía fallar — el mismo
  hábito, aplicado dos veces en la misma historia.
- **Un defecto real disfrazado de intermitencia, investigado hasta la
  causa.** «Elegir una opción incorrecta…» empezó a fallar ~25 % de las
  veces al correr el gate completo. En vez de asumir flaky, se reprodujo
  con volumen (10+ corridas) y se encontró la causa exacta: T1 deja la
  grilla montada, así que el botón correcto también muestra el nombre del
  hueso, y para 45 de 120 huesos —los que `shortName` solo capitaliza—
  buscar el nombre en todo el documento encuentra dos coincidencias.
- **El e2e imposible de hacer determinista se documentó como tal, con el
  número.** `must-data-003` le prohíbe a Playwright saber qué hueso salió
  sorteado en el modo test. En vez de fingir certeza o renunciar a la
  prueba, se midió la tasa de detección por muestra (~12 %) y se calculó
  cuántas repeticiones hacían falta para una confianza razonable (12,
  ~80 %) — la incertidumbre quedó escrita en el propio archivo, no oculta.

## What to improve

- **Una tarea del plan (T4) se implementó sin querer dentro de otra (T1).**
  `[hyphens:auto]` se agregó al mismo tiempo que `estadoOpcion` porque
  vivían en el mismo bloque JSX, y no se marcó como tal hasta escribir el
  progreso de T4. El plan había ordenado T4 después por menor riesgo, pero
  el orden real lo decidió la cercanía en el archivo, no el plan. Mejora de
  proceso: cuando dos tareas tocan el mismo bloque de código, señalarlo en
  el plan como riesgo de superposición, no asumir que el orden declarado se
  va a respetar en la práctica.
- **Un test quedó con un atributo que nadie leía**, resto de un RED
  descartado. `quality-review` lo encontró, no la propia implementación —
  señal de que revisar el diff completo antes de cerrar una tarea, no solo
  correr el gate, habría sido más barato que esperar a la review.

## Learned

1. **About the system:** dejar la grilla montada después de responder
   (en vez de sustituirla) tiene una consecuencia no obvia: cualquier texto
   que antes vivía solo en el panel de resultado ahora puede repetirse en
   un botón de la grilla, y una búsqueda de texto sin acotar deja de ser
   inequívoca. Es un patrón que se repetirá en cualquier historia futura
   que mantenga visible lo que antes se reemplazaba.
2. **About the process:** un test puede tener dos formas de mentir con
   verde — leyendo una referencia stale, o afirmando una propiedad que el
   caso "malo" también satisface. Las dos se atrapan con el mismo
   instrumento: correr el RED contra el código que se quiere reemplazar y
   mirar si de verdad falla.
3. **Capability gained:** un patrón para verificar plomería (que un
   argumento nuevo llegue a destino) sin necesitar que el valor sea
   observable en jsdom — un espía que solo afirma el *tipo* del argumento,
   más un test source-level para el archivo que lo consume, cuando ni
   siquiera el tipo alcanza a distinguirse en render.
