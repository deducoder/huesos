# Story e1.1: Incorporate asset — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Podar texturas e incorporar | done | `cfeca2d` | RED con el test de integridad, GREEN con el script de poda |
| T2 · Declarar la atribución | done | `760e452` | — |
| T3 · Prueba de integración manual | done | — | Lector independiente en Python contra el original |

## Desvíos respecto del plan

- **El gate rojo destapó tres defectos** que el plan no anticipaba: formato,
  `@types/node` ausente y `any` implícito al importar el `.mjs` desde
  TypeScript. El último violaba `must-type-004`, así que se resolvió con un
  `glb.d.mts` —declaraciones junto a la implementación, sin duplicarla— en vez
  de silenciar el compilador.
- **`.d.ts` no sirve para un módulo `.mjs`**: TypeScript busca `.d.mts`. Costó
  un ciclo de gate entero descubrirlo.
- **`--passWithNoTests` se quitó aquí**, no en e1.2 como decía el diseño del
  epic: en cuanto hubo un test la bandera sobraba, y esperar habría sido
  mantener a propósito un gate que miente.
- **La poda adelgazó el activo un 44 %** —de 3,3 MB a 1,86 MB—, bastante más de
  lo previsto: las texturas eran casi la mitad del archivo.

## Resultado de la prueba de integración

Lector independiente (Python) contra el original descargado:

- 144 mallas en ambos, lista idéntica elemento a elemento.
- Ninguna malla perdida, ninguna añadida, ningún nombre cambiado.
- 135 materiales y 566 accessors conservados; Draco intacto.
- Ninguna referencia a `bufferView` fuera de rango tras el remapeo.
