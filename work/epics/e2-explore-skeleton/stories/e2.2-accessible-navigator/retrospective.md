# Story e2.2: Accessible navigator — Retrospective

Estimated: M · Actual: M, 2 commits de código

## Summary

La aplicación ya se puede usar: 206 huesos agrupados en 10 listas por región,
cada uno un botón alcanzable por teclado, con nombre accesible que incluye el
lado, estado expuesto en `aria-pressed` y las ausencias explicadas mediante
`aria-describedby`. Todo sin una línea de WebGL.

## What went well

- **Buscar por rol y nombre accesible fue lo que dio valor al test.** Ninguna
  aserción usa una clase CSS ni un `data-testid`: se pide «el botón que se llama
  fémur derecho». Si el nombre accesible se rompiera, el test cae — que es
  justamente el fallo que `must-a11y-005` quiere evitar y que un test por clase
  no vería.
- **La regla del linter mejoró el diseño en vez de estorbar.** Rechazó
  `role="group"` y empujó a una `<ul>` con nombre, que se anuncia mejor. Se
  siguió el consejo del linter en la dirección correcta, no la literal
  (`<fieldset>` habría sido peor).
- **ADR-002 se cumplió en el orden que prometía:** la vía accesible existe y
  funciona *antes* que la escena, así que no puede acabar siendo un apaño.

## What to improve

- **No hay verificación con lector de pantalla real.** `userEvent` emite
  eventos de teclado auténticos, pero nadie ha oído la aplicación. Es la
  diferencia entre «tiene los atributos correctos» y «se entiende al oírla», y
  el epic no la cubre.
- **206 botones en un solo recorrido de tabulación es mucho.** Los encabezados
  permiten saltar por grupos a un lector de pantalla, pero quien navegue solo
  con `Tab` tiene un camino largo hasta el miembro inferior. No lo resolví: lo
  dejo dicho porque se va a notar en cuanto alguien lo use en serio.

## Learned

1. **About the system:** el catálogo tenía ya todo lo que la vista necesitaba
   —lado, región, razón de ausencia—, así que el componente no tuvo que inventar
   ni un dato. La inversión de E1 en un esquema honesto se cobró entera aquí.
2. **About the process:** cuando un linter de accesibilidad protesta, conviene
   entender **qué** protege antes de obedecer al pie de la letra. Su sugerencia
   literal era peor que el problema; su intención señalaba la solución correcta.
3. **Capability gained:** el proyecto tiene patrón de componente accesible
   —rol semántico, nombre accesible, estado por ARIA, descripción para lo
   excepcional— y una prueba que lo verifica por rol y nombre, no por estructura.
