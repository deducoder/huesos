# Story e7.5: Panel de identidad — Design

> Complexity: simple

## 1 · What & why

**Problem:** `BoneIdentity` es el único componente de e7.1 que quedó a mitad
de camino: recibió color, pero no el mínimo táctil (`border-2`,
`rounded-suave`) ni la tipografía display de e7.3. Y desde e7.4 puede mostrar
«Lado: derecho» sobre un hueso —martillo, yunque, estribo— cuyo lado el
estudiante nunca eligió, porque el navegador ya no se lo ofrece.

**Value:** el panel se pulsa sin apuntar, se ve con la misma voz que el resto
de la aplicación, y no afirma una elección que no ocurrió.

## 2 · Approach

Tres cambios mecánicos —botón a 44 px, `h2` con `--font-display`, borde/radio
consistentes— y uno de lógica: extraer el emparejamiento por id que ya vive en
`navigator-rows.ts` a un módulo compartido, y usarlo también para decidir
cuándo ocultar el campo «Lado».

**Por qué no se resuelve sin tocar `navigator-rows.ts` (e7.4):** ese archivo
ya calcula «¿el par de este hueso también carece de malla?» para colapsar
filas del navegador. Repetir esa lógica acá —una segunda regex
`-right`/`-left`— sería la misma duplicación que en b2.1 llevó a reutilizar
`sanitizeNodeName` de `three` en vez de reimplementarla. Se extrae una vez, la
usan los dos.

**Components affected:**

- `src/domain/side-pairing.ts`: create — `siblingId` (bidireccional, el
  `navigator-rows.ts` actual solo resuelve derecha→izquierda) e
  `isSideIrrelevant`.
- `src/domain/navigator-rows.ts`: modify — consume `siblingId` en vez de su
  regex propia; su comportamiento no cambia, solo de dónde sale el cálculo.
- `src/domain/side-pairing.test.ts`: create.
- `src/components/BoneIdentity.tsx`: modify — botón, tipografía, bordes,
  campo «Lado» condicionado.
- `src/components/BoneIdentity.test.tsx`: modify — un caso se corrige a
  propósito (ver Acceptance criteria), dos se agregan.

**Legacy sweep:** nada queda huérfano. La regex de `navigator-rows.ts` se
reemplaza por una llamada a `siblingId`, no queda una segunda copia viva.
`isUnpaired` no se toca — sigue respondiendo una pregunta distinta.

### Por qué `BoneIdentity` importa el catálogo, y no recibe un prop nuevo

Subiendo la escalera: ¿hace falta que el componente sepa del catálogo? La
alternativa —cada vista (`ExploreView`, `BoneDetailView`) calcula
`isSideIrrelevant` y lo pasa como prop— duplica la llamada en los dos sitios
que montan `BoneIdentity`, exactamente lo que esta historia evita en el
dominio. El catálogo ya es un módulo estático que `ExploreView` y
`BoneNavigator` importan directamente; `BoneIdentity` haciendo lo mismo no es
una dependencia nueva, es el mismo patrón que el resto de la capa de vista ya
usa.

## 3 · Interface / examples

### El módulo compartido

```ts
// src/domain/side-pairing.ts
import type { Bone } from '../data/bone'

/** El id del lado opuesto, o `null` si el hueso es impar. */
export function siblingId(bone: Pick<Bone, 'id' | 'side'>): string | null {
  if (bone.side === 'right') return bone.id.replace(/-right$/, '-left')
  if (bone.side === 'left') return bone.id.replace(/-left$/, '-right')
  return null
}

/**
 * El lado no distingue nada observable: este hueso no tiene malla, y tampoco
 * la tiene su opuesto. Es la misma condición que colapsa una fila del
 * navegador (e7.4), consultada acá para un solo hueso en vez de una lista.
 */
export function isSideIrrelevant(bone: Bone, catalog: readonly Bone[]): boolean {
  if (bone.meshName !== null) return false
  const id = siblingId(bone)
  if (id === null) return false
  const opuesto = catalog.find((b) => b.id === id)
  return opuesto !== undefined && opuesto.meshName === null
}
```

