# Story e1.1: Incorporate asset — Retrospective

Estimated: S (2-3 tareas) · Actual: S, 4 commits — una tarea más de la prevista,
nacida del propio quality-review

## Summary

`src/data/skeleton.glb` entra al repositorio con 144 mallas intactas, cero
texturas y cero bytes de imagen, acompañado de su atribución CC BY-SA 4.0 y de
un script de poda reejecutable. El activo pesa 1,86 MB, un 44 % menos que el
original.

## What went well

- **La poda se hizo bien desde el principio.** Borrar las entradas `images` era
  lo fácil y lo insuficiente: los bytes viven en el chunk binario. El script
  reconstruye el buffer y remapea los índices de `bufferView`, así que la obra
  no comercial desaparece de verdad en vez de quedar huérfana dentro.
- **La prueba de integración usó un lector distinto del que escribió el código.**
  Verificar el resultado con el mismo parser que lo produjo no habría probado
  nada; hacerlo con Python contra el original confirmó las 144 mallas nombre a
  nombre, y de paso que ninguna referencia de Draco quedó fuera de rango.
- **El gate rojo hizo su trabajo.** Los tres defectos que destapó —formato,
  `@types/node`, `any` implícito— habrían entrado silenciosamente en un flujo
  sin gate.

## What to improve

- **El test inicial no probaba lo que importaba.** Verificaba las referencias,
  no los bytes: si la compactación hubiera fallado, habría seguido en verde con
  el material NC dentro del archivo. Lo destapó el `quality-review`, no el
  ciclo TDD, porque el test se escribió contra el criterio de aceptación tal
  como estaba redactado y ese criterio hablaba de «no contiene texturas» sin
  precisar a qué nivel. **Un criterio de aceptación que no dice a qué nivel se
  observa produce un test que mide el nivel más cómodo.**
- **`progress.md` se escribió al final, no durante.** El review lo pidió y no
  existía. Es el artefacto que `story-implement` debe ir dejando; escribirlo a
  posteriori lo convierte en un resumen en vez de un registro.
- **Se resolvió un `any` implícito antes de intentar silenciarlo**, y estuvo
  bien, pero costó un ciclo entero de gate descubrir que un `.d.ts` no sirve
  para un `.mjs`.

## Learned

1. **About the system:** el modelo es más manejable de lo que ADR-001 supuso —
   1,86 MB tras la poda, no 3,4 MB. El coste negativo que el ADR registró sobre
   `should-perf-007` es menos grave de lo escrito. El ADR **no se edita**: si
   esto cambia alguna decisión, será un ADR que lo supersede, no una corrección
   silenciosa.
2. **About the process:** cuando el artefacto bajo prueba es un archivo y no
   código, el criterio de aceptación tiene que decir **a qué nivel se observa**
   —estructura o bytes—, o el test se escribirá contra el nivel más barato.
3. **Capability gained:** el proyecto tiene un lector y escritor de GLB propios
   (`scripts/glb.mjs`), suficientes para inspeccionar y transformar el activo
   sin depender de three.js ni de Blender. e1.3 se apoya directamente en ellos.
