# Epic e5: Progreso y repaso dirigido — Brief

## Hypothesis

Para estudiantes de medicina que memorizan los 206 huesos y hoy vuelven a
recibir al azar los que ya dominan,
el **registro persistente de aciertos y fallos por hueso** es un **director de
estudio**
que hace que el error decida la siguiente pregunta en vez del azar.
A diferencia del modo test actual —que elige uniformemente entre los huesos con
geometría y solo evita repetir el inmediato anterior— y del atlas en papel, que
no guarda registro de nada, recuerda entre sesiones y pregunta primero lo
fallado, sin cuenta de usuario y sin que un solo dato salga del navegador.

## Success metrics

- **Leading:** tras responder una pregunta y recargar la página, el registro de
  ese hueso conserva el resultado anterior — el observable literal de `RF-09`,
  medible en cuanto exista la primera historia que persista.
- **Lagging:** con el epic completo, la selección de preguntas está
  mediblemente sesgada hacia lo fallado: un hueso fallado vuelve a aparecer
  antes que uno nunca fallado, y eso se puede afirmar con una prueba
  determinista sobre el dominio, no con una impresión de uso.

## Appetite

M — 5-7 historias.

## Scope boundaries

### No-gos

- **Backend, cuenta de usuario, sincronización entre dispositivos o telemetría
  de cualquier tipo** — `must-privacy-006` lo prohíbe y es una decisión de
  proyecto, no de esta épica; el diseño no puede revocarla. El progreso vive en
  el navegador del estudiante o no existe.
- **Tocar el catálogo o el activo 3D.** E5 consume lo que E1 fijó; si algo del
  catálogo estorba, es un hallazgo para el parking lot, no trabajo de aquí.
- **Cambiar qué se considera respuesta correcta.** La validación tolerante es de
  E4 y ya está cerrada; E5 registra su veredicto, no lo reinterpreta.

### Rabbit holes

- **Implementar repetición espaciada de verdad** (SM-2, cajas de Leitner con
  intervalos temporales, curvas de olvido). El requisito dice *priorizar lo
  fallado*, que es un orden, no un calendario. Un planificador con fechas es
  varias veces el tamaño de esta épica y no está pedido.
- **Un panel de estadísticas de progreso.** `RF-09` pide que el sistema
  *recuerde* y *priorice*, no que lo muestre. Enseñar el progreso es una épica
  propia si alguna vez se quiere.
- **Versionado y migraciones del formato guardado** para un esquema que todavía
  no ha cambiado nunca. Se resuelve cuando cambie, con el caso real delante.
- **Convertir el almacenamiento en una abstracción con `IndexedDB` de reserva**
  por si `localStorage` falla (modo privado, cuota). Degradar con elegancia es
  legítimo; construir dos backends de almacenamiento para lograrlo, no.
- **Rehacer la selección de preguntas desde cero.** `pickTestableBone` ya existe
  y ya dejó escrito dónde encaja `RF-09`; el gemba manda sobre la tentación de
  empezar de nuevo.
