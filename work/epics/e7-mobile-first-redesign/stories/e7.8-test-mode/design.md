# Story e7.8: Modo test — Design

> Complexity: simple

## 1 · What & why

**Problem:** cinco controles del modo test —dos botones de elección de
variante, el campo de respuesta, «Responder», «Siguiente pregunta»— miden
entre 34 y 42 px de alto, por debajo del mínimo táctil de 44 px.

**Value:** las seis vistas de la aplicación terminan de compartir el mismo
mínimo táctil; el modo test deja de ser la última excepción.

## 2 · Approach

Cinco cambios de clase, el mismo patrón `min-h-tactil border-2 rounded-suave`
que ya usan las demás vistas. Nada de lógica nueva.

**Components affected:**

- `src/App.tsx`: modify — los dos botones de `ElegirVarianteDeTest`.
- `src/features/test/TestQuestion.tsx`: modify — el campo, «Responder»,
  «Siguiente pregunta».

**Legacy sweep:** nada queda huérfano.

## 3 · Interface / examples

```tsx
// ElegirVarianteDeTest, los dos botones — antes
className="rounded border border-tinta px-4 py-2 hover:bg-acento-suave"
// después
className="min-h-tactil rounded-suave border-2 border-tinta px-4 hover:bg-acento-suave"
```

```tsx
// TestQuestion — el campo — antes
className="w-full rounded border border-tinta bg-panel px-3 py-2 text-sm"
// después
className="min-h-tactil w-full rounded-suave border-2 border-tinta bg-panel px-3 text-sm"

// «Responder» — antes
className="rounded bg-acento px-4 py-2 text-panel text-sm hover:bg-acento-fuerte"
// después
className="min-h-tactil rounded-suave border-2 border-tinta bg-acento px-4 text-panel text-sm hover:bg-acento-fuerte"

// «Siguiente pregunta» — antes
className="rounded border border-tinta px-3 py-1.5 text-sm hover:bg-acento-suave"
// después
className="min-h-tactil rounded-suave border-2 border-tinta px-4 text-sm hover:bg-acento-suave"
```

Nota: «Responder» no tenía `border` antes (solo fondo); se agrega
`border-2 border-tinta` para que el par input+botón use el mismo lenguaje
de borde que el resto del rediseño — coherente con el botón «Ver ficha
completa» de `BoneIdentity` (e7.5), que ya tiene ese mismo tratamiento.

## 4 · Acceptance criteria

- **Must:**
  1. Los cinco controles miden ≥ 44 px de alto en 390×844.
  2. El campo de respuesta y «Responder» siguen en la misma fila, sin
     desbordar 390 px de ancho.
- **Must NOT:**
  1. No se toca `SkeletonScene`, `IsolatedBoneScene`, `pickTestableBone`,
     `isCorrectAnswer`.
  2. No se agrega tipografía display — ni `TestQuestion` ni
     `ElegirVarianteDeTest` tienen un título.

### Scenarios (delta over the scope)

Ninguno — el scope ya corrigió la única suposición equivocada («no caben»)
y el design no encontró otra.
