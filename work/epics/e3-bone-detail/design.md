# Epic e3: Ficha del hueso — Design

## Gemba findings

- **`BoneIdentity` ya cubre media ficha.** Muestra nombre en ambas
  nomenclaturas (`es`/`la`), región y lado, con `aria-live` para lectores de
  pantalla. Lo que falta de RF-03 es aislar el hueso visualmente y un acceso
  que no pase por la escena completa — no la información en sí, que ya
  existe en `data/bone.ts` y se proyecta bien.
- **`isUnpaired()` en `data/bone.ts` ya calcula par/impar**, pero
  `BoneIdentity` no lo muestra explícitamente — hoy solo omite "Lado" para
  huesos impares en vez de decir "hueso impar". RF-03 pide esa cifra con
  todas las letras.
- **`SkeletonHalf` (en `SkeletonScene.tsx`) ya sabe recorrer el modelo y
  decidir, por malla, a qué hueso corresponde** (`boneIdForMesh`). Aislar un
  hueso es una variación de ese recorrido —ocultar toda malla cuyo hueso no
  sea el elegido, en vez de solo cambiar su material— y no requiere un
  activo nuevo. Reutilizar el patrón, no la escena completa: el brief ya
  excluye repetir `SkeletonScene` con cámara ajustada.
- **No hay router.** `App.tsx` renderiza `<ExploreView />` fijo, sin
  dependencia de navegación. Decidido en ADR-003: selector de modo simple,
  no una librería de rutas — ver el ADR para las opciones descartadas.
- **`groupByRegion` y el patrón de `BoneNavigator`** ya resuelven "una lista
  de huesos, agrupada, navegable por teclado" — es exactamente lo que la vía
  de acceso sin esqueleto necesita como punto de entrada. Se reutiliza tal
  cual, no se reinventa una segunda lista.
- **`governance/architecture/system-design.md` está desactualizado**: nombra
  módulos (`features/bone`, `components/Skeleton`, `data/skeleton.svg`) que
  no reflejan el código real desde ADR-001 (glTF, no SVG). No es una tarea
  de esta épica —es deuda de documentación previa a E3— pero se registra en
  `records/parking-lot.md` para no perderla.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `domain/bone.ts` (`data/bone.ts`) | modify | Exponer `isUnpaired` ya existe; sin cambios de dominio, solo consumo nuevo desde la vista |
| `components/BoneIdentity.tsx` | modify | Decir "hueso impar" explícitamente cuando `isUnpaired(bone)`, no solo omitir el lado |
| `components/IsolatedBoneScene.tsx` | create | Variación de `SkeletonHalf`: carga el mismo `skeleton.glb`, oculta toda malla que no pertenezca al hueso elegido |
| `features/bone-detail/BoneDetailView.tsx` | create | Compone `IsolatedBoneScene` + `BoneIdentity` para un `id` de hueso dado |
| `features/bone-detail/BoneListEntry.tsx` | create | Punto de acceso sin esqueleto: lista de los 206 huesos (reutiliza `groupByRegion`) que lleva a `BoneDetailView` |
| `App.tsx` | modify | Selector de modo (`'explorar' \| 'fichas'`) por ADR-003, sin router |

## Key contracts

- La ficha identifica el hueso por `id` de catálogo, nunca por nombre de
  malla — mismo invariante que `domain/selection.ts` ya establece para E2.
- `IsolatedBoneScene` no duplica la lógica de `boneIdForMesh` ni el cálculo
  de encuadre de `domain/framing.ts`: los importa, no los reimplementa.
- La ficha es alcanzable desde dos caminos independientes: la selección de
  E2 (vía `BoneIdentity` o el navegador) y la lista de `BoneListEntry` sin
  haber tocado la escena 3D — ambos caminos llegan al mismo componente
  `BoneDetailView`, nunca a una copia.

## Decisions (ADRs)

- ADR-003: Selector de modo en vez de router para llegar a la ficha del
  hueso — ver `records/decisions/adr-003-bone-detail-access.md`.

## Legacy sweep

Nada queda huérfano: E3 construye sobre `data/bone.ts`, `domain/selection.ts`
y `domain/regions.ts` sin reemplazar ninguno. `SkeletonScene.tsx` sigue
siendo la escena completa de `ExploreView`; `IsolatedBoneScene.tsx` es un
componente nuevo, no un reemplazo.
