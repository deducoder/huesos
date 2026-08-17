# Bug b2.2: Skeleton out of frame — Progress

| Task | Status | Nota |
|------|:------:|------|
| T1 · Cálculo de encuadre en dominio | done | `src/domain/framing.ts` con 5 aserciones; aritmética pura, probable sin navegador |
| T2 · Centrar y normalizar el modelo | done | `Box3` mide el modelo cargado; el grupo se escala a una altura canónica |
| T3 · Verificación en navegador real | done | Playwright sobre el build de producción |

## Un arreglo que aparentaba funcionar

La primera versión medía el modelo y calculaba la distancia de cámara con
`useState`. **No servía de nada:** `<Canvas camera={...}>` solo lee esos valores
al montar, así que recalcular después no reencuadra. Parecía correcto porque el
valor inicial suponía 1,7 y el modelo mide 1,696 — coincidencia, no diseño.

Se detectó con un sondeo deliberado: poner el valor inicial ×4 y ver si el
encuadre se corregía solo. No se corrigió (volvió a 2 huesos alcanzables), lo que
probó que el ajuste era código muerto.

La versión definitiva invierte el planteamiento: **se normaliza el modelo a una
altura canónica y la cámara es una constante**. Comprobado con `TARGET_HEIGHT`
a 1,7 y a 6,8: en ambos casos el encuadre es correcto y se alcanzan 10 huesos.

## Verificación en navegador

Sobre el build de producción, con Chromium:

```
huesos distintos alcanzables con una rejilla de 11x11 clics:  2  →  10
```

Los 10 incluyen `escápula derecho` y `escápula izquierdo`, `escafoides derecho`
e `izquierdo`: **la resolución por mitad funciona**, que era el arreglo de b2.1
sin verificar hasta ahora.

Y el resaltado, midiendo píxeles que cambian entre capturas:

```
fémur izquierdo → cambian 3331 px en la mitad derecha de la imagen, 0 en la izquierda
fémur derecho   → cambian 3333 px en la mitad izquierda de la imagen, 0 en la derecha
```

Un solo lado, y **cruzado a propósito**: el esqueleto se mira de frente, así que
el lado derecho del cuerpo aparece a la izquierda de la imagen. Mi primer
criterio automático daba «NO» porque yo había escrito la comprobación sin esa
convención: el fallo estaba en la prueba, no en el código.

## Lo que no era un bug

La caja torácica se ve azulada. **Es el color del modelo**, no un resaltado
erróneo: los 10 cartílagos costales tienen `baseColorFactor` `(0.61, 0.78, 0.78)`
mientras los 134 huesos tienen `(0.9, 0.8, 0.69)`. Comprobado leyendo los
materiales del `.glb`.
