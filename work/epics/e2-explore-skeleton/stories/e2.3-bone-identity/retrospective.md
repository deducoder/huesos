# Story e2.3: Bone identity — Retrospective

Estimated: S · Actual: S, 2 commits

## Summary

El panel muestra el hueso elegido con sus dos nomenclaturas, su región, su lado
y sus sinónimos, explica los que no se pueden señalar en el esqueleto, y anuncia
cada cambio en una región viva. Con `ExploreView` compuesta, **el walking
skeleton del epic está cerrado**: la aplicación ya sirve para estudiar sin una
línea de WebGL.

## What went well

- **El tercer canal de `must-a11y-005` quedó cerrado.** La selección se comunica
  por `aria-pressed` en la lista, por texto en el panel y por anuncio en
  `aria-live`. El color acompaña, nunca informa solo.
- **La duplicación se resolvió cuando apareció, no antes.** `labels.ts` se
  extrajo al haber dos consumidores reales; en e2.2 habría sido especulación.
- **El estado vacío orienta en vez de quedarse en blanco**, y dice las dos formas
  de usar la aplicación: la lista con teclado o el esqueleto con clic.

## What to improve

- **Dos pruebas se escribieron ambiguas y fallaron por contenido correcto.**
  Buscar por texto suelto en un panel que repite información a propósito
  —lista de datos más anuncio en vivo— produce colisiones. La lección: **en un
  componente accesible la información aparece más de una vez por diseño**, así
  que las aserciones deben anclarse a un rol concreto, no a un texto.
- **Descubrí de rebote que hay huesos cuyo nombre coincide en ambos idiomas**
  —tibia, atlas, axis, vómer—. No es un problema, pero E4 lo va a encontrar al
  validar respuestas: aceptar «tibia» no distingue si el estudiante sabía el
  latín.

## Learned

1. **About the system:** el panel es el único sitio donde el catálogo se lee
   entero por hueso —nomenclatura, región, lado, sinónimos, ausencia—, así que es
   el mejor detector de huecos en los datos. No apareció ninguno.
2. **About the process:** un componente accesible **repite información a
   propósito**. Las pruebas tienen que anclarse a roles, no a texto libre, o
   colisionan con la redundancia que ellas mismas exigen.
3. **Capability gained:** hay una vista de estudio completa y usable solo con
   teclado. Todo lo que venga después —escena, ficha, modo test— se cuelga de un
   estado de selección ya probado.
