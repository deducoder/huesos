# Story e1.1: Incorporate asset — Scope

## User story

As a developer of huesos-mono,
I want the skeleton model inside the repository, stripped of its non-commercial
textures and carrying its attribution,
so that every later story has real geometry to build on without a network fetch
and without dragging a licence the project cannot honour.

## Acceptance criteria

```gherkin
Given el modelo original de AnatomyTOOL con 132 mapas de normales
When se incorpora al repositorio
Then el archivo resultante no contiene ninguna imagen ni textura embebida
And conserva las 144 mallas con sus nombres intactos

Given el archivo incorporado
When se lee su geometría
Then las mallas siguen siendo las mismas que las del original, malla por malla

Given un desarrollador que clona el repositorio
When busca de dónde salió el modelo
Then encuentra la atribución CC BY-SA 4.0 junto al archivo
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `overview-skeleton.glb`, 3,4 MB, 132 imágenes, 133 texturas | Podar texturas e incorporar | `src/data/skeleton.glb` con 0 imágenes, 0 texturas y las mismas 144 mallas nombradas |

## In scope

- Podar del `.glb` las imágenes, texturas, samplers y las referencias
  `normalTexture` de los materiales.
- Dejar el archivo podado en `src/data/skeleton.glb`.
- Escribir `src/data/ATTRIBUTION.md` con la cadena de autoría y la licencia.
- Un script reejecutable que haga la poda, para que el paso sea auditable y no
  un binario aparecido de la nada.

## Out of scope

- **Cargar o renderizar el modelo** — es E2; aquí el archivo solo tiene que
  existir y estar íntegro.
- **Espejar el hemicuerpo izquierdo** — el catálogo declarará la lateralidad;
  el espejo es trabajo de render.
- **Recomprimir o trocear la geometría** — el peso se mide cuando estorbe, no
  antes (ratonera declarada en el brief de e1).
- **Quitar dientes y cartílagos** — son mallas legítimas del modelo; el catálogo
  decide qué es hueso, no el archivo.

## Done when

- `src/data/skeleton.glb` existe y no contiene ninguna textura.
- Sus nombres de malla coinciden uno a uno con los del original.
- `src/data/ATTRIBUTION.md` nombra a AnatomyTOOL/CASK, BodyParts3D y Z-Anatomy,
  y declara CC BY-SA 4.0.
- `./scripts/check` pasa en verde.

## Notes

Decidido en ADR-001: el modelo es el activo y la fuente de verdad del catálogo.
La poda de texturas no es cosmética — las texturas son CC BY-NC-SA mientras el
resto del modelo es CC BY-SA 4.0, y ningún material las usa como color base,
verificado en la investigación «skeleton asset» del 2026-08-16.
