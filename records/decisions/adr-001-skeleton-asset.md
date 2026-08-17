---
type: adr
id: ADR-001
title: "El modelo glTF de AnatomyTOOL como activo y fuente de verdad del catálogo"
status: accepted
date: 2026-08-16
epic: e1
---

# ADR-001: El modelo glTF de AnatomyTOOL como activo y fuente de verdad del catálogo

## Status

Accepted

## Context

`RF-08` fija los 206 huesos como **condición de lanzamiento**, y `must-data-002`
exige que toda entrada del catálogo tenga geometría existente. Eso convierte la
elección del activo anatómico en la decisión que gobierna el proyecto entero: no
es un detalle de presentación, es lo que determina si el criterio de lanzamiento
es alcanzable o no.

La tensión es entre **cobertura** y **coste de entrega**. Un activo 2D ligero es
barato de servir y accesible casi gratis, pero los que existen agrupan los huesos
por región. Un activo 3D cubre hueso por hueso, pero pesa, exige WebGL y complica
`must-a11y-005`.

La investigación «skeleton asset» (2026-08-16) midió ambos abriendo los archivos:

Options:

- **(A) SVG 2D de dominio público** (LadyofHats, Wikimedia Commons) — 862 KB, 304
  KB con gzip, ids semánticos ya puestos, accesibilidad por roles casi gratis,
  licencia sin obligaciones. **Falla en cobertura:** son 43 regiones agrupadas,
  no huesos. `CarpalsLeft` es los ocho carpianos juntos; las costillas ni siquiera
  tienen id. Llegar a los 206 de `RF-08` significaría etiquetar a mano cientos de
  subgrupos anónimos — exactamente el trabajo que hunde el proyecto.
- **(B) Modelo glTF de AnatomyTOOL / CASK Anatomy** — 144 mallas nombradas hueso
  por hueso, **199 de los 206** verificados región por región contra el desglose
  canónico. Cuesta 3,4 MB con Draco, WebGL, y una lista accesible paralela para
  no incumplir `must-a11y-005`.
- **(C) Dibujar o modelar desde cero** — control total sobre cobertura y peso, a
  cambio de semanas de ilustración anatómica. Violaría el primer no-go del brief
  de e1 y el apetito declarado.
- **(D) Híbrido: el 3D como fuente de datos, siluetas SVG proyectadas para
  render** — daría la cobertura de (B) con el peso y la accesibilidad de (A). No
  está verificado que la proyección produzca siluetas legibles por hueso, y
  averiguarlo cuesta un spike que hoy no está hecho.

## Decision

**Opción (B), con una parte deliberadamente diferida:**

1. El activo del proyecto es `overview-skeleton.glb` de AnatomyTOOL / CASK
   Anatomy, incorporado al repositorio bajo `src/data/`.
2. Ese modelo es la **fuente de verdad del catálogo**: el nombre de malla de cada
   hueso (`Femur.r`, `Atlas (C1)`) es la clave que ancla la entrada del catálogo
   a su geometría, y `must-data-002` se verifica contra el archivo real.
3. Los 132 mapas de normales embebidos **se eliminan** antes de incorporarlo: son
   CC BY-NC-SA mientras el resto es CC BY-SA 4.0, y ningún material los usa como
   color base. El activo derivado se publica CC BY-SA 4.0 con atribución a
   AnatomyTOOL, BodyParts3D y Z-Anatomy.
4. Los siete huesos ausentes — los seis huesecillos del oído medio y el hioides —
   se declaran como excepción explícita en el catálogo. Riesgo asumido por
   decisión del 2026-08-16; no se cubren en e1.
5. **Diferido hasta E2:** si el render final es 3D con react-three-fiber o SVG
   proyectado desde este mismo modelo (opción D). El catálogo se diseña para
   servir a ambos, y la elección se toma cuando haya una historia de render que
   la obligue — no antes.

## Consequences

**Positive:**

- `RF-08` pasa de «etiquetar cientos de regiones a mano» a «convertir un modelo
  que ya viene nombrado»: 199 de 206 sin trabajo de ilustración.
- Cubre los craneales profundos —etmoides, esfenoides, vómer, lagrimal, palatino,
  cornete inferior— que ninguna vista externa 2D puede mostrar.
- Cada hueso trae su lateralidad y su nivel explícitos (`Atlas (C1)`, `Rib
  (7th).r`), lo que da al catálogo una clave natural y estable.
- Al anclar el catálogo a nombres de malla, `must-data-002` deja de ser una
  promesa y pasa a ser una prueba ejecutable contra el archivo.

**Negative / costs:**

- **3,4 MB** frente a los 304 KB del SVG comprimido: rompe `should-perf-007` tal
  como está escrito. Aceptable porque es un `should`, el activo se cachea tras la
  primera carga y la alternativa incumple un `must` (`RF-08`).
- **`must-a11y-005` se encarece.** Un canvas WebGL no expone rol ni nombre
  accesible por hueso; habrá que mantener una lista accesible paralela. En SVG
  salía casi gratis. Es el precio de la cobertura.
- **ShareAlike.** Espejar, renombrar y podar produce obra adaptada: el activo
  derivado queda CC BY-SA 4.0. No afecta al código de la aplicación, pero sí
  impide tratar el modelo como propietario.
- **El modelo trae solo el hemicuerpo derecho** más las piezas impares: el
  esqueleto completo exige espejar, y el espejado tiene que preservar la
  identidad de cada hueso para no romper el anclaje del catálogo.
- **Sin garantía de exactitud anatómica.** Sus autores lo declaran expresamente.
  Se adopta como está; no somos la autoridad anatómica.

## Alternatives considered

- **(A) SVG 2D de dominio público:** rechazada por cobertura. Sus 43 regiones
  agrupadas no pueden satisfacer `RF-08` sin el trabajo manual masivo que el
  primer no-go del brief de e1 prohíbe. Sigue siendo la mejor base *2D* y es la
  candidata natural si algún día se revierte esta decisión.
- **(C) Dibujar o modelar desde cero:** rechazada por apetito. Semanas de
  ilustración anatómica contra un apetito M de 5-7 historias.
- **(D) Híbrido con siluetas proyectadas:** no rechazada — **diferida**. Es
  atractiva y puede acabar siendo la respuesta correcta para el render, pero
  requiere un spike que mida si la proyección produce siluetas legibles. Esta
  decisión la deja viva: al hacer del modelo la fuente de datos y no del render,
  (D) sigue disponible sin coste hundido.
