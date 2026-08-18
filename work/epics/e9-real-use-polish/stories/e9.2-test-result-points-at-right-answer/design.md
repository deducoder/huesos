# Story e9.2: The test result points at the right answer — Design

> Complexity: moderate

## 1 · What & why

**Problem:** al fallar una pregunta de opción múltiple, `TestQuestion.tsx`
sustituye la grilla entera por un panel de texto («Incorrecto»). El estudiante
pierde de vista cuál era la opción correcta justo cuando más la necesita.

**Value:** el error se convierte en aprendizaje en el momento — se ve qué se
tocó y qué era lo correcto, sin tener que recordar tres etiquetas que ya no
están en pantalla.

## 2 · Approach

**La grilla se queda montada y cambia de apariencia según el resultado**, en
vez de que un bloque de texto la sustituya. El mismo botón «Responder» muta a
«Siguiente pregunta» — no aparece un botón nuevo al lado de un panel de texto.
Cuatro piezas más, todas ya con destino en el scope: props requeridas,
`reservedBottom` real en `BoneTestView`, y `hyphens: auto` para la palabra
larga.

**Components affected:**

- `src/features/test/TestQuestion.tsx`: modify — la fieldset se recalifica en
  vez de ocultarse; el botón muta; `onCambiarModo` requerido.
- `src/components/BoneIdentity.tsx`: modify — `onViewDetail` requerido; se
  retira la condición `{onViewDetail && (...)}`, ahora siempre verdadera.
- `src/features/explore/ExploreView.tsx`: modify — `onViewDetail` requerido
  (solo forwardea; App.tsx ya lo pasa siempre).
- `src/features/test/BoneTestView.tsx`, `SkeletonTestView.tsx`: modify —
  `onCambiarModo` requerido; `BoneTestView` mide su barra con el hook nuevo.
- `src/components/useFraccionCubierta.ts`: **create** — extraído de
  `BoneDetailView.tsx`, sin cambiar su comportamiento, para que
  `TestQuestion` lo reutilice. Es la misma función, ahora compartida.
- `src/features/bone-detail/BoneDetailView.tsx`: modify — importa el hook en
  vez de declararlo localmente.
- `src/components/BoneIdentity.test.tsx`: modify — retira el test que
  ejercitaba un estado que dejó de existir.

**Legacy sweep:** `{onViewDetail && (...)}` en `BoneIdentity.tsx` deja de
tener una rama falsa alcanzable — la condición se retira, el botón se
renderiza siempre que hay un `bone`. El test que verificaba la rama ausente
(`'no muestra el botón de ficha completa sin el callback'`) se **borra**, no
se reescribe: no hay ningún valor de tipo válido que vuelva a poner
`onViewDetail` en `undefined`. `useFraccionCubierta` deja de ser local a
`BoneDetailView.tsx`; el archivo pasa a importarlo, sin duplicar la función.

## 3 · Interface / examples

### Usage

```tsx
// src/components/useFraccionCubierta.ts — mismo cuerpo que hoy vive en
// BoneDetailView.tsx, solo con export y sin cambios de comportamiento.
export function useFraccionCubierta(
  contenedor: React.RefObject<HTMLDivElement | null>,
  flotante: React.RefObject<HTMLDivElement | null>,
): number { /* … */ }
```

```tsx
// src/features/test/TestQuestion.tsx — el mismo patrón que BoneDetailView:
// dos refs sobre elementos que ya son hermanos en el JSX de este componente.
const contenedorRef = useRef<HTMLDivElement>(null)
const barraRef = useRef<HTMLDivElement>(null)
const reservedBottom = useFraccionCubierta(contenedorRef, barraRef)
// …
<div ref={contenedorRef} className="relative h-full md:mx-auto md:max-w-3xl">
  <div className="absolute inset-0 bg-lienzo">{renderScene(bone.id, reservedBottom)}</div>
  {/* … */}
  <div ref={barraRef} data-testid="barra-respuesta" /* … */>
```

