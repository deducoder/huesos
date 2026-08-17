# Bug b2.3: Mirroring duplicates bones the model already brings whole — Plan

## Nota de enfoque

El análisis decidió derivar el criterio **midiendo** las cajas de las 144 mallas.
El gemba de este plan encontró algo más simple y lo corrige: **el activo ya
declara la partición en su jerarquía**. Sus tres raíces son `Bones` (36 mallas),
`Bones_right` (98) y `Cartilages_right` (10), y el grupo `Bones` coincide
**exactamente** con las 36 mallas que la regla geométrica identificó —cero
falsos positivos, cero falsos negativos, comprobado contra el archivo—.

Se adopta la jerarquía y se descarta medir, por tres razones: no hace falta una
tolerancia arbitraria (la geométrica necesitaba 2 mm, un número que habría que
justificar); no falla con un hueso de línea media ligeramente asimétrico, que
una comparación de cajas sí puede clasificar mal; y es la lateralidad declarada
por quien construyó el activo —el sufijo `_right` lo dice— en vez de una
inferida por nosotros. El defecto nunca fue que faltara el dato: era que la
escena no lo leía.

## Tasks

### T1 · Regression test (RED)

- **Files:** modify `e2e/explore.spec.ts`
- Extender la prueba de lateralidad —la que hoy comprueba el fémur— a un hueso
  par **con malla propia por lado**: los parietales. Mismo instrumento
  (`diferenciaPorMitad`) y mismo criterio de proporción que ya se le exige al
  fémur, que sigue de control en la misma prueba.
- **Verify:** la propiedad es que los píxeles encendidos se concentran en una
  mitad de la imagen, con la otra por debajo de un quinto — lo que el fémur
  cumple hoy (1842/61) y el parietal no (126/122). Mutación forzada: el arreglo
  de T3, que debe voltearla a verde. Comando: `./scripts/check-integration`.
  Al terminar T1 la suite queda **roja**, y es el estado correcto.
- **Commit:** `test(e2e): assert a paired bone with its own mesh lights one side`

### T2 · Anchor the asset partition (RED → GREEN)

- **Files:** modify `tests/catalog-geometry.test.ts`, add the group name to
  `src/data/`
- La causa raíz es que nada comparaba lo que el activo contiene contra lo que la
  escena supone. Se cierra ese hueco: el nombre del grupo de línea media se
  exporta como constante desde `src/data/`, y una prueba afirma contra el
  archivo que ese grupo existe, que sus mallas no admiten espejo, y que las
  otras dos raíces cubren el resto. La escena y la prueba leen la misma verdad.
- **Verify:** la propiedad es que el grupo nombrado por la constante contiene
  exactamente las mallas sin contraparte lateral. Mutación forzada: apuntar la
  constante a un grupo inexistente debe poner la prueba en rojo — **no** dejarla
  pasar sobre una lista vacía, que es como este mismo archivo ya se protege de
  la vacuidad en su tercer caso. Comando: `./scripts/check`.
- **Commit:** `test(data): anchor the model's mirrorable partition`

### T3 · Fix (GREEN)

- **Files:** modify `src/components/SkeletonScene.tsx`
- La mitad espejada deja de dibujar el grupo de línea media: pasa de 144 mallas
  a 108, y las 36 restantes quedan dibujadas una sola vez por la mitad original,
  cada una ya en su sitio. En el mismo cambio se corrige el comentario que
  declara la premisa falsa —«el modelo trae solo el hemicuerpo derecho»— porque
  dejarlo en pie es lo que reintroduce el bug.
- **Verify:** la propiedad es la de T1, ahora en verde, más las 190 unitarias
  intactas. Mutación forzada: revertir la línea que oculta el grupo devuelve T1
  a rojo. Comandos: `./scripts/check` y `./scripts/check-integration`.
- **Commit:** `fix(scene): stop mirroring bones the model already brings whole`

### T4 · Manual integration test

- Servir la aplicación y **pedir verificación humana** de tres cosas que ninguna
  prueba automática cubre: que la calota vista desde arriba no muestra parches
  en competencia; que ningún hueso de línea media **desapareció** al dejar de
  espejarse —columna, esternón, mandíbula, cráneo—; y que un hueso par normal
  (fémur, húmero) sigue apareciendo en los dos lados.
- **Verify:** el riesgo real de este arreglo no es que siga encimado, es que
  algo se haya dejado de dibujar. Eso se ve mirando, y por eso la tarea existe
  aunque T1 esté verde.
