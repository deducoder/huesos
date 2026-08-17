# Epic e2: Explore skeleton — Brief

## Hypothesis

Para estudiantes de medicina que necesitan asociar un nombre a una forma y una
posición, la **vista de exploración de huesos-mono** es un esqueleto interactivo
que permite recorrer los 199 huesos catalogados, seleccionar uno y ver cómo se
llama en español y en Terminologia Anatomica. A diferencia de un atlas en papel,
responde a la selección y no obliga a tapar la respuesta con la mano.

## Success metrics

- **Leading:** seleccionar una región del esqueleto muestra el nombre del hueso
  en ambas nomenclaturas, y la misma selección es alcanzable con el teclado.
- **Lagging:** los 199 huesos anclados son seleccionables e identificables, y la
  vista funciona con teclado y lector de pantalla tan bien como con ratón.

## Appetite

**M** — 5-7 historias.

## Scope boundaries

### No-gos

- **No se pregunta nada al usuario.** Este epic muestra e identifica; el modo
  test, la validación de respuestas y la corrección son E4. Mezclarlos aquí
  convertiría la exploración en media aplicación de examen.
- **El color nunca es el único indicador.** Lo prohíbe `must-a11y-005`, y en una
  escena 3D es la tentación evidente: resaltar y no decir nada más.
- **No se toca el catálogo ni el activo.** E1 los cerró y los dejó probados; si
  algo falta, se reporta como hallazgo, no se parchea desde aquí.
- **No se guarda progreso.** La persistencia es E5.

### Rabbit holes

- **Perseguir el realismo visual.** Sombras, materiales, iluminación de estudio:
  nada de eso ayuda a memorizar un nombre.
- **Construir un motor de escena propio.** Se usa lo que la librería dé; si algo
  exige escribir un renderizador, es señal de que el enfoque está mal.
- **Optimizar la carga antes de medirla.** Son 1,86 MB con Draco; medir primero.
- **Hacer que la lista accesible sea un añadido.** Si se construye después de la
  escena, acabará siendo un apaño. Es una vía de acceso de primera clase.
