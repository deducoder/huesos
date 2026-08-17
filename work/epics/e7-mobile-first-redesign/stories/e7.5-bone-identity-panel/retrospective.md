# Story e7.5: Panel de identidad — Retrospective

Estimated: S, 2-3 tareas · Actual: S, 5 commits de código (3 planeadas + un
arreglo de la revisión). La primera historia de la épica sin sorpresas en la
implementación — el gemba de arranque ya había encontrado todo lo que hacía
falta.

## Summary

`BoneIdentity` recibió los tres cambios mecánicos que e7.1 le había dejado a
medio camino —botón a 44 px, título con `--font-display`, borde/radio
coherentes— y uno de lógica: el campo «Lado» y su anuncio en vivo dejan de
mostrarse para un par sin geometría en ningún lado, porque el navegador
tampoco ofrece elegir su lado desde e7.4. `siblingId`, que `navigator-rows.ts`
resolvía con su propia expresión regular, se extrajo a un módulo compartido
que ahora usan los dos. 231 tests unitarios y 12 de navegador en verde.

## What went well

- **El gemba de la historia anterior alimentó directamente el scope de
  esta.** La retrospectiva de e7.4 dejó escrito «revisar si `BoneIdentity`
  necesita el mismo matiz» y esa frase se convirtió, literalmente, en el
  criterio de aceptación 3 de esta historia — es la primera vez en la épica
  que el aprendizaje `learnings-should-change-the-next-plan` se aplicó desde
  el arranque, no reconstruido a mitad de implementación.
- **Extraer antes de duplicar, con la duplicación real delante.** La regex de
  `-right$`/`-left$` ya existía en `navigator-rows.ts`; esta historia
  necesitaba la dirección inversa (`-left$`→`-right$`), y en vez de escribir
  una segunda regex se extrajo `siblingId` bidireccional. Es el momento
  correcto para extraer —cuando aparece el segundo consumidor real, no antes.
- **El contrato "nunca oculta ante la duda" se escribió como test antes que
  como código.** El caso del opuesto inexistente en el catálogo estaba en el
  RED de T1, no se agregó después de pensarlo dos veces.
- **Las tres tareas salieron exactamente como el diseño las dejó escritas.**
  Ninguna sorpresa de implementación — contraste con e7.4, donde el `py-0.5`
  del prototipo se comió parte de la ganancia proyectada. Acá el design tenía
  clases concretas de antes/después y el componente real las reprodujo al
  pixel.

## What to improve

- **`isSideIrrelevant` se probó seis veces y ninguna con el lado izquierdo
  como primario.** La función es simétrica de verdad —confirmado manualmente
  antes de escribir el test que faltaba—, pero nada lo protegía. Escribir
  `siblingId` bidireccional y probarlo bidireccionalmente, y después probar
  `isSideIrrelevant` solo en una dirección, es una inconsistencia de rigor
  entre dos funciones del mismo archivo.

## Learned

1. **About the system:** dos historias seguidas (e7.4, e7.5) necesitaron la
   misma pregunta —«¿este par es indistinguible en lo observable?»— desde dos
   ángulos distintos (una lista completa, un hueso solo). La respuesta ahora
   vive en un solo módulo (`side-pairing.ts`) en vez de dos implementaciones
   que podrían haber divergido con el tiempo.
2. **About the process:** cuando una función maneja una relación simétrica
   (A↔B), cada test que ejercita la relación en una sola dirección es una
   promesa a medias. La revisión de calidad la encontró porque comparó el
   rigor de dos funciones del mismo commit una contra la otra
   (`siblingId` bidireccional vs `isSideIrrelevant` unidireccional), no
   porque hubiera un caso conocido que fallara.
3. **Capability gained:** el proyecto tiene ahora un patrón reutilizable para
   «¿vale la pena distinguir el lado de este hueso en la interfaz?», separado
   de «¿es este hueso par?» (`isUnpaired`). La próxima vista que necesite esa
   distinción —el modo test, si algún día decide incluir huesos sin malla—
   importa `isSideIrrelevant` en vez de redescubrir la pregunta.

## Para el plan de e7.6

- **e7.6 decide el layout definitivo de `ExploreView` con las tres piezas ya
  rediseñadas** (lienzo, navegador, identidad). Las tres ya están al mínimo
  táctil y con la tipografía display donde corresponde — e7.6 no debería
  encontrar sorpresas de ese tipo, solo la composición.
- **Revisar `~/refs/cards.jpg`** (parqueado desde e7.2) antes de cortar el
  diseño: la propuesta de tarjeta flotante para la identidad, tras
  seleccionar, es la decisión pendiente más grande que esta historia no
  tomó a propósito.
