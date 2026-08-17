# Epic e4: Motor de test — Design

## Gemba findings

- **`SkeletonScene` y `IsolatedBoneScene` no filtran a la vista ningún
  nombre de hueso en el DOM** — el resaltado es 3D (material/visibilidad),
  sin texto. Se reutilizan **tal cual** para las preguntas de `RF-04` y
  `RF-05`: el riesgo de `must-data-003` (ningún nombre en el DOM antes de
  responder) está en no envolverlas con `BoneNavigator`/`BoneIdentity`
  durante la pregunta, no en las escenas mismas.
- **`Bone` ya trae todo lo que `RF-06` necesita validar**: `es`, `la`,
  `synonyms: string[]`. No hace falta ampliar el catálogo ni el esquema —
  la validación tolerante es una función pura nueva sobre datos que ya
  existen.
- **No existe ninguna normalización de texto en el proyecto todavía** —
  `domain/answer-check.ts` (nombrado, sin construir, en el
  `system-design.md` desactualizado que E3 ya señaló como hallazgo) es
  net-new, no una extensión de algo existente.
- **`isUnpaired`/`meshName !== null` ya filtran qué huesos son
  preguntables**: un hueso sin geometría (los 7 ausentes) no puede
  resaltarse ni aislarse, así que no puede ser pregunta de `RF-04` ni
  `RF-05`. La función que elige qué hueso preguntar filtra por
  `meshName !== null`, reutilizando el mismo criterio que ya usa
  `RegionGroup.representable` en `domain/regions.ts`.
- **`must-a11y-005` ya fija el patrón para la corrección de `RF-07`**: "el
  color nunca es el único indicador" — la retroalimentación de acierto/error
  necesita texto explícito, no un borde verde/rojo solo. `BoneIdentity` ya
  demuestra el patrón (dato en texto + `aria-live`), se sigue el mismo.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `domain/answer-check.ts` | create | `normalizeAnswer`, `isCorrectAnswer(input, bone)` — `RF-06` |
| `domain/quiz.ts` | create | `pickTestableBone(bones, excludeId?)` — elige un hueso con geometría, al azar |
| `features/test/TestQuestion.tsx` | create | El flujo pregunta → respuesta → corrección, parametrizado por qué escena mostrar |
| `features/test/SkeletonTestView.tsx` | create | `RF-04`: `TestQuestion` + `SkeletonScene`, sin `BoneNavigator` ni `BoneIdentity` |
| `features/test/BoneTestView.tsx` | create | `RF-05`: `TestQuestion` + `IsolatedBoneScene`, mismo flujo que `SkeletonTestView` |
| `App.tsx` | modify | Un cuarto modo (`'test'`), con su propio punto de entrada — mismo patrón de `Modo` que e3.3 |

## Key contracts

- **El hueso preguntado nunca llega al DOM como texto hasta que el
  estudiante responde** (`must-data-003`). Concretamente: mientras la
  pregunta está activa, ningún componente montado recibe el `Bone` elegido
  como prop de texto (`es`/`la`/`synonyms`) — solo su `id`, para resaltarlo
  en la escena. El nombre entra al DOM recién en la fase de corrección.
- **La validación es una función pura `(respuesta: string, hueso: Bone) =>
  boolean`**, sin estado, sin fecha, sin acceso a almacenamiento — mismo
  contrato que `system-design.md` (desactualizado en su lista de módulos,
  pero correcto en este contrato específico) ya declaraba.
- **Elegir qué hueso preguntar filtra siempre por `meshName !== null`** —
  ningún hueso ausente del modelo puede ser pregunta de `RF-04`/`RF-05`.
- **La corrección muestra ambas nomenclaturas y mantiene el hueso resaltado
  en su posición** (`RF-07`) — reutiliza el resaltado que `SkeletonScene`/
  `IsolatedBoneScene` ya saben hacer con un `selected`, no una lógica nueva
  de "marcar el error".

## Decisions (ADRs)

Ninguna. El patrón de reutilización (escenas de E2/E3 sin las vías con
nombre, dominio puro para la lógica) ya está establecido por ADR-002 y
confirmado en e3; esta épica lo aplica, no decide algo nuevo con múltiples
opciones reales. La única decisión con algo de peso —cómo comparte código
`SkeletonTestView` y `BoneTestView`— es barata de cambiar después y se
resuelve en la propia historia que la enfrente (e4.4), no acá.

## Legacy sweep

Nada queda huérfano: e4 construye sobre `SkeletonScene`, `IsolatedBoneScene`
y `domain/selection.ts` sin reemplazar ninguno. `system-design.md` sigue
desactualizado (hallazgo de e3, aparcado); esta épica no lo agrava —
`domain/answer-check.ts` es, de hecho, el primer módulo que ese documento
nombraba y todavía no existía.
