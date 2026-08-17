# Epic e2: Explore skeleton — Retrospective

## Summary

La aplicación se puede usar para estudiar. Un esqueleto 3D que gira y se acerca,
una lista de 206 huesos agrupada por región y navegable solo con teclado, y un
panel que nombra el hueso elegido en español y en Terminologia Anatomica.
Seleccionar en cualquiera de las tres piezas se refleja en las otras dos, y el
color nunca es el único canal que comunica la selección.

## Metrics

- Historias: 6 · Estimadas: 3 S, 3 M · Reales: exactas, ninguna cambió de talla
- Commits: 22 en el rango del epic · Pruebas: 38 → 80 (+42)
- Bundle: 232 KB → 1 204 KB (326 KB con gzip), por three.js; activo 1,86 MB
- Módulos nuevos: 4 de dominio, 4 de vista, 1 de composición
- Surgido y no planificado: el material compartido entre copias de la escena, el
  polyfill de `ResizeObserver`, y que `ExploreView` acabara creándose tres
  historias antes de la suya

## Scope verification

**MUST**

- *Selección por teclado y por ratón* → **Fulfilled**. Teclado probado con
  `userEvent` en `BoneNavigator.test.tsx`; ratón, mediante `boneIdForMesh` y el
  contrato probado en `ExploreView.test.tsx`.
- *Nombre en ambas nomenclaturas al seleccionar* → **Fulfilled**.
  `BoneIdentity` muestra `es` y `la`; probado.
- *Los 199 huesos anclados alcanzables* → **Fulfilled**. La lista presenta las
  206 entradas —incluidas las 7 sin geometría, con su razón— y una aserción
  recorre las 199 ancladas comprobando que todas resuelven en su mitad.
- *El hueso activo comunicado por más de un canal* → **Fulfilled**.
  `aria-pressed` en la lista, texto en el panel, anuncio en `aria-live` y
  resaltado en la escena. Cuatro canales; el color acompaña, nunca informa solo.

**SHOULD**

- *Girar y acercar la escena* → **Fulfilled**. `OrbitControls` con órbita, zoom y
  desplazamiento.
- *La lista indica los huesos sin geometría en vez de esconderlos* →
  **Fulfilled**. Marca visible, `aria-describedby` con la razón, y la región
  entera rotulada como no representable.

**Done when**

- *Seleccionar muestra ambas nomenclaturas* → **Fulfilled**.
- *Usable solo con teclado, verificado en test* → **Fulfilled**.
- *La escena carga el modelo y resalta el hueso elegido* → **Parcialmente
  verificado.** El código está y las pruebas cubren el mapeo y el contrato, pero
  **nadie ha visto la escena renderizada**: no hay navegador en este entorno. Es
  el único criterio del epic que no puedo declarar cumplido con pruebas, y no lo
  presento como si lo estuviera.
- *Ninguna información depende solo del color* → **Fulfilled**.

Sin compromisos de eliminación en este scope.

## What went well

- **Poner la vía accesible en el walking skeleton cambió el epic entero.** Con
  e2.1, e2.2 y e2.3 la aplicación ya servía para estudiar sin una línea de WebGL.
  Cuando la escena llegó y rompió las pruebas —`ResizeObserver`, canvas
  intestable—, nada de eso puso en riesgo el producto: era enriquecimiento sobre
  algo que ya funcionaba. Construido al revés, cada tropiezo de three habría sido
  un tropiezo del epic.
- **`must-a11y-005` guio el diseño en vez de auditarlo.** La lista no es un modo
  alternativo: es la vía por defecto, y el resultado es que el 90 % de la lógica
  del epic quedó probable en jsdom precisamente porque vive en DOM real y en
  dominio puro.
- **Lo intestable se redujo bajando las decisiones a dominio.** «Qué hueso se ha
  pulsado» salió del canvas y se convirtió en `boneIdForMesh`, una función pura
  con seis aserciones. El raycasting sigue sin probarse; la lógica que decide, sí.
- **Los dobles de prueba midieron en vez de tapar.** El de la escena expone por
  props lo que recibe, lo que permitió fijar el contrato estado→escena sin
  renderizar WebGL.

## What to improve

- **Tres historias seguidas cerraron sin comprobación visual.** e2.4, e2.5 y e2.6
  dan por bueno «compila, construye y se sirve», que no es «se ve». No hay
  navegador en este entorno y no lo disimulé en ninguna, pero **tres veces es un
  patrón**: el epic necesitaba un modo de verificación que no tenía, y eso debió
  decidirse al planificarlo, no descubrirse tres veces.
- **`ExploreView` se creó en e2.3, tres historias antes de la suya.** El plan
  separó una composición que en la práctica no era separable: sin montar las
  piezas no hay integración que probar. e2.6 acabó entregando el contrato, que es
  lo que debió planificarse desde el principio.
- **El material compartido al clonar la escena no lo habría detectado ninguna
  prueba de este proyecto.** Se encontró razonando sobre three, y la red que
  quedó es una aserción sobre el texto del fuente, que es muy floja.
- **El bundle pasó de 232 KB a 1,2 MB y no se atendió el aviso**, por la ratonera
  declarada. Sigue siendo verdad que hay que medir antes de optimizar, pero ya
  hay una cifra que mirar.

## Learned

1. **About the system:** el proyecto tiene ahora **dos representaciones del mismo
   esqueleto** —el catálogo y la escena— y la traducción entre ellas no es
   simétrica: la lista y el panel hablan de `id`, la escena habla de `meshName`, y
   una malla puede ser dos huesos. Esa asimetría es el contrato central de la
   aplicación, y ninguna historia sola la mostró: apareció al componerlas.
2. **About the process:** cuando una parte del sistema no es verificable
   automáticamente, la decisión importante no es cómo probarla sino **qué poner
   antes que ella**. Ordenar el epic para que lo intestable llegue sobre algo que
   ya funciona convierte un riesgo en un extra.
3. **Capability gained:** hay un patrón de componente accesible probado por roles
   y nombres, una capa de dominio que decide todo lo decidible fuera del canvas, y
   un estado de selección que admite una cuarta proyección sin tocar las tres
   existentes. E3 y E4 se cuelgan de ahí.
