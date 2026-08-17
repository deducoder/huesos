# Story e7.3: Tipografía empaquetada — Design

> Complexity: simple

## 1 · What & why

**Problem:** la aplicación no declara ninguna tipografía — usa la pila por
defecto de Tailwind — así que los títulos no tienen la voz que el rediseño
promete. Y la vía habitual de arreglarlo, Google Fonts, está prohibida por
construcción: `must-privacy-006` no admite ninguna petición de red en tiempo de
ejecución, con dos gates vigilándolo.

**Value:** los títulos pasan a tener carácter propio sin que la aplicación pida
nada a nadie, y la familia queda en un token: cambiarla después es una línea.

## 2 · Approach

Empaquetar **Fredoka 600** —el `.woff2` del subset `latin`, 16,4 KB— en
`public/fonts/`, declararla con `@font-face` desde el propio origen y exponerla
como el token `--font-display`, que solo consumen los títulos. El cuerpo sigue
con la pila del sistema, que no cuesta ninguna descarga.

**Por qué no hace falta subsetear a mano:** los `.woff2` que sirve Google Fonts
**ya vienen partidos por subset**, y el bloque `latin` cubre los 72 caracteres
del catálogo —comprobado, incluido el `—` (U+2014) y los ordinales `ª`/`º`—.
Instalar `fontTools` para reproducir un recorte que ya está hecho sería
andamiaje sin beneficio. La descarga ocurre **una vez, en desarrollo**; lo que
prohíbe el guardrail es la petición en tiempo de ejecución.

**Components affected:**

- `public/fonts/fredoka-latin-600.woff2`: create — 16,4 KB.
- `public/fonts/OFL.txt`: create — la licencia SIL Open Font License 1.1, que
  la propia licencia exige distribuir con el archivo.
- `src/index.css`: modify — el `@font-face` y el token `--font-display`.
- `src/App.tsx`: modify — el `h1` consume el token.
- `tests/typography.test.ts`: create — el gate de repertorio y de origen.

**Legacy sweep:** nada queda huérfano. No había declaración tipográfica que
sustituir; `--text-titulo`, que e7.1 dejó fijando solo tamaño, sigue haciendo
exactamente eso y ahora convive con la familia.

## 3 · Interface / examples

### La declaración

```css
/* src/index.css */
@font-face {
  font-family: 'Fredoka';
  src: url('/fonts/fredoka-latin-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC,
    U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@theme {
  --font-display: 'Fredoka', ui-sans-serif, system-ui, sans-serif;
}
```

Comprobado con el compilador de Tailwind 4.3.3 del proyecto: `--font-display`
emite la utilidad `font-display`. El `font-display: swap` dentro del
`@font-face` es otra cosa —una propiedad CSS— y no colisiona con ella.

```tsx
// src/App.tsx
<h1 className="font-display font-semibold text-titulo">huesos-mono</h1>
```

### El gate de repertorio

```ts
// tests/typography.test.ts
const RANGO_LATIN = [[0x0000, 0x00ff], [0x0131, 0x0131], /* … */ [0x2000, 0x206f]]

it('la fuente empaquetada cubre todo lo que el catálogo puede mostrar', () => {
  const sinGlifo = [...new Set(catalog.flatMap((h) => [h.es, h.la, ...h.synonyms]).join(''))]
    .filter((c) => !RANGO_LATIN.some(([a, b]) => c.codePointAt(0)! >= a && c.codePointAt(0)! <= b))
  expect(sinGlifo, 'caracteres del catálogo fuera del subset servido').toEqual([])
})
```

Salida esperada si alguien añade un hueso con un carácter fuera del subset:

```
Error: caracteres del catálogo fuera del subset servido
  - Expected: []
  + Received: [ "ș" ]
```

Y el control que exige el proyecto para toda aserción cuyo caso feliz es una
lista vacía: que el recorrido vea los 206 huesos, y que el filtro **reconozca**
un carácter fuera de rango cuando se le da uno.

### Lo que el guardrail ya vigila

`e2e/explore.spec.ts` falla ante cualquier petición fuera del propio origen y
`tests/privacy.test.ts` ante cualquier salida a la red en el fuente. Con la
fuente servida desde `/fonts/`, los dos siguen verdes sin tocarlos — que es
justamente la prueba de que empaquetarla funcionó.

## 4 · Acceptance criteria

- **Must:**
  1. `public/fonts/` contiene el `.woff2` y `OFL.txt`.
  2. El `h1` de la aplicación se dibuja con Fredoka, verificado en navegador
     comparando la familia computada, no a ojo.
  3. La prueba de privacidad de navegador sigue verde: cero peticiones a
     terceros con la fuente ya cargada.
  4. `tests/typography.test.ts` pasa, con su aserción de control.
  5. El archivo servido pesa **≤ 25 KB** — presupuesto declarado acá: es el
     orden del `.woff2` latin de las cinco candidatas medidas (13,5-18,6 KB), y
     deja margen sin invitar a crecer.
- **Should:**
  1. `font-display: swap`, para que el texto sea legible mientras la fuente
     llega en una conexión lenta.
- **Must NOT:**
  1. Ningún `@import` ni `<link>` a un CDN de fuentes.
  2. La display no se aplica al cuerpo: solo a títulos.
  3. No se añade `fontTools` ni ningún paso de build para subsetear — el
     archivo ya viene subseteado.

### Scenarios (delta over the scope)

```gherkin
Given el repertorio que el scope pedía cubrir «contra el catálogo real»
When se extraen los caracteres del catálogo de 206 huesos
Then son 72, y el único fuera de Latin-1 es `—` (U+2014), que el subset latin
     incluye — el riesgo de tofu en títulos era menor de lo que el scope temía

Given el fuente completo de `src/`, que sí contiene `→ ← ▸ ≈ ≠`
When se decide dónde se aplica la display
Then no importan: `▸` y las flechas viven en botones y navegación, que son
     cuerpo, y el cuerpo conserva la pila del sistema. El repertorio a cubrir
     depende de **dónde** se aplica la familia, no de todo lo que la aplicación
     escribe

Given la elección entre cinco candidatas OFL renderizadas con el texto real
When el usuario compara
Then Fredoka 600; Baloo 2 se descarta por registro más infantil, Nunito 900 por
     leerse como un bold de texto y no como display, Outfit 900 y Bakbak One por
     terminación plana frente al «muy redondeada» del brief
```
