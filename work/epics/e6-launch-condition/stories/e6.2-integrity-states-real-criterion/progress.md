# Story e6.2: Integrity test states the real criterion — Progress

## T1 · La aserción del criterio de ADR-006

`cumple la condición de lanzamiento: geometría o razón, nunca ninguna` en
`src/data/catalog.coverage.test.ts`, citando ADR-006 y explicando por qué
existe aunque el tipo `Bone` ya impida el estado incoherente: **el tipo protege
a quien escribe el catálogo, la prueba protege al requisito.** Quien lea
`RF-08` tiene que poder encontrar la aserción que lo cumple, sin reconstruirla
desde una unión de tipos.

**RED por rotura deliberada del dato**, porque una prueba que afirma un estado
válido pasa en cuanto se escribe. Se le quitó la razón al hioides:

```
FAIL  src/data/catalog.coverage.test.ts > la cobertura del catálogo
      > cumple la condición de lanzamiento: geometría o razón, nunca ninguna
AssertionError: entradas sin geometría y sin razón de ausencia:
  expected [ 'hyoid' ] to deeply equal []
+   "hyoid",
```

Revertido; verde. Gate: `./scripts/check` verde — 191 tests.

## T2 · Resolver la redundancia con las pruebas existentes

**La respuesta la dio la evidencia, no el criterio a priori.** Al romper el dato
en T1 fallaron **dos** pruebas: la nueva y `declara exactamente 7 ausencias, y
todas con razón`. Ese solape era exactamente lo que el `SHOULD` del alcance
prohibía.

Reparto tras el refactor:

| Prueba | Qué afirma ahora | Por qué se queda |
|---|---|---|
| `cumple la condición de lanzamiento…` | Toda entrada tiene geometría **o** una razón que **explica** (>20 caracteres) | Es el criterio de ADR-006 y de `RF-08` |
| `declara exactamente 7 ausencias` | Solo el recuento | Documenta el estado real del activo y delata un cambio silencioso en el modelo — algo que la anterior no dice |
| `ancla 199 entradas a la geometría del modelo` | Solo el recuento del otro lado | Ídem, y sin solape |

La exigencia de razón **sustantiva** (>20 caracteres) se movió de la prueba
vieja a la nueva, en vez de perderse: una razón simbólica como `"n/a"`
cumpliría la letra del criterio y no su propósito.

**Reverificado tras el refactor**, que es lo que hace que el reparto sea un
hecho y no una intención: con el hioides puesto en `missingReason: 'n/a'` falla
**solo** la prueba nueva.

```
× cumple la condición de lanzamiento: geometría o razón, nunca ninguna
AssertionError: entradas sin geometría y sin una razón que explique:
  expected [ 'hyoid' ] to deeply equal []
      Tests  1 failed | 6 passed (7)
```

Gate: `./scripts/check` verde — 191 tests.

## Finalize

- Full gate set: `./scripts/check` verde — **191 tests** (190 al empezar, 1
  nuevo neto: se añadió uno y se estrechó otro).
- Orphaned-test check: limpio — el único archivo tocado es el propio
  `catalog.coverage.test.ts`.
- Acceptance criteria: los tres escenarios del `scope.md`, cumplidos y
  demostrados con su salida.
