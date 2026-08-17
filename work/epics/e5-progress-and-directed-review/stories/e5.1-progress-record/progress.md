# Story e5.1: Progress record — Progress

## T1 · El registro y la lectura de un hueso

`src/domain/progress.ts` con `BoneProgress` (dos contadores), `ProgressRecord`
(plano, indexado por `Bone.id`, `Readonly`), `EMPTY_PROGRESS` y
`boneProgress(record, boneId)`, que devuelve `{ correct: 0, incorrect: 0 }`
para un `id` ausente en vez de `undefined`.

RED: los tres tests fallaron por módulo inexistente antes de escribirlo.
Gate: `./scripts/check` verde — 144 tests (los 141 de `main` más 3 nuevos).
Desviación: los campos se nombraron en inglés (`correct`/`incorrect`) y no en
español como decía el ejemplo original del `scope.md`, para seguir el resto de
la superficie exportada del proyecto (`Bone` usa `id`, `side`, `meshName`). El
`scope.md` se corrigió antes de implementar, no después.
