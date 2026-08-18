# Story e9.3: The isolated bone fits and turns — Scope

## User story

As a quien estudia un hueso concreto en su teléfono,
I want ver el hueso entero dentro del lienzo y poder girarlo con el dedo,
so that pueda reconocer su forma desde cualquier ángulo en vez de mirar un
trozo recortado o algo escondido detrás de la ficha.

## Acceptance criteria

```gherkin
Given que abro la ficha de la clavícula derecha en una pantalla de teléfono
When la escena termina de encuadrar
Then el hueso se ve entero, sin salirse por los lados del lienzo

Given que abro la ficha de un hueso en una pantalla de teléfono
When la escena termina de encuadrar
Then el hueso queda en la parte del lienzo que la tarjeta no tapa

Given que estoy viendo un hueso aislado
When arrastro el dedo sobre el lienzo
Then el hueso gira, y la página no hace scroll

Given que abro la ficha de la falange media del quinto dedo del pie
  # 0,0084 unidades: el hueso más chico del modelo
When la escena termina de encuadrar
Then el hueso se ve, sin desaparecer por el plano cercano de la cámara

Given que abro la ficha de un hueso que el modelo no representa
When la vista se monta
Then sigue apareciendo la explicación de la ausencia, sin ningún lienzo

Given que estoy en Explorar
When la escena del esqueleto completo se monta
Then su encuadre es el mismo de siempre: esta historia no lo toca
```

## Example

Medido sobre `skeleton.glb`, las 144 mallas del modelo, con sus dimensiones
en unidades de escena:

| Hueso | Ancho (x) | Alto (y) | Ratio x/y | Por qué importa |
|-------|----------:|---------:|----------:|-----------------|
| Atlas (C1) | 0,084 | 0,019 | **4,34** | El más ancho respecto de su alto de todo el modelo |
| Clavícula derecha | 0,140 | 0,033 | **4,26** | El más ancho en términos absolutos entre los de ratio extremo |
| Fémur derecho | 0,116 | 0,451 | 0,26 | Alto y estrecho: **no** expone el defecto |
| Falange media 5.º dedo del pie | 0,0084 | 0,0065 | 1,29 | El más chico del modelo |

Hoy `distanceToFit` recibe `max(x, y, z)` y lo trata como **altura**, con un
FOV vertical de 45°. En un lienzo de teléfono el campo horizontal es más
estrecho que el vertical, así que la clavícula —0,140 de ancho encuadrado
como si midiera 0,140 de alto— se sale por los dos lados.

## In scope

- El encuadre tiene en cuenta el **aspect ratio** real del lienzo, no solo
  el FOV vertical.
- El encuadre tiene en cuenta la **zona útil**: la tarjeta de la ficha ocupa
  hasta `45vh` en la parte de abajo, y el hueso no debe centrarse detrás de
  ella.
- La escena aislada gana controles de órbita, siguiendo el patrón que
  `SkeletonScene` ya tiene — incluido el vigilante que mantiene
  `touch-action: none` sobre el lienzo.
- Pruebas de navegador contra los casos extremos medidos, no contra un
  ejemplo cómodo.

## Out of scope

- **La escena del esqueleto completo (`SkeletonScene`)** — su encuadre y sus
  controles funcionan; acercar la cámara a la selección es e9.4.
- **Zoom y desplazamiento con dos dedos en la escena aislada** — la historia
  pide girar. Si al probarlo en el teléfono el zoom se echa de menos, entra
  como hallazgo, no como ampliación silenciosa.
- **Animar la transición de encuadre** — rabbit hole declarado en el brief
  de la épica.
- **Tocar el activo 3D** — no-go del brief: esto es cámara y controles.
- **El salto de alto de la tarjeta entre huesos** — aparcado desde e8.5.

## Done when

- La clavícula derecha y el atlas —los dos casos que hoy fallan— se ven
  enteros dentro del lienzo en una pantalla de teléfono, y el fémur, que
  hoy ya funciona, sigue funcionando.
- El hueso queda dentro de la parte del lienzo que la tarjeta de la ficha
  no cubre.
- Arrastrar el dedo sobre el lienzo gira el hueso, y el gesto no le roba el
  scroll a la página.
- La falange media del quinto dedo del pie sigue visible: el arreglo del
  plano cercano que e4.4 introdujo no se pierde.
- El encuadre de `SkeletonScene` no cambia — verificado, no supuesto.
- Un hueso sin geometría sigue mostrando su explicación, sin lienzo.
- Comprobado en el navegador real y a mano en el teléfono.

## Notes

- **La causa está en `src/domain/framing.ts:10`**: `distanceToFit(height,
  fovDegrees, margin)` no conoce ni el aspect ratio ni la zona útil. La
  firma se hace más estricta, y eso es deseable — el compilador nombrará a
  sus dos llamadores, uno de los cuales (`SkeletonScene`) esta historia no
  debe alterar.
- **Son dos defectos con un solo síntoma.** El aspect ratio y la tarjeta que
  tapa son causas independientes; cada una necesita su propia corrección y
  su propia prueba.
- **El fémur no sirve como caso de prueba.** Es el hueso con el que uno
  prueba por instinto y es justo el que no expone nada: alto y estrecho,
  ratio 0,26. El plan de la épica registró este riesgo como alto.
- El dev server y su túnel están vivos y se dejan así.
