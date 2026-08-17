---
name: verify-before-naming-a-suspected-bug
description: Cuatro historias con hallazgos reales en verificación manual no significa que toda sospecha lo sea — investigar con un caso de control antes de nombrar el hallazgo, en cualquier dirección.
metadata:
  type: process
---

En e4.3, una captura de pantalla sugería que el resaltado 3D no coincidía
con el hueso nombrado en el texto (parecían las costillas resaltadas para
un hueso del pie/mano). En vez de reportarlo como hallazgo, se armó un
experimento de control: fijar `Math.random = () => 0` vía
`page.addInitScript()` para forzar la pregunta a un hueso grande y visible
("hueso frontal"). El resaltado coincidió exactamente. Conclusión real: los
huesos pequeños son difíciles de distinguir resaltados a esa escala —
sombreado normal de luz, no el color de resaltado real —, no un bug de
sincronización.

**Por qué importa:** el patrón de esta sesión (`manual-verification-keeps-
finding-real-things`) es real, pero no es una licencia para reportar toda
sospecha como hallazgo confirmado. La honestidad metódica corre en ambas
direcciones: nombrar lo que sí es un defecto, y descartar con evidencia lo
que no lo es, antes de escribirlo en una retrospectiva o un progress.md
como si fuera un hecho.

**How to apply:** ante una sospecha de bug visual/de comportamiento sin
confirmar, armar el experimento mínimo que la confirme o la descarte antes
de nombrarla como hallazgo — un caso de control conocido (un valor grande,
un caso límite claro) suele bastar. Reportar "sospeché X, lo descarté
así" es tan válido como reportar un bug real — ambos son observabilidad,
uno solo tarda un paso más en confirmarse.
