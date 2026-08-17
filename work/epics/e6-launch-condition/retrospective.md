# Epic e6: Condición de lanzamiento — Retrospective

## Summary

La condición de lanzamiento del producto era **imposible de cumplir por
construcción**, y lo era en silencio. `RF-08` exigía una región gráfica para
cada una de las 206 entradas del catálogo; siete no la tienen y el proyecto ya
había decidido, el 2026-08-16, no cubrirlas. El PRD afirmaba un observable que
ninguna prueba comprobaba, y las pruebas afirmaban otra cosa.

E6 lo cierra: un ADR que decide qué significa "catálogo completo" con las
cuatro opciones sobre la mesa, una prueba con nombre propio que lo afirma, el
requisito reescrito para decir lo que se ejecuta, y —de propina— un defecto real
en la ficha de los siete huesos ausentes.

## Metrics

- Stories: 3 · Estimado: S, S, S · Actual: S, S, S
- **La épica no era la que el backlog decía.** El backlog la describía como
  "completar las 206 entradas región por región"; el catálogo llegó a 206 en E1.
  El gemba previo cambió la épica entera antes de escribir el brief.
- Defectos encontrados: **1** — panel 3D vacío con etiqueta accesible mintiendo,
  vivo desde E3 y superviviente de tres épicas con la suite en verde.
- Duplicaciones de aserción eliminadas: **2** (una dentro de
  `catalog.coverage.test.ts`, otra que cruzaba a `catalog.test.ts`).
- Tests: 187 → **190**. ADRs: 1 (ADR-006). Entradas al parking lot: 0 nuevas.

## Scope verification

**In scope · MUST**

- *Prueba que afirme que las 206 entradas tienen geometría o razón* →
  **Fulfilled**. `src/data/catalog.coverage.test.ts`, prueba "cumple la
  condición de lanzamiento: geometría o razón, nunca ninguna". Demostrada
  fallando dos veces: sin razón, y con una razón simbólica (`'n/a'`).
- *`RF-08` reescrito con el observable de ADR-006, incluido el matiz* →
  **Fulfilled**. `governance/prd.md`; el matiz de qué significa "completo" está
  dentro del requisito y cita ADR-006.
- *La fila de E6 en el backlog* → **Fulfilled**, más la nota de secuencia, que
  también describía una espera que ya había terminado.
- *Verificar que un hueso sin geometría se comporta bien en las vistas donde
  aparece* → **Fulfilled, y con más alcance del escrito**: el `scope.md` decía
  "las tres vistas"; la auditoría enumeró **cinco** superficies por búsqueda y
  no por memoria, y encontró un defecto en una de ellas.

**In scope · SHOULD (compromiso de eliminación)**

- *Que la prueba nueva **sustituya** a las que afirman lo mismo, en vez de
  sumarse* → **Fulfilled**, resuelto explícitamente:
  - `declara exactamente 7 ausencias, y todas con razón` → **estrechada**: se
    queda solo con el recuento. La exigencia de razón sustantiva se **movió** a
    la prueba nueva, no se perdió.
  - `exige una razón a toda entrada sin geometría` (`catalog.test.ts`) →
    **eliminada**: subsumida por completo, y más débil.
  - `ancla 199 entradas` y `declara exactamente 7 ausencias` → **se quedan**:
    los recuentos documentan el estado real del activo y delatan un cambio
    silencioso en el modelo, algo que la prueba del criterio no dice.
  - Verificado tras cada cambio rompiendo el dato: falla **exactamente una**
    prueba en los dos archivos.

**Done when**

- *Prueba que falla si una entrada queda sin geometría y sin razón* →
  **Fulfilled**, con su salida registrada.
- *`RF-08` y la prueba dicen lo mismo* → **Fulfilled**, comprobado
  literalmente imprimiendo el observable y la lista de pruebas juntos.
- *Un hueso sin geometría se entiende y en ningún sitio parece un error* →
  **Fulfilled**, verificado en Chromium: martillo e hioides con 0 lienzos y 0
  etiquetas 3D; fémur sin cambios.
