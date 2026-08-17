# Story e3.1: Escena de hueso aislado — Progress

## T1 · Función pura: qué malla es visible al aislar un hueso

`src/domain/isolation.ts` — `visibleForIsolation(bones, meshName, half, targetId)`,
delega en `boneIdForMesh` ya existente. Cubre los cinco casos del plan: par en
lado correcto, par en lado contrario, impar en cualquier mitad, otro hueso,
malla sin catálogo (diente y manubrio del esternón, sin caso especial). Gate:
verde (94 tests, típecheck y lint limpios). Ninguna desviación del plan.
