---
name: rendered-samples-beat-feature-tables-for-visual-choices
description: Una decisión puramente visual —tipografía, color, forma— se decide mejor con una muestra renderizada usando datos reales de la aplicación que con una tabla de características o un pangram genérico.
metadata:
  type: process
---

En e7.3 se compararon cinco tipografías display candidatas. En vez de una tabla
con "peso / redondez / legibilidad" puntuada a ojo, se descargaron los cinco
archivos y se renderizó **el texto real de la aplicación** —"huesos-mono",
"hueso cigomático izquierdo", "¿Qué hueso es?"— a 390 px de ancho, el viewport
que la épica sirve. La elección salió evidente en una captura: diferencias de
altura de x y de cómo se parte un nombre largo que una tabla de adjetivos no
habría mostrado.

El mismo patrón ya había decidido la superficie del lienzo en e7.2 — no una
paleta abstracta, sino capturas del esqueleto real con el hueso resaltado
encima, que fue lo que descartó el azul grisáceo.

**Por qué importa:** una decisión visual evaluada en abstracto premia lo que
suena bien en la descripción, no lo que se ve bien con los datos reales. El
texto más largo del dominio, el color bajo el estado más exigente (seleccionado,
no en reposo) es donde una opción falla o se sostiene.

**How to apply:** ante una decisión visual con candidatas, generar una muestra
renderizada con el contenido real y más exigente del dominio —el nombre más
largo, el estado más cargado, el tamaño de pantalla más chico— antes de
comparar por características. Enseñarle la muestra a quien decide en vez de
describirle las opciones.
