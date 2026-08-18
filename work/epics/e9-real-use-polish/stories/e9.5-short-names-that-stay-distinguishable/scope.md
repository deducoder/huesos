# Story e9.5: Short names that stay distinguishable — Scope

## User story

As a quien estudia huesos en la pantalla de un teléfono,
I want leer en cada botón un nombre corto, bien escrito y distinto del de
sus vecinos,
so that pueda reconocer de un vistazo qué hueso es sin descifrar tres líneas
recortadas ni dudar entre dos etiquetas iguales.

## Acceptance criteria

```gherkin
Given que abro la grilla de Fichas del miembro superior en un teléfono
When miro los botones de las falanges
Then cada uno cabe en su botón sin envolver a tres líneas
And ninguno repite el texto de otro botón de la misma región

Given que abro la grilla de Fichas de cualquier región
When miro un botón de hueso
Then su texto empieza en mayúscula

Given que abro la ficha completa de un hueso
When leo el título
Then dice el nombre corto y capitalizado
And el nombre completo del catálogo sigue estando en la ficha

Given que respondo una pregunta de opción múltiple
When miro las tres opciones
Then las tres son distinguibles entre sí, aunque sean de la misma región

Given un hueso par de nombre femenino — la clavícula derecha
When leo su botón, su ficha o su panel de identidad
Then el lado concuerda en género: dice «derecha», no «derecho»

Given que uso un lector de pantalla sobre cualquier botón de hueso
When lo enfoco
Then oye el nombre completo del catálogo, sin acortar
And oye el lado concordado en género

Given los 206 huesos del catálogo
When se deriva el nombre corto de cada uno
Then ninguno pasa del techo de longitud que esta historia declara
And dos huesos distintos nunca producen el mismo nombre corto
And la comprobación falla si la derivación deja de aplicarse
```

## Example

Medido sobre el catálogo real (`src/data/catalog.ts`, 206 huesos,
120 nombres únicos):

| Familia | Cuántos nombres únicos | El más largo | Chars |
|---------|----------------------:|--------------|------:|
| Falanges | 28 | falange proximal del segundo dedo de la mano | **44** |
| Vértebras | 24 | duodécima vértebra torácica | 27 |
| Metacarpianos / metatarsianos | 10 | segundo metatarsiano | 20 |
| Resto | 58 | cornete nasal inferior | 22 |

28 nombres pasan de 30 caracteres y **los 28 son falanges**. El acortado
obvio —quitar el dedo— colapsa las 28 falanges de la mano en 3 etiquetas
(«falange distal de la mano» ×5), y como `pickDistractors` elige de la misma
región, el test podría mostrar tres botones idénticos. Ese es el colapso que
el gate tiene que impedir (ADR-014).

El género del lado, medido sobre los mismos datos:

| Nombres únicos con lado | Femeninos | Masculinos |
|------------------------:|----------:|-----------:|
| 86 | **47** | 39 |

`SIDE_LABEL` es masculino fijo, así que 94 de los 172 huesos con lado dicen
hoy «clavícula derecho», «escápula derecho», «tibia derecho», «tercera
costilla derecho». **La terminación no basta para derivar el género:**
«falange» acaba en -e y es femenino, «cornete» acaba en -e y es masculino.
De dónde sale el género es decisión del diseño de esta historia.

## In scope

- **La derivación del nombre corto**, en la capa de vista, a partir del `es`
  del catálogo (ADR-014, opción B). El catálogo no se toca.
- **La capitalización inicial** allí donde el nombre encabeza un botón o un
  título, y los dos subgrupos que `subLabel` devuelve hoy en minúscula
  (`neurocráneo` y `cara`).
- **La concordancia de género del lado**, en el texto visible **y** en el
  nombre accesible — hoy un lector de pantalla también pronuncia «clavícula
  derecho» (parking lot, 2026-08-18).
- **El texto visible de todos los consumidores del nombre**: la grilla de
  Fichas, las filas del navegador de Explorar (incluidas las pareadas, cuyo
  nombre común sale de `toNavigatorRows`), el panel de identidad, el título
  de la ficha y las opciones del test.
