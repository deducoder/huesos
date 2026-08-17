---
name: accessible-tests-protect-a-redesign
description: Una suite que consulta roles y nombres accesibles en vez de clases CSS deja de ser solo correcta y pasa a ser una red: el rediseño visual no la rompe, y un rojo significa que se degradó la accesibilidad.
metadata:
  type: reference
---

Al diseñar E7 —invertir la aplicación entera de tema oscuro a claro, con
tipografía y layout nuevos— la pregunta obvia era cuántos tests habría que
reescribir. Medido con una búsqueda sobre todos los `*.test.ts(x)` del
proyecto: **ninguno asserta una clase CSS**. Los de componentes consultan roles
y nombres accesibles (`getByRole('button', { name: 'fémur derecho' })`,
`aria-pressed`, `role="status"`); los que leen el fuente comprueban privacidad
y anclajes de datos, no aspecto.

Eso convirtió el riesgo en su contrario. Los 201 tests no son un obstáculo para
el rediseño: son la red que impide que el rediseño rompa lo que importa. Y dan
un criterio de lectura para cada rojo — **si un cambio de estilo pone un test en
rojo, la hipótesis por defecto es que se perdió un rol o cambió un nombre
accesible**, no que el test sea frágil.

**Por qué importa:** probar por rol y nombre accesible suele defenderse por
accesibilidad, que es una razón suficiente pero futura y difusa. Este es el
retorno concreto y fechado: llega un rediseño total y la suite no se toca.

**How to apply:** al escribir un test de componente, consultar por rol y nombre
accesible antes que por clase, texto exacto de estilo o `data-testid`. Y al
planear un rediseño, medir primero cuántos tests dependen del aspecto: la
respuesta cambia el riesgo de la épica entera, y se averigua con una búsqueda de
un minuto. Relacionado: [[manual-verification-keeps-finding-real-things]],
[[hiding-is-not-removing]].
