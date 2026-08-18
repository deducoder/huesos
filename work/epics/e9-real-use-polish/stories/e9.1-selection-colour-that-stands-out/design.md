# Story e9.1: Selection colour that actually stands out — Design

> Complexity: simple

## 1 · What & why

**Problem:** el hueso seleccionado no se distingue. Medido, el cambio es de 57
puntos de suma de canales sobre 765 — el hueso pasa de beige a un lila pálido.

**Value:** quien busca un hueso ve cuál eligió de un vistazo, y el color de
«selección» significa lo mismo en la escena que en el resto de la interfaz.

## 2 · Approach

**El color no cambia; cambia cómo se aplica.** El resaltado pasa de sumar luz
(`emissive`) a **teñir el material** (`color`), con el color original guardado
para restaurarlo. `--color-acento` se queda como está.

Esto **corrige el scope**, que daba por hecho un valor nuevo de token. Medir
demostró que el token no era el problema: sobre un material beige claro,
`emissive` **suma** luz y el resultado es siempre un beige teñido. Ningún
color ni intensidad lo arregla — el blanco puro, tope teórico de la emisión,
da 152, y teñir el albedo con el azul que ya teníamos da **282**.

**Components affected:**

- `src/components/SkeletonScene.tsx`: modify — `propio.color` en vez de
  `propio.emissive`, con el color base guardado por malla en la misma rama que
  ya clona el material.
- `src/index.css` (`@theme`): modify — `--color-acierto` y `--color-error`
  nuevos, con su ratio de contraste anotado como los demás.
- `src/components/SkeletonScene.test.tsx`: modify — el caso del resaltado.

**Legacy sweep:** nada queda huérfano. `colorDeSeleccion()` se conserva y
sigue leyendo `--color-acento` —el guardia de e7 que prohíbe el hex fijo sigue
teniendo sujeto—; solo cambia la propiedad del material que alimenta. Las dos
líneas de `emissive` desaparecen, y son propiedades de three.js, no código
propio con consumidores.

## 3 · Interface / examples

### Usage

```ts
// src/components/SkeletonScene.tsx — dentro del traverse que ya clona el material
if (!malla.userData.ownMaterial) {
  malla.material = material.clone()
  malla.userData.ownMaterial = true
  malla.userData.baseColor = material.color.clone()   // el beige del activo
}
const propio = malla.material as MeshStandardMaterial
const esteHueso = boneIdForMesh(bones, malla.name, half)
const resaltado = esteHueso !== null && esteHueso === selected
propio.color = resaltado ? colorDeSeleccion() : (malla.userData.baseColor as Color)
```

### Expected output

Medido sobre el fémur derecho, en la ventana del lienzo que el panel de
identidad no cubre. La diferencia es la suma de los tres canales, con el mismo
umbral de 40 que usa la suite:

| Mecanismo | Color | Suma | Se distingue |
|-----------|-------|-----:|--------------|
| `emissive` 0.6 | `#2f5fe0` (hoy) | **68** | no — lila pálido |
| `emissive` 0.6 | `#a5f3fc` cian pastel | 133 | apenas |
| `emissive` 0.6 | `#ffffff` **tope teórico** | 152 | apenas |
| `emissive` 3.0 | `#2f5fe0` | 143 | apenas |
| **`color`** | `#2f5fe0` | **282** | **sí — azul inconfundible** |

El tope de la emisión es el dato que decide: **ni el blanco puro al máximo
alcanza lo que el tinte consigue con el color que ya teníamos.** Y se comprobó
mirando, no solo midiendo: entre `emissive` a 0.6, a 2.0 y a 3.0, las tres
capturas son indistinguibles a simple vista pese a medir 68, 122 y 143.

### Key data structures

```css
/* src/index.css — @theme */
/* El resultado del test (e9.2 los consume; esta historia solo los declara,
   para no elegir la paleta dos veces). El color nunca es el único indicador
   de acierto o error — `must-a11y-005` exige texto o forma además. */
--color-acierto: #15803d;      /* 5.02 con texto panel encima */
--color-error: #b91c1c;        /* 6.47 con texto panel encima */
```

## 4 · Acceptance criteria

- **Must:**
  1. El hueso seleccionado se tiñe con `--color-acento`, y el cambio medido
     supera los 200 puntos —hoy son 68— en la ventana del lienzo que el panel
     de identidad no cubre.
  2. Al deseleccionar, el hueso recupera **exactamente** el color del activo,
     no un beige aproximado escrito a mano.
  3. Solo cambia el hueso seleccionado: ningún vecino se tiñe, y el lado
     opuesto de un par tampoco.
  4. `@theme` declara `--color-acierto` y `--color-error` con su ratio.
  5. El resaltado sigue leyéndose de `--color-acento` en tiempo de ejecución.
- **Should:**
  1. El hueso teñido conserva su volumen y sus sombras — teñir es multiplicar
     el albedo, no pintar una silueta plana.
- **Must NOT:**
  1. No se toca `skeleton.glb` ni sus materiales en disco (no-go del brief).
  2. No cambian `--color-lienzo` ni `REGION_ACCENT`.
  3. Ningún color literal fuera de `@theme` (ADR-007, vigilado por
     `tests/design-tokens.test.ts`).

### Scenarios (delta over the scope)

```gherkin
# CORREGIDO — el scope pedía «un valor nuevo para --color-acento». Medir
# demostró que el token no era la causa: el mecanismo lo era.
Given el resaltado del hueso seleccionado
When se aplica
Then tiñe el material con el acento que la aplicación ya usa
And el valor de `--color-acento` no cambia

# AÑADIDO — teñir exige devolver lo prestado, y `emissive` no lo exigía:
# volvía a negro, que es su neutro. El color base no tiene neutro.
Given un hueso que estuvo seleccionado
When selecciono otro
Then el primero recupera el color exacto que traía el activo
```
