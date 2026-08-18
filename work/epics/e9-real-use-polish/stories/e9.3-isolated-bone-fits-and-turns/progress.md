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

## T3 · El hueso no queda detrás de la tarjeta

**Hecho.** `BoneDetailView` mide el alto real de la tarjeta con un
`ResizeObserver` y lo pasa como fracción. La tarjeta ganó un
`data-testid="tarjeta-ficha"` para poder localizarla desde la suite.

**El caso extremo de T3 no es el de T2.** Medido antes del arreglo: el
**fémur** —el hueso alto, que ocupa el lienzo de arriba abajo— quedaba
**47,9 % visible y 52,1 % tapado**, mientras que la clavícula daba 100 %
visible, porque tras T2 se encuadra lejos y queda arriba. Los dos defectos
de esta historia tienen cada uno su propio caso crítico y **no son el mismo
hueso**; probar los dos con el mismo fixture habría dejado uno sin cubrir.

**Una aserción mía era frágil y se cambió por la propiedad correcta.**
Escribí «el fémur sigue siendo grande, más de 15 000 píxeles» antes de
conocer el resultado. Tras el arreglo el hueso ocupa 10 265 px: cabe en el
55 % del alto en vez del 100 %, así que su área baja por el cuadrado de la
proporción. El área era mala medida —cambia con lo macizo que sea el
hueso—, y se reemplazó por cuánto de la franja libre **recorre** el hueso
de arriba abajo (>0,7).

**La primera mutación sobrevivió, y eso era el hallazgo.** Sustituir el alto
medido por el 45 % declarado **pasaba** la prueba: no distinguía medir de
suponer, que es justo el delta que el diseño prometía. Se añadió el caso que
faltaba, comparando dos huesos largos de la pierna de proporciones
parecidas —el fémur, con «Articula con» y «Dato clínico», y la tibia, sin
sinónimos ni ninguno de los dos— de modo que lo único que cambia entre
ellos es el alto de la tarjeta. Con la reserva fija, la tibia desperdicia el
**29,7 %** de su franja libre; con el alto medido, menos del 20 % en ambas.

**Verificación — mutaciones forzadas:**

| Mutación | Resultado |
|---|---|
| `reservedBottom = 0` | Rojo: vuelve al 47,88 % exacto de antes |
| El 45 % declarado en vez de lo medido | Rojo **solo** en la ficha corta (tibia, hueco 29,7 %) |

**Gate:** `./scripts/check` verde.

**Para juicio humano en T5.** El hueso se ve **entero pero más chico** que
antes: 10 265 px visibles frente a los 20 560 que se veían cuando la otra
mitad quedaba tapada. Es el precio de encuadrar en la franja libre, y es una
decisión que se mira en el teléfono, no en un número.

## T4 · El hueso se puede girar sin robarle el scroll a la página

**Hecho.** `FixTouchAction` salió de `SkeletonScene.tsx` a su propio archivo
con su comentario íntegro, y ahora lo montan las dos escenas.
`IsolatedBoneScene` monta `<OrbitControls>` de solo rotación.

**El usuario encontró un bug que mi diseño había metido y mi prueba no
podía ver.** Probando en el teléfono: la rotación horizontal funcionaba, la
vertical sacaba el hueso del encuadre. La causa era mía — para subir el
hueso por encima de la tarjeta había bajado la cámara **y su punto de
mira**, dejando el centro de giro `shiftY` por debajo del hueso. En
horizontal apenas se nota, porque el eje pasa cerca; en vertical el hueso
describe un arco grande y se va.

**La corrección: descentrar la proyección, no mover la cámara.**
`camera.setViewOffset` renderiza una subventana del frustum del mismo
tamaño pero corrida —un desplazamiento de lente—, así que el hueso se
dibuja arriba mientras la cámara sigue apuntando a su centro real y la
órbita queda intacta en los dos ejes. En consecuencia `frameObject` dejó de
devolver `shiftY` en unidades de mundo y devuelve `viewOffsetY` como
fracción del alto: media reserva.

**Mi prueba de rotación no observaba lo que decía observar.** Afirmaba «al
arrastrar cambian más de 2 000 píxeles» y daba ~90 para arrastres de 120 px
en horizontal, 150 en vertical y 200 en diagonal — el mismo número en los
tres, o sea ruido. Aunque hubiera funcionado, «algo cambió» **jamás** habría
detectado este bug: un hueso puede salirse del encuadre y seguir cambiando
píxeles. Se descartó y se reemplazó por lo que el usuario hizo con el dedo:
girar y mirar si el hueso sigue dentro.

**Y el criterio que pidió el usuario:** aire a los cuatro lados, no solo
«que no se salga». Un hueso pegado al borde se lee como recortado aunque
técnicamente entre. Bandas del 3 % por lado, medido: 0 píxeles en las cuatro
para el fémur y el atlas, 13 en una sola para la clavícula.

**Verificación — mutación forzada, la que importaba:** reponiendo el bug del
anclaje (cámara y target bajados juntos, sin descentrar la proyección), la
prueba nueva se pone roja en el **primer giro vertical**, con 681 píxeles de
hueso metidos bajo la tarjeta. Es el defecto que se encontró a mano, ahora
con red.

**Gates:** `./scripts/check` verde. `./scripts/check-integration` verde,
**31 de 31**. `should-perf-007` en mediana 4,0 ms — los controles no mueven
el presupuesto, como el diseño anticipaba.

## T5 · Prueba manual de integración

**Aprobada por el usuario** en su teléfono real, por el túnel, contra el dev
server que quedó vivo toda la historia.

La rotación corregida funciona en los dos ejes, y el hueso se ve bien **con
y sin «Dato clínico»** — es decir, con la tarjeta alta y con la baja. Esa
distinción es exactamente lo que separa medir el alto real de la tarjeta de
suponer el 45 % declarado, y es la comprobación que el usuario hizo de un
vistazo y que la suite necesitó dos huesos y una mutación para afirmar.

También queda resuelta la duda que dejé abierta sobre el tamaño: el fémur se
ve más chico que antes en área, y el usuario lo da por bueno viendo la
pantalla.
