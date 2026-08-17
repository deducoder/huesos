# Story e2.1: Region grouping — Retrospective

Estimated: S · Actual: S, 1 commit de código

## Summary

`src/domain/regions.ts` agrupa las 206 entradas en 10 regiones ordenadas de la
cabeza a los pies, marca las que no tienen geometría y conserva contiguos el
lado derecho y el izquierdo de cada hueso par. Es el primer habitante de la capa
de dominio.

## What went well

- **La aserción de contigüidad valió más que la de recuento.** Comprobar que
  «fémur» izquierdo y derecho salen juntos obligó a decidir que el grupo
  **conserva el orden del catálogo** en vez de reordenar por nombre. Sin ese
  test, ordenar alfabéticamente habría parecido una mejora y habría separado
  cada pareja.
- **El orden anatómico se escribió como dato, no como lógica.** Una constante
  con su justificación, en vez de un `sort` con un comparador que nadie
  entendería en seis meses.
- **La capa de dominio nació limpia:** sin React, sin DOM, probable en jsdom sin
  montar nada.

## What to improve

- **Inspeccionar a mano cuesta más de lo debido.** No hay forma de ejecutar un
  módulo TypeScript del proyecto desde la consola sin escribir un test temporal.
  Es fricción real que se va a repetir en cada historia de dominio; merecería un
  script `scripts/run-ts` o equivalente, pero no lo inventé aquí para no meter
  herramienta fuera de scope.

## Learned

1. **About the system:** el orden del catálogo no es arbitrario, es una decisión
   heredada de E1 —los pares contiguos— y ahora hay una prueba que lo protege.
   Cualquier reordenación futura romperá ese test y eso es exactamente lo que se
   quiere.
2. **About the process:** cuando una historia es «agrupar y ordenar», la
   aserción interesante no es el recuento sino **la propiedad estructural** que
   nadie pensaría en romper a propósito.
3. **Capability gained:** hay capa de dominio y patrón establecido para las
   siguientes: función pura, tipos explícitos, prueba junto al módulo.
