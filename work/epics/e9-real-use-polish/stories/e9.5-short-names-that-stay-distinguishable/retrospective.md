# Story e9.5: Short names that stay distinguishable — Retrospective

Estimated: L · Actual: L — 9 tareas planeadas, 9 ejecutadas, 11 commits.

## Summary

El texto visible de un hueso pasa a ser una derivación de vista sobre el `es`
del catálogo: ordinal en cifra, elisión del rodeo en las falanges y
capitalización inicial. El nombre accesible conserva el del catálogo, y el
lado concuerda en género con el hueso, que ahora lo declara. Un gate sobre los
206 huesos vigila techo, unicidad y que la derivación siga viva.

Cinco vistas cambian —navegador, grilla de Fichas, panel de identidad, título
de la ficha y opciones del test—; `SIDE_LABEL` y las dos copias de
`accessibleName` desaparecen. `./scripts/check` verde (312 tests),
`./scripts/check-integration` 31 de 31, `should-perf-007` sin cambio.

## What went well

- **Medir antes de decidir.** El techo (26) y la forma del ordinal no se
  eligieron en abstracto: se simuló la regla sobre los 120 nombres únicos
  —máximo 25 caracteres, cero colisiones— y se midió el wrap real en 390 px
  contra el dev server. ADR-014 pedía exactamente eso y era la parte fácil de
  saltarse.
- **El riesgo declarado no se materializó, y el que dolió no estaba en la
  lista.** El plan marcaba T4 —las píldoras con `aria-labelledby`— como el
  desconocido; se resolvió con un `aria-label` y una línea. Lo que apareció
  fue un test que **exigía el defecto** («tibia izquierdo») y otro que aceptaba
  las dos formas con un `|`.
- **El gate se probó a sí mismo.** El stub identidad dejó 5 de 6 en rojo y
  **la unicidad en verde**: prueba empírica, no argumento, de que la tercera
  afirmación hacía falta.
- **La regla resultó ser una sola.** El gemba mostró que 45 de los 120 nombres
  no llevan ordinal y solo se capitalizan, y que el género del ordinal sale de
  la propia palabra («primera costilla» → «1.ª costilla»), no del hueso. Solo
  el género del **lado** necesitaba dato nuevo.

## What to improve

- **`quality-review` encontró lo que el diseño no miró: WCAG 2.5.3.** ADR-014
  evaluó al lector de pantalla y a la suite de Playwright, y no al control por
  voz, para quien el nombre visible y el accesible no son equivalentes sino
  incompatibles. El hallazgo está aparcado con destino —necesita un ADR que
  supersede—. La mejora de proceso: **cuando una decisión separe el texto
  visible del nombre accesible, enumerar los tres consumidores, no dos.**
- **Un criterio del scope era inalcanzable y se supo al medir.** «Sin envolver
  a tres líneas» no se puede cumplir en el botón de opción del test: con 86 px
  útiles, hasta «2.º metatarsiano» ocupa 3 líneas. El design lo corrigió antes
  de implementar, que es donde debía corregirse, pero el scope lo escribió sin
  medir ningún ancho.
- **El humano aceptó un riesgo que la historia no puede cerrar.** En el
  teléfono, las etiquetas del test «se ven algo grandes»: asumido y dejado
  así, con el remedio en e9.2. Queda registrado como decisión, no como deuda
  anónima.

## Learned

1. **About the system:** el catálogo tenía un dato que nadie había declarado.
   El género gramatical no se deriva de la terminación —«falange» es femenino
   y «cornete» masculino, los dos en -e— ni del latín, y 94 de los 172 huesos
   con lado se estaban escribiendo mal desde e7.4 sin que ningún gate lo
   viera. `pickDistractors` ya sabía que «el lado no está en el nombre»: lo
   decía en un comentario que citaba una función hoy inexistente.
2. **About the process:** un rojo no es información por ser rojo. El de un
   módulo ausente no evalúa ninguna aserción, y el de un test que se rompe al
   arreglar un defecto puede estar defendiendo el defecto. Los dos pasaron en
   esta historia, y los dos exigieron leer antes de reaccionar.
3. **Capability gained:** una derivación de nombre con gate propio —techo,
   unicidad y prueba de vida— que cualquier vista nueva puede consumir sin
   volver a decidir nada, y un método de medición tipográfica (div oculto,
   `offsetHeight / lineHeight`) que sirve para el próximo texto que tenga que
   caber en un botón.
