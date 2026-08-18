# Story e8.2: Fichas accordion — Scope

## User story

Como estudiante que busca un hueso en Fichas,
quiero navegar por categoría y no por una lista plana de 10 regiones,
para encontrar un hueso más rápido cuando sé a qué zona del cuerpo pertenece.

## Acceptance criteria

```gherkin
Given la pestaña Fichas recién abierta
When se renderiza
Then se muestran las categorías (9: "Cráneo" con 2 subgrupos —
  neurocráneo y cara—, y 8 más de un solo subgrupo cada una), todas
  colapsadas, en el mismo orden anatómico que hoy usa `groupByRegion`

Given una categoría colapsada
When se toca/activa su botón
Then se expande mostrando sus subgrupos, cada uno con su grilla de
  etiquetas de huesos — nunca dos categorías expandidas cambian el orden
  de las demás

Given una etiqueta de hueso visible en la grilla
When se activa
Then navega a la ficha completa del hueso, igual que hoy hace
  `BoneNavigator` en Fichas

Given un par de huesos donde ningún lado tiene malla en el modelo
  (ej. martillo, yunque, estribo)
When se renderiza su subgrupo
Then aparece una sola etiqueta para el par, no dos — mismo criterio que
  `BoneNavigator` ya aplica (e7.4)
```

## Example

| Input | Action | Expected output |
|-------|--------|------------------|
| Fichas recién abierta | — | Categorías: "Cráneo — neurocráneo" y "Cráneo — cara" agrupadas bajo "Cráneo"; "Oído medio", "Hioides", "Columna vertebral", "Tórax", "Cintura escapular", "Miembro superior", "Cintura pélvica", "Miembro inferior" cada una su propia categoría |
| Categoría "Cráneo" colapsada | Activar su botón | Se expande: 2 subgrupos ("neurocráneo" 8 huesos, "cara" 14 huesos), cada uno con su grilla de etiquetas |
| Etiqueta "hueso frontal" en la grilla | Activar | Navega a `BoneDetailView` con `boneId: 'frontal'`, `origen: 'fichas'` — igual que hoy |
| Subgrupo "Oído medio" expandido | — | Una sola etiqueta "martillo" (no "martillo derecho"/"martillo izquierdo"), 6 huesos sin malla, todos colapsados a par único |

## In scope

- Nueva función de dominio (`src/domain/`) que agrupa las `RegionGroup` de
  `groupByRegion` en categorías, derivando el nombre de categoría del
  prefijo de `REGION_LABEL` antes de "—" (o la etiqueta completa cuando no
  hay "—") — ver ADR-011.
- Nuevo componente que reemplaza el `<BoneNavigator>` visible que
  `App.tsx` monta hoy en el modo `'fichas'`.
- El nuevo componente reutiliza `toNavigatorRows` para decidir cuántas
  etiquetas mostrar por hueso/par dentro de cada subgrupo — mismo
  criterio de colapso de pares indistinguibles que `BoneNavigator` ya
  aplica (e7.4/e7.5).
- Accesibilidad equivalente a la de `BoneNavigator`: alcanzable por
  teclado, nombre accesible por hueso y por lado, sin depender solo del
  color para indicar selección.

## Out of scope

- `BoneNavigator` (el componente) y su montaje oculto en `ExploreView` —
  **no se tocan, ni una línea** (ADR-011, protege ADR-010 y
  `explore.spec.ts`).
- `toNavigatorRows`, `groupByRegion`, `side-pairing.ts` — se consumen tal
  cual, no se modifican.
- Cualquier cambio a cómo se llega a la ficha completa de un hueso
  (`BoneDetailView`, `origen: 'fichas'`) — sigue exactamente igual.
- Colapsar o expandir más de un nivel (sub-acordeón dentro de un
  subgrupo) — el mockup no lo pide, un subgrupo expandido siempre
  muestra su grilla completa.

## Done when

- Con la aplicación corriendo, entrar a Fichas muestra categorías
  colapsadas; expandir una muestra sus subgrupos con grillas de
  etiquetas; tocar una etiqueta navega a la ficha del hueso.
- `explore.spec.ts` sigue en verde sin tocarse — ninguna prueba de
  b2.1/b2.2/b2.3 se ve afectada.
- `./scripts/check` en verde.

## Notes

Diseño completo (contratos, componentes, ADR-011) en
`work/epics/e8-redesign-mockup-follow-ups/design.md`. Antes de diseñar
esta historia, releer las retrospectivas de e7.4 y e7.5 — el aprendizaje
sobre pares indistinguibles (`isSideIrrelevant`) sigue aplicando acá.
