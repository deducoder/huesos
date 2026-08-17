# Epic e1: Anatomical asset — Retrospective

## Summary

El repositorio tiene el esqueleto humano como dato verificable: un modelo glTF
de 1,86 MB sin las texturas no comerciales del original, y un catálogo de los
206 huesos —199 anclados a una malla real, 7 declarados ausentes con su razón—
con nombre en español, término en Terminologia Anatomica y sinónimos. El gate
lo comprueba con 38 pruebas y 54 aserciones: identificadores únicos, reparto por
región contra el desglose canónico, ambos lados de cada hueso par, y que ningún
`meshName` apunte a una malla que no existe.

## Metrics

- Historias: 6 · Estimadas: 3 S, 2 M, 1 L · Reales: exactas, ninguna cambió de talla
- Commits: 16 en el rango del epic · Pruebas: 0 → 38 · Aserciones: 54
- Activo: 3,34 MB → 1,86 MB (−44 %), 132 texturas → 0
- Catálogo: 206 entradas · 117 mallas distintas referenciadas de las 118 óseas
- Surgido a mitad del epic y no planificado: la decisión del esternón como hueso
  único, la eliminación de tres ids especulativos, y la retirada de
  `--passWithNoTests` una historia antes de lo previsto

## Scope verification

Cada compromiso de `scope.md`, releído contra el código:

**MUST**

- *El `.glb` sin texturas NC y con atribución* → **Fulfilled**. `src/data/skeleton.glb`
  (commit `cfeca2d`), 0 imágenes y 0 bytes con firma PNG/JPEG/WEBP/KTX, verificado
  en `tests/skeleton-asset.test.ts`. Atribución en `src/data/ATTRIBUTION.md`
  (commit `760e452`).
- *El esquema del catálogo* → **Fulfilled**. `src/data/bone.ts`: `Bone` es unión
  discriminada, así que una entrada sin malla y sin razón no se puede escribir.
- *Las 199 entradas con español y Terminologia Anatomica* → **Fulfilled**.
  206 entradas, 199 con `meshName`, verificado en `catalog.coverage.test.ts`.
- *La prueba de integridad en verde* → **Fulfilled**. `./scripts/check` pasa;
  38 pruebas entre integridad estructural, cobertura canónica y anclaje.
- *Los 7 ausentes declarados como excepción explícita* → **Fulfilled**. Seis
  osículos y el hioides, cada uno con `missingReason`; el test exige que la
  razón exista y tenga contenido.

**SHOULD**

- *El extractor reejecutable* → **Fulfilled**. `scripts/inventory-model.mjs`,
  con filtro por tipo y salida JSON.
- *Identificador FMA por entrada* → **Descoped**. Cero entradas lo llevan.
  Derivarlo exige cruzar la ontología FMA con los nombres de malla, que son
  irregulares, y ninguna historia posterior depende de él: E2 ancla por
  `meshName` y E4 valida por `es`/`la`/`synonyms`. Vuelve como historia propia el
  día que haga falta interoperar con otra fuente anatómica. **No se hizo, y no
  se disimula: era un SHOULD y quedó sin hacer.**

**Done when**

- *Prueba automática de unicidad, nomenclatura y geometría existente* → **Fulfilled**.
- *206 entradas con 7 excepciones* → **Fulfilled**.
- *El `.glb` sin ninguna textura NC* → **Fulfilled**, comprobado a nivel de bytes.
- *Atribución visible para quien clone* → **Fulfilled**.
- *Documentación actualizada* → **Pendiente para `epic-close`**, que es quien la
  genera. El README describe una estructura de `src/` que aún es futuro
  —`domain`, `state`, `features`— y no menciona `scripts/` como herramientas.

Sin compromisos de eliminación en este scope: el epic es net-new.

## What went well

- **Secuenciar por riesgo se pagó entero.** El walking skeleton —activo, esquema
  y anclaje— cerró con cuatro entradas la pregunta que ADR-001 apostaba: ¿sirve
  el nombre de malla como clave estable? Cuando llegó el volumen, 173
  transcripciones nuevas entraron sin una sola errata porque el gate las
  vigilaba desde tres historias antes. Descubrir ese fallo con 199 entradas
  encima habría costado el epic.
- **Los tests atraparon errores de modelado, no de tecleo.** Los dos fallos
  reales del epic fueron conceptuales: un tipo que permitía un estado imposible
  (e1.2) y un esternón que no se reconocía como impar por ids escritos por
  anticipación (e1.6). Ninguno era una errata; ninguno se habría visto leyendo
  el código.
- **Las decisiones incómodas se tomaron por escrito y antes de tocarlas.** El
  esternón como hueso único, la poda de las texturas NC, los 7 ausentes: cada
  una quedó en un scope o en un ADR *antes* de implementarse, y luego se
  verificó que pasara exactamente lo predicho.

## What to improve

- **Los commits se agruparon donde más falta hacía separarlos.** e1.6 metió 180
  entradas en un commit cuando su plan pedía tres bloques; e1.5 fundió RED y
  GREEN. El patrón es claro y vergonzoso: **cuanto más volumen tiene la tarea,
  más se agrupó el commit**, justo al revés de lo que conviene. La disciplina
  aguantó en lo pequeño y cedió en lo grande.
- **Se planificaron ciclos RED que no podían fallar.** e1.3 planeó descubrir por
  test un recuento que la investigación ya había medido. Fijar una medición
  conocida es valioso, pero no es TDD, y llamarlo RED confunde el registro.
- **`progress.md` se escribió a posteriori en la primera historia.** Es un
  registro, no un resumen; escribirlo al final le quita la mitad del valor.
- **El SHOULD del FMA se dejó caer sin decidirlo explícitamente hasta este
  review.** Debió descoparse en el momento en que se vio que no aportaba, no al
  final por omisión.

## Learned

1. **About the system:** el modelo es un activo *irregular*, y eso es una
   propiedad estructural, no un detalle. Mezcla convenciones de lateralidad
   (`.r`, `left`/`right`), de numeración (`2d` junto a `3rd` en la misma familia
   de falanges) y deja restos como `Scapula.r.`. Ninguna herramienta futura
   puede derivar un nombre de malla por regla: hay que leer la lista real. Ese
   patrón no lo mostró ninguna historia sola; apareció al recorrer las 118
   mallas juntas.
2. **About the process:** en un epic cuyo riesgo es un contrato entre dos cosas
   —aquí, dato y geometría—, la historia que prueba el contrato debe ir en el
   walking skeleton aunque parezca menor. e1.4 era la historia más pequeña del
   epic, una talla S de un commit, y es la que sostuvo todo lo demás.
3. **Capability gained:** el proyecto puede leer, transformar y verificar su
   propio activo 3D sin Blender ni three.js, y tiene un contrato de datos
   completo sobre el que E2 construye sin decidir anatomía: lateralidad,
   regiones y ausencias están declaradas y probadas.
