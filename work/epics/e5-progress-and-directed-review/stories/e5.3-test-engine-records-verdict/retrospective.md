# Story e5.3: Test engine records its verdict — Retrospective

Estimated: M (4 tareas) · Actual: S-M — 4 tareas planificadas, 3 commits de
código, y el riesgo principal disuelto por el gemba antes de escribir nada

## Summary

`TestQuestion` anota el veredicto de cada respuesta en el almacén compartido, y
las dos variantes de test lo alimentan sin código que las coordine — montan el
mismo componente. Con esto el camino completo de `RF-09` existe de punta a
punta y quedó verificado en Chromium: responder, recargar, y el registro sigue
ahí.

## What went well

- **El gemba disolvió el riesgo principal de la historia antes de codificar.**
  El `plan.md` de la épica anticipaba que "la plomería del estado sería el
  trabajo real". Leer el código mostró que **el progreso no se renderiza**
  —mostrarlo está declarado fuera de la épica—, así que no hay nada que
  re-renderizar, no hace falta estado de React, ni levantarlo a `App`, ni pasar
  props por dos componentes que hoy no reciben ninguna. El riesgo no se mitigó:
  desapareció al mirar.
- **El almacén fluye como ya fluía `catalog`.** Cero patrón nuevo: las vistas
  concretas pasan la dependencia, el componente compartido la recibe. Eso hizo
  que inyectar un doble en las pruebas no costara nada.
- **"Ambas variantes al mismo registro" salió gratis** porque E4 ya había puesto
  el único `responder()` en `TestQuestion`. Instrumentar un punto cubrió `RF-04`
  y `RF-05` a la vez. El diseño de E4 se cobró aquí.
- **Los tipos hicieron de plan.** Hacer `store` requerida convirtió "falta
  conectar las dos vistas" en dos errores de compilación, en vez de en algo que
  recordar.

## What to improve

- **Segundo corte de plan inseparable en la misma épica.** T2 (registrar) y T3
  (conectar las vistas) resultaron un solo cambio: la prop requerida rompe las
  dos vistas en el mismo instante. Commitear T2 sola habría exigido dejar el
  gate en rojo. En e5.2 pasó lo mismo con T1/T2. **El patrón ya es visible: si
  una tarea cambia una firma que otra tarea consume, no son dos tareas.**
  Merece entrar en el plan de e5.4 como criterio, no como sorpresa.
- **Volví a arrancar el gate y el commit en la misma tanda** en T1, aunque esta
  vez el gate estaba verde. La corrección que escribí en la retrospectiva de
  e5.2 no llegó a cambiar la mecánica; que saliera bien fue suerte, no
  disciplina.
- **Mi sonda de T4 se dio un falso positivo** con un regex que casaba
  "Incorrect" dentro de "Incorrecto", y por un momento pareció una fuga de
  progreso a la interfaz. Se resolvió imprimiendo la pantalla entera en vez de
  confiar en el booleano. Una comprobación que solo dice sí/no no permite
  distinguir un hallazgo de un error de la comprobación.

## Learned

1. **About the system:** que el progreso no se muestre no es un detalle de
   alcance, es lo que determina su arquitectura. Un dato que no se renderiza no
   necesita estado de React, y eso elimina de un golpe la plomería, la elevación
   de estado y el riesgo entero que la épica había anticipado. **Antes de
   decidir dónde vive un estado, preguntar si algo lo dibuja.**

2. **About the process:** un riesgo anticipado en el plan de una épica es una
   hipótesis escrita antes de leer el código de la historia. Este se evaporó al
   leerlo. Vale la pena revisar los riesgos heredados **en el diseño de la
   historia**, no arrastrarlos hasta la implementación: cargar con un riesgo
   inexistente distorsiona la talla y el orden.

3. **Capability gained:** `RF-09` está cumplido en su observable literal, y
   verificado donde tenía que verificarse. E5 tiene su esqueleto andante y e5.4
   ya tiene un registro real que ponderar.
