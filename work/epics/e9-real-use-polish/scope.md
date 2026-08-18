# Epic e9: Pulido de uso real — Scope

## Objective

Que un recorrido completo en el teléfono —Explorar → ficha → test de
esqueleto → test de hueso aislado— transcurra sin ninguno de los nueve
roces observados usando la aplicación en la mano, y que la atribución que
la licencia del modelo exige deje de ser un archivo del repositorio para
estar en la interfaz.

**Value:** la aplicación pasa de «funciona» a «se puede usar para estudiar
sin pelearse con ella». Nueve de los roces son de uso; uno es un
incumplimiento de licencia que nadie había visto.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e9.1 | Selection colour that actually stands out | S | Elegir el color de selección viéndolo a la vez en la píldora del navegador, el panel de identidad y el resaltado 3D |
| e9.2 | The test result points at the right answer | M | Tras responder, las opciones se quedan: la elegida en rojo si erró, la correcta en verde, y «Responder» pasa a «Siguiente pregunta» |
| e9.3 | The isolated bone fits and turns | M | El hueso aislado entra entero en el lienzo —ancho incluido, y sin quedar detrás de la tarjeta— y se puede girar con el dedo |
| e9.4 | The skeleton test zooms to what it asks | M | En el test de esqueleto completo la cámara se acerca a la zona del hueso señalado |
| e9.5 | Short names that stay distinguishable | L | Nombre corto y capitalizado en grid, test y título; el completo intacto en el catálogo, en la ficha y en el nombre accesible (ADR-014) |
| e9.6 | The system back button walks the app | M | El «atrás» del teléfono vuelve a la vista anterior en vez de salir del sitio (ADR-013) |
| e9.7 | Homogeneous header, and a menu that opens | M | La cabecera de la ficha se redondea como el resto de las cajas, y el hamburguesa deja de ser decorativo: abre privacidad y créditos del modelo |

Sin ciclos: ninguna historia depende de otra para existir. Dos órdenes
convienen sin bloquear — e9.1 antes de e9.2, para no elegir dos veces
sobre `@theme`; e9.2 antes de e9.5, para no reescribir las mismas pruebas
de `TestQuestion` en dos historias.

## In scope

- **MUST:** los nueve puntos observados, repartidos en las siete historias
  de arriba.
- **MUST:** la atribución del modelo (CC BY-SA 4.0, con la fórmula literal
  que BodyParts3D exige) alcanzable desde la interfaz, junto al aviso de
  privacidad — hoy `src/data/ATTRIBUTION.md` no lo importa nadie.
- **MUST:** un gate que impida que el acortado de nombres colapse dos
  huesos de la misma región en la misma etiqueta (ADR-014).
- **SHOULD:** hacer requeridas `onViewDetail` y `onCambiarModo`, las props
  opcionales que todos los llamadores ya pasan. El parking lot dejó ese
  trabajo con disparador explícito —«la próxima historia que entre a
  `src/features/test/`»— y e9.2 lo cumple.
- **SHOULD:** la advertencia de exactitud que los autores del modelo
  declaran, en el mismo panel que los créditos.

## Out of scope

- **Los 14 literales hexadecimales que viven fuera de `@theme`, y el gate
  que vigila la paleta de Tailwind en vez de la regla de ADR-007** — e9.1
  cambia el valor de un token, no el sistema. Sigue aparcado para una
  épica de consolidación visual — **not now**.
- **La tipografía display** — exige un ADR que supersede a ADR-008 y no es
  ninguno de los nueve puntos. Sigue abierta desde el cierre de E8.
- **Animar la transición de cámara de e9.4 y el salto de alto de la
  tarjeta** — rabbit hole declarado en el brief, con disparador propio
  desde E7 y coste en el mismo teléfono que `should-perf-007` vigila.
- **Enlaces profundos, URLs por hueso y recarga que conserve la vista** —
  ADR-013 decide que el historial transporta estado, no direcciones.
- **Bloquear la orientación vertical** — aparcado con dueño en e7.9 y sin
  salida gratuita en la web.
- **El `count` de `pickDistractors` sin ejercitar** — su disparador era
  necesitar un valor distinto de 2, y ninguna historia de E9 lo necesita.
- **Búsqueda y filtros, y mostrar el progreso al estudiante** — dos épicas
  propias ya aparcadas, ninguna de ellas entre los nueve puntos.

## Done when

- Un recorrido completo en un teléfono real —Explorar, abrir una ficha,
  ambas variantes de test— sin que aparezca ninguno de los nueve roces.
- El «atrás» del sistema vuelve de la ficha a su origen y de una variante
  de test a la elección de variante, sin abandonar el sitio.
- Ningún nombre visible pasa del techo que e9.5 declare, y las 28 falanges
  de la mano siguen teniendo 28 etiquetas distintas entre sí — afirmado por
  un gate, no por conteo a mano.
- El hueso más ancho del catálogo y el más chico entran enteros en el
  lienzo de la ficha, sin quedar detrás de la tarjeta.
- La atribución literal de BodyParts3D y la licencia CC BY-SA 4.0 se
  pueden leer desde la interfaz sin abrir el repositorio.
- Todas las historias cerradas · `docs.md` publicado · retrospectiva hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| e9.5 toca los 206 huesos y roza el nombre accesible, del que dependen los localizadores de Playwright | H | M | ADR-014 fija que el `aria-label` conserva el nombre del catálogo; aun así, un grep de `e2e/` es tarea nombrada de la historia, no un tropiezo — es exactamente lo que costó el cambio de formato por defecto en E8 |
| e9.3 da verde con un fixture cómodo y el bug sigue en pie | M | H | El criterio nombra el hueso más **ancho** y el más chico del catálogo, no un ejemplo elegido por comodidad: la causa es el aspect ratio del lienzo, y un fémur —alto y estrecho— no la expone |
| e9.6 no es observable en la suite unitaria: `popstate` en jsdom no reproduce el gesto del teléfono | H | M | La verificación real es `page.goBack()` en Playwright más la comprobación a mano en el dispositivo; la historia declara ambas y no da por probado lo que solo pasó en jsdom |
