# Epic e4: Motor de test — Brief

## Hypothesis

For estudiantes de medicina que ya reconocen los huesos explorando (E2/E3)
pero necesitan comprobar si los recuerdan sin ayuda visual,
el modo test es una vista que pregunta —sobre el esqueleto completo o sobre
un hueso aislado, sin etiquetas— y que valida lo que el estudiante escribe
con tolerancia real (mayúsculas, tildes, artículos, sinónimos, ambas
nomenclaturas).
Unlike explorar (E2/E3), donde el nombre siempre está a la vista, acá el
estudiante tiene que producirlo de memoria, y el sistema se lo dice cuando
se equivoca — sin dejarlo adivinando.

## Success metrics

- **Leading:** para el hueso "fémur", `FEMUR`, `femur`, `el fémur` y
  `os femoris` se validan todas como correctas en la primera historia que
  implemente la validación — medible sin esperar a que exista una vista.
- **Lagging:** un estudiante puede completar una sesión de test completa
  (pregunta → respuesta → corrección) sobre el esqueleto y sobre un hueso
  aislado, sin que ningún nombre de hueso aparezca en el DOM antes de
  responder (`RF-04`, `RF-05`).

## Appetite

M — 5-7 historias. Cuatro requisitos (`RF-04` a `RF-07`) que combinan lógica
de dominio nueva (validación tolerante), dos vistas de presentación que
reutilizan escenas ya construidas (E2, E3) sin etiquetas, y un flujo de
pregunta-respuesta-corrección que ninguna historia anterior tuvo que
resolver.

## Scope boundaries

Lo que el diseño no puede hacer. Lo que sí construirá no se decide acá — esa
lista es de `scope.md`, que escribe `epic-design` después de la
descomposición.

### No-gos
- **No persiste aciertos ni fallos** — **never**: es `RF-09`/E5. Esta épica
  puede dejar el punto donde un resultado *podría* engancharse, pero no
  implementa el registro ni la selección de preguntas que prioriza fallos.
- **No inventa tolerancia más allá de la que `RF-06` especifica** —
  **never**: el observable es concreto (mayúsculas, tildes, espacios,
  artículos iniciales, sinónimos registrados). Ninguna distancia de edición
  ni corrección "aproximada" adicional — eso cambiaría qué cuenta como
  correcto sin que el requisito lo pida.

### Rabbit holes
- **Construir un "motor de preguntas" genérico antes de tener dos casos de
  uso reales que lo justifiquen.** `RF-04` y `RF-05` son las únicas dos
  variantes que existen hoy; abstraer para una tercera hipotética (E5 podría
  necesitar algo distinto) es adivinar antes de tiempo.
- **Normalización de texto con casos de unicode exóticos** que `RF-06` no
  pide. El observable ya da el criterio exacto — implementar solo eso, no
  una librería de comparación difusa.
- **La selección de qué hueso preguntar** puede tentar a construir ya la
  lógica de "priorizar lo fallado" de `RF-09`. Esta épica solo necesita
  *elegir un hueso*, no *elegir el mejor hueso para repasar*.
