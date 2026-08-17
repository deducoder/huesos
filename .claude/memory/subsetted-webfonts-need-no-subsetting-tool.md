---
name: subsetted-webfonts-need-no-subsetting-tool
description: Los .woff2 que Google Fonts sirve por subset ya vienen recortados — empaquetar una fuente no exige fontTools ni ningún paso de build, solo elegir el subset correcto y verificar que cubre el dominio real de texto.
metadata:
  type: process
---

En e7.3, `must-privacy-006` obligaba a servir la tipografía desde el propio
origen. La pregunta que se estuvo a punto de hacer fue «¿cómo subseteo un
archivo grande a los caracteres que necesito?», y la respuesta parecía ser
instalar `fontTools`/`pyftsubset`. La pregunta correcta era otra: **¿hace falta
subsetear?**

Google Fonts ya distribuye cada familia partida en bloques (`latin`,
`latin-ext`, `cyrillic`…) y cada bloque es un `.woff2` ya recortado a ese rango
de Unicode. El catálogo del proyecto usa 72 caracteres, todos dentro de
`latin`. Descargar el bloque correcto —16 KB— dio el mismo resultado que
subsetear a mano, sin añadir una dependencia de desarrollo ni un paso de build.

**Por qué importa:** instalar una herramienta para reproducir un recorte que ya
existe es trabajo que se ve necesario y no lo es. El coste no es solo la
dependencia: es normalizar «para usar una webfont hace falta tooling de
subsetting», que empuja a herramientas más pesadas de las que el problema real
pide.

**How to apply:** antes de subsetear una fuente a mano, comprobar si la fuente
de origen ya distribuye el subset que se necesita. Para verificarlo: extraer el
repertorio real de caracteres del dominio de datos (no adivinarlo) y comparar
contra el `unicode-range` que el bloque declara. Si coincide, no hace falta
herramienta — solo el archivo correcto y una prueba que lo verifique contra el
dominio real, no contra una muestra.