```ts
// Props — renderScene gana un segundo argumento. SkeletonTestView lo ignora
// (SkeletonScene no tiene reservedBottom: ese encuadre es objeto de e9.4);
// BoneTestView lo reenvía.
renderScene: (boneId: string, reservedBottom: number) => ReactNode
```

### Expected output

Calificación de una opción, sin depender solo del color (`must-a11y-005`):

```tsx
function claseOpcion(opcion: Bone): string {
  if (resultado === 'pendiente') return seleccionId === opcion.id ? SELECCIONADA : NEUTRA
  if (opcion.id === bone.id) return ACIERTO       // siempre marca la correcta
  if (opcion.id === seleccionId) return ERROR     // solo si fue la elegida
  return NEUTRA
}
// Cada botón calificado lleva además su símbolo, no solo el fondo:
// «✓ Falange proximal 2.º mano» / «✗ 5.ª costilla»
```

Medido en 390 px, la palabra que hoy desborda:

| Texto | `hyphens` | scrollWidth | clientWidth | Desborda |
|-------|-----------|------------:|------------:|----------|
| `metacarpiano` | `normal` (hoy) | 99 | 98 | sí, 1 px |
| `metacarpiano` | `auto`, heredando `lang="es"` del `<html>` | 98 | 98 | no |

### Key data structures

Sin tipos nuevos. `claseOpcion`/el símbolo se derivan de `resultado`,
`seleccionId`, `opcion.id` y `bone.id`, todos ya existentes en el componente.

## 4 · Acceptance criteria

- **Must:**
  1. Tras responder (`resultado !== 'pendiente'`), las tres opciones del
     `fieldset` siguen en el DOM — ninguna desaparece.
  2. La opción con `id === bone.id` lleva la clase y el símbolo de acierto,
     responda bien o mal el estudiante.
  3. La opción con `id === seleccionId`, cuando erró, lleva la clase y el
     símbolo de error. Si acertó, es la misma opción que el punto 2.
  4. El botón que decía «Responder» pasa a decir «Siguiente pregunta» y
     dispara `siguiente()` — no hay un segundo botón.
  5. `onViewDetail` y `onCambiarModo` son requeridos en sus tres componentes;
     `./scripts/check` sigue en verde con los llamadores reales de `App.tsx`.
- **Should:**
  1. `metacarpiano`/`metatarsiano` no desbordan su botón en 390 px.
  2. La barra de respuesta de `BoneTestView` reserva su alto real.
- **Must NOT:**
  1. Ningún nombre de hueso llega al DOM antes de responder
     (`must-data-003`/`must-data-010` sin cambios; sus pruebas siguen en
     verde sin reescribirse).
  2. El acierto/error no depende solo del color de fondo (`must-a11y-005`).
  3. `answerFormat="open"` no cambia — su panel de texto ya revela el nombre
     completo y no tiene grilla que calificar.

### Scenarios (delta over the scope)

```gherkin
# AÑADIDO — el gemba encontró que `useFraccionCubierta` no tiene test
# unitario propio: se verifica por e2e porque `ResizeObserver` sobre layout
# real no dice nada en jsdom (memoria: medir después del layout). La
# verificación de esta pieza es manual + e2e, no una prueba nueva de vitest.
Given la barra de respuesta de BoneTestView con contenido real
When se mide en el navegador
Then IsolatedBoneScene recibe la fracción real, no 0

# AÑADIDO — retirar la condición muerta de BoneIdentity no es limpieza
# aparte: es la consecuencia directa de hacer requerida la prop.
Given que `onViewDetail` es ahora requerido en BoneIdentity
When se renderiza con cualquier hueso elegido
Then el botón "Ver ficha completa" aparece siempre
```

## 5 · Governance

- `must-a11y-005` decide que el indicador de acierto/error lleva símbolo o
  texto, no solo color — criterio nuevo en esta historia, no heredado.
- `must-data-003`/`must-data-010` acotan qué puede cambiar: el estado
  **posterior** a responder, nunca lo que el DOM expone antes.
