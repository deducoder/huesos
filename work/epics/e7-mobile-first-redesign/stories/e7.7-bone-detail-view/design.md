# Story e7.7: Ficha del hueso — Design

> Complexity: simple

## 1 · What & why

**Problem:** el botón «← Volver» de `BoneDetailView` mide 34×83 px — el
último control de la aplicación por debajo del mínimo táctil de ADR-007.

**Value:** ningún objetivo interactivo de la app queda sin poder pulsarse
con el pulgar.

## 2 · Approach

Una clase. `min-h-tactil border-2 rounded-suave`, el mismo patrón que ya
usan el botón de «Ver ficha completa» (e7.5) y el de cerrar la tarjeta
(e7.6) — ningún componente nuevo, ninguna decisión nueva de tratamiento.

**Components affected:**

- `src/features/bone-detail/BoneDetailView.tsx`: modify — una clase en el
  botón.

**Legacy sweep:** nada queda huérfano — un cambio de clases CSS sobre un
elemento existente.

## 3 · Interface / examples

```tsx
// antes
className="rounded border border-tinta px-3 py-1.5 text-tinta text-sm hover:bg-acento-suave"
// después
className="min-h-tactil rounded-suave border-2 border-tinta px-4 text-tinta text-sm hover:bg-acento-suave"
```

## 4 · Acceptance criteria

- **Must:**
  1. El botón «← Volver» mide ≥ 44×44 px en 390×844.
- **Must NOT:**
  1. No se toca `BoneIdentity.tsx` ni `IsolatedBoneScene.tsx`.

### Scenarios (delta over the scope)

Ninguno — el scope ya cubre el único caso.
