---
name: test-doubles-must-be-able-to-fail-like-the-real-thing
description: Un doble que reproduce la firma pero no el comportamiento observable del original no puede demostrar que un defecto se arregló — ni detectarlo mientras existía.
metadata:
  type: pitfall
---

En e6.1, `IsolatedBoneScene` anunciaba `aria-label="martillo, aislado en 3D"`
sobre un lienzo vacío, para los siete huesos que el modelo no incluye. El
defecto sobrevivió a E3, E4 y E5 con la suite en verde, porque el doble de las
pruebas era esto:

```tsx
IsolatedBoneScene: ({ boneId }) => <div data-testid="..." data-hueso={boneId} />
```

Reproduce la firma. No reproduce la etiqueta accesible, que es donde estaba la
mentira. Para escribir el RED hubo que **arreglar el doble primero**.

El contraste está en el mismo repositorio: el doble de `BoneTestView.test.tsx`
sí calcula el label como el real, con un comentario que dice por qué — "sin el
fix, filtraría el nombre igual que el real". Ese doble sí podía fallar por lo
mismo que el original.

**Por qué importa:** la cobertura de una prueba está acotada por la fidelidad de
sus dobles, y eso no aparece en ninguna métrica. Un doble empobrecido convierte
una suite verde en una afirmación sobre el doble, no sobre el componente.

**How to apply:** al escribir un doble, la pregunta no es "¿basta para que
compile y renderice?" sino **"¿podría fallar por lo mismo que fallaría el
real?"**. Reproducir lo observable que importa —etiquetas accesibles, roles,
texto visible— y dejar fuera solo lo imposible en el entorno de prueba (WebGL,
red). Ver [[a-check-needs-a-check-that-it-looked]]: mismo modo de fallo, un
instrumento que da verde por no poder mirar.
