# Bug b2.1: Bone names sanitized by three — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Test de regresión | done | `3e8b1c4` | Rojo por la causa correcta: 196 de 199 irresolubles |
| T2 · Normalizar en dominio | done | `d7f2a90` | Se usa `PropertyBinding.sanitizeNodeName` de three, no una regla propia |
| T3 · Resaltar por hueso y mitad | done | `92357ff` | Cambia el contrato: la escena recibe el `id`, no el `meshName` |
| T4 · Cerrar el hueco del anclaje | done | `f1a6e2b` | El test de E1 ahora compara también contra los nombres saneados |
| T5 · Prueba de integración manual | **pendiente del humano** | — | No hay navegador en este entorno; es la laguna que causó el bug |

## Cambio de contrato

`SkeletonScene` recibía `selectedMesh` y pasó a recibir `selected` (el `id`). El
contrato anterior —fijado por mí en e2.6— era **incorrecto**: una malla es dos
huesos cuando el hueso es par, así que pasarle la malla obligaba a la escena a
encender ambos lados. Solo la escena sabe en qué mitad ocurrió el clic, de modo
que es ella quien debe resolver malla + mitad → hueso.

La documentación de e2 (`docs.md`, invariante I2 y el ejemplo trazado) describe
el contrato viejo y queda desactualizada. **Se reporta como hallazgo, no se edita
desde aquí**: `docs.md` es artefacto de `epic-close`.
