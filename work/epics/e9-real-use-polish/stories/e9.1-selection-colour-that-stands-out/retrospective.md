# Story e9.1: Selection colour that actually stands out — Retrospective

Estimated: S · Actual: S — 2 tareas planeadas más un fix de e9.5 encontrado
en el camino y un refactor de tipos en review; 8 commits.

## Summary

El hueso seleccionado en la escena 3D pasa de emitir luz (`emissive`) a
teñir su material (`color`), con el color del activo guardado en un
`WeakMap` propio para restaurarlo al deseleccionar. `--color-acento` no
cambió: el problema nunca fue el color, era el mecanismo. `@theme` gana
`--color-acierto` y `--color-error`, con un gate que calcula su contraste en
vez de citarlo, listos para que e9.2 los consuma.

`./scripts/check` verde (316 tests), verificado a mano por el humano en su
teléfono en Explorar y en el test de esqueleto completo.

## What went well

- **Medir antes de creer, dos veces en la misma historia.** El scope midió el
  roce real (57 de suma) antes de proponer nada. El design fue más lejos:
  probó nueve colores y cuatro intensidades de `emissive`, y el dato que
  decidió fue el tope teórico — el blanco puro al máximo (152) no llega a lo
  que teñir consigue con el color que ya había (282). Cambiar el mecanismo,
  no el token, es una corrección del scope que solo la medición pudo producir.
- **El propio ojo como instrumento válido.** Entre `emissive` a 0.6, 2.0 y 3.0
  las capturas parecían idénticas pese a medir 68, 122 y 143. En vez de
  confiar en el número, se verificó el color de píxel en cada captura —sí
  diferían— y se concluyó que si no se distingue a simple vista, no resuelve
  la historia. El dato no mentía; lo que hacía falta era el criterio correcto
  para leerlo.
- **Un defecto ajeno, encontrado, verificado y arreglado sin desviar la
  historia.** El gate de T1 falló en un test de e9.5 que T1 no toca. En vez
  de asumir "flaky", se reprodujo en `main` limpio (2 de 5 rojo), se encontró
  la causa (una comparación que dejó de discriminar desde e9.5) y se arregló
  con un commit directo en `main`, fuera de la rama de la historia —
  verificado con 15 corridas en verde y la mutación forzada reproduciendo el
  fallo 12 de 10 veces.

## What to improve

- **Un `as` se coló en el propio código de esta historia, no solo en el
  ajeno.** `quality-review` encontró `(malla.userData.baseColor as Color)` —
  el mismo tipo de atajo que ya había corregido en T2 con `as number`, y que
  volví a escribir sin notarlo en T1. La causa es la misma las dos veces:
  `userData` de three.js es de tipo laxo, y escribir contra un tipo laxo
  tienta al cast en vez de a modelar el dato con un tipo propio. Mejora de
  proceso: **cuando el código toca una API de tipo laxo (`userData`, `any`
  externo), preguntar primero si hay una estructura propia —un `Map`, un
  `WeakMap`— que evite heredar esa laxitud**, en vez de envolver el acceso
  laxo con un cast.
- **La verificación del cambio de tipos no fue solo el gate.** Antes de
  commitear el refactor se volvió a medir el fémur (282, 1848 px, idéntico a
  antes) — confirmar que un cambio de "solo tipos" no cambió el
  comportamiento observable no es automático con este componente, porque
  ningún test de render lo verifica.

## Learned

1. **About the system:** `SkeletonScene.test.tsx` es, por necesidad, una
   suite de código fuente (jsdom no ejecuta WebGL) — eso significa que un
   cambio de comportamiento real en el resaltado 3D solo lo confirma medir
   píxeles fuera de la suite o la verificación manual, nunca `./scripts/check`
   por sí solo. Cualquier historia futura que toque el resaltado necesita
   asumir esa misma disciplina.
2. **About the process:** un defecto encontrado a mitad de una tarea no tiene
   que detener la tarea si es trivial y está bien entendido — pero sí exige
   el mismo rigor que cualquier hallazgo: reproducir antes de asumir,
   verificar con volumen (15 corridas) antes de confiar, y una mutación
   forzada antes de cerrar.
3. **Capability gained:** un patrón reutilizable para guardar estado
   accesorio sobre un objeto de three.js sin heredar el tipo laxo de
   `userData` — un `WeakMap` propio en un `useRef`, con `?? valorSeguro`
   como fallback defensivo. Cualquier escena que necesite recordar algo por
   malla puede seguir este mismo camino en vez de escribir en `userData`.
