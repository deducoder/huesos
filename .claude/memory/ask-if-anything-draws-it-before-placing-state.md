---
name: ask-if-anything-draws-it-before-placing-state
description: Antes de decidir dónde vive un estado, preguntar si algo lo dibuja — un dato que no se renderiza no necesita estado de React, y con eso desaparece toda la plomería que se había planificado.
metadata:
  type: process
---

El `plan.md` de E5 anticipaba, como riesgo principal de e5.3, que "la plomería
del estado sería el trabajo real": el registro de progreso tenía que sobrevivir
al desmontaje de las vistas de test, y el patrón conocido del proyecto
([[state-ownership-follows-survival-not-cleanliness]]) decía subirlo a `App` y
pasarlo por props.

El gemba lo desmintió en una lectura: **mostrar el progreso está declarado
fuera de la épica**, así que nada lo renderiza. Un dato que no se dibuja no
necesita estado de React — no hay re-render que provocar. Bastó con que fluyera
como una dependencia más (igual que `catalog`) hasta el único componente que lo
escribe. Ni estado elevado, ni props nuevas en dos componentes intermedios, ni
contexto.

**Por qué importa:** "¿dónde vive este estado?" da por supuesto que es estado.
La pregunta anterior —¿algo lo dibuja?— es más barata y a veces borra la
primera entera. Cargar con un riesgo que no existe distorsiona la talla de la
historia y su posición en el plan.

**How to apply:** ante un dato que hay que compartir o conservar, primero
enumerar quién lo **lee para renderizar**. Si la lista está vacía, no es estado
de interfaz: es una dependencia, y se pasa como se pasan las demás. Y revisar
los riesgos heredados del plan de la épica **en el diseño de la historia**,
donde ya se leyó el código, en vez de arrastrarlos hasta la implementación.
