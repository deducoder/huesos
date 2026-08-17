# Story e7.4: Navegador de huesos en móvil — Scope

## User story

As a estudiante que busca un hueso concreto entre los 206 del catálogo,
I want tocar el que busco sin fallar de puntería y sin desplazar la pantalla
más de lo necesario,
so that recorrer la lista sea más rápido que hoy, no solo más lindo.

## Acceptance criteria

```gherkin
Given la aplicación abierta en un viewport de 390x844
When se mide cualquier objetivo interactivo del navegador de huesos
Then mide 44x44 px o más — contra los 28 px de hoy

Given el navegador de huesos en su forma nueva
When se mide el desplazamiento total necesario para llegar del primer al
     último hueso
Then no es mayor que multiplicar el de hoy por el mismo factor que crece cada
     objetivo — el objetivo es recorrer más rápido, no solo con el dedo

Given un hueso con el nombre más largo del catálogo
      («falange proximal del segundo dedo de la mano»)
When se muestra en su fila
Then el nombre se lee completo, sin recortar ni desbordar la pantalla

Given las 10 regiones anatómicas
When se recorre la lista
Then siguen agrupadas y en el mismo orden que hoy, con su encabezado

Given un hueso sin geometría en el modelo
When aparece en la lista
Then sigue anunciando que no es representable, igual que hoy

Given la misma prueba de teclado, de selección por atributo y de agrupación
      por región que ya existen en `BoneNavigator.test.tsx`
When corren contra la forma nueva
Then siguen verdes sin reescribirse
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Fila de «fémur derecho» en 390×844 | medir su objetivo interactivo | ≥ 44×44 px (hoy: 373×28) |
| «falange proximal del segundo dedo de la mano derecha» (54 caracteres con lado) | mostrarla en su fila | completa, sin truncar |
| Región «Miembro superior», 60 huesos | recorrer de punta a punta | el desplazamiento total no crece 1.6× solo por agrandar cada fila |
| `esfenoides` (impar) | mostrarlo en la lista | sin lado, como hoy |

## In scope

- **La forma visual y de interacción del navegador de huesos**, para que sus
  objetivos alcancen el mínimo táctil sin que 206 filas de 44 px vuelvan la
  lista insoportable de recorrer. Es la decisión de arquitectura de información
  que el plan de la épica nombra explícitamente, y lleva su propio ADR.
- **`BoneNavigator` como componente**, en sus dos usos actuales: la columna de
  `ExploreView` y la lista completa de la pestaña «Fichas». El componente es
  uno solo; ninguno de los dos usos es más importante que el otro.
- **Conservar el contrato de accesibilidad exacto**: nombre accesible por
  hueso y lado, `aria-pressed` para la selección, agrupación por región con
  `aria-labelledby`, y el aviso de «no representable» por hueso y por región.
  `BoneNavigator.test.tsx` ya lo protege y no se reescribe.

## Out of scope

- **Dónde vive el navegador dentro de la vista Explorar** — si sigue siendo una
  columna, si se vuelve una tarjeta flotante tras seleccionar, es **e7.6**. Esta
  historia rediseña el componente; e7.6 decide su lugar en el layout.
  `~/refs/cards.jpg`, aportada por el usuario probando e7.2, es la referencia
  de esa decisión — no de esta.
- **Búsqueda o filtros** — aparcado desde el `epic-design`: el problema de los
  206 se resuelve con la jerarquía de 10 regiones que ya existe, no con una
  función nueva.
- **El panel de identidad ni la escena 3D** — son e7.5 y ya están resueltos
  desde e7.1/e7.2 respectivamente.
- **Cambiar qué huesos son pares o impares, o el orden de las regiones** — es
  dominio (`groupByRegion`, `isUnpaired`) y esta historia no lo toca.

## Done when

- En 390×844, medido por la suite de navegador: ningún objetivo del navegador
  de huesos queda por debajo de 44×44 px.
- El desplazamiento total para recorrer los 206 huesos no crece en una
  proporción mayor que el crecimiento de cada objetivo individual — declarado
  y verificado en el diseño, con el número de hoy como línea base.
- El nombre más largo del catálogo se lee completo en 390 px.
- `BoneNavigator.test.tsx` sigue verde **sin reescribirse**.
- Existe un ADR con la forma elegida y las alternativas descartadas.
- `./scripts/check` en verde.

## Notes

- Gemba del 2026-08-17 al arrancar: hoy cada fila mide **373×28 px**,
  independiente de la longitud del nombre — el texto no rompe línea a
  `text-sm` en 390 px, ni con el nombre más largo del catálogo (44 caracteres,
  «falange proximal del segundo dedo de la mano»). El alto disponible medido es
  **6.208 px** para 206 filas más 10 encabezados de región.
- **Distribución real por región**: miembro superior 60, miembro inferior 60,
  columna 26, tórax 25, cara 14, cráneo 8, oído 6, cintura escapular 4, cintura
  pélvica 2, hioides 1.
- **172 de los 206 huesos son pares** (86 derecho + 86 izquierdo) y 34 son
  impares — verificado que `bone.side === null` coincide exactamente con
  `isUnpaired(bone)` en las 206 entradas, así que cualquiera de los dos criterios
  sirve para agrupar por par. Si el diseño decide unir cada par en una sola
  fila, el recuento de filas baja de 206 a 120 — un dato para pesar contra
  simplemente agrandar cada fila.
- `BoneNavigator` se usa **hoy** en dos sitios a 390 px de ancho completo —la
  columna de `ExploreView` bajo el reparto de filas de e7.2, y la pestaña
  «Fichas» a pantalla completa—, así que el componente ya se diseña para ese
  ancho y no para una columna angosta de escritorio.
- Referencias: `work/epics/e7-mobile-first-redesign/design.md` (Key contracts:
  roles y nombres accesibles no cambian), ADR-007 («el tratamiento de tarjeta
  con borde y sombra no escala a los 206 huesos»), y el token
  `--radius-tarjeta` declarado en e7.1 sin consumidor — candidato natural para
  esta historia si el diseño elige tratamiento de tarjeta.
- Las dos frases que la retrospectiva de e7.3 dejó para este plan: renderizar
  con los nombres más largos del catálogo real, no un ejemplo cómodo; y
  confirmar cualquier decisión visual con una muestra, no con una tabla de
  características.
