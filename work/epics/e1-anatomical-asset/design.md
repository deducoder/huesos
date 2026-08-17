# Epic e1: Anatomical asset — Design

## Gemba findings

- **`src/` está vacío de dominio.** Solo `App.tsx` (un encabezado), `main.tsx` y
  `index.css`. No hay nada que duplicar ni que extender: este epic es net-new y
  crea la primera capa de datos del proyecto.
- **No hay ningún test todavía.** `scripts/check` corre con `--passWithNoTests`,
  y el README declara que la bandera se quita con el primer test. Este epic trae
  ese primer test, así que **e1.2 debe quitarla** — a partir de ahí, cero tests
  es un gate rojo.
- **Las capas están declaradas pero no construidas** en la arquitectura del
  proyecto: `data`, `domain`, `state`, `features`, `components`. Este epic
  construye solo `data`, y respeta el contrato ya escrito de que esa capa es
  datos puros, sin lógica ni dependencias de React.
- **El activo ya fue inspeccionado** en la investigación «skeleton asset»
  (2026-08-16): 144 mallas, 118 óseas, 199 de 206 verificadas por región. No hay
  que volver a descubrir el archivo, solo incorporarlo.
- **El repositorio ya trae `records/decisions/`** con ADR-001, escrito en este
  mismo diseño.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/data/skeleton.glb` | create | El activo podado, sin texturas NC |
| `src/data/ATTRIBUTION.md` | create | Atribución CC BY-SA 4.0 a AnatomyTOOL, BodyParts3D y Z-Anatomy |
| `src/data/bone.ts` | create | Tipos `Bone`, `BoneRegion`, `Side` — datos puros |
| `src/data/catalog.ts` | create | Las 199 entradas y las 7 excepciones declaradas |
| `src/data/catalog.test.ts` | create | La prueba de integridad de `must-data-002` |
| `scripts/inventory-model.mjs` | create | Extractor reejecutable del `.glb` |
| `package.json` | modify | Quitar `--passWithNoTests` al llegar el primer test |

## Key contracts

- El `id` de un hueso es un slug estable en inglés y en kebab-case (`femur-left`),
  independiente del nombre de malla: si el modelo cambia su nomenclatura, cambia
  `meshName`, nunca `id`.
- `meshName` es la clave de anclaje con la geometría y debe existir en el `.glb`;
  una entrada sin malla existente solo es legal si está en la lista de excepciones
  declaradas.
- Toda entrada lleva nombre en español y término en Terminologia Anatomica; los
  sinónimos aceptados son una lista, posiblemente vacía, nunca ausente.
- La lateralidad es `left`, `right` o `null`; un hueso impar nunca lleva lado, y
  un hueso par siempre lo lleva.
- El catálogo es un módulo de datos: no importa React, ni el DOM, ni
  `localStorage`, ni lee del sistema de archivos en tiempo de ejecución.
- El extractor de inventario es una herramienta de desarrollo: vive en `scripts/`,
  no entra en el bundle, y su salida se revisa antes de convertirse en catálogo.

## Decisions (ADRs)

- **ADR-001**: El modelo glTF de AnatomyTOOL como activo y fuente de verdad del
  catálogo — cubre 199 de 206 huesos ya nombrados, frente a las 43 regiones
  agrupadas del mejor activo 2D; la elección de render queda diferida a E2.

## Legacy sweep

Nada queda huérfano — el epic es net-new. La única modificación sobre lo
existente es quitar `--passWithNoTests` de `package.json`, que era temporal por
diseño y estaba declarado como tal en el README desde el primer commit.
