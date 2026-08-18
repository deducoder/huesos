# Story e8.2: Fichas accordion — Design

> Complexity: moderate

## 1 · What & why

**Problem:** Fichas hoy es una lista plana de 10 regiones — para llegar a
"Miembro inferior" hay que pasar por las 9 anteriores. El mockup propone
categoría → subgrupo → grilla, un nivel más de estructura que deja
colapsado lo que no se está buscando.

**Value:** menos scroll para llegar a un hueso cuando se sabe la zona del
cuerpo — la misma ganancia de "menos recorrido" que e7.4 ya midió para el
navegador oculto, ahora aplicada a la vía visible.

## 2 · Approach

Un componente nuevo (`FichasAccordion`) reemplaza el `<BoneNavigator>`
visible que `App.tsx` monta en el modo `'fichas'`. Agrupa las regiones en
categorías (una función pura nueva), y dentro de cada categoría expandida
reutiliza `toNavigatorRows` para decidir cuántas etiquetas mostrar por
hueso o par — sin reimplementar el criterio de pares indistinguibles que
e7.4/e7.5 ya resolvieron.

**Components affected:**

- `src/components/categories.ts` (nuevo) — **corrección de gemba sobre el
  `design.md` de la épica**, que lo había ubicado en `src/domain/`. Al leer
  `src/domain/regions.ts` y `src/components/labels.ts`, el proyecto ya
  declara un límite explícito: *"el dominio guarda claves estables, la
  vista las traduce"* (comentario de `labels.ts`). Derivar la categoría del
  prefijo de `REGION_LABEL` antes de "—" depende de un texto en español que
  solo existe en la capa de vista — ponerlo en `src/domain/` habría hecho
  que el dominio importara una etiqueta de presentación, exactamente lo que
  ese límite existe para evitar. Vive junto a `labels.ts`, no junto a
  `regions.ts`.
- `src/components/FichasAccordion.tsx` (nuevo) — reemplaza el
  `<BoneNavigator>` visible en el modo `'fichas'` de `App.tsx`.
- `src/App.tsx` (modify) — una línea: el modo `'fichas'` monta
  `<FichasAccordion>` en vez de `<BoneNavigator>`.
- `src/components/BoneNavigator.tsx` — **sin cambios, ni una línea**
  (ADR-011). Su función `accessibleName` (3 líneas, privada) se duplica en
  `FichasAccordion.tsx` en vez de exportarse desde ahí — exportarla
  significaría tocar el archivo que ADR-011 protege explícitamente.
  Costo ya anticipado en el "Negative/costs" de ese ADR.

**Legacy sweep:** el render de `<BoneNavigator>` dentro del modo
`'fichas'` de `App.tsx` queda huérfano y se borra con este cambio — el
componente `BoneNavigator` en sí sigue vivo, usado por `ExploreView`.

## 3 · Interface / examples

### Usage

```tsx
// App.tsx, modo 'fichas' — único cambio en este archivo
<FichasAccordion
  bones={catalog}
  onSelect={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'fichas' })}
/>
```

```ts
import { groupByRegion } from '../domain/regions'
import { groupByCategory } from './categories'

const categorias = groupByCategory(groupByRegion(catalog))
// → [
//     { category: 'Cráneo', regions: [craneoGroup, caraGroup] },
//     { category: 'Oído medio', regions: [oidoGroup] },
//     { category: 'Hioides', regions: [hioidesGroup] },
//     ... 6 más, una región cada una
//   ]
```

### Expected output (success + error)

```
// Categoría "Cráneo" colapsada → botón con aria-expanded="false"
// Activarla → aria-expanded="true", se renderizan 2 subgrupos:
//   "neurocráneo" (8) — grilla de 8 etiquetas
//   "cara" (14) — grilla de 14 etiquetas

// Subgrupo "Oído medio" expandido (6 huesos, ninguno con malla):
//   3 etiquetas: "martillo ·", "yunque ·", "estribo ·" — no 6,
//   el "·" marca "no representable" (mismo criterio que BoneNavigator)

// Etiqueta "hueso frontal" activada → onSelect('frontal')
```

### Key data structures

```ts
// src/components/categories.ts
export interface CategoryGroup {
  category: string
  regions: RegionGroup[]  // de src/domain/regions.ts, sin modificar
}

export function groupByCategory(regionGroups: readonly RegionGroup[]): CategoryGroup[]
```

```ts
// src/components/FichasAccordion.tsx
interface Props {
  bones: readonly Bone[]
  onSelect: (id: string) => void
}
```

Sin prop `selected`: a diferencia de `BoneNavigator` (que refleja la
selección de la escena 3D), Fichas nunca resalta "el hueso actual" — tocar
una etiqueta navega de inmediato a la ficha, igual que hoy.

## 4 · Acceptance criteria

**Distinct from** el scope, que ya cubre el comportamiento observable.
Delta de este gemba:

**Must:**
- `groupByCategory` es una función pura, testeada por sí misma, sin
  ningún import desde `src/domain/` hacia `src/components/labels.ts` en
  sentido inverso (el dominio no depende de la vista).
- `FichasAccordion` no importa nada de `BoneNavigator.tsx` — la
  duplicación de `accessibleName` es deliberada, documentada en el
  propio archivo con un comentario que cita esta decisión.

**Should:**
- El estado de categorías expandidas es local a `FichasAccordion` (no se
  levanta a `App.tsx`) — nadie más lo necesita.

**Must NOT:**
- No debe importarse `groupByCategory` desde `src/domain/` — vive en
  `src/components/` porque depende de `REGION_LABEL`.
- `BoneNavigator.tsx` no debe modificarse en ningún task de esta historia.

### Scenarios (delta over the scope)

Ninguno nuevo — los escenarios de `scope.md` siguen siendo la base
completa; este gemba solo corrigió *dónde* vive el código, no *qué*
observa el usuario.
