# Epic e1: Anatomical asset — Scope

## Objective

Dejar en el repositorio un catálogo de huesos anclado a geometría real: cada
entrada con identificador estable, nomenclatura bilingüe y una malla existente
que la respalde, verificado por una prueba automática.

**Value:** E2 en adelante puede construir la exploración, la ficha y el motor de
test sin volver a tocar datos ni anatomía. Convierte el cuello de botella
declarado del proyecto en una dependencia resuelta.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e1.1 | Incorporar el activo | S | Podar los mapas de normales CC BY-NC-SA, dejar el `.glb` y su atribución en el repositorio |
| e1.2 | Esquema del catálogo | S | Tipos del hueso y de la región, con la prueba de integridad estructural que exige `must-data-002` |
| e1.3 | Inventario del modelo | M | Extractor que lee el `.glb` y emite las mallas clasificadas en hueso, diente, cartílago y sesamoideo |
| e1.4 | Anclaje catálogo-geometría | S | Prueba que casa cada `meshName` del catálogo contra el archivo real y falla si uno no existe |
| e1.5 | Columna vertebral | M | Región piloto: 26 entradas con español, Terminologia Anatomica, sinónimos y lateralidad |
| e1.6 | Catálogo completo | L | Las 199 entradas restantes por regiones, con los 7 ausentes declarados como excepción |

Dependencias: e1.1 → e1.3 → e1.5 → e1.6; e1.2 → e1.4 → e1.5. Sin ciclos.

## In scope

- **MUST:** el `.glb` sin texturas NC y con atribución; el esquema del catálogo;
  las 199 entradas con nombre español y término de Terminologia Anatomica; la
  prueba de integridad en verde; los 7 huesos ausentes declarados como excepción
  explícita y no como omisión.
- **SHOULD:** identificador FMA por entrada cuando se pueda derivar; el extractor
  reejecutable, para que una futura versión del modelo se pueda comparar contra
  el catálogo en lugar de revisarse a ojo.

## Out of scope

- **Renderizar el modelo** — es E2. Aquí se prueba que la geometría existe y que
  el anclaje es correcto, no que se vea. **Not now.**
- **Espejar el hemicuerpo izquierdo en la escena** — el catálogo declara la
  lateralidad de cada hueso; construir el espejo es trabajo de render. **Not
  now.**
- **Los 7 huesos ausentes** — osículos e hioides exigen vistas propias. Riesgo
  asumido; vuelve como epic propio si el producto lo pide. **Not now.**
- **El apéndice xifoides** — el modelo parte el esternón en manubrio y cuerpo sin
  xifoides. Se decide al poblar el tórax, no antes. **Not now.**
- **Nomenclatura como producto** — validar respuestas y tolerar erratas es del
  motor de test (E4). Aquí solo se cargan los nombres. **Not now.**

## Done when

- Una prueba automática verifica: identificadores únicos, español y Terminologia
  Anatomica presentes en toda entrada, y `meshName` existente en el `.glb` real.
- El catálogo tiene 199 entradas y declara las 7 excepciones.
- El `.glb` del repositorio no contiene ninguna textura NC.
- La atribución CC BY-SA 4.0 está en el repositorio, visible para quien lo clone.
- Todas las historias cerradas · documentación actualizada · retrospectiva hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Traducir 199 nombres al español introduce errores de terminología que un estudiante detectaría | H | H | Región por región, no en bloque; el término latino viaja junto al español en la misma entrada, de modo que un error queda visible al lado de su fuente |
| El nombre de malla resulta no ser una clave estable si AnatomyTOOL publica otra versión | M | M | El extractor de e1.3 es reejecutable: una versión nueva se compara contra el catálogo en vez de revisarse a mano |
| Podar las texturas rompe el modelo o degrada su aspecto más de lo previsto | L | M | Ningún material las usa como color base, verificado; se comprueba abriendo el archivo podado antes de commitearlo |
| El peso de 3,4 MB obliga a trocear el activo por regiones más adelante | M | L | El catálogo ya lleva la región de cada hueso, así que trocear no exigiría rediseñar los datos |
