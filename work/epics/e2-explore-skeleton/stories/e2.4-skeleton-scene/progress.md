# Story e2.4: Skeleton scene — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Decodificador Draco local | done | `c41d7a2` | 4 aserciones; `public/draco/` con solo el decodificador glTF (756 KB de 1,8 MB) |
| T2 · La escena con el modelo | done | `c41d7a2` | Canvas R3F, órbita, espejado del hemicuerpo |
| T3 · Prueba de integración manual | **parcial** | `8b0f5e9` | El build sirve todo desde el propio origen; **la escena no se vio renderizada** |

## Desvíos respecto del plan

- **El canvas rompió las pruebas de la vista** en cuanto se montó:
  `ResizeObserver` no existe en jsdom. Se resolvió con un polyfill en
  `tests/setup.ts` **y** sustituyendo la escena por un doble en la prueba de
  `ExploreView`, con el motivo escrito en el propio archivo: WebGL no existe en
  jsdom, así que renderizar el canvas ahí no probaría nada.
- **La escena se montó en `ExploreView` en esta historia**, no en e2.6. Sin
  montarla no había integración que verificar: el bundle ni siquiera incluía
  three.js.
- **T3 quedó parcialmente verificada, y se dice.** Comprobado: el build funciona,
  `/draco/draco_decoder.wasm` responde 200 con 192 420 bytes, el `.glb` responde
  200 con 1 907 624 bytes, y el bundle configura `setDecoderPath('/draco/')`.
  **No comprobado: que el esqueleto se vea.** No hay navegador en este entorno.
- **Hallazgo aparcado:** el bundle conserva la URL de `gstatic.com` como ruta por
  defecto de Draco en `three`. Hoy no se usa —la local sí se aplica— pero el test
  actual no lo detectaría si alguien la activara. Anotado en el parking lot.
