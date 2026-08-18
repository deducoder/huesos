# Story e9.5: Short names that stay distinguishable — Design

> Complexity: moderate

## 1 · What & why

**Problem:** el texto visible de un botón de hueso es hoy el `es` del catálogo
tal cual, en minúscula y con el lado pegado en masculino fijo. En la grilla de
Fichas de un teléfono eso da «falange proximal del segundo dedo de la mano
derecho» envuelto a **tres líneas** y mal escrito: 94 de los 172 huesos con
lado dicen «derecho» sobre un nombre femenino.

**Value:** quien estudia reconoce el hueso de un vistazo y lee un nombre bien
escrito, sin que ninguna etiqueta se confunda con otra ni se pierda el
discriminante que las separa.

## 2 · Approach

Una derivación pura de vista sobre el `es` del catálogo (ADR-014) con **una
sola regla de acortado** —el ordinal escrito en palabra pasa a cifra, y la
familia de las falanges elide «del … dedo de la»— más la capitalización
inicial; y un campo nuevo en el catálogo, `gender`, del que sale la
concordancia del lado.

**Components affected:**

- `src/data/bone.ts`: modify — `gender: 'm' | 'f'` obligatorio en `BoneCore`.
- `src/data/catalog.ts`: modify — el valor de `gender` en las 206 entradas.
  `es`, `la` y `synonyms` no se tocan.
- `src/components/bone-name.ts`: create — `shortName`, `sideLabel`,
  `visibleName` y `fullName`. **Se llama `bone-name`, no `short-name`** como
  proponía el design de la épica: el módulo también resuelve el lado
  concordado, que no es acortar nada.
- `src/components/bone-name.test.ts`: create — el gate sobre el catálogo real
  (techo, unicidad, instrumento vivo) y los casos de la derivación.
- `src/components/labels.ts`: modify — `SIDE_LABEL` se va; `REGION_LABEL` se
  queda intacto.
- `src/components/BoneNavigator.tsx`: modify — texto visible corto,
  `aria-label` explícito con el nombre completo.
- `src/components/FichasAccordion.tsx`: modify — ídem, más la capitalización
  de `subLabel`.
- `src/components/BoneIdentity.tsx`: modify — nombre visible y lado
  concordado (`:44`, `:63`, `:100`).
- `src/features/bone-detail/BoneSheet.tsx`: modify — título corto; el nombre
  completo del catálogo pasa a ser una fila más de la ficha.
- `src/features/test/TestQuestion.tsx`: modify — solo el **texto** de las tres
  opciones (`:152`) y el del hueso revelado (`:174`). El estado posterior a la
  respuesta es e9.2.
- `e2e/mobile-shell.spec.ts`: modify — `:191` localiza por texto visible.

**Legacy sweep:** quedan huérfanas y se borran las dos copias de
`accessibleName` (`BoneNavigator.tsx:7`, `FichasAccordion.tsx:17`) y la
constante `SIDE_LABEL` (`labels.ts:22`), cuyos tres consumidores migran al
módulo nuevo. Esto **corrige el scope**, que dejaba la unificación fuera: no
es prolijidad, es que la regla de concordancia no puede vivir en tres sitios.
ADR-011 protegía a `BoneNavigator` de un cambio que esta historia tiene que
hacer igual.

## 3 · Interface / examples

### Usage (API)

```ts
import { shortName, sideLabel, visibleName, fullName } from './bone-name'

const falange = catalog.find((b) => b.id === 'proximal-phalanx-2-hand-right')!
// { es: 'falange proximal del segundo dedo de la mano', side: 'right', gender: 'f', … }

shortName(falange.es)   // 'Falange proximal 2.º mano'
sideLabel('right', 'f') // 'derecha'
visibleName(falange)    // 'Falange proximal 2.º mano derecha'   ← el botón
fullName(falange)       // 'falange proximal del segundo dedo de la mano derecha'  ← el aria-label
```

### Expected output (success + error)

Los cuatro casos que la regla tiene que resolver, medidos sobre el catálogo:

```
'falange proximal del segundo dedo de la mano' → 'Falange proximal 2.º mano'
'duodécima vértebra torácica'                  → '12.ª vértebra torácica'
'segundo metatarsiano'                         → '2.º metatarsiano'
'cornete nasal inferior'                       → 'Cornete nasal inferior'   (sin ordinal: solo capitaliza)
```

El género del **ordinal** sale de la propia palabra, no del hueso —«primera
costilla» → «1.ª costilla», «primer metacarpiano» → «1.º metacarpiano»—, así
que la tabla de 17 formas lo resuelve entero. El género del **lado** no se
puede derivar y por eso viaja en el catálogo.

Simulada la regla sobre los 120 nombres únicos:

| Medida | Valor |
|--------|------:|
| Nombre corto más largo | **25** caracteres (`Falange proximal 5.º mano`) |
| Nombres cortos únicos | **120 de 120** — cero colisiones |
| Nombres que hoy pasan de 26 caracteres | 28 (todos falanges) |
| Nombres que la regla no toca (sin ordinal) | 45 de 120 — solo se capitalizan |

Sin caso de error: la derivación es total sobre `string`. Un nombre sin
ordinal pasa por la tabla sin cambiar. Lo que puede fallar es el **catálogo**,
y eso lo afirma el gate.

