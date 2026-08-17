# Story e7.6: Vista Explorar en móvil — Design

> Complexity: moderate

## 1 · What & why

**Problem:** `ExploreView` reparte la pantalla en tres franjas fijas —lista,
lienzo, identidad—, y el lienzo, aun mejorado por e7.2, nunca ocupa más que
una fracción de la pantalla. La lista, además, es redundante con la propia
escena una vez que el navegador ya es la vía completa desde «Fichas»
(ADR-009).

**Value:** el lienzo pasa a ser la pantalla, no un tercio de ella; la
identidad aparece solo cuando hace falta, flotando; y el camino accesible
—documentado, no perdido— se traslada a un lugar donde ya funciona por
completo.

## 2 · Approach

Sustituir el grid de tres columnas por un lienzo a pantalla completa
(`absolute inset-0`) y una tarjeta de identidad que flota sobre él cuando hay
selección, con el tratamiento visual de `~/refs/cards.jpg`. Corregir los dos
textos que ADR-009 identifica como falsos sin la lista.

**Components affected:**

- `src/features/explore/ExploreView.tsx`: modify — nueva composición, sin
  `BoneNavigator`.
- `src/components/BoneIdentity.tsx`: modify — el texto del estado vacío dos
  líneas, para que no mencione «la lista».
- `src/components/SkeletonScene.tsx`: **no se toca el componente** —
  `accessibleHint` ya es una prop configurable desde e2.2/e4.2. `ExploreView`
  pasa un valor propio en vez de dejar el default.
- `src/features/explore/ExploreView.test.tsx`: modify — los tests que
  buscaban el navegador dentro de esta vista se corrigen; se agregan los que
  cubren la tarjeta flotante y el texto corregido.

**Legacy sweep:** `BoneNavigator` no queda huérfano — sigue montado en la
pestaña «Fichas», sin cambios. Nada se borra; `ExploreView` es el único
archivo cuya composición cambia.

### Por qué no hace falta más código del que hay

Subiendo la escalera: ¿hace falta un componente nuevo para «tarjeta
flotante»? No — es `BoneIdentity` sin cambios internos, dentro de un
contenedor posicionado distinto. Los tokens del tratamiento (`rounded-tarjeta`,
`shadow-dura`, `border-2`) ya existen desde e7.1/e7.4. La única lógica nueva es
un condicional para no montar la tarjeta sin selección.

### El límite de alto de la tarjeta, y por qué no se decide con un prototipo aislado

e7.4 dejó un aprendizaje concreto: un prototipo en HTML puro no reproduce las
clases reales del componente, y su cifra no se sostiene al medir el
componente terminado. Acá se evita ese paso: la tarjeta se construye con
`max-h-[45vh] overflow-y-auto` desde el principio —un límite conservador,
mayor que cualquier contenido esperado en el caso típico— y **la tarea de
implementación mide el caso real más exigente del catálogo**
(`hand-proximal-phalanx-2-right`: nombre de 44 caracteres, sinónimo, lado) y
el más largo por texto (`malleus-right`: aviso de ausencia de 165
caracteres), no un texto inventado.

## 3 · Interface / examples

### La composición

```tsx
// src/features/explore/ExploreView.tsx
export function ExploreView({ selected, onSelect, onViewDetail }: Props) {
  const bone = findBone(catalog, selected)
  return (
    <div className="relative h-full min-h-0 bg-lienzo">
      <div className="absolute inset-0">
        <SkeletonScene
          bones={catalog}
          selected={selected}
          onPick={onSelect}
          accessibleHint="Vista tridimensional del esqueleto. Para elegir un hueso sin usar el ratón, abrí la pestaña Fichas: ahí está la lista completa por región."
        />
      </div>
      {bone && (
        <div className="absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel shadow-dura">
          <BoneIdentity bone={bone} onViewDetail={onViewDetail} />
        </div>
      )}
    </div>
  )
}
```

