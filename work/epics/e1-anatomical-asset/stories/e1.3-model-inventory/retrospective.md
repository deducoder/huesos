# Story e1.3: Model inventory — Retrospective

Estimated: M (3-5 tareas) · Actual: M, 4 tareas y 3 commits — dentro de lo
estimado

## Summary

`scripts/inventory.mjs` clasifica cada malla en hueso, diente, cartílago o
sesamoideo y le separa la lateralidad; `scripts/inventory-model.mjs` lo aplica al
modelo y emite la lista, filtrable por tipo y en JSON. Los cuatro totales quedan
fijados en el test contra el modelo real.

## What went well

- **El recuento quedó clavado en un test, no en un informe.** La investigación
  había medido 118 estructuras óseas; ahora esa cifra es una aserción que se
  rompe si el modelo cambia. Una medición que envejece en un documento es una
  cifra; la misma medición en un gate es una garantía.
- **El clasificador salió a la primera contra el conjunto entero.** Los siete
  casos elegidos para el RED resultaron representativos: al aplicarlo a las 144
  mallas no hubo que ajustar nada.
- **La herramienta es reejecutable por diseño.** Cuando AnatomyTOOL publique otra
  versión, comparar contra el catálogo es un comando, no una revisión a ojo.

## What to improve

- **Se planificó un RED para T2 que no podía darse.** La medición ya existía en
  la investigación, así que el test nacía verde por construcción. Cuando una
  historia formaliza una medición previa, lo honesto es planificarla como
  *fijación*, no como descubrimiento, y decirlo en el plan.
- **Dos artefactos en un commit.** La convención pide uno por artefacto; se
  ejecutó mal y se anotó en vez de reescribir la historia.

## Learned

1. **About the system:** el modelo mezcla convenciones de nomenclatura —sufijo
   `.r`, palabra `left`/`right`, y un `Scapula.r.` con punto sobrante—. Cualquier
   herramienta futura que lea estos nombres tiene que asumir irregularidad, no
   un esquema uniforme.
2. **About the process:** un test que fija una medición ya conocida es
   legítimo y valioso, pero **no es TDD** y no hay que disfrazarlo de RED. La
   diferencia importa: TDD descubre comportamiento, la fijación lo congela.
3. **Capability gained:** poblar el catálogo ya no exige mirar un visor 3D:
   `node scripts/inventory-model.mjs --kind=bone` da la lista exacta a
   transcribir, y el gate de e1.4 atrapa cualquier errata al hacerlo.
