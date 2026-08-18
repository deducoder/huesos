---
name: keeping-old-content-mounted-can-duplicate-text
description: Si un panel que antes reemplazaba una vista pasa a convivir con ella, un texto que antes era único puede repetirse — una búsqueda sin acotar deja de ser inequívoca.
metadata:
  type: project
---

En e9.2 (2026-08-18), la grilla de opciones del test pasó de ser
**reemplazada** por un panel de resultado a **quedarse montada y
recalificarse**. Consecuencia no obvia: el nombre del hueso, que antes solo
vivía en el panel de texto, ahora también aparece en el botón de la opción
correcta (capitalizado, vía `shortName`). Para 45 de 120 huesos —los que
`shortName` solo capitaliza sin acortar— buscar `bone.es` en todo el
documento (`getByText(bone.es, {exact:false})`) encontraba **dos**
coincidencias case-insensitive y el test reventaba con «multiple elements
found», dependiendo de qué hueso sorteara `pickTestableBone`.

**Why:** una búsqueda de texto que era inequívoca cuando solo existía un
lugar donde ese texto podía aparecer deja de serlo en cuanto una historia
hace que dos vistas convivan en vez de excluirse.

**How to apply:** al cambiar un componente de "sustituir" a "convivir",
revisar toda búsqueda de texto sin acotar (`screen.getByText` sobre todo el
documento) y acotarla al contenedor específico (`within(...)`) donde el
texto es inequívoco. Relacionado: [[test-doubles-must-be-able-to-fail-like-the-real-thing]].
