---
name: pure-domain-layers-pay-off-later
description: Una capa de dominio bien cortada (sin React ni three.js) se reutiliza en historias que nadie planeó cuando se escribió, no solo se prueba más fácil.
metadata:
  type: capability
---

ADR-002 (E2) separó "qué hueso corresponde a esta malla" (`boneIdForMesh`,
en `domain/mesh-lookup.ts`) de cómo se usa esa respuesta — resaltar por
material en `SkeletonScene`. La épica e3, escrita en una sesión posterior,
reutilizó exactamente esa misma función para decidir qué malla **ocultar**
en `IsolatedBoneScene` (`domain/isolation.ts`, una envoltura de una línea).
Cero reimplementación de la resolución malla→hueso.

**Por qué importa:** el motivo original para separar dominio de vista en
ADR-002 fue la testeabilidad (jsdom no tiene WebGL). El beneficio que pagó
más, una épica después, fue la reutilización — un motivo que nadie había
puesto en la decisión original.

**How to apply:** al diseñar una capa de dominio, no juzgarla solo por "¿se
puede testear sin navegador/DOM?" sino por "¿esta pregunta se va a volver a
hacer, con una respuesta distinta encima?". Si la respuesta es sí (como
"¿qué hueso es esta malla?" claramente lo era — resaltar, ocultar, y
probablemente más adelante: preguntar por su nombre en el modo test), vale
la pena que la función pura no sepa nada de cómo se usa su resultado.

Relacionado: [[untestable-layers-go-last]], [[epic-design-is-a-hypothesis]].
