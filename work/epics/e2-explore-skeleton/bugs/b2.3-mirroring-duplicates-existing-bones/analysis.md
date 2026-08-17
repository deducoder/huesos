# Bug b2.3: Mirroring duplicates bones the model already brings whole — Analysis

## Method: Hypothesis-driven

La reproducción daba dos síntomas a la vez —un artefacto visual y una identidad
equivocada— y no era evidente si compartían causa. Se listaron cinco hipótesis y
se probó cada una contra el activo o el navegador.

| Hipótesis | Prueba | Resultado | Conclusión |
|---|---|---|---|
| La geometría de los parietales viene encimada en el activo | Leer `min`/`max` de X del accessor POSITION de cada malla | Derecho X −0.0743…+0.0044; izquierdo X −0.0043…+0.0742 | **Eliminada** — cada uno en su hemisferio, se tocan solo en la sutura sagital |
| Los dos parietales comparten material y por eso se encienden juntos | Contar mallas por material en el glTF | Materiales 19 y 20, uno por malla; además la escena clona el material por malla | **Eliminada** |
| El mapeo malla→hueso confunde los lados | Leer `boneIdForMesh` y el catálogo | Los parietales son las únicas dos entradas con `meshName` distinto por lado; el desambiguador por mitad solo actúa con `meshName` compartido, así que nunca se aplica a ellos | **Confirmada como consecuencia**, no como causa |
| La escena dibuja geometría de más | Cruzar la caja de las 144 mallas contra el eje del espejo | 36 mallas se dibujan dos veces: 34 centradas en X=0 y los 2 parietales | **Confirmada — causa** |
| El azul de los cartílagos costales es un resaltado erróneo | Leer `baseColorFactor` del material «Articular cartilage» | RGB 0.61/0.78/0.78: el activo los pinta azulados a propósito | **Eliminada** — falsa alarma, no es un defecto |

### Root cause

`SkeletonScene` dibuja el modelo entero dos veces —tal cual y con
`scale={[-1,1,1]}`— bajo la premisa, escrita en ADR-001 y repetida en el
comentario del componente, de que «el modelo trae solo el hemicuerpo derecho más
las piezas impares». **La premisa es falsa en 36 de las 144 mallas**, y por dos
motivos distintos:

1. **Las 34 piezas de línea media están centradas *sobre* el eje del espejo**,
   no fuera de él: toda la columna (C1-C7, T1-T12, L1-L5, sacro, cóccix), el
   esternón, la mandíbula, el frontal, el occipital, el esfenoides, el etmoides
   y el vómer. Espejar una pieza centrada no la traslada al otro lado: la
   duplica sobre sí misma.
2. **Los parietales son el único par que el modelo ya trae completo**:
   `Parietal bone left` es la única de las 144 mallas con lado izquierdo propio.
   El espejo del derecho aterriza encima del izquierdo real, y viceversa.

El caso 1 es duplicación silenciosa: las dos copias coinciden exactamente, así
que el buffer de profundidad resuelve sin artefacto y no se ve nada (verificado
en navegador: la columna y el sacro salen limpios). El caso 2 sí se ve, porque
las dos superficies son mallas **distintas** —4333 y 4314 vértices— que se
interpenetran en vez de coincidir.

La identidad equivocada es el mismo defecto por otra cara: al haber cuatro
superficies parietales donde el catálogo declara dos, el resaltado de
`parietal-right` enciende la malla derecha original **y** el espejo de esa misma
malla, que cae en el hemisferio izquierdo. `boneIdForMesh` responde
correctamente a lo que se le pregunta —la malla espejada *es* `Parietal bone
right`—; lo que está mal es que esa malla espejada exista.

Por qué fue posible —y no «se nos pasó»—: la premisa es una afirmación sobre los
datos de un activo de 144 mallas, y se escribió en prosa dentro de un ADR, donde
nada la ejecuta. Ninguna prueba la comprueba porque no hay ninguna que compare
lo que el activo contiene contra lo que la escena supone. El proyecto ya tropezó
con esta misma forma en b2.1 —una suposición sobre los nombres del activo, no
verificada contra el activo— y la lección quedó registrada, pero como
aprendizaje sobre nombres y no sobre suposiciones.

### Evidence

- **Cruce geometría↔catálogo de las 144 mallas** (`scripts/glb.mjs` sobre
  `src/data/skeleton.glb`): 82 laterales compartidas por dos entradas —el
  espejo las necesita—, 26 laterales sin catalogar (dientes, cartílagos
  costales, sesamoideos) que también lo necesitan, 34 centradas sobre el eje y
  2 parietales con malla propia por lado.
- **Medición en navegador** (píxeles encendidos por mitad de imagen, respecto a
  una selección base): fémur derecho 1842 / 61 —un solo lado, 30:1—; hueso
  parietal derecho 126 / 122; hueso parietal izquierdo 95 / 81. Los parietales
  se encienden en los dos hemisferios; el control no.
- **Vista desde arriba**: el resaltado cubre la calota entera y el moteado sobre
  él es simétrico especular, la firma de una malla compitiendo con su espejo.
- **Contraprueba de la línea media**: columna, sacro y pelvis se ven limpios, lo
  que acota el artefacto visual al caso 2 y descarta que las 34 centradas se
  noten hoy.

### Fix approach

Que la mitad espejada dibuje solo lo que necesita espejo: **una malla no se
espeja si el modelo ya contiene la geometría de su lado contrario** —otra malla,
como los parietales, o ella misma, como toda la línea media—. El criterio se
deriva midiendo el activo, no leyendo nombres, y se valida contra el activo real
(comprobado en esta sesión: reparte 108/36 sin falsos positivos ni negativos).
Vive como función pura en `src/domain/`, con la escena limitándose a aplicar la
visibilidad en la mitad espejada.

Rechazada: **podar `Parietal bone left` del activo** para que el espejo lo
genere, alineándolo con las 82 mallas que ya funcionan así. Arregla el síntoma
reportado con menos código, pero deja en pie la premisa falsa —las 34 centradas
seguirían duplicadas— y paga tocando el binario del activo para borrar geometría
real que el modelo sí trae.
