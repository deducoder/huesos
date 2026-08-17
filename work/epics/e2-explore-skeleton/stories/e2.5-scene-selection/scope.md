# Story e2.5: Scene selection — Scope

## User story

As a medical student,
I want to click a bone on the skeleton and see which one it is,
so that I can go from a shape I recognise to the name I am trying to learn,
which is the direction an exam asks for.

## Acceptance criteria

```gherkin
Given el esqueleto en pantalla
When se hace clic sobre un hueso
Then queda seleccionado y su nombre aparece en el panel

Given un hueso del hemicuerpo espejado
When se hace clic sobre él
Then se selecciona el hueso izquierdo, no el derecho

Given un hueso seleccionado en la lista
When se mira la escena
Then ese hueso está resaltado

Given una malla que corresponde a dos huesos, uno por lado
When se resuelve cuál se pulsó
Then el lado lo decide la mitad de la escena, no el nombre de la malla
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Clic en `Femur.r` en la mitad original | Resolver | `femur-right` |
| Clic en `Femur.r` en la mitad espejada | Resolver | `femur-left` |
| `Sphenoid bone` en cualquier mitad | Resolver | `sphenoid` (impar, sin lado) |

## In scope

- Resolver de malla y mitad de escena al `id` del hueso — dominio puro.
- Clic sobre la escena que selecciona.
- Resaltado del hueso seleccionado.

## Out of scope

- **Selección múltiple** — un hueso cada vez.
- **Aislar el hueso** — es E3.
- **Etiquetas flotantes sobre la escena** — el panel ya nombra el hueso.

## Done when

- El mapeo malla + mitad → `id` está probado, incluidos pares e impares.
- Un clic en la escena selecciona, y la lista lo refleja.
- El hueso seleccionado se distingue en la escena por algo más que el color.
- `./scripts/check` en verde.

## Notes

El punto delicado es que el modelo trae un solo hemicuerpo: **la misma malla
aparece dos veces en la escena**. El lado no puede salir del nombre de la malla,
tiene que salir de qué mitad se pulsó.
