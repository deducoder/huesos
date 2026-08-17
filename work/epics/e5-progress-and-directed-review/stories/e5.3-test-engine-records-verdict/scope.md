# Story e5.3: Test engine records its verdict — Scope

## User story

As a estudiante de medicina,
I want que cada respuesta que doy en el modo test quede registrada,
so that la aplicación sepa en qué huesos fallo y pueda usarlo para dirigir mi
estudio.

Esta historia **cierra el esqueleto andante de la épica**: es la primera vez
que el camino completo —responder → registrar → persistir → recargar → seguir
ahí— existe de punta a punta.

## Acceptance criteria

```gherkin
Given una pregunta del modo test                  # happy path
When se responde correctamente
Then el registro de ese hueso suma un acierto

Given una pregunta del modo test
When se responde incorrectamente
Then el registro de ese hueso suma un fallo

Given un hueso ya respondido antes
When se vuelve a responder
Then el registro acumula, no reemplaza

Given respuestas dadas en el test sobre el esqueleto completo (`RF-04`)
When se cambia al test sobre hueso aislado (`RF-05`) y se responde
Then ambas alimentan el mismo registro

Given respuestas ya dadas                          # el observable de RF-09
When se recarga la página
Then el registro conserva los resultados anteriores

Given una respuesta registrada
When se mira lo que la pregunta muestra
Then no aparece nada del progreso — registrar no es exhibir
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| registro vacío, pregunta sobre `frontal` | responder mal | `{ frontal: { correct: 0, incorrect: 1 } }` |
| ese registro, misma pregunta otra vez | responder bien | `{ frontal: { correct: 1, incorrect: 1 } }` |
| ese registro, pregunta sobre `sacrum` en la **otra** variante de test | responder mal | `{ frontal: {...}, sacrum: { correct: 0, incorrect: 1 } }` |

## In scope

- `TestQuestion` registra el veredicto de cada respuesta usando `recordAnswer`
  (e5.1) y el almacén de e5.2.
- El almacén compartido: **una sola instancia** para toda la aplicación, porque
  su degradación a memoria es estado de instancia (contrato que e5.2 dejó
  escrito en su retrospectiva).
- Que ambas variantes de test alimenten el mismo registro, que sale gratis
  porque las dos montan el mismo `TestQuestion`.

## Out of scope

- **Usar el registro para elegir la pregunta** — es `e5.4`. Esta historia solo
  escribe; leer para decidir viene después.
- **Mostrar el progreso** — declarado fuera en el `scope.md` de la épica y
  aparcado en `records/parking-lot.md`.
- **Registrar algo que no sea el veredicto** (tiempo de respuesta, la respuesta
  escrita, la variante) — fuera por el mismo criterio que e5.1: ningún campo
  entra sin la historia que lo use.

## Done when

- Responder bien o mal en cualquiera de las dos variantes deja el veredicto en
  el registro, acumulando sobre lo anterior.
- Tras recargar la página, el registro conserva lo respondido — **verificado en
  navegador real**, que es el único sitio donde "recargar" significa algo.
- Nada del progreso aparece en la pantalla de la pregunta.
- La aplicación crea el almacén una sola vez, no uno por render.
- `./scripts/check` en verde.

## Notes

- El progreso **no se renderiza**, así que no necesita estado de React: no hay
  nada que re-renderizar cuando cambia. Eso evita levantar estado hasta `App` y
  la plomería por dos componentes que hoy no reciben ninguna prop.
- El almacén fluye como ya fluye `catalog`: las vistas concretas
  (`SkeletonTestView`, `BoneTestView`) lo pasan y `TestQuestion` lo recibe como
  prop. Mismo patrón, cero invención.
