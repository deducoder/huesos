---
name: write-the-adr-when-the-design-names-it-not-at-review
description: "si design.md ya nombra una decisión con alternativas rechazadas, el ADR se escribe ahí — esperar a quality-review lo deja como hallazgo evitable"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T21:00:48.614Z
---

Cuando un `design.md` ya declara explícitamente una decisión con varias
opciones válidas y una elegida por un motivo concreto (el criterio del
método para "cuándo escribir un ADR": varias opciones válidas, adoptar/
rechazar una tecnología, algo de lo que trabajo futuro va a depender), el
ADR correspondiente se escribe en la fase de diseño, no se deja como
comentario en el código a la espera de que `quality-review` lo note al
cerrar la historia.

**Why:** en e9.7, `design.md` ya nombraba con claridad la decisión de
overlay propio (`role="dialog"`) vs. `<dialog>` nativo, con la razón
verificada empíricamente (jsdom 30.0.1 sin `HTMLDialogElement.prototype.
showModal`) y la alternativa rechazada. Cumplía el criterio del método
sin ambigüedad. Aun así, quedó solo como comentario en
`AboutPanel.tsx` hasta que `quality-review`, en la revisión final de la
historia, lo señaló como ausente y se escribió ahí (ADR-016) — con todo
el contexto todavía fresco, pero un paso más tarde de lo necesario.

**How to apply:** al escribir `design.md`, cuando una sección de
"Decisiones" nombra explícitamente una elección con alternativas
rechazadas y una razón concreta, escribir el ADR en el mismo momento
—no delegarlo a la revisión de cierre— y enlazarlo desde el propio
`design.md`. `quality-review` sigue siendo la red de seguridad, no el
primer lugar donde debería aparecer.