- *El backlog no describe E6 como contenido pendiente* → **Fulfilled**.
- *All stories complete · docs updated · retrospective done* → historias
  reportadas `done`; `docs.md` la genera `epic-close`; ésta es la retrospectiva.

## Quality review at epic scope

- **Cuatro comprobaciones de `meshName === null` en producción**
  (`BoneIdentity`, `BoneDetailView`, `BoneNavigator` ×2). Evaluadas contra la
  cuarta regla de Beck y **no** son un hallazgo: son cuatro decisiones de
  presentación distintas sobre la misma condición de datos, no una invariante
  repetida. Un predicado con nombre añadiría un elemento sin revelar más
  intención que `meshName === null`.
- **La invariante sí estaba repetida en tres planos** —el tipo `Bone`, la prueba
  de cobertura y `catalog.test.ts`— y ninguno citaba a los otros. Resuelto: uno
  la afirma, los demás la citan o dicen otra cosa.
- Sin otros hallazgos. "Ninguno" es un resultado válido y no se inventaron.

## What went well

- **El gemba previo cambió la épica antes de que existiera.** El backlog decía
  una cosa, el código decía otra, y medir tardó cinco minutos: 206 entradas,
  200 con sinónimos, 7 sin geometría. Sin esa medición, E6 habría sido tres
  historias completando un catálogo que ya estaba completo.
- **La decisión quedó auditable, no escondida en un diff.** Cambiar un requisito
  para poder cumplirlo se parece a hacer trampa; ADR-006 escribe las cuatro
  opciones —incluidas "conseguir la geometría" y "no hacer nada"— y por qué se
  rechazan las otras tres. `RF-08` lo cita, así que el porqué es alcanzable
  desde el qué.
- **Poner primera la historia de riesgo funcionó, otra vez.** e6.1 existía para
  descartar que la épica tuviera un defecto dentro. Encontró uno. Si hubiera ido
  última, el ADR y el PRD se habrían escrito afirmando que los siete ausentes se
  tratan bien, y no era cierto.
- **Cada eliminación se reverificó rompiendo el dato.** "Cada aserción dice algo
  distinto" no quedó como comentario: se comprobó que falla exactamente una.

## What to improve

- **Una búsqueda de duplicación acotada a un archivo, sin decir que se acotó.**
  El `SHOULD` de e6.2 se ejecutó dentro de `catalog.coverage.test.ts` y la
  tercera copia estaba en `catalog.test.ts`. Lo encontró e6.3 al comparar el
  PRD con las pruebas, y hubo que arreglarlo fuera de su alcance. El alcance de
  una búsqueda es el repositorio; si se acota, se escribe.
- **El backlog llevaba tres épicas describiendo trabajo terminado.** Nadie lo
  notó porque nadie lo releyó contra el código: se leía para elegir la
  siguiente épica, no para comprobar si seguía siendo verdad.

## Learned

1. **About the system:** el catálogo y el modelo 3D son dos coberturas
   distintas, y confundirlas fue lo que hizo imposible la condición de
   lanzamiento. El catálogo cubre 206; el modelo, 199. Separarlo desbloqueó el
   lanzamiento sin tocar un solo dato. A escala de épica también se vio que la
   misma invariante estaba afirmada en tres planos sin referencias cruzadas, así
   que la redundancia solo era descubrible rompiendo el dato.

2. **About the process:** **una fila del backlog es una hipótesis escrita antes
   de hacer el trabajo, y envejece como cualquier plan.** Ésta describía E6 como
   contenido pendiente cuando el contenido estaba terminado desde E1, y sobrevivió
   intacta a E2, E3, E4 y E5. Empezar una épica leyendo su fila y no el código
   habría producido tres historias de trabajo inexistente. El gemba no es solo
   para diseñar: es para decidir **si la épica es la que dice ser**.

3. **Capability gained:** el producto se puede publicar. La condición de
   lanzamiento está escrita, decidida con sus alternativas registradas, y
   verificada por una prueba que el requisito cita por su nombre. "¿Podemos
   publicar?" se responde leyendo un párrafo y corriendo un comando.
