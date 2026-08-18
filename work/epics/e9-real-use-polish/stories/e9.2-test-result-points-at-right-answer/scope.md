# Story e9.2: The test result points at the right answer — Scope

## User story

As a quien responde una pregunta de opción múltiple,
I want ver, después de responder, cuál opción elegí y cuál era la correcta,
so that pueda aprender del error en el momento en vez de que la pantalla me
diga solo «Incorrecto» y me deje adivinando.

## Acceptance criteria

```gherkin
Given que respondo bien una pregunta de opción múltiple
When se muestra el resultado
Then la opción que elegí —la correcta— queda marcada como acierto
And "Responder" pasa a decir "Siguiente pregunta"

Given que respondo mal una pregunta de opción múltiple
When se muestra el resultado
Then la opción que elegí queda marcada como error
And la opción correcta queda marcada como acierto, aunque no la haya tocado
And la tercera opción, la que no eligió nadie, queda sin marcar
And "Responder" pasa a decir "Siguiente pregunta"

Given el resultado ya mostrado, sea acierto o error
When lo miro sin distinguir colores
Then puedo saber cuál era la correcta por otra vía además del color
     (must-a11y-005: el color nunca es el único indicador)

Given que toco "Siguiente pregunta"
When se monta la pregunta nueva
Then las tres opciones vuelven a su estado neutro, sin marca de ninguna

Given el formato escrito original (`answerFormat="open"`, solo alcanzable
  desde los propios tests)
When respondo mal
Then el panel de texto que ya revela el nombre completo sigue igual —
     esta historia no toca ese camino, que no tiene grilla que calificar

Given `onViewDetail` en `BoneIdentity`/`ExploreView` y `onCambiarModo` en
  `TestQuestion`/`BoneTestView`/`SkeletonTestView`
When se hacen requeridas
Then el compilador nombra a cualquier llamador que hoy las omita
And ninguno lo hace: los tres callers de producción ya las pasan siempre
```

## Example

Sorteada la falange proximal 2.º mano derecha, con distractores «5.ª
costilla» y «húmero derecho» (`pickDistractors`, misma región cuando
alcanza, resto del catálogo si no).

| Elegí | Resultado | Falange (correcta) | 5.ª costilla | Húmero derecho | Botón |
|-------|-----------|:---:|:---:|:---:|-------|
| Falange | Acierto | ✓ verde | neutro | neutro | «Siguiente pregunta» |
| 5.ª costilla | Error | ✓ verde (sin tocarla) | ✗ rojo (la elegida) | neutro | «Siguiente pregunta» |

## In scope

- **El estado posterior a la respuesta del formato de opción múltiple**
  (`answerFormat="choice"`, el único alcanzable desde la interfaz real,
  ADR-012): la grilla de tres botones se queda montada — no la sustituye un
  panel de texto — y cada botón se recalifica contra `bone.id` (la respuesta
  correcta) y `seleccionId` (la elegida).
- **Un indicador que no dependa solo del color** para acierto y error
  (`must-a11y-005`): texto, ícono o `aria-label` además del fondo verde/rojo.
- **El mismo botón "Responder" pasa a "Siguiente pregunta"**, en vez de que
  aparezca un botón nuevo al lado de un panel de texto.
- **Los tokens `--color-acierto`/`--color-error`** que e9.1 dejó declarados
  y sin consumidor: esta historia es quien los usa por primera vez.
- **Hacer requeridas `onViewDetail`** (`BoneIdentity.tsx`, forwardeado por
  `ExploreView.tsx`) **y `onCambiarModo`** (`TestQuestion.tsx`, forwardeado
  por `BoneTestView.tsx` y `SkeletonTestView.tsx`) — deuda con disparador
  explícito desde el epic-review de E8, cumplido acá por ser la primera
  historia de E9 que entra a `src/features/test/`.
- **La barra de respuesta reserva su alto real** en `IsolatedBoneScene`, vía
  `BoneTestView` — hoy pasa `reservedBottom={0}` aunque la barra sí flota
  sobre el lienzo (hallazgo de e9.3). Reutiliza el patrón `useFraccionCubierta`
  de `BoneDetailView.tsx`, medido con `ResizeObserver` después del layout.
- **El desbordamiento de una palabra larga en una opción** («metacarpiano»,
  «metatarsiano») — hallazgo de e9.5, en la misma grilla que esta historia
  ya está tocando.

## Out of scope

- **El formato escrito (`answerFormat="open"`)** — solo lo alcanzan los
  propios tests desde ADR-012; ya revela `bone.es`/`bone.la` al fallar y no
  tiene grilla que calificar. No se toca.
- **`must-data-003` y `must-data-010`**, que gobiernan lo que llega al DOM
  **antes** de responder — esta historia solo cambia lo que aparece
  **después**, y no se reescriben sus pruebas, solo se confirma que siguen
  en verde.
- **El zoom de la escena de esqueleto completo a la selección** — es e9.4.
- **`answerFormat` en sí** — sigue opcional: ningún llamador de producción lo
  pasa nunca, así que "todos los llamadores ya lo pasan" no aplica, a
  diferencia de `onViewDetail`/`onCambiarModo`.
- **Animar el cambio de color de las opciones** — rabbit hole del brief de
  la épica.
- **Unificar `BoneIdentity` y `BoneSheet`** — duplicación deliberada,
  aparcada desde epic-review de E8 con destino propio.

## Done when

- Tras responder una pregunta de opción múltiple, las tres opciones siguen
  en pantalla: la correcta en verde, la elegida en rojo si erró, la tercera
  sin marca.
- El acierto y el error se distinguen sin depender solo del color.
- El botón dice "Siguiente pregunta" en el mismo lugar donde decía
  "Responder", no en un botón nuevo.
- `onViewDetail` y `onCambiarModo` son props requeridas en sus tres
  componentes, y `./scripts/check` sigue en verde con todos sus llamadores
  de producción.
- La barra de respuesta del modo hueso aislado reserva su alto real: el
  hueso no queda centrado detrás de ella.
- Una opción con una palabra larga («metacarpiano») no se sale de su botón
  en 390 px.
- `./scripts/check` y `./scripts/check-integration` en verde.
- Verificado a mano en el teléfono: acertar, errar, y "Siguiente pregunta"
  en las dos variantes de test (esqueleto completo y hueso aislado).

## Notes

- **Gemba:** `TestQuestion.tsx` hoy sustituye la grilla entera por un panel
  de texto cuando `resultado !== 'pendiente'` (líneas 163-183). El cambio es
  de **estado del mismo bloque**, no de estructura: la grilla se queda
  montada y cambia su apariencia según `resultado` y `seleccionId`.
- **`onViewDetail` no vive en `src/features/test/`** —está en
  `BoneIdentity.tsx`/`ExploreView.tsx`— pero el disparador del epic-review de
  E8 lo agrupa con `onCambiarModo` porque tocar `src/features/test/` es la
  condición que abre la tarea, no el límite de qué archivos toca.
- **Hacer requerido `onViewDetail` vuelve muerta la condición
  `{onViewDetail && (...)}`** en `BoneIdentity.tsx`: una función siempre es
  verdadera. El test `'no muestra el botón de ficha completa sin el
  callback'` deja de tener un estado válido que ejercitar y se retira, no se
  reescribe — es la consecuencia correcta de que la deuda se pagó, no un
  hallazgo nuevo.
