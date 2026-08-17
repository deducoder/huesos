# Story e2.1: Region grouping — Plan

> Size: S

### T1 · Agrupar y ordenar

- **Files:** create `src/domain/regions.ts`, `src/domain/regions.test.ts`
- **TDD:** RED — orden anatómico, ningún grupo vacío, pares contiguos, marca de
  no representable → GREEN — la función → REFACTOR — extraer el orden a una
  constante si se repite.
- **Satisfies:** los cuatro escenarios.
- **Verify:** `npx vitest run src/domain/regions.test.ts`, luego `./scripts/check`.
- **Commit:** `feat(domain): group the catalog by anatomical region`

### T2 · Manual integration test

- Imprimir los grupos por consola y comprobar a ojo que el recorrido de cabeza a
  pies es el que un estudiante esperaría.
- **Verify:** cráneo → cara → columna → tórax → cintura escapular → miembro
  superior → cintura pélvica → miembro inferior, con oído e hioides declarados.

## Order & risks

- **Execution order:** una sola tarea de lógica.
- **Risks:** *el orden "anatómico" es una convención y puede discutirse* → se fija
  en una constante explícita y se justifica en el código, para que cambiarlo sea
  una decisión visible.
