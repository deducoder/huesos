# Story e2.4: Skeleton scene — Scope

## User story

As a medical student,
I want to see the skeleton on screen and turn it around,
so that I learn each bone's shape and position, not just its name in a list.

## Acceptance criteria

```gherkin
Given la aplicación abierta
When se carga la vista
Then el esqueleto aparece en pantalla

Given el esqueleto en pantalla
When se arrastra con el ratón
Then gira, y con la rueda se acerca y se aleja

Given el modelo comprimido con Draco
When se decodifica
Then el decodificador se sirve desde el propio sitio, sin ninguna petición externa

Given el modelo, que solo trae el hemicuerpo derecho
When se muestra el esqueleto
Then se ve completo, con el lado izquierdo espejado
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `src/data/skeleton.glb` | Cargar | 144 mallas en la escena, sin peticiones de red externas |
| Arrastrar | Girar | La cámara orbita alrededor del esqueleto |

## In scope

- El canvas con react-three-fiber y el modelo cargado con Draco local.
- Controles de órbita y zoom.
- Espejado del hemicuerpo izquierdo.
- Estado de carga mientras el modelo llega.

## Out of scope

- **Seleccionar un hueso con el ratón** — es e2.5.
- **Resaltar el hueso elegido** — es e2.5.
- **Iluminación y materiales cuidados** — ratonera declarada en el brief: el
  realismo no ayuda a memorizar.
- **Componer con el navegador** — es e2.6.

## Done when

- La aplicación construye y sirve el esqueleto; se ve y se puede girar.
- El decodificador Draco se sirve desde `public/`, verificado en test: ninguna
  URL externa en el código de la escena (`must-privacy-006`).
- `./scripts/check` en verde.

## Notes

Esta es la historia de riesgo del epic. Si Draco no decodificara, la aplicación
**sigue siendo usable** gracias a e2.2 y e2.3: por eso el walking skeleton fue la
vía accesible y no la escena.

**Lo que no se puede probar automáticamente:** lo que ocurre dentro del canvas
WebGL no existe en jsdom. Se verifica a mano y se declara qué quedó sin cubrir.
