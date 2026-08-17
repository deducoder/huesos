# Story e1.2: Catalog schema — Scope

## User story

As a developer of huesos-mono,
I want a typed shape for a bone entry and a test that enforces it,
so that the 199 entries can be filled in later without each one inventing its
own conventions, and a malformed entry fails the gate instead of reaching the UI.

## Acceptance criteria

```gherkin
Given el catálogo con al menos una entrada
When se ejecuta la prueba de integridad
Then ningún identificador se repite
And toda entrada tiene nombre en español y término en Terminologia Anatomica no vacíos
And toda entrada declara su región anatómica

Given una entrada de un hueso par
When se valida
Then declara lateralidad izquierda o derecha

Given una entrada de un hueso impar
When se valida
Then su lateralidad es nula

Given un hueso declarado como excepción sin geometría
When se valida
Then su nombre de malla es nulo y la razón de la excepción está escrita
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `{ id: 'femur-right', meshName: 'Femur.r', side: 'right', es: 'fémur', la: 'os femoris', region: 'lower-limb' }` | Validar | Pasa |
| Dos entradas con `id: 'femur-right'` | Validar | Falla por identificador repetido |
| `{ id: 'malleus-left', meshName: null, side: 'left', … }` sin razón de excepción | Validar | Falla: una entrada sin malla exige razón |

## In scope

- Los tipos `Bone`, `BoneRegion` y `Side` en `src/data/bone.ts`.
- El catálogo en `src/data/catalog.ts`, con las entradas semilla que prueban el
  esquema.
- La prueba de integridad **estructural** en `src/data/catalog.test.ts`.

## Out of scope

- **Verificar que el `meshName` existe en el `.glb`** — es e1.4. Aquí se
  comprueba la forma del dato, no su correspondencia con la geometría.
- **Poblar las 199 entradas** — es e1.5 y e1.6.
- **Validar respuestas del usuario** — es del motor de test, E4.

## Done when

- `npx vitest run src/data/catalog.test.ts` pasa.
- El esquema distingue un hueso par de uno impar, y una excepción declarada de
  una entrada incompleta.
- `./scripts/check` en verde.

## Notes

El contrato de capas del proyecto dice que `src/data/` son datos puros: estos
tipos no importan React, ni el DOM, ni `localStorage`.
