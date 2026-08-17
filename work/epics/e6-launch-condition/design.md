# Epic e6: Condición de lanzamiento — Design

## Gemba findings

Medido, no supuesto. El backlog describía E6 como "completar las 206 entradas
región por región"; ese trabajo **ya está hecho** y esta épica es otra cosa.

- **El catálogo tiene 206 entradas** y el reparto por región coincide con el
  desglose canónico. `src/data/catalog.coverage.test.ts` ya lo verifica y está
  en verde. → **nada que completar.**
- **199 entradas tienen geometría; 7 no** — los seis osículos del oído medio y
  el hioides, todas con `missingReason` escrito. → es lo único que separa al
  catálogo del observable literal de `RF-08`.
- **200 de 206 tienen sinónimos.** Las seis sin ellos son `húmero`, `radio` y
  `tibia` (dos lados cada uno): palabras sin sinónimo real, no huecos. → medido
  y descartado como trabajo.
- **`fma` está vacío en las 206**, pero es opcional por diseño (`bone.ts`:
  "cuando se conoce") y `RF-08` no lo pide. → no es un hueco.
- **La aplicación ya trata a los ausentes.** `BoneIdentity.tsx:66` muestra "No
  se puede señalar en el esqueleto." seguido de la razón, y
  `BoneNavigator.tsx:58` la muestra también. → e6.1 es **verificación**, no
  construcción; el riesgo es encontrar un sitio donde no se mire.
- **`pickTestableBone` ya los excluye** filtrando por `meshName !== null`, y su
  comentario explica por qué (un hueso ausente no puede resaltarse ni aislarse).
  → el modo test ya es coherente con la decisión.
- **El PRD y las pruebas afirman cosas distintas.** `RF-08` exige "toda entrada
  tiene una región gráfica existente"; las pruebas afirman "ancla 199 entradas"
  y "declara exactamente 7 ausencias". Nadie lo notó porque ninguna de las dos
  cita a la otra. → es el hallazgo que define la épica.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `records/decisions/adr-006-*.md` | create (hecho en este diseño) | Qué significa "catálogo completo" |
| `src/data/catalog.coverage.test.ts` | modify | Afirmar el criterio de ADR-006 en una aserción con nombre propio |
| `governance/prd.md` | modify | `RF-08` dice el observable que se ejecuta |
| `governance/backlog.md` | modify | La fila de E6 y la nota de secuencia describen la épica real |
| `src/components/BoneIdentity.tsx`, `BoneNavigator.tsx` | verify (modify solo si e6.1 encuentra un defecto) | Los ausentes, honestamente presentados |

## Key contracts

- **Una entrada de catálogo está completa con geometría o con razón, nunca sin
  ninguna de las dos.** Es el criterio de ADR-006 y la invariante que la prueba
  nueva afirma. El tipo `Bone` ya la hace imposible de violar en TypeScript —la
  unión `MappedBone | UnmappedBone`—, pero la prueba la afirma igual, porque el
  tipo protege al escribir y la prueba protege al leer el requisito.
- **El catálogo es de anatomía, no del activo 3D.** Los 206 huesos existen
  aunque el modelo dibuje 199. Ninguna historia puede quitar entradas para que
  las cuentas cierren.
- **`RF-08` y su prueba dicen lo mismo.** Es el objetivo de la épica, y también
  el criterio para saber si terminó.
- **Un hueso sin geometría nunca parece un error.** No es un estado degradado:
  es una entrada correcta que explica una ausencia del modelo.

## Decisions (ADRs)

- **ADR-006**: Una entrada con razón de ausencia documentada cuenta como
  catálogo completo — la condición de lanzamiento era imposible por
  construcción; "completo" se redefine como cobertura del catálogo, no del
  modelo, sin quitar ninguna entrada ni reabrir el activo 3D.
  `records/decisions/adr-006-what-complete-catalog-means.md`

## Legacy sweep

Posible: las pruebas `ancla 199 entradas a la geometría del modelo` y `declara
exactamente 7 ausencias, y todas con razón` pueden quedar redundantes cuando
exista la que afirma el criterio de ADR-006. **No se borran por defecto** — el
199 y el 7 son cifras que documentan el estado real del activo y valen como
detector de cambios silenciosos en el modelo. e6.2 decide, con las tres
delante, cuál dice algo que las otras no.
