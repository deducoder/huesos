# Story e5.4: Failed-first selection — Retrospective

Estimated: M (3 tareas) · Actual: M — 3 tareas, sin desbordes, con un test
huérfano encontrado y una sonda rehecha

## Summary

`pickTestableBone` recibe el registro y un sorteo inyectable, y elige con pesos
`max(1, 1 + 3×fallos − 1×aciertos)`. Con esto el outcome del proyecto —"el fallo
dirige el estudio"— queda cumplido y medido: en la aplicación real, un hueso
sembrado con 30 fallos se llevó 10 de 50 preguntas mientras seguían saliendo 32
huesos distintos.

## What went well

- **El corte de tareas funcionó por primera vez en la épica.** El plan juntó
  desde el principio el cambio de firma y sus dos consumidores, porque e5.2 y
  e5.3 ya habían enseñado que separarlos obliga a dejar el gate en rojo. La
  lección viajó de una retrospectiva al plan siguiente y ahorró la fricción.
- **El sorteo inyectado convirtió una impresión en una aserción.** El sesgo se
  comprueba barriendo [0,1) de forma determinista: mismos números, mismo
  resultado. Probarlo con `Math.random` habría producido justo el test
  intermitente que costó dos sesiones en s1.
- **El suelo del peso está escrito como invariante, no como defensa.** El
  comentario dice por qué existe: sin `max(1, …)` un hueso muy acertado tendría
  peso negativo y desaparecería del sorteo, que es la cola estricta que ADR-005
  rechazó. Alguien que lo lea dentro de un año sabrá que quitarlo cambia la
  decisión, no solo el código.
- **La medición manual mostró las dos mitades del ADR a la vez** — insiste y no
  encierra. Un solo número (10/50) habría probado solo la primera.

## What to improve

- **Un test huérfano compiló y falló en ejecución.** El test previo pasaba
  `'femur-right'` donde ahora va un `PickOptions`, y **TypeScript no lo
  atrapó**: un `string` contra un objeto con todas sus propiedades opcionales no
  produce el error que uno esperaría, porque la firma vieja seguía siendo
  asignable en apariencia. Confié en que cambiar una firma rompería la
  compilación de sus consumidores —como sí pasó en e5.3 con la prop requerida— y
  aquí no pasó. **Un objeto de opciones todo-opcional es una firma que no
  protege a sus llamadores viejos.**
- **Mi primera sonda inventó una vía de observación que la aplicación no
  tiene.** Buscaba el `data-hueso` del DOM, que solo existe en los dobles de las
  pruebas unitarias; en la aplicación real `must-data-003` prohíbe exactamente
  eso. Se colgó seis minutos antes de que lo viera. Observar el registro fue
  mejor instrumento y además honesto con lo que el producto expone.

## Learned

1. **About the system:** la ponderación compone. Un hueso sembrado con 30
   fallos sigue acumulando peso mientras se le falla, así que el sesgo se
   refuerza dentro de la propia sesión — 10 de 50 preguntas, contra una cuota
   uniforme de 0,25. Es el comportamiento deseado y conviene saber que es
   acumulativo, no fijo.

2. **About the process:** migrar de parámetros posicionales a un objeto de
   opciones **con todas las propiedades opcionales** deja a los llamadores
   viejos compilando en silencio. El compilador protege al cambiar a una prop
   *requerida* (e5.3) y no al cambiar a un objeto *opcional* (esta). Cuando la
   firma nueva es permisiva, el chequeo de tests huérfanos deja de ser un
   trámite y pasa a ser la única red.

3. **Capability gained:** el outcome "el fallo dirige el estudio" está cumplido,
   con una regla pura, determinista de probar y ajustable sin romper la suite —
   las pruebas fijan el orden, no las cifras.
