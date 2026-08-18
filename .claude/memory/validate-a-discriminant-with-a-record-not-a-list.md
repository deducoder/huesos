---
name: validate-a-discriminant-with-a-record-not-a-list
description: "Un `Record<Union, true>` valida el discriminante de una unión con exhaustividad; una lista de cadenas acepta la omisión en silencio."
metadata: 
  node_type: memory
  type: reference
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T05:54:10.763Z
---

Para validar en tiempo de ejecución el discriminante de una unión
etiquetada, usar `Record<Union, true>` con `Object.hasOwn`, no un array de
cadenas.

**Why:** el `Record` sobre la unión exige exhaustividad — añadir una
variante al tipo sin registrarla es error de compilación. Una lista
tipada `readonly string[]` la aceptaría en silencio, que es exactamente el
problema aparcado desde e5 con `esProgresoDeHueso` en
`src/storage/progress-store.ts`: un validador que re-codifica a mano la
forma de su tipo y se desincroniza sin que nada avise. Y `Object.hasOwn`
en vez de `in` evita que `'constructor'` o `'toString'` pasen por la
cadena de prototipos.

**How to apply:** el precedente está en `esModo`, `src/App.tsx` (e9.6). Es
la salida a aplicar si se retoma la entrada del parking lot sobre
`esProgresoDeHueso`.
