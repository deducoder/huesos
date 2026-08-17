# Epic e2: Explore skeleton — Design

## Gemba findings

- **La capa de datos está cerrada y probada.** `src/data/bone.ts` exporta `Bone`,
  `BoneRegion`, `BONE_REGIONS`, `Side` e `isUnpaired`; `catalog` trae 206
  entradas. Este epic **consume**, no toca: cualquier carencia se reporta como
  hallazgo.
- **`src/App.tsx` es un encabezado y nada más.** Es el punto donde entra la vista
  de exploración; no hay estructura que respetar ni que deshacer.
- **`src/domain/`, `src/state/`, `src/features/` y `src/components/` están
  declarados en el README pero vacíos.** Este epic crea los cuatro primeros
  habitantes reales, siguiendo el contrato ya escrito: dominio sin React, vistas
  que dependen de dominio y nunca al revés.
- **No hay ningún componente React todavía**, así que no hay patrón previo de
  componentes que seguir: lo que se establezca aquí será el patrón.
- **El catálogo distingue lado con el mismo `meshName`** (`femur-left` y
  `femur-right` apuntan ambos a `Femur.r`). Cualquier búsqueda de malla a entrada
  es **uno a muchos**, y ese es el punto delicado de e2.5.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/domain/regions.ts` | create | Agrupar y ordenar el catálogo por región — puro |
| `src/domain/selection.ts` | create | El estado de selección y sus transiciones — puro |
| `src/components/BoneNavigator.tsx` | create | Lista accesible por región, la vía de teclado |
| `src/components/BoneIdentity.tsx` | create | Nombre, nomenclatura, región y lado del hueso activo |
| `src/components/SkeletonScene.tsx` | create | Canvas react-three-fiber con el modelo |
| `src/features/explore/ExploreView.tsx` | create | Compone las tres piezas sobre un estado |
| `src/App.tsx` | modify | Montar la vista de exploración |

## Key contracts

- El estado de selección es **un `id` de hueso o ninguno**, nunca una malla: una
  malla puede corresponder a dos huesos (izquierdo y derecho).
- `src/domain/` no importa React, three.js, el DOM ni almacenamiento; se prueba
  sin navegador.
- Todo hueso presentado expone su **nombre accesible** en el DOM, esté o no en la
  escena; el canvas nunca es la única vía de selección.
- El hueso activo se comunica por **al menos dos canales**, y el color nunca es
  uno de ellos en solitario (`must-a11y-005`).
- El espejado del hemicuerpo izquierdo es **transformación visual**: no altera la
  entrada del catálogo ni el `id` seleccionado.
- Las 7 ausencias declaradas se listan con su razón visible y **no** se
  seleccionan en la escena, porque no tienen geometría.

## Decisions (ADRs)

- **ADR-002**: Escena 3D con react-three-fiber, y una lista accesible como vía de
  primera clase — satisface `must-a11y-005` por construcción en vez de por
  remiendo, y deja viva la opción de siluetas SVG si el peso obliga.

## Legacy sweep

Nada queda huérfano — el epic es net-new sobre una capa de datos cerrada. La
única modificación sobre lo existente es `src/App.tsx`, que hoy solo pinta un
encabezado.
