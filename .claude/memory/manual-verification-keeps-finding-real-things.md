---
name: manual-verification-keeps-finding-real-things
description: Cuatro historias seguidas (e3.1, e3.2, e3.3, e4.2) con un hallazgo real en la verificación manual en navegador — no es mala suerte, es una categoría de defecto que las pruebas automatizadas de este proyecto no cubren por diseño.
metadata:
  type: process
---

En esta sesión, la tarea final de cada historia ("prueba manual de
integración") encontró algo real que ningún test automatizado había
atrapado: un favicon 404 (s1), un aria-label genérico (e3.1), nada nuevo en
e3.2/e3.3 pero confirmando comportamiento, y un texto de accesibilidad
engañoso en un contexto reutilizado (e4.2). El patrón: cada vez que un
componente ya probado con jsdom (`SkeletonScene`, `BoneIdentity`) se monta
en un contexto **nuevo** que la prueba original no imaginó, algo específico
del contexto original se filtra.

**Por qué importa:** ADR-002 ya decidió que el canvas WebGL queda fuera de
la cobertura automática, verificado a mano. Lo que esta sesión añade: la
verificación manual no es solo para el canvas — encuentra defectos de
*contexto* (un texto correcto en su sitio original, incorrecto en uno
nuevo) que ningún test unitario detectaría aunque cubriera el 100% de las
líneas, porque el texto en sí nunca cambió; lo que cambió es dónde se usa.

**How to apply:** no tratar la prueba manual como un trámite final que
"probablemente no encuentre nada". Al reutilizar un componente ya probado
en un contexto nuevo, revisar activamente qué texto/mensaje/copy fijo
trae que asumía el contexto original — es más barato preguntarlo antes de
montar la prueba manual que descubrirlo en ella.

Relacionado: [[untestable-layers-go-last]].
