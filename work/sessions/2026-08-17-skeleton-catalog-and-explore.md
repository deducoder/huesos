# Session 2026-08-17 — De repositorio vacío a esqueleto explorable

## Done

- **Proyecto creado de cero**: gobernanza completa, gates, memoria versionada y
  el core de gemba cableado. Stack: Vite + React + TS estricto, Vitest, Biome,
  Tailwind 4, Node 24.
- **E1 — Activo anatómico** (6 historias, tag `epic/e1-complete`): el modelo
  glTF de AnatomyTOOL en el repositorio sin sus texturas CC BY-NC-SA (1,86 MB,
  44 % menos) y el catálogo de los 206 huesos, 199 anclados a geometría real y
  7 declarados ausentes con su razón.
- **E2 — Explorar el esqueleto** (6 historias, tag `epic/e2-complete`): escena
  3D con react-three-fiber, navegador accesible por teclado de los 206 huesos, y
  panel con nomenclatura bilingüe. Tres proyecciones de un solo estado.
- **b2.1 y b2.2 arreglados**, ambos encontrados por el usuario al abrir la
  aplicación y ambos verificados después en Chromium real: de 2 a 10 huesos
  alcanzables con la misma rejilla de clics.
- **gemba copiado al repositorio** (`.claude/skills/`, 31 skills aplanadas +
  convenciones), para que el método funcione en un Claude Code remoto sin el
  plugin. Las 80 rutas relativas verificadas una a una.
- **Publicado en `github.com/deducoder/huesos`**: `main`, los dos tags y la rama
  `story/s1/browser-integration-suite`.

## Decided

- **El activo es el modelo 3D de AnatomyTOOL, no un SVG de dominio público**
  (ADR-001) — **why:** el SVG libre agrupa los huesos en 43 regiones, y `RF-08`
  exige los 206 como condición de lanzamiento; el glTF trae 199 ya nombrados uno
  a uno. Convierte el cuello de botella en una tarea de conversión.
- **La lista accesible se construye antes que la escena 3D** (ADR-002) —
  **why:** `must-a11y-005` no se puede satisfacer añadiendo accesibilidad
  después, y además deja la aplicación usable si el 3D falla. Se cobró solo:
  con la escena inutilizada por b2.1, la aplicación seguía sirviendo para
  estudiar.
- **El esternón cuenta como un hueso**, anclado a `Body of sternum` — **why:**
  el desglose canónico de 206 lo cuenta una vez aunque el modelo lo parta en
  manubrio y cuerpo. El manubrio queda como malla sin entrada, y eso es legal:
  el anclaje va del catálogo al modelo, nunca al revés.
- **Los 7 huesos ausentes se asumen como riesgo**, no se resuelven — **why:**
  decisión explícita del usuario; osículos del oído e hioides no son visibles en
  ningún esqueleto completo y exigirían vistas propias.
- **Las skills se copiaron aplanadas a un nivel**, no con su jerarquía de
  familias — **why:** `.claude/skills/<nombre>/SKILL.md` es el formato que
  Claude Code descubre con seguridad; anidar dependía de un comportamiento no
  verificable que habría fallado en silencio.
- **La suite de Playwright no se mergeó a `main`** — **why:** `./scripts/check-integration`
  no ha llegado a verde. Mergear gates sin verlos pasar es justo lo que el
  método prohíbe.

## Open

- **La suite de integración no está verificada.** Se reescribió para observar
  las selecciones desde dentro de la página en vez de hacer 64 viajes al
  navegador —que era lo que agotaba el tiempo— pero esa optimización **no se ha
  ejecutado ni una vez**. Vive en `story/s1/browser-integration-suite`,
  publicada y sin mergear.
- Los sinónimos del catálogo se eligieron con criterio propio y nadie los ha
  validado contra cómo escriben los estudiantes. E4 heredará esa deuda.

## Next

Correr `./scripts/check-integration` en la rama `story/s1/browser-integration-suite`
(4-5 minutos) y, si pasa, cerrarla con `/story-close`.

## State

Branch `main` · work item in flight: `s1` (rama publicada, sin mergear) ·
tree: clean
