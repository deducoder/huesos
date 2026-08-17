# Story e4.2: Modo test sobre el esqueleto completo — Retrospective

Estimated: M (3-5 tareas) · Actual: 3 tareas + 1 corrección de calidad

## Summary

`TestQuestion` es el flujo pregunta → respuesta → resultado → siguiente,
parametrizado por qué escena mostrar (nunca por qué hueso, que solo viaja
como `id`). `SkeletonTestView` lo compone con `SkeletonScene`, sin ninguna
vía con nombre visible. `must-data-003` tiene, por primera vez en el
proyecto, una prueba real que lo verifica.

## What went well

- La decisión de tipos de T1 (`renderScene: (boneId: string) => ReactNode`,
  nunca `(bone: Bone) => ReactNode`) convirtió la disciplina de
  `must-data-003` en algo que el compilador ayuda a sostener, no solo algo
  que un test recuerda verificar — si alguien quisiera mostrar el nombre
  por accidente, tendría que cambiar la firma primero, un paso visible en
  el diff.
- La verificación manual (T3) volvió a encontrar algo real que ningún test
  automatizado podía ver: el mensaje para lectores de pantalla de
  `SkeletonScene`, escrito pensando en `ExploreView`, decía algo falso en
  el contexto nuevo. Se arregló en el momento con un cambio pequeño
  (prop opcional, retrocompatible) en vez de aplazarlo.

## What to improve

- El flujo de "Siguiente pregunta" quedó dentro de `TestQuestion` sin que
  el scope lo pidiera con ese nivel de detalle explícito (el scope hablaba
  de "responder" y de un ejemplo con "Siguiente pregunta", pero no
  distinguía si era parte del walking skeleton o algo aplazable). Salió
  bien porque era barato, pero para la próxima historia de tamaño M vale
  la pena decidir explícitamente en el plan qué parte del flujo es
  mínima-mínima y qué parte es "ya que estamos".

## Learned

1. **About the system:** reutilizar `SkeletonScene` para una segunda vista
   (después de `ExploreView`) expuso un acoplamiento que no era visible con
   un solo consumidor — un texto de accesibilidad escrito para un contexto
   específico, no genérico. La misma lección que
   `pure-domain-layers-pay-off-later` documentó para el dominio aplica
   también a componentes de vista: el segundo consumidor real es el que
   revela qué era específico y qué era genérico en el primero.
2. **About the process:** la prueba manual en navegador real (T3) sigue
   encontrando, historia tras historia, algo que las pruebas automatizadas
   no ven — no por falta de cobertura, sino porque son categorías de
   defecto distintas (aquí, un texto correcto en su contexto original pero
   engañoso en uno nuevo). Cuatro historias seguidas (e3.1, e3.2, e3.3,
   e4.2) con un hallazgo real en la verificación manual — vale la pena
   dejar de tratarlo como una posibilidad y empezar a esperarlo.
3. **Capability gained:** el patrón `renderScene: (id: string) => ReactNode`
   para inyectar "qué mostrar" sin exponer "qué es" es reusable en
   cualquier flujo futuro que necesite la misma separación entre lo que se
   pregunta y lo que se muestra — e4.4 lo reutiliza directamente con
   `IsolatedBoneScene`.
