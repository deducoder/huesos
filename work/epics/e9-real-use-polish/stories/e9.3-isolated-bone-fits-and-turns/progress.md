# Story e9.3: The isolated bone fits and turns — Progress

## T1 · La aritmética del encuadre conoce el ancho y la reserva

**Hecho.** `frameObject(size, view, margin)` en `src/domain/framing.ts`
devuelve `{ distance, shiftY }`. Se apoya en `distanceToFit` dos veces —una
por altura corregida por la reserva, otra por ancho corregido por el
aspecto— en vez de sustituirla, así que la aritmética vive en un solo sitio
y `SkeletonScene` no se toca.

**RED:** 7 pruebas nuevas con los dos casos medidos sobre las 144 mallas del
modelo: la clavícula (0,140 × 0,033, ratio 4,26) y el fémur (0,116 × 0,451,
ratio 0,26).

**Un test estaba mal y lo corrigió el código, no al revés.** Escribí «en una
pantalla apaisada manda el alto, como antes» y falló. La expectativa era
falsa: con aspecto 1,556 la clavícula sigue gobernada por su ancho, porque
0,140/1,556 = 0,090 es mayor que su alto de 0,033. Que el ancho mande
**incluso en escritorio** es la medida de lo desproporcionado que es este
hueso. Se reemplazó por la propiedad real —en apaisado necesita menos
distancia que en un teléfono— y se añadió el caso que faltaba: comprobar
contra el encuadre de hoy que la clavícula pasa de no entrar a entrar.

**Verificación — mutación forzada, con la condición que el plan exigía:**
replicando el defecto real (`max(w, h)` tratado como altura, sin aspecto),
caen 3 pruebas y **todas son de la clavícula**; las dos del fémur siguen
verdes. Era la condición explícita — si también hubiera matado las del
fémur, las pruebas no distinguirían el defecto de un cambio cualquiera.

**Gate:** `./scripts/check` verde.

**Dato del camino:** el bug es de teléfono, confirmado con números. A la
distancia que el código actual elige, el ancho visible es 0,072 en un
lienzo de aspecto 0,513 (la clavícula mide 0,140: no entra) y 0,218 en uno
de 1,556 (sí entra). El scope acertó al acotarlo a pantalla chica.

## T2 · El hueso entero entra en el lienzo

**Hecho.** `IsolatedBoneScene` mide ancho y alto por separado, lee el
aspecto real del lienzo con `useThree().size` —ya post-layout, así que no
compite con el `<canvas>` de 300×150— y encuadra con `frameObject`.
`reservedBottom` entra como prop **requerida**; sus dos llamadores la pasan
con 0 por ahora, y T3 la mide.

**Cómo se observa un defecto dentro de WebGL.** No hay DOM que medir, así
que se cuenta píxeles de la captura del lienzo, reutilizando la técnica que
`explore.spec.ts` ya usa desde b2.3. Antes de fijar ningún umbral se midió
el histograma real: es bimodal, con cúmulos en luminancia 32 (el fondo
`#20242b`) y 224 (el hueso), y casi nada entre medias — 90 separa los dos
sin zona gris. La banda de borde es el 2 % del ancho (8 px de 390), que cae
dentro del `inset-x-4` de la tarjeta, así que mide hueso y nunca tarjeta.

**RED, con los tres huesos medidos:**

| Hueso | Ratio ancho/alto | Borde izq. | Borde der. | |
|---|---:|---:|---:|---|
| clavícula | 4,26 | 475 | 717 | se sale |
| atlas | 4,34 | 1236 | 1232 | se sale más |
| fémur | 0,26 | 0 | 0 | nunca se salió |

El fémur es la razón de ser de esta tabla: es el hueso con el que uno
probaría por instinto y el único que no expone nada.

**Verificación — mutación forzada:** volver a `max(x, y, z)` con aspecto 1
repone **exactamente 475** píxeles en el borde izquierdo de la clavícula,
el mismo número de antes del arreglo.

**No-regresiones, en la misma tarea:** la falange media del quinto dedo del
pie —0,0084 unidades, la más chica de las 144 mallas— sigue viéndose, así
que el `near={0.001}` de e4.4 no se perdió; y el hioides, uno de los siete
sin geometría (ADR-006), sigue explicando la ausencia sin montar lienzo.
Las 38 pruebas unitarias de `bone-detail` y `test` siguen verdes.

**Gate:** `./scripts/check` verde.

**Hallazgo fuera de alcance, aparcado.** Al buscar el botón de la clavícula
apareció que dice **«clavícula derecho»**: `SIDE_LABEL` es masculino fijo y
`accessibleName` lo concatena sin mirar el género, así que todo hueso
femenino queda mal concordado —escápula, tibia, costilla, falange— tanto en
el texto visible como en el nombre accesible. Aparcado con destino en
**e9.5**, que ya toca esos archivos y tiene la normalización de la escritura
en su alcance.
