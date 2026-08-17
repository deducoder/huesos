# Story e5.5: Privacy guardrail, actually gated — Retrospective

Estimated: S (3 tareas) · Actual: S — 3 tareas, 2 commits de prueba, ninguna
sorpresa

## Summary

`must-privacy-006` pasa de promesa a gate. Dos comprobaciones en
`./scripts/check`: una estática sobre el código propio (nadie escribió una
salida a la red) y una en ejecución sobre la aplicación montada y usada (nadie
la llamó, dependencias incluidas). Ambas demostradas rompiéndose con un defecto
real.

## What went well

- **La demostración se hizo, y las dos veces.** s1 dejó aprendido que un gate
  que nadie vio ponerse rojo es una intención; aquí cada ángulo se rompió con su
  propio defecto y la salida quedó copiada en `progress.md`. La del ángulo en
  ejecución se eligió realista a propósito: un `sendBeacon` pegado al punto
  donde se guarda el progreso, que es cómo se cuela la telemetría de verdad.
- **Cada comprobación lleva su propia comprobación de que mira algo.** El
  recorrido de `src/` verifica que encontró más de 15 archivos con `App.tsx`
  entre ellos; los espías verifican que registran una llamada real. Sin eso, un
  fallo en el andamiaje daría verde por no haber buscado — que es exactamente lo
  que pasó en s1 con la caja del lienzo, verde por accidente durante dos
  sesiones.
- **Los dos ángulos se justificaron con lo que cada uno no puede ver**, no por
  completitud: el estático no ve una dependencia que llame por su cuenta; el de
  ejecución no ve código en una ruta que las pruebas no recorren.
- **Ir última fue correcto.** Sobre una aplicación que ya funcionaba y con el
  progreso ya circulando, escribir la prueba de "responder una pregunta sin
  salir a la red" fue directo. Al principio de la épica no habría habido nada
  que probar.

## What to improve

- **Este guardrail declaraba una comprobación que llevaba todo el proyecto sin
  existir.** No es culpa de esta historia —la tabla de guardrails lo asignaba a
  `RF-09`, que es esta épica— pero conviene notar que **un guardrail con una
  columna de verificación rellena parece verificado**. Nadie lo cuestionó hasta
  que la épica que lo poseía llegó. Vale la pena mirar si otros guardrails
  tienen la misma brecha.
- **El `scope.md` dijo "sin `design.md`" y eso estuvo bien**, pero lo escribí en
  el `plan.md` en vez de decidirlo antes. La justificación llegó después de la
  decisión.

## Learned

1. **About the system:** la aplicación no hace ninguna petición de red en
   tiempo de ejecución más allá de sus propios activos, y ahora eso está
   fijado por dos gates rápidos en vez de por la suite de navegador, que tarda
   un orden de magnitud más y corre solo al empujar.

2. **About the process:** una comprobación automática necesita su propia
   comprobación de que está mirando. Una aserción sobre una lista vacía es
   indistinguible de una aserción que nunca recorrió nada, y las dos dan verde.
   El patrón —afirmar que el recorrido encontró algo, afirmar que el espía
   detecta— cuesta tres líneas y convierte un gate decorativo en uno real.

3. **Capability gained:** `must-privacy-006` es exigible en cada commit. Quien
   añada telemetría en el futuro se encontrará el gate rojo con el nombre del
   archivo, en segundos, en vez de descubrirlo en producción o nunca.

## Finding for the epic review

La tabla de `governance/guardrails.md` declara una verificación por guardrail.
Ésta llevaba todo el proyecto declarada y sin implementar, y nada lo señalaba.
**Merece comprobar en la review de la épica si hay otros guardrails en la misma
situación** — la columna "cómo se verifica" describe una intención, y hasta hoy
nada comprobaba que existiera.
