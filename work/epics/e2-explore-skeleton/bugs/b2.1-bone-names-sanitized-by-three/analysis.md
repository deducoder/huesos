# Bug b2.1: Bone names sanitized by three — Analysis

## Reproducción

`src/domain/mesh-lookup.reproduction.test.ts` hace lo que hace la aplicación:
pasa el nombre por el saneado de `three` y luego busca en el catálogo.

```
× resuelve el fémur al pulsarlo en la escena
    expected null to be 'femur-right'
× resuelve cualquier hueso anclado, no solo los tres de nombre simple
    expected [ 'frontal', 'parietal-right', …(194) ] to deeply equal []
```

**196 de 199 huesos irresolubles.**

## Cinco porqués

1. **¿Por qué no se selecciona el fémur al pulsarlo?**
   Porque `boneIdForMesh(catalog, evento.object.name, half)` devuelve `null`.
2. **¿Por qué devuelve `null`?**
   Porque ninguna entrada del catálogo tiene ese `meshName`: llega `Femur_r` y el
   catálogo guarda `Femur.r`.
3. **¿Por qué llega `Femur_r`?**
   Porque `GLTFLoader` nombra cada objeto con
   `PropertyBinding.sanitizeNodeName(node.name)`, que sustituye los espacios por
   `_` y **elimina los caracteres reservados**, el punto entre ellos.
4. **¿Por qué se asumió que serían iguales?**
   Porque el catálogo se ancló contra los nombres leídos **del archivo** con
   nuestro propio lector (`scripts/glb.mjs`), que no sanea nada. El test de
   anclaje de E1 compara archivo contra catálogo y pasa; lo que nadie comparó fue
   **catálogo contra escena cargada**.
5. **¿Por qué nadie lo comparó?**
   Porque cargar la escena exige un navegador, y el epic cerró sin poder
   ejecutarla. La única prueba que tocaba la escena inspeccionaba **el texto del
   fuente**, que es una red demasiado floja para atrapar esto.

**Causa raíz:** el catálogo ancla por un identificador —el nombre de nodo del
glTF— que **no es estable a través del cargador**. `three` lo transforma, así que
el archivo y la escena hablan de nombres distintos, y nadie verificó la
equivalencia porque no había forma de ejecutar la escena.

## Verificación de la causa

```
three.PropertyBinding.sanitizeNodeName sobre los 144 nombres del modelo
  quedan intactos : 3   → Coccyx, Sacrum, Vomer
  se alteran      : 141
```

Coincide exactamente con lo observado: el usuario informó que **solo el sacro**
respondía. Cóccix y vómer también responden, pero son piezas pequeñas y difíciles
de pulsar; el vómer queda además dentro del cráneo.

## Segundo defecto, encontrado al analizar

El resaltado compara `malla.name === selectedMesh` **en las dos copias de la
escena**. Como ambas copias contienen las mismas mallas con los mismos nombres,
al resaltar un hueso par se encienden los dos lados: elegir el fémur derecho
ilumina también el izquierdo.

No se había detectado porque, con el primer defecto activo, el resaltado no
llegaba a ocurrir para ningún hueso par. Se arregla junto con el primero: ambos
salen de identificar un hueso solo por el nombre de la malla, ignorando la mitad.

## Enfoque del arreglo

**Sanear en el mismo sitio que `three`, y comparar por hueso, no por malla.**

1. Una función de dominio que aplique la misma normalización que `three` a un
   nombre de malla, para que catálogo y escena hablen el mismo idioma.
2. `boneIdForMesh` compara normalizado contra normalizado.
3. El resaltado deja de comparar nombres de malla: cada mitad resuelve el
   **`id` del hueso** que le corresponde a cada malla y lo compara con la
   selección. Así el fémur derecho solo se enciende en su mitad.

Se descarta renombrar las mallas dentro del `.glb`: obligaría a reprocesar el
activo, a rehacer las 199 entradas del catálogo y a repetirlo con cada versión
nueva del modelo. Normalizar en el consumidor es reversible y no toca el dato.
