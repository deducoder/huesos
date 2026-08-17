# Story e7.6: Vista Explorar en móvil — Progress

## T1 · El lienzo a pantalla completa, sin el navegador visible

Esta tarea absorbió mucho más de lo planeado: un cambio de arquitectura
(ADR-009 → ADR-010, ver abajo) y un bug real de producción que estaba ahí
desde antes de esta historia, sin que ningún test lo hubiera atrapado.

### Corrección de arquitectura: ADR-009 superseded por ADR-010

- **RED:** `e2e/mobile-shell.spec.ts` medía el lienzo de Explorar contra el
  alto disponible completo — `Expected: >= 712, Received: 353`.
- **GREEN inicial:** se quitó `BoneNavigator` del todo. Al reescribir
  `explore.spec.ts` para que corriera sin él, se descubrió que dos de sus
  cuatro pruebas —las que protegen b2.1/b2.2 y b2.3— seleccionan un hueso
  *específico por nombre* en la escena combinada, y sin navegador no hay
  forma determinista de hacerlo (Fichas lleva a una escena aislada distinta).
- **Decisión con el usuario:** en vez de perder precisión en esas pruebas o
  calcular coordenadas de cámara, `BoneNavigator` **sigue montado**, con
  `className="sr-only"` en vez de una columna visible. Documentado en
  **ADR-010**, que supersede a **ADR-009** (escrita minutos antes, con la
  premisa de que el navegador desaparecía del todo).
- **Consecuencia sobre el propio diseño:** los Must 4 y 5 de `design.md`
  (corregir dos textos que asumían la lista ausente) quedaron sin objeto — la
  lista sigue ahí, esos textos seguían siendo ciertos. Registrado como delta
  en `design.md` antes de tocar código.

### GREEN final

- `ExploreView.tsx`: `relative h-full` con el lienzo `absolute inset-0` y
  `BoneNavigator` en un `<div className="sr-only">`; la tarjeta de identidad
  flota con `data-testid="tarjeta-identidad"`.
- `ExploreView.test.tsx`: **7 de 8 pruebas originales pasaron sin tocarse** —
  `sr-only` no afecta las consultas de Testing Library. Solo se corrigió la
  que asumía el estado vacío de `BoneIdentity` visible antes de seleccionar
  (ahora no se monta nada hasta que hay selección).

### Dos problemas de infraestructura de prueba, encontrados y arreglados

1. **`.click({ force: true })` no sirve para un elemento `sr-only`.** El
   contenedor recorta visualmente pero no comprime el layout interno: cada
   botón conserva su posición real, a veces a miles de píxeles de alto.
   Playwright clickea esa coordenada real y no dispara nada.
   **Arreglo:** `.dispatchEvent('click')` en vez de `.click()`, en
   `explore.spec.ts` y `mobile-shell.spec.ts`.
2. **La tarjeta flotante contamina la medición de píxeles de `explore.spec.ts`.**
   El test que protege b2.3 (resaltado por mitades) captura el `<canvas>` y
   mide diferencias de píxeles; la tarjeta se solapa con la parte inferior del
   lienzo y su contenido cambia con cada selección, mezclándose con la señal
   del resaltado 3D. En 1400×900 llegó a tapar buena parte del fémur.
   **Arreglo:** ocultar `[data-testid="tarjeta-identidad"]` justo antes de
   cada captura, restaurarla después — no toca el layout real, solo aísla lo
   que la prueba necesita medir.

### El hallazgo más importante: un bug de producción, no de la prueba

- **Síntoma:** `touch-action` del lienzo en Explorar volvía a `auto`
  después de un momento, de forma consistente (no aleatoria) tanto en la
  suite completa como en corridas aisladas — el "pasó una vez" inicial fue
  suerte de timing, no una corrida limpia.
- **Diagnóstico, con un `MutationObserver` inyectado en vivo:** `OrbitControls`
  de `three-stdlib` **ya pone `touch-action: none`** al conectar —el mismo
  arreglo que e7.2 creyó necesitar en CSS, y que **nunca podía ganarle** a un
  estilo en línea—, pero se desconecta y reconecta una vez después del
  montaje (el momento varía, 217-286 ms medidos, coincide con la carga del
  modelo), y esa reconexión no volvía a fijar `none` sobre el mismo elemento.
  El arreglo de e7.2 nunca funcionó de forma confiable: solo parecía
  funcionar porque ninguna medición anterior esperaba lo suficiente para
  atrapar la reconexión.
- **Arreglo real:** `FixTouchAction`, un componente sin render dentro del
  `Canvas` de `SkeletonScene.tsx`, que instala un `MutationObserver` propio
  sobre el estilo del lienzo y reafirma `none` cada vez que cambia — sin
  necesidad de adivinar cuándo ocurre la reconexión de `OrbitControls`.
  Verificado 4/4 con el mismo diagnóstico, y con dos corridas completas de la
  suite (13/13 las dos veces).
- **`IsolatedBoneScene.tsx` no tiene el defecto**: no usa `OrbitControls`, así
  que la regla CSS de e7.2 le basta. Verificado, no se tocó.

**Gates:** `./scripts/check` verde · suite de navegador entera verde (13/13,
dos corridas seguidas para descartar intermitencia).
