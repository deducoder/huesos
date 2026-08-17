# Epic E7: Mobile-first redesign — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e7.1 Tokens y shell | dependency + skeleton | — | todo lo demás: sin `@theme` no hay aspecto que aplicar |
| 2 | e7.2 El lienzo en pantalla chica | risk-first | e7.1 | e7.6, e7.7, e7.8 — y cierra el riesgo más caro |
| 3 | e7.3 Tipografía empaquetada | dependency (blanda) | e7.1 | e7.4, e7.5, e7.7, e7.8 sin reajuste posterior |
| 4 | e7.4 Navegador de huesos en móvil | risk-first | e7.1, e7.3 | e7.6 |
| 5 | e7.5 Panel de identidad | quick win | e7.1, e7.3 | e7.6, e7.7 |
| 6 | e7.6 Vista Explorar en móvil | dependency | e7.2, e7.4, e7.5 | e7.9, e7.10 |
| 7 | e7.7 Ficha del hueso | dependency | e7.2, e7.5 | e7.9 |
| 8 | e7.8 Modo test | dependency | e7.2, e7.3 | e7.9 |
| 9 | e7.9 Escritorio como ampliación | dependency | e7.6, e7.7, e7.8 | e7.10 |
| 10 | e7.10 Medir `should-perf-007` | dependency | e7.9 | el cierre de la épica |

**Rationale**

**e7.1 va primera por bloqueo duro, no por riesgo.** Es la única historia sin la
que ninguna otra puede empezar: los tokens son la fuente del aspecto (ADR-007) y
todo lo demás los consume.

**e7.2 va segunda porque es el riesgo más caro de la épica.** Si el esqueleto
beige no se lee sobre fondo claro y la única salida fuese tocar el material del
activo, chocaríamos con un no-go del brief y habría que replantear la dirección.
Es exactamente la clase de cosa que se quiere saber en la posición 2 y no en la
9. Junto con e7.1 forma el **walking skeleton**: el camino mínimo que prueba lo
que de verdad está por ver — que una dirección visual clara funciona con un
canvas WebGL dentro.

**e7.3 se adelanta por trabajo repetido, no por riesgo.** Su riesgo (peso en el
arranque) es medio y tiene salida barata: volver a `system-ui` está a un token
de distancia. Pero cambiar la familia tipográfica **después** de ajustar
navegador, identidad, ficha y test obligaría a reajustar métricas de texto en
todos: otro ancho de carácter descoloca lo ya cuadrado. El shell de e7.1 tiene
poco texto, así que ese es el único reajuste que se paga por ponerla tercera y
no primera.

**e7.4 va cuarta, antes que las vistas que la montan.** Es la única `L` y lleva
la decisión de arquitectura de información con más incertidumbre: el tratamiento
de tarjeta con borde y sombra no escala a 206 elementos. Si su forma resulta
distinta de lo previsto, e7.6 aún no se ha escrito.

**e7.5 es el quick win** que completa las tres piezas de la vista Explorar, y de
paso deja lista la mitad de la ficha.

**De e7.6 en adelante manda la dependencia**, no el riesgo: son integraciones de
piezas ya probadas. e7.9 va penúltima porque el escritorio es la ampliación —
hacerlo antes sería volver a la lógica que causó el problema. e7.10 va última
porque mide el producto terminado, no una versión intermedia.

## Milestones

- [ ] **Walking skeleton** — e7.1, e7.2 — en 390×844, el lienzo ocupa una
      porción útil de la pantalla en vez de sus 150 px intrínsecos, el shell
      consume tokens de `@theme`, y ningún objetivo del shell queda bajo
      44×44 px. Demo: la aplicación abierta en un teléfono real, con el
      esqueleto legible sobre el fondo nuevo.
- [ ] **Core MVP** — +e7.3, e7.4, e7.5, e7.6 — la vista Explorar completa y
      usable con el pulgar: los 206 huesos alcanzables, el hueso elegido
      identificado, la escena manejable. Demo: recorrer y seleccionar cinco
      huesos de regiones distintas en dispositivo real, sin pinzar para ampliar.
- [ ] **Feature complete** — +e7.7, e7.8, e7.9 — las seis vistas bajo ADR-007 y
      el escritorio ampliado desde el móvil. Demo: el recorrido entero
      —explorar → ficha → test— en teléfono y en escritorio.
- [ ] **Integración en dispositivo** — antes de e7.10 — la suite de navegador
      corriendo en viewport móvil sobre las seis vistas, más una pasada humana
      en hardware real. No es un epic multicomponente —hay un solo cliente— pero
      la costura que ninguna prueba unitaria ve es la de **las vistas entre sí
      en un mismo dispositivo**: volver de la ficha, cambiar de pestaña, girar
      la pantalla.
- [ ] **Epic complete** — +e7.10 — criterios de `scope.md` cumplidos, incluida
      la medición de `should-perf-007` o su marcado explícito como no
      verificado con la razón.

## Parallel streams

Ninguno que aproveche de verdad: es trabajo de una sola persona y el paralelismo
real sería concurrencia de contexto, no de manos.

Dicho eso, tres pares no tienen dependencia mutua y podrían reordenarse entre sí
sin romper nada, si algo se atasca: **e7.4 ↔ e7.5**, **e7.7 ↔ e7.8**, y **e7.3 ↔
e7.2** —esta última solo si se acepta el reajuste de texto que el orden actual
evita—.

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e7.1 | done | M | M |
| e7.2 | done | M | M |
| e7.3 | done | S | S |
| e7.4 | todo | L | — |
| e7.5 | todo | S | — |
| e7.6 | todo | M | — |
| e7.7 | todo | S | — |
| e7.8 | todo | M | — |
| e7.9 | todo | M | — |
| e7.10 | todo | S | — |

## Sequencing risks

- **e7.2 descubre que el activo tendría que cambiar, y eso es un no-go** →
  mitigado por la posición: se sabe en la segunda historia, con nueve por
  delante para reaccionar. La salida reversible —lienzo sobre superficie oscura
  con borde, dentro del tema claro— se prueba antes que cualquier otra.
- **e7.4 desborda su tamaño `L`** → su ADR decide la forma *antes* de
  implementarla. Si aun así desborda, e7.6 puede montar el navegador actual con
  los tokens nuevos y poco más: la vista queda coherente aunque el recorrido de
  206 no mejore, y la mejora vuelve como historia propia.
- **La verificación humana en dispositivo es el cuello de botella y no depende
  de mí** → se concentra en los hitos, no en cada historia. Las dos excepciones
  son e7.2 y e7.4, donde una decisión equivocada se propaga a todo lo que viene
  después y hay que verla en una mano antes de seguir.
- **El orden es una hipótesis.** Si el gemba de una historia contradice esta
  secuencia, manda el gemba: ya pasó en b2.3, donde el plan decidió medir cajas
  y el activo resultó declarar la partición por sí mismo.
