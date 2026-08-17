# Story e4.4: Modo test sobre hueso individual — Retrospective

Estimated: XS (1-2 tareas) · Actual: 1 tarea + 2 correcciones de calidad

## Summary

`BoneTestView` compone `TestQuestion` (e4.2/e4.3) + `IsolatedBoneScene`
(e3.1) sin código propio — la composición confirma que ambos quedaron bien
desacoplados. La verificación manual encontró dos defectos reales
heredados de `IsolatedBoneScene`, ninguno relacionado con esta historia en
sí: una fuga de `must-data-003` por `aria-label` y huesos diminutos
invisibles por recorte de cámara. Ambos arreglados.

## What went well

- La composición de T1 salió sin fricción — cero líneas de lógica propia,
  la prueba de que e4.2 y e3.1 se diseñaron con los límites correctos.
- El hallazgo del `aria-label` se atrapó con una prueba deliberadamente
  diseñada para reproducir el bug real antes de arreglarlo (el doble
  calcula el label como lo hace el componente real, no un valor inventado)
  — RED genuino, no un test que pasaría igual sin el fix.
- El hallazgo del recorte de cámara se investigó con el mismo rigor que
  e4.3 aplicó a una sospecha (capturas de control, 5 huesos al azar
  post-fix) — no se dio por resuelto con un solo caso.

## What to improve

- **`IsolatedBoneScene` acumula tres hallazgos reales en tres verificaciones
  distintas** (e3.1: aria-label genérico; e4.2 fue sobre `SkeletonScene`,
  no esta; e4.4: aria-label con fuga + recorte de cámara). Es un componente
  con WebGL, fuera de cobertura automática por ADR-002 — cada nuevo
  consumidor lo somete a un caso de uso que los anteriores no probaron. Para
  el próximo componente WebGL nuevo (si E5 o algo posterior necesita uno),
  vale la pena, en su primera historia, verificar explícitamente con un
  caso extremo de tamaño (el hueso más chico del catálogo, no solo uno
  "típico") — habría atrapado el recorte de cámara en e3.1 en vez de en
  e4.4.

## Learned

1. **About the system:** `IsolatedBoneScene` nunca se probó con un hueso
   realmente pequeño hasta e4.4 — todas las verificaciones previas (e3.1,
   e3.2) usaron huesos grandes o medianos (fémur, sacro, esternón) como
   ejemplo. El catálogo tiene huesos de tamaños muy dispares (un fémur
   completo vs. una falange), y "encuadrar automáticamente cualquier hueso"
   necesitaba probarse contra ese rango, no contra un caso cómodo.
2. **About the process:** dos defectos reales en la misma tarea de
   verificación manual, en el mismo componente, por razones no
   relacionadas entre sí (uno de accesibilidad, otro de renderizado) —
   confirma que "verificar a mano" no es una sola pregunta ("¿se ve
   bien?") sino varias preguntas distintas que conviene hacerse por
   separado: ¿qué anuncia un lector de pantalla?, ¿se ve con el caso más
   chico y el más grande?, ¿el flujo completo (pregunta→respuesta→
   corrección) sigue intacto?
3. **Capability gained:** el patrón `near={valor pequeño}` en
   `PerspectiveCamera` de drei cuando el encuadre es dinámico y el rango de
   tamaños de lo encuadrado es amplio — reusable en cualquier escena futura
   con encuadre automático sobre objetos de tamaño muy variable.
