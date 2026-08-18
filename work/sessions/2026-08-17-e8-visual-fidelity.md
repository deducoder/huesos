# Session 2026-08-17 — E8 close + iteración informal de fidelidad visual

## Done

- **E8 completa**: las 4 historias (`e8.3` distractores plausibles, `e8.4`
  opción múltiple, `e8.2` acordeón de Fichas, `e8.1` navbar fusionada)
  diseñadas, implementadas, revisadas y mergeadas a `main` con el ciclo
  completo (gemba, TDD, `quality-review`, `architecture-review`). Cada
  historia dejó al menos un hallazgo real verificado con navegador real, y
  6 aprendizajes nuevos en memoria (jsdom vs navegador real en dos formas
  distintas, límite dominio/vista, elegir fixtures que estresen la regla).
  Nada de esto se pusheó a remoto todavía.
- **Historia informal `e8.5` abierta** (`story/e8.5/visual-fidelity`, sin
  `main` mergeado) a pedido explícito del usuario: comparó capturas reales
  contra el mockup (`refs/*.png`) y encontró que la fidelidad visual de E8
  era mucho menor de lo que el texto de los `scope.md` transmitía — colores,
  tipografía y estructura de la navbar no coincidían con
  `refs/huesos-mono-ui.html`.
- Iterando en vivo con el usuario (capturas propias + las suyas): navbar
  reconstruida como píldora + logo + menú con color por pestaña, paleta de
  `REGION_ACCENT` (5 valores literales del mockup + 4 extrapolados)
  aplicada a la tarjeta de identidad y al acordeón de Fichas, fondo del
  lienzo 3D cambiado a `#20242b` (valor real del mockup), pantalla de test
  con tarjeta de respuesta flotante y botón "← cambiar modo".
- 12 commits informales en la rama, cada uno con `./scripts/check` en
  verde. Sin la ceremonia completa de TDD por tarea — decisión explícita
  del usuario para esta historia en particular.

## Decided

- **La navbar NO se flota (`position: absolute`) sobre el contenido** —
  **por qué:** rompía el raycasting de clics del lienzo 3D. Aislado con
  certeza: el mismo diagnóstico (grilla de 12x12 clics) alcanza 8 huesos
  distintos en `main` y solo 1 en la versión con header flotante: revertido
  a flujo normal del documento, con margen simétrico arriba/abajo en vez de
  `position: absolute`. Ningún test unitario lo hubiera visto — solo
  apareció corriendo la suite de integración completa contra el navegador
  real.
- **La tarjeta de identidad (Explorar) usa alto dinámico, no fijo** — se
  probó un alto fijo calibrado al caso real más alto (412px, hioides) y el
  usuario lo encontró "extremadamente alto" para los casos cortos.
  Revertido a alto dinámico; animar la transición de alto entre huesos
  queda para otra sesión, a propósito.
- **El botón de menú (☰) sigue sin función** — visual únicamente, ya
  documentado en `e8.1` como decisión: no hay destino real todavía.
- **El toggle "Escribir/Opciones" del mockup no se construye** — la app ya
  había decidido en `e8.4`/ADR-012 que opción múltiple es el único formato
  alcanzable; el mockup de test se usó solo para el estilo de las 3
  opciones y el botón Responder, no para reconstruir el toggle.

## Open

- **La fidelidad visual de `e8.5` no está cerrada** — el usuario sigue
  mirando en vivo y corrigiendo detalle a detalle (última corrección: la
  tarjeta de respuesta del test y el botón "cambiar modo"). No hay una
  lista fija de qué falta; se sigue a demanda.
- ¿`e8.5` cierra como una historia formal de E8 (retrospectiva, merge) o
  quisa la rama sigue abierta varias sesiones más antes de mergear? Sin
  decidir — el usuario pidió explícitamente saltar la ceremonia formal
  para esta historia, así que el cierre también podría ser informal.
- Push a remoto de todo lo acumulado (E8 completa + lo que salga de
  `e8.5`) — sin decidir, ninguna sesión de esta racha lo pidió.

## Next

Retomar `e8.5` en vivo con el usuario (rama `story/e8.5/visual-fidelity`,
sin mergear) — no hay una tarea siguiente fija, se sigue mirando la
aplicación corriendo y corrigiendo lo que no coincida con
`refs/mock-*.png`, sin capturas ni suites de test propias salvo que el
usuario las pida.

## State

Branch `story/e8.5/visual-fidelity` · work item en curso: `e8.5` (informal,
sin cerrar) · tree: clean
