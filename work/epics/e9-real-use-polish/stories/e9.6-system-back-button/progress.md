# Story e9.6: The system back button walks the app — Progress

## T1 · El historial transporta el modo, y `popstate` lo restituye

**Hecho.** `navegar` es el único punto de transición (`pushState` sin tercer
argumento + `setModo`), un `useEffect` escucha `popstate`, y `esModo` valida
lo que llega. Las siete transiciones que usaban `setModo` suelto pasan por
`navegar`; los dos únicos `setModo` que quedan están dentro de `navegar` y
del escucha.

**RED:** 3 pruebas nuevas en `App.test.tsx` — retroceso desde la ficha con
la selección intacta, retroceso desde el test de esqueleto, y un `state`
ajeno que cae a Explorar. Fallaban las 3; las 10 existentes pasaban.

**Verificación — mutaciones forzadas:**

| Mutación | Resultado |
|---|---|
| Quitar el `pushState` de `navegar` | 2 rojos: los dos tests de retroceso |
| `esModo` devuelve `true` siempre | 1 rojo: el del `state` inválido |

Las dos matan exactamente lo que debían y nada más, así que las pruebas
miden el mecanismo y no otra cosa.

**Verificación — orden:** `vitest run src/App.test.tsx --sequence.shuffle`,
dos corridas, 13/13 en ambas. jsdom comparte `window.history` entre casos
del mismo archivo y el riesgo era un verde de orden.

**Gate:** `./scripts/check` verde — 37 archivos, 275 pruebas.

**Lo que el plan no anticipó, y salió mejor:** el aislamiento entre pruebas
no necesitó andamiaje de test. `App` siembra la entrada de arranque con
`history.replaceState(modoInicial(), '')` al montar, y eso resuelve las dos
cosas a la vez: en producción, retroceder hasta la entrada inicial restituye
Explorar explícitamente en vez de llegar al `popstate` con `state: null` y
caer al respaldo; en jsdom, cada montaje reemplaza la entrada actual, así
que ningún caso retrocede a la pila que dejó el anterior. Es corrección de
diseño, no un truco de prueba.

**Decisión de implementación:** `MODOS_SIN_DATOS` es un
`Record<ModoSinDatos, true>` y no una lista de cadenas. Sobre una unión, el
`Record` exige exhaustividad: si `Modo` gana una variante sin dato y nadie
la agrega, falta una clave y el compilador lo dice. Una lista la aceptaría
en silencio — que es exactamente el hallazgo aparcado sobre
`esProgresoDeHueso`, cerrado por construcción en vez de repetido.
