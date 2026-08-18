---
name: tests-can-defend-the-bug
description: Un test puede afirmar el comportamiento incorrecto, y un matcher tolerante no vigila ninguno de los dos.
metadata:
  type: project
---

Arreglar un defecto puede poner en rojo un test que lo **exigía**. En e9.5
(2026-08-18), corregir «tibia izquierdo» → «tibia izquierda» rompió
`ExploreView.test.tsx:139`, que afirmaba la forma equivocada. Su vecina era
peor: `/^tibia izquierda$|^tibia izquierdo$/i` aceptaba las dos formas, así
que no podía fallar con ninguna y llevaba tiempo sin vigilar nada.

**Why:** un rojo al arreglar algo no significa que el arreglo esté mal; puede
significar que la suite codificó el defecto. Y un matcher con `|` que abarca
la forma correcta y la incorrecta parece prudente y es exactamente lo
contrario: convierte el test en decoración.

**How to apply:** cuando un test se rompa al corregir un defecto, leerlo antes
de tocarlo y preguntar cuál de los dos tiene razón. Y desconfiar de todo
localizador que acepte varias formas de lo mismo — endurecerlo a la única
correcta. Relacionado: [[test-doubles-must-be-able-to-fail-like-the-real-thing]],
[[a-reintroduced-defect-must-actually-break]].
