# Story e2.6: Explore view — Retrospective

Estimated: S · Actual: S, 1 commit

## Summary

Las tres piezas —lista, escena y panel— quedan probadas como un sistema: la
escena recibe la malla correcta del hueso elegido, `null` cuando el hueso no
tiene geometría, la selección hecha en la escena aparece marcada en la lista, y
nunca hay más de un hueso marcado.

## What went well

- **El doble de la escena dejó de ser un tapón y pasó a ser un instrumento.**
  Exponiendo lo que recibe por props, prueba exactamente la costura que un doble
  suele ocultar: qué le llega desde el estado. Es la diferencia entre sustituir
  para que el test pase y sustituir para poder medir.
- **La aserción del `femur-left` es la que más valor tiene.** Comprueba que a la
  escena le llega `Femur.r` —la malla— y no `femur-left` —el identificador—, que
  es justo la confusión que el modelo de un solo hemicuerpo invita a cometer.
- **«Exactamente un marcado» es una invariante barata y muy protectora.** Cubre
  toda una familia de errores de sincronía con una sola aserción.

## What to improve

- **La historia llegó vacía de trabajo propio** porque las anteriores la fueron
  consumiendo. Tuvo sentido —sin montar no hay integración que probar— pero
  significa que el plan del epic separó una historia que en la práctica no era
  separable. Habría sido más honesto planificar la composición como parte de
  e2.3 y dejar aquí solo el contrato, que es lo que acabó pasando.
- **Sigue sin haber comprobación visual.** Es la tercera historia seguida que
  cierra con esa laguna.

## Learned

1. **About the system:** el estado de selección no viaja igual a cada pieza: la
   lista y el panel reciben el `id`, la escena recibe el `meshName`. Esa
   traducción es el contrato del epic y ahora está fijada en un test.
2. **About the process:** un doble de prueba puede **medir** en vez de solo
   sustituir. Si el doble expone lo que recibe, la costura queda probada aunque
   el componente real sea invisible para el test.
3. **Capability gained:** las tres proyecciones del estado están cerradas entre
   sí, así que E3 y E4 pueden añadir una cuarta sin tocar las existentes.
