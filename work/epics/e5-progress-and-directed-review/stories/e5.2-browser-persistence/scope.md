# Story e5.2: Browser persistence — Scope

## User story

As a estudiante de medicina que estudia en varias sesiones,
I want que lo que la aplicación aprendió sobre mis aciertos y fallos siga ahí
cuando vuelvo a abrirla,
so that no empiece de cero cada vez y pueda insistirme con lo que me cuesta.

Esta historia entrega **el almacén**, no su uso: quién lo llama y cuándo es
`e5.3`.

## Acceptance criteria

```gherkin
Given un navegador sin nada guardado          # primera visita
When se lee el progreso
Then devuelve el registro vacío, no un error

Given un registro de progreso                  # happy path
When se guarda y después se lee
Then lo leído es equivalente a lo guardado

Given un valor guardado que no es JSON válido  # dato corrupto
When se lee el progreso
Then devuelve el registro vacío en vez de lanzar

Given un JSON válido con una forma que no es un registro de progreso
When se lee el progreso
Then devuelve el registro vacío en vez de propagar basura al dominio

Given un almacenamiento que lanza al escribir  # modo privado, cuota agotada
When se guarda el progreso
Then la aplicación no lanza, y lo guardado sigue disponible durante la sesión

Given un almacenamiento que lanza al leer
When se lee el progreso
Then devuelve el registro vacío en vez de lanzar
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| almacenamiento vacío | leer | `{}` |
| `{ frontal: { correct: 1, incorrect: 2 } }` | guardar, luego leer | el mismo registro |
| clave con el texto `"no-soy-json{"` | leer | `{}` |
| clave con `'{"frontal":"hola"}'` | leer | `{}` — la forma no valida |
| almacenamiento cuyo `setItem` lanza `QuotaExceededError` | guardar, luego leer | el registro guardado, servido desde memoria |

## In scope

- `src/storage/progress-store.ts`: leer y guardar el `ProgressRecord` completo
  bajo una sola clave, serializado a JSON (ADR-004).
- La **validación de forma** al leer: lo que entra al dominio es un
  `ProgressRecord` o es el registro vacío, nunca un objeto arbitrario.
- La **degradación explícita a memoria** cuando `localStorage` no está
  disponible o lanza — dentro del adaptador, no repartida por la aplicación.
- Sus pruebas, contra dobles en memoria y contra dobles que lanzan; sin tocar el
  `localStorage` real.

## Out of scope

- **Llamar a este almacén desde el motor de test** — es `e5.3`.
- **`IndexedDB` como reserva** — rechazado en ADR-004 y nombrado como rabbit
  hole en el brief de la épica.
- **Versionado y migración del formato guardado** — declarado fuera en el brief;
  se resuelve cuando el formato cambie, con el caso real delante.
- **Avisar al estudiante de que su progreso no se está guardando** — es
  interfaz, y ninguna historia de esta épica entrega interfaz de progreso. Si
  se decide que hace falta, es una historia propia.

## Done when

- Leer sin nada guardado, con un valor corrupto, o con un almacenamiento que
  lanza, devuelve el registro vacío — nunca una excepción y nunca un objeto de
  forma desconocida.
- Guardar y leer devuelve un registro equivalente al guardado.
- Un `setItem` que lanza no rompe la aplicación, y el progreso sigue disponible
  durante la sesión.
- El dominio (`src/domain/`) sigue sin importar nada de `src/storage/`.
- `./scripts/check` en verde.

## Notes

- ADR-004 fija la decisión: `localStorage` síncrono, JSON bajo una sola clave,
  degradación a memoria. Esta historia la implementa; no la revisita.
- Contrato del diseño de la épica: *"un fallo de almacenamiento degrada, no
  propaga"* — ni el dominio ni los componentes conocen esa posibilidad.
- La validación de forma existe por el contrato *"el dato es plano y
  serializable"*: lo que vuelve de `localStorage` es texto que escribió
  cualquiera, incluida una versión anterior de la aplicación.
