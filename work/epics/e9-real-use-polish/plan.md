# Epic e9: Pulido de uso real — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e9.6 | skeleton + risk-first | — | El patrón de verificación de toda la épica: Playwright `goBack()` más el teléfono. Concentra la navegación en un punto, que es lo que abarata e9.7 |
| 2 | e9.3 | risk-first | — | `distanceToFit` con aspect ratio y zona útil, que e9.4 hereda |
| 3 | e9.5 | risk-first | — | Los nombres cortos que e9.2 y e9.7 ya encuentran hechos |
| 4 | e9.1 | quick-win | — | El token de selección que e9.2 consume |
| 5 | e9.2 | dependency | e9.1 (blanda) | Cierra la deuda aparcada de props opcionales al entrar a `src/features/test/` |
| 6 | e9.4 | dependency | e9.3 (blanda) | — |
| 7 | e9.7 | dependency | e9.6 (blanda) | Cierra el hueco de licencia |

**Rationale:** riesgo primero, con una sola concesión declarada.

**e9.6 abre** aunque no sea la más grande: es la única que introduce un
mecanismo que el proyecto no tiene —la History API— y la única cuyo verde
puede mentir, porque `popstate` en jsdom no reproduce el gesto de un
teléfono. Si el `Modo` no viaja bien en el `state` de una entrada, quiero
saberlo con seis historias por delante y no con ninguna. De paso establece
cómo se verifica todo lo demás en esta épica: la suite unitaria no alcanza,
y conviene descubrirlo en la primera y no en la sexta.

**e9.3 segunda** por el riesgo de verde falso. Su causa es el aspect ratio
del lienzo, y el hueso con el que uno instintivamente prueba —el fémur,
alto y estrecho— es exactamente el que **no** la expone. Es el mismo error
que ya costó una historia: el ejemplo cómodo no atrapa el bug.

**e9.5 tercera pese a ser la L**, y aquí está la concesión: la dependencia
blanda con e9.2 —no reescribir las pruebas de `TestQuestion` dos veces—
diría que fuera después. Va antes porque tiene la mayor superficie de
rotura de la épica (206 huesos, cuatro componentes, los localizadores de la
suite) y descubrir su fricción tarde no deja margen. **El coste real es
menor de lo que aparenta:** ADR-014 mantiene el `aria-label` con el nombre
completo, así que ningún localizador por rol cambia y el solapamiento con
e9.2 se reduce al texto visible de tres botones.

**e9.1 cuarta** como quick win después de tres historias densas, y porque
define el token que e9.2 consume: elegir el color de selección y los de
acierto/error en la misma pasada evita abrir `@theme` dos veces.

**e9.4 sexta** porque hereda de e9.3 una `distanceToFit` más estricta.
Invertirlas obligaría a tocar `framing.ts` dos veces y a resolver el mismo
problema de encuadre con la firma vieja.

**e9.7 última** porque vuelve sobre el `App.tsx` que e9.6 reorganiza, y
porque es la de menor incertidumbre — un panel de contenido fijo. Ser la
última no la hace menor: es la que cierra el incumplimiento de licencia.

## Milestones

- [ ] **Walking skeleton** — e9.6 — el «atrás» del teléfono vuelve de una
      ficha a su origen sin abandonar el sitio, verificado con
      `page.goBack()` en Playwright **y** a mano en el dispositivo. Demo:
      abrir el fémur desde Fichas y volver con el gesto del sistema.
- [ ] **Core MVP** — e9.6, e9.3, e9.5, e9.1 (4/7) — los tres roces más
      graves resueltos. Demo: recorrido en el teléfono con nombres cortos
      y distinguibles, el coxal entrando entero en el lienzo y girando con
      el dedo, y el «atrás» recorriendo la aplicación.
- [ ] **E2E integration checkpoint** — tras e9.4, antes de e9.7 —
      `./scripts/check-integration` completo con servidor recién
      construido, más un recorrido manual en el teléfono. No es ceremonia:
      e9.6 y e9.3 producen comportamiento que **ninguna prueba unitaria
      observa**, y e9.5 cruza cuatro componentes que ninguna historia toca
      a la vez. Las costuras entre historias solo aparecen acá.
- [ ] **Feature complete** — e9.2, e9.4 (6/7) — los nueve puntos salvo el
      menú.
- [ ] **Epic complete** — e9.7 más los criterios de `scope.md`:
      atribución legible desde la interfaz, gate de unicidad en verde,
      `docs.md` publicado y retrospectiva hecha.

## Parallel streams

Trabajo solo: el paralelismo es teórico, pero marca dónde el orden **no**
importa si algo se atasca. Sin dependencia mutua ni archivos compartidos:

- e9.3 / e9.4 (escenas) contra e9.1 / e9.2 (`@theme` y test).
- e9.5 (nombres y etiquetas) contra e9.6 / e9.7 (`App.tsx` y cabecera).

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e9.6 | done | M | M — 4 tareas planeadas, 6 commits de código y prueba |
| e9.3 | done | M | M + un rediseño a mitad de T4: el punto de órbita, encontrado en el teléfono |
| e9.5 | done | L | L — 9 tareas, 11 commits; el riesgo declarado (T4) salió con una línea y el que dolió fue un test que exigía el defecto |
| e9.1 | todo | S | — |
| e9.2 | todo | M | — |
| e9.4 | todo | M | — |
| e9.7 | todo | M | — |

## Sequencing risks

- **e9.6 abre reorganizando `App.tsx`, y e9.7 vuelve sobre él al final** →
  ADR-013 exige que las transiciones de modo pasen por un único punto. Ese
  punto es también lo que hace barato el cambio de e9.7: la cabecera y el
  menú se cuelgan de una navegación ya concentrada, no de seis `setModo`
  sueltos.
- **e9.3 y e9.4 comparten `framing.ts` con dos historias de por medio, y el
  contexto se enfría** → e9.3 deja escrito en su `progress.md` el contrato
  de la firma nueva, y endurecerla hace que el compilador nombre al
  llamador pendiente. Es el caso donde una firma más estricta avisa y una
  más laxa no.
- **e9.5 tercera puede obligar a tocar `TestQuestion.test.tsx` dos veces**
  → asumido y acotado por ADR-014: los localizadores por rol leen el
  `aria-label`, que no cambia. Si al llegar a e9.2 resulta que sí hubo que
  reescribir pruebas, es material de retrospectiva sobre esta decisión de
  orden, no un imprevisto.
- **El checkpoint E2E puede medir un build viejo** → `reuseExistingServer`
  reutiliza cualquier servidor vivo en el puerto e ignora el `build`. Antes
  de correrlo, comprobar que no quedan procesos escuchando en 4173-4175.
  Ya dio un rojo falso una vez, y el caso peligroso es el verde falso.
