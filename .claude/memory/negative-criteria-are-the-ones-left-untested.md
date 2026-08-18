---
name: negative-criteria-are-the-ones-left-untested
description: "Los criterios de \"no debe\" y los caminos de salida se quedan sin prueba porque las tareas se cortan por mecanismo, no por criterio."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T05:53:59.344Z
---

Antes de declarar hecha una tarea, enumerar los escenarios del `scope.md`
contra los tests que existen. Los que faltan son casi siempre los
negativos.

**Why:** en e9.6 llegaron dos criterios al final sin red — el retorno al
segundo origen posible («desde Fichas · atrás · Fichas») y el MUST NOT
«no se secuestra la primera entrada». Ninguno era oscuro. El plan cortó las
tareas por mecanismo (empujar, retroceder, probar en navegador), así que
cada test cubrió lo que su tarea necesitaba demostrar, y lo prometido en el
scope quedó fuera. Un MUST NOT nunca aparece por el camino feliz: el resto
de las pruebas mira que la función *funcione*, nunca que siga sin hacer lo
que no debe.

**How to apply:** al cerrar cada tarea, leer la lista de escenarios del
scope y marcar cuál cubre cada test. Un criterio sin marca es una brecha,
aunque el gate esté verde. Ver también
[[a-reintroduced-defect-must-actually-break]].
