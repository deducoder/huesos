---
name: hiding-is-not-removing
description: Ocultar un objeto lo saca de una capa y lo deja en las demás — en three, `visible = false` no lo saca del raycaster —, así que una prueba que observa píxeles declara arreglado un defecto que sigue vivo en la interacción.
metadata:
  type: pitfall
---

En b2.3, la escena espejaba mallas que el modelo ya traía en su sitio. El
primer arreglo puso `visible = false` sobre el grupo duplicado: el render
quedó correcto, la prueba de regresión —que cuenta **píxeles encendidos por
mitad de imagen**— pasó a verde, y los dos gates dieron verde. **El usuario
probando en vivo encontró que seguía roto:** al pulsar un lado del cráneo se
seleccionaba a veces el hueso del lado contrario.

`three` no comprueba `visible` al calcular intersecciones. Comprobado con una
sonda: una malla invisible devuelve 2 intersecciones. Las 36 mallas espejadas
seguían siendo pulsables, invisibles, en el hemisferio equivocado. El arreglo
real fue quitarlas del grafo con `removeFromParent()`, no ocultarlas.

**Por qué importa:** el defecto vivía en una modalidad —lo que el rayo
encuentra— que ninguna prueba observaba, mientras la modalidad observada —lo
que se dibuja— estaba correcta. Un verde así no es un falso positivo del
instrumento: el instrumento medía bien algo que no era el defecto.

**How to apply:** al arreglar algo que se ve, preguntar qué otras capas
consumen el mismo objeto —render, hit-testing, encuadre/medición, exportación,
accesibilidad— y comprobar que la operación elegida las cubre todas. Ante la
duda entre ocultar y quitar, **quitar**: ocultar es un ajuste de una capa,
quitar es un hecho del grafo. Y si la prueba observa una sola modalidad,
decirlo en voz alta antes de llamar cerrado al arreglo. Relacionado:
[[test-the-data-after-the-library]], [[manual-verification-keeps-finding-real-things]].
