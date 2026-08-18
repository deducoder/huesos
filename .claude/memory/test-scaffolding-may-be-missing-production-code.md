---
name: test-scaffolding-may-be-missing-production-code
description: "Antes de escribir andamiaje para aislar estado global entre tests, preguntar si el código de producción debería estar sembrando ese estado."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T05:53:48.136Z
---

Cuando un test necesita andamiaje para aislar estado global compartido,
mirar primero si la aplicación debería estar inicializando ese estado por
su cuenta.

**Why:** en e9.6 jsdom compartía `window.history` entre los casos de
`App.test.tsx`, y el arreglo obvio era un `beforeEach` que vaciara la pila.
La salida real fue que `App` sembrara su entrada de arranque con
`history.replaceState(modoInicial(), '')` — que además corregía un caso de
producción: sin ello, retroceder hasta la primera entrada llega al
`popstate` con `state: null` y cae al respaldo en vez de restituir la vista
inicial explícitamente. El andamiaje habría tapado el defecto.

**How to apply:** ante «necesito limpiar X entre tests», preguntar «¿quién
debería estar poniendo X en un valor conocido al arrancar?». Si la
respuesta es la aplicación, es un defecto, no una necesidad de prueba.
Relacionado con [[a-check-needs-a-check-that-it-looked]].
