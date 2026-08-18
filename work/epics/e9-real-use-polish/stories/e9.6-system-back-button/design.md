# Story e9.6: The system back button walks the app — Design

> Complexity: moderate

## 1 · What & why

**Problem:** `App.tsx` navega con un `useState<Modo>` y nunca empuja una
entrada de historial, así que el navegador tiene una sola y el «atrás» del
teléfono abandona el sitio. No es un defecto de ningún componente: es la
consecuencia no anticipada de ADR-003.

**Value:** en un teléfono, «atrás» es el gesto de salida principal — quien
abre una ficha lo usa antes de buscar un botón. Hoy pierde la sesión de
estudio entera; después, vuelve a la vista anterior.

## 2 · Approach

Cada transición de modo empuja una entrada de historial que lleva el `Modo`
de destino en su `state`, y un escucha de `popstate` restituye el que la
entrada trae (ADR-013). Los dos botones que ya significan «atrás»
—«← Volver» y «← cambiar modo»— retroceden en el historial en vez de
empujar.

**Components affected:**

- `src/App.tsx`: modify — una función `navegar` como único punto de
  transición, un `useEffect` con el escucha de `popstate`, un predicado
  `esModo` para validar lo que llega, y los dos botones de retroceso
  pasando por `history.back()`.

Sin archivos nuevos. La escalera se detiene en el primer peldaño: la
plataforma ya resuelve el historial, y un hook propio o un módulo de
navegación serían envoltorio sobre dos llamadas —el proyecto no tiene hoy
ni un solo hook propio, y este no gana su excepción.

**Legacy sweep:** **el campo `origen` del modo `ficha` queda huérfano.**
Existe (`App.tsx:25`) para que «← Volver» sepa a dónde regresar, y es su
único lector (`App.tsx:252`). Cuando ese botón pase a `history.back()`, la
entrada anterior del historial ya es el origen por construcción —a `ficha`
solo se llega empujando desde `explorar` o desde `fichas`— y el campo deja
de leerse. Se elimina del tipo y de sus tres sitios de escritura en esta
misma historia; dejarlo sería dato muerto viajando dentro de cada entrada.

## 3 · Interface / examples

### Usage

```tsx
// Un único punto de transición. Reemplaza los seis `setModo` sueltos.
const navegar = (siguiente: Modo) => {
  history.pushState(siguiente, '')   // sin tercer argumento: la URL no cambia
  setModo(siguiente)
}

// Los botones que ya significaban «atrás» retroceden, no empujan.
<button onClick={() => history.back()}>← Volver</button>

// El escucha, registrado una vez.
useEffect(() => {
  const alRetroceder = (evento: PopStateEvent) => {
    setModo(esModo(evento.state) ? evento.state : modoInicial())
  }
  window.addEventListener('popstate', alRetroceder)
  return () => window.removeEventListener('popstate', alRetroceder)
}, [])
```

### Expected output (success + error)

```
CAMINO FELIZ
  Fichas → ficha del fémur          history: [explorar, fichas, ficha]
  «atrás» del sistema               → Fichas          (sigue en el sitio)

  Explorar → ficha del fémur        history: [explorar, ficha]
  «atrás» del sistema               → Explorar        (no Fichas)
  y el fémur sigue con aria-pressed="true"

  Test → esqueleto completo         history: [explorar, test-elegir, test-esqueleto]
  «atrás» del sistema               → elegir variante

CAMINOS DE ERROR
  Explorar recién cargada           history: [explorar]
  «atrás» del sistema               → abandona el sitio. Correcto: el
                                      historial propio está agotado y no
                                      se secuestra.

  popstate con un state que no es un Modo
  (otra aplicación en el mismo origen, una entrada de una versión
   anterior tras un despliegue)
                                    → cae a Explorar, igual que una
                                      recarga. Nunca se ignora en silencio
                                      dejando la vista desincronizada del
                                      historial.
```

### Key data structures

```ts
// `origen` desaparece — ver el legacy sweep.
type Modo =
  | { tipo: 'explorar' }
  | { tipo: 'fichas' }
  | { tipo: 'ficha'; boneId: string }
  | { tipo: 'test-elegir' }
  | { tipo: 'test-esqueleto' }
  | { tipo: 'test-hueso' }

/**
 * `PopStateEvent.state` es `any` por definición del DOM, y `must-type-004`
 * prohíbe `as` para silenciar el compilador. Se valida la forma en tiempo
 * de ejecución, mismo patrón que `esProgresoDeHueso` ya aplica en
 * `src/storage/progress-store.ts` a lo que viene de `localStorage`.
 */
function esModo(valor: unknown): valor is Modo

/**
 * Una función, no una constante de módulo: un objeto compartido devuelto
 * como estado inicial convierte en global cualquier mutación futura.
 */
function modoInicial(): Modo
```

## 4 · Acceptance criteria

- **Must:** `esModo` valida lo que llega en `popstate` sin `as` ni `any`, y
  un `state` ajeno o de una versión anterior cae a Explorar en vez de dejar
  la vista desincronizada del historial (`must-type-004`).
- **Must:** el campo `origen` no existe ni en el tipo `Modo` ni en ningún
  sitio de escritura; el comportamiento que sostenía —volver de una ficha
  a Fichas y no a Explorar— sigue verificado por su test actual.
- **Must:** «← Volver» y «← cambiar modo» retroceden en el historial; tras
  usarlos, el «atrás» del sistema no reentra a la vista abandonada.
- **Must:** la URL no cambia en ninguna transición — `pushState` sin tercer
  argumento. Nada de rutas que mantener (ADR-013).
- **Must:** verificado con `page.goBack()` en Playwright y a mano en el
  teléfono por el túnel. El verde de vitest no cierra esta historia.
- **Should:** el `useEffect` registra el escucha una sola vez y lo retira al
  desmontar, sin dependencias que lo re-registren.
- **Must NOT:** no se secuestra la primera entrada. Desde Explorar recién
  cargada, «atrás» abandona el sitio — la corrección es salir *desde una
  ficha*, no impedir salir nunca.
- **Must NOT:** la selección de hueso no viaja en el `state` de la entrada
  (ADR-013): vive en `App` desde e3.2 para sobrevivir al ida y vuelta.
- **Must NOT:** ninguna petición de red nueva (`must-privacy-006`). La
  History API es local; el gate de `tests/privacy-runtime.test.tsx` sigue
  en verde sin tocarlo.

### Scenarios (delta over the scope)

```gherkin
Given que el navegador entrega en `popstate` un `state` que no es un Modo
  # p. ej. una entrada escrita por una versión anterior tras un despliegue
When la aplicación lo recibe
Then vuelve a Explorar, igual que ante una recarga, en vez de quedar con la
  vista desincronizada de la entrada del historial
```

## 5 · Riesgos de ejecución

- **jsdom comparte `window.history` entre pruebas del mismo archivo.** Los
  once casos de `App.test.tsx` empezarán a empujar entradas, y una prueba
  que retroceda leerá la pila que dejó la anterior. Hay que aislarlo, y una
  prueba que pase por casualidad de orden es peor que ninguna — el caso
  feliz aquí puede dar verde con el instrumento roto.
- **`history.back()` es asíncrono también en jsdom.** El test actual
  `«Volver» desde una ficha abierta en "Fichas" regresa a la lista` sigue
  siendo válido en comportamiento, pero su aserción síncrona posterior al
  clic puede necesitar esperar al `popstate`.
- El dev server y su túnel están vivos y se dejan así: la comprobación
  manual va por ahí, sin reiniciar nada.
