---
name: a-layer-outside-routing-still-needs-a-sync-owner
description: un overlay deliberadamente ajeno al historial (para no ser un modo más) queda sin dueño ante una navegación real si nadie lo cierra a propósito
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T21:00:31.781Z
---

Un componente que vive por diseño fuera del mecanismo de enrutamiento de
una aplicación (en huesos-mono: `Modo`/`navegar`/ADR-013) —para no
convertirse en una entrada de historial que no le corresponde— sigue
necesitando que algo lo sincronice con los eventos que sí pertenecen al
enrutamiento. La independencia arquitectónica no es lo mismo que
independencia de comportamiento.

**Why:** en e9.7, `AboutPanel` se abre con estado local
(`menuAbierto: boolean`) a propósito, para no ser un `Modo` más ni
empujar una entrada de historial — decisión correcta y documentada. Pero
eso mismo lo dejó sin ningún dueño que lo cerrara cuando el usuario
presionaba "atrás" del sistema: `popstate` cambiaba la vista de fondo
(`modo`) pero nadie tocaba `menuAbierto`, así que el panel quedaba
montado encima de una vista distinta a la que estaba cuando se abrió.
Encontrado en la verificación manual del teléfono ("el card privacidad
no se quita, se sostiene, reaccionan las pantallas de atrás"); ninguna
prueba lo exigía porque el design no anticipó esa combinación específica
(navegación real + panel abierto).

**How to apply:** al diseñar cualquier capa de UI deliberadamente ajena
al mecanismo de navegación principal (un overlay, un toast, un panel
lateral), preguntar explícitamente qué le pasa a esa capa cuando el
usuario navega por un camino que la capa no controla (atrás del sistema,
un enlace externo, un cambio de ruta programático). El fix suele ser una
línea en el handler del evento de navegación real — acá,
`setMenuAbierto(false)` agregado al listener de `popstate` — pero hay
que nombrar la pregunta antes de que la verificación manual la encuentre
por accidente.
