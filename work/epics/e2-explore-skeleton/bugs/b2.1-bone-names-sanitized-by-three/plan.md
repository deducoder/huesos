# Bug b2.1: Bone names sanitized by three — Plan

## Tasks

### T1 · Test de regresión (RED)

- **Files:** `src/domain/mesh-lookup.reproduction.test.ts` → renombrar a
  `mesh-lookup.regression.test.ts`
- **TDD:** ya falla, y falla por la causa correcta: 196 de 199 irresolubles.
- **Verify:** debe estar en rojo antes del arreglo y en verde después.
- **Commit:** `test(domain): reproduce mesh names lost to three's sanitizer`

### T2 · Normalizar el nombre de malla en dominio (GREEN)

- **Files:** modify `src/domain/mesh-lookup.ts`
- **TDD:** GREEN — normalizar los dos lados de la comparación con la misma regla
  que aplica `three`.
- **Verify:** el test de T1 pasa; los de e2.5 siguen pasando.
- **Commit:** `fix(domain): match mesh names through three's node-name sanitizer`

### T3 · Resaltar por hueso, no por nombre de malla

- **Files:** modify `src/components/SkeletonScene.tsx`, y su test
- **TDD:** RED — una aserción que exija que el resaltado dependa del `id`
  resuelto por mitad, no del nombre de malla → GREEN.
- **Verify:** `./scripts/check` y build.
- **Commit:** `fix(scene): highlight only the selected side of a paired bone`

### T4 · Cerrar el hueco que dejó pasar el bug

- **Files:** modify `tests/catalog-geometry.test.ts`
- **TDD:** RED — el anclaje de E1 comprueba el catálogo contra el **archivo**;
  falta comprobarlo contra los nombres **tal como los verá el cargador**. Sin
  esto, el mismo bug puede volver con otro nombre raro.
- **Verify:** el test falla si alguien añade una entrada cuyo nombre no sobrevive
  al saneado sin normalizar.
- **Commit:** `test(data): anchor the catalog against loader-sanitized names too`

### T5 · Prueba de integración manual

- Construir, servir, y **pedir verificación humana**: pulsar varios huesos de
  distintas regiones y comprobar que se seleccionan y se resaltan, y que un hueso
  par solo se enciende del lado elegido.
- **Verify:** no puedo hacerla yo —no hay navegador en este entorno— y es
  justamente la laguna que causó el bug. La declaro y la pido.

## Order & risks

- **Execution order:** T1 antes que nada (rojo probado), T2 y T3 son el arreglo,
  T4 evita la reincidencia.
- **Risks:** *la regla de saneado de `three` podría cambiar entre versiones* →
  por eso se usa `PropertyBinding.sanitizeNodeName` de la propia librería en vez
  de reimplementarla con una expresión regular propia.
