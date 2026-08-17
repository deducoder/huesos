---
name: optional-options-objects-dont-protect-callers
description: Cambiar parámetros posicionales por un objeto de opciones con todas las propiedades opcionales deja compilando a los llamadores viejos — el compilador protege al hacer algo requerido, no al hacerlo permisivo.
metadata:
  type: pitfall
---

En e5.4, `pickTestableBone(bones, excluirId?: string)` pasó a
`pickTestableBone(bones, opciones?: PickOptions)`, con las tres propiedades de
`PickOptions` opcionales. Un test previo seguía llamando
`pickTestableBone(catalog, 'femur-right')`. **TypeScript no dijo nada**: el
string se recibía como el objeto de opciones, `excluirId` quedaba `undefined`,
y el hueso "excluido" volvía a salir. El test compiló y falló en ejecución.

El contraste está en la misma épica: en e5.3, añadir una prop **requerida** a
un componente convirtió "falta conectar dos vistas" en dos errores de
compilación inmediatos. El compilador fue el plan. Aquí no lo fue.

**Por qué importa:** es fácil suponer que cambiar una firma rompe la
compilación de todos sus llamadores y usar eso como red. Solo es cierto cuando
la firma nueva es **más estricta**. Al aflojarla —todo opcional, un objeto en
vez de posicionales, una unión más ancha— los llamadores viejos siguen
pasando el chequeo y el fallo se muda a ejecución, o peor, a producción.

**How to apply:** al cambiar una firma, preguntarse si la nueva es más
estricta o más permisiva que la vieja. Si es más permisiva, buscar los
llamadores a mano —`grep` por el nombre— en vez de confiar en el compilador, y
tratar el chequeo de tests huérfanos como la red principal y no como trámite.
Ver [[risk-first-ordering-can-invert-dependencies]] para el otro modo en que un
plan supone mal cómo se propaga un cambio.
