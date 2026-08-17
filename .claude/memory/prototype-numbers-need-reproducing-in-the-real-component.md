---
name: prototype-numbers-need-reproducing-in-the-real-component.md
description: Un prototipo aislado en HTML mide la forma correctamente, pero cualquier clase añadida por costumbre entre el prototipo y el componente real se come parte de la ganancia proyectada — la cifra final se mide sobre lo que se va a mergear, no se hereda del prototipo.
metadata:
  type: process
---

En e7.4, un prototipo de tres layouts en HTML puro midió con Playwright que
emparejar filas de huesos bajaría el desplazamiento total de 6.208 a 5.720 px
—un 8%—. El componente real, escrito siguiendo ese diseño, midió **6.176**
—un 0,5%— en su primera versión: un `py-0.5` de «un poco de aire entre filas»,
agregado por costumbre visual y ausente del prototipo, se comió casi toda la
ganancia. Quitarlo bajó a 5.832 —un 6%—, más cerca pero todavía sin igualar
la proyección, por otra diferencia menor (`gap-y-1` que el prototipo tampoco
tenía).

**Por qué importa:** un prototipo aislado prueba que una forma es *posible*,
no que el componente terminado la *tendrá*. Cualquier clase de relleno,
margen o separación añadida entre el archivo de prueba y el componente real
—casi siempre por costumbre, no por decisión— cambia el número sin que nadie
lo note hasta medir.

**How to apply:** cuando un prototipo produce una cifra que entra en el
`design.md` como criterio de aceptación, medir esa misma cifra **sobre el
componente real** antes de cerrar la historia, no confiar en la del
prototipo. Si el número real no alcanza la proyección, no ajustar el criterio
para que pase: investigar la diferencia (suele ser una clase concreta) y
decidir con evidencia si vale la pena el costo visual de recuperarla.
