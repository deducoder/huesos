# Story e1.5: Spine catalog — Scope

## User story

As a medical student using huesos-mono,
I want every vertebra to carry its Spanish name and its Terminologia Anatomica
term,
so that I can study the spine with the nomenclature an exam will actually ask
for.

## Acceptance criteria

```gherkin
Given el catálogo poblado con la columna
When se cuentan las entradas de la región spine
Then hay exactamente 26

Given cualquier vértebra del catálogo
When se lee su entrada
Then tiene nombre en español, término en Terminologia Anatomica y su nivel

Given una vértebra
When se comprueba su lateralidad
Then es nula, porque toda vértebra es impar

Given las 26 entradas
When se ejecuta la prueba de anclaje
Then las 26 apuntan a mallas existentes del modelo
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `Atlas (C1)` | Catalogar | `atlas` / `atlas`, sinónimos `C1`, `primera vértebra cervical` |
| `Thoracic vertebrae (T7)` | Catalogar | `séptima vértebra torácica` / `vertebra thoracica VII`, sinónimo `T7` |
| `Sacrum` | Catalogar | `sacro` / `os sacrum` |

## In scope

- Las 26 entradas de la columna: 7 cervicales, 12 torácicas, 5 lumbares, sacro y
  cóccix.
- Sinónimos por los que un estudiante podría responder: la sigla del nivel
  (`C1`, `T7`, `L3`) y las variantes de uso corriente, como «vértebra dorsal».
- Fijar el criterio de terminología que e1.6 va a seguir para el resto.

## Out of scope

- **Las demás regiones** — es e1.6; esta historia existe para fijar el criterio
  con una región antes de aplicarlo a 173 entradas más.
- **Las partes de una vértebra** —cuerpo, apófisis, arco— : el catálogo cataloga
  huesos, no accidentes anatómicos.
- **Tolerar erratas al responder** — es del motor de test, E4. Aquí solo se
  declara qué formas son aceptables.

## Done when

- El catálogo tiene 26 entradas con `region: 'spine'`, todas ancladas y en verde.
- Cada vértebra numerada lleva su sigla como sinónimo.
- `./scripts/check` en verde.
