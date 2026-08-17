# Story e2.4: Skeleton scene — Retrospective

Estimated: M · Actual: M, 2 commits

## Summary

La escena existe: canvas de react-three-fiber que carga el modelo con un
decodificador Draco servido desde el propio sitio, con órbita y zoom, y con el
hemicuerpo izquierdo espejado para completar el esqueleto.

## What went well

- **El guardrail de privacidad guio el diseño en vez de auditarlo después.**
  `must-privacy-006` obligó a copiar el decodificador a `public/` desde el
  principio; usar el CDN habría sido lo cómodo y habría incumplido en silencio.
- **Se copió solo el decodificador de glTF**, 756 KB en vez de los 1,8 MB del
  directorio entero de three.
- **El fallo llegó donde el plan dijo que llegaría.** ADR-002 y el plan del epic
  anticiparon que el canvas no sería verificable en jsdom; cuando `ResizeObserver`
  reventó las pruebas, ya estaba decidido qué hacer y por qué. No hubo
  improvisación.

## What to improve

- **La escena no se ha visto.** No hay navegador en este entorno, así que el
  criterio «se ve el esqueleto» queda **sin verificar**. El resto se comprobó a
  conciencia —tamaños, códigos HTTP, la ruta del decodificador dentro del
  bundle—, pero eso no es lo mismo y no lo voy a presentar como si lo fuera.
- **Sustituir un componente por un doble siempre es una deuda de confianza.** Está
  justificado y el motivo está escrito en el archivo, pero significa que
  `ExploreView` se prueba sin su tercera proyección.
- **El aviso de chunk mayor de 500 KB apareció y no se atendió**, por la ratonera
  declarada en el brief: medir antes de optimizar. Queda dicho.

## Learned

1. **About the system:** el modelo trae solo el hemicuerpo derecho, así que el
   esqueleto completo se compone dibujando la escena dos veces, la segunda con
   `scale=[-1, 1, 1]`. Eso significa que **cada malla existe dos veces en la
   escena**, y e2.5 tendrá que distinguir cuál se ha pulsado para saber el lado.
2. **About the process:** cuando una capa no es verificable automáticamente, lo
   valioso es decidir **qué sí se puede verificar** —el guardrail, la ruta, los
   bytes servidos— en vez de rendirse o de fingir cobertura.
3. **Capability gained:** el proyecto renderiza su propio activo 3D sin depender
   de ningún servicio externo, y sabe construirlo y servirlo entero desde su
   origen.
