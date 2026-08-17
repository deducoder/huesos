# Story e7.4: Navegador de huesos en móvil — Retrospective

Estimated: L, 5-8 tareas · Actual: L, 6 commits de código (4 planeadas + una no
prevista que rompió un contrato propio a propósito + un arreglo de tipos de la
revisión). La talla acertó; el plan no anticipó el hallazgo más importante de
la historia.

## Summary

Cada par de huesos con geometría comparte fila —nombre común más dos píldoras
de 44 px, `min-h-tactil`— y cada par sin geometría en ningún lado colapsa a una
sola fila sin distinguir lado, decisión tomada con el usuario durante la
verificación en dispositivo. `toNavigatorRows`, una función pura de veinte
líneas, hace el emparejamiento sin perder nunca un hueso. El desplazamiento
total con los 206 huesos bajó de 6.208 a 5.832 px —un 6%, no el 8% proyectado,
y la diferencia quedó explicada—. 219 tests unitarios y 11 de navegador en
verde.

## What went well

- **Prototipar con Playwright antes de escribir el componente evitó una
  decisión cara mal tomada.** Tres opciones de CSS midieron 9.504, 7.712 y
  5.720 px proyectados; sin esa medición, la intuición «emparejar es
  obviamente mejor» habría llevado a una implementación con relleno normal que
  de hecho empeoraba el desplazamiento un 24%.
- **Verificar la adyacencia de los pares antes de asumirla.** Se comprobó
  contra las 206 entradas reales —no solo un ejemplo— tanto en el catálogo
  completo como dentro de cada grupo de región, antes de escribir una función
  que dependiera de esa propiedad.
- **El contrato de accesibilidad sobrevivió un cambio de estructura completo.**
  `BoneNavigator.test.tsx` protegió el rediseño de T1-T2 sin tocarse — la
  prueba de que la apuesta de e7.1 («la suite protege, no estorba») sigue
  siendo cierta.
- **Cuando el usuario interrumpió con una duda concreta, verificarla con
  captura antes de responder.** «¿Por qué el oído muestra derecho e
  izquierdo?» se contestó con una captura y el `aria-describedby` real, no de
  memoria — y eso fue lo que permitió ver que había una decisión de producto
  real detrás, no solo una curiosidad.

## What to improve

- **El diseño no anticipó el caso de los pares sin geometría en ningún lado.**
  Los seis huesos del oído son exactamente el caso límite que el patrón
  general —«un par comparte fila»— no cubre bien: ofrecer dos píldoras
  idénticas en todo lo observable es ruido, no información. El gemba de e7.4
  sabía que existían 34 huesos impares y 172 pares, pero no cruzó ese dato
  con «¿cuáles de los pares son totalmente ausentes?» — la intersección de dos
  hechos ya conocidos que nadie hizo hasta que el usuario lo vio en pantalla.
- **La proyección del prototipo (8%) no se sostuvo al implementar (6%), y la
  primera versión ni siquiera llegaba al 1%** — el `py-0.5` que agregué por
  costumbre visual no estaba en el prototipo validado. Un prototipo que
  decide una cifra tiene que reproducirse literal en el componente real, o la
  cifra deja de ser una garantía y pasa a ser una aspiración.
- **Un test roto a propósito por una decisión nueva es distinto de un test
  roto por descuido, y vale la pena decirlo así en el momento** — se hizo
  bien acá (se explicitó el conflicto con el Must del scope antes de tocar el
  archivo), pero es la clase de situación que un plan no puede prever y que
  exige pausar y mostrar el conflicto, no resolverlo en silencio.

## Learned

1. **About the system:** dos bytes de datos que ya existían —`side` y
  `meshName`— codifican una tercera pregunta que nadie había hecho todavía:
  «¿este par es indistinguible en todo lo observable?». `isUnpaired` responde
  si un hueso es impar; no existía (ni hacía falta hasta ahora) una función
  equivalente para «par pero indistinguible en la interfaz». La respuesta vive
  en la vista (`meshName === null` en ambos lados), no en el dominio, porque es
  una pregunta sobre qué se puede *mostrar*, no sobre qué es el hueso.
2. **About the process:** un prototipo aislado en HTML mide bien la forma,
  pero no reproduce automáticamente el componente real — cualquier clase que
  se agregue por costumbre entre el prototipo y el componente (un `py-0.5` de
  «un poco de aire») se come parte de la ganancia que el prototipo prometía.
  La medición final tiene que hacerse sobre el componente que se va a mergear,
  no solo confiar en la del prototipo.
3. **Capability gained:** ya existe el patrón para narrow un campo `Side` a un
  literal (`'right'`/`'left'`) sin `as`, usando funciones con `is` en vez de
  una comparación inline — la comparación simple perdía el estrechamiento a
  través de una intersección de tipos union (`Bone & { side: 'right' }`), y el
  `is` predicate lo resuelve limpio. Reutilizable la próxima vez que un campo
  compartido entre los miembros de una unión necesite estrecharse para
  construir un tipo más específico.

## Para el plan de e7.5

- **Antes de diseñar cualquier lista o vista que agrupe pares, cruzar
  explícitamente «¿cuáles de estos pares son indistinguibles en lo que se
  puede mostrar?»** — no asumir que «es par» implica «vale la pena distinguir
  lado en la interfaz». `BoneIdentity` (e7.5) muestra el campo «Lado»
  siempre que el hueso lo tiene; vale la pena revisar si eso también necesita
  el mismo matiz para martillo/yunque/estribo, ya que ahora la lista los
  presenta sin lado y el panel podría desentonar mostrándolo.
- **Medir el componente real, no solo el prototipo**, antes de declarar una
  cifra de mejora en el design. Si e7.5 prototipa algo, la cifra final va en
  `progress.md` con el número real, y el `design.md` puede quedar con la
  proyección sin corregirse — el delta se documenta donde corresponde, como
  se hizo acá.
