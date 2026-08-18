# Story e8.1: Merged navbar — Progress

## T1 · Fundir cabecera y pestañas en una sola fila

`<header>` y `Pestanas` fundidos: `<h1>` baja de `text-titulo` (1.75rem)
a `text-lg`; el `<nav>` pierde su propio borde/fondo/padding vertical
(ahora los provee el `<header>`, `items-stretch` + `py-2` en el `nav`
para que su borde inferior siga coincidiendo con el de la fila —
resuelto en el diseño, no descubierto acá). 2 tests nuevos: título y
pestañas dentro del mismo `banner`; en modo ficha, el `banner` muestra
el título sin pestañas. Mutación forzada (volver a poner `Pestanas`
como hermano del `header`) confirmó que el primer test lo detecta.

Gate: `./scripts/check` verde (268 tests, lint/format/types limpios).
Ninguna desviación del plan — el ajuste de `items-stretch`/`py-2` que el
diseño anticipó como riesgo se implementó directo, sin necesitar un ciclo
de prueba-error.
