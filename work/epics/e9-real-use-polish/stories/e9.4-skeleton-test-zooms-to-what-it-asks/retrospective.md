# Story e9.4: The skeleton test zooms to what it asks — Retrospective

Estimated: M · Actual: M — 3 tareas planeadas, más 2 hallazgos reales de la
verificación manual, más 1 hallazgo de la propia review; 10 commits.

## Summary

En el modo test de esqueleto completo, la cámara se acerca a la zona del
hueso señalado en vez de mostrar las 206 piezas a distancia fija siempre.
Reutiliza `frameObject`/`distanceToFit` (e9.3) sin cambiarlos, y el patrón
de cámara controlada de `IsolatedBoneScene.tsx` (e3.1/e9.3). `SkeletonScene`
gana un prop opcional `zoom?: { reservedBottom: number }`: ausente,
`ExploreView` sigue exactamente igual, verificado por diff vacío.

`./scripts/check` verde (327 tests), `./scripts/check-integration` 32 de
32, verificado a mano por el humano en el teléfono — con dos rondas de
correcciones reales encontradas ahí, no antes.

## What went well

- **La decisión sobre `ExploreView` se resolvió con evidencia, no con
  supuesto.** El scope la dejó abierta a propósito; el design la cerró
  agrupando `reservedBottom` dentro de un `zoom` opcional, de forma que no
  hay tipo válido que "active el zoom y olvide la reserva" — y el legacy
  sweep confirmó por diff que `ExploreView.tsx` no cambió ni una línea.
- **Reutilizar `boneIdForMesh`/`esteHueso` en vez de una segunda
  comparación evitó reintroducir el bug de b2.1** (mallas compartidas entre
  pares de un mismo lado) sin necesitar pensarlo de nuevo: la resolución
  correcta ya vivía en el código, solo hacía falta engancharse a ella.
- **Cada hallazgo de la verificación manual se investigó con el mismo rigor
  que un hallazgo de código**, no como un parche apurado: instrumentación
  temporal, número real antes de teorizar, mutación forzada antes de
  confirmar, y en el segundo caso una reproducción aislada del bug fuera
  del proyecto antes de tocar el archivo real.

## What to improve

- **Copiar un patrón de referencia no es copiar todo lo que ese patrón
  resuelve.** El plano cercano (`near={0.001}`) era parte del mismo
  paquete que la cámara controlada en `IsolatedBoneScene.tsx`, documentado
  ahí mismo con el motivo exacto (huesos diminutos, e4.4) — y aun así no se
  copió hasta que apareció en el teléfono. Mejora de proceso: **al
  reutilizar un componente de referencia, listar explícitamente todo lo que
  resuelve, no solo el mecanismo que motivó la copia**, y verificar cada
  pieza contra el nuevo contexto.
- **`CenteredSkeleton` introdujo un nivel de anidamiento que
  `IsolatedGroup` nunca tuvo, y el diseño no lo vio.** El patrón de
  `updateMatrixWorld` se copió literalmente (`copia.updateMatrixWorld`)
  sin notar que, acá, `copia` tiene un padre con transformación propia
  que `IsolatedGroup` no tiene. Ningún test lo hubiera atrapado —jsdom no
  renderiza WebGL— y el propio quality-review casi lo deja pasar sin
  guardia hasta que se revisó explícitamente si algo vigilaba la línea
  exacta del fix.
- **El checkpoint del plan de la épica —E2E completo tras e9.4, antes de
  e9.7— cobra más sentido después de esta historia que antes**: dos
  defectos reales, ninguno visible en 327 tests unitarios, los dos
  encontrados solo con la aplicación corriendo de verdad.

## Learned

1. **About the system:** `CenteredSkeleton` (el esqueleto completo) y
   `IsolatedGroup` (un hueso aislado) parecen el mismo problema —medir una
   caja mundial y encuadrar la cámara— pero tienen una diferencia
   estructural real: uno vive dentro de un grupo con `offset`/`scale`
   propio, el otro **es** la cima de su propia jerarquía. Cualquier
   patrón de three.js que dependa de `matrixWorld` tiene que verificar en
   cuál de los dos casos está antes de copiarse.
2. **About the process:** un defecto invisible en la suite automática (por
   límite de la herramienta, no por falta de cobertura) exige el mismo
   nivel de investigación que uno que sí se puede testear — instrumentar,
   medir, reproducir en aislamiento si hace falta — y exige además
   preguntarse, después de arreglarlo, si hay una forma de dejar una
   guardia aunque sea parcial (código fuente, no comportamiento) para que
   la próxima vez no dependa de nuevo de un teléfono.
3. **Capability gained:** un método concreto para depurar timing de
   `matrixWorld` en react-three-fiber —instrumentar la traslación de la
   matriz del padre en el punto exacto donde se lee, no adivinar por
   síntomas visuales— reutilizable en cualquier futura escena que combine
   grupos anidados con medición geométrica dinámica.
