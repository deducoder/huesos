---
name: nested-groups-need-parent-matrix-updates
description: updateMatrixWorld propaga hacia abajo, nunca hacia arriba — medir la caja mundial de un objeto dentro de un grupo con offset/scale propio exige actualizar desde ese grupo, no desde el objeto.
metadata:
  type: project
---

En e9.4 (2026-08-18), `SkeletonHalf` llamaba `copia.updateMatrixWorld(true)`
antes de `expandByObject` — un patrón copiado de `IsolatedGroup`
(`IsolatedBoneScene.tsx`), donde funciona porque ese grupo **es** la cima de
su propia jerarquía. En `SkeletonScene.tsx`, `copia` vive dentro de un
`<group position={offset} scale={scale}>` propio de `CenteredSkeleton` —y
`updateMatrixWorld` propaga hacia abajo, nunca hacia arriba—, así que en el
primer commit ese grupo padre todavía no había corrido su propio cálculo:
su matriz medía traslación `[0, 0, 0]` (identidad) en el instante exacto en
que se leía. La caja mundial salía calculada sin el offset real, y el
encuadre apuntaba a un centro que no correspondía a dónde el hueso se ve en
pantalla — solo en el primer commit desde que el grupo con offset existe,
nunca después (la matriz ya queda resuelta por el ciclo de render previo).

**Why:** `Object3D.updateMatrixWorld(force)` en three.js recomputa la
matriz del objeto sobre el que se llama usando la matriz **actual** de su
padre, y propaga hacia sus propios descendientes — nunca hacia arriba. Un
patrón que funciona en un componente sin envoltura extra puede fallar en
otro que sí la tiene, sin que el código de la llamada cambie en absoluto.

**How to apply:** antes de copiar una llamada a `updateMatrixWorld` desde
un componente de referencia, comparar la jerarquía real de ambos: si el
nuevo contexto anida el objeto medido dentro de un grupo con transformación
propia que el original no tenía, actualizar desde ese grupo
(`objeto.parent?.updateMatrixWorld(true)`), no desde el objeto mismo.
Diagnóstico: instrumentar la traslación de la matriz del padre en el punto
exacto de la lectura, no adivinar por síntomas visuales. Relacionado:
[[copying-a-pattern-means-copying-its-whole-package]],
[[offset-the-projection-not-the-camera]].