| Input | Output |
|---|---|
| `malleus-right` contra el catálogo real | `true` — ninguno de los dos tiene malla |
| `femur-right` contra el catálogo real | `false` — tiene su propia malla |
| Un hueso hipotético cuyo opuesto no existe en el catálogo (dato roto) | `false` — nunca oculta por un dato que no puede confirmar; el contrato es "muestra de más ante la duda", nunca "esconde de más" |

### `BoneIdentity.tsx`, el campo condicionado

```tsx
import { catalog } from '../data/catalog'
import { isSideIrrelevant } from '../domain/side-pairing'
// ...
const ocultarLado = bone.side !== null && isSideIrrelevant(bone, catalog)

{bone.side !== null && !ocultarLado && (
  <div className="flex gap-2">
    <dt className="text-tinta-suave">Lado</dt>
    <dd>{SIDE_LABEL[bone.side]}</dd>
  </div>
)}
// …
<p role="status" aria-live="polite" className="sr-only">
  {bone.es}
  {bone.side !== null && !ocultarLado ? ` ${SIDE_LABEL[bone.side]}` : ''}, {bone.la}
</p>
```

### Los tres cambios mecánicos

```tsx
// el botón — antes: py-1.5 (~34 px de alto)
className="mt-4 rounded border border-tinta px-3 py-1.5 text-tinta text-sm hover:bg-acento-suave"
// después
className="mt-4 min-h-tactil rounded-suave border-2 border-tinta px-4 text-tinta text-sm hover:bg-acento-suave"

// el h2 — antes: sin familia declarada
className="font-semibold text-2xl text-tinta"
// después
className="font-display font-semibold text-2xl text-tinta"

// el aviso de ausencia — antes: border simple, radio por defecto
className="mt-4 rounded border border-aviso bg-aviso-fondo p-3 text-aviso-tinta text-sm"
// después
className="mt-4 rounded-suave border-2 border-aviso bg-aviso-fondo p-3 text-aviso-tinta text-sm"
```

## 4 · Acceptance criteria

- **Must:**
  1. El botón «ver ficha completa» mide ≥ 44×44 px en 390×844.
  2. El `h2` del hueso usa `--font-display`, verificado con familia computada
     en navegador (mismo criterio que e7.3 usó para el `h1`).
  3. `isSideIrrelevant(malleus-right, catalog)` → `true`;
     `isSideIrrelevant(femur-right, catalog)` → `false`.
  4. El campo «Lado» y el anuncio en vivo aplican la misma condición — no hay
     un tercer lugar donde el lado se muestre sin pasar por `ocultarLado`.
  5. `navigator-rows.test.ts` sigue verde tras el refactor, sin reescribirse:
     es la prueba de que extraer `siblingId` no cambió el comportamiento que
     e7.4 ya cerró.
- **Should:**
  1. `border-2`/`rounded-suave` en el aviso de ausencia, coherente con el
     resto del rediseño.
- **Must NOT:**
  1. No se toca `isUnpaired` ni el catálogo.
  2. No se cambia `bone.missingReason` ni el texto del aviso de ausencia.
  3. `isSideIrrelevant` nunca oculta el lado por un dato que no puede
     confirmar — ante la duda, muestra de más, nunca de menos.

### Scenarios (delta over the scope)

```gherkin
Given `navigator-rows.ts`, que ya resolvía "derecha → izquierda" con su
      propia expresión regular
When esta historia necesita "izquierda → derecha" para el caso inverso
Then se extrae `siblingId` bidireccional a un módulo compartido, y
     `navigator-rows.ts` pasa a consumirlo — un cálculo, dos consumidores,
     en vez de una segunda regex

Given el test existente de `BoneIdentity.test.tsx` línea 17-24, que usa
      `femur-right` para comprobar que el campo «Lado» aparece
When se corre tras el cambio
Then sigue en verde sin tocarse: `femur-right` no es un par ausente, así que
     `ocultarLado` es `false` y el campo se muestra igual que siempre
```
