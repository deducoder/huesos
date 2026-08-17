# Story e5.4: Failed-first selection — Scope

## User story

As a estudiante de medicina,
I want que el modo test me pregunte más seguido los huesos que fallo,
so that mi tiempo de estudio se vaya donde está mi debilidad y no donde ya
sé responder.

Es la historia que cumple el **outcome** del proyecto ("el fallo dirige el
estudio"); las tres anteriores solo cumplían el requisito de recordar.

## Acceptance criteria

```gherkin
Given un registro donde "frontal" acumula fallos y "sacrum" solo aciertos
When se pide muchas preguntas seguidas
Then "frontal" sale con más frecuencia que "sacrum"

Given un registro vacío                            # sin datos, sin sesgo
When se pide una pregunta
Then todos los huesos preguntables son igual de probables

Given cualquier registro                           # invariante de ADR-005
When se piden muchas preguntas
Then cualquier hueso preguntable puede salir — la ponderación cambia
     frecuencias, nunca reduce el conjunto de candidatos

Given un hueso que se falló y luego se acertó varias veces
When se pide una pregunta
Then su ventaja sobre uno nunca fallado ha disminuido

Given cualquier registro                           # invariantes que ya existían
When se pide una pregunta
Then nunca es un hueso sin malla, ni el inmediato anterior
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `frontal` con 2 fallos, resto vacío | pedir 100 preguntas con sorteo determinista | `frontal` sale bastante más que cualquier otro |
| registro vacío | pedir 100 preguntas | ningún hueso domina |
| `frontal` con 2 fallos y 5 aciertos | comparar su peso con uno nunca preguntado | mayor, pero menos que con 2 fallos y 0 aciertos |

## In scope

- `pickTestableBone` acepta el registro de progreso y un **sorteo inyectable**,
  y elige con pesos derivados del registro (ADR-005).
- Sus dos llamadas en `TestQuestion`, que pasan el registro del almacén.
- Los pesos, explícitos y explicables, con su justificación escrita donde se
  definen.

## Out of scope

- **Cualquier componente temporal** (cuándo se falló, decaimiento) — declarado
  fuera en el `scope.md` de la épica y rechazado en ADR-005.
- **Repetición espaciada con intervalos** (SM-2, Leitner) — rabbit hole del
  brief, alternativa rechazada en ADR-005.
- **Cola estricta de fallados** — alternativa (B) rechazada en ADR-005 por
  encerrar el estudio.
- **Mostrar por qué salió un hueso** — es interfaz de progreso, fuera de la
  épica.

## Done when

- Con un registro donde un hueso acumula fallos y otro solo aciertos, el
  fallado sale con más frecuencia — afirmado con una prueba **determinista**,
  con el sorteo inyectado, no con una impresión de uso.
- Con el registro vacío, la selección sigue siendo uniforme.
- Todo hueso preguntable sigue pudiendo salir.
- Las dos invariantes previas —nunca un hueso sin malla, nunca el inmediato
  anterior— siguen probadas y en verde.
- `./scripts/check` en verde.

## Notes

- ADR-005 fija la decisión y sus costes; esta historia la implementa sin
  revisitarla. En particular: "primero" es **estadístico**, no garantizado, y
  eso es deliberado.
- Los pesos concretos son un **juicio declarado**, no una medición. ADR-005 lo
  dice explícitamente para no repetir el error de s1, donde un número inventado
  viajó tres iteraciones disfrazado de dato.
