---
name: content-only-changes-can-skip-story-ceremony
description: "un párrafo de copy sobre un componente ya revisado se puede commitear directo, sin scope/design/plan nuevos"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T22:40:31.219Z
---

Una adición de contenido puntual (texto, copy, un párrafo) sobre un
componente que ya pasó por su propia historia y su propia revisión no
necesita abrir `scope.md`/`design.md`/`plan.md` nuevos — alcanza con
TDD directo (RED con la aserción del texto nuevo, GREEN, mutación
forzada, gate) y un commit directo a `main`, con mensaje que describe el
cambio de contenido, no un contenedor de historia.

**Why:** en huesos-mono, agregar un descargo de responsabilidad a
`AboutPanel` (que e9.7 ya construyó, probó y cerró) se hizo así, sin
volver a abrir la historia ni crear una nueva — el componente, sus
pruebas y su revisión de arquitectura ya existían; lo único nuevo era un
párrafo de texto con su propia aserción. Abrir el ciclo completo de
historia para un párrafo habría sido desproporcionado, mismo criterio
que ya aplicó e9.1 al arreglar un bug ajeno de una línea directo en
`main` (ver [[git-checkout-is-not-a-safe-revert-of-uncommitted-work]]
para un ejemplo distinto de la misma disciplina: TDD siempre, ceremonia
de historia solo cuando el tamaño del cambio la justifica).

**How to apply:** el criterio no es "¿toca código de producción?" —
siempre lo hace, y el TDD sigue siendo no negociable. El criterio es
"¿el componente que se toca ya tiene su propia historia cerrada y
revisada, y el cambio es contenido/copy sin superficie nueva?". Si la
respuesta a ambas es sí, commit directo con TDD basta. Si el cambio
introduce un mecanismo nuevo, un componente nuevo, o cruza varios
archivos con lógica real, sigue mereciendo su propia historia.
