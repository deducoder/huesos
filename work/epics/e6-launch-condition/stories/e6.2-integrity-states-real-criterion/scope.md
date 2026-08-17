# Story e6.2: Integrity test states the real criterion — Scope

## User story

As a quien decide si el producto se puede publicar,
I want una prueba que afirme, en una sola aserción con nombre propio, que el
catálogo cumple la condición de lanzamiento,
so that "el catálogo está completo" sea algo que el gate responde y no algo que
haya que deducir de dos pruebas que hablan de 199 y de 7.

## Acceptance criteria

```gherkin
Given el catálogo tal como está
When se corre `./scripts/check`
Then una prueba afirma que las 206 entradas tienen geometría o razón de
     ausencia, y pasa

Given una entrada a la que se le quita la malla y no se le da razón
When se corre esa prueba
Then falla, nombrando la entrada

Given una entrada con razón de ausencia
When se corre esa prueba
Then pasa — una razón documentada cumple el criterio (ADR-006)
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| catálogo actual | correr la prueba | verde: 206 entradas cumplen |
| `hyoid` con `meshName: null` y sin `missingReason` | correr la prueba | rojo, nombrando `hyoid` |

## In scope

- Una prueba en `src/data/catalog.coverage.test.ts` que afirme el criterio de
  ADR-006 explícitamente, citándolo.
- Decidir, con las tres delante, si las pruebas existentes que afirman "199" y
  "7 ausencias" siguen diciendo algo que la nueva no dice — y quitarlas si no.
- La demostración de que la prueba nueva atrapa el defecto, registrada con su
  salida.

## Out of scope

- **Cambiar el catálogo** — no hay nada que arreglar en él; esta historia
  cambia lo que se afirma sobre él.
- **Tocar `governance/prd.md`** — es `e6.3`.
- **Reescribir las otras pruebas de cobertura** (reparto por región, lados de
  los pares) — dicen cosas distintas y siguen valiendo.

## Done when

- Existe una prueba que cita ADR-006 y afirma su criterio para las 206 entradas.
- Se ha visto fallar con una entrada incompleta, y su salida está registrada.
- No queda la misma afirmación repartida en dos sitios.
- `./scripts/check` en verde.

## Notes

- El tipo `Bone` ya hace imposible el estado incoherente en TypeScript —la
  unión `MappedBone | UnmappedBone`—. La prueba se escribe igual: **el tipo
  protege a quien escribe el catálogo, la prueba protege al requisito**. Quien
  lea `RF-08` tiene que poder encontrar la aserción que lo cumple, sin
  reconstruirla desde una definición de tipos.
