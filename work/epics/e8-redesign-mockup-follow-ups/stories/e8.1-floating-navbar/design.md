# Story e8.1: Merged navbar — Design

> Complexity: simple

## 1 · What & why

**Problem:** `App.tsx` monta cabecera (título) y pestañas como dos filas
sólidas separadas, cada una con su propio borde — construido así en e7.1
sobre la dirección visual de ADR-007, nunca revisado desde entonces.

**Value:** una fila menos de alto fijo en cada pantalla — más lugar para
el contenido real (lienzo, fichas, preguntas) en un celular donde cada
pixel vertical cuenta.

## 2 · Approach

Fundir `<header>` y el componente `Pestanas` de `App.tsx` en un solo
elemento `<header>` con título y pestañas en la misma fila flex. Ambos
recortes de alcance decididos en `scope.md` (sin menú, sin flotante)
mantienen el cambio contenido a `App.tsx` — ningún otro archivo cambia.

**Components affected:**

- `src/App.tsx` (modify): `<header>` y `Pestanas` se funden en un solo
  componente/bloque; el título baja de `text-titulo` (1.75rem) a un
  tamaño que entre junto a las tres pestañas en 390px — medido, no
  asumido (ver riesgo abajo).
- `src/index.css` (modify, posible): `--text-titulo` queda sin
  consumidores si el título deja de usarlo — legacy sweep decide si se
  borra.

**Legacy sweep:** `--text-titulo` (token CSS en `src/index.css`) queda
huérfano si el título nuevo no lo usa — único consumidor hoy es la línea
que esta historia cambia. Se borra en la misma historia si termina sin
uso, no se deja como token fantasma.

## 3 · Interface / examples

### Usage

Sin cambio de API pública — `App` no expone props nuevas. El cambio es
interno a cómo se arma el JSX de la cabecera.

### Expected output (success + error)

```
// Antes (dos filas):
<header>huesos-mono</header>
<nav aria-label="Modo de estudio">[Explorar][Fichas][Test]</nav>

// Después (una fila):
<header>
  huesos-mono  [Explorar][Fichas][Test]
</header>
// (la pestañas siguen en su propio <nav aria-label="Modo de estudio">
// interno, para no perder el nombre accesible que ya prueban
// mobile-shell.spec.ts y App.test.tsx)
```

En modo `'ficha'`: solo el título, sin `<nav>` — igual que hoy
(`{modo.tipo !== 'ficha' && <Pestanas .../>}` se conserva, ahora
condicionando solo el bloque de pestañas dentro de la fila fusionada).

## 4 · Acceptance criteria

**Distinct from** el scope, que ya cubre lo observable. Delta de este
gemba:

**Must:**
- `nav[aria-label="Modo de estudio"]` sigue existiendo y su
  `getBoundingClientRect().bottom` sigue coincidiendo con el borde
  inferior real de la cabecera — **hallazgo del gemba**: si título y
  pestañas quedan centrados verticalmente (`items-center`) con alturas
  distintas, el más corto no toca el borde inferior de la fila, y
  `e2e/mobile-shell.spec.ts` ("el lienzo de Explorar ocupa toda la
  pantalla disponible") mide mal el alto disponible sin que
  `./scripts/check` lo vea (es un test de Playwright, no de vitest).
  Verificar con `items-stretch` o equivalente, medido en un navegador
  real, no asumido.
- El título sigue siendo `<h1>` con el texto "huesos-mono" y la
  tipografía `Fredoka` — `e2e/mobile-shell.spec.ts` ("el título usa la
  familia display empaquetada") no debe romperse.

**Should:**
- Ninguno más allá del scope.

**Must NOT:**
- No agregar ningún elemento de menú sin destino (scope.md).
- No usar `position: absolute`/`fixed` para la fila fusionada (scope.md).

### Scenarios (delta over the scope)

```gherkin
Given la fila fusionada con título y pestañas de distinta altura
When se mide el borde inferior de nav[aria-label="Modo de estudio"]
Then coincide con el borde inferior real de la cabecera —
  e2e/mobile-shell.spec.ts ya lo verifica, no hace falta un test nuevo,
  pero si falla es esta historia la que lo rompió, no el test que miente
```
