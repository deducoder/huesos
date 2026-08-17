# Story e5.1: Progress record — Retrospective

Estimated: S (3 tareas) · Actual: S — 3 tareas planificadas, más un test que el
plan no tenía y un defecto encontrado en la review

## Summary

`src/domain/progress.ts`: el registro de aciertos y fallos por hueso como dato
puro, plano y serializable, con la lectura que trata un `id` ausente como
"nunca preguntado" y la anotación de un veredicto que devuelve un registro
nuevo sin tocar el recibido. 11 tests. Es la forma del dato de la que cuelgan
las otras cuatro historias de la épica.

## What went well

- **El plan aguantó.** Tres tareas, tres commits, gate verde en cada una, sin
  desviaciones de diseño. La talla S era la correcta.
- **T3 midió en vez de estimar.** El registro completo de los 206 huesos ocupa
  9.822 bytes — el 0,187 % del límite de `localStorage`. ADR-004 había escrito
  "del orden de unos pocos kilobytes" como premisa; ahora es un número. La
  medición confirmó el ADR, así que no hubo nada que superseder, pero la
  próxima persona no tiene que volver a estimarlo.
- **La review encontró un defecto real, no cosmético.** Ver abajo.

## What to improve

- **El `scope.md` pedía un test que el `plan.md` no planificó.** La ida y
  vuelta por JSON estaba en el *In scope* y en el *Done when* de la historia, y
  el plan la resolvía solo dentro de la sonda desechable de T3. Se detectó al
  revisar el scope contra lo hecho —no antes—, y se agregó como test
  permanente. **El plan debería derivarse del `Done when` línea por línea**, no
  de la idea general de la historia.
- **Nombres de campo decididos después de escribir el scope.** El ejemplo del
  `scope.md` salió en español y toda la superficie exportada del repo va en
  inglés. Se corrigió antes de implementar, que es lo barato; escribir el
  ejemplo mirando `bone.ts` habría sido más barato todavía.

## Learned

1. **About the system:** el registro completo del catálogo cabe en ~10 KB
   serializado, contadores de tres cifras incluidos. Eso cierra por medición la
   pregunta de si `localStorage` alcanza (ADR-004), y de paso dice que
   serializar el registro entero en cada respuesta es irrelevante a esta
   escala — la decisión de no guardar por hueso no necesita revisarse.

2. **About the process:** un `Done when` es una lista de comprobación, no una
   declaración de intenciones. Este tenía cinco líneas y el plan cubría cuatro;
   la que faltaba no era la difícil, era la que no encajaba en la narrativa de
   las tareas. Leer el `Done when` **al escribir el plan**, línea por línea,
   habría costado un minuto.

3. **Capability gained:** el proyecto tiene el dato de progreso, probado contra
   el catálogo real y con su tamaño medido. e5.2 puede persistirlo sin decidir
   nada más sobre su forma.

## Defect found in review

`boneProgress` devolvía una **única constante compartida** para todo `id`
ausente. Leer un hueso, mutar el resultado, y leer otro hueso devolvía la
mutación: corrupción global y permanente del estado inicial, invisible para
todos los demás tests porque ninguna función se portaba mal. El tipo tampoco
protegía — `Readonly<Record<K,V>>` congela el primer nivel y deja `V` mutable,
así que prometía una inmutabilidad que no daba.

Arreglado con test de regresión primero (`fix(progress): stop sharing one
mutable object for every unasked bone`): `readonly` en los campos de
`BoneProgress` y el estado inicial construido en cada llamada.

**Lo que lo habría evitado antes:** ninguna de las diez pruebas existentes
podía verlo, porque todas usaban el valor devuelto de forma correcta. El
defecto solo aparece si alguien lo usa mal — que es exactamente el tipo de cosa
que el gate no ve y la review sí. Guardado como
`initial-state-must-not-be-a-shared-object`.