Nota deliberada: sin selección, **no se monta ninguna tarjeta** —ni siquiera
el estado vacío de `BoneIdentity`—, porque ese estado vacío existía para
orientar hacia la lista que ya no está en esta vista. El texto corregido de
`BoneIdentity` solo se ve cuando algo **fuera** de Explorar lo monta con
`bone: undefined` — que hoy no ocurre en ningún otro lugar, pero el
componente sigue siendo correcto si algún día se reutiliza así.

### El texto del estado vacío corregido

```tsx
// BoneIdentity.tsx — antes
<p className="mt-2 text-tinta-suave text-sm">
  Podés recorrer la lista con el teclado o girar el esqueleto y hacer clic.
</p>
// después
<p className="mt-2 text-tinta-suave text-sm">
  Girá el esqueleto y tocá un hueso, o elegilo desde la pestaña Fichas.
</p>
```

### Desktop: sin diseño propio, deliberadamente

En `md:` no hay clases nuevas — el lienzo sigue `absolute inset-0` y la
tarjeta flota igual, con `max-w-md` para no estirarse a todo el ancho de un
monitor. **No es el diseño final de escritorio**: es lo mínimo para que no se
vea roto hasta e7.9, que es quien decide el breakpoint hacia arriba con la
referencia de escritorio del brief. El `scope.md` de esta historia decía que
«el layout en 1400×900 puede seguir como hoy»; el gemba de este diseño
corrige eso: no puede, porque el navegador desaparece del árbol de
renderizado en todos los tamaños. Lo que sí se sostiene es que **no se
invierte esfuerzo de diseño en el caso de escritorio** todavía.

## 4 · Acceptance criteria

- **Must:**
  1. El lienzo ocupa el 100% del contenedor de Explorar, medido en 390×844.
  2. Sin selección, no hay tarjeta ni panel ocupando espacio.
  3. Con selección, la tarjeta flota con el tratamiento de `~/refs/cards.jpg`
     (`rounded-tarjeta`, `border-2`, `shadow-dura`).
  4. El estado vacío de `BoneIdentity` no menciona «la lista».
  5. `accessibleHint` del lienzo en Explorar orienta hacia la pestaña Fichas,
     no hacia una lista inexistente.
  6. `BoneNavigator.test.tsx` y el flujo Fichas → ficha de
     `App.test.tsx` siguen verdes sin tocarse.
- **Should:**
  1. La tarjeta no supera el 45% del alto del viewport ni con el contenido
     más largo del catálogo real.
- **Must NOT:**
  1. No se toca `BoneNavigator.tsx` ni la lógica interna de `BoneDetailView`.
  2. No se decide el layout definitivo de escritorio.
  3. No se agrega un botón para cerrar la tarjeta — deseleccionar el mismo
     hueso (`toggleSelection`, ya existente) ya la retira.

### Scenarios (delta over the scope)

```gherkin
Given el scope de esta historia, que suponía que el layout de escritorio
      «puede seguir como hoy» hasta e7.9
When se lee que `BoneNavigator` se quita de `ExploreView` sin condicionar por
     viewport
Then esa suposición era imprecisa: el layout de escritorio también pierde el
     navegador. Lo que sí se sostiene es no invertir diseño ahí todavía —el
     lienzo a pantalla completa funciona en cualquier tamaño sin ajuste extra

Given que la tarjeta flotante cubre físicamente parte del lienzo
When el estudiante quiere rotar o tocar un hueso bajo esa zona mientras la
     tarjeta está visible
Then ese solapamiento se acepta como el costo normal de un panel flotante
     sobre un mapa o una escena —el mismo patrón que usan aplicaciones de
     mapas—, y no se resuelve encogiendo o desplazando la escena: tocar el
     encuadre dinámicamente es una historia mayor que esta, y no está pedida
```

## Corrección durante la implementación (ADR-010)

Este delta se agrega tras escribir el diseño de arriba, al descubrir en T1 que
quitar `BoneNavigator` del todo rompía la precisión de dos pruebas de
navegador que protegen b2.1/b2.2 y b2.3 (seleccionan un hueso específico por
nombre en la escena combinada; la pestaña Fichas usa una escena aislada
distinta, que no sirve de reemplazo). Preguntado al usuario, la resolución
—registrada en **ADR-010**, que supersede a ADR-009— es: `BoneNavigator`
**sigue montado** dentro de `ExploreView`, con `sr-only` en vez de una
columna visible.

