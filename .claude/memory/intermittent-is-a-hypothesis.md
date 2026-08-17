---
name: intermittent-is-a-hypothesis
description: Llamar "intermitente" a un fallo cierra la investigación en vez de abrirla — y una explicación ambiental es la más cómoda de aceptar y la más difícil de refutar.
metadata:
  type: process
---

En s1, la prueba de la rejilla corrió en 20 s, 1,1 min y más de 2 min en
corridas consecutivas sin cambios de código. Se registró como intermitencia
del entorno —renderizado por software, contención de CPU del contenedor— y se
pausó con `test.fixme` esperando "verificar con GPU real". Era un bug
determinista: una carrera entre el pintado de la lista y el dimensionado del
lienzo ([[measure-the-element-after-layout]]). La GPU no tuvo nada que ver;
de hecho la suite sigue corriendo sobre SwiftShader aun en una máquina con GPU,
porque Chromium headless no la toma por defecto.

**Por qué importa:** "el entorno es ruidoso" explica cualquier variación sin
comprometerse con nada, así que nunca se contradice y nunca se investiga. Es
la hipótesis que mejor se siente y peor rinde. Aquí costó dos sesiones y
sobrevivió a un handoff escrito, que es donde se volvió "un hecho conocido".

**How to apply:** ante tiempos o resultados que varían, medir la variación
antes de nombrarla — una traza con marcas de tiempo, la propiedad sospechosa
muestreada cada 50 ms. Si se va a escribir "intermitente" en un artefacto,
escribir al lado qué experimento lo descartaría; si no hay ninguno, todavía no
es un diagnóstico.
