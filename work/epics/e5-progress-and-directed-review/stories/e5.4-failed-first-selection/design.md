# Story e5.4: Failed-first selection — Design

> Complexity: moderate

## 1 · What & why

**Problem:** el registro existe, persiste y se llena (e5.1–e5.3), y nadie lo
lee para decidir nada. `pickTestableBone` sigue sorteando uniformemente.

**Value:** cumple el outcome "el fallo dirige el estudio", que es la razón de
ser de la épica. `RF-09` ya estaba cumplido sin esto; el proyecto no.

## 2 · Approach

`pickTestableBone` pasa de `(bones, excluirId?)` a `(bones, opciones?)`, donde
las opciones traen el registro y el sorteo. Cada candidato recibe un peso
derivado de su registro y se sortea con esos pesos.

La firma va a un objeto de opciones en vez de sumar dos parámetros
posicionales: son tres cosas opcionales e independientes, y
`pickTestableBone(catalog, undefined, progreso, sorteo)` es exactamente el tipo
de llamada que nadie sabe leer seis meses después.

**La regla de pesos:**

```
peso(hueso) = max(1, 1 + 3 × fallos − 1 × aciertos)
```

- Nunca preguntado → 1. Es la referencia.
- Fallado una vez → 4. Sale unas cuatro veces más que uno nuevo.
- Fallado una vez, acertado una → 3. La ventaja baja al recuperarse.
- Acertado cinco veces, nunca fallado → `max(1, −4)` = **1**. El suelo es lo que
  garantiza la invariante de ADR-005: la ponderación cambia frecuencias, nunca
  saca a nadie del sorteo. Un hueso dominado sigue apareciendo de vez en cuando.

Los números (3 y 1) son un **juicio declarado**, no una medición — ADR-005 lo
dice y esta historia no lo disfraza. Lo que las pruebas fijan es el **orden**
(un fallado sale más que uno no fallado, y su ventaja baja al acertarlo), no
las cifras, así que ajustarlos con uso real no romperá la suite.

**Components affected:**

- `src/domain/quiz.ts`: modify — opciones, pesos y sorteo ponderado.
- `src/features/test/TestQuestion.tsx`: modify — sus dos llamadas pasan el
  registro leído del almacén.

**Legacy sweep:** nothing. El filtro por `meshName`, la exclusión del anterior y
el caso degenerado se conservan tal cual, con sus pruebas.

## 3 · Interface / examples

### Usage (API)

```ts
// En la aplicación:
pickTestableBone(catalog, { excluirId: bone.id, progress: store.read() })

// En las pruebas, determinista:
pickTestableBone(catalog, { progress, sorteo: () => 0.5 })
```

### Expected output (success + error)

```
registro vacío            -> uniforme entre los huesos con malla
frontal con 2 fallos      -> frontal sale ~7 veces más que uno nunca preguntado
frontal con 2f y 5a       -> peso max(1, 1+6-5) = 2; sigue arriba, pero mucho menos
catálogo sin preguntables -> lanza, como ya hacía
```

### Key data structures

```ts
export interface PickOptions {
  /** El hueso de la pregunta anterior, que no se repite. */
  excluirId?: string
  /** El registro de aciertos y fallos que pondera la elección. */
  progress?: ProgressRecord
  /** El sorteo, en [0,1). Inyectable para poder afirmar la regla, no intuirla. */
  sorteo?: () => number
}
```

## 4 · Acceptance criteria

- **Must:**
  - Con pesos iguales (registro vacío), la selección es uniforme.
  - Un hueso con fallos sale con más frecuencia que uno sin ellos, medido sobre
    un barrido determinista del sorteo.
  - Aciertos posteriores reducen esa ventaja, sin llegar a anularla por debajo
    del suelo.
  - Todo hueso preguntable conserva probabilidad mayor que cero.
  - Las dos invariantes previas siguen probadas.
- **Should:**
  - El sorteo por defecto sigue siendo `Math.random`, para que la aplicación no
    tenga que pasar nada.
- **Must NOT:**
  - Ningún peso puede ser cero o negativo — sacaría a un hueso del sorteo y
    rompería la invariante de ADR-005.
  - `quiz.ts` no importa nada de `src/storage/`: recibe el registro, no lo
    busca.

### Scenarios (delta over the scope)

```gherkin
Given un hueso con muchísimos aciertos y ningún fallo   # nuevo, del diseño
When se calcula su peso
Then es 1 y no menor — el suelo impide que la ponderación lo expulse
```

El `scope.md` decía "todo hueso preguntable puede salir". El diseño lo hace
concreto: sin el `max(1, …)`, un hueso acertado muchas veces tendría peso
negativo y desaparecería del sorteo. El suelo no es defensivo, es la invariante.
