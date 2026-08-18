---
name: acceptance-criteria-shouldnt-name-an-untouched-file
description: Un criterio que exige que un archivo no se modifique describe el medio, no el fin, y se rompe con cualquier cambio legítimo.
metadata:
  type: feedback
---

E8 declaró en su «Done when»: «`TestQuestion.test.tsx` sigue en verde **sin
modificarse**». Al cambiar el formato por defecto del test, ese archivo *tenía*
que cambiar — a los casos del formato escrito hubo que pasarles
`answerFormat="open"`. El criterio quedó incumplido en la letra aunque su
intención (que ningún caso del flujo escrito se borrara ni se debilitara) se
cumpliera exactamente.

**Why:** «archivo intacto» es un proxy de «comportamiento intacto», y los
proxies se rompen justo cuando el cambio es legítimo. Peor: invita a cumplirlo
al pie de la letra, duplicando el archivo en vez de tocarlo.

**How to apply:** redactar el criterio sobre lo observable y verificable en el
diff — «ningún caso existente se borra ni se relaja» — que sobrevive al cambio
y se comprueba leyendo las líneas eliminadas. Relacionado con
[[a-reintroduced-defect-must-actually-break]] y
[[test-the-data-after-the-library]].
