# Story e1.6: Complete catalog — Retrospective

Estimated: L (5-8 tareas) · Actual: L, 5 tareas y 2 commits — menos commits de
los que la historia merecía

## Summary

El catálogo tiene los 206 huesos: 199 anclados a la geometría del modelo y 7
declarados ausentes con su razón. El recuento por región coincide con el
desglose canónico y está fijado en el gate. La única malla ósea del modelo sin
entrada es el manubrio, por la decisión explícita de contar el esternón como un
solo hueso.

## What went well

- **El anclaje de e1.4 sostuvo 173 transcripciones nuevas sin una sola errata.**
  Los nombres de malla del modelo son irregulares —`2d` en unas falanges y `3rd`
  en otras, `Scapula.r.` con punto sobrante— y cualquier fallo habría salido en
  el gate nombrando la entrada. La secuenciación por riesgo del plan del epic se
  pagó entera aquí.
- **La prueba por región atrapó un error de modelado, no de tecleo.** El fallo
  no fue un nombre mal escrito: fue que `isUnpaired` no reconocía el esternón
  como impar, porque en e1.2 se habían anticipado tres ids que la decisión de
  esta historia descartó.
- **La decisión del esternón se tomó en el scope y se verificó en T5.** No quedó
  como sorpresa al final: se declaró que sobraría el manubrio y sobró
  exactamente el manubrio.

## What to improve

- **Un commit para 180 entradas es demasiado grosero.** El plan pedía tres
  bloques y se ejecutó como uno. Si algo hubiera que revertir, el retroceso
  disponible es todo o nada. Es la lección más cara de la historia y no tiene
  excusa técnica: el volumen invita a commitear una vez, y hay que resistirlo.
- **Los sinónimos siguen sin validar con estudiantes reales.** Se ampliaron
  —`omóplato`, `choquezuela`, `unciforme`, `ilíaco`— con criterio propio. E4 va a
  heredar esa deuda y descubrirá qué falta cuando alguien responda algo
  razonable que el catálogo rechace.
- **El FMA se dejó fuera.** Era SHOULD en el epic y no se hizo. Queda dicho, no
  escondido: el catálogo no tiene identificadores de ontología.

## Learned

1. **About the system:** el modelo mezcla convenciones dentro de una misma
   familia de huesos —`Distal phalanx of 3d finger` frente a `Middle phalanx of
   3rd finger`—, así que ningún nombre de malla se puede derivar por regla. Toda
   herramienta futura tiene que leer la lista real, nunca construirla.
2. **About the process:** cuando una historia es volumen, las aserciones tienen
   que cubrir **estructura, recuento y forma** a la vez. Aquí las tres capas
   —206 en total, el reparto por región, y los dos lados de cada hueso par—
   convirtieron 180 entradas generadas en 180 entradas verificadas.
3. **Capability gained:** el catálogo está completo y es el contrato de datos
   que E2 esperaba. La lateralidad, las regiones y las ausencias están
   declaradas, así que el render puede espejar y agrupar sin decidir anatomía.
