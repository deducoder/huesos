# Story e1.4: Catalog-geometry anchor — Scope

## User story

As a developer of huesos-mono,
I want the gate to fail when a catalog entry names a mesh the model does not
contain,
so that a typo in a bone name is caught at commit time instead of surfacing as
an invisible bone in the UI.

## Acceptance criteria

```gherkin
Given una entrada del catálogo con un nombre de malla
When se ejecuta la prueba de anclaje
Then esa malla existe en src/data/skeleton.glb

Given una entrada cuyo nombre de malla está mal escrito
When se ejecuta la prueba
Then falla nombrando la entrada culpable

Given una entrada declarada como ausencia
When se ejecuta la prueba
Then se la salta sin exigirle geometría
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `meshName: 'Femur.r'` | Anclar | Pasa: la malla existe |
| `meshName: 'Femur.right'` | Anclar | Falla: «femur-right apunta a una malla inexistente» |
| `meshName: null` + razón | Anclar | Se omite |

## In scope

- La prueba que cruza el catálogo con las mallas reales del `.glb`.
- Un mensaje de fallo que nombre la entrada culpable, no solo el booleano.

## Out of scope

- **Verificar que la geometría es anatómicamente correcta** — no somos autoridad
  anatómica (declarado en ADR-001).
- **Cargar el modelo en la aplicación** — es E2.

## Done when

- La prueba de anclaje pasa con el catálogo actual.
- Inyectar un nombre de malla inexistente la pone en rojo, con el id en el mensaje.
- `./scripts/check` en verde.

## Notes

Es la costura que ADR-001 apuesta: si el nombre de malla no sirviera como clave
estable, la decisión del activo se cae. Va en el walking skeleton para que falle
pronto y barato.