- **El nombre accesible conserva el nombre completo del catálogo**, sin
  acortar ni capitalizar (ADR-014).
- **El gate sobre los 206 huesos**: techo de longitud, unicidad, y la
  afirmación de que la derivación se aplicó — un instrumento roto no puede
  dar verde.
- **Un grep de `e2e/`** como tarea nombrada: `mobile-shell.spec.ts:191`
  localiza por texto visible (`getByText('falange proximal del segundo dedo
  de la mano')`) y esta historia se lo cambia debajo.
- **El techo de longitud y la forma tipográfica del ordinal se fijan viendo
  la muestra renderizada**, no eligiéndolos en abstracto (ADR-014).

## Out of scope

- **Cambiar el `es`, los `synonyms` o el `la` del catálogo** — ADR-014 (C)
  rechazada: `isCorrectAnswer` y la validación tolerante de `RF-06` siguen
  operando sobre el nombre completo.
- **El estado posterior a la respuesta del test** (opciones calificadas en
  rojo y verde, «Siguiente pregunta») — es e9.2. Esta historia solo cambia
  el **texto** de las tres opciones.
- **Hacer requeridas `onViewDetail` y `onCambiarModo`** — el parking lot le
  puso disparador explícito a e9.2, la historia que entra a
  `src/features/test/` a cambiar comportamiento.
- **Unificar las dos copias de `accessibleName`** (`BoneNavigator.tsx:7` y
  `FichasAccordion.tsx:17`) — ADR-011 decidió la duplicación a propósito;
  revertirla necesita su propio ADR, no una historia de nombres.
- **La tipografía display** — aparcada desde el cierre de E8, exige un ADR
  que supersede a ADR-008.
- **Una tercera forma del nombre** más allá de la visible y la accesible —
  ADR-014 la declara fuera sin volver a él.
- **Búsqueda por nombre y filtros** — épica propia, ya aparcada.

## Done when

- En un teléfono real, ningún nombre de hueso visible envuelve a tres líneas
  ni queda recortado, en ninguna de las cinco vistas que lo muestran.
- Las 28 falanges de la mano siguen teniendo 28 etiquetas distintas entre
  sí — afirmado por un gate sobre el catálogo real, no por conteo a mano.
- Ningún hueso par muestra ni pronuncia el lado en el género equivocado.
- Un lector de pantalla sigue oyendo el nombre completo del catálogo.
- La suite de Playwright pasa entera, con sus localizadores actualizados
  donde leían texto visible.
- `./scripts/check` y `./scripts/check-integration` en verde.
- Comprobado a mano: el recorrido Explorar → ficha → test, mirando las
  etiquetas más largas del catálogo, no un ejemplo cómodo.

## Notes

- **ADR-014 ya está escrito** y fija lo esencial: derivación de vista, gate
  de unicidad, `aria-label` con el nombre completo. Lo que queda para el
  diseño de la historia es la tabla de ordinales, el techo, y de dónde sale
  el género del lado.
- **El género no lo aporta el lado, lo aporta el hueso.** Las dos vías
  posibles —una marca en el catálogo o una regla sobre el nombre— son
  decisión del diseño; la regla por terminación ya se sabe insuficiente
  («falange» contra «cornete»).
- **El riesgo declarado en el plan de la épica** es la superficie de rotura:
  206 huesos, cinco componentes y los localizadores de la suite. El plan la
  puso tercera por eso, aceptando el solapamiento con e9.2.
- **`toNavigatorRows` resuelve el nombre común de las filas pareadas**
  (`navigator-rows.ts:51`, `fila.name = hueso.es`). Si el acortado no pasa
  por ahí, las filas pareadas quedan largas mientras las simples se acortan.
- **La verificación manual de E9 no es opcional**: e9.3 se cerró gracias a
  un bug que la suite no podía ver. Esta historia es texto visible, así que
  el navegador de escritorio alcanza para casi todo, pero el techo de
  longitud solo se juzga en el ancho real del teléfono.
