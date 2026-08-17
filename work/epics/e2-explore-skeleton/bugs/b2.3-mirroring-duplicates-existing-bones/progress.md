# Bug b2.3: Mirroring duplicates bones the model already brings whole — Progress

## T1 · Regression test (RED)

Extendida `un hueso par se resalta de un solo lado, y del anatómicamente
correcto` en `e2e/explore.spec.ts` a los parietales, con el fémur de control en
la misma prueba y el mismo instrumento (`diferenciaPorMitad`).

**Rojo, y por la razón correcta.** Lo que imprimió:

```
Error: y no a la derecha
expect(received).toBeLessThan(expected)
Expected: < 25.2
Received:   122
```

Las cuatro aserciones del fémur pasaron antes de llegar ahí, así que el rojo
no es un andamiaje roto: es el defecto. El parietal derecho enciende 126 píxeles
en la mitad izquierda de la imagen y 122 en la derecha; el criterio exige que la
mitad equivocada quede por debajo de un quinto de la correcta.

**No previsto:** el umbral mínimo tuvo que bajar de 200 —el del fémur— a 40. El
parietal ocupa mucho menos en pantalla a la distancia por defecto de la cámara,
y 200 lo habría puesto en rojo incluso ya arreglado. Se vigila la proporción
entre mitades, que es lo que expresa el defecto; el mínimo solo existe para que
la prueba no dé verde sobre una selección que no encendió nada.

**Gate:** `./scripts/check` verde (190 unitarias) tras pasar el formateador —
Biome parte las dos llamadas largas a `expect` en varias líneas.
`./scripts/check-integration` rojo, que es el estado correcto al terminar T1.
