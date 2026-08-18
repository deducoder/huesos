---
name: count-wrapped-lines-not-width-ratios
description: Dividir el ancho del texto entre el ancho útil es una cota inferior del número de líneas; hay que medir el wrap real.
metadata:
  type: feedback
---

Para decidir si una etiqueta cabe, `measureText(t) / anchoÚtil` miente: el
salto de línea ocurre entre palabras, no donde se acaba el espacio. En e9.5
(2026-08-18) la razón daba 2,06 líneas para un texto que renderizaba **3**, y
«2.º metatarsiano» (16 caracteres) daba 1,25 pero ocupaba **3 líneas** en un
botón de 86 px, porque manda la palabra más larga y no el total.

**Why:** con columnas estrechas el número de líneas depende del reparto de
palabras. Un techo en caracteres no controla el wrapping donde una sola
palabra ya no cabe.

**How to apply:** medir con un div oculto del ancho real y
`Math.round(offsetHeight / lineHeight)`. Y comprobar la palabra más larga por
separado: si ella sola desborda, el problema es el ancho de columna y ninguna
abreviatura lo arregla. Relacionado: [[measure-the-element-after-layout]],
[[prototype-numbers-need-reproducing-in-the-real-component]].
