# Epic e8: Redesign mockup follow-ups — Brief

## Hypothesis

Para quien usa huesos·mono para estudiar anatomía ósea desde el celular,
la extensión del rediseño mobile-first es una evolución de la interfaz que
entrega navegación más rápida (un único control flotante en vez de cabecera
y pestañas separadas), un catálogo más escaneable (acordeón de dos niveles
en vez de la lista plana de 10 regiones) y una forma de practicar de menor
fricción (opción múltiple, sin necesidad de escribir la respuesta).

A diferencia del estado actual —cabecera sólida separada de las pestañas
(e7.1), lista plana de regiones con filas de pares (e7.4) y test que solo
acepta respuesta escrita—, junta logo, pestañas y menú en una sola fila
flotante, reestructura Fichas en categoría → subgrupo → grilla de
etiquetas, y agrega un formato de opción múltiple como alternativa al
formato escrito existente.

Las tres piezas provienen del mismo mockup importado a mitad de E7
("Rediseño aplicación anatomía ósea", `claude.ai/design`, bajado en
`refs/huesos-mono-ui.html`) y fueron deliberadamente diferidas fuera de esa
épica — ver `records/parking-lot.md`, entradas del 2026-08-17 (candidatas
e7.11, e7.12, e7.13).

## Success metrics

- **Leading:** la primera historia entregada (navbar flotante) pasa la
  pasada de dispositivo real sin regresión frente a las seis vistas que
  e7.9 ya había verificado a mano.
- **Lagging:** las tres piezas completas — navegar, explorar Fichas por
  acordeón y responder un test por opción múltiple — funcionan en un
  recorrido continuo en un celular real, sin regresión en accesibilidad
  (`Tab`, lector de pantalla) ni en el guardrail de rendimiento
  `should-perf-007`.

## Appetite

S — 3 historias (las tres candidatas ya nombradas en el parking lot de E7:
navbar flotante, acordeón de Fichas, test de opción múltiple).

## Scope boundaries

### No-gos

- No tocar la persistencia de progreso ni la selección de repaso dirigido
  (E5) — el formato de opción múltiple es una forma nueva de responder,
  nunca una razón para reabrir cómo se registran aciertos/fallos.
- No editar ADR-010 (arquitectura de pares/pills del navegador de e7.4):
  la historia del acordeón de Fichas la **supersede** con un ADR propio, no
  la modifica.
- No generar los distractores del test de opción múltiple con un modelo o
  heurística no determinista — el banco de opciones incorrectas plausibles
  tiene que ser parte del dominio, testeable como cualquier otra función
  pura del catálogo.
- El pulido visual aparcado al cierre de E7 (cohesión del recorrido
  completo, marcador "▸" faltante en filas de par colapsado) sigue sin
  destino propio en esta épica — es una entrada distinta del parking lot y
  no se resuelve por arrastre.

### Rabbit holes

- Rediseñar la escena 3D o los marcadores de Explorar más allá de mover la
  navegación existente a la fila flotante — el contenido de la vista 3D no
  cambia en esta épica.
- Migrar las 206 fichas al nuevo layout de acordeón de una sola vez antes
  de validar la arquitectura con un subconjunto real — el aprendizaje de
  e7.4/e7.5 sobre pares indistinguibles (`isSideIrrelevant`) tiene que
  releerse antes de diseñar la historia del acordeón, no descubrirse de
  nuevo a mitad de implementación.
- Construir un sistema general de dificultad, temporizado o puntaje para el
  test — el mockup solo pide un toggle Escribir/Opciones, nada más.
