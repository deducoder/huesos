# Story e2.6: Explore view — Scope

## User story

As a medical student,
I want the list, the skeleton and the name panel to always agree with each other,
so that I can move between them without losing track of which bone I am looking
at.

## Acceptance criteria

```gherkin
Given un hueso elegido en la lista
When se mira lo que recibe la escena
Then recibe la malla de ese hueso, no su identificador

Given un hueso elegido desde la escena
When se mira la lista
Then ese hueso aparece marcado como seleccionado

Given un hueso sin geometría elegido en la lista
When se mira lo que recibe la escena
Then no recibe ninguna malla, y el panel explica por qué

Given cualquier selección
When se cuenta cuántos huesos están marcados
Then hay exactamente uno
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `femur-left` desde la lista | Componer | La escena recibe `Femur.r`; la lista marca el izquierdo, no el derecho |
| `malleus-left` | Componer | La escena recibe `null`; el panel avisa |

## In scope

- El contrato entre el estado de selección y lo que recibe la escena.
- Que la selección hecha en cualquiera de las tres piezas se refleje en las otras.
- Que un hueso sin geometría no rompa la escena.

## Out of scope

- **Desplazar la lista hasta el hueso elegido desde la escena** — se nota con 206
  entradas, pero es pulido de UX y no un requisito del epic. Al parking lot.
- **Etiquetas flotantes en la escena** — el panel ya nombra.

## Done when

- El contrato estado→escena está probado, incluido el caso sin geometría.
- Exactamente un hueso marcado en cualquier momento.
- `./scripts/check` en verde y la aplicación construye.

## Notes

Buena parte de la composición se adelantó en e2.3, e2.4 y e2.5, porque sin
montar las piezas no había integración que verificar. Lo que queda —y lo que esta
historia entrega— es **el contrato entre ellas**, que hasta ahora nadie probaba.
