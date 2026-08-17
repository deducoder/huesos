# Story e5.3: Test engine records its verdict — Design

> Complexity: simple

## 1 · What & why

**Problem:** el registro (e5.1) y su persistencia (e5.2) existen y nadie los
llama. El modo test produce un veredicto por respuesta y lo tira.

**Value:** cierra el observable literal de `RF-09` y el hito del esqueleto
andante de la épica. Sin esto, e5.4 no tiene nada sobre lo que ponderar.

## 2 · Approach

`TestQuestion` recibe el almacén como prop y, al responder, escribe el veredicto
con `recordAnswer`. Las dos vistas concretas le pasan **la misma instancia
compartida**, exportada desde `src/storage/`.

El gemba cambió lo que parecía el trabajo de esta historia. El riesgo que el
`plan.md` de la épica anticipaba era *"la plomería del estado es el trabajo
real"*, y no lo es: **el progreso no se renderiza**, porque mostrarlo está
declarado fuera de la épica. Sin nada que re-renderizar, no hace falta estado de
React, ni levantarlo a `App`, ni pasar props por dos componentes que hoy no
reciben ninguna. El registro es un efecto lateral hacia el almacén, no un
estado de la interfaz.

**Components affected:**

- `src/storage/progress-store.ts`: modify — exporta `progressStore`, la
  instancia compartida.
- `src/features/test/TestQuestion.tsx`: modify — nueva prop `store`, escritura
  del veredicto al responder.
- `src/features/test/SkeletonTestView.tsx`, `BoneTestView.tsx`: modify — pasan
  `progressStore`, igual que ya pasan `catalog`.

**Legacy sweep:** nothing — net-new sobre puntos de extensión existentes.

## 3 · Interface / examples

### Usage (API)

```tsx
// La vista concreta, igual que ya hace con `catalog`:
<TestQuestion bones={catalog} store={progressStore} renderScene={...} />

// En las pruebas, un doble sin tocar `localStorage`:
<TestQuestion bones={catalog} store={almacenFalso()} renderScene={...} />
```

### Expected output (success + error)

```
responder "fémur"    (correcto)   -> store.write(recordAnswer(prev, boneId, true))
responder "cualquier cosa" (mal)  -> store.write(recordAnswer(prev, boneId, false))
almacén que lanza                 -> nada cambia en la pantalla; e5.2 lo absorbe
```

### Key data structures

```ts
interface Props {
  bones: readonly Bone[]
  store: ProgressStore          // nuevo, requerido
  renderScene: (boneId: string) => ReactNode
}
```

## 4 · Acceptance criteria

- **Must:**
  - Al responder, se escribe exactamente un veredicto, para el hueso preguntado
    y con el resultado que `isCorrectAnswer` determinó.
  - Se acumula sobre lo ya guardado: se lee el registro actual del almacén antes
    de anotar, nunca se parte de vacío.
  - Volver a pulsar "Responder" sobre una pregunta ya respondida no puede
    registrar dos veces — el formulario ya desaparece al responder, así que esto
    se comprueba, no se asume.
  - `progressStore` se construye una sola vez, a nivel de módulo.
- **Should:**
  - `TestQuestion` sigue sin conocer `localStorage`: recibe un `ProgressStore`,
    no lo busca.
- **Must NOT:**
  - No se muestra nada del progreso en la interfaz.
  - No se añade estado de React para el registro: no hay nada que renderizar.
  - Las pruebas de `TestQuestion` no tocan el `localStorage` de jsdom.

### Scenarios (delta over the scope)

```gherkin
Given una pregunta ya respondida                  # nuevo, del gemba
When se vuelve a intentar responder
Then no se registra un segundo veredicto para esa misma pregunta
```

El `scope.md` no lo contemplaba. Leyendo `TestQuestion` se ve que el formulario
se sustituye por el resultado al responder, así que el doble registro **no
puede ocurrir hoy**; la prueba existe para que siga sin poder ocurrir si alguien
cambia ese flujo.
