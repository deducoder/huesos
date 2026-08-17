# Story e2.2: Accessible navigator — Scope

## User story

As a medical student who navigates with a keyboard or a screen reader,
I want to walk the whole skeleton and pick any bone without touching the 3D
scene,
so that studying does not depend on being able to aim a mouse at a shape.

## Acceptance criteria

```gherkin
Given la aplicación abierta
When se navega solo con el teclado
Then se alcanza cualquier hueso del catálogo y se puede activar

Given un hueso en la lista
When un lector de pantalla lo anuncia
Then dice su nombre en español y su lado, no solo «botón»

Given un hueso activado
When se lee su estado
Then queda marcado como seleccionado por atributo, no solo por color

Given un hueso sin geometría en el modelo
When aparece en la lista
Then se indica que no es representable, y se explica por qué
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `Tab` hasta «fémur derecho» + `Enter` | Activar | `aria-pressed="true"` en ese botón |
| «martillo izquierdo» | Leer | Nombre accesible con la razón de que no se puede mostrar |
| Grupo `upper-limb` | Leer | Encabezado de región con 60 huesos dentro |

## In scope

- La lista de huesos agrupada por región, con cada hueso como control real
  enfocable.
- Nombre accesible que incluya el hueso y su lado.
- Estado de selección expuesto por atributo ARIA.
- Marca y explicación para los huesos sin geometría.

## Out of scope

- **La escena 3D** — es e2.4; esta lista funciona sin ella.
- **El panel con la nomenclatura latina** — es e2.3.
- **Buscar por nombre** — fuera del epic.
- **Estilo visual acabado** — se cuida el contraste y el foco, no la estética.

## Done when

- Un test recorre y activa huesos **solo con teclado**, sin usar el ratón.
- Cada botón expone nombre accesible con hueso y lado.
- La selección se lee por `aria-pressed`, nunca solo por clase de color.
- `./scripts/check` en verde.

## Notes

Es la vía de acceso de primera clase que fija ADR-002, no un añadido. Se
construye antes que la escena a propósito.
