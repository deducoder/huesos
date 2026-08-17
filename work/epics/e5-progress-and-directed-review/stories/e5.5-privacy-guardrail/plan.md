# Story e5.5: Privacy guardrail, actually gated — Plan

> Size: S

Sin `design.md`: el diseño de la épica ya fijó el enfoque (en ejecución sobre
la aplicación montada, no por grep sobre el bundle) y el `scope.md` lo concreta
en dos ángulos. No queda decisión abierta que un diseño propio resolvería.

## Tasks

### T1 · El ángulo estático: nadie lo escribió

- **Files:** create `tests/privacy.test.ts`
- **TDD:** RED — recorrer `src/` y fallar si aparece `fetch(`, `XMLHttpRequest`
  o `sendBeacon`; hoy no aparecen, así que el RED se provoca **introduciendo el
  defecto** (que además es la demostración de T3, adelantada) → GREEN — el
  recorrido y la aserción → REFACTOR.
- **Satisfies:** "Given que alguien introduce un `fetch` … Then el gate falla,
  nombrando el archivo".
- **Verify:** `npx vitest run tests/privacy.test.ts` · `./scripts/check`
- **Commit:** `test(privacy): fail the gate if the app's own code reaches the network`

### T2 · El ángulo en ejecución: nadie lo llamó

- **Files:** modify `tests/privacy.test.ts`
- **TDD:** RED — montar la aplicación, navegar al modo test, responder una
  pregunta, con `fetch`/`XMLHttpRequest`/`sendBeacon` sustituidos por espías que
  registran; falla si alguno se llamó. El RED se provoca haciendo que un espía
  se llame a propósito → GREEN → REFACTOR.
- **Satisfies:** "Given la aplicación montada y en uso … Then ninguno se ha
  llamado".
- **Verify:** `npx vitest run tests/privacy.test.ts` · `./scripts/check`
- **Commit:** `test(privacy): fail the gate if anything calls out while the app runs`

### T3 · Demostrar que el gate atrapa el defecto

Obligatoria, no ceremonial: s1 dejó aprendido que un gate que nadie vio ponerse
rojo no es un gate (`a-reintroduced-defect-must-actually-break`).

- Introducir una llamada de telemetría real en el código de la aplicación,
  correr `./scripts/check`, **ver el rojo y guardar su salida**, revertir, y
  confirmar el verde.
- **Verify:** la salida roja, con el nombre del archivo, copiada en
  `progress.md`.

## Order & risks

- **Execution order:** T1 → T2 → T3.
- **Risks:**
  - *Falsos positivos por barrer código de terceros.* → Solo se recorre `src/`,
    que es código propio; `node_modules` y `dist` quedan fuera por construcción.
  - *Que la palabra `fetch` aparezca en un comentario o en un nombre de variable
    y el gate se vuelva ruidoso.* → El patrón busca la llamada (`fetch(`), no la
    palabra; y si un caso legítimo aparece, la respuesta correcta es una
    excepción declarada y visible, no aflojar el patrón.
  - *Que las escenas 3D impidan montar la aplicación en jsdom.* → Se sustituyen
    igual que ya hacen `App.test.tsx` y las pruebas de las vistas de test.
