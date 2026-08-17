# Story e1.3: Model inventory — Scope

## User story

As a developer of huesos-mono,
I want a rerunnable tool that reads the model and classifies every mesh,
so that filling 199 catalog entries is transcription from a generated list
instead of reading names off a 3D viewer one by one.

## Acceptance criteria

```gherkin
Given el modelo con sus 144 mallas
When se ejecuta el inventario
Then clasifica cada malla en hueso, diente, cartílago o sesamoideo
And separa la lateralidad del nombre base

Given una malla llamada "Femur.r"
When se clasifica
Then su tipo es hueso, su lado es derecho y su nombre base es "Femur"

Given una malla llamada "Lower first molar tooth.r"
When se clasifica
Then su tipo es diente y queda fuera del recuento óseo

Given el inventario completo
When se cuentan los huesos
Then el total coincide con las 118 estructuras óseas conocidas del modelo
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `Atlas (C1)` | Clasificar | hueso · sin lado · base `Atlas (C1)` |
| `Costal cart of 3rd rib.r` | Clasificar | cartílago · derecho |
| `Sesamoid_bones_of_hand.r` | Clasificar | sesamoideo · derecho |

## In scope

- Un clasificador puro de nombres de malla, con sus pruebas.
- Un ejecutable que aplica el clasificador al `.glb` y emite el inventario.
- Que el inventario sea reejecutable, para poder comparar una versión futura del
  modelo contra el catálogo en vez de revisarla a ojo.

## Out of scope

- **Traducir los nombres al español** — es e1.5 y e1.6; aquí solo se clasifica
  lo que el modelo dice.
- **Escribir el catálogo automáticamente** — la salida se revisa antes de
  convertirse en dato; generar 199 entradas sin mirarlas es justo el riesgo que
  el epic quiere evitar.
- **Inferir la región anatómica** — se decide al poblar, con criterio humano.

## Done when

- `node scripts/inventory-model.mjs src/data/skeleton.glb` imprime el inventario
  clasificado y los totales.
- El recuento óseo da 118, coincidiendo con la medición de la investigación.
- `./scripts/check` en verde.
