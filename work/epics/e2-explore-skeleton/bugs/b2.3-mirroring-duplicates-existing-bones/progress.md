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

## T2 · Anchor the asset partition (RED → GREEN)

`src/data/skeleton-groups.ts` exporta `MIDLINE_GROUP = 'Bones'`, y cuatro casos
nuevos en `tests/skeleton-asset.test.ts` anclan la declaración del activo contra
su geometría: que el nombre del grupo sobrevive al saneado del cargador (la
lección de b2.1), que el grupo contiene mallas de verdad, que ninguna malla de
fuera cruza el eje del espejo, y que ninguna de dentro es lateral sin
contraparte propia en el modelo.

**RED:** la prueba no resolvía `../src/data/skeleton-groups` — el módulo no
existía todavía. **GREEN:** 9 casos en el archivo, 194 unitarias en total.

**Mutación forzada** (la que pedía el plan): apuntar `MIDLINE_GROUP` a un grupo
inexistente pone **dos** casos en rojo, no cero —

```
× mete en ese grupo mallas de verdad, para no pasar por vacuidad
  AssertionError: expected 0 to be greater than 0
× no deja fuera del grupo ninguna malla que cruce el eje del espejo
  AssertionError: expected [ 'Atlas (C1)', 'Axis (C2)', …(32) ] to deeply equal []
```

La prueba no da verde sobre una lista vacía, que era el riesgo real.

**Desvíos del plan, ambos menores:**

- La prueba fue a `tests/skeleton-asset.test.ts`, no a `tests/catalog-geometry.test.ts`
  como decía el plan. La partición es una propiedad del activo, no del anclaje
  entre catálogo y geometría, y ese archivo ya agrupa lo primero.
- Hubo que tipar `accessors`, `meshes` y `scenes` en `scripts/glb.d.mts`, que los
  declaraba como `unknown[]`. Sin eso no se puede leer una caja desde TypeScript.

**Gate:** `./scripts/check` verde, 194 unitarias (190 + 4).
