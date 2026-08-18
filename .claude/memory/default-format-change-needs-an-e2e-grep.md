---
name: default-format-change-needs-an-e2e-grep
description: "Cambiar el DOM por defecto de un componente muy reutilizado (huesos-mono, e8.4) tiene radio de impacto en la suite e2e que ./scripts/check no ve — nombrar \"grep e2e/ por el DOM viejo\" como tarea del plan, no confiar en que aparezca solo en la verificación manual."
metadata: 
  node_type: memory
  type: process
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T02:04:29.298Z
---

e8.4 cambió el formato de respuesta por defecto de `TestQuestion` (texto
libre → opción múltiple). `./scripts/check` (vitest, rápido) quedó verde
sin tocar nada más — pero dos specs de Playwright (`e2e/mobile-shell.spec.ts`,
`e2e/desktop-scale-up.spec.ts`) dependían del `<form>`/`getByPlaceholder`
del formato viejo y rompieron en silencio, porque `./scripts/check-integration`
no corre por tarea, solo al pushear.

**Por qué importa:** un cambio de contrato en un componente compartido
(montado por varias vistas reales) tiene un radio de impacto que la
suite rápida no cubre por diseño — no es un descuido del gate, es su
alcance declarado. Si nadie mira `e2e/` a propósito, el hallazgo llega
recién en `gemba:integrate`, sin el contexto de la historia que lo causó.

**How to apply:** al planear una historia que cambia el DOM/contrato por
defecto de un componente reutilizado, agregar como tarea explícita
`grep -rl "<selector viejo>" e2e/` (o el directorio de e2e del proyecto)
antes de dar la historia por terminada — no confiar en que la
verificación manual lo encuentre por casualidad.
