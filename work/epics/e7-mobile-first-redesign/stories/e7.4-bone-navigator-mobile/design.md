# Story e7.4: Navegador de huesos en móvil — Design

> Complexity: complex

## 1 · What & why

**Problem:** cada fila del navegador mide 373×28 px — muy por debajo del
mínimo táctil de 44 px — y los 206 huesos, uno por fila, hacen del navegador la
lista más larga de la aplicación en un móvil.

**Value:** todo objetivo se puede pulsar sin apuntar, y el desplazamiento total
para recorrer los 206 huesos **baja** respecto de hoy en vez de crecer —medido,
no supuesto— porque 172 de los 206 comparten fila con su par.

## 2 · Approach

**Emparejar cada hueso par con su opuesto en una sola fila** —un nombre común
más dos píldoras de lado, «Derecho» / «Izquierdo»— y dejar los 34 impares como
hoy, una fila por hueso. La fila usa `flex-wrap`: cuando el nombre es corto,
nombre y píldoras conviven en una línea; cuando es largo, el nombre se parte en
dos líneas **dentro del mismo alto de 44 px** —verificado, no es una hipótesis:
ver la sección 3.

**Tres opciones se prototiparon y midieron con Playwright, no se decidieron a
ojo:**

| Opción | Descripción | Alto fila corta | Alto fila larga | Total proyectado |
|---|---|---:|---:|---:|
| A | Cada fila a 44 px, sin emparejar | 44 px | 44 px (el texto envuelve dentro) | **9.504 px** (+53%) |
| B | Nombre + píldoras, con relleno propio | 60 px | 82 px | 7.712 px (+24%) |
| **C (elegida)** | Nombre + píldoras, sin relleno extra — el alto lo da la píldora | **44 px** | **44 px** | **5.720 px (−8%)** |

La diferencia entre B y C es una sola decisión de CSS: en C, el nombre no lleva
relleno vertical propio y las píldoras se alinean por `align-items: center`
contra el alto de 44 px que ellas mismas fijan. El texto de dos líneas cabe
dentro de esa altura con la métrica de línea por defecto —comprobado con
capturas, no clip, no desborde—, así que el alto de la fila nunca depende de
cuántas líneas ocupe el nombre.

**Components affected:**

- `src/domain/navigator-rows.ts`: create — la función pura que empareja.
- `src/components/BoneNavigator.tsx`: modify — consume las filas emparejadas.
- `src/components/BoneNavigator.test.tsx`: **no se toca** — es el contrato que
  esta historia tiene que seguir cumpliendo sin reescribirlo.
- `src/domain/navigator-rows.test.ts`: create — la función nueva es pura y se
  prueba sola, sin React.

**Legacy sweep:** nada queda huérfano. `groupByRegion` no cambia — sigue
agrupando por región; `toNavigatorRows` es una capa nueva que consume su
salida. `isUnpaired` y `SIDE_LABEL` se reutilizan tal cual, sin duplicar la
lógica de qué hueso es par.

### Por qué no hace falta más código del que hay

Subiendo la escalera de `architecture-review`: ¿hace falta el emparejamiento?
Sin él (opción A) el criterio *must* se cumple igual —lo prueban las mismas
capturas—, pero el *should* de la épica («más rápido de recorrer, no solo más
bonito») queda incumplido y la lista crece un 53%. El emparejamiento cuesta una
función pura de veinte líneas y un cambio de JSX; es la MVP que sí entrega el
valor completo, no una sobre-construcción — no hay librería de virtualización,
no hay estado nuevo, no hay componente nuevo aparte del que ya existía.

## 3 · Interface / examples

### La función de emparejamiento

```ts
// src/domain/navigator-rows.ts
export type NavigatorRow =
  | { kind: 'paired'; name: string; right: Bone; left: Bone }
  | { kind: 'single'; bone: Bone }

/**
 * Agrupa huesos pares adyacentes en una sola fila. Recorre en el orden que
 * ya trae la lista —el catálogo pone contiguos el lado derecho y el
 * izquierdo de un mismo hueso (verificado: los 86 pares, en las 10
 * regiones)— y nunca asume la adyacencia sin comprobarla: si un derecho no
 * tiene su izquierdo justo después, ambos se renderizan como filas simples
 * en vez de perderse. Es la salida sin caída silenciosa que exige la
 * historia.
 */
export function toNavigatorRows(bones: readonly Bone[]): NavigatorRow[] {
  const filas: NavigatorRow[] = []
  for (let i = 0; i < bones.length; i++) {
    const hueso = bones[i]
    const siguiente = bones[i + 1]
    const esParConsecutivo =
      hueso.side === 'right' &&
      siguiente?.side === 'left' &&
      siguiente.id === hueso.id.replace(/-right$/, '-left')
    if (esParConsecutivo) {
      filas.push({ kind: 'paired', name: hueso.es, right: hueso, left: siguiente })
      i++
      continue
    }
    filas.push({ kind: 'single', bone: hueso })
  }
  return filas
}
```

### Ejemplos

