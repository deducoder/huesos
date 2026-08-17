---
name: a-reintroduced-defect-must-actually-break
description: Demostrar que una prueba atrapa un bug exige comprobar que la reintroducción rompe algo de verdad — un rojo no prueba nada si el andamiaje ya estaba roto, y un verde no prueba nada si el cambio fue un no-op.
metadata:
  type: process
---

En s1, la tarea "demostrar que la suite atrapa b2.1 y b2.2" figuraba en el
*Done when* y se daba por hecha. Dos trampas aparecieron al hacerla de verdad:

- Lo que se creía verificado en sesiones anteriores se había "verificado" con
  el andamiaje roto, donde la suite estaba roja pasara lo que pasara. **Un rojo
  no prueba nada si el gate está roto por su cuenta.**
- El primer intento de reintroducir b2.2 fijaba `escala = 1` en la
  normalización del modelo. La suite pasó — correctamente: el modelo ya viene
  con ~1.7 de alto nativo, exactamente `TARGET_HEIGHT`, así que la
  normalización es hoy una identidad. **El cambio no era un bug, era un
  no-op.** La reintroducción buena fue quitar el centrado: la cámara quedó
  mirando a los pies y no se alcanzó ni un hueso.

**Por qué importa:** la demostración de que una prueba sirve es la única cosa
que separa un gate de un adorno, y es justo la que más se da por hecha porque
"obviamente lo atraparía".

**How to apply:** al reintroducir un defecto, confirmar primero que el gate
está verde sin él, y después que el cambio realmente altera el comportamiento
observable — no solo el código. Un verde inesperado al reintroducir un bug es
información: o la prueba no sirve, o el cambio no era el bug.
