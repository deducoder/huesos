# Story e1.5: Spine catalog — Retrospective

Estimated: M (3 tareas) · Actual: M, 1 commit de datos — el volumen resultó más
barato de lo previsto

## Summary

Las 26 vértebras están en el catálogo con nombre español, término en
Terminologia Anatomica y sinónimos por los que un estudiante podría responder.
Con ellas queda fijado el criterio de nomenclatura que e1.6 aplicará a las 173
entradas restantes.

## What went well

- **La prueba se escribió antes que los datos, y encontró cosas.** Cuatro de las
  seis aserciones fallaban al empezar; ninguna transcripción entró sin una
  exigencia previa que cumplir.
- **La aserción del numeral romano fue la más útil.** Exigir literalmente
  `vertebra thoracica VII` obligó a decidir el criterio de terminología en el
  test, no a improvisarlo entrada por entrada. Sin ella, 26 líneas escritas a
  mano habrían acabado con tres estilos distintos de latín.
- **El anclaje de e1.4 hizo su trabajo en silencio.** 26 `meshName` transcritos
  y ninguna errata: si la hubiera habido, el gate la habría nombrado.

## What to improve

- **Las tareas se fundieron en un commit.** El plan separaba el RED del GREEN y
  se ejecutaron juntos; con volumen de datos la tentación de commitear una vez
  es fuerte y hay que resistirla, porque es justo donde un rojo intermedio
  aporta señal.
- **Los sinónimos se eligieron por intuición.** `vértebra dorsal`, `coxis`,
  `rabadilla` son razonables, pero nadie los validó contra cómo escriben de
  verdad los estudiantes. Es una deuda que el motor de test de E4 va a heredar.

## Learned

1. **About the system:** el modelo nombra los niveles de forma irregular —`Atlas
   (C1)` y `Axis (C2)` con nombre propio, el resto como `Cervical vertebrae
   (C3)`—, así que el `id` del catálogo no se puede derivar mecánicamente del
   nombre de malla. La transcripción con criterio humano no era ceremonia: era
   necesaria.
2. **About the process:** cuando una historia es volumen de datos, la prueba
   debe fijar el **formato** además del recuento. Contar 26 entradas no impide
   26 estilos distintos; exigir una cadena exacta sí.
3. **Capability gained:** hay un criterio de nomenclatura escrito y probado. e1.6
   no tiene que decidir nada sobre cómo se escribe un nombre: solo aplicarlo.
