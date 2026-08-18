# Story e9.7: Homogeneous header, and a menu that opens — Progress

## T1 · La fórmula de atribución, extraída y guardada contra desincronizarse

**Done.** `ATRIBUCION_LITERAL` y `LICENCIA_URL` en `src/data/attribution.ts`,
con un gate que lee `ATTRIBUTION.md` de verdad y compara.

- **RED, primera versión — un falso hallazgo del propio test.** El primer
  intento comparaba `fuente.toContain(ATRIBUCION_LITERAL)` contra el archivo
  crudo, y falló incluso con la constante correcta: `ATTRIBUTION.md` envuelve
  la cita en dos líneas (`>` de markdown) por prolijidad editorial, mismo
  texto, distintos bytes. Corregido extrayendo el bloque de líneas `> ` y
  reuniéndolas en una sola antes de comparar — no debilitando la aserción a
  un fragmento parcial, que habría dejado pasar una fórmula recortada.
- **GREEN:** la constante, transcrita una vez.
- **Mutación forzada:** cambiar «Life Science» por «Life Sciences» rompe
  las dos pruebas que dependen del texto — la propia y la de
  desincronización, confirmando que las dos vigilan lo mismo desde ángulos
  distintos.
- **Gate:** `./scripts/check` verde — 330 tests.
