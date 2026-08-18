# Story e7.8: Modo test — Retrospective

Estimated: S, 2-3 tareas · Actual: S, 2 tareas. Talla y contenido acertados.

## Summary

Los cinco controles del modo test —elección de variante, campo de
respuesta, «Responder», «Siguiente pregunta»— pasan al mínimo táctil de
44 px, con el mismo patrón de borde y radio del resto del rediseño. El
campo y su botón siguen en una sola fila sin desbordar 390 px. 233 tests
unitarios y 16 de navegador en verde.

## What went well

- **El gemba corrigió una suposición de la propia épica antes de escribir
  código.** El `design.md` de E7 decía que el campo y el botón «no caben
  cómodos en 390 px»; medido, sí caben — el problema real era el mínimo
  táctil, no el ancho. Sin esa medición, la historia habría podido
  rediseñar un layout que no hacía falta tocar.
- **Verificar el riesgo en vez de asumirlo.** El plan nombraba explícitamente
  el riesgo de que crecer la altura desbordara la fila; T2 lo midió después
  del cambio, no antes de aceptarlo.

## What to improve

- Nada específico — segunda historia seguida (después de e7.7) donde lo
  estimado y lo real coinciden sin sorpresas.

## Learned

1. **About the system:** el modo test es la única parte de la aplicación
   sin navegador ni panel de identidad — las dos vías accesibles que otras
   vistas comparten no aplican acá, y eso ya estaba correctamente resuelto
   desde antes de esta épica (`accessibleHint`/`accessibleLabel` propios,
   sin mención de listas).
2. **About the process:** cuando una épica describe un problema («no caben»)
   y el gemba de la historia mide algo distinto, el lugar correcto para la
   corrección es el propio `scope.md` de la historia —como ya se hizo
   aquí y en e7.2—, no una discusión sobre si la épica se equivocó.
3. **Capability gained:** ninguna nueva — reutilización directa de patrones
   ya establecidos en seis historias anteriores.

## Para el epic-review

- **Las seis vistas ya comparten el mismo mínimo táctil de 44 px.** Es el
  primer criterio del `Done when` de la épica; vale la pena confirmarlo
  explícitamente en la revisión del epic, historia por historia, en vez de
  darlo por hecho porque cada una lo dijo por separado.