### Key data structures

```ts
// src/data/bone.ts
interface BoneCore {
  // …
  /**
   * Género gramatical de `es`. Lo necesita el lado, que concuerda con el
   * hueso: «clavícula derecha», «fémur derecho». No se puede derivar de la
   * terminación —«falange» es femenino y «cornete» masculino— ni del latín.
   */
  gender: 'm' | 'f'
}

// src/components/bone-name.ts
const ORDINALES: Record<string, string> = {
  primer: '1.º',  primera: '1.ª',  segundo: '2.º',  segunda: '2.ª',
  tercer: '3.º',  tercera: '3.ª',  cuarto:  '4.º',  cuarta:  '4.ª',
  quinto: '5.º',  quinta: '5.ª',   sexta:   '6.ª',  séptima: '7.ª',
  octava: '8.ª',  novena: '9.ª',   décima: '10.ª',  undécima: '11.ª',
  duodécima: '12.ª',
}

/** El techo: el nombre corto más largo del catálogo mide 25. */
export const TECHO_NOMBRE_CORTO = 26
```

## 4 · Acceptance criteria

- **Must:**
  1. `shortName` deriva los 120 nombres únicos del catálogo sin colisión y
     ninguno pasa de `TECHO_NOMBRE_CORTO`.
  2. El gate falla si la derivación deja de aplicarse — afirma que al menos un
     nombre del catálogo cambió al pasar por ella, no solo que la lista salió
     sin duplicados.
  3. El `aria-label` de todo botón de hueso lleva el `es` íntegro del catálogo
     más el lado concordado; el texto visible lleva el corto.
  4. Ningún hueso par muestra ni pronuncia el lado en el género equivocado, en
     ninguna de las cinco vistas.
  5. El nombre completo del catálogo sigue siendo legible en la ficha.
- **Should:**
  1. La grilla de Fichas no pasa de 2 líneas por etiqueta en 390 px.
  2. `subLabel` capitaliza «neurocráneo» y «cara», los dos subgrupos que hoy
     salen en minúscula.
- **Must NOT:**
  1. No se tocan `es`, `la` ni `synonyms`: `isCorrectAnswer` sigue validando
     contra el nombre completo (`RF-06`, `must-test-001`).
  2. Ningún nombre —corto o largo— llega al DOM del modo test antes de
     responder (`must-data-003`, `must-data-010`).
  3. Ningún literal anatómico nuevo se incrusta en `src/components`
     (`should-i18n-009`): la tabla de ordinales son palabras de la lengua, no
     nombres de huesos, y el género vive en el catálogo justamente por esto.
  4. El nombre accesible no se capitaliza — solo se le concuerda el lado.

### Scenarios (delta over the scope)

```gherkin
# CORREGIDO — el scope pedía «sin envolver a tres líneas» en todos los
# botones. Medido en 390 px: el botón de opción del test deja 86 px útiles y
# hasta «2.º metatarsiano» (16 caracteres) ocupa 3 líneas. Ahí manda el ancho
# de la columna, no el largo del nombre.
Given que respondo una pregunta de opción múltiple en un teléfono
When miro las tres opciones
Then ninguna pasa de 3 líneas — hoy la falange más larga ocupa 5
And bajar de ahí es el ancho de la grilla de opciones, que es e9.2

# AÑADIDO — el gemba encontró que las píldoras de lado del navegador componen
# su nombre accesible con `aria-labelledby`, que lee el texto visible. Acortar
# el visible acortaría también el accesible sin que nadie lo note.
Given una fila pareada del navegador de Explorar
When un lector de pantalla enfoca la píldora «derecha»
Then oye el nombre completo del catálogo y el lado, no el nombre corto

# AÑADIDO — el género entra en el nombre accesible, no solo en el visible.
Given los localizadores de la suite que buscan por nombre accesible exacto
When el lado pasa a concordar en género
Then ninguno se rompe, porque los seis usan huesos masculinos
     («fémur derecho», «hueso parietal derecho») — verificado, no supuesto
```

## 5 · Decisions

- **El género viaja en el catálogo, no en una tabla de la vista** — decisión
  con alternativas reales y consecuencias sobre las 206 entradas: **ADR-015**.
- **La forma corta de las falanges es «Falange proximal 2.º mano»** y **el
  ordinal en cifra se aplica a todas las familias** — elegidas por el humano
  sobre la muestra medida, como ADR-014 exige. La consistencia no es estética:
  «segundo metatarsiano derecho» ocupa 3 líneas en la grilla y «2.º
  metatarsiano derecho» ocupa 2.
- **El techo es 26 y no 30**: el catálogo derivado tope en 25, y un techo
  ajustado atrapa una regla futura que borre un discriminante. El catálogo
  está cerrado (ADR-006), así que no hay crecimiento legítimo que lo tense.

## 6 · Governance

- `should-i18n-009` (nombres anatómicos fuera de los componentes) es el que
  decide dónde vive el género — ver ADR-015.
- `must-a11y-005` (nombre accesible expuesto) y `must-data-002` (catálogo
  validado automáticamente) gobiernan el gate nuevo.
- `must-data-003` / `must-data-010` acotan lo que puede cambiarse en
  `TestQuestion`: el texto de las opciones, nada más.
