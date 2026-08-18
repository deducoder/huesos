# Story e8.4: Multiple choice as primary test format — Design

> Complexity: moderate

## 1 · What & why

**Problem:** responder el test escribiendo el nombre exacto es fricción
real en el celular (teclado táctil, tildes, sinónimos) — la razón de ser
de la validación tolerante de `RF-06`, que sigue existiendo justamente
porque escribir es difícil de acertar incluso sabiendo la respuesta.

**Value:** elegir entre 3 botones es más rápido y sin fricción de tipeo;
el estudiante sigue demostrando que reconoce el hueso, no que lo sabe
deletrear.

## 2 · Approach

`TestQuestion` gana un modo de opción múltiple y lo usa por defecto; el
modo escrito existente se conserva intacto, alcanzable solo por prop
explícita (`answerFormat="open"`), nunca desde un botón de la interfaz —
exactamente lo que ADR-012 decidió.

**Components affected:**

- `src/features/test/TestQuestion.tsx`: modify — nuevo prop opcional
  `answerFormat?: 'open' | 'choice'` (default `'choice'`); construye las 3
  opciones con `pickDistractors` (e8.3) cuando el formato es `'choice'`;
  el `<form>` de texto libre existente se condiciona a `answerFormat ===
  'open'`, sin más cambios en su lógica.
- `src/features/test/TestQuestion.test.tsx`: modify — los ~11 `render(...)`
  existentes agregan `answerFormat="open"` para seguir probando el modo
  escrito sin cambios de comportamiento; se agregan tests nuevos para el
  modo por defecto (`'choice'`, sin el prop).
- `src/features/test/SkeletonTestView.tsx`,
  `src/features/test/BoneTestView.tsx`: modify — **hallazgo del gemba, no
  anticipado en el diseño de la épica**: `accessibleHint`/`accessibleLabel`
  dicen textualmente "Escribí su nombre en el campo de respuesta" (`p
  sr-only` en `SkeletonScene`/`IsolatedBoneScene`) — ya no es cierto una
  vez que el formato por defecto es opción múltiple. Se corrige el texto,
  nada más de estos dos componentes cambia.
- `governance/guardrails.md`: modify — agrega `must-data-010` (ver
  ADR-012), con su verificación ya escrita en `TestQuestion.test.tsx`.

**Legacy sweep:** nada queda huérfano. El modo escrito no se borra
(decisión de ADR-012); sigue teniendo dueño (`TestQuestion.tsx`) y
cobertura (`TestQuestion.test.tsx` con `answerFormat="open"`), solo deja
de ser alcanzable desde la interfaz real.

## 3 · Interface / examples

### Usage

Los dos montajes reales no cambian su forma de invocar `TestQuestion` —
sin `answerFormat`, heredan el default `'choice'`:

```tsx
// SkeletonTestView.tsx y BoneTestView.tsx — sin cambios en esta línea
<TestQuestion bones={catalog} store={progressStore} renderScene={...} />
```

Un test que necesita el modo escrito lo pide explícito:

```tsx
render(
  <TestQuestion
    bones={catalog}
    store={almacenFalso()}
    renderScene={renderScenaSustituida}
    answerFormat="open"
  />,
)
```

### Expected output (success + error)

```
// Modo choice (default), pendiente de responder
<div role="group" aria-label="¿Qué hueso es?">
  <button aria-pressed="false">fémur</button>
  <button aria-pressed="false">tibia</button>
  <button aria-pressed="false">peroné</button>
</div>
<button disabled>Responder</button>   // deshabilitado hasta elegir una opción

// Tras elegir "fémur" y confirmar — correcto
role="status": "Correcto"

// Tras elegir "tibia" y confirmar — incorrecto
role="status": "Incorrecto"
texto: "fémur / os femoris"   // mismo panel que el modo escrito ya muestra
```

### Key data structures

```ts
type FormatoRespuesta = 'open' | 'choice'

interface Props {
  bones: readonly Bone[]
  store: ProgressStore
  renderScene: (boneId: string) => ReactNode
  /** Por defecto 'choice' — el modo escrito solo se alcanza pasándolo explícito. */
  answerFormat?: FormatoRespuesta
}
```

Las 3 opciones se calculan una vez por pregunta (mismo momento que se
elige `bone` con `pickTestableBone`), mezcladas con un shuffle simple —
sin `sorteo` inyectable: ningún test necesita fijar el orden, solo
identificar el botón por su nombre accesible (`bone.es`), así que agregar
esa plomería sería complejidad sin consumidor (yagni, ver
`architecture-review` de e8.3 sobre no agregar configurabilidad sin
llamador real).

## 4 · Acceptance criteria

**Must:**
- El modo `'choice'` (default, sin prop) muestra exactamente 3 botones:
  el hueso correcto y 2 de `pickDistractors(bone, bones)`.
- Ningún botón queda marcado como correcto antes de responder
  (`aria-pressed` solo refleja selección, nunca corrección) — base de
  `must-data-010`.
- "Responder" está deshabilitado hasta que se elige una opción.
- Responder bien/mal en modo `'choice'` registra el veredicto en el store
  exactamente igual que el modo escrito (mismo `recordAnswer`).
- El modo `'open'` (con el prop explícito) no cambia de comportamiento —
  los tests existentes de `TestQuestion.test.tsx` pasan sin reescribir su
  lógica, solo agregando el prop.

**Should:**
- El orden de las 3 opciones varía entre preguntas (no siempre el mismo
  botón en la misma posición) — evita que la posición, no el
  reconocimiento, sea lo que se aprende.

**Must NOT:**
- No debe usarse `isCorrectAnswer`/`normalizeAnswer` para calificar el
  modo `'choice'` — es comparación exacta de id (`selectedId === bone.id`),
  no texto tolerante; mezclar los dos criterios sería aplicar una regla de
  dominio donde no corresponde.
- No debe editarse `must-data-003` en `governance/guardrails.md` (ADR-012)
  — sigue describiendo el modo escrito, intacto.

### Scenarios (delta over the scope)

El hallazgo de `accessibleHint`/`accessibleLabel` no estaba en `scope.md`
— lo agrega el gemba de esta fase:

```gherkin
Given SkeletonTestView o BoneTestView montados con el formato por defecto
When un lector de pantalla lee la pista accesible de la escena
Then el texto no dice "escribí" — describe cómo responder en opción múltiple
```
