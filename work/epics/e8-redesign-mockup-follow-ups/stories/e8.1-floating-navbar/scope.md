# Story e8.1: Merged navbar — Scope

## User story

Como estudiante que cambia entre Explorar/Fichas/Test en el celular,
quiero ver el título y las pestañas en una sola fila,
para que la interfaz use menos alto de pantalla en cada cambio de modo.

## Acceptance criteria

**Dos recortes de alcance frente al mockup, decididos acá — ver Notes.**

```gherkin
Given cualquier modo de estudio (Explorar, Fichas o Test)
When se renderiza la aplicación
Then el título "huesos-mono" y las tres pestañas están en una sola fila,
  no en dos filas separadas como hoy

Given la fila fusionada en un viewport de 390px de ancho (el más chico
  del rango real, no uno cómodo de elegir — RF de la ficha existente)
When se mide
Then ni el título ni las tres pestañas se recortan ni se desbordan del
  viewport, y las tres pestañas conservan el mínimo táctil de 44px que
  e7.1 ya estableció

Given el modo `'ficha'` (detalle de un hueso)
When se renderiza
Then la fila fusionada sigue el mismo criterio que hoy: sin las pestañas
  (`BoneDetailView` ya tiene su propio "← Volver"), con el título solo
```

## Example

| Input | Action | Expected output |
|-------|--------|------------------|
| Viewport 390×844, modo Explorar | Render | Una fila: "huesos-mono" + [Explorar][Fichas][Test], sin desbordar |
| Viewport 390×844, modo `'ficha'` | Render | Una fila: solo "huesos-mono", sin pestañas — igual que hoy |
| Viewport 1400×900, cualquier modo | Render | La misma fila fusionada, sin comportamiento nuevo de escritorio (fuera de alcance) |

## In scope

- Fundir `<header>` (título) y `<Pestanas>` (nav de tabs) de `App.tsx` en
  una sola fila, un solo elemento de borde/fondo en vez de dos.
- Medir el resultado en 390px de ancho (viewport real más chico del
  proyecto) y ajustar el tamaño del título si no entra sin desbordar —
  mismo criterio que e7.4 dejó en memoria: medir el componente real, no
  asumir que un tamaño de token existente entra.
- El modo `'ficha'` sigue mostrando la fila sin pestañas, igual que hoy.

## Out of scope

- **El botón de menú (☰) del mockup — no ahora.** No existe ningún
  destino (drawer, ajustes, nada) para ese botón hoy; agregarlo sería una
  interfaz sin función, lo que el propio proyecto evita a propósito
  (`CLAUDE.md`: "no half-finished implementations"). Si en el futuro
  aparece una función real que lo necesite, esa historia la agrega — no
  se aparca acá porque no hay nada concreto que aparcar todavía.
- **El tratamiento flotante/absoluto sobre el contenido (`position:
  absolute`, fondo transparente) que el mockup usa — no ahora.** El
  `design.md` de la épica lo describía como "flotante sobre el lienzo",
  pero el gemba de esta historia encontró que el mockup en realidad lo
  flota sobre **las tres** vistas (Explorar, Fichas, Test), cada una con
  su propio padding superior reservado — un cambio bastante más grande
  que "fundir dos filas en una" (tocaría `ExploreView`, el contenedor de
  Fichas y las vistas de Test, no solo `App.tsx`). Se corrige acá la
  descripción de la épica: esta historia fusiona la fila en flujo normal
  del documento, no la flota. Queda registrado como posible historia
  futura si el pulido visual vuelve a la agenda.
- Cualquier cambio de comportamiento en modo escritorio (`md:`) — la fila
  fusionada hereda lo que ya exista, sin ajuste nuevo.
- El diseño interno de `Pestanas` (qué pestaña está activa, cómo se
  marca) — sigue exactamente igual, solo cambia el contenedor que lo
  envuelve.

## Done when

- `App.tsx` renderiza una sola fila con título + pestañas en vez de dos.
- Medido en un navegador real a 390px de ancho: nada se desborda, las
  pestañas conservan 44px de mínimo táctil.
- `./scripts/check` y `./scripts/check-integration` en verde.

## Notes

Diseño completo en
`work/epics/e8-redesign-mockup-follow-ups/design.md`. Los dos recortes de
alcance (menú, flotante) son correcciones de gemba sobre lo que ese
diseño de épica había asumido — documentadas acá, no reeditadas ahí.
