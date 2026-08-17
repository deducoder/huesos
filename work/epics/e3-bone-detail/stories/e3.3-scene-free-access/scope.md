# Story e3.3: Acceso a la ficha sin el esqueleto completo — Scope

## User story

As an estudiante de medicina que quiere repasar un hueso puntual,
I want llegar a su ficha directamente, sin tener que abrir la escena 3D ni
recorrer el navegador de `ExploreView` primero,
so that pueda ir directo a lo que quiero estudiar (`RF-03`: "alcanzable
también sin pasar por el esqueleto completo").

## Acceptance criteria

```gherkin
Given la aplicación recién abierta, en modo "Explorar"
When se activa la pestaña "Fichas"
Then se muestra una lista de los 206 huesos, agrupada por región, sin
  ninguna escena 3D montada

Given la lista de fichas
When se elige un hueso
Then se abre `BoneDetailView` para ese hueso — la misma vista que e3.2

Given `BoneDetailView` abierta desde la lista de fichas
When se activa "Volver"
Then se regresa a la lista de fichas, no a `ExploreView`

Given `BoneDetailView` abierta desde la selección de `ExploreView` (e3.2)
When se activa "Volver"
Then se regresa a `ExploreView` con su selección intacta, como ya
  garantiza e3.2 — este comportamiento no cambia
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| App recién abierta | clic en pestaña "Fichas" → clic en "sacro" | `BoneDetailView` del sacro, sin haber tocado `ExploreView` |
| `BoneDetailView` del sacro, abierta desde "Fichas" | clic en "Volver" | lista de fichas, no `ExploreView` |

## In scope

- Un tercer modo en `App.tsx` (`'fichas'`, además de `'explorar'` y
  `'ficha'` de e3.2) que reutiliza `BoneNavigator` **tal cual** —
  `selected={null}`, `onSelect` navega a la ficha en vez de alternar
  selección — sin componente nuevo: el gemba de esta historia encontró que
  `BoneNavigator` ya sirve para esto, contra lo que el diseño de la épica
  suponía (`BoneListEntry` como componente aparte).
- Navegación de nivel superior (dos pestañas: "Explorar" / "Fichas") visible
  desde el arranque de la aplicación, sin depender de ningún estado previo.
- `BoneDetailView` recuerda su origen (`'explorar'` o `'fichas'`) para que
  "Volver" regrese al lugar correcto — extensión del modo de e3.2, no un
  componente nuevo.

## Out of scope

- Cambiar `BoneNavigator` en sí — se reutiliza sin modificar su código,
  solo cómo se lo invoca desde el modo nuevo.
- Persistir la pestaña activa entre recargas.

## Done when

- Desde el arranque de la aplicación, "Fichas" lleva a la lista de 206
  huesos sin haber montado la escena 3D de `ExploreView`.
- Desde esa lista, cualquier hueso lleva a su `BoneDetailView`.
- "Volver" regresa al origen correcto en ambos casos (desde "Fichas" → a
  la lista; desde la selección de `ExploreView` → a `ExploreView` con su
  selección, sin regresión sobre lo que e3.2 ya garantiza).

## Notes

Diseño completo en `work/epics/e3-bone-detail/design.md` y ADR-003. La
`design.md` de la épica proponía `BoneListEntry` como componente nuevo; esta
historia lo descarta por gemba (leer `BoneNavigator.tsx` real antes de
escribir) y lo deja anotado acá, no en `design.md`, que no se reedita a
mitad de la épica.
