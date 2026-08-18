# Story e8.3: Plausible distractors — Design

> Complexity: simple

## 1 · What & why

**Problem:** el modo test por opción múltiple (e8.4) necesita 2 opciones
incorrectas por pregunta, y no hay hoy ninguna función que las elija —
`pickTestableBone` (`src/domain/quiz.ts`) solo elige *qué* preguntar, nunca
*entre qué* opciones.

**Value:** distractores del mismo tipo anatómico (fémur / tibia / peroné,
no fémur / vómer / estribo) obligan a reconocer el hueso, no a descartar lo
obviamente distinto — es la diferencia entre un test que mide algo y uno
que no.

## 2 · Approach

Una función de dominio pura, `pickDistractors`, que recibe el hueso
preguntado y el catálogo, y devuelve 2 huesos preguntables: primero agota
los de la misma región, y si la región no alcanza, completa desde el resto
del catálogo preguntable.

**Components affected:**

- `src/domain/distractors.ts` (nuevo): `pickDistractors`.
- `src/domain/distractors.test.ts` (nuevo): casos típico, límite y
  determinismo.

**Legacy sweep:** nada queda huérfano — es código net-new, sin componente
previo que reemplace.

## 3 · Interface / examples

### Usage

```ts
import { pickDistractors } from '../domain/distractors'
import { catalog } from '../data/catalog'

const femurDerecho = catalog.find((b) => b.id === 'femur-right')!
const distractores = pickDistractors(femurDerecho, catalog)
// → 2 Bone, p. ej. tibia-right y fibula-right (mismo `region: 'lower-limb'`)
```

Con sorteo inyectado, para un test determinista:

```ts
const sorteoFijo = () => 0 // siempre el primer candidato disponible
pickDistractors(femurDerecho, catalog, { sorteo: sorteoFijo })
```

### Expected output (success + error)

```ts
// Caso típico — lower-limb tiene 60 huesos preguntables
pickDistractors(femurDerecho, catalog)
// → [Bone, Bone] — ambos region: 'lower-limb', ninguno 'femur-right',
//   ninguno repetido entre sí

// Caso límite — pelvic-girdle tiene solo 2 huesos preguntables en total
const coxalDerecho = catalog.find((b) => b.id === 'hip-bone-right')!
pickDistractors(coxalDerecho, catalog)
// → [hip-bone-left, X] — X es un hueso preguntable de cualquier otra
//   región (relleno), nunca 'hip-bone-right', nunca repetido

// Error — catálogo sin huesos preguntables además del preguntado
pickDistractors(femurDerecho, [femurDerecho])
// → lanza, mismo criterio que pickTestableBone ante un catálogo sin
//   candidatos: un error explícito, nunca un array más corto en silencio
```

### Key data structures

```ts
export interface DistractorOptions {
  /** Cuántos distractores devolver. Por defecto 2 (opción múltiple de e8.4). */
  count?: number
  /** Sorteo inyectable, mismo patrón que PickOptions en quiz.ts. */
  sorteo?: () => number
}

export function pickDistractors(
  bone: Bone,
  catalog: readonly Bone[],
  opciones?: DistractorOptions,
): Bone[]
```

## 4 · Acceptance criteria

**Must:**
- Nunca devuelve el hueso preguntado entre los distractores.
- Nunca devuelve el mismo hueso dos veces.
- Solo devuelve huesos con `meshName !== null` (preguntables).
- Prioriza la misma `region` que el hueso preguntado; si esa región no
  tiene suficientes huesos preguntables además del propio, completa desde
  el resto del catálogo preguntable.
- Con `catalog.length` insuficiente (menos de `count + 1` huesos
  preguntables en todo el catálogo), lanza un error explícito — nunca
  devuelve menos del `count` pedido en silencio.

**Should:**
- El `sorteo` inyectado hace el resultado determinista, mismo contrato que
  `pickTestableBone`.

**Must NOT:**
- No debe depender de `Math.random` directamente (solo a través de
  `sorteo`, con default `Math.random`) — si no, ningún test puede fijar el
  resultado sin ser intermitente.

### Scenarios (delta over the scope)

El escenario del catálogo insuficiente (error explícito) no estaba en
`scope.md` — lo agrega el gemba de esta fase, siguiendo el mismo criterio
que `pickTestableBone` ya usa ante un catálogo sin candidatos (lanza, no
devuelve un resultado parcial).

```gherkin
Given un catálogo con menos de count+1 huesos preguntables en total
When se piden sus distractores
Then la función lanza un error explícito, nunca un array más corto que count
```
