# Story e7.2: El lienzo en pantalla chica — Retrospective

Estimated: M, 4 tareas · Actual: M, 6 commits de código. Dos tareas del plan no
existieron como se habían escrito —una porque el defecto no estaba, otra porque
la verificación humana produjo trabajo nuevo— y aun así la talla acertó.

## Summary

En 390×844 el lienzo pasó de `390×150` —el 17.8% del alto, escondido en `y=574`
detrás de 206 huesos— a la mitad de la pantalla, visible al cargar. El esqueleto
se dibuja sobre una superficie propia (`--color-lienzo: #4a4640`) que le devuelve
el contorno y hace inequívoco el resaltado del hueso elegido. Y el lienzo se
quedó con sus gestos: `touch-action: none`, sin lo cual girar en vertical con el
dedo seleccionaba un hueso que nadie quiso. Cuatro pruebas de navegador nuevas en
390×844; 8 en total, todas verdes.

## What went well

- **La apuesta del design se sostuvo: no se tocó ninguna escena para
  dimensionar.** `SkeletonScene` e `IsolatedBoneScene` ya pedían `h-full w-full`;
  el defecto vivía en el padre y el arreglo fue una clase de grid. Leer antes de
  proponer ahorró la historia entera.
- **El riesgo más caro de la épica se descargó antes de escribir código.** Una
  captura del lienzo en el primer gemba bastó para ver que el esqueleto se lee
  sobre claro. La épica lo había puesto segundo por si obligaba a replantear la
  dirección visual; no hizo falta.
- **La superficie se eligió por una razón funcional, no estética.** El azul
  grisáceo se veía bien hasta que se seleccionó un hueso: el resaltado es
  `#38bdf8` y sobre un fondo azulado desaparece. Sin la captura *con un hueso
  elegido*, la comparación habría premiado la peor opción.
- **Las dos frases que e7.1 dejó para este plan se aplicaron y sirvieron.** El
  gate fue la tarea uno, y `explore.spec.ts` corrió en cada tarea en vez de al
  final.

## What to improve

- **Medí tres veces contra un build viejo sin darme cuenta.** El `vite preview`
  levantado a mano para el túnel se quedó ocupando el 4173, y
  `playwright.config.ts` trae `reuseExistingServer: !process.env.CI`: la suite
  reutilizó ese servidor en vez de construir. Llegué a concluir «la regla CSS no
  se aplica» cuando la regla no estaba en el bundle servido. Lo cacé buscándola
  en `dist/assets/*.css` y encontrándola: el navegador y el artefacto se
  contradecían, y el artefacto tenía razón.
- **Afirmé un hecho técnico con evidencia inválida.** «`<Canvas className>` no
  llega al canvas» era cierto, pero lo había medido contra ese build viejo.
  Reprobarlo en limpio costó dos minutos; darlo por bueno habría dejado un
  comentario mintiendo en el código.
- **El arreglo del gesto salió sin prueba** y solo apareció en la revisión de
  calidad. Era justo el defecto que más caro había costado encontrar.

## Learned

1. **About the system:** un grid con `h-full` y filas automáticas **reparte el
   sobrante**, así que el lienzo de la ficha —dos zonas, la segunda corta—
   siempre estuvo bien. Lo que rompía Explorar era la fila de 206 huesos
   reclamando más alto del disponible: sin sobrante no hay reparto, y el canvas
   cae a su intrínseco. El defecto no era «falta altura» sino «una fila con
   contenido enorme absorbe el reparto» — y e7.6, que rehará ese layout, lo
   reintroduce si quita el `minmax(0,…)` sin quitar la lista larga.
2. **About the process:** un servidor de desarrollo levantado a mano para una
   demo envenena la suite que lo reutiliza. Mientras haya uno vivo, ninguna
   medición de navegador vale sin reconstruir.
3. **Capability gained:** el proyecto puede exponerse a un teléfono real por
   túnel en un minuto, y la sesión demostró que ahí aparece lo que ninguna
   emulación ve. El túnel deja de ser una anécdota y pasa a ser parte de la
   verificación manual de cualquier historia de E7.

## Para el plan de e7.3

- **La tipografía se verifica en teléfono, no en captura.** Es la historia que
  decide una familia display por su aspecto, y esta sesión mostró que el juicio
  visual sobre pantalla real no coincide con el del monitor. El túnel ya está
  probado; usarlo antes de dar por buena una candidata.
- **Reconstruir antes de medir, o matar el preview.** Si e7.3 levanta la
  aplicación para mirar tipografías, la suite de navegador que corra después
  mide lo que sirve ese proceso, no lo que hay en `src/`.
