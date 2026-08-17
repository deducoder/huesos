# Story e6.1: Absences shown honestly — Retrospective

Estimated: S (3 tareas) · Actual: S — con un defecto real encontrado, que es
exactamente para lo que la historia iba primera

## Summary

La ficha de un hueso que el modelo 3D no incluye ya no muestra un panel negro
con una etiqueta que anuncia una vista tridimensional inexistente: explica que
ese hueso no está en el modelo y remite al motivo, que sigue una sola vez en la
ficha de identidad. Las otras cuatro superficies que renderizan huesos se
revisaron una por una y ya eran honestas.

## What went well

- **Ir primera valió exactamente lo que el plan decía que valdría.** La historia
  existía para descartar que la épica tuviera un defecto dentro; encontró uno.
  Si hubiera ido última, el ADR y el PRD se habrían escrito afirmando que la
  aplicación trata bien a los siete ausentes, y no era cierto.
- **El arreglo elimina el defecto por construcción, no por corrección.** No se
  reescribió la etiqueta mentirosa: se dejó de montar el lienzo. Una etiqueta
  que no existe no puede volver a mentir.
- **El test destapó una duplicación que yo no había visto.** Falló con "Found
  multiple elements" porque mi primer arreglo repetía la razón en los dos
  paneles de la misma pantalla. La aserción quedó afirmando la unicidad, así
  que la duplicación no puede volver en silencio.
- **La revisión de superficies fue por búsqueda, no por memoria.** Se enumeraron
  los archivos que renderizan huesos con `grep`, en vez de recordar dónde había
  mirado antes. Cinco superficies, cinco veredictos escritos.

## What to improve

- **El doble de `IsolatedBoneScene` no reproducía el `aria-label` del
  componente real**, así que el defecto de la etiqueta era invisible para las
  pruebas existentes. Tuve que añadírselo para poder escribir el RED. **Un doble
  que no reproduce lo que el original hace mal no puede demostrar que se
  arregló** — y esta suite llevaba desde E3 con ese doble incompleto.
- **Mis dos tropiezos de sonda fueron por asumir la interfaz en vez de leerla:**
  intenté volver a una pestaña que la aplicación oculta a propósito mientras hay
  una ficha abierta, y busqué el hioides por su sinónimo. Los dos habrían costado
  cero mirando `App.tsx` y el catálogo primero.

## Learned

1. **About the system:** un componente que degrada silenciosamente —
   `IsolatedBoneScene` no monta cámara cuando no hay malla visible— produce un
   estado que *ningún error* señala: lienzo negro, cero excepciones, cero avisos
   en consola. La degradación elegante del componente y la honestidad de la
   pantalla son cosas distintas, y la primera puede esconder la falta de la
   segunda.

2. **About the process:** la fidelidad de un doble de pruebas es parte de la
   cobertura. Este reproducía la firma pero no el comportamiento accesible, y
   por eso una etiqueta que mentía desde E3 sobrevivió a dos épicas con la suite
   en verde. Al escribir un doble, la pregunta no es "¿basta para que compile?"
   sino "¿podría fallar por lo mismo que fallaría el real?".

3. **Capability gained:** los siete huesos sin geometría están presentados con
   honestidad en las cinco superficies donde pueden aparecer, y eso está
   verificado en navegador real. La épica puede seguir siendo de gobernanza,
   que era la incógnita.
