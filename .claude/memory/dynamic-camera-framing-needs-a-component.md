---
name: dynamic-camera-framing-needs-a-component
description: Cuando el encuadre de cámara no se conoce hasta después del primer render (react-three-fiber), la prop `camera` de `<Canvas>` no sirve — hace falta `<PerspectiveCamera>` de drei, montada condicionalmente.
metadata:
  type: capability
---

`<Canvas camera={{...}}>` (react-three-fiber) solo lee esos valores **al
montar** — ya lo documentaba un comentario de b2.2 en `SkeletonScene.tsx`, y
`IsolatedBoneScene` (e3.1) volvió a chocar con lo mismo por una razón
distinta: ahí el encuadre depende de un cálculo (`Box3` sobre las mallas
visibles) que solo se conoce **después** de aplicar la visibilidad en un
`useLayoutEffect`, no en el primer render.

**How to apply:** cuando el encuadre depende de datos que llegan después del
montaje inicial, no pelear con la prop `camera` de `Canvas`. Usar
`<PerspectiveCamera makeDefault ... />` de `@react-three/drei` como hijo del
`Canvas`, montada condicionalmente (`{framing && <PerspectiveCamera .../>}`)
una vez que el estado de encuadre existe. Al reposicionarla, si la cámara no
necesita rotar (mirar en una dirección arbitraria), no hace falta un
`lookAt` explícito: con rotación por defecto la cámara mira hacia -Z, así
que colocarla en el mismo X/Y del punto a encuadrar y desplazada en Z ya lo
alcanza — `lookAt` **no es una prop nativa** de los elementos three.js en
r3f (solo se aplican como props los setters que el objeto expone vía
`.set()`, no métodos arbitrarios como `lookAt`).

Relacionado: [[untestable-layers-go-last]] — el canvas sigue sin cobertura
automática (ADR-002), así que este patrón se verifica con captura real, no
con test de componente.