**Lo que esto cambia respecto al diseño original:**

- **ADR-009 queda superseded.** El camino accesible no se traslada a Fichas;
  sigue viviendo dentro de Explorar, invisible pero funcional — más fiel a
  ADR-002 de lo que la primera versión de esta historia terminó siendo.
- **Los Must 4 y 5 (corregir los dos textos) quedan sin objeto.** El estado
  vacío de `BoneIdentity» («Podés recorrer la lista con el teclado…») sigue
  siendo cierto: la lista existe, solo que no se ve. El `accessibleHint` por
  defecto de `SkeletonScene` («usá la lista de huesos por región») también
  sigue siendo cierto y **no se sobreescribe** — sería trabajo innecesario
  corregir un texto que no está roto.
- **`ExploreView.test.tsx` no necesita el doble de escena con múltiples
  botones simulados** que la primera versión de este plan proponía: al seguir
  montado `BoneNavigator` (real, sin mockear), las pruebas existentes que
  seleccionan por la lista **siguen funcionando en jsdom sin cambios** —
  `sr-only` no afecta las consultas de Testing Library, solo el layout visual
  real de un navegador.
- **`explore.spec.ts` sí necesita ajustarse**, pero de otra forma: Playwright
  rechaza `.toBeVisible()` y `.click()` normal sobre un elemento `sr-only`
  —lo recorta a 1×1 px—, así que `esperarEscena` deja de esperar la
  visibilidad del botón (el lienzo ya prueba que la escena cargó) y
  `seleccionar` pasa a usar `.click({ force: true })`, con la razón escrita
  en el propio archivo.

**Acceptance criteria corregidos:**

- Must 4 y 5 originales: **retirados** — no hay nada que corregir.
- Nuevo Must: `explore.spec.ts` sigue verde, con `esperarEscena` y
  `seleccionar` ajustados a un elemento `sr-only` en vez de reescribir su
  intención (siguen protegiendo exactamente b2.1/b2.2/b2.3).

## Segunda corrección: mockup de Claude Design importado

El usuario trajo un mockup (`claude.ai/design`, proyecto "Rediseño aplicación
anatomía ósea") que toca cuatro partes de la app. Decisión, con el conflicto
señalado y confirmado dos veces:

- **La tarjeta flotante de T2** adopta el lenguaje visual del mockup: pills
  para Región y Lado en vez de lista de definiciones, botón "✕" explícito
  para cerrar. **Entra en esta tarea.**
- **El navbar** (logo + pestañas + menú en una fila flotante) reabre e7.1 —
  fuera de esta historia, historia propia.
- **El acordeón de Fichas** reabre e7.4 — cruza a propósito el rabbit hole
  que el brief de la épica declaró explícito ("rehacer el navegador como
  arquitectura nueva es otra épica"). Historia propia.
- **Test con opciones múltiples** es alcance nuevo, no rediseño. Historia
  propia.
- **No adoptado:** la paleta de 10 colores por región del mockup
  (`REGION_STYLES`). Es una decisión de sistema de diseño con su propio
  costo de verificación de contraste —como e7.1 hizo con los tokens
  actuales—, no algo para improvisar dentro de una tarea de T2. El sheet usa
  el único acento ya establecido.
- **No adoptado:** los campos "Articula con" y "Dato clínico" del detalle.
  No existen en el catálogo (`Bone`); poblarlos para 206 huesos es autoría
  de contenido médico, no una tarea de diseño visual.

### T2 corregida

- **Files:** modify `src/components/BoneIdentity.tsx` (Región y Lado como
  pills), `src/features/explore/ExploreView.tsx` (botón de cerrar explícito).
- **Must NOT añadido:** no se toca la paleta por región, ni se agregan
  campos al catálogo, ni se toca `BoneDetailView.tsx` — solo mejora
  visualmente el mismo `BoneIdentity` que ya usa.
