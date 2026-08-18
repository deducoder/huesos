---
name: something-changed-is-not-an-assertion
description: "Una prueba que afirma \"algo cambió tras la acción\" no observa comportamiento; el defecto puede estar presente y cambiar píxeles igual."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T06:32:00.438Z
---

Al probar una interacción, afirmar la propiedad que debe cumplirse
**después**, no que la acción produjo algún efecto.

**Why:** en e9.3 escribí «al arrastrar sobre el lienzo cambian más de 2 000
píxeles» para probar que el hueso 3D gira. Daba ~90 píxeles para arrastres
de 120 px en horizontal, 150 en vertical y 200 en diagonal — el mismo
número en los tres, o sea ruido, no rotación. Y aunque hubiera funcionado,
«algo cambió» nunca habría detectado el defecto real, que el usuario
encontró en un minuto con el dedo: el hueso **se salía del encuadre** al
girar en vertical, y salirse también cambia píxeles. La prueba correcta era
girar y comprobar que el hueso sigue dentro, con holgura por los cuatro
lados.

**How to apply:** ante «verificar que X responde a la interacción»,
escribir la aserción sobre el estado final que importa (sigue visible,
sigue dentro, quedó en tal posición), no sobre la existencia de un cambio.
Si la única aserción posible es «cambió algo», la prueba no sabe qué debía
pasar. Ver también [[a-reintroduced-defect-must-actually-break]] y
[[manual-verification-keeps-finding-real-things]].
