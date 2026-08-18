---
name: domain-view-boundary-decides-file-placement
description: "En huesos-mono, src/domain/ nunca importa una etiqueta en español (REGION_LABEL, SIDE_LABEL) — cualquier función que derive algo de esas etiquetas (agrupar, categorizar) vive en src/components/, sin importar cuán 'de dominio' se sienta la operación."
metadata: 
  node_type: memory
  type: project
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T02:25:56.496Z
---

El `design.md` de la épica E8 propuso `src/domain/categories.ts` para
`groupByCategory` (agrupar regiones en categorías de Fichas, e8.2). El
gemba de `story-design` releyó `src/components/labels.ts`, que declara
explícito en su propio comentario: "el dominio guarda claves estables, la
vista las traduce". Derivar la categoría del prefijo de `REGION_LABEL`
antes de "—" depende de un texto en español que solo existe en la capa de
vista — el archivo se movió a `src/components/categories.ts` antes de
escribir una línea de implementación.

**Por qué importa:** "agrupar regiones" suena a operación de dominio,
pero la regla de agrupación (el separador "—" en una etiqueta) es un
detalle de presentación, no del catálogo. La pregunta correcta no es "¿es
lógica de negocio?" sino "¿depende de una traducción de la vista?" — si
sí, no importa cuán pura o testeable sea la función, no va en
`src/domain/`.

**How to apply:** antes de crear un archivo nuevo en `src/domain/` que
agrupe, ordene o categorice algo, revisar si depende de
`REGION_LABEL`/`SIDE_LABEL` (o de cualquier `Record<Key, string>` en
español de `src/components/labels.ts`). Si depende, el archivo va en
`src/components/`, aunque no tenga JSX. Relacionado:
[[epic-design-is-a-hypothesis]] (el mecanismo por el que se encuentra el
error) y [[bone-es-name-omits-side.md]] (otra consecuencia del mismo
límite dominio/vista).
