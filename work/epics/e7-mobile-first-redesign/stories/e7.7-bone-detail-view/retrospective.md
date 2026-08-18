# Story e7.7: Ficha del hueso — Retrospective

Estimated: XS, 1 tarea · Actual: XS, 1 tarea. La primera historia de la
épica donde el tamaño estimado y el real coinciden exactamente.

## Summary

El botón «← Volver» de `BoneDetailView` pasa de 34×83 a ≥44×44 px, con el
mismo tratamiento de borde y radio que el resto del rediseño. 233 tests
unitarios y 14 de navegador en verde.

## What went well

- **El gemba de arranque midió antes de proponer trabajo**, y encontró que
  la mayor parte de esta vista ya estaba resuelta por otras historias
  (e7.2, e7.5, e7.6) al compartir `BoneIdentity` e `IsolatedBoneScene`. El
  scope se redujo a lo que de verdad faltaba, en vez de asumir una historia
  del mismo tamaño que sus vecinas.

## What to improve

- Nada específico — la historia salió exactamente como se planificó.

## Learned

1. **About the system:** compartir componentes entre vistas (`BoneIdentity`
   en Explorar, Fichas y la ficha completa) significa que rediseñar una
   vista adelanta trabajo de las demás sin que nadie lo planifique
   explícitamente — el costo de e7.7 se pagó, en gran parte, en e7.5 y e7.6.
2. **About the process:** una historia XS con una sola tarea no necesita
   forzar más ceremonia de la que ya tiene — el mismo flujo completo
   (scope → design → plan → implement → review → close) cabe en un cambio
   de una línea sin volverse burocracia, porque cada paso fue proporcional
   al tamaño real.
3. **Capability gained:** ninguna nueva — reutilización de patrones ya
   establecidos.

## Para el plan de e7.8

- Antes de diseñar e7.8, medir primero cuánto de `TestQuestion` ya
  quedó cubierto indirectamente por el barrido de tokens de e7.1, como pasó
  acá con `BoneIdentity`.
