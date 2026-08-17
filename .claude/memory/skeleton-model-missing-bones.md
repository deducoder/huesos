---
name: skeleton-model-missing-bones
description: Los 7 huesos que el modelo 3D de AnatomyTOOL no trae, y la decisión de asumir ese riesgo en vez de corregir RF-08.
metadata:
  type: project
---

El modelo `overview-skeleton.glb` de AnatomyTOOL cubre **199 de los 206 huesos**.
Faltan exactamente 7, y no por descuido del modelo: ninguno es visible en un
esqueleto completo.

| Hueso | Cuántos | Por qué no está |
|---|---:|---|
| Martillo (*malleus*) | 2 | Dentro de la cavidad timpánica, en el temporal |
| Yunque (*incus*) | 2 | Ídem |
| Estribo (*stapes*) | 2 | Ídem |
| Hioides (*os hyoideum*) | 1 | No articula con ningún otro hueso; flota en el cuello |

El apéndice xifoides tampoco está: el modelo parte el esternón en manubrio y
cuerpo, y el conteo canónico de 206 trata el esternón como un solo hueso. No
cuenta para la brecha de 7, pero es materia de examen y habrá que decidir si se
añade.

**Decisión tomada el 2026-08-16: se asume el riesgo.** No se corrige `RF-08`
(«los 206 completos como condición de lanzamiento») ni `must-data-002` antes de
empezar E1. La consecuencia aceptada: el test de integridad del catálogo va a
tener que declarar estos 7 como excepción explícita, o fallará por diseño. Si
más adelante se quieren cubrir de verdad, la vía es una vista propia — cráneo
despiezado y oído medio — no el esqueleto completo.

Ver el detalle y las fuentes en `work/research/skeleton-asset/report.md`.
Relacionado: [[catalog-integrity-test]], [[adr-001-skeleton-asset]].
