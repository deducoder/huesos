# Story e9.4: The skeleton test zooms to what it asks — Scope

## User story

As a quien responde una pregunta sobre el esqueleto completo,
I want que la cámara se acerque a la zona del hueso señalado,
so that pueda ver bien el detalle que tengo que reconocer, en vez de
distinguirlo a la distancia entre 206 huesos diminutos en la pantalla de un
teléfono.

## Acceptance criteria

```gherkin
Given que entro al modo test de esqueleto completo
When se monta la pregunta
Then la cámara encuadra la zona del hueso señalado, no el esqueleto entero

Given que respondo y avanzo a la siguiente pregunta
When el hueso señalado cambia
Then la cámara se reencuadra sobre la zona nueva

Given el hueso señalado en la zona nueva
When la cámara se reencuadra
Then el salto no está animado — es el mismo criterio que el brief de la
     épica ya excluyó para no meterse en el rabbit hole de interpolar

Given que estoy en Explorar, no en el modo test
When selecciono un hueso desde el navegador o la escena
Then el encuadre del esqueleto completo no cambia — esta historia no lo toca
     (a decidir en el diseño si el gemba encuentra una razón para incluirlo)

Given la barra de respuesta flotando sobre el lienzo del modo test
When la cámara se acerca a la zona señalada
Then esa zona no queda detrás de la barra
```

## Example

Gemba sobre `src/components/SkeletonScene.tsx` y `src/domain/framing.ts`:

| Pieza | Estado hoy |
|-------|-----------|
| `distanceToFit` / `frameObject` | Ya existen (e9.3), puros, con sus tests. `frameObject` recibe `{width, height}` de lo que hay que encuadrar y `{fovDegrees, aspect, reservedBottom}` del lienzo, y devuelve `{distance, viewOffsetY}`. |
| Cámara de `SkeletonScene` | `<Canvas camera={{ position: [0, 0, distanceToFit(TARGET_HEIGHT, FOV)], fov: FOV }}>` — la prop `camera` de `Canvas` se lee **solo al montar** (comprobado en b2.2); no sirve para un encuadre que cambia con la selección. |
| Patrón que ya resuelve esto | `IsolatedBoneScene.tsx` (e3.1/e9.3): `<PerspectiveCamera>` de drei, con `ref` y `useLayoutEffect` que llama `camara.setViewOffset(...)` y `updateProjectionMatrix()` cuando el encuadre cambia. Reutilizable tal cual. |
| `reservedBottom` en el test de esqueleto | `SkeletonTestView.tsx` hoy ignora el segundo argumento de `renderScene` (e9.2 lo agregó; `SkeletonScene` no tiene esa prop). Con la cámara fija de hoy eso no importa —el esqueleto entero siempre queda arriba de la barra—, pero **acercar la cámara puede volver a esconder la zona señalada detrás de la barra**, el mismo defecto que e9.2/e9.3 ya corrigieron en otros dos lugares. |
| Cómo ubicar el hueso señalado | `Bone.meshName` ya da el nombre de malla directo — no hace falta `boneIdForMesh` en sentido inverso. Ojo con los pares que comparten una sola malla (`clavicle-right`/`clavicle-left` → ambos `meshName: 'Clavicle.r'`, visto en e9.5): encuadrar por nombre de malla puede necesitar decidir con qué mitad (`SkeletonHalf`, `original`/`mirrored`). |

## In scope

- **La cámara del modo test de esqueleto completo** se acerca a la zona del
  hueso señalado (`selected`) en vez de mostrar el esqueleto entero a
  distancia fija.
- **Reutilizar `frameObject`/`distanceToFit`**, no reimplementar el cálculo.
- **Reutilizar el patrón `<PerspectiveCamera>` + `setViewOffset`** de
  `IsolatedBoneScene.tsx`, no inventar uno nuevo.
- **`reservedBottom` de la barra de respuesta**, para que la zona encuadrada
  no quede tapada — el mismo contrato que `IsolatedBoneScene` ya expone,
  ahora consumido también desde `SkeletonTestView`.
- **Sin selección**, la cámara mantiene el encuadre del esqueleto entero
  (el comportamiento de hoy).

## Out of scope

- **Animar la transición de cámara** — rabbit hole declarado en el brief de
  la épica: el salto es aceptable, interpolarlo cuesta rendimiento en el
  mismo teléfono que `should-perf-007` vigila.
- **Tocar el activo 3D** — no-go del brief: esto es cámara y controles.
- **`ExploreView`** — la historia nombra el **test** de esqueleto completo;
  si el zoom debe o no alcanzar también a Explorar (que comparte
  `SkeletonScene`) se decide en el diseño, viendo el código real, no acá.
- **Zoom o desplazamiento manual con gestos** en `SkeletonScene` — no está
  entre los nueve puntos observados.
- **El resaltado del hueso** (`emissive`/`color`, e9.1) — no cambia.

## Done when

- En el modo test de esqueleto completo, cada pregunta nueva encuadra la
  zona del hueso señalado, no el esqueleto entero.
- La zona encuadrada no queda detrás de la barra de respuesta.
- `ExploreView` sigue mostrando el esqueleto completo como hoy, salvo que
  el diseño decida explícitamente lo contrario con su propia justificación.
- `./scripts/check` y `./scripts/check-integration` en verde.
- Verificado a mano en el teléfono: varias preguntas seguidas, mirando que
  la zona señalada se vea con detalle y sin quedar tapada.

## Notes

- **Riesgo nombrado en el plan de la épica**: `e9.3` y `e9.4` comparten
  `framing.ts` con dos historias de por medio, y e9.3 dejó escrito el
  contrato de la firma nueva para que el compilador nombre al llamador
  pendiente — que es exactamente `SkeletonScene.tsx`, hoy el único
  consumidor de `distanceToFit` que `frameObject` no reemplazó.
- **Hallazgo propio de este gemba, no anticipado por el plan**: acercar la
  cámara en el modo test introduce el mismo riesgo de tapado que e9.2 y
  e9.3 ya corrigieron en `BoneTestView`/`BoneDetailView` — es una historia
  que, sin querer, podría reintroducir una clase de defecto ya cerrada si
  no conecta `reservedBottom`.
