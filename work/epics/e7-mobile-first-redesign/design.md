# Epic E7: Mobile-first redesign — Design

## Gemba findings

Leído el 2026-08-17: `App.tsx`, `index.css`, `index.html`, `ExploreView`,
`BoneNavigator`, `BoneIdentity`, `BoneDetailView`, `TestQuestion`,
`SkeletonTestView`, `BoneTestView`, `SkeletonScene`, `IsolatedBoneScene`, más
una sonda de navegador en 390×844.

- **La capa de presentación es pequeña: seis componentes y tres features.** No
  hace falta una historia por vista — hacen falta historias por *pieza*, porque
  las piezas se reutilizan. **Seguir el corte por componente, no por pantalla.**
- **`TestQuestion` ya está bien factorizado**: `SkeletonTestView` y
  `BoneTestView` comparten el flujo entero y solo difieren en `renderScene`.
  Rediseñarlo **cubre las dos vistas de test de una vez**. Reutilizar, no
  duplicar: e7.8 es una historia, no dos.
- **`BoneIdentity` y `BoneNavigator` se montan en dos sitios cada uno** —
  `ExploreView` y, respectivamente, `BoneDetailView` y la pestaña «Fichas».
  Una historia por componente cubre sus dos usos.
- **No hay sistema de diseño.** `index.css` es una línea. Los colores están
  repetidos a mano en cada componente. **Extraer a `@theme`, no añadir encima.**
- **Solo dos breakpoints en toda la aplicación**, ambos `md:grid-cols-…`, en
  `ExploreView` y `BoneDetailView`. En móvil `grid-cols-1` apila y nadie da
  altura al lienzo. **La causa medida del canvas de 150 px.**
- **`main` usa `h-screen` (`100vh`)**, que en iOS y Android cuenta la barra de
  URL. Necesita `dvh`. Es la clase de defecto que solo se ve en un teléfono.
- **`groupByRegion` ya existe** en `src/domain/regions.ts` y `BoneNavigator` ya
  agrupa por las 10 regiones con encabezados `sticky`. La jerarquía sobre la
  que apoyar la solución de los 206 **ya está en el dominio**: extender, no
  construir.
- **Los encabezados de región usan `sticky top-0 bg-slate-900`**: el sticky
  depende del color de fondo para no dejar ver el texto por debajo. Al invertir
  a claro hay que tocarlo, y es fácil olvidarlo.
- **`labels.ts` centraliza las etiquetas de vista** (`REGION_LABEL`,
  `SIDE_LABEL`) con una razón escrita: el dominio guarda claves estables, la
  vista traduce. **Es el patrón del proyecto para «una sola fuente en la capa
  de vista»**, y el equivalente para el aspecto es `@theme`.

### El hallazgo que cambia el riesgo de la épica

**Ningún test del proyecto asserta clases CSS.** Verificado con búsqueda sobre
todos los `*.test.ts(x)`: los de componentes consultan roles y nombres
accesibles; los que leen el fuente (`SkeletonScene.test.tsx`, `privacy.test.ts`
y los de activo) comprueban privacidad, anclajes y contratos, no aspecto.

La consecuencia es doble y conviene tenerla presente en cada historia: los 201
tests actuales **no estorban al rediseño, lo protegen**; y si un cambio de
estilo pone uno en rojo, la lectura por defecto es que se degradó la
accesibilidad —un rol perdido, un nombre accesible cambiado—, no que el test
sea frágil.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/index.css` | modify | De una línea a la fuente única de tokens con `@theme` (ADR-007) |
| `src/App.tsx` | modify | Shell, header y pestañas; `h-screen` → `dvh` |
| `src/components/SkeletonScene.tsx` | modify | Dimensionado del lienzo y su superficie sobre tema claro |
| `src/components/BoneNavigator.tsx` | modify | Los 206 en 390 px; objetivos de 44 px; el `sticky` sin fondo oscuro |
| `src/components/BoneIdentity.tsx` | modify | Tokens nuevos; se reutiliza en dos vistas |
| `src/features/explore/ExploreView.tsx` | modify | Layout móvil de las tres zonas |
| `src/features/bone-detail/BoneDetailView.tsx` | modify | Ficha y estado de ausencia |
| `src/features/test/TestQuestion.tsx` | modify | Campo de respuesta y botón, hoy en una fila; cubre las dos vistas de test |
| `src/components/IsolatedBoneScene.tsx` | modify | Solo superficie y encuadre, coherentes con el lienzo grande |
| `public/fonts/` | create | La display empaquetada (e7.3) |

## Key contracts

- **Ningún componente escribe un color literal.** Todo color, borde, sombra y
  radio sale de `@theme`. Es lo que hace que ADR-007 sea cierto y no una
  intención.
- **Todo objetivo interactivo mide 44×44 px o más**, incluidos los 206 botones
  del navegador y las pestañas.
- **Los roles y nombres accesibles no cambian.** `aria-pressed` en el navegador,
  `role="status"` con `aria-live` en identidad y en el resultado del test, el
  `aria-labelledby` que une cada lista con su región, y los `sr-only` que
  describen los lienzos. Son el contrato de `must-a11y-005` y la razón por la
  que la suite protege el rediseño.
- **El color nunca es el único indicador** de acierto o error en el modo test:
  hoy el veredicto se escribe con palabras dentro de un `role="status"`, y eso
  se conserva.
- **Cero peticiones de red en tiempo de ejecución.** La tipografía se sirve del
  propio origen; ningún `@import` a un CDN, ningún icono remoto.
- **El dominio y el activo no se tocan.** `src/domain/`, `src/data/` y
  `skeleton.glb` quedan fuera; el único punto de contacto admitido con la
  escena es la superficie del lienzo y su encuadre.

## Decisions (ADRs)

- **ADR-007: Neobrutalismo suave sobre tema claro, con los tokens en `@theme`**
  — fija la dirección visual contra las tres referencias del usuario y hace de
  `@theme` la única fuente del aspecto, verificado contra Tailwind 4.3.3, que
  configura en CSS y no en un archivo JS.
  `records/decisions/adr-007-visual-direction-and-tokens.md`

Dos decisiones quedan **abiertas a propósito**, cada una en su historia, porque
tomarlas ahora sería decidir sin ver:

- **Qué tipografía display** (e7.3) — exige comparar candidatas reales
  renderizadas y revisar licencias. El brief ya decidió *que* se empaqueta;
  falta *cuál*.
- **Cómo se presentan 206 huesos en 390 px** (e7.4) — exige probarlo en
  pantalla. La jerarquía de 10 regiones ya existe en el dominio; qué forma toma
  es lo que se decide.

## Legacy sweep

Nada queda huérfano: la épica modifica componentes existentes y no borra
ninguno. El único código que nace es el archivo de fuente empaquetada y los
tokens.

Dos avisos para las historias que toquen lo ya escrito:

- **`SkeletonScene.test.tsx` comprueba el fuente con expresiones regulares**
  (`stripMidline\(`, `half="mirrored"`, `[-1, 1, 1]`). Mover ese código rompe
  pruebas que no hablan de aspecto — si pasa, es señal de haber tocado algo que
  esta épica declaró fuera de alcance.
- **Los colores literales que hoy están repetidos** (`slate-950`, `slate-900`,
  `slate-800`, `sky-700`, `sky-300`, `amber-700`, `amber-950`) desaparecen como
  utilidades sueltas. Al cerrar la épica, encontrar uno es la señal de que una
  vista se quedó atrás.
