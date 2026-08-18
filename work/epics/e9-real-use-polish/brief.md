# Epic e9: Pulido de uso real — Brief

## Hypothesis

Para quien estudia anatomía con la aplicación en su propio teléfono, que hoy
tropieza con roces que ninguna suite ve —el «atrás» del sistema cierra la
aplicación, huesos anchos que se salen del encuadre o quedan detrás de la
ficha, nombres de 44 caracteres que no caben en un botón, un resultado de test
que dice «Incorrecto» sin señalar cuál era la correcta—, **E9 es una pasada de
corrección sobre lo ya construido** que hace que la aplicación se sienta
terminada al **usarla**, no solo al probarla. A diferencia de E7 y E8, que
persiguieron un mockup, esta épica parte de nueve observaciones hechas con la
aplicación en la mano.

## Success metrics

- **Leading:** cada uno de los nueve puntos queda reproducible antes de
  tocarlo —dicho en su historia o su bug, no supuesto—, y la primera historia
  cierra al menos uno verificado en el teléfono real, no solo en la suite.
- **Lagging:** un recorrido completo en el teléfono —Explorar → ficha →
  test de esqueleto → test de hueso aislado— sin que aparezca ninguno de los
  nueve roces, y con el «atrás» del sistema recorriéndolo hacia atrás en vez
  de salir del sitio.

## Appetite

M — 5-7 historias.

Los nueve puntos no son nueve trabajos: se agrupan por la zona de código que
tocan. `@theme` y el estado post-respuesta (color de selección, rojo/verde),
`IsolatedBoneScene` (encuadre, rotación), `SkeletonScene` (zoom a la
selección), el catálogo y sus etiquetas (nombres cortos, capitalización),
`App.tsx` (historial, cabecera, menú). Repartirlos por zona da seis o siete
historias; repartirlos por punto daría nueve que se pisan entre sí.

## Scope boundaries

### No-gos

- **No se adopta un router de cliente.** El «atrás» del sistema se resuelve
  con la History API sobre el selector de modo que ADR-003 ya eligió. Traer
  `react-router` es exactamente la dependencia que ese ADR rechazó, y nada en
  E9 pide URLs compartibles, marcadores ni enlaces profundos por hueso —
  **nunca** dentro de esta épica; si algún día se piden, es otro ADR y otra
  épica.
- **No se toca el activo 3D.** `skeleton.glb`, su geometría y sus materiales
  quedan intactos: los puntos de encuadre, zoom y rotación son de cámara y
  controles. Tocar el material del modelo ya está declarado no-go desde e7.2.
- **No se inventa contenido anatómico.** El nombre corto se deriva del nombre
  que ya está en el catálogo; ninguna ficha gana texto que nadie escribió —
  el mismo criterio que e8.5 fijó para `articulatesWith` y `clinicalNote`.
- **El nombre completo no se pierde.** El acortado es de presentación: el
  catálogo conserva su `es` íntegro y la ficha completa lo sigue mostrando.
  Un acortado que borre el discriminante —las 28 falanges de la mano
  colapsando a tres etiquetas— haría indistinguibles las opciones del test.

### Rabbit holes

- **Rediseñar el sistema de color entero.** El punto de la selección cambia
  **un** color. Los 14 literales hexadecimales que viven fuera de `@theme` y
  el gate que vigila la regla equivocada están aparcados para una épica de
  consolidación (parking lot, 2026-08-17) y siguen aparcados.
- **Convertir la aplicación en PWA.** El aviso de privacidad tienta con un
  manifiesto, y el historial tienta con «ya que estamos». Ni el uno ni el
  otro lo necesitan.
- **Animar la transición de cámara.** El zoom hacia la selección puede ser un
  salto. Interpolarlo es la animación que E7 aparcó con disparador propio, y
  cuesta rendimiento en el mismo teléfono que `should-perf-007` vigila.
- **Reescribir `TestQuestion`.** Cambia el estado posterior a la respuesta,
  no el componente: sus pruebas son hoy el gate de `must-data-003` y
  `must-data-010`, y rehacerlo entero deja esos dos guardrails sin vigilancia
  mientras dure la historia.
- **Derivar los 206 nombres cortos de una regla y no mirar el resultado.** El
  catálogo es irregular por naturaleza; generar sin leer la lista real es el
  error que b2.1 ya cobró una vez.
