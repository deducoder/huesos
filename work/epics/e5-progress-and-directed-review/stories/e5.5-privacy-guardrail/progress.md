# Story e5.5: Privacy guardrail, actually gated — Progress

## T1 · El ángulo estático: nadie lo escribió

`tests/privacy.test.ts` recorre `src/` (código propio, sin pruebas) y falla
ante `fetch(`, `XMLHttpRequest`, `sendBeacon` o `new WebSocket`, nombrando el
archivo infractor. Sólo el código propio: analizar el bundle daría falsos
positivos por terceros que nunca se ejecutan.

Lleva un **segundo test que comprueba que el recorrido recorre algo** (más de
15 archivos, `App.tsx` entre ellos, ninguno de prueba). Sin él, un error en el
recorrido daría lista vacía y el primero pasaría sin haber mirado nada: verde
por no haber buscado.

RED provocado introduciendo el defecto de verdad — ver T3.
Gate: `./scripts/check` verde — 184 tests.

## T2 · El ángulo en ejecución: nadie lo llamó

`tests/privacy-runtime.test.tsx` monta la aplicación entera con `fetch`,
`XMLHttpRequest` y `navigator.sendBeacon` sustituidos por espías, navega, y
**responde una pregunta del modo test** — que es exactamente donde nace y se
guarda el progreso del estudiante.

Atrapa lo que el ángulo estático no puede: una **dependencia** que telefonee a
casa por su cuenta. Lleva también su propia comprobación de que los espías
detectan de verdad una llamada.

Gate: `./scripts/check` verde — 187 tests.

## T3 · Demostrar que el gate atrapa el defecto

Obligatoria por lo aprendido en s1: un gate que nadie vio ponerse rojo no es un
gate, es una intención. Los dos ángulos, cada uno con su defecto:

**Ángulo estático** — `fetch('https://analitica.example/evento', …)` añadido a
`App.tsx`:

```
FAIL  tests/privacy.test.ts > must-privacy-006: la aplicación no sale a la red
      > ningún archivo de `src/` escribe una salida a la red
AssertionError: must-privacy-006: el progreso no sale del navegador:
  expected [ 'src/App.tsx usa fetch' ] to deeply equal []
+   "src/App.tsx usa fetch",
      Tests  1 failed | 183 passed (184)
✗ gates failed
```

**Ángulo en ejecución** — `navigator.sendBeacon('https://analitica.example/respuesta', bone.id)`
añadido justo donde se guarda el veredicto, en `TestQuestion`. Es la fuga
realista: telemetría pegada al dato que el guardrail protege.

```
× no llama a la red al responder una pregunta del modo test
+   "sendBeacon https://analitica.example/respuesta",
      Tests  1 failed | 2 passed (3)
```

Ambos defectos revertidos; gate verde después de cada reversión. **Los dos
ángulos hicieron falta**: el `sendBeacon` dentro de `TestQuestion` lo habrían
atrapado los dos, pero una dependencia que llame por su cuenta solo la ve el de
ejecución, y código escrito en una ruta que las pruebas no recorren solo lo ve
el estático.

## Finalize

- Full gate set: `./scripts/check` verde — **187 tests** (182 al empezar la
  historia, 5 nuevos).
- Orphaned-test check: limpio — las dos pruebas son nuevas y no cambian ningún
  módulo, así que nada quedó desactualizado.
- Acceptance criteria: los tres escenarios del `scope.md`, cumplidos y
  demostrados. Los cuatro `Done when` cumplidos, incluido el que exigía que la
  demostración quedara registrada con su salida.
