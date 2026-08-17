# Story e7.3: Tipografía empaquetada — Retrospective

Estimated: S, 3-4 tareas · Actual: S, 5 commits de código. La talla acertó y
el reparto también — la primera vez en la épica que el plan no necesitó ajuste.

## Summary

`public/fonts/fredoka-latin-600.woff2` (16.468 bytes) y su licencia OFL, servidos
desde el propio origen y declarados en `@font-face` con `--font-display` como
token. El `h1` de la cabecera es el único consumidor hasta ahora; el cuerpo
conserva la pila del sistema. `tests/typography.test.ts` vigila presupuesto y
cobertura de los 72 caracteres del catálogo. `ADR-008` registra la elección
—Fredoka 600, sobre cinco candidatas renderizadas con texto real— y las cuatro
descartadas con su razón. Confirmado en teléfono real por el túnel. 211 tests
unitarios y 9 de navegador en verde.

## What went well

- **Medir el repertorio real antes de elegir cualquier cosa.** El catálogo usa
  72 caracteres y el único fuera de Latin-1 es `—`. Sin esa medición, la
  pregunta «¿hace falta subsetear a mano?» se habría respondido por reflejo
  —sí, siempre se subsetea— en vez de por evidencia: el `latin` que Google ya
  distribuye lo cubre entero.
- **Comparar candidatas con el texto de la aplicación, no con un pangram.**
  «huesos-mono» y «hueso cigomático izquierdo» a 390 px de ancho mostraron
  diferencias —altura de x, cómo se lee un nombre largo— que una muestra
  genérica no habría revelado.
- **No instalar `fontTools` para reproducir un recorte que ya estaba hecho.**
  La pregunta correcta no fue «¿cómo subseteo?» sino «¿hace falta subsetear?»,
  y la respuesta cambió toda la forma de la tarea uno.
- **La regresión de e7.2 no volvió a ocurrir.** Con el túnel avisado y
  `npx vite build` antes de cada medición de navegador, ninguna sonda midió un
  build viejo esta vez — la lección se aplicó, no solo se escribió.

## What to improve

- **La prueba de familia por sí sola no basta, y casi se dejó así.** El primer
  borrador solo comprobaba `getComputedStyle().fontFamily`, que sigue diciendo
  "Fredoka" aunque el archivo no cargue. Se corrigió antes del commit, no
  después de una revisión — pero es la clase de hueco que conviene nombrar la
  primera vez que aparece, no confiar en que se note siempre a tiempo.
- **El gate de repertorio confía en el `unicode-range` declarado, no en el
  archivo.** Es una limitación conocida y a propósito —comprobar glifos reales
  exige un navegador o una librería de fuentes, y esta historia no las tiene—
  pero queda dependiendo enteramente de la verificación humana para detectarla
  si algún día el rango miente.

## Learned

1. **About the system:** los `.woff2` que Google Fonts sirve por subset **ya
   vienen recortados**; empaquetarlos no exige herramientas de subsetting
   propias, solo elegir el subset correcto y verificar que cubre el dominio real
   de texto de la aplicación. `unicode-range` es una promesa del CSS, no una
   propiedad del archivo — las dos pueden desalinearse sin que ningún test que
   no abra un navegador lo note.
2. **About the process:** cuando una decisión es puramente visual —qué
   tipografía, qué color, qué forma— la mejor herramienta es una muestra
   renderizada con datos reales de la aplicación, no una tabla de
   características. Cinco archivos descargados y una captura decidieron en
   minutos lo que una comparación en abstracto habría discutido más.
3. **Capability gained:** el proyecto ya sabe extraer su propio repertorio de
   caracteres desde el catálogo (`textoDelCatalogo`), así que la próxima vez
   que haga falta —otra fuente, otro idioma— la pregunta «¿qué tengo que
   cubrir?» tiene una respuesta de una línea en vez de una sonda nueva.

## Para el plan de e7.4

- **e7.4 hereda el patrón de verificación con texto real.** Antes de fijar la
  forma del navegador de 206 huesos, renderizar con los nombres más largos del
  catálogo real —no "hueso genérico"— de la misma manera que e7.3 renderizó con
  «hueso cigomático izquierdo» y no con un pangram.
- **Confirmar `--font-display` en el navegador antes de usarlo en tarjetas de
  206 elementos.** Si e7.4 decide llevar la display a los encabezados de
  región, medir ahí también el costo de layout con `document.fonts.ready`: 206
  repintados por una fuente que llega tarde es una historia distinta a un
  título único.