| Input | Output |
|---|---|
| `[femur-right, femur-left, patella-right, patella-left]` | 2 filas `paired` |
| `[sphenoid]` (impar) | 1 fila `single` |
| `[femur-right]` sin su izquierdo a continuación (dato roto hipotético) | 1 fila `single` — no se pierde, se degrada |
| Las 206 entradas del catálogo real | **120 filas**: 86 `paired` + 34 `single` |

### El JSX de una fila emparejada

```tsx
// dentro de BoneNavigator, por cada fila de tipo 'paired'
<li key={fila.right.id} className="flex flex-wrap items-center gap-x-2">
  <span id={`${fila.right.id}-nombre`} className="min-w-20 flex-1 py-0.5">
    {fila.name}
  </span>
  {[fila.right, fila.left].map((hueso) => (
    <button
      key={hueso.id}
      type="button"
      aria-pressed={selected === hueso.id}
      aria-labelledby={`${fila.right.id}-nombre ${hueso.id}-lado`}
      aria-describedby={hueso.meshName === null ? `${hueso.id}-missing` : undefined}
      onClick={() => onSelect(hueso.id)}
      className={`min-h-tactil min-w-16 rounded-tarjeta border-2 border-tinta px-3 text-sm ${
        selected === hueso.id ? 'bg-acento text-panel shadow-dura' : 'bg-panel text-tinta'
      }`}
    >
      <span id={`${hueso.id}-lado`}>{SIDE_LABEL[hueso.side]}</span>
    </button>
  ))}
</li>
```

`aria-labelledby` compone el nombre accesible desde dos elementos —el mismo
patrón que ya usan la región (`<h2 id={titleId}>` + `<ul
aria-labelledby={titleId}>`)— en vez de repetir la cadena completa en un
`aria-label`: el navegador une «fémur» y «Derecho» en «fémur Derecho», que
sigue cumpliendo `getByRole('button', { name: /fémur.*derecho/i })` sin que el
código escriba el nombre del hueso dos veces.

`rounded-tarjeta` y `shadow-dura` son los tokens de e7.1 que hasta ahora no
tenían consumidor — la referencia `~/refs/cards.jpg` que el usuario aportó
muestra exactamente esta forma, una píldora de esquina muy redondeada. Solo la
píldora **seleccionada** lleva `shadow-dura`, el mismo patrón que ya usan las
pestañas de `App.tsx`: con selección única (`SelectionId = string | null`,
`src/domain/selection.ts`), nunca hay más de una sombra a la vez, así que
`ADR-007` («el tratamiento de tarjeta no escala a 206 huesos») queda respetado
— el borde sin sombra es la norma; la sombra es la excepción de una sola fila.

### Salida esperada de la prueba nueva

```
✓ src/domain/navigator-rows.test.ts (5)
  ✓ empareja dos huesos adyacentes con lados opuestos
  ✓ dos impares seguidos quedan como dos filas simples
  ✓ un derecho sin su izquierdo adyacente no se pierde, queda como fila simple
  ✓ conserva el orden de aparición
  ✓ sobre el catálogo real: 120 filas, 86 pares y 34 simples
```

## 4 · Acceptance criteria

- **Must:**
  1. Toda píldora de lado y toda fila simple miden 44×44 px o más en 390×844.
  2. El nombre más largo del catálogo se lee completo, sin truncar, en su fila
     —incluida la de tipo `paired`.
  3. El desplazamiento total para recorrer las 206 entradas **no supera** el de
     hoy: medido en 5.720 px proyectados contra 6.208 px actuales.
  4. `src/components/BoneNavigator.test.tsx` sigue verde **sin editarse**.
  5. `toNavigatorRows` nunca deja un hueso sin fila, incluso si un derecho
     careciera de su izquierdo adyacente.
- **Should:**
  1. Solo la píldora seleccionada lleva `shadow-dura` — el resto, borde sin
     sombra.
- **Must NOT:**
  1. No se toca `groupByRegion`, `isUnpaired` ni el catálogo.
  2. Ninguna fila usa una etiqueta de lado escrita a mano: sale de
     `SIDE_LABEL`.
  3. Ningún hueso par se muestra sin su nombre común visible.

### Scenarios (delta over the scope)

```gherkin
Given el criterio del scope «el desplazamiento no crece más que el factor de
      cada objetivo»
When se mide con las tres opciones prototipadas
Then la elegida no solo cumple el límite — **reduce** el desplazamiento total
     un 8% respecto de hoy, porque emparejar baja el número de filas más de lo
     que sube el alto de cada una

Given el temor del scope de que un nombre de 44 caracteres desborde su fila
When se renderiza junto a las dos píldoras en 390 px
Then envuelve a dos líneas **dentro** de los 44 px de alto, sin crecer la fila
     y sin truncar — verificado con captura, no es una suposición

Given `--radius-tarjeta`, declarado en e7.1 sin consumidor desde entonces
When esta historia elige la forma de la píldora
Then se convierte en su primer consumidor, y coincide con la referencia de
     píldoras que el usuario aportó probando e7.2 — sin haber sido diseñada
     para eso a propósito, la evidencia coincidió con la referencia
```
