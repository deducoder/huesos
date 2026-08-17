# Bug b2.2: Skeleton out of frame — Scope

WHAT: El esqueleto aparece descuadrado: el cráneo queda cortado por arriba y la mitad inferior del lienzo queda vacía, de modo que la mayor parte del área donde se hace clic no tiene hueso debajo.
WHEN: Siempre, al cargar la vista de exploración, antes de tocar los controles de órbita.
WHERE: `src/components/SkeletonScene.tsx` — la cámara se coloca en `[0, 0.2, 3]` mirando al origen, y el modelo tiene su centro en `Y = 0.857` con 1,696 de altura.
EXPECTED: El esqueleto entero visible y centrado en el lienzo al cargar, sin necesidad de ajustar la cámara a mano.
DONE WHEN: Una verificación en navegador real confirma que el esqueleto se ve completo, y una rejilla de clics sobre el lienzo alcanza decenas de huesos distintos en vez de dos.

## Triage

- **Severity:** Alta. No impide usar la aplicación —la lista sigue funcionando—
  pero deja la escena prácticamente inservible como vía de selección: en una
  rejilla de 121 clics solo 2 alcanzaban un hueso.
- **Origin:** **Verificación**, igual que b2.1 y por la misma causa: nadie había
  ejecutado la escena en un navegador. El defecto es visible de un vistazo y no
  hay forma de deducirlo del código sin conocer el bounding box del modelo.

## Análisis

Medido sobre el propio `.glb`, sumando los `min`/`max` de los 144 accessors de
`POSITION`:

```
X:   -0.336 ..  0.074   (tamaño 0.410)
Y:    0.009 ..  1.705   (tamaño 1.696)
Z:   -0.117 ..  0.137   (tamaño 0.254)
centro: [-0.131, 0.857, 0.010]
```

El modelo es un humano de 1,70 **apoyado en el origen**: sus pies están en
`Y ≈ 0` y su cabeza en `Y ≈ 1.7`. La cámara mira al origen, o sea a los pies, y
está a 3 de distancia con un campo de 45°, que a esa distancia abarca unos 2,5 de
altura centrados en los tobillos.

En X el modelo tampoco está centrado —va de −0.336 a 0.074— porque es el
hemicuerpo derecho; la copia espejada lo compensa y el conjunto sí queda
centrado en 0.

**Causa raíz:** la cámara se colocó con valores inventados en vez de derivarse
del tamaño real del modelo, y nadie lo vio porque la escena nunca se ejecutó.

## Enfoque del arreglo

Derivar el encuadre del modelo en vez de fijarlo a mano:

1. Una función pura que, dado el alto de lo que hay que ver y el campo de visión,
   devuelva a qué distancia debe estar la cámara. Es aritmética y se prueba sin
   navegador.
2. La escena mide el modelo ya cargado con `Box3`, centra el conjunto y coloca
   cámara y punto de mira con esa función.

Así, cambiar el activo por otro de distinta escala no vuelve a romper el encuadre.
