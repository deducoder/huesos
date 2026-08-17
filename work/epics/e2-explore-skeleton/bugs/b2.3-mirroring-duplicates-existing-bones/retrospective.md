# Bug b2.3: Mirroring duplicates bones the model already brings whole — Retrospective

## Summary

- **Root cause:** la escena espejaba el modelo entero bajo una premisa de
  ADR-001 —«trae solo el hemicuerpo derecho más las piezas impares»— falsa en 36
  de sus 144 mallas: 34 están centradas *sobre* el eje del espejo y los
  parietales son el único par que el activo ya trae completo.
- **Fix approach:** no espejar lo que el modelo ya trae en su sitio, leyendo la
  partición que el propio activo declara en sus tres raíces (`Bones`,
  `Bones_right`, `Cartilages_right`), y **quitando** ese grupo del grafo de la
  copia espejada en las dos escenas que lo clonan.

## Prevention

- **Una afirmación sobre el contenido de un activo se escribe como test, no como
  prosa.** La premisa vivió dos épicas dentro de un ADR, donde nada la ejecuta.
  `tests/skeleton-asset.test.ts` ahora la compara contra el archivo: si el
  activo cambia y mete una pieza de línea media donde no toca, el gate rápido
  cae. Es la contramedida que habría evitado este bug y el hueco que b2.1 dejó
  sin cerrar.
- **Antes de inferir una regla midiendo, mirar si el activo ya la declara.** El
  análisis decidió derivar el criterio de las cajas de las 144 mallas, con una
  tolerancia de 2 mm que habría que justificar. El gemba del plan encontró que
  las raíces del modelo ya lo decían, exactamente y sin umbrales. El dato
  correcto estuvo ahí desde E1.
- **Pattern:** *premisa sobre datos externos* + *Design* → una decisión que
  afirma una propiedad de un activo y no la comprueba se convierte en una
  suposición que envejece en silencio, y el siguiente lector la hereda como
  hecho. Este es el segundo bug de la misma forma: b2.1 fue una suposición sobre
  los nombres del activo, y su lección se archivó como algo «sobre nombres» en
  vez de «sobre suposiciones no verificadas», así que no cubrió este caso.

## Learned

1. **About the system:** `visible = false` no saca una malla del raycaster de
   `three` — comprobado: una malla invisible devuelve 2 intersecciones. La
   primera versión del arreglo ocultaba en vez de quitar, y dejó 36 superficies
   invisibles que respondían al clic en el hemisferio contrario. También que la
   premisa del hemicuerpo estaba replicada en cuatro sitios del código además
   del ADR; corregir solo el que se toca deja las otras tres listas para
   reintroducir el bug.
2. **About the process:** **el defecto que quedó vivo lo encontró el usuario
   probando en vivo, con los dos gates en verde.** No fue mala suerte: la prueba
   de regresión mide *píxeles encendidos*, o sea el render, y el render ya era
   correcto — lo que estaba mal era lo que el rayo encontraba, que no se
   dibuja. Una prueba que observa una sola modalidad puede declarar cerrado un
   defecto que vive en otra, y el verde no distingue los dos casos. Dos cosas
   más del proceso: el primer rojo tras el arreglo fue **falso** —un
   `vite preview` huérfano hizo medir un bundle viejo, ver `findings.md`—, y la
   prueba de T1 nació con un instrumento ruidoso que se corrigió cambiando la
   base de comparación, no bajando el umbral, porque bajarlo habría dejado la
   prueba incapaz de medir cualquier hueso pequeño.
3. **Capability gained:** una partición del activo anclada por test y una
   función de dominio, `stripMidline`, que las dos escenas comparten — la
   tercera ocurrencia de «cargar el modelo y recorrerlo» que el parking lot de
   E3 esperaba para decidir qué extraer llegó por otro camino: lo que se
   compartió no fue el recorrido sino la preparación de la copia espejada.

## Lo que este bug deja nombrado

- `findings.md` recoge cuatro hallazgos con destino: el gate de integración que
  puede medir un build viejo, los procesos `vite preview` huérfanos, la ausencia
  de `triage.md` en b2.1 y b2.2, y la afirmación falsa sobre la caché en el
  `session-start` de este repositorio.
- **El alcance se ensanchó a `IsolatedBoneScene`** y queda declarado en
  `progress.md`: el `WHERE` del scope solo nombraba `SkeletonScene`.
- **Sin prueba automática del síntoma que reportó el usuario.** Intenté dos
  veces una sonda de navegador que pulsara una rejilla y comparara el lado del
  hueso contra la mitad de la imagen; la primera dio 36 falsos positivos
  —arrastraba la selección anterior cuando el clic no impactaba— y la corregida
  se quedó con 2 muestras útiles. Se borró en vez de dejar una prueba que no
  mide lo que dice. Lo que hoy vigila ese caso es la prueba de `stripMidline`
  con un `Raycaster` real, que cubre el mecanismo pero no el gesto.
